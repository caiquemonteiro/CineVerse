from sqlalchemy import ( Column, Integer, String, Date, Numeric, ForeignKey, CheckConstraint, DateTime
)
from sqlalchemy.orm import relationship
from datetime import date
from .database import Base

class Usuario(Base):
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False, unique=True)  # único no banco
    senha = Column(String(255), nullable=False)

    avaliacoes = relationship(
        "Avaliacao", back_populates="usuario", cascade="all,delete-orphan"
    )

class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, index=True)
    codfilme = Column(Integer, nullable=False)
    nota = Column(Numeric(10, 2), nullable=False)
    comentario = Column(String(500))
    data = Column(Date, nullable=False, default=date.today)

    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    usuario = relationship("Usuario", back_populates="avaliacoes")

    __table_args__ = (
        CheckConstraint("nota >= 0 AND nota <= 10", name="ck_avaliacao_nota_0_10"),
    )

class TokenRevogado(Base):
    __tablename__ = "tokens_revogados"

    id = Column(Integer, primary_key=True, index=True)
    jti = Column(String(36), unique=True, index=True, nullable=False)
    exp = Column(DateTime, nullable=False)





