import { TMDB_API_KEY } from "../utils/constants";  

const TMDB_BASE_URL = "https://api.themoviedb.org/3"; 
const LANG = "pt-BR";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
};

export const getPopularMovies = () => {
  return fetch(`${TMDB_BASE_URL}/movie/popular?language=${LANG}&page=1`, options);
}

export const getMovieDetails = (movieId) => {
  return fetch(`${TMDB_BASE_URL}/movie/${movieId}?language=${LANG}`, options);
}

export const getMovieCredits = (movieId) => {
  return fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?language=${LANG}`, options);
}

export const getMovieReviews = (movieId) => {
  return fetch(`${TMDB_BASE_URL}/movie/${movieId}/reviews?language=${LANG}&page=1`, options);
}

export const getSearchMovies = (searchText) => {
  return fetch(`${TMDB_BASE_URL}/search/movie?query=${searchText}&include_adult=false&language=${LANG}&page=1`, options);
}