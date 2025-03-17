import { create } from "zustand";

const usePosts = create((set) => ({
    fetch: null,
    setFetch: (fetch) => set({ fetch }),
    posts: [],
    setPosts: (posts) => set({ posts }),
    removePost: (postId) => set((state) => ({ posts: state.posts.filter((p) => p._id !== postId) })),
    addPost: (newPost) => set((state) => ({ posts: [newPost, ...state.posts] })),
    
}))

export default usePosts