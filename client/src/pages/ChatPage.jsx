import Conversation from '@/components/Conversation'
import MessageContainer from '@/components/MessageContainer'
import { useColorModeValue } from '@/components/ui/color-mode'
import useShowToast from '@/hooks/useShowToast'
import { Box, Button, Flex, Input, Text, Skeleton } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { GiConversation } from "react-icons/gi"
import useConversations from '../../store/useConversations'
import useAuth from '../../store/useAuth'
import { IoReturnDownBack } from 'react-icons/io5'
import { useSocket } from '@/context/SocketContext'
import useMessages from '../../store/useMessages'

const ChatPage = () => {
  const showToast = useShowToast()

  const [loadingConversations, setLoadingConversations] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [searchingUser, setSearchingUser] = useState(false)
  const { conversations, setConversations, selectedConversation, setSelectedConversation, searchConversations, setSearchConversations } = useConversations()
  const { loggedInUser } = useAuth()
  const { socket, onlineUsers } = useSocket()
  const { typing, messageText } = useMessages()

  

  const gray = {
    dark: "#1e1e1e",
    light: "#616161"
  }






  socket.on("sendChanges", (conversationData) => {


    const updatedConversations = conversations.map(conversation => {
      if (conversation._id === conversationData._id) {
        return { ...conversation, lastMessage: { ...conversation.lastMessage, seen: conversationData.lastMessage.seen, sender: conversationData.lastMessage.sender, text: typing ? typing : conversationData.lastMessage.text } }
      }
      return conversation
    })
    setConversations(updatedConversations)


  })

  socket.on("getUserConversations", (conversations) => {
    setConversations(conversations)
  })


  useEffect(() => {
    
    socket.on("conversationTyping", (conversationData) => {
      console.log(conversationData);
      console.log(conversations);


      const updatedConversations = conversations.map(conversation => {
        if (conversation._id === conversationData._id) {

          return { ...conversation, lastMessage: { ...conversation.lastMessage, text: "...typing" } }
        }
        return conversation
      })

      console.log(updatedConversations);


      setConversations(updatedConversations)

    })

    socket.on("stopTyping", (conversationData) => {
      const updatedConversations = conversations.map((conversation) => {
        if (conversation._id === conversationData._id) {
          return {
            ...conversation,
            lastMessage: { ...conversation.lastMessage, text: conversationData.lastMessage.text }
          };
        }
        return conversation;
      });

      setConversations(updatedConversations);
    });



    return () => {
      socket.off("conversationTyping")
    }
  }, [messageText, conversations])





  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get("/api/messages/conversations")
        const { data } = response
        console.log(data);
        setConversations(data)

        console.log(conversations);


      } catch (error) {
        console.log(error);
        showToast("Error", "error", error)

      } finally {
        setLoadingConversations(false)
      }
    }

    getConversations()
  }, [])



  const handleConversationSearch = async (e) => {
    e.preventDefault()
    setSearchingUser(true)

    try {
      const { data: searchedUser } = await axios.get(`/api/users/profile/${searchText}`)

      const messagingYourself = searchedUser?._id === loggedInUser?._id
      if (messagingYourself) {
        showToast("Error", "error", "You cannot message yourself")
      }

      const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchedUser?._id)
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversations.find(conversation => conversation.participants[0]._id === searchedUser?._id)._id,
          userId: searchedUser?._id,
          username: searchedUser?.username,
          userProfilePics: searchedUser?.profilePic
        })
        return
      }

      if (searchedUser?.username !== loggedInUser?.username) {
        const mockConversation = {
          mock: true,
          lastMessage: {
            text: "",
            sender: ""
          },
          _id: Date.now(),
          participants: [{
            _id: searchedUser?._id,
            username: searchedUser?.username,
            profilePic: searchedUser?.profilePic
          }]
        }

        setConversations([...conversations, mockConversation])

      }


    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        showToast("Error", "error", error.response.data.error)
        return
      }
      showToast("Error", "error", error)
    } finally {
      setSearchingUser(false)
      setSearchText("")
    }
  }

  const handleOnchangeSearch = (e) => {
    const value = e.target.value;
    setSearchText(value); // Update the search text

    if (value) {
      console.log(value);

      const searchedConversation = conversations.filter((conversation) =>
        conversation.participants[0].username.toLowerCase().includes(value.toLowerCase())
      );

      setSearchConversations(searchedConversation);

    } else {
      setSearchConversations(conversations)
    }
  };


  return (
    <Box position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px"
      }}
      p={4}
      transform={"translateX(-50%)"}

    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row"
        }}
        maxW={{
          sm: "400px",
          md: "full"
        }}
        mx={"auto"}
      >
        <Flex flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full"

          }}
          mx={"auto"}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.400", "gray.600")}>
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder='Search for a user' onChange={handleOnchangeSearch} value={searchText} />
              <Button size={"sm"} bg={useColorModeValue(gray.light, gray.dark)} color={useColorModeValue(gray.dark, gray.light)} onClick={handleConversationSearch} loading={searchingUser}>
                <BsSearch />
              </Button>
            </Flex>
          </form>
          {loadingConversations && (
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                <Box>
                  <Skeleton boxSize={"50px"} borderRadius={"full"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))
          )}

          {!loadingConversations && !searchText && (
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}
              />
            ))
          )}
          {!loadingConversations && searchText && (
            searchConversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}
              />
            ))
          )}





        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation?._id && <MessageContainer />}

      </Flex>
    </Box>
  )
}

export default ChatPage