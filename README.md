# 🍿 CineVerse

Projeto final do NExT2025

Catálogo de filmes e séries construído com **React (Vite)** no frontend e **FastAPI** no backend.  
A aplicação roda via **Docker Compose**, facilitando o setup e execução.

**Time:**
- André de Queiroz Correia
- Eduardo José Chagas Coelho
- Gean Carlo Dantas de Brito
- Ricardo Rodrigues Rocha
- Victor Julius Bezerra

**Mentor:**
- Caíque de Araújo Monteiro

---

## 🚀 Tecnologias

- [React + Vite](https://vitejs.dev/) — Frontend
- [FastAPI](https://fastapi.tiangolo.com/) — Backend
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) — Orquestração

---

## 📂 Estrutura do projeto

CineVerse/ \
└─ backend/ # FastAPI \
└─ frontend/ # React + Vite

---

## ▶️ Como rodar o projeto

### Pré-requisitos
- Docker e Docker Compose instalados

### Passos

1. Clone este repositório:
   ```bash
   git clone https://github.com/caiquemonteiro/CineVerse.git
   cd CineVerse

2. Suba os containers:
   ```bash
   docker compose up --build

3. Acesse a aplicação:

   - Frontend: http://localhost:3000

   - Backend: http://localhost:8000

   - Docs da API (Swagger): http://localhost:8000/docs

---

## 🛠️ Comandos úteis

  - Parar os containers:
    ```bash
    docker compose down

  - Rebuild do projeto:
    ```bash
    docker compose up --build
