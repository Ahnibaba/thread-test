import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { Avatar } from "./ui/avatar"
import Actions from "./Actions"
import { useEffect, useState } from "react"
import useShowToast from "@/hooks/useShowToast"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"



const Post = ({ post, postedBy }) => {
    const [liked, setLiked] = useState(false)
    const [user, setUser] = useState(null)

    console.log(post.createdAt);
    



    const showToast = useShowToast()
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
           console.log("userdata", data);
           setUser(data)
           

        } catch (err) {
            if(err.response.data && err.response.data.error){
                showToast("Error", "error", err.response.data.error)
            }else {
                showToast("Error", "error", err.response.statusText)
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
                      name={post.postedBy.username}
                      src={post.postedBy.profilePic} 
                      onClick={(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`)

                      }}
                    />
                      
                    <Box w="1px" h={"full"} bg={gray.light} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}

                        {post.replies[0] && (
                            <Avatar
                            size="xs"
                            name="John Doe"
                            src={post.replies[0].userProfilePics}
                            position={"absolute"}
                            top={"12px"}
                            left="3px"
                            padding={"2px"}
                        />
                        )}
                        {post.replies[1] && (
                             <Avatar
                             size="xs"
                             name="John Doe"
                             src={post.replies[1].userProfilePics}
                             position={"absolute"}
                             top={"-15px"}
                             bottom={"0px"}
                             right="-5px"
                             padding={"2px"}
                         />
                        )}
                        {post.replies[2] && (
                             <Avatar
                             size="xs"
                             name="John Doe"
                             src={post.replies[2].userProfilePics}
                             position={"absolute"}
                             top={"-15px"}
                             bottom={"0px"}
                             right="-5px"
                             padding={"2px"}
                         />
                        )}

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
                                {post.postedBy.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xs"} width={36} textAlign={"right"} color={gray.light}>
                               {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                            
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={gray.light}>
                        <Image src={post.img} w={"full"} />
                    </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={gray.light} fontSize={"sm"}>
                            {post.replies.length} replies
                       </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={gray.light}></Box>
                        <Text color={gray.light} fontSize={"sm"}>
                            {post.replies.length} likes
                        </Text>
                    </Flex>
                </Flex>

            </Flex>
        </Link>
    )
}

export default Post