import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => set(() => ({ user: userData })),
  clearUser: () => set(() => ({ user: null })),
}))

export default useAuthStore;