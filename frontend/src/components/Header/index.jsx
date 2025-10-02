import "./header.css";
import { Input, Avatar, Button, Divider } from "antd";
import { SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";

function Header() {
  return (
    <header className="header">

      <img src={logo} alt="CineVerse" />
      
      <Input
        className="search-bar"
        placeholder="Pesquisar..."
        prefix={<SearchOutlined />}
      />

      <div className="user-info">
        <Avatar className="user-avatar">J</Avatar>
        <span className="username">João da Silva</span>
        <Divider type="vertical" style={{borderColor: "lightgray"}} />
        <Button className="logout-button" type="text">
          <LogoutOutlined />
        </Button>
      </div>

    </header>
  );
}

export default Header;