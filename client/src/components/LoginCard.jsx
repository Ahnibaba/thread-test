import { Box, Button, Flex, Field, Heading, HStack, Icon, Input, Link, Stack, Text, Group, InputAddon } from '@chakra-ui/react'
import { useState } from 'react'
import { useColorModeValue } from './ui/color-mode'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import useAuth from '../../store/useAuth'
import useShowToast from '../hooks/useShowToast'
import axios from 'axios'






const LoginCard = () => {
    const [showPassword, setShowPassword] = useState()
    const [loginValues, setLoginValues] = useState({
        username: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    const { value, setValue, setLoggedInUser } = useAuth()

    const showToast = useShowToast()

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setLoginValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleLogin = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/users/login", loginValues)
            setLoggedInUser(data)
            showToast("Success", "success", "Login Successful")

        } catch (error) {
            showToast("Error", "error", error.response.data.error)
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack gap={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Login
                    </Heading>
                </Stack>
                <Box
                    rounded={"lg"}
                    bg={useColorModeValue("white", "gray.dark")}
                    boxShadow={"lg"}
                    p={8}
                    w={{
                        base: "full",
                        sm: "400px"
                    }}
                >
                    <Stack gap={4}>

                        <Field.Root required>
                            <Field.Label>Username</Field.Label>
                            <Input type="text"
                                name="username"
                                onChange={handleChange}
                                value={loginValues.username}
                            />
                        </Field.Root>
                        <Field.Root required>
                            <Field.Label>Password</Field.Label>
                            <Group attached w={"full"}>

                                <Input type={showPassword ? "text" : "password"}
                                    name="password"
                                    onChange={handleChange}
                                    value={loginValues.password}
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
                                loadingText="Logging in"
                                size={"lg"}
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800")
                                }}
                                onClick={handleLogin}
                                loading={loading}
                            >
                                Login
                            </Button>
                        </Stack>

                        <Stack pt={6}>
                            <Text alignItems={"center"}>
                                Don't have an account? <Link color="blue.400" onClick={() => setValue("signup")}>Sign up</Link>
                            </Text>
                        </Stack>

                    </Stack>


                </Box>
            </Stack>


        </Flex>

    )
}

export default LoginCard