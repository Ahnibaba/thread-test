import { Input, InputGroup } from '@chakra-ui/react'
import React from 'react'
import { IoSendSharp } from 'react-icons/io5'

const MessageInput = () => {
  return (
    <form>
        <InputGroup endElement={<IoSendSharp />}>
          <Input
            w={"full"}
            placeholder='Type a message'
          />
          
        </InputGroup>
    </form>
  )
}

export default MessageInput