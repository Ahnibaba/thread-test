import { create } from "zustand";

const useAuth = create((set) => ({
    value: "login",
    setValue: (value) => set({ value }),
    loggedInUser: JSON.parse(localStorage.getItem("threadUser")),
    setLoggedInUser: (loggedInUser) => set({ loggedInUser })
}))

export default useAuth