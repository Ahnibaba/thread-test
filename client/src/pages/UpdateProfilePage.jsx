import { useColorModeValue } from "../components/ui/color-mode"
import { Button, Center, Flex, Heading, HStack, Stack, Input, Avatar, Field } from "@chakra-ui/react"
import { useRef, useState } from "react"
import useAuth from "../../store/useAuth"
import usePreviewImage from "../hooks/usePreviewImage"
import useShowToast from '../hooks/useShowToast'
import axios from "axios"


export default function UpdateProfilePage() {
    const { loggedInUser, setLoggedInUser } = useAuth()
    const [inputs, setInputs] = useState({
        name: loggedInUser.name,
        username: loggedInUser.username,
        email: loggedInUser.email,
        bio: loggedInUser.bio,
        password: ""
    })
    console.log(loggedInUser);

    const fileRef = useRef(null);
    const { handleImageChange, imgUrl } = usePreviewImage()
    const [updating, setUpdating] = useState(false)


    const showToast = useShowToast()

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setInputs((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (updating) return
        setUpdating(true)
        try {
            const response = await axios.put(`/api/users/update/${loggedInUser._id}`, { ...inputs, profilePic: imgUrl })
            const { data } = response
            showToast("Success", "success", "Profile updated successfully")
            setLoggedInUser(data);
            localStorage.setItem("threadUser", JSON.stringify(data))


            // const res = await fetch(`/api/users/update/${loggedInUser._id}`, {
            //    method: "PUT",
            //    headers: {
            //     "Content-Type": "application/json"
            //    },
            //    body: JSON.stringify({ ...inputs, profilePic: imgUrl })
            // })
            // const data = await res.json()
            // console.log(data);



        } catch (err) {
            if (err.response && err.response.data.error) {
                showToast("Error", "error", err.response.data.error)
            } else {
                showToast("Error", "error", err.response.statusText)
            }
            console.log(err);

        } finally {
            setUpdating(false)
        }
    }



    return (
        <form onSubmit={handleSubmit}>
            <Flex align={"center"} justify={"center"} my={6}>
                <Stack
                    gap={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.dark")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                        User Profile Edit
                    </Heading>
                    <Field.Root>
                        <Stack direction={["column", "row"]} gap={6} justify={"center"} align={"center"} w={"full"}>
                            <Center>
                                <Avatar.Root size={"2xl"}>
                                    <Avatar.Fallback name="Segun Adebayo" />
                                    <Avatar.Image boxShadow={"md"} src={imgUrl || loggedInUser.profilePic} />
                                </Avatar.Root>
                            </Center>
                            <Center w='full' px={5}>
                                <Button color={"white"} bg={gray.dark} w='full' onClick={() => fileRef.current.click()}>
                                    Change Avatar
                                </Button>
                                <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Full name</Field.Label>
                        <Input
                            placeholder='John Doe'
                            name="name"
                            onChange={handleChange}
                            value={inputs.name}
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>User name</Field.Label>
                        <Input
                            placeholder='johndoe'
                            name="username"
                            onChange={handleChange}
                            value={inputs.username}
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Email address</Field.Label>
                        <Input
                            placeholder='your-email@example.com'
                            name="email"
                            onChange={handleChange}
                            value={inputs.email}
                            _placeholder={{ color: "gray.500" }}
                            type='email'
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Bio</Field.Label>
                        <Input
                            placeholder='Your bio.'
                            name="bio"
                            onChange={handleChange}
                            value={inputs.bio}
                            _placeholder={{ color: "gray.500" }}
                            type='text'
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <Input
                            placeholder='password'
                            name="password"
                            onChange={handleChange}
                            value={inputs.password}
                            _placeholder={{ color: "gray.500" }}
                            type='password'
                        />
                    </Field.Root>
                    <Stack gap={6} direction={["column", "row"]}>

                        <Center w={"full"}>
                            <Button
                                bg={"red.400"}
                                color={"white"}
                                w='full'
                                _hover={{
                                    bg: "red.500",
                                }}
                            >
                                Cancel
                            </Button>
                        </Center>
                        <Center w={"full"}>
                            <Button
                                bg={"green.400"}
                                color={"white"}
                                w='full'
                                _hover={{
                                    bg: "green.500",
                                }}
                                type='submit'
                                loading={updating}

                            >
                                Submit
                            </Button>
                        </Center>

                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}