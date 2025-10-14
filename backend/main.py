from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import date
from app.database import engine, SessionLocal
from app import models, schemas
from sqlalchemy import func
from app.auth import criar_token_acesso, verificar_token, hash_password, verify_password 

app = FastAPI(title="CineVerse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria as tabelas no banco de dados, se não existirem
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# HOME 
@app.get("/")
def home():
    return {"ok": True, "service": "CineVerse API"}

# USUÁRIOS 
@app.post("/usuarios", response_model=schemas.UsuarioOut, status_code=status.HTTP_201_CREATED)
def criar_usuario(payload: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # 1. Verifica se o e-mail já está cadastrado
    if db.query(models.Usuario).filter(models.Usuario.email == payload.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    
    # 2. Gera o hash da senha antes de salvar
    hashed_password = hash_password(payload.senha) 
    
    data = payload.model_dump()
    data["senha"] = hashed_password 
    
    obj = models.Usuario(**data)
    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
    except Exception:
        db.rollback()
        # É bom logar o erro aqui em um ambiente real
        raise HTTPException(status_code=500, detail="Erro ao salvar usuário.")
    return obj

@app.get("/usuarios", response_model=List[schemas.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username
    plain_password = form_data.password

    # 1. Busca o usuário pelo e-mail
    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    
    # 2. Verifica se o usuário existe E se a senha fornecida bate com o hash salvo
    if not user or not verify_password(plain_password, user.senha): 
        raise HTTPException(status_code=400, detail="E-mail ou senha inválidos.")
    
    # 3. Cria o token de acesso
    token = criar_token_acesso(data={"sub": str(user.id)})
    
    return {"access_token": token, "token_type": "bearer", "usuario_id": user.id, "nome": user.nome}

# TESTA O TOKEN
@app.get("/usuarios/me")
def usuario_atual(user_id: str = Depends(verificar_token), db: Session = Depends(get_db)):
    # Busca o usuário pelo ID
    usuario = db.get(models.Usuario, int(user_id))
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}

# AVALIAÇÕES 
@app.post("/avaliacoes", response_model=schemas.AvaliacaoOut, status_code=status.HTTP_201_CREATED)
def criar_avaliacao(
    payload: schemas.AvaliacaoCreate,
    user_id: str = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    data["data"] = date.today()
    
    # Garante que o usuário logado é o autor da avaliação
    if not data.get("usuario_id"):
        data["usuario_id"] = int(user_id)

    obj = models.Avaliacao(**data)
    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar avaliação.")
    return obj

@app.get("/avaliacoes", response_model=List[schemas.AvaliacaoOut])
def listar_avaliacoes(db: Session = Depends(get_db)):
    # Faz um JOIN para carregar o usuário junto com a avaliação (otimização)
    avals = db.query(models.Avaliacao).options(joinedload(models.Avaliacao.usuario)).all()
    return avals

# MÉDIAS DAS NOTAS 
@app.get("/avaliacoes/media")
def media_notas(codfilme: int, db: Session = Depends(get_db)):
    media = (
        db.query(func.avg(models.Avaliacao.nota))
        .filter(models.Avaliacao.codfilme == codfilme)
        .scalar()
    )
    if media is None:
        return {"mensagem": f"Nenhuma avaliação encontrada para o filme {codfilme}."}
    
    # Arredonda a média para duas casas decimais
    return {"media": float(round(media, 2))}