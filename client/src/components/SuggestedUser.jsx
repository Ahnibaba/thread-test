import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useAuth from '../../store/useAuth'
import useFollowUnfollow from '@/hooks/useFollowUnfollow'

const SuggestedUser = ({ user }) => {
    const { handleFollowUnFollow, following, updating } = useFollowUnfollow(user)



    return (
        <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
            {/* left side */}
            <Flex gap={2} as={Link} to={`${user.username}`}>
                <Avatar.Root>
                    <Avatar.Fallback name={user.username} />
                    <Avatar.Image src={user.profilePic || null} />
                </Avatar.Root>

                <Box>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user.username}
                    </Text>
                    <Text color={"gray.light"} fontSize={"sm"}>
                        {user.name}
                    </Text>
                </Box>
            </Flex>
            {/* right side */}
            <Button
             size={"sm"}
             color={following ? "black" : "white"}
             bg={following ? "white" : "blue.400"}
             onClick={handleFollowUnFollow}
             loading={updating}
             _hover={{
                color: following ? "black": "white",
                opacity: "0.8"
             }}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
        </Flex>
    )
}

export default SuggestedUser