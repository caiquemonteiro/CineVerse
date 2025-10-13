const BASE_URL = "http://localhost:8000";
const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
};

export const getUsuarios = () => {
  return fetch(`${BASE_URL}/usuarios`, {
    method: "GET",
    headers,
  });
};

export const criarUsuario = (usuarioData) => {
  return fetch(`${BASE_URL}/usuarios`, {
    method: "POST",
    headers,
    body: JSON.stringify(usuarioData),
  });
};

export const loginUsuario = (loginData) => {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(loginData),
  });
};


export const getAvaliacoes = () => {
  return fetch(`${BASE_URL}/avaliacoes`, {
    method: "GET",
    headers,
  });
};

export const criarAvaliacao = (avaliacaoData) => {
  return fetch(`${BASE_URL}/avaliacoes`, {
    method: "POST",
    headers,
    body: JSON.stringify(avaliacaoData),
  });
};

export const getMediaAvaliacoes = () => {
  return fetch(`${BASE_URL}/avaliacoes/media`, {
    method: "GET",
    headers,
  });
};