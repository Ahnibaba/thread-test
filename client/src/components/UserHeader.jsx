import { Box, Button, Flex, Menu, MenuContent, MenuItem, MenuRoot, MenuTrigger, Text, VStack, Link } from '@chakra-ui/react'
import { Avatar } from './ui/avatar'
import { BsInstagram, BsMenuButton } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { toaster } from './ui/toaster'
import useAuth from '../../store/useAuth'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import useShowToast from '../hooks/useShowToast'
import { Link as RouterLink } from "react-router-dom"


const UserHeader = ({ user }) => {
    const { loggedInUser } = useAuth()
    const [following, setFollowing] = useState(user.followers.includes(loggedInUser?._id))
    console.log(following);
    const showToast = useShowToast()
    const [updating, setUpdating] = useState(false)

    const navigate = useNavigate()
    
    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    

    const copyURL = () =>{
        const currentURL = window.location.href
        navigator.clipboard.writeText(currentURL).then(() => {
            toaster.create({
                description: "Link copied to clipboard",
                type: "info",
                duration: 3000,
            })
        })
    }
    

    const handleFollowUnFollow = async () => {
        if(!loggedInUser){
            showToast("Error", "error", "Please login to follow")
            navigate("/auth")
        }
        if (updating) return
        setUpdating(true)
        try {
            const response = await axios.post(`/api/users/follow/${user._id}`, {})
            const { data } = response
            console.log(data);
            if(following) {
                showToast("Success", "success", `Unfollowed ${user.name}`)
                 user.followers.pop()
            } else {
                showToast("Success", "success", `Followed ${user.name}`)
                user.followers.push(loggedInUser._id)
            }
            setFollowing(!following)
            
        } catch (err) {
            if(err.response && err.response.data.error){
                showToast("Error", "error", err.response.data.error)
               }else {
                showToast("Error", "error", err.response.statusText)
               }
            console.log(err);
            
        } finally {
            setUpdating(false)
        }
    }
    
    return (
        
        <VStack gap={4} alignItems={"start"}>
            
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={{
                            base: "md",
                            md: "xl",
                        }}
                        fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={gray.dark} color={gray.light} p={1} borderRadius={"full"}>
                            threads.next
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic && (
                       <Avatar
                       name={user.name}
                       src={user.profilePic}
                       size={{
                           base: "md",
                           md: "xl",
                       }}
                   /> 
                    )}
                    {!user.profilePic && (
                       <Avatar
                       name={user.name}
                       src="https://bit.ly/broken-link"
                       size={{
                           base: "md",
                           md: "xl",
                       }}
                   /> 
                    )}
                </Box>
            </Flex>
            <Text fontSize={{base: "12px", md: "xl"}}>{user.bio}</Text>
            {loggedInUser?._id === user?._id && (
                <Link as={RouterLink} to={"/update"} textDecoration={"none"}>
                  <Button color={"white"} bg={gray.dark}>Update Profile</Button>
                </Link>
            )}
            {loggedInUser?._id !== user?._id && (
              <Button 
                color={"white"} 
                bg={gray.dark}
                onClick={handleFollowUnFollow}
                loading={updating}
                >
                 {following ? "Unfollow" : "Follow"}
                </Button>
            )}
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={gray.light}>{user.followers.length} followers</Text>
                    <Box w={1} h={1} bg={gray.light} borderRadius={"full"}></Box>
                    <Link color={gray.light}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className='icon-container'>
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className='icon-container'>
                      <MenuRoot>
                        <MenuTrigger asChild>
                        <CgMoreO size={24} cursor={"pointer"}></CgMoreO>
                        </MenuTrigger>
                        <MenuContent mt={2} bg={gray.dark}> 
                           <MenuItem bg={gray.dark} onClick={copyURL}>Copy link</MenuItem> 
                        </MenuContent>
                      </MenuRoot>
                    </Box>
                </Flex>
            </Flex>

            <Flex width={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                  <Text fontWeight={"bold"}>Threads</Text>
                </Flex>

                <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={gray.light} pb="3" cursor={"pointer"}>
                  <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
                
            </Flex>
        </VStack>
    )
}

export default UserHeader