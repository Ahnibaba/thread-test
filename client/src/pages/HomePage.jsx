import { Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../store/useAuth"
import { useEffect, useState } from "react"
import useShowToast from "@/hooks/useShowToast"
import axios from "axios"
import Post from "@/components/Post"
import usePosts from "../../store/usePosts"
import SuggestedUsers from "@/components/SuggestedUsers"


const HomePage = () => {
  const [loading, setLoading] = useState(true)

  const { setPosts, posts } = usePosts()
  const { setLoggedInUser } = useAuth()

  const showToast = useShowToast()
  const navigate = useNavigate()

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
        if(err.status === 401) {
          setLoggedInUser(null)
          navigate("/login")
          return
        } else if (err.response?.data && err.response?.data?.error) {
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
    <Flex gap={10} alignItems={"flex-start"}>

      <Box flex={70}>
        {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

        {loading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}

        {posts?.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>

      <Box 
       flex={30}
       display={{
        base: "none",
        md: "block"
       }}
      
      >
        <SuggestedUsers />
      </Box>

    </Flex>
  )
}

export default HomePage