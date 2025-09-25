import Header from "../../components/Header";
import "./home.css";

export default function HomePage() {
  return (
    <div className="home-container">
      <Header />

      <main className="home-content">
        <h2>Filmes em alta</h2>
      </main>
    </div>
  );
}
