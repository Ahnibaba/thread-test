import { Flex, Text } from "@chakra-ui/react"
import { Avatar } from "./ui/avatar"
import CustomDivider from "./CustomDivider"
import { useEffect, useState } from "react";
import useShowToast from "@/hooks/useShowToast";
import axios from "axios";


const Comments = ({ reply, lastReply }) => {
    console.log("Reply props", reply);
    const [replyUser, setReplyUser] = useState(null)

    const showToast = useShowToast()
    // Fetching the user's data from the database(user that replied to a particular post)
    // useEffect(() => {
    //     const findReplyUser = async () => {
    //         try {
    //            const response = await axios.get(`/api/users/profile/${reply?.userId}`) 
    //            const { data } = response
    //            console.log(data);
               
    //            setReplyUser(data)
    //         } catch (error) {
    //             if(error) {
    //               showToast("Error", "error", error)
    //             } else if(error.response.data && error.response.data.error) {
    //                 showToast("Error", "error", error.response.data.error)
    //             } else {
    //                 showToast("Error", "error", error.response.statusText)
    //             }
    //         }
    //     }
    //     findReplyUser()
    // }, [])
    
 
    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar size={"sm"} src={reply?.userProfilePic} />

                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>{reply?.username}</Text>
                       
                    </Flex>
                    <Text>{reply.text}</Text>
                    
                </Flex>
            </Flex>
            {!lastReply ? <CustomDivider /> : null}
        </>

    )
}

export default Comments