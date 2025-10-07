import { useParams } from "react-router-dom";
import { Tag, Button, Modal, Flex, Rate, Input, Divider, Spin } from "antd";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import IMDb from "../../assets/IMDb.png";
import ReviewComponent from "../../components/Review";
import { EditOutlined, HeartFilled } from "@ant-design/icons";
import "./movie.css";
import { API_KEY } from "../../utils/constants";

export default function MoviePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { TextArea } = Input;
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        };
        const resMovie = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`,
          options
        );
        const dataMovie = await resMovie.json();

        const resCredits = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`,
          options
        );
        const dataCredits = await resCredits.json();

        const directorObj = dataCredits.crew.find(
          (person) => person.job === "Director"
        );
        const director = directorObj ? directorObj.name : "Indisponível";

        const movieData = {
          id: dataMovie.id,
          title: dataMovie.title,
          year: dataMovie.release_date ? dataMovie.release_date.split("-")[0] : "N/A",
          poster_path: dataMovie.poster_path,
          overview: dataMovie.overview,
          duration: dataMovie.runtime ? `${dataMovie.runtime} min` : "N/A",
          genres: dataMovie.genres ? dataMovie.genres.map((g) => g.name) : [],
          rating_heart: dataMovie.vote_average?.toFixed(1),
          rating_imdb: dataMovie.vote_average?.toFixed(1),
          director: director,
          reviews: [],
        };

        setMovie(movieData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

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

        <div>
          <h1 className="movie-title">
            {movie.title} <span className="movie-year">({movie.year})</span>
          </h1>

          <p className="overview">{movie.overview}</p>

          <p>
            <strong>Diretor:</strong> {movie.director}
          </p>

          <p>
            <strong>Duração:</strong> {movie.duration}
          </p>

          {movie.genres.map((genre) => (
            <Tag key={genre} className="genre-tag">
              {genre}
            </Tag>
          ))}

          <div className="ratings">
            <HeartFilled style={{ color: "#CF1322", fontSize: 35, marginRight: 4 }} />
            <span className="heart-score"> {movie.rating_heart}</span>

            <img src={IMDb} alt="IMDb" />
            <span className="imdb-score"> {movie.rating_imdb}</span>
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

          <ReviewComponent movie={movie} />
        </div>
      </main>
    </div>
  );
}
