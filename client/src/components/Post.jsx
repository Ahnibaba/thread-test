import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./ui/avatar"
import Actions from "./Actions"
import { useEffect, useState } from "react"
import useShowToast from "@/hooks/useShowToast"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import useAuth from "../../store/useAuth"
import PostReplies from "./RepliesPhotos"
import { BsTrash } from "react-icons/bs"
import useDeletePost from "@/hooks/useDeletePost"





const Post = ({ post, postedBy }) => {
    const [user, setUser] = useState(null)

    const { loggedInUser } = useAuth()

  
    const showToast = useShowToast()
    const { handleDeletePost, deleting } = useDeletePost()
    const navigate = useNavigate()

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }

    

    useEffect(() => {
      const getUser = async () => {
        try {
           const response = await axios.get("/api/users/profile/" + postedBy)
           const { data } = response
           setUser(data)

        } catch (err) {
            if(err.response.data && err.response.data.error){
                showToast("Error", "error", err.response.data.error)
            }else {
                showToast("Error", "error", err.response?.statusText)
                console.log(err);
            }

            
            
        }
      }
      getUser()
    }, [postedBy])


    if(!user) return null

    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={9} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                      size="md"
                      name={user.username}
                      src={user.profilePic} 
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`)

                      }}
                    />
                      
                    <Box w="1px" h={"full"} bg={gray.light} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <PostReplies post={post} postedBy={postedBy} />
                    </Box>
                </Flex>

                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                              fontSize={"sm"}
                              fontWeight={"bold"}
                              onClick={(e) => {
                                e.preventDefault()
                                navigate(`/${user.username}`)
                               }}
                            >
                                {user.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
                            <Text fontSize={"xs"} width={36} textAlign={"right"} color={gray.light}>
                               {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>

                            {postedBy === loggedInUser?._id && deleting ? <Spinner size={"sm"} /> : <BsTrash size={15} onClick={(e) => {
                                e.preventDefault()
                                handleDeletePost(post._id, user)
                            }} />}
                            
                            
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={gray.light}>
                        <Image src={post.img} w={"full"} />
                    </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>

                    
                </Flex>

            </Flex>
        </Link>
    )
}

export default Post