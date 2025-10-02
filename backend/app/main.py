from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import engine, SessionLocal
from . import models, schemas

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
    if not data.get("senha"):              
        data["senha"] = "12345"            

    obj = models.Usuario(**payload.model_dump())
    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar usuário.")
    return obj

@app.get("/usuarios", response_model=List[schemas.UsuarioOut])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

#  AVALIAÇÕES 
@app.post("/avaliacoes", response_model=schemas.AvaliacaoOut)
def criar_avaliacao(payload: schemas.AvaliacaoCreate, db: Session = Depends(get_db)):
    obj = models.Avaliacao(**payload.model_dump())
    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao salvar avaliação.")
    return obj

@app.get("/avaliacoes", response_model=List[schemas.AvaliacaoOut])
def listar_avaliacoes(db: Session = Depends(get_db)):
    return db.query(models.Avaliacao).all()

