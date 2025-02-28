import { Button, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom"


const HomePage = () => {
    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
      }
  return (
    <Link to="/markzuckerberg">
      <Flex w={"full"} justifyContent={"center"}>
         <Button color="white" bg={gray.dark} mx={"auto"}>Visit Profile Page</Button>
      </Flex>
    </Link>
  )
}

export default HomePage