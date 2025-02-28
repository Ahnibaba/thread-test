import { create } from "zustand";

const useAuth = create((set) => ({
    value: "login",
    setValue: (value) => set({ value })
}))

export default useAuth