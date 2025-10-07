from pydantic import BaseModel, ConfigDict, field_validator
from typing import Optional
from datetime import date

class UsuarioCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: str   
    model_config = ConfigDict(from_attributes=True)

class UsuarioPublic(BaseModel):   # acrescentei essa classe para interagir com AvalicaoOut e puxar o nome do usuario que fez o comentario
    id: int
    nome: str
    model_config = ConfigDict(from_attributes=True)

class AvaliacaoCreate(BaseModel):
    codfilme: int
    nota: float
    comentario: str
    usuario_id: int
    data: date | None = None

    @field_validator("usuario_id", mode="before")
    @classmethod
    def zero_to_none(cls, v):
        if v in (0, "0", "", None):
            return None
        return v

class AvaliacaoOut(BaseModel):
    id: int
    codfilme: int
    nota: float
    comentario: str
    data: date
    usuario_id: int
    usuario: Optional[UsuarioPublic] = None
    model_config = ConfigDict(from_attributes=True)

    

