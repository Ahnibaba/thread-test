import postModel from "../models/postModel.js"
import userModel from "../models/userModel.js"

const createPost = async(req, res) => {
  const { postedBy, text, img } = req.body


  try{
    
  if(!postedBy || !text) {
    return res.status(400).json({ message: "PostedBy and text fields are required" })
  }
  const user = await userModel.findById(postedBy)
  if(!user){
    return res.status(400).json({ message: "User not found" })
  }
  if(user._id.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Unauthorized to create post" })
  }

  const maxLength = 500

  if(text.length > maxLength){
    return res.status(401).json({ message: `Text must be less than ${maxLength} characters`})
  }

  const newPost = new postModel({
    postedBy,
    text,
    img
  })
  await newPost.save()
  res.status(201).json({ message: "Post created successfully", newPost })

  }catch(error){
    res.status(500).json({ message: error.message })
    console.log("Error in createPost: ", error.message);
    
  }
}

const getPost = async(req, res) => {
  try {
    const post = await postModel.findById(req.params.id)
   
    if(!post) {
      return res.status(404).json({ mesage: "Post not found" })
    }

    res.status(200).json(post)

  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log("Error in getPost: ", error.message);
  }
}

const deletePost = async(req, res) => {
  try{
    const post = await postModel.findById(req.params.id)

    if(!post){
      return res.status(404).json({ message: "Post not found" })  
    }

    if(post.postedBy.toString() !== req.user._id.toString()){
      return res.status(401).json({ message: "Unauthorized to delete post" })
    }

    await postModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: `Post with id ${post.postedBy} has been successfully deleted` })

  } catch(error) {
    res.status(500).json({ message: error.message })
    console.log("Error in deletePost: ", error.message);
  }
}

const likeUnlikePost = async(req, res) => {
  try{
    const { id: postId } = req.params
    const userId = req.user._id

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({ message: "Post not found" })
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
    res.status(500).json({ message: error.message })
    console.log("Error in likeUnlikePost: ", error.message);
  }
}

const replyToPost = async(req, res) => {
  try{
    const { text } = req.body
    const { id: postId } = req.params
    const userId = req.user._id
    const userProfilePic = req.user._id
    const username = req.user.username

    if(!text){
        return res.status(400).json({ message: "Text field required" }) 
    }
    
    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    
    post.replies.push({
        userId,
        text,
        userProfilePic,
        username
    })
    await post.save()
    res.status(200).json({ message: "Replied successfully", post })

  } catch(error) {
    res.status(500).json({ message: error.message })
    console.log("Error in replyPost: ", error.message);
  }
}

const getFeedPosts = async(req, res) => {
  try {
    const userId = req.user._id
    const user = await userModel.findById(userId)
    if(!user) {
        return res.status(404).json({ message: "User not found" })
    }

    const following = user.following;

    const feedPosts = await postModel.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })
    res.status(200).json(feedPosts)
    
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log("Error in getFeedPosts: ", error.message);
  }
}


export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts }