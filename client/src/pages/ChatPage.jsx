import Conversation from '@/components/Conversation'
import MessageContainer from '@/components/MessageContainer'
import { useColorModeValue } from '@/components/ui/color-mode'
import { Box, Button, Flex, Input, Text, Skeleton } from '@chakra-ui/react'
import React from 'react'
import { BsSearch } from 'react-icons/bs'
import { GiConversation } from "react-icons/gi"

const ChatPage = () => {

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }

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
                  <form>
                    <Flex alignItems={"center"} gap={2}>
                       <Input placeholder='Search for a user' /> 
                       <Button size={"sm"} bg={useColorModeValue(gray.light, gray.dark)} color={useColorModeValue(gray.dark, gray.light)}>
                         <BsSearch />
                       </Button>
                    </Flex>
                  </form>
                  {false && (
                    [0,1,2,3,4].map((_,i) => (
                        <Flex  key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
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

                 <Conversation />
                 <Conversation />
                 <Conversation />


               </Flex> 
               {/* <Flex
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
               </Flex> */}
               <MessageContainer />

            </Flex>
        </Box>
    )
}

export default ChatPage