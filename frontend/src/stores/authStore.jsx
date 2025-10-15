import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => set(() => ({ user: userData })),
}))

export default useAuthStore;