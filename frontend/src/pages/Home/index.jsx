import { useState, useEffect } from "react";
import { Row, Col, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import noImage from "../../assets/img-indisponivel.png"; 
import { getPopularMovies, getTopRatedMovies } from "../../api/tmdb.api";
import "./home.css";
 
export default function HomePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPopularMovies()
      .then((res) => res.json())
      .then((json) => setPopularMovies(json.results))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar os filmes');
      });

    getTopRatedMovies()
      .then((res) => res.json())
      .then((json) => setTopRatedMovies(json.results))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar os filmes mais bem avaliados');
      });
  }, []);

  return (
    <div className="home-container">
      {contextHolder}

      <Header />
      
      <main className="home-content">
        <h2>
          Filmes em alta
        </h2>

        {popularMovies.length > 0 ?

          <Row gutter={[15, 15]}>
            {popularMovies.map((movie) => (
              
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <img 
                  className="movie-cover" 
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : noImage} 
                  onClick={()=>navigate(`/movie/${movie.id}`)}
                  onError={(e) => (e.target.src = noImage)}
                  alt={movie.title}
                />
              </Col>
            ))}
          </Row>
          
          : <div className="spin">
              <Spin size="large"/>
            </div>
        }
        
        <h2 style={{ marginTop: 80}}>
          Filmes mais bem avaliados
        </h2>

        {topRatedMovies.length > 0 ?

          <Row gutter={[15, 15]}>
            {topRatedMovies.map((movie) => (

              <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <img
                  className="movie-cover"
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : noImage}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  onError={(e) => (e.target.src = noImage)}
                  alt={movie.title}
                />
              </Col>
            ))}
          </Row>

          : <div className="spin">
              <Spin size="large" />
            </div>
        }
      </main>
    </div>
  );
}