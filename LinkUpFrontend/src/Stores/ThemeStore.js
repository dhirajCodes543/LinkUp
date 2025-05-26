import { create } from "zustand"

const useThemeStore = create((set) => ({
  darkMode: true,
  toggleDarkMode: () =>
    set((state) => ({ darkMode: !state.darkMode })), // ✅ Toggle from current state
}))

export default useThemeStore
