import useAuth from "../../store/useAuth"
import useShowToast from "./useShowToast"
import axios from "axios"

const useLogout = () => {
    const { setLoggedInUser } = useAuth()
    const showToast = useShowToast()

    const logout = async () => {
        
        try {

            const { data } = await axios.post("/api/users/logout", {})

            showToast("Success", "success", data.message)
            localStorage.removeItem("threadUser")
            setLoggedInUser(null)

        } catch (err) {
            console.log(err);
            showToast("Error", "error", err.response.data.error)
            

        }
    }

    return logout
}

export default useLogout