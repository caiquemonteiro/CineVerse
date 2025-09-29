import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Hello World</h1>
      <p>Bem-vindo à HomePage de teste!</p>
      <button onClick={() => navigate('/movie/1')}>
        IR PARA TELA DE MOVIES
      </button>
    </div>
  );
}
