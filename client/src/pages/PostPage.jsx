import { Box, Button, Flex, Image, Text } from "@chakra-ui/react"
import { Avatar } from "../components/ui/avatar"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react"
import Comments from "../components/Comments"
import CustomDivider from "../components/CustomDivider"





const PostPage = () => {
  const [liked, setLiked] = useState(false)

  const gray = {
    dark: "#1e1e1e",
    light: "#616161"
  }

 

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src="/zuck-avatar.png" size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerberg</Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={gray.light}>1d</Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>Let's talk about threads</Text>

      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={gray.light}>
        <Image src={"/post1.png"} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={gray.light} fontSize={"sm"}>238 replies</Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={gray.light}></Box>
        <Text color={gray.light} fontSize={"sm"}>
         {200 + (liked ? 1 : 0)} likes
        </Text>
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

     <Comments name="burakorkmez" comment="I love this post! Looks really cool." likes={12} img="https://bit.ly/sage-adebayo" />
     <Comments name="johndoe" comment="Wow! This is amazing." likes={12} img="https://bit.ly/dan-abramov" />
     <Comments name="sallydoe" comment="I love this post Looks really cool." likes={12} img="https://randomuser.me/api/portraits/men/42.jpg" />
     
    </>
  )
}

export default PostPage