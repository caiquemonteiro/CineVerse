import { Form, Input, Button } from "antd"; // componentes da biblioteca
import { UserOutlined, LockOutlined } from "@ant-design/icons"; // icones do usuário e cadeado da senha
import "./login.css";
import logo from "../../assets/logo.svg";

export default function LoginPage() {

  return (
    <div className="login-container">
      <div className="login-box">

        <img src={logo} alt="CineVerse Logo" className="login-logo" />

        <Form name="login_form">
          
          <Form.Item name="email">
            <Input
              prefix={<UserOutlined />}
              placeholder="E-mail"
              size="large"
            />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              className="login-button"
              size="large"
            >
              Entrar
            </Button>
          </Form.Item>

        </Form>

      </div>
    </div>
  );

}
