import { create } from "zustand";

const useAuth = create((set) => ({
    value: "login",
    setValue: (value) => set({ value }),
    loggedInUser: JSON.parse(null),
    setLoggedInUser: (loggedInUser) => set({ loggedInUser }),
  
}))

export default useAuth