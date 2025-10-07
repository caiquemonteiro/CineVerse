import "./header.css";
import { Input, Avatar, Button, Divider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate(); 
    
  const { Search } = Input;
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <header className="header">

      <img src={logo} alt="CineVerse" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
      
      <Search 
        className="search-bar"
        placeholder="Pesquisar..." 
        onSearch={onSearch} enterButton 
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