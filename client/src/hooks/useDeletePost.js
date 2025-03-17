import axios from "axios"
import useShowToast from "./useShowToast"
import { useNavigate } from "react-router-dom"
import usePosts from "../../store/usePosts"
import { useState } from "react"


const useDeletePost = () => {
   const showToast = useShowToast()
   const navigate = useNavigate()

   const [deleting, setDeleting] = useState(false)

   const  { removePost, setPosts, posts } = usePosts()

   const handleDeletePost = async (postId, user) => {
     
     try {
        setDeleting(true)
       if(!window.confirm("Are you sure you want to delete this post")) return
       
       const response = await axios.delete(`/api/posts/${postId}`)
       const { data } = response
       console.log(data);
       
       showToast("Success", "success", "Post deleted")
      // removePost(postId)
      setPosts(posts.filter((p) => p._id !== postId))
       navigate(`/${user.username}`)
     } catch (error) {
        console.log(error);
        setDeleting(false)
        if (error.response.data && error.response.data.error) {
            showToast("Error", "error", error.response.data.error)
        } else if (error.response.statusText) {
            showToast("Error", "error", error.response.statusText)
        } else {
            showToast("Error", "error", error)
        }
        
     }finally{
        setDeleting(false)
     }
   
    }

    return { handleDeletePost, deleting } 
}

export default useDeletePost