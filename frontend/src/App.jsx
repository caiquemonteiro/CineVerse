import { ConfigProvider } from "antd";
import { themeConfig } from "./theme-config";
import ptBR from "antd/es/locale/pt_BR";
import AppRouter from "./router/Router.jsx";

function App() {
  return (
    <ConfigProvider theme={themeConfig} locale={ptBR}>
      <AppRouter />
    </ConfigProvider> 
  )
}

export default App;
