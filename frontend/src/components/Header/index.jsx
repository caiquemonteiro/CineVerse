import "./header.css";
import { Input, Avatar, Button, Divider, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";
import { useNavigate } from "react-router-dom";
import useMoviesStore from "../../stores/moviesStore";
import useAuthStore from "../../stores/authStore";
import { logout } from "../../api/cineVerse.api";
import { useEffect } from "react";

function Header() {
  const { moviesSearch, setMoviesSearch } = useMoviesStore();
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate(); 
    
  const { Search } = Input;

  const [messageApi, contextHolder] = message.useMessage();

  const onSearch = () => {
    if (!moviesSearch) {
      navigate('/home');
      return;
    }
    navigate(`/search/${moviesSearch}`);
  };

  const onLogout = () => {
    logout(user.access_token)
      .then((res) => res.json())
      .then(() => {
        setMoviesSearch('');
        navigate('/');
        clearUser();
      })
      .catch((err) => {
        console.error(err);
        messageApi.error('Não foi possível realizar o logout');
      }); 
  }

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user]);

  return (
    <header className="header">
      { contextHolder }
      <img src={logo} alt="CineVerse" onClick={() => {
        navigate('/home');
      }} style={{ cursor: 'pointer' }} />
      
      <Search 
        className="search-bar"
        placeholder="Pesquisar..." 
        value={moviesSearch}
        onChange={(event) => setMoviesSearch(event.target.value)}
        onSearch={onSearch} 
        enterButton
        allowClear
      />

      <div className="user-info">
        <Avatar className="user-avatar">
          {user?.nome?.charAt(0).toUpperCase() || "?"}
        </Avatar>
        <div className="user-details">
          <span className="username">{user?.nome || "Usuário"}</span>
          <span className="user-email">{user?.email || ""}</span>
        </div>
        <Divider type="vertical" style={{ borderColor: "lightgray" }} />
        <Button className="logout-button" type="text" onClick={onLogout}>
          <LogoutOutlined />
        </Button>
      </div>
    </header>
  );
}
export default Header;