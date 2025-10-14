import axios from "axios";

export async function login(email, senha) {
  try {
    const response = await axios.post("http://localhost:8000/login", {
      username: email,
      password: senha,
    });
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
}

