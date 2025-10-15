import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/cineVerse.api";
import useAuthStore from "../../stores/authStore";

const { Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const onLogin =  (values) => {
    login(values)
      .then((res) => res.json())
      .then((json) => {
        setUser(json);
        navigate('/home');
      })
      .catch((err) => {
        console.error(err);
        messageApi.error('Erro ao fazer login.');
      });
  }

  return (
    <article className="login-container">
      <section className="login-box">

        <img src={logo} alt="CineVerse Logo" className="login-logo" />

        <Form name="login_form" onFinish={onLogin}>
          
          <Form.Item name="username" rules={[{ required: true, message: "Informe seu e-mail!" }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="E-mail"
              size="large"
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Informe sua senha!" }]}>
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
              htmlType="submit"
            >
              Entrar
            </Button>
          </Form.Item>

          <div className="signup">
            <Text>Ainda não possui conta?</Text>
            <Button
              type="link"
              onClick={() => navigate('/signup')} 
            >
              Cadastre-se
            </Button>
          </div>

        </Form>

      </section>
    </article>
  );

}
