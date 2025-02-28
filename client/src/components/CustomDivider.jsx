import { Box } from "@chakra-ui/react"
import { useColorModeValue } from "./ui/color-mode"


const CustomDivider = () => {
    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    return (
        <Box borderBottom="1px solid" borderBottomColor={useColorModeValue("gray.200", gray.dark)} my={4}></Box>
    )

}

export default CustomDivider