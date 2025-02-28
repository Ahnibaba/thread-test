import { useRecoilValue } from "recoil"
import LoginCard from "@/components/LoginCard"
import SignupCard from "@/components/SignupCard"
import authScreenAtom from "../atoms/authAtom"
import useAuth from "../../store/useAuth"



const AuthPage = () => {
   const { value, setValue } = useAuth()
    
  return (
    <>
      {value === "login" ? <LoginCard /> : <SignupCard /> }
    </>
  )
}

export default AuthPage