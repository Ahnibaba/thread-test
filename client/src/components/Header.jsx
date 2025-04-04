import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useColorMode } from './ui/color-mode'
import useAuth from '../../store/useAuth'
import { Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom"
import { CgHome, CgProfile } from 'react-icons/cg'
import LogoutButton from './LogoutButton';
import { BsFillChatQuoteFill } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';

const Header = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  const { loggedInUser, setValue } = useAuth()
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>

      {loggedInUser && (
        <Link as={RouterLink} to="/">
          <CgHome size={24} />
        </Link>
      )}
      {!loggedInUser && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setValue("login")}>
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt='logo'
        w={6}
        m={1}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {loggedInUser && (
        <Flex alignItems={"center"} gap={3}>
          <Link as={RouterLink} to={`/${loggedInUser.username}`}>
            <CgProfile size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={24} />
          </Link>
          <Link as={RouterLink} to={`/settings`}>
            <IoSettingsOutline size={20} />
          </Link>
          <LogoutButton />
        </Flex>
      )}

      {!loggedInUser && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setValue("signup")}>
          Sign up
        </Link>
      )}

    </Flex>
  )
}

export default Header