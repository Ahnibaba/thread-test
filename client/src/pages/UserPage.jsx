import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import React, { useEffect, useState } from 'react'
import PostPage from './PostPage'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'
import Post from '@/components/Post'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import usePosts from '../../store/usePosts'

const UserPage = () => {
  //const [posts, setPosts] = useState([])
  const [fetchingUserPosts, setFetchingUserPosts] = useState(true)

  const { user, loading } = useGetUserProfile()
  const { username } = useParams()
  const { setPosts, posts } = usePosts()

  const showToast = useShowToast()
  

  useEffect(() => {
    const getPosts = async () => {
      setFetchingUserPosts(true)
      try {
        const response = await axios.get(`/api/posts/user/${username}`)
        const { data } = response
        console.log(data);
        setPosts(data)
        
      } catch (error) {
        console.log(error);
        
        if(error.response.data && error.response.data.error) {
          showToast("Error", "error", error.response.data.error)
        } else if(error.response.statusText){
          showToast("Error", "error", error.response.statusText)
        } else {
          showToast("Error", "error", error.message)
        }
      } finally {
        setFetchingUserPosts(false)
      }
    }
    getPosts()

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

      {!fetchingUserPosts && posts.length === 0 && <h1>User has not posts</h1>}
      {fetchingUserPosts && (
      
          <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}


      
    </>
  )
}

export default UserPage