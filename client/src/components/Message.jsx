import { Text, Avatar, Flex, Box, Image, Skeleton } from '@chakra-ui/react'
import React, { useState } from 'react'
import useConversations from '../../store/useConversations'
import useAuth from '../../store/useAuth'
import { BsCheck2All } from 'react-icons/bs'

const Message = ({ message, ownMessage }) => {

    const { selectedConversation } = useConversations()
    const { loggedInUser } = useAuth()

    const [imgLoaded, setImgLoaded] = useState(false)

    return (
        <>
            {ownMessage ? (
                <Flex
                    gap={2}
                    alignSelf={"flex-end"}
                >
                    {message.text && (
                        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                            <Text color={"white"}>{message.text}</Text>
                            <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                                <BsCheck2All size={16} />
                            </Box>
                        </Flex>
                    )}

                    {message.img && !imgLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image
                                src={message.img}
                                alt="Message image"
                                hidden
                                onLoad={() => setImgLoaded(true)}
                                borderRadius={4}
                            />
                            <Skeleton w={"200px"} h={"200px"} />

                        </Flex>
                    )}
                    {message.img && imgLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image
                                src={message.img}
                                alt="Message image"
                                borderRadius={4}
                            />
                            <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                                <BsCheck2All size={16} />
                            </Box>

                        </Flex>
                    )}
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
                    {message.text && (
                        <Text
                            maxW={"350px"}
                            bg={"gray.400"}
                            p={1}
                            borderRadius={"md"}
                            color={"black"}
                        >
                            {message.text}
                        </Text>
                    )}

                    {message.img && !imgLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image
                                src={message.img}
                                alt="Message image"
                                hidden
                                onLoad={() => setImgLoaded(true)}
                                borderRadius={4}
                            />
                            <Skeleton w={"200px"} h={"200px"} />

                        </Flex>
                    )}
                    {message.img && imgLoaded && (
                        <Flex mt={5} w={"200px"}>
                            <Image
                                src={message.img}
                                alt="Message image"
                                borderRadius={4}
                            />

                        </Flex>
                    )}
                </Flex>
            )}
        </>
    )
}

export default Message