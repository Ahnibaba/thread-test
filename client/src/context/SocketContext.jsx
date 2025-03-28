import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../../store/useAuth";

const SocketContext = createContext()

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    

    const { loggedInUser } = useAuth()

    useEffect(() => {
      const socket = io("http://localhost:5000", {
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