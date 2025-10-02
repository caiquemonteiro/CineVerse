import { useParams } from "react-router-dom";
import { Tag, Button, Modal, Flex, Rate, Input, Divider } from "antd";
import { useState } from 'react';
import Header from "../../components/Header";
import IMDb from "../../assets/IMDb.PNG";
import ReviewComponent from "../../components/Review/index.jsx";
import { EditOutlined, HeartFilled  } from "@ant-design/icons";
import "./movie.css";

export default function MoviePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { TextArea } = Input;
  const { id } = useParams();

  const movie = {
    id: id,
    title: "The Fantastic 4: First Steps",
    year: "2025",
    poster_path: "/x26MtUlwtWD26d0G0FXcppxCJio.jpg",
    overview: "Against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel's First Family is forced to balance their roles as heroes with the strength of their family bond, while defending Earth from a ravenous space god called Galactus and his enigmatic Herald, Silver Surfer.",
    director: "Matt Shakman",
    duration: "1h 55m",
    genres: ["Super-herói", "Ação", "Aventura", "Ficção científica"],
    rating_heart: 6.8,
    rating_imdb: 7.2,
    reviews: [
      {
        user: "Francisco Sousa",
        date: "26/09/2025 - 12:34",
        rating: 6.8,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices pellentesque est urna, placerat eget mi eu, condimentum interdum velit. Pellentesque bibendum arcu et ante tempus, et accumsan magna laoreet. Praesent eget ipsum fringilla quam sollicitudin sodales ut ut est. Nullam commodo justo vitae turpis feugiat placerat.",
      },
      {
        user: "Francisco Sousa",
        date: "26/09/2025 - 12:34",
        rating: 10,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices pellentesque est urna, placerat eget mi eu, condimentum interdum velit. Pellentesque bibendum arcu et ante tempus, et accumsan magna laoreet. Praesent eget ipsum fringilla quam sollicitudin sodales ut ut est. Nullam commodo justo vitae turpis feugiat placerat.",
      },
      {
        user: "Francisco Sousa",
        date: "26/09/2025 - 12:34",
        rating: 2.2,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices pellentesque est urna, placerat eget mi eu, condimentum interdum velit. Pellentesque bibendum arcu et ante tempus, et accumsan magna laoreet. Praesent eget ipsum fringilla quam sollicitudin sodales ut ut est. Nullam commodo justo vitae turpis feugiat placerat.",
      },
    ],
  };

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
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={isModalOpen}
              onOk={() => {}}
              onCancel={() => setIsModalOpen(false)}
              okText="Avaliar"
              cancelText="Cancelar"
              className="custom-modal"
            >

              <Divider style={{ margin: '16px 0' }} />

              <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8 }}>Nota do filme:</label>
                <Flex vertical gap="middle">
                  <Rate 
                  character={<HeartFilled />} 
                  allowHalf
                  count={10}
                  className="custom-heart-rate"
                 />
                  
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

