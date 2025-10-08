import "./header.css";
import { Input, Avatar, Button, Divider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";
import { useNavigate } from "react-router-dom";
import useMoviesStore from "../../stores/moviesStore";
import { TMDB_API_KEY } from "../../utils/constants";

function Header() {
  const { setMovies, setMoviesSearch } = useMoviesStore();
  const navigate = useNavigate(); 
    
  const { Search } = Input;

  const fetchPopularMovies = () => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    };
    fetch(url, options )
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results);
        setMoviesSearch('');
      })
      .catch((err) => console.error(err));
  };

  const onSearch = (value) => {
    const searchText = value;

    if (!searchText) {
      fetchPopularMovies(); 
      return; 
    }

    setMoviesSearch(searchText);
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchText}&include_adult=false&language=pt-BR&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    };

    fetch(url, options )
      .then((res) => res.json())
      .then((json) => setMovies(json.results))
      .catch((err) => console.error(err));
  };

  return (
    <header className="header">
      <img src={logo} alt="CineVerse" onClick={() => {
        fetchPopularMovies();
        navigate('/home');
      }} style={{ cursor: 'pointer' }} />
      
      <Search 
        className="search-bar"
        placeholder="Pesquisar..." 
        onSearch={onSearch} 
        enterButton 
        allowClear
      />

      <div className="user-info">
        <Avatar className="user-avatar">J</Avatar>
        <span className="username">João da Silva</span>
        <Divider type="vertical" style={{borderColor: "lightgray"}} />
        <Button className="logout-button" type="text" onClick={() => navigate('/')}>
          <LogoutOutlined />
        </Button>
      </div>
    </header>
  );
}

export default Header;