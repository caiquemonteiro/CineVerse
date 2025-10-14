import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "./signup.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { criarUsuario } from "../../api/cineVerse.api";

const { Text } = Typography;

export default function SignupPage() {
  const navigate = useNavigate();

  const singUp = (values) => { 
    criarUsuario(values)
      .then((response) => {
        if (response.ok) {
          message.success("Usuário cadastrado com sucesso!");
          navigate("/");
        } else {
          return response.json().then((errorData) => {
            message.error(errorData.detail || "Erro ao cadastrar usuário.");
          });
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        message.error("Erro de conexão com o servidor.");
      });
  };

  return (
    <article className="login-container">
      <section className="login-box">

        <img src={logo} alt="CineVerse Logo" className="login-logo" />

        <Form name="signup_form" onFinish={singUp}>

          <Form.Item name="nome" rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Nome"
              size="large"
            />
          </Form.Item>
          
          <Form.Item name="email" rules={[{ required: true, message: 'Por favor, insira seu e-mail!' }, { type: 'email', message: 'O e-mail inserido não é válido!' }]}>
            <Input
              prefix={<MailOutlined />}
              placeholder="E-mail"
              size="large"
            />
          </Form.Item>

          <Form.Item name="senha" rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}>
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
              size="large"
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
