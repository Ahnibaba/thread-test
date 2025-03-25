import Conversation from "@/components/Conversation";
import { create } from "zustand";

const useConversations = create((set) => ({
    conversations: [],
    setConversations: (conversations) => set({ conversations }),
    searchConversations: [],
    setSearchConversations: (searchConversations) => set({ searchConversations }),
    selectedConversation: {
            _id: "",
            userId: "",
            username: "",
            userProfilePic: ""
    },
    setSelectedConversation: (selectedConversation) => set({ selectedConversation })
}))

export default useConversations