import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/index.jsx";
import LoginPage from "../pages/login/index.jsx";
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
