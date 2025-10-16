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

export const login = (loginData) => {
  return fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(loginData),
  });
};

export const logout = (token) => {
  return fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAvaliacoes = (codfilme, token) => {
  return fetch(`${BASE_URL}/avaliacoes/${codfilme}`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export const criarAvaliacao = (avaliacaoData, token) => {
  return fetch(`${BASE_URL}/avaliacoes`, {
    method: "POST",
    headers,
    Authorization: `Bearer ${token}`,
    body: JSON.stringify(avaliacaoData),
  });
};

export const getMediaAvaliacoes = (codfilme, token) => {
  return fetch(`${BASE_URL}/avaliacoes/media/${codfilme}`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
};