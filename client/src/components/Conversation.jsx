import {Circle, Flex, Float, Image, Stack, Text, WrapItem } from '@chakra-ui/react'
import { useColorModeValue } from './ui/color-mode'
import { Avatar } from '@chakra-ui/react'


const Conversation = () => {
  return (
    <Flex
     gap={4}
     alignItems={"center"}
     p={"1"}
     _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white"
     }}
     borderRadius={"md"}
    >

        <WrapItem>
            <Avatar.Root size={{
              base:"xs",
              sm:"sm",
              md:"md" 
            }}
            variant={"subtle"}
           >
              <Avatar.Fallback src="https://bit.ly/broken-link" />
              <Avatar.Image src="https://bit.ly/broken-link" /> 
              <Float offset={"1"} offsetY={"1"}>
                <Circle 
                  bg={"green.500"}
                  size={"8px"}
                  outline={"0.2em solid"}
                  outlineColor={"bg"}
                />
              </Float>
            </Avatar.Root>
        </WrapItem>

        <Stack direction={"column"} fontSize={"sm"}>
           <Text fontWeight={700} display={"flex"} alignItems={"center"}>
             johndoe <Image src='/verified.png' w={4} h={4} ml={1} /> 
           </Text>
           <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            Hello some message ...
           </Text>
        </Stack>

    </Flex>
  )
}

export default Conversation