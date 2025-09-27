import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <article className="login-container">
      <section className="login-box">

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
              onClick={() => navigate('/home')}
            >
              Entrar
            </Button>
          </Form.Item>

        </Form>

      </section>
    </article>
  );

}
