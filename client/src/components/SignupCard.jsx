import { Box, Button, Flex, Heading, HStack, Icon, Input, Link, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useColorModeValue } from './ui/color-mode'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { InputGroup, InputRightElement } from '@chakra-ui/input'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'






const SignupCard = () => {
    const [showPassword, setShowPassword] = useState()
    return (
        <Flex align={"center"} justify={"center"}>
            <Stack gap={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.dark")}
                    boxShadow={"lg"}
                    p={8}
                >
                    <Stack gap={4}>
                        <HStack>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Full name</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Username</FormLabel>
                                    <Input type="text" />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>

                                <Input type={showPassword ? "text" : "password"} />
                                <InputRightElement h={"full"}>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        <Icon>
                                            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}


                                        </Icon>
                                    </Button>
                                </InputRightElement>

                            </InputGroup>

                        </FormControl>

                        <Stack gap={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size={"lg"}
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800")
                                }}
                            >
                                Sign up
                            </Button>
                        </Stack>

                        <Stack pt={6}>
                            <Text alignItems={"center"}>
                                Already a user? <Link color={"blue.400"}>Login</Link>
                            </Text>
                        </Stack>

                    </Stack>


                </Box>
            </Stack>


        </Flex>

    )
}

export default SignupCard