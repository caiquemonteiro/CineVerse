import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/home/Home.jsx";
import LoginPage from "../pages/login/index.jsx";
import MoviesPage from "../pages/movies/Movies.jsx";
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
      </Routes>
    </Router>
  );
}
