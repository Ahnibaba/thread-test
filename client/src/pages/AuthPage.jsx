import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignupCard"
import useAuth from "../../store/useAuth"



const AuthPage = () => {
   const { value, setValue } = useAuth()
   console.log(value);
   
    
  return (
    <>
      {value === "login" ? <LoginCard /> : <SignupCard /> }
    </>
  )
}

export default AuthPage