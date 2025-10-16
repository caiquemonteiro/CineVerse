import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/";
import SearchPage from "../pages/Search";
import LoginPage from "../pages/Login/";
import MoviePage from "../pages/Movie/";
import SignupPage from "../pages/Signup/";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search/:search" element={<SearchPage />} /> 
        <Route path="/movie/:movieId" element={<MoviePage />} />
      </Routes>
    </Router>
  );
}
