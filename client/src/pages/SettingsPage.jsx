import useLogout from '@/hooks/useLogout'
import useShowToast from '@/hooks/useShowToast'
import { Button, Text } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'

const SettingsPage = () => {
  const showToast = useShowToast()
  const logout = useLogout()

  const freezeAccount = async () => {
    if(!window.confirm("Are you sure you want to freeze your account?")) return;

    try {
      const response = await axios.put("/api/users/freeze")
      const { data } = response

      if(data.success) {
        await logout()
        showToast("Success", "success", "Your account has been frozen")
      }

    } catch (error) {
      console.log(error);
      showToast("Error", "error", error)
      
    }
  }
  return (
    <>
     <Text my={1} fontWeight={"bold"}>Freeze Your Account</Text>
     <Text>You can unfreeze your account anytime by logging in</Text>
     <Button
      size={"sm"}
      colorPalette={"red"}
      onClick={freezeAccount}
     >
      freeze
     </Button>
    </>
  )
}

export default SettingsPage