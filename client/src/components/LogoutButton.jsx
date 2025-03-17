import { Button } from "@chakra-ui/react"
import { LuLogOut } from "react-icons/lu"
import { useColorModeValue } from "./ui/color-mode"
import useLogout from "@/hooks/useLogout"



const LogoutButton = () => {

    const logout = useLogout()
    
    

    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    
    return (
        <Button
          bg={useColorModeValue("gray.300", gray.dark)}
          color={useColorModeValue(gray.dark, "gray.300")}
          size={"xs"}
          onClick={logout}
          
          >
            <LuLogOut size={20} />
        </Button>
    )
}

export default LogoutButton