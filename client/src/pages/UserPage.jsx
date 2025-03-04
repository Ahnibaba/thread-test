import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import React, { useEffect, useState } from 'react'
import PostPage from './PostPage'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'

const UserPage = () => {
  const [user, setUser] = useState(null)
  const { username } = useParams()
  const showToast = useShowToast()
  const[loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try{
        const response = await axios.get(`/api/users/profile/${username}`)
        const { data } = response
        setUser(data)
        console.log(data);
        
        // const res = await fetch(`/api/users/profile/${username}`)
        // const data = await res.json()
        // console.log(data);
        
      } catch(error) {
        if(error.response.data && error.response.data.error){
          showToast("Error", "error", error.response.data.error)
        }else {
          showToast("Error", "error", error.response.statusText)
        }
        console.log(error);
        
      }finally {
        setLoading(false)
      }
    }
    getUser()

  }, [username])

  if(!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  } 

  if(!user && !loading) return <h1>User not found</h1>
  return (
    <>
      <UserHeader user={user} />
      <UserPost likes={1200} replies={481} postImg="/post1.png" postTitle="Let's talk about threads" />
      <UserPost likes={451} replies={12} postImg="/post2.png" postTitle="Nice tutorial" />
      <UserPost likes={321} replies={909} postImg="/post3.png" postTitle="I love this guy" />
      <UserPost likes={212} replies={56} postTitle="This is my first thread" />
      
    </>
  )
}

export default UserPage