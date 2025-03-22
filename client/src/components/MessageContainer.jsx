import { Avatar, Flex, Text, Image, Skeleton } from '@chakra-ui/react'
import React from 'react'
import { useColorModeValue } from './ui/color-mode'
import CustomDivider from './CustomDivider'
import Message from './Message'
import MessageInput from './MessageInput'

const MessageContainer = () => {

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
  return (
    <Flex flex={70}
     bg={useColorModeValue("gray.200", gray.dark)}
     borderRadius={"md"}
     p={2}
     flexDirection={"column"}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
         <Avatar.Root size={"sm"}>
           <Avatar.Fallback src="https://bit.ly/broken-link" />
           <Avatar.Image src="https://bit.ly/broken-link" /> 
         </Avatar.Root>
         <Text display={"flex"} alignItems={"center"}>
            johndoe <Image src="/verified.png" w={4} h={4} ml={1} />
         </Text>
      </Flex>
        <CustomDivider light={gray.dark} dark={"gray.700"}  />

        <Flex 
          flexDir={"column"}
          gap={4} my={4}
          p={2}
          height={"400px"}
          overflowY={"auto"}
        >
            {false && (
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

            <Message ownMessage={true} />
            <Message ownMessage={false} />
            <Message ownMessage={false} />
            <Message ownMessage={true} />
            <Message ownMessage={true} />
            <Message ownMessage={false} />
            <Message ownMessage={false} />
            <Message ownMessage={true} />

        </Flex>

        <MessageInput />
    </Flex>
  )
}

export default MessageContainer