from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import date

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: Optional[str] = None  

class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: str   
    model_config = ConfigDict(from_attributes=True)


class AvaliacaoCreate(BaseModel):
    codfilme: int
    nota: Optional[float] = None
    comentario: Optional[str] = None
    data: Optional[date] = None
    usuario_id: Optional[int] = None

    @field_validator("usuario_id", mode="before")
    @classmethod
    def zero_to_none(cls, v):
        if v in (0, "0", "", None):
            return None
        return v

class AvaliacaoOut(BaseModel):
    id: int
    codfilme: int
    nota: Optional[float] = None
    comentario: Optional[str] = None
    data: Optional[date] = None
    usuario_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


