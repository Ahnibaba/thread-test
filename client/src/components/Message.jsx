import { Text, Avatar, Flex, Box } from '@chakra-ui/react'
import React from 'react'
import useConversations from '../../store/useConversations'
import useAuth from '../../store/useAuth'
import { BsCheck2All } from 'react-icons/bs'

const Message = ({ message, ownMessage }) => {

    const { selectedConversation } = useConversations()
    const { loggedInUser } = useAuth()

    return (
        <>
            {ownMessage ? (
                <Flex
                    gap={2}
                    alignSelf={"flex-end"}
                >
                    <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                       <Text color={"white"}>{message.text}</Text>
                       <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                          <BsCheck2All size={16} />
                       </Box>
                    </Flex>
                    <Avatar.Root size={"sm"}
                      w={7}
                      h={7}
                    >
                        <Avatar.Fallback src="https://bit.ly/broken-link" />
                        <Avatar.Image src={loggedInUser?.profilePic || null} />
                    </Avatar.Root>

                </Flex>
            ) : (
                <Flex
                    gap={2}
                >
                     <Avatar.Root size={"sm"}
                      w={7}
                      h={7}
                    >
                        <Avatar.Fallback src="https://bit.ly/broken-link" />
                        <Avatar.Image src={selectedConversation?.userProfilePics || null} />
                    </Avatar.Root>
                    <Text
                        maxW={"350px"}
                        bg={"gray.400"}
                        p={1}
                        borderRadius={"md"}
                        color={"black"}
                    >
                       {message.text} 
                    </Text>

                </Flex>
            )}
        </>
    )
}

export default Message