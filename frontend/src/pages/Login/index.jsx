import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/cineVerse.api";
import useAuthStore from "../../stores/authStore";
import "./login.css";

const { Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [messageApi, contextHolder] = message.useMessage();

  const onLogin =  (values) => {
    login(values)
        .then((res) => {
          if (!res.ok) {
            return res.json().then((err) => { throw new Error(err.detail || 'Erro ao fazer login.'); });
          }
          return res.json();
        })
        .then((json) => {
          setUser(json);
          navigate('/home');
        })
        .catch((err) => {
          console.error(err);
          messageApi.error(err.message || 'Erro ao fazer login.');
        });
  }

  return (
    <article className="login-container">
      { contextHolder }
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
