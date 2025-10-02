import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "./signup.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <article className="login-container">
      <section className="login-box">

        <img src={logo} alt="CineVerse Logo" className="login-logo" />

        <Form name="login_form">

          <Form.Item name="user">
            <Input
              prefix={<UserOutlined />}
              placeholder="Nome"
              size="large"
            />
          </Form.Item>
          
          <Form.Item name="email">
            <Input
              prefix={<MailOutlined />}
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
              onClick={() => navigate('/')}
            >
              Criar Conta
            </Button>
          </Form.Item>
            
          <div className="signin">
            <Text>Já possui uma conta?</Text>
            <Button
              type="link"
              onClick={() => navigate('/')} 
            >
              Fazer login
            </Button>
          </div>

        </Form>

      </section>
    </article>
  );

}
