from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm  # 🔧 NOVO: form padrão OAuth2
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import date
from .database import engine, SessionLocal
from . import models, schemas
from sqlalchemy import func
from .auth import criar_token_acesso, verificar_token

app = FastAPI(title="CineVerse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
@app.post("/usuarios", response_model=schemas.UsuarioOut)
def criar_usuario(payload: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(models.Usuario).filter(models.Usuario.email == payload.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    
    data = payload.model_dump()
    data["senha"] = payload.senha

    obj = models.Usuario(**data)
    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar usuário.")
    return obj

@app.get("/usuarios", response_model=List[schemas.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = form_data.username      # novo
    senha = form_data.password

    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not user or senha != user.senha:

        raise HTTPException(status_code=400, detail="E-mail ou senha inválidos.")
    
    token = criar_token_acesso(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "usuario_id": user.id, "nome": user.nome}

# TESTA O TOKEN
@app.get("/usuarios/me")
def usuario_atual(user_id: str = Depends(verificar_token), db: Session = Depends(get_db)):
    # 🔧 SQLAlchemy 2.0: use db.get em vez de query(...).get(...)
    usuario = db.get(models.Usuario, int(user_id))
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}

#  AVALIAÇÕES 
@app.post("/avaliacoes", response_model=schemas.AvaliacaoOut)
def criar_avaliacao(
    payload: schemas.AvaliacaoCreate,
    user_id: str = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    data = payload.model_dump()
    data["data"] = date.today()
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
    return {"media": float(round(media, 2))}
