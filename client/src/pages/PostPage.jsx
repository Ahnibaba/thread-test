import { Box, Button, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import { Avatar } from "../components/ui/avatar"
import { BsThreeDots, BsTrash } from "react-icons/bs"
import Actions from "../components/Actions"
import { useCallback, useEffect, useState } from "react"
import Comments from "../components/Comments"
import CustomDivider from "../components/CustomDivider"
import useGetUserProfile from "@/hooks/useGetUserProfile"
import useShowToast from "@/hooks/useShowToast"
import { useParams } from "react-router-dom"
import axios from "axios"
import useAuth from "../../store/useAuth"
import { formatDistanceToNow } from "date-fns"
import useDeletePost from "@/hooks/useDeletePost"
import usePosts from "../../store/usePosts"



const PostPage = () => {
  const { user, loading } = useGetUserProfile()
  const { pid } = useParams()
  const { loggedInUser } = useAuth()
  const { setPosts, posts } = usePosts()

  
  const showToast = useShowToast()
  const { handleDeletePost, deleting } = useDeletePost()


  const gray = {
    dark: "#1e1e1e",
    light: "#616161"
  }

  let currentPost = posts[0]

  console.log(pid);
  
  

  
  
  
  useEffect(() => {
    const getPost = async () => {
      setPosts([])
      try {
        const response = await axios.get(`/api/posts/${pid}`)
        const { data } = response
        console.log(data);
        setPosts([data])
       
      } catch (error) {
        console.log(error);
        
        if (error.response.data && error.response.data.error) {
          showToast("Error", "error", error.response.data.error)
        } else if (error.response.statusText) {
          showToast("Error", "error", error.response.statusText)
        } else {
          showToast("Error", "error", error.message)
        }
      }
    }
    getPost()
    
  }, [pid])


 
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  console.log(currentPost);
  

  if(!currentPost) return null

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic || null} size={"md"} name={user.username} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={gray.light}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>

          {loggedInUser?._id === user._id && deleting ? <Spinner size={"sm"} /> : <BsTrash cursor={"pointer"} size={15} onClick={() => handleDeletePost(currentPost._id, user)} />}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
         <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={gray.light}>
         <Image src={currentPost.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>


      <CustomDivider />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={gray.light}>Get the app to like, reply and post</Text>
        </Flex>
        <Button bg={gray.dark} color={"white"}>
          Get
        </Button>
      </Flex>

      <CustomDivider />


       {currentPost.replies.map(reply => (
        <Comments key={reply._id} reply={reply} lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} />
       ))}
     

    </>
  )
}

export default PostPage