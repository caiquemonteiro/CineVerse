import "./header.css";
import { Input, Avatar, Button, Divider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";
import { useNavigate } from "react-router-dom";
import useMoviesStore from "../../stores/moviesStore";
import useUserStore from "../../stores/userStore";


function Header() {
  const { moviesSearch, setMoviesSearch } = useMoviesStore();
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate(); 
    
  const { Search } = Input;

  const onSearch = () => {

    if (!moviesSearch) {
      navigate('/home');
      return;
    }
    navigate(`/search/${moviesSearch}`)
  };

  return (
    <header className="header">

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
          {user?.name?.charAt(0).toUpperCase() || "?"}
        </Avatar>
        <div className="user-details">
          <span className="username">{user?.name || "Usuário"}</span>
          <span className="user-email">{user?.email || ""}</span>
        </div>
        <Divider type="vertical" style={{ borderColor: "lightgray" }} />
        <Button
          className="logout-button"
          type="text"
          onClick={() => {
            clearUser();
            navigate('/');
          }}
        >
          <LogoutOutlined />
          </Button>
      </div>
    </header>
  );
}
export default Header;