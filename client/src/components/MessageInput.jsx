import useShowToast from '@/hooks/useShowToast'
import { Flex, Input, InputGroup, Text, Button, Dialog, Field, Portal, Stack, Image, useDialog, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useConversations from '../../store/useConversations'
import useMessages from '../../store/useMessages'
import { useSocket } from '@/context/SocketContext'
import useAuth from '../../store/useAuth'
import { BsFillImageFill } from 'react-icons/bs'
import usePreviewImage from '@/hooks/usePreviewImage'

const MessageInput = ({ messages, setMessages }) => {
  //const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)

  const { setSelectedConversation, selectedConversation, setConversations, conversations } = useConversations()
  const { messageText, setMessageText } = useMessages()
  const { setTyping, typing } = useMessages()
  const { socket } = useSocket()
  const { loggedInUser } = useAuth()
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage()

  const dialog = useDialog()




  const showToast = useShowToast()

  const typingTimeoutRef = useRef(null); // Persist timeout reference
  const imageRef = useRef(null)





  const messageValues = { recipientId: selectedConversation?.userId, message: messageText, img: imgUrl }


  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText && !imgUrl) return
    if (isSending) return

    setIsSending(true)

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
            ...conversation, lastMessage: { text: messageText, sender: data.sender, img: imgUrl }
          }
        }
        return conversation
      })


      setConversations(updatedConversations)

      setMessageText("")
      setImgUrl("")
      if (imageRef.current) {
        imageRef.current.value = ""
      }

      // ✅ Immediately stop typing when sending a message
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.log(error);
      showToast("Error", "error", error)

    } finally {
      setIsSending(false)
    }
  }




  const handleOnChangeMessage = (e) => {

    setMessageText(e.target.value)

    socket?.emit("typing", { recipientId: selectedConversation.userId, text: "...typing", conversationId: selectedConversation._id })

    socket?.emit("conversationTyping", { recipientId: selectedConversation.userId, user: loggedInUser?._id })

    // Clear previous timeout and set a new one

    clearTimeout(typingTimeoutRef.current);


    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stopTyping", {
        recipientId: selectedConversation.userId,
        user: loggedInUser?._id
      });
    }, 1000); // Adjust delay as needed



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
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup endElement={<IoSendSharp onClick={handleSendMessage} cursor={"pointer"} />}>
          <Input
            w={"full"}
            placeholder='Type a message'
            onChange={handleOnChangeMessage}
            value={messageText}
          />

        </InputGroup>
      </form>



      <Dialog.Root open={imgUrl}>
        <Dialog.Trigger asChild>
          <Flex flex={5} cursor={"pointer"}>
            <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
            <Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
          </Flex>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Dialog Header</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <Flex mt={5} w={"full"}>
                  <Image
                    src={imgUrl || null}
                  />
                </Flex>
                <Flex justifyContent={"flex-end"} my={2}>
                  {!isSending ? (
                    <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
                  ) : (
                    <Spinner size={"md"} />
                  )
                  }
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" onClick={() => {
                    setImgUrl("")
                    if (imageRef.current) {
                      imageRef.current.value = ""
                    }
                  }}
                  >
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>

              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  )
}

export default MessageInput