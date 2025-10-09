import { useParams } from "react-router-dom";
import { Tag, Button, Modal, Flex, Rate, Input, Divider, Spin } from "antd";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import metacriticLogo from "../../assets/metacritic.png";
import rotten_tomatoesLogo from "../../assets/rotten_tomatoes.png";
import IMDbLogo from "../../assets/IMDb.png";
import ReviewComponent from "../../components/Review";
import { EditOutlined, HeartFilled } from "@ant-design/icons";
import { getMovieDetails, getMovieCredits } from "../../api/tmdb.api";
import { getReleaseYear, getMovieDirector, getImdbRating, getMovieRuntime, getMovieDescription } from "../../utils" 
import { getMovieRatings } from "../../api/omdb.api";
import "./movie.css";

export default function MoviePage() {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { id } = useParams();
  const { TextArea } = Input;

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id)
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((err) => console.error(err)) // TODO: Exibir menssagem de erro com o componente Message do AntDesign
      .finally(() => setLoading(false))
    
      getMovieCredits(id)
      .then((res) => res.json())
      .then((json) => setCredits(json))
      .catch((err) => console.error(err)); // TODO: Exibir menssagem de erro com o componente Message do AntDesign
  }, [id]);

  useEffect(() => {
    if (movie && movie.imdb_id) {
      getMovieRatings(movie.imdb_id)
        .then((res) => res.json())
        .then((json) => setRatings(json.Ratings))
        .catch((err) => console.error(err)); // TODO: Exibir menssagem de erro com o componente Message do AntDesign
    }
  }, [movie]);

  const getRatingBySource = (ratings, source) => {
    const rating = ratings?.find((r) => r.Source === source);
    return rating ? rating.Value : "N/A";
  };

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  if (!movie) return <p>Filme não encontrado</p>;

  return (
    <div className="movie-container">
      <Header />

      <main className="movie-content">
        <img
          className="movie"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=Imagem+indisponível"
          }
          alt={movie.title}
        />

        <div className="movie-details">
          <h1 className="movie-title">
            {movie.title} {movie.release_date && <span className="movie-year">({getReleaseYear(movie.release_date)})</span>}
          </h1>

          <p className="description">{getMovieDescription(movie.overview)}</p>

          <p><strong>Diretor:</strong> {getMovieDirector(credits)}</p>

          <p><strong>Duração:</strong> {getMovieRuntime(movie.runtime)}</p>

          {movie.genres.map((genre) => (
            <Tag key={genre.id} className="genre-tag">
              {genre.name}
            </Tag>
          ))}

          <div className="ratings">
            <HeartFilled style={{ color: "#CF1322", fontSize: 35, marginRight: 4 }} />
            <span className="heart-score"> {movie.vote_average?.toFixed(1)}</span>

            <img src={IMDbLogo} alt="IMDb" style={{ width: "40px", height: "auto" }} />
            <span className="imdb-score">{getRatingBySource(ratings, "Internet Movie Database")}</span>

            <img src={metacriticLogo} alt="Metacritic" style={{ width: "40px", height: "auto" }} />
            <span className="metacritic-score">{getRatingBySource(ratings, "Metacritic")}</span>

            <img src={rotten_tomatoesLogo} alt="Rotten Tomatoes" style={{ width: "40px", height: "auto" }} />
            <span className="rotten_tomatoes-score">{getRatingBySource(ratings, "Rotten Tomatoes")}</span>


            {/* // TODO: Adicionar notas do Rotten Tomatoes e Metacritic */}
          </div>

          <div className="reviews-header">
            <h2>Avaliações</h2>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="review-button"
              onClick={() => setIsModalOpen(true)}
            >
              Avaliar Filme
            </Button>

            {/* TODO: Transformar este formulário em um componente separado */}
            <Modal
              title="Avaliar Filme"
              open={isModalOpen}
              onOk={() => {}}
              onCancel={() => setIsModalOpen(false)}
              okText="Avaliar"
              cancelText="Cancelar"
              className="custom-modal"
            >
              <Divider style={{ margin: "16px 0" }} />

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>Nota do filme:</label>
                <Flex vertical gap="middle">
                  <Rate character={<HeartFilled />} allowHalf count={10} className="custom-heart-rate" />
                </Flex>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8 }}>Comentário:</label>
                <TextArea
                  placeholder="Conte para as pessoas o que você achou deste filme..."
                  rows={4}
                />
              </div>
            </Modal>
          </div>

          <ReviewComponent movieId={movie.id} />
        </div>
      </main>
    </div>
  );
}
