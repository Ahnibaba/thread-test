import { Box } from "@chakra-ui/react"
import { useColorModeValue } from "./ui/color-mode"


const CustomDivider = ({ light, dark }) => {
    const gray = {
        dark: "#1e1e1e",
        light: "#616161"
    }
    return (
        <Box style={{margin: 0}} borderBottom="1px solid" borderBottomColor={useColorModeValue(light, dark)} my={4}></Box>
    )

}

export default CustomDivider