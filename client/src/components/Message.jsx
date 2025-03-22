import { Text, Avatar, Flex } from '@chakra-ui/react'
import React from 'react'

const Message = ({ ownMessage }) => {
    return (
        <>
            {ownMessage ? (
                <Flex
                    gap={2}
                    alignSelf={"flex-end"}
                >
                    <Text
                        maxW={"350px"}
                        bg={"blue.400"}
                        p={1}
                        borderRadius={"md"}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </Text>
                    <Avatar.Root size={"sm"}
                      w={7}
                      h={7}
                    >
                        <Avatar.Fallback src="https://bit.ly/broken-link" />
                        <Avatar.Image src="https://bit.ly/broken-link" />
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
                        <Avatar.Image src="https://bit.ly/broken-link" />
                    </Avatar.Root>
                    <Text
                        maxW={"350px"}
                        bg={"gray.400"}
                        p={1}
                        borderRadius={"md"}
                        color={"black"}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    </Text>

                </Flex>
            )}
        </>
    )
}

export default Message