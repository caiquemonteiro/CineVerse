from sqlalchemy import Column, Integer, String, Text, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from .database import Base


class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(30), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    senha = Column(String(255), nullable=False)

    avaliacoes = relationship(
        "Avaliacao", back_populates="usuario", cascade="all,delete-orphan"
    )


class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, index=True)
    codfilme = Column(Integer, nullable=False)
    nota = Column(Numeric(10, 2), nullable=False)
    comentario = Column(Text, nullable=False)
    data = Column(Date, nullable=False, default=date.today)

    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="avaliacoes")
