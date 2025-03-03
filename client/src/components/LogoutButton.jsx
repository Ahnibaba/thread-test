import { Button, CardTitle } from "@chakra-ui/react"
import useAuth from "../../store/useAuth"
import axios from "axios"
import useShowToast from '../hooks/useShowToast'
import { LuLogOut } from "react-icons/lu"
import { useColorModeValue } from "./ui/color-mode"



const LogoutButton = () => {
    const { setLoggedInUser } = useAuth()
    const showToast = useShowToast()
    

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    const handleLogout = async () => {
        
        try {

            const { data } = await axios.post("/api/users/logout", {})

            showToast("Success", "success", data.message)
            localStorage.removeItem("threadUser")
            setLoggedInUser(null)

        } catch (err) {
            showToast("Error", "error", err.response.data.error)
            console.log(err);

        }
    }
    return (
        <Button
          bg={useColorModeValue("gray.300", gray.dark)}
          color={useColorModeValue(gray.dark, "gray.300")}
          position={"fixed"}
          top={"30px"}
          right={"30px"}
          size={"sm"}
          onClick={handleLogout}
          
          >
            <LuLogOut size={20} />
        </Button>
    )
}

export default LogoutButton