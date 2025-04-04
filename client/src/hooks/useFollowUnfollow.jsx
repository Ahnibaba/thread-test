import { useNavigate } from "react-router-dom"
import useAuth from "../../store/useAuth"
import useShowToast from "./useShowToast"
import { useState } from "react"
import axios from "axios"


const useFollowUnfollow = (user) => {
    const { loggedInUser } = useAuth()

    const [following, setFollowing] = useState(user.followers.includes(loggedInUser?._id))
    const [updating, setUpdating] = useState(false)

    const showToast = useShowToast()
    const navigate = useNavigate()

    const handleFollowUnFollow = async () => {
        if (!loggedInUser) {
            showToast("Error", "error", "Please login to follow")
            navigate("/auth")
        }
        if (updating) return
        setUpdating(true)
        try {
            const response = await axios.post(`/api/users/follow/${user._id}`, {})
            const { data } = response
            console.log(data);
            if (following) {
                showToast("Success", "success", `Unfollowed ${user.name}`)
                user.followers.pop()
            } else {
                showToast("Success", "success", `Followed ${user.name}`)
                user.followers.push(loggedInUser._id)
            }
            setFollowing(!following)

        } catch (err) {
            
            console.log(err);
            showToast("Error", "error", err)

        } finally {
            setUpdating(false)
        }
    }
    return { handleFollowUnFollow, updating, following }
}

export default useFollowUnfollow
