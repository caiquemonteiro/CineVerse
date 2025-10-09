import { useEffect } from "react";
import { Row, Col, Spin, } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useMoviesStore from "../../stores/moviesStore";
import noImage from "../../assets/img-indisponivel.png";
import { getPopularMovies } from "../../api/tmdb.api";
import "./home.css";

export default function HomePage() {
  const { movies, setMovies, moviesSearch } = useMoviesStore();
  const navigate = useNavigate();

  useEffect(() => {
    getPopularMovies()
      .then((res) => res.json())
      .then((json) => setMovies(json.results))
      .catch((err) => console.error(err)); // TODO: Exibir menssagem de erro com o componente Message do AntDesign
  }, []);

  return (
    <div className="home-container">
      <Header />

      {/* TODO: Adicionar componente de BreadCrumb do AntDesign */}

      <main className="home-content">
        <h2>
          {moviesSearch ? `Buscando por: ${moviesSearch}` : "Filmes em alta"}
        </h2>

        {movies.length > 0 ?

          <Row gutter={[15, 15]}>
            {movies.map((movie) => (
              
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
        
        {/* TODO: Utilizar o endpoint topRated do TMDB para exibir os filmes mais bem avaliados */}
      </main>
    </div>
  );
}