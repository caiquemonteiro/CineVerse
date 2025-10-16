import { create } from 'zustand'

const useMoviesStore = create((set) => ({
  moviesSearch: '', 
  setMoviesSearch: (searchText) => set(() => ({ moviesSearch: searchText })),
}))

export default useMoviesStore;