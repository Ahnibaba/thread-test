import { Flex, Text } from "@chakra-ui/react"
import { Avatar } from "./ui/avatar"
import { GrAnalytics } from "react-icons/gr"
import { BsThreeDots } from "react-icons/bs"
import Actions from "./Actions"
import { useState } from "react"
import CustomDivider from "./CustomDivider"


const Comments = ({ name, comment, likes, img }) => {

    const [liked, setLiked] = useState(false)

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar size={"sm"} src={img} />

                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>{name}</Text>
                        <Flex gap={2} alignItems={"center"}>
                            <Text  fontSize={"sm"} color={gray.light}>2d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text>{comment}</Text>
                    <Actions liked={liked} setLiked={setLiked} />
                    <Text fontSize={"sm"} color={gray.light}>{likes + (liked ? 1 : 0)} likes</Text>
                </Flex>
            </Flex>
            <CustomDivider />
        </>

    )
}

export default Comments