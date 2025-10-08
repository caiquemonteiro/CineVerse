import { OMDB_API_KEY } from '../utils/constants';

const OMDB_BASE_URL = "https://www.omdbapi.com";

export const getMovieRatings = (imdbId) => {
  return fetch(`${OMDB_BASE_URL}/?i=${imdbId}&apikey=${OMDB_API_KEY}`)
}