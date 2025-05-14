import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useShowToast from "./useShowToast"
import axios from "axios"
import useAuth from "../../store/useAuth"


const useGetUserProfile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const { username } = useParams()
    const { setLoggedInUser } = useAuth()

    const showToast = useShowToast()

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${username}`)
                const { data } = response

                if (data.isFrozen) {
                    setUser(null)
                    return
                }
                setUser(data)


                // const res = await fetch(`/api/users/profile/${username}`)
                // const data = await res.json()
                // console.log(data);
            } catch (err) {

                console.log(err);
                if (err.status === 401) {
                    setLoggedInUser(null)
                    return
                } else if (err.response?.data && err.response?.data?.error) {
                    showToast("Error", "error", err.response.data.error)
                } else {
                    showToast("Error", "error", err.response.statusText)
                }
            } finally {
                setLoading(false)
            }

        }

        getUser()
    }, [username])


    return { loading, user }

}

export default useGetUserProfile