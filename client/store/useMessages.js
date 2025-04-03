import { create } from "zustand";

const useMessages = create((set) => ({
    messages: [],
    setMessages: (messages) => set({ messages }),
    updateMessages: (newMessage) => set((state) => ({ messages: [...state.messages, newMessage] })),
    typing: "",
    setTyping: (typing) => set({ typing }),
    messageText: "",
    setMessageText: (messageText) => set({ messageText }),

    
}))

export default useMessages