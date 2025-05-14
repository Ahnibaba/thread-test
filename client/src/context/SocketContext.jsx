import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../../store/useAuth";
import axios from "axios";

const SocketContext = createContext()

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    

    const { loggedInUser, setLoggedInUser } = useAuth()


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/users/check-auth")
        console.log("CHECK AUTH", response);
        
        setLoggedInUser(response.data)
      } catch (err) {
        console.log(err);
        if (err.status === 401) {
          setLoggedInUser(null)
          navigate("/auth")
        }
      }
    }
    checkAuth()
  }, [])

    useEffect(() => {
      const socket = io("/", {
        query: {
            userId: loggedInUser?._id
        }
      })

      setSocket(socket)

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users)
      })
      

      return () => socket && socket.close()
    }, [loggedInUser?._id])


    console.log(socket);
    console.log("onlineUsers", onlineUsers);
    
    
    const values = {
      socket,
      onlineUsers
    }

  return (
    <SocketContext.Provider value={values}>
        {children}
    </SocketContext.Provider>
  )
}