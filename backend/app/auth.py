from datetime import datetime, timedelta
from uuid import uuid4
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

from .database import SessionLocal
from . import models

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY não definido no .env")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def criar_token_acesso(data: dict, minutos: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=minutos)
    jti = str(uuid4())
    to_encode.update({"exp": expire, "jti": jti})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def _token_esta_revogado(jti: str) -> bool:
    db = SessionLocal()
    try:
        return db.query(models.TokenRevogado).filter(models.TokenRevogado.jti == jti).first() is not None
    finally:
        db.close()

def verificar_token(token: str = Depends(oauth2_scheme)) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        jti = payload.get("jti")
        if not user_id or not jti:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

        if _token_esta_revogado(jti):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revogado. Faça login novamente.")

        return int(user_id)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado ou inválido")




    