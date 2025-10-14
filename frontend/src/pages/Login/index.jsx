import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { login } from '../../api/login'; // ajuste o caminho conforme necessário

const { Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const result = await login({
        username: values.email,
        password: values.password,
      });

      message.success("Login realizado com sucesso!");
      // Aqui você pode salvar o token, se quiser
      // localStorage.setItem("token", result.access_token);
      navigate("/home");
    } catch (error) {
      message.error(error.message || "Erro ao fazer login.");
    }
  };

  return (
    <article className="login-container">
      <section className="login-box">
        <img src={logo} alt="CineVerse Logo" className="login-logo" />

        <Form name="login_form" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Digite seu e-mail!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="E-mail"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Digite sua senha!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Senha"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="login-button"
              size="large"
            >
              Entrar
            </Button>
          </Form.Item>

          <div className="signup">
            <Text>Ainda não possui conta?</Text>
            <Button type="link" onClick={() => navigate("/signup")}>
              Cadastre-se
            </Button>
          </div>
        </Form>
      </section>
    </article>
  );
}
