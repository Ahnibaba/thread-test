import { Box, Button, Flex, Menu, MenuContent, MenuItem, MenuRoot, MenuTrigger, Text, VStack } from '@chakra-ui/react'
import { Avatar } from './ui/avatar'
import { Link } from 'react-router-dom'
import { BsInstagram, BsMenuButton } from 'react-icons/bs'
import { CgMoreO } from 'react-icons/cg'
import { toaster } from './ui/toaster'


const UserHeader = () => {
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
    return (
        
        <VStack gap={4} alignItems={"start"}>
            
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={{
                            base: "md",
                            md: "xl",
                        }}
                        fontWeight={"bold"}>
                        Mark Zuckerberg
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>markzuckerberg</Text>
                        <Text fontSize={"xs"} bg={gray.dark} color={gray.light} p={1} borderRadius={"full"}>
                            threads.next
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name="Mark Zuckerberg"
                        src="/zuck-avatar.png"
                        size={{
                            base: "md",
                            md: "xl",
                        }}
                    />
                </Box>
            </Flex>
            <Text fontSize={{base: "12px", md: "xl"}}>Co-founder, executive chairman and CEO of Meta Platform.</Text>
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={gray.light}>3.2k followers</Text>
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