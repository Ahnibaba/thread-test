import { Avatar, Flex, Text, Image, Skeleton } from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react'
import { useColorModeValue } from './ui/color-mode'
import CustomDivider from './CustomDivider'
import Message from './Message'
import MessageInput from './MessageInput'
import axios from 'axios'
import useConversations from '../../store/useConversations'
import useShowToast from '@/hooks/useShowToast'
import useAuth from '../../store/useAuth'
import { useSocket } from '@/context/SocketContext'
import useMessages from '../../store/useMessages'

const MessageContainer = () => {

  const [loadingMessages, setLoadingMessages] = useState(true)
  const [messages, setMessages] = useState([])
  const [check, setCheck] = useState(null)

  const { setSelectedConversation, selectedConversation, setConversations, conversations } = useConversations()
  //const { messages, setMessages, updateMessages } = useMessages()
  const { loggedInUser } = useAuth()
  const { typing, setTyping } = useMessages()
  const { socket } = useSocket()

  const messageEndRef = useRef(null)

 
  


  const showToast = useShowToast()

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }



    useEffect(() => {
      socket.on("newMessage", ({ message }) => {
       if(selectedConversation?._id === message.conversationId) {
        setTyping("")
        //updateMessages(messages)

        setMessages(prev => [...prev, message])
       }
        
        const updatedConversations = conversations.map(conversation => {
          if(conversation._id === message.conversationId) {
            return { ...conversation, lastMessage: { text: message.text, sender: message.sender } }
          }
          return conversation
        })
        setConversations(updatedConversations)
      })

      return () => {
        socket.off("newMessage")
      }
    }, [socket, selectedConversation, messages, setConversations, conversations])


    useEffect(() => {
      const lastMessageIsFromOtherUser = messages.length && messages[messages.length -1].sender !== loggedInUser?._id
      if(lastMessageIsFromOtherUser) {
        socket.emit("markMessagesAsSeen", {
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId
        })
      }

      socket.on("messagesSeen", ({ conversationId }) => {
        if(selectedConversation?._id === conversationId) {
          const updatedMessages = messages.map(message => {
            if(!message.seen) {
              return { ...message, seen: true }
            }
            return message
          })

          setMessages(updatedMessages)
        }

        const test = conversations.map(conversation => {
       
          if (conversation._id === conversationId) {
            return { ...conversation, lastMessage: { ...conversation.lastMessage, seen: true } }
          }
          return conversation
        })
        setConversations(test);
      })

      
    }, [socket, loggedInUser?._id, messages, selectedConversation])


    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])


    useEffect(() => {
      const getMessages = async () => {
        setLoadingMessages(true)
        setMessages([])
        try {
          if(selectedConversation.mock) return
          const response = await axios.get(`/api/messages/${selectedConversation?.userId}`)
          const { data } = response
          setMessages(data)
          
        } catch (error) {
          console.log(error);
        showToast("Error", "error", error)
        } finally {
          setLoadingMessages(false)
        }
      }

      getMessages()
    }, [selectedConversation?.userId, selectedConversation.mock])



    socket.on("typing", ({ conversationId }) => {
      setCheck(conversationId)
    })
  
    


    

  return (
    <Flex flex={70}
     bg={useColorModeValue("gray.200", gray.dark)}
     borderRadius={"md"}
     p={2}
     flexDirection={"column"}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} flexDirection={"column"}>
         <Flex gap={2}>
         <Avatar.Root size={"sm"}>
           <Avatar.Fallback src="https://bit.ly/broken-link" />
           <Avatar.Image src={selectedConversation?.userProfilePics || null} /> 
         </Avatar.Root>
         <Text display={"flex"} alignItems={"center"}>
            {selectedConversation?.username} <Image src="/verified.png" w={4} h={4} ml={1} />
         </Text>
         </Flex>
         <Flex>
          <Text w={"xs"} mt={"-10px"} ml={"44px"}>{check === selectedConversation?._id ? typing : ""}</Text>
         </Flex>
      </Flex>
  
        <CustomDivider light={gray.dark} dark={"gray.700"}  />

        <Flex 
          flexDir={"column"}
          gap={4} my={4}
          p={2}
          height={"400px"}
          overflowY={"auto"}
        >
            {loadingMessages && (
                [...Array(5)].map((_, i) => (
                   <Flex
                     key={i}
                     gap={2}
                     alignItems={"center"}
                     p={1}
                     borderRadius={"md"}
                     alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                    >
                      {i % 2 === 0 && <Skeleton boxSize={"50px"} borderRadius={"full"} />}
                      <Flex flexDir={"column"} gap={2}>
                        <Skeleton h={"8px"} w={"250px"} />
                        <Skeleton h={"8px"} w={"250px"} />
                        <Skeleton h={"8px"} w={"250px"} />
                      </Flex>

                      {i % 2 !== 0 &&  <Skeleton boxSize={"50px"} borderRadius={"full"} />}

                   </Flex> 
                ))
            )}

            {!loadingMessages && (
              messages.map((message) => (
                <Flex key={message._id} direction={"column"}
                  ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null}
                >
                   <Message message={message} ownMessage={loggedInUser._id === message.sender} />
                </Flex>
              ))
            )}
          

        </Flex>

        <MessageInput messages={messages} setMessages={setMessages} />
    </Flex>
  )
}

export default MessageContainer