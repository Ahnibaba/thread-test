import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useShowToast from "./useShowToast"
import axios from "axios"


const useGetUserProfile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const { username } = useParams()
    
    const showToast = useShowToast()

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/api/users/profile/${username}`)
                const { data } = response
                setUser(data)


                // const res = await fetch(`/api/users/profile/${username}`)
                // const data = await res.json()
                // console.log(data);
            } catch (error) {

                if (error.response.data && error.response.data.error) {
                    showToast("Error", "error", error.response.data.error)
                } else if (error.response.statusText) {
                    showToast("Error", "error", error.response.statusText)
                } else {
                    showToast("Error", "error", error.message)
                }
            }
            
        }

        getUser()
    }, [username])


    return { loading, user }

}

export default useGetUserProfile