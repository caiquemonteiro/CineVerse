import { useParams } from "react-router-dom";
import { Row, Col, Breadcrumb, message, Empty } from "antd";
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import noImage from "../../assets/img-indisponivel.png";
import { useEffect, useState } from "react";
import { getSearchMovies } from "../../api/tmdb.api";
import { IMAGE_BASE_URL, EMPTY_IMAGE_URL } from '../../utils/constants';
import "./search.css";

export default function SearchPage() {
  const [ movies, setMovies] = useState([]);
  const [ messageApi, contextHolder ] = message.useMessage();
  const navigate = useNavigate();
  const { search } = useParams();

  useEffect(() => {
    getSearchMovies(search)
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results);
      })
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível realizar a pesquisa');
      }); 
  }, [search])

  return (
    <div className="search-container"> 

      {contextHolder}
    
      <Header />

      <Breadcrumb
        className="breadcrumb-search"
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
        ]}
      />

      <main className="search-content">
       
        <h2>
          Resultados para: {search}
        </h2>

        {movies.length > 0 ? (
          <Row gutter={[15, 15]}>
            {movies.map((movie) => (
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <img
                  className="movie-search"
                  src={movie.poster_path
                    ? `${IMAGE_BASE_URL}${movie.poster_path}`
                    : noImage}
                  onClick={( ) => navigate(`/movie/${movie.id}`)}
                  onError={(e) => (e.target.src = noImage)}
                  alt={movie.title}
                />
              </Col>
            ))}
          </Row>
        ) : (
          
          <div className="feedback-container">
            <Empty
              image={EMPTY_IMAGE_URL}
              styles={{ image: { height: 60, marginTop: 30 } }}
              description={
                <span className="empty-description">
                  Nenhum filme encontrado para "{search}"
                </span>
              }
            />
          </div>

        )}
      </main>
    </div>
  );
}