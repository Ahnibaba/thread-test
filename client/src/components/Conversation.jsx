import {Box, Circle, Flex, Float, Image, Stack, Text, WrapItem } from '@chakra-ui/react'
import { useColorMode, useColorModeValue } from './ui/color-mode'
import { Avatar } from '@chakra-ui/react'
import useAuth from '../../store/useAuth'
import { BsCheck2All } from 'react-icons/bs'
import useConversations from '../../store/useConversations'
import useMessages from '../../store/useMessages'
import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'


const Conversation = ({ conversation, isOnline }) => {

  const gray = {
    dark: "#1e1e1e",
    light: "#616161"
}



  const user = conversation.participants[0]
  const lastMessage = conversation.lastMessage
  

  const { loggedInUser } = useAuth()
  const { selectedConversation, setSelectedConversation, setConversations, conversations } = useConversations()
  const { toggleColorMode } = useColorMode()
  const { typing, messageText } = useMessages()
  const { socket } = useSocket()

  const [check, setCheck] = useState(null)


  const bg = useColorModeValue("gray.400", gray.dark)

  console.log("selectedConversation", selectedConversation);

  socket.on("typing", ({ conversationId }) => {
    setCheck(conversationId)
  })

  


  return (
    <Flex
     gap={4}
     alignItems={"center"}
     p={"1"}
     _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white"
     }}
     onClick={() => {
       toggleColorMode
       setSelectedConversation({
        _id: conversation._id,
        userId: user._id,
        userProfilePics: user.profilePic,
        username: user.username,
        mock: conversation.mock
 
      })
     }}
     bg={selectedConversation?._id === conversation._id ? bg : ""}
     borderRadius={"md"}
    >

        <WrapItem>
            <Avatar.Root size={{
              base:"xs",
              sm:"sm",
              md:"md" 
            }}
            variant={"subtle"}
           >
              <Avatar.Fallback src="https://bit.ly/broken-link" />
              <Avatar.Image src={user?.profilePic || null} /> 
              {isOnline ? (
                <Float offset={"1"} offsetY={"1"}>
                <Circle 
                  bg={"green.500"}
                  size={"8px"}
                  outline={"0.2em solid"}
                  outlineColor={"bg"}
                />
              </Float>
              ) : ""}
            </Avatar.Root>
        </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
           <Text fontWeight={700} display={"flex"} alignItems={"center"}>
             {user.username} <Image src='/verified.png' w={4} h={4} ml={1} /> 
           </Text>
           <Flex fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
           {loggedInUser?._id === lastMessage.sender ? (
              <Box color={lastMessage.seen ? "blue.400" : ""}>
                <BsCheck2All size={16} />
              </Box>
            ) : ""}
            <Text>
             {
              lastMessage.text.length > 18 ? lastMessage.text.substring(0, 18) + "..." : lastMessage.text
             }
           </Text>
           </Flex>
           
        </Stack>

    </Flex>
  )
}

export default Conversation