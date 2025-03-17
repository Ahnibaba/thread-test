import { useEffect, useState } from 'react'
import { Avatar } from './ui/avatar'
import axios from 'axios'
import { Text } from '@chakra-ui/react'
import usePosts from '../../store/usePosts'

const RepliesPhotos = ({ post }) => {
    const [repliesPhotos, setRepliesPhotos] = useState([])

    const { fetch, setFetch } = usePosts()

    useEffect(() => {
        const getPostReplies = async () => {
           try {
             const response = await axios.get("/api/posts/reply/" + post._id)
             const { data } = response
             setRepliesPhotos(data)
             
           } catch (error) {
              console.log(error);
              
           }
        }
        getPostReplies()

        return () => setFetch(null)
    }, [fetch])

    return (
        <>

            {repliesPhotos.length === 0 && <Text textAlign={"center"}>🥱</Text>}

            {
                repliesPhotos[0] && (
                    <Avatar
                        size="xs"
                        name={repliesPhotos[0].username}
                        src={repliesPhotos[0].userProfilePic || null}
                        position={"absolute"}
                        top={"-5px"}
                        left="3px"
                        padding={"2px"}
                    />
                )
            }
            {
                repliesPhotos[1] && (
                    <Avatar
                        size="xs"
                        name={repliesPhotos[1].username}
                        src={repliesPhotos[1].userProfilePic || null}
                        position={"absolute"}
                        top={"18px"}
                        bottom={"0px"}
                        right=""
                        padding={"2px"}
                    />
                )
            }
            {
                repliesPhotos[2] && (
                    <Avatar
                        size="xs"
                        name={repliesPhotos[2].username}
                        src={repliesPhotos[2].userProfilePic || null}
                        position={"absolute"}
                        top={"18px"}
                        bottom={"0px"}
                        right={"-5px"}
                        padding={"2px"}
                    />
                )
            }

        </>
    )


}

export default RepliesPhotos