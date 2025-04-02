import useShowToast from '@/hooks/useShowToast'
import { Input, InputGroup, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useConversations from '../../store/useConversations'
import useMessages from '../../store/useMessages'
import { useSocket } from '@/context/SocketContext'
import useAuth from '../../store/useAuth'

const MessageInput = ({ messages, setMessages }) => {
  const [messageText, setMessageText] = useState("")

  const { setSelectedConversation, selectedConversation, setConversations, conversations } = useConversations()
  //const { messages, setMessages, updateMessages } = useMessages()
  const { setTyping, typing } = useMessages()
  const { socket } = useSocket()
  const { loggedInUser } = useAuth()


  const showToast = useShowToast()




  const messageValues = { recipientId: selectedConversation?.userId, message: messageText }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText) return

    try {
      const response = await axios.post("/api/messages", messageValues)
      const { data } = response
      console.log(data);
      socket.emit("newConversation", { recipientId: selectedConversation?.userId, conversationId: data.conversationId })
      //updateMessages(data)
      setMessages([...messages, data])
      const e = { ...selectedConversation, _id: data.conversationId }
      setSelectedConversation(e)

      socket.emit("sendChanges", { data, recipientId: selectedConversation?.userId })
      socket.emit("getUserConversations", { recipientId: selectedConversation?.userId, user: loggedInUser?._id })

      const updatedConversations = conversations.map(conversation => {
        if (conversation._id === selectedConversation?._id) {
          return {
            ...conversation, lastMessage: { text: messageText, sender: data.sender }
          }
        }
        return conversation
      })


      setConversations(updatedConversations)

      setMessageText("")
    } catch (error) {
      console.log(error);
      showToast("Error", "error", error)

    }
  }

  const handleOnChangeMessage = (e) => {
    setMessageText(e.target.value)

    socket?.emit("typing", { recipientId: selectedConversation.userId, text: "...typing", conversationId: selectedConversation._id })
  }



  useEffect(() => {

    let timeOut
    socket.on("typing", ({ text }) => {
      setTyping(text)


      clearTimeout(timeOut)
      timeOut = setTimeout(() => setTyping(""), 1000)
    })
    return () => {
      clearTimeout(timeOut);
      socket.off("typing");
    };
  }, [messageText])

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup endElement={<IoSendSharp onClick={handleSendMessage} cursor={"pointer"} />}>
        <Input
          w={"full"}
          placeholder='Type a message'
          onChange={handleOnChangeMessage}
          value={messageText}
        />

      </InputGroup>
    </form>
  )
}

export default MessageInput