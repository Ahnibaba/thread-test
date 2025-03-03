import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from './ui/color-mode'
import useAuth from '../../store/useAuth'
import { Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom"
import { CgHome, CgProfile } from 'react-icons/cg'

const Header = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  const { loggedInUser } = useAuth()
  return (
    <Flex justifyContent={"space-around"} mt={6} mb={12}>

      {loggedInUser && (
        <Link as={RouterLink} to="/">
          <CgHome size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt='logo'
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {loggedInUser && (
        <Link as={RouterLink} to={`/${loggedInUser.username}`}>
          <CgProfile size={24} />
        </Link>
      )}
      
    </Flex>
  )
}

export default Header