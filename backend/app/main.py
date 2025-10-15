from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import date, datetime
from jose import jwt
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func
from fastapi import status


from .database import engine, SessionLocal
from . import models, schemas
from .auth import (
    criar_token_acesso, verificar_token, oauth2_scheme, SECRET_KEY, ALGORITHM
)

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

# USUÁRIO

@app.post("/usuarios", response_model=schemas.UsuarioOut)
def criar_usuario(payload: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    email_norm = str(payload.email).strip().lower()
    if db.query(models.Usuario).filter(func.lower(models.Usuario.email) == email_norm).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    data = payload.model_dump()
    data["email"] = email_norm
    data["senha"] = payload.senha  # em produção, faça hash

    obj = models.Usuario(**data)
    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar usuário.")

@app.get("/usuarios", response_model=List[schemas.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

# LOGIN

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = str(form_data.username).strip().lower()
    senha = form_data.password

    user = db.query(models.Usuario).filter(func.lower(models.Usuario.email) == email).first()
    if not user or senha != user.senha:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail ou senha inválidos.")

    token = criar_token_acesso(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario_id": user.id,
        "nome": user.nome,
        "email": user.email
    }


@app.get("/usuarios/me")
def usuario_atual(current_user_id: int = Depends(verificar_token), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == current_user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"id": usuario.id, "nome": usuario.nome, "email": usuario.email}

# AVALIAÇÕES

@app.post("/avaliacoes", response_model=schemas.AvaliacaoOut, status_code=201)
def criar_avaliacao(
    payload: schemas.AvaliacaoCreate,
    current_user_id: int = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    
    obj = models.Avaliacao(
        codfilme=payload.codfilme,
        nota=payload.nota,
        comentario=payload.comentario,
        usuario_id=current_user_id, 
        data=date.today(),
    )

    try:
        db.add(obj)
        db.commit()
        obj = (
            db.query(models.Avaliacao)
            .options(joinedload(models.Avaliacao.usuario))
            .filter(models.Avaliacao.id == obj.id)
            .one()
        )
        return obj
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar avaliação.")

@app.get("/avaliacoes/{codfilme}", response_model=List[schemas.AvaliacaoOut])
def listar_avaliacoes(
    codfilme: int,
    current_user_id: int = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    avals = (
        db.query(models.Avaliacao)
        .options(joinedload(models.Avaliacao.usuario))
        .filter(models.Avaliacao.codfilme == codfilme)
        .all()
    )

    if not avals:
        raise HTTPException(
            status_code=404,
            detail=f"Nenhuma avaliação encontrada para o filme {codfilme}."
        )

    return avals

@app.get("/avaliacoes/media/{codfilme}")
def media_notas(
    codfilme: int,
    current_user_id: int = Depends(verificar_token),
    db: Session = Depends(get_db)
):
    media = (
        db.query(func.avg(models.Avaliacao.nota))
        .filter(models.Avaliacao.codfilme == codfilme)
        .scalar()
    )

    if media is None:
        return {"mensagem": f"Nenhuma avaliação encontrada para o filme {codfilme}."}

    return {"media": float(round(media, 2))}

# LOGOUT

@app.post("/logout")
def logout(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise HTTPException(status_code=400, detail="Token inválido para logout.")

    jti = payload.get("jti")
    exp = payload.get("exp")
    if not jti or not exp:
        return {"detail": "Token legado sem JTI/EXP. Faça login novamente para poder revogar."}

    if isinstance(exp, (int, float)):
        exp_dt = datetime.utcfromtimestamp(exp)
    else:
        exp_dt = exp

    if not db.query(models.TokenRevogado).filter(models.TokenRevogado.jti == jti).first():
        db.add(models.TokenRevogado(jti=jti, exp=exp_dt))
        db.commit()

    return {"detail": "Logout efetuado. Este token foi revogado."}





