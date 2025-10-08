import { create } from 'zustand'

const useMoviesStore = create((set) => ({
  movies: [],
  moviesSearch: '', 
  setMovies: (moviesList) => set(() => ({ movies: moviesList })),
  setMoviesSearch: (searchText) => set(() => ({ moviesSearch: searchText })),
}))

export default useMoviesStore;