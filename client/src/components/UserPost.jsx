import { Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { Avatar } from "./ui/avatar"
import { BsThreeDots } from "react-icons/bs"
import Actions from "./Actions"
import { useState } from "react"



const UserPost = ({ postImg, postTitle, likes, replies }) => {
    const [liked, setLiked] = useState(false)
    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    return (
        <Link to="/markzuckerberg/post/1">
            <Flex gap={3} mb={9} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
                    <Box w="1px" h={"full"} bg={gray.light} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size="xs"
                            name="John Doe"
                            src="https://bit.ly/dan-abramov"
                            position={"absolute"}
                            top={"12px"}
                            left="3px"
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John Doe"
                            src="https://bit.ly/sage-adebayo"
                            position={"absolute"}
                            top={"-15px"}
                            bottom={"0px"}
                            right="-5px"
                            padding={"2px"}
                        />
                        <Avatar
                            size="xs"
                            name="John Doe"
                            src="https://bit.ly/prosper-baba"
                            position={"absolute"}
                            top={"-15px"}
                            bottom={"0px"}
                            left="-7px"
                            padding={"2px"}
                        />
                    </Box>
                </Flex>

                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerberg</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"sm"} color={gray.light}>1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{postTitle}</Text>
                    {postImg && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={gray.light}>
                        <Image src={postImg} w={"full"} />
                    </Box>
                    )}
                    <Flex gap={3} my={1}>
                        <Actions liked={liked} setLiked={setLiked} />
                    </Flex>

                    <Flex gap={2} alignItems={"center"}>
                        <Text color={gray.light} fontSize={"sm"}>
                            {replies} replies
                       </Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={gray.light}></Box>
                        <Text color={gray.light} fontSize={"sm"}>
                            {likes} likes
                        </Text>
                    </Flex>
                </Flex>

            </Flex>
        </Link>
    )
}

export default UserPost