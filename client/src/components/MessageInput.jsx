import useShowToast from '@/hooks/useShowToast'
import { Input, InputGroup } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useConversations from '../../store/useConversations'
import useMessages from '../../store/useMessages'

const MessageInput = () => {
  const [messageText, setMessageText] = useState("")

  const { selectedConversation, setConversations, conversations } = useConversations()
  const { messages, setMessages, updateMessages } = useMessages()

  const showToast = useShowToast()

  const messageValues = { recipientId: selectedConversation?.userId, message: messageText }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText) return

    try {
      const response = await axios.post("/api/messages", messageValues)
      const { data } = response
      console.log(data);

      updateMessages(data)
      

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

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup endElement={<IoSendSharp onClick={handleSendMessage} cursor={"pointer"} />}>
        <Input
          w={"full"}
          placeholder='Type a message'
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />

      </InputGroup>
    </form>
  )
}

export default MessageInput