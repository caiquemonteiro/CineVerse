import { API_KEY } from "../../utils/constants";
import { useEffect, useState } from "react";
import { Row, Col, Spin, } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./home.css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => setMovies(json.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <Header />

      <main className="home-content">
        <h2>Filmes em alta</h2>
        {movies.length > 0 ?

          <Row gutter={[12, 10]}>
            {movies.map((movie) => (
              
              <Col key={movie.id}
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={3}
              >

                <img 
                  className="movie-cover" 
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=Imagem+indisponível"} 
                  onClick={()=>navigate(`/movie/${movie.id}`)} 
                />
              </Col>
            ))}
          </Row>
          
          : <div className="spin">
              <Spin tip="Loading" size="large"/>
            </div>
        }
      </main>
    </div>
  );
}
