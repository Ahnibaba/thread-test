import { Box, Button, Field, Flex, Heading, HStack, Icon, Input, Link, Stack, Text, Group, InputAddon } from '@chakra-ui/react'
import { useState } from 'react'
import { useColorModeValue } from './ui/color-mode'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import useAuth from '../../store/useAuth'
import axios from 'axios'
import { toaster } from './ui/toaster'
import useShowToast from '../hooks/useShowToast'





const SignupCard = () => {
    const [showPassword, setShowPassword] = useState()
    const { value, setValue } = useAuth()
    const [signupValues, setSignupValues] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    })

    const showToast = useShowToast()
    const { setLoggedInUser } = useAuth()


    const handleChange = (e) => {

        const name = e.target.name
        const value = e.target.value

        setSignupValues((prev) => ({ ...prev, [name]: value }))

    }

    const handleSignup = async () => {
        try {

            const response = await axios.post("/api/users/signup", signupValues)
            const { data } = response


            // const res = await fetch("/api/users/signup", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "applications/json"
            //     },
            //     body: JSON.stringify(signupValues)
            // })
            // const data = await res.json()

            showToast("Sucess", "success", "Signed up successful")
            localStorage.setItem("threadUser", JSON.stringify(data))
            setLoggedInUser(data)

        } catch (err) {
            showToast("Error", "error", err.response.data.error)
            console.log(err);

        }


    }
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
                                <Field.Root required>
                                    <Field.Label>Full name</Field.Label>
                                    <Input type="text"
                                        name="name"
                                        onChange={handleChange}
                                        value={signupValues.name}
                                    />
                                </Field.Root>
                            </Box>
                            <Box>
                                <Field.Root required>
                                    <Field.Label>Username</Field.Label>
                                    <Input type="text"
                                        name="username"
                                        onChange={handleChange}
                                        value={signupValues.username}
                                    />
                                </Field.Root>
                            </Box>
                        </HStack>
                        <Field.Root required>
                            <Field.Label>Email address</Field.Label>
                            <Input type="email"
                                name="email"
                                onChange={handleChange}
                                value={signupValues.email}
                            />
                        </Field.Root>
                        <Field.Root required>
                            <Field.Label>Password</Field.Label>
                            <Group attached w={"full"}>

                                <Input type={showPassword ? "text" : "password"}
                                    name="password"
                                    onChange={handleChange}
                                    value={signupValues.password}
                                />
                                <InputAddon h={"full"}>
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        <Icon>
                                            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}


                                        </Icon>
                                    </Button>
                                </InputAddon>

                            </Group>

                        </Field.Root>

                        <Stack gap={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size={"lg"}
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800")
                                }}
                                onClick={handleSignup}
                            >
                                Sign up
                            </Button>
                        </Stack>

                        <Stack pt={6}>
                            <Text alignItems={"center"}>
                                Already a user? <Link color={"blue.400"} onClick={() => setValue("login")}>Login</Link>
                            </Text>
                        </Stack>

                    </Stack>


                </Box>
            </Stack>


        </Flex>

    )
}

export default SignupCard