import noImage from "../../assets/img-indisponivel.png";
import { useParams } from "react-router-dom";
import { Tag, Button, Spin, message, Breadcrumb} from "antd";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import CineVerseHeart from "../../assets/cineVerseHeart.png";
import IMDbLogo from "../../assets/imdb.png";
import rotten_tomatoesLogo from "../../assets/rottenTomatoes.png";
import metacriticLogo from "../../assets/metacritic.png";
import ReviewComponent from "../../components/Review";
import { EditOutlined } from "@ant-design/icons";
import { HomeOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getMovieDetails } from "../../api/tmdb.api";
import { getRatingBySource, getMovieRuntime, getMovieDescription } from "../../utils"
import { IMAGE_BASE_URL, EMPTY_IMAGE_URL } from '../../utils/constants';
import { getMovieOMDB } from "../../api/omdb.api";
import MovieReviewModal from "../../components/MovieReviewModal/";
import { getMediaAvaliacoes, getAvaliacoes } from "../../api/cineVerse.api";
import useAuthStore from "../../stores/authStore";
import "./movie.css";

export default function MoviePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [movie, setMovie] = useState(null);
  const [OMDBMovie, setOMDBMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imdbRate, setImdbRate] = useState(null);
  const [rottenTomatoesRate, setRottenTomatoesRate] = useState(null);
  const [metacriticRate, setMetacriticRate] = useState(null);
  const [averageCineVerse, setAverageCineVerse] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { user } = useAuthStore();
  
  const { movieId } = useParams();

  const { Director, Writer, Actors, Ratings } = OMDBMovie;

  useEffect(() => {
    setLoading(true);
    getMovieDetails(movieId)
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar os detalhes do filme');
      })
      .finally(() => setLoading(false))
    
    getMediaAvaliacoes(movieId, user.access_token)
      .then((res) => res.json())
      .then((json) => setAverageCineVerse(json.media))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar a media do filme');
      })
      .finally(() => setLoading(false))
    
    getAvaliacoes(movieId, user.access_token)
      .then((res) => res.json()) 
      .then((json) => setReviews(json))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar as avaliações do filme');
      })
      .finally(() => setLoading(false))
  }, [movieId]);

  useEffect(() => {
    if (movie && movie.imdb_id) {
      getMovieOMDB(movie.imdb_id)
        .then((res) => res.json())
        .then((json) => setOMDBMovie(json))
        .catch((err) => {
          console.error(err);
          messageApi.error('Não foi possível acessar o filme no OMDB');
        })
    }
  }, [movie]);

  useEffect(() => {
    if (Ratings) {
      setImdbRate(getRatingBySource(Ratings, "Internet Movie Database"));
      setRottenTomatoesRate(getRatingBySource(Ratings, "Rotten Tomatoes"));
      setMetacriticRate(getRatingBySource(Ratings, "Metacritic"));
    }
  }, [Ratings]);

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  if (movie.success === false) 
    
  return (
    <div className="movie-not-found">
      <Empty
        image={EMPTY_IMAGE_URL}
        styles={{ image: { height: 60, marginTop: 30 } }}
        description={
          <span className="empty-description">
            Filme não encontrado
          </span>
        }
      />
    </div>
  );

  return (
    <div className="movie-container">

      {contextHolder}

      <Header />

      <Breadcrumb
        className="breadcrumb-movie"
        style={{ margin: '16px 50px' }}
        items={[
          {
            title: (
              <>
                <HomeOutlined />
                <span style={{ marginLeft: 8 }}>Home</span>
              </>
            ),
            href: "/home"
          },
          {
            title: (
              <>
                <VideoCameraOutlined />
                <span style={{ marginLeft: 8 }}>{movie?.title}</span>
              </>
            ),
          },
        ]}
      />

      <main className="movie-content">
        <div>
          <img
            className="movie"
            src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : noImage}
            alt={movie.title}
          />
          <div className="movie-ratings">
            <div className="rate-item">
              <img src={CineVerseHeart} alt="CineVerse" />
              <span className="heart-score"> {averageCineVerse}<span className="max-score-cv">/10</span></span>
            </div>
            {imdbRate && <div className="rate-item">
              <img src={IMDbLogo} alt="IMDb" />
              <span className="imdb-score">{imdbRate}<span className="max-score">/10</span></span>
            </div>}
            {rottenTomatoesRate && <div className="rate-item">
              <img src={rotten_tomatoesLogo} alt="Rotten Tomatoes" />
              <span className="rotten_tomatoes-score">{rottenTomatoesRate}</span>
            </div>}
            {metacriticRate && <div className="rate-item">
              <img src={metacriticLogo} alt="Metacritic" />
              <span className="metacritic-score">{metacriticRate}<span className="max-score">/100</span></span>
            </div>}
          </div>
        </div>

        <div className="movie-details">
          <h1 className="movie-title">
            {movie.title} {movie.release_date && <span className="movie-year">({OMDBMovie.Year})</span>}
          </h1>

          <p className="description">{getMovieDescription(movie.overview)}</p>

          <p className="movie-info-item"><strong>Diretor:</strong> {Director}</p>

          <p className="movie-info-item"><strong>Roteirista:</strong> {Writer}</p>

          <p className="movie-info-item"><strong>Atores:</strong> {Actors}</p>

          <p className="movie-info-item"><strong>Duração:</strong> {getMovieRuntime(movie.runtime)}</p>

          {movie.genres && movie.genres.map((genre) => (
            <Tag key={genre.id} className="genre-tag">
              {genre.name}
            </Tag>
          ))}

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

            <MovieReviewModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={({ rating, comment }) => {
                console.log("Avaliação enviada:", { movieId: movie.id, rating, comment });
              }}
            />
           
          </div>

          <ReviewComponent reviews={reviews} />
        </div>
      </main>
    </div>
  );
}
