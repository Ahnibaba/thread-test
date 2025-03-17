import { Button, Flex, Spinner } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import useAuth from "../../store/useAuth"
import { useEffect, useState } from "react"
import useShowToast from "@/hooks/useShowToast"
import axios from "axios"
import Post from "@/components/Post"
import usePosts from "../../store/usePosts"


const HomePage = () => {
  const [loading, setLoading] = useState(true)

  const { setPosts, posts } = usePosts()

  const showToast = useShowToast()

  const gray = {
    dark: "#1e1e1e",
    light: "#616161"
  }

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true)
      setPosts([])
      try {

        const response = await axios.get("/api/posts/feed")
        const { data } = response
        console.log(data);
        setPosts(data)

      } catch (err) {
        console.log(err);
        if (err.response?.data && err.response?.data?.error) {
          showToast("Error", "error", err.response.data.error)
        } else {
          showToast("Error", "error", err.response.statusText)
        }
        

      } finally {
        setLoading(false)
      }
    }
    getFeedPosts()

    
  }, [])


  
  
  
  
  return (
    <>

      {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

      {loading && (
        <Flex justify={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}

    </>
  )
}

export default HomePage