# app/schemas.py
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from typing import Optional
from datetime import date

# ========= USUÁRIO =========

class UsuarioCreate(BaseModel):
    nome: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    senha: str  # em produção, use hash

    # normaliza e-mail para minúsculas (antes da validação)
    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v):
        if v is None:
            return v
        return str(v).strip().lower()

class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class UsuarioPublic(BaseModel):
    id: int
    nome: str
    model_config = ConfigDict(from_attributes=True)

# ========= AVALIAÇÃO =========

class AvaliacaoCreate(BaseModel):
    codfilme: int
    nota: float = Field(..., ge=0, le=10)
    comentario: Optional[str] = Field(None, max_length=500)
    usuario_id: Optional[int] = None
    data: Optional[date] = None

class AvaliacaoOut(BaseModel):
    id: int
    codfilme: int
    nota: float
    comentario: Optional[str] = None
    data: date
    usuario_id: int
    usuario: Optional[UsuarioPublic] = None
    model_config = ConfigDict(from_attributes=True)




    

