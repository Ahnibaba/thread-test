import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState, } from "react"
import useAuth from "../../store/useAuth"
import useShowToast from "@/hooks/useShowToast"
import axios from "axios"
import { Field } from "./ui/field"
import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "./ui/dialog"
import usePosts from "../../store/usePosts"




const Actions = ({ post}) => {
	const { loggedInUser } = useAuth()
	const { setFetch } = usePosts()
	const { posts, setPosts } = usePosts()

	const [liked, setLiked] = useState(post?.likes?.includes(loggedInUser?._id))
	const [isLiking, setIsLiking] = useState(false)
	const [isReplying, setIsReplying] = useState(false)
	const [reply, setReply] = useState("")





	const showToast = useShowToast()



	const gray = {
		dark: "#1e1e1e",
		light: "#616161"
	}

	const handleLikeAndUnlike = async () => {
		if (!loggedInUser) {
			showToast("Error", "error", "You must be logged in to like a post")
		}
		if (isLiking) return
		setIsLiking(true)
		try {
			const response = await axios.put("/api/posts/like/" + post._id)
			const { data } = response


			if (!liked) {
				
				const updatedPosts = posts.map((p) => {
					if(p._id === post._id) {
						return { ...p, likes: [...p.likes, loggedInUser?._id] }
					} 
					return p
				})
				setPosts(updatedPosts)
			} else {
				
				const updatedPosts = posts.map((p) => {
					if(p._id === post._id){
						return { ...p, likes: p.likes.filter(id => id !== loggedInUser?._id ) } 
					}
					return p
					
				})
				setPosts(updatedPosts)
				
			}

			setLiked(!liked)



		} catch (error) {
			console.log(error);
			if (error.response.data && error.response.data.error) {
				showToast("Error", "error", error.response.data.error)
			} else {
				showToast("Error", "error", error.response?.statusText)
			}
			
		} finally {
			setIsLiking(false)
		}
	}

	const handleReply = async () => {
		if(!loggedInUser) return showToast("Error", "error", "You must be logged in to reply to a post")
		if(isReplying) return
		setIsReplying(true)	
		try {
			const response = await axios.put("/api/posts/reply/" + post._id, { text: reply })
			const { data } = response
			console.log(data);
			const updatedPosts = posts.map((p) => {
				if(p._id === post._id) {
					return { ...p, replies: [...p.replies, data] }
				}
				return p
			})
			setPosts(updatedPosts)
	
            setFetch(post._id)
			showToast("Success", "success", "Reply posted successfully")
            
		} catch (error) {
			console.log(error);
			if (error.response.data && error.response.data.error) {
				showToast("Error", "error", error.response.data.error)
			} else {
				showToast("Error", "error", error.response.statusText)
			}
			
		} finally {
			setIsReplying(false)
			setReply("")
		}
	}


	

	

	return (
		<Flex flexDirection={"column"}>
			<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				<svg
					aria-label='Like'
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeAndUnlike}
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>

				<DialogRoot>
					<DialogTrigger asChild>
						<svg
							aria-label='Comment'
							color=''
							fill=''
							height='20'
							role='img'
							viewBox='0 0 24 24'
							width='20'

						>
							<title>Comment</title>
							<path
								d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
								fill='none'
								stroke='currentColor'
								strokeLinejoin='round'
								strokeWidth='2'
							></path>
						</svg>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle></DialogTitle>
						</DialogHeader>
						<DialogBody pb="4">
							<Stack gap="4">
								<Field>
									<Input
									 placeholder="Reply goes here.."
									 onChange={(e) => setReply(e.target.value)}
									 value={reply}
									/>
								</Field>
							</Stack>
						</DialogBody>
						<DialogFooter>
							<DialogActionTrigger asChild>
							 <Button size={"sm"} onClick={handleReply} loading={isReplying}>Reply</Button>
							</DialogActionTrigger>
						</DialogFooter>
					</DialogContent>
				</DialogRoot>



				<RepostSVG />
				<ShareSVG />



			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Text color={gray.light} fontSize={"sm"}>
					{post?.replies?.length} replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={gray.light}></Box>
				<Text color={gray.light} fontSize={"sm"}>
					{post?.likes?.length} likes
				</Text>

			</Flex>

		</Flex>



	)
}

export default Actions


const RepostSVG = () => {
	return (
		<svg
			aria-label='Repost'
			color='currentColor'
			fill='currentColor'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Repost</title>
			<path
				fill=''
				d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
			></path>
		</svg>
	)
}


const ShareSVG = () => {
	return (
		<svg
			aria-label='Share'
			color=''
			fill='rgb(243, 245, 247)'
			height='20'
			role='img'
			viewBox='0 0 24 24'
			width='20'
		>
			<title>Share</title>
			<line
				fill='none'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
				x1='22'
				x2='9.218'
				y1='3'
				y2='10.083'
			></line>
			<polygon
				fill='none'
				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
				stroke='currentColor'
				strokeLinejoin='round'
				strokeWidth='2'
			></polygon>
		</svg>


	)
}