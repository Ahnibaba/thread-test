import postModel from "../models/postModel.js"
import userModel from "../models/userModel.js"
import { v2 as cloudinary } from "cloudinary"

const createPost = async(req, res) => {
  const { postedBy, text } = req.body
  let { img } = req.body


  try{
    
  if(!postedBy || !text) {
    return res.status(400).json({ error: "PostedBy and text fields are required" })
  }
  if(img) {
    const uploadedImage = await cloudinary.uploader.upload(img)
    img = uploadedImage.secure_url
  }
  const user = await userModel.findById(postedBy)
  if(!user){
    return res.status(400).json({ error: "User not found" })
  }
  if(user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ error: "Unauthorized to create post" })
  }

  const maxLength = 500

  if(text.length > maxLength){
    return res.status(400).json({ error: `Text must be less than ${maxLength} characters`})
  }

  const newPost = new postModel({
    postedBy,
    text,
    img
  })
  await newPost.save()
  res.status(201).json({ message: "Post created successfully", newPost })

  }catch(error){
    res.status(500).json({ error: error.message })
    console.log("Error in createPost: ", error.message);
    
  }
}

const getPost = async(req, res) => {
  try {

    
    const post = await postModel.findById(req.params.id)
   
    if(!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    console.log(post);
    

    res.status(200).json(post)

  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in getPost: ", error.message);
  }
}

const deletePost = async(req, res) => {
  try{
    const post = await postModel.findById(req.params.id)

    if(!post){
      return res.status(404).json({ error: "Post not found" })  
    }

    if(post.postedBy.toString() !== req.user._id.toString()){
      return res.status(401).json({ error: "Unauthorized to delete post" })
    }

    if(post.img) {
      const imgId = post.img.split("/").pop().split(".")[0]
      await cloudinary.uploader.destroy(imgId)
    }

    await postModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: `Post with id ${post.postedBy} has been successfully deleted` })

  } catch(error) {
    res.status(500).json({ error: error.message })
    console.log("Error in deletePost: ", error.message);
  }
}

const likeUnlikePost = async(req, res) => {
  try{
    const { id: postId } = req.params
    
    
    const userId = req.user._id

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({ error: "Post not found" })
    }

    const userLikedPost = post.likes.includes(userId)

    if(userLikedPost) {
      await postModel.updateOne({ _id: postId }, { $pull: { likes: userId } })
      res.status(200).json({ message: "Post unliked successfully" })
    } else {
        post.likes.push(userId)
        await post.save()
        res.status(200).json({ message: "Post liked successfully" })
    }

  } catch(error){
    res.status(500).json({ error: error.message })
    console.log("Error in likeUnlikePost: ", error.message);
  }
}

const replyToPost = async(req, res) => {
  try{
    const { text } = req.body
    const { id: postId } = req.params
    const userId = req.user._id
    const username = req.user.username
    const userProfilePic = req.user.profilePic


    if(!text){
        return res.status(400).json({ error: "Text field required" }) 
    }
    
    const post = await postModel.findById(postId)
    console.log(post);
    

    if(!post) {
        return res.status(404).json({ error: "Post not found" })
    }

    const reply = {
      userId,
      text,
      username,
      userProfilePic
  }
    post.replies.push(reply)
    await post.save()

    res.status(200).json(reply)

  } catch(error) {
    res.status(500).json({ error: error.message })
    console.log("Error in replyPost: ", error.message);
  }
}

const getPostReplies = async (req, res) => {
  const { id : postId } = req.params
  
  try {
    const post = await postModel.findById({ _id: postId })
    const replies = await post.replies
    
    res.status(200).json(replies)
  } catch (error) {
    console.log(error);
    
  }
}

const getFeedPosts = async(req, res) => {
  try {
    const userId = req.user._id
    const user = await userModel.findById(userId)
    if(!user) {
        return res.status(404).json({ error: "User not found" })
    }

    const following = user.following;
    
    
    

    const feedPosts = await postModel.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })
    res.status(200).json(feedPosts)
    
    
    
  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in getFeedPosts: ", error.message);
  }
}

const getUserPosts  = async (req, res) => {
  const { username } = req.params

  try {
    const user = await userModel.findOne({ username })

    if(!user) return res.status(404).json({ error: "User not found" })
    
    const posts = await postModel.find({ postedBy: user._id }).sort({ createdAt: -1 })

    res.status(200).json(posts)
      
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getPostReplies, getFeedPosts, getUserPosts }