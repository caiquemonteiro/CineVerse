import "./movie.css";
import noImage from "../../assets/img-indisponivel.png";
import { useParams } from "react-router-dom";
import { Tag, Button, Modal, Flex, Rate, Input, Divider, Spin, message, Breadcrumb, Empty } from "antd";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import metacriticLogo from "../../assets/metacritic.png";
import rotten_tomatoesLogo from "../../assets/rottenTomatoes.png";
import IMDbLogo from "../../assets/imdb.png";
import ReviewComponent from "../../components/Review";
import { EditOutlined, HeartFilled } from "@ant-design/icons";
import { HomeOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getMovieDetails, getMovieCredits } from "../../api/tmdb.api";
import { getReleaseYear, getMovieDirector, getRatingBySource, getMovieRuntime, getMovieDescription } from "../../utils" 
import { getMovieRatings } from "../../api/omdb.api";

export default function MoviePage() {
  const [messageApi, contextHolder] = message.useMessage();
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
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar os detalhes do filme');
      })
      .finally(() => setLoading(false))
    
      getMovieCredits(id)
      .then((res) => res.json())
      .then((json) => setCredits(json))
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar os créditos do filme');
      })
  }, [id]);

  useEffect(() => {
    if (movie && movie.imdb_id) {
      getMovieRatings(movie.imdb_id)
        .then((res) => res.json())
        .then((json) => setRatings(json.Ratings))
        .catch((err) => {
          console.error(err);
          messageApi.error('Não foi possível carregar as notas do filme');
        })
    }
  }, [movie]);

  if (loading)
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  console.log(movie)
  if (movie.success === false) 
    
  return (
    <div className="movie-not-found">
      <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
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
        <img
          className="movie"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : noImage
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

          {movie.genres && movie.genres.map((genre) => (
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
