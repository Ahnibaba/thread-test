import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser'
import axios from 'axios'
import useShowToast from '@/hooks/useShowToast'

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true)
    const [SuggestedUsers, setSuggestedUsers] = useState([])

    const showToast = useShowToast()

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true)
            try {
                
                const response = await axios.get("/api/users/suggested")
                const { data } = response
                console.log(data);
                
                setSuggestedUsers(data)
            } catch (error) {
                console.log(error);
                showToast("Error", "error", error)
            } finally {
                setLoading(false)
            }
        }
        getSuggestedUsers()
    }, [])
  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>

      <Flex direction={"column"} gap={4}>

        {!loading && SuggestedUsers.map(user => <SuggestedUser key={user._id} user={user} />)}
        {loading && [0,1,2,3,4].map((_, idx) => (
            <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
              {/* avatar skeleton */}
              <Box>
                 <SkeletonCircle size={"10"} />
              </Box>
              {/* username and fullname skeleton */}
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                 <Skeleton h={"8px"} w={"80px"} />
                 <Skeleton h={"8px"} w={"80px"} />
              </Flex>
              {/* follow button skeleton */}
              <Flex>
                 <Skeleton h={"20px"} w={"60px"} />
              </Flex>

            </Flex>
        ))} 
      </Flex>
    </>
  )
}

export default SuggestedUsers