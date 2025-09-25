import React from "react";
import "./header.css";
import { Input, Avatar, Button } from "antd";
import { SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/logo-horizontal.svg";

function Header() {
  return (
    <header className="header">

      <div className="header-left">
        <img src={logo} 
            alt="CineVerse" 
            className="header-logo" />
      </div>

      <div className="header-center">
        <Input
            placeholder="Pesquisar..."
            prefix={<SearchOutlined />}
        />
      </div>

      <div className="header-right">
        <Avatar className="header-avatar">J</Avatar>
        <span className="header-username">João da Silva</span>
        <span className="header-separator">|</span>
        <Button className="header-logout" type="text">
            <LogoutOutlined />
        </Button>
      </div>

    </header>
  );
}

export default Header;
