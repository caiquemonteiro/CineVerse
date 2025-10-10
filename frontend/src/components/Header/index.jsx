import "./header.css";
import { Input, Avatar, Button, Divider, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";
import { useNavigate } from "react-router-dom";
import useMoviesStore from "../../stores/moviesStore";
import { getPopularMovies, getSearchMovies } from "../../api/tmdb.api";

function Header() {
  const [messageApi, contextHolder] = message.useMessage();
  const { setMovies, setMoviesSearch } = useMoviesStore();
  const navigate = useNavigate(); 
    
  const { Search } = Input;

  const fetchPopularMovies = () => {
    
    getPopularMovies()
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results);
        setMoviesSearch('');
      })
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível carregar os filmes');
      }); 
  };

  const onSearch = (value) => {

    const searchText = value;

    if (!searchText) {
      fetchPopularMovies();
      return; 
    }

    setMoviesSearch(searchText);

    getSearchMovies(searchText)
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results);
        navigate('/home');
      })
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível realizar a pesquisa');
      }); 
  };

  return (
    <header className="header">

      {contextHolder}

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