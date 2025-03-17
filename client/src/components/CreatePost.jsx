import { Button, CloseButton, Flex, Image, Input, Text, Textarea } from "@chakra-ui/react"
import { IoAdd } from "react-icons/io5"
import { useColorModeValue } from "./ui/color-mode"
import { useRef, useState } from "react"
//import Lorem from "react-lorem-ipsum"
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { BsFillImageFill } from "react-icons/bs"
import usePreviewImage from "@/hooks/usePreviewImage"
import useAuth from "../../store/useAuth"
import useShowToast from "@/hooks/useShowToast"
import axios from "axios"
import usePosts from "../../store/usePosts"
import { useParams } from "react-router-dom"

const MAX_CHAR = 500

const CreatePost = () => {
    const [open, setOpen] = useState(false)
    const [postText, setPostText] = useState("")
    const [rem, setRem] = useState(MAX_CHAR)
    const [loading, setLoading] = useState(false)

    const { handleImageChange, imgUrl, setImgUrl} = usePreviewImage()
    const { loggedInUser } = useAuth()
    const { setPosts, posts, addPost } = usePosts()
    const { username } = useParams()

    const ImageRef = useRef(null)
    const showToast = useShowToast()

    
    const handleTextChange = (e) => {
      const name = e.target.name
      const value = e.target.value

      if(value.length > MAX_CHAR) {
         const truncatedText = value.slice(0, MAX_CHAR)
         setPostText(truncatedText)
         setRem(0)
      }else {
        setPostText(value)
        setRem(MAX_CHAR - value.length)
      }
      
      
      
    }

    const gray = {
      dark: "#1e1e1e",
      light: "#616161"
  }

    const handleCreatePost = async () => {
       setLoading(true)
       try {
        const response = await axios.post("/api/posts/create", { postedBy: loggedInUser._id, text: postText, img: imgUrl })
        const { data } = response
        console.log(data);
        //addPost(data.newPost)
        if(username === loggedInUser?.username) {
          setPosts([data.newPost, ...posts])
        }
        
        showToast("Success", "success", "Post created successfully")
        setOpen(false)
        setPostText("")
        setImgUrl("")
        
        
       } catch (err) {
         if(err.response?.data && err.response?.data?.error){
           showToast("Error", "error", err.response.data.error)
         }else{
          showToast("Error", "error", err.response?.statusText)
         }
         console.log("ERROR", err);
         
       }finally {
        setLoading(false)
       }
    }

    return (
        <>

            <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
                <DialogTrigger asChild>
                    <Button
                        position={"fixed"}
                        bottom={10}
                        right={5}
                        bg={useColorModeValue("gray.300", gray.dark)}
                        color={useColorModeValue(gray.dark, "gray.300")}
                        size={{base: "sm", sm: "md"}}
                    >
                        <IoAdd />
                        
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                    </DialogHeader>
                    <DialogBody pb={6}>
                        
                          <Textarea
                            name="textArea"
                            placeholder="Post content goes here..."
                            onChange={handleTextChange}
                            value={postText}
                          />
                          <Text
                            fontSize={"xs"}
                            fontWeight={"bold"}
                            textAlign={"right"}
                            margin={1}
                            color={"gray.800"}
                          >
                            {rem}/{MAX_CHAR}
                          </Text>
                          <Input
                            type="file"
                            hidden
                            ref={ImageRef}
                            onChange={handleImageChange}
                          />
                          <BsFillImageFill
                            style={{marginLeft: "5px", cursor: "pointer"}}
                            size={16}
                            onClick={() => ImageRef.current.click()}
                          />  
                        

                        {imgUrl && (
                          <Flex mt={5} position={"relative"}>
                             <Image src={imgUrl} alt="Selected img" />
                             <CloseButton
                               onClick={() => {
                                setImgUrl("")
                               }}
                               bg={"gray.800"}
                               position={"absolute"}
                               top={2}
                               right={2}
                             />
                          </Flex>
                        )}
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button 
                          colorScheme={"blue"}
                          onClick={handleCreatePost}
                          loading={loading}
                        >
                          Post
                        </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </>
    )
}

export default CreatePost