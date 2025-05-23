import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js"
import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose"
import postModel from "../models/postModel.js"



const checkAuth = async(req, res) => {
  const user = req.user
  try {
    res.status(200).json(user)
  } catch (error) {
    console.log("Error in checkAuth function", error);
    
  }
}

const getUserProfile = async (req, res) => {
    //We will fetch user profile either with username or userId
    //query is either username or userId


    try {
        const { query } = req.params
        let user

        //query is userId
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await userModel.findOne({ _id: query }).select("-password").select("-updatedAt")
        } else {
            //query is a username 
            user = await userModel.findOne({ username: query }).select("-password").select("-updatedAt")
        }


        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("Error in profile: ", error.message);
    }
}

const signupUser = async (req, res) => {

    try {
        const { name, email, username, password } = req.body

        if (!name || !email || !username || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const user = await userModel.findOne({ $or: [{ email }, { username }] })

        if (user) {
            return res.status(400).json({ error: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            username,
            password: hashedPassword
        })
        await newUser.save()

        if (newUser) {
            generateTokenAndSetCookies(newUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("Error in signupUser: ", error.message);

    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) return res.status(400).json({ error: "All fields are required" })

        const user = await userModel.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid username or password" })

        if(user.isFrozen){
         user.isFrozen = false
         await user.save()
        }  

        generateTokenAndSetCookies(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToFollowOrUnfollow = await userModel.findById(id)
        const loggedInUser = await userModel.findById(req.user._id)

        if (!userToFollowOrUnfollow || !loggedInUser) return res.status(400).json({ error: "User not found" })

        if (id === req.user._id.toString()) return res.status(400).json({ error: "You cannot follow/unfollow yourself" })

        const isFollowing = loggedInUser.following.includes(id)

        if (isFollowing) {
            await userModel.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            await userModel.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            res.status(200).json({ message: "User unfollow successfully" })
        } else {
            await userModel.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            await userModel.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            res.status(200).json({ message: "User follow successfully" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("Error in followUnFollowUser: ", error.message);

    }
}

const updateUser = async (req, res) => {
    const { name, username, email, password, bio } = req.body;

    let { profilePic } = req.body

    const userId = req.user._id
    try {

        const user = await userModel.findById(userId).select("-password");
        if (!user) return res.status(400).json({ error: "User not found" });

        if (req.params.id !== user._id.toString())
            return res.status(400).json({ error: "You cannot update other user's profile" })

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic)
            profilePic = uploadedResponse.secure_url
        }

        user.name = name || user.name
        user.username = username || user.username
        user.email = email || user.email
        user.profilePic = profilePic || user.profilePic
        user.bio = bio || user.bio


        await user.save();

        //Find all posts that this user replied and update username and userProfilePic fields
        await postModel.updateMany(
            { "replies.userId": userId },
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic
                }
            },
            { arrayFilters: [{ "reply.userId": userId }] }
        )

        return res.status(200).json(user);




    } catch (error) {
        res.status(500).json({ error: error })
        console.log("Error in updateUser: ", error);
    }
}

const getSuggestedUsers = async (req, res) => {

    try {
        // exclude the logged in user from suggested users array,
        //exclude users that the current user is already following
        const userId = req.user._id

        const userFollowedByYou = await userModel.findById(userId).select("following")
       
        

        const users = await userModel.aggregate([
            {
                $match: {
                    _id: {$ne: userId}
                }
            },
            {
                $sample: {size:10}
            }
        ])

        const filteredUsers = users.filter(user => !userFollowedByYou.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0,4)

        suggestedUsers.forEach(user => user.password = null)

        res.status(200).json(suggestedUsers)
        
    } catch (error) {
    res.status(500).json({ error: error })
    console.log("Error in getSuggestedUsers: ", error);
   }




    //GREAT IDEA
    // try {
    //   let suggestedUsers = [];

    //   const userDetails = await userModel.findById(req.user._id).populate("following");



    //   await Promise.all(
    //     userDetails.following.map(async (followedUser) => {
    //       const populated = await userModel.findById(followedUser._id).populate("following");
    //       suggestedUsers.push(...populated.following);

    //     })
    //   );

    //   // Flatten and dedupe
    //   const acceptedUsers = suggestedUsers.filter(
    //     (user, index, self) =>
    //       index === self.findIndex((u) => u._id.toString() === user._id.toString() && u._id.toString() !== req.user._id.toString() && !userDetails.followers.includes(user._id))
    //   );

    //   res.status(200).json(acceptedUsers);
    // } catch (error) {
    //   console.error("Error in getSuggestedUsers:", error);
    //   res.status(500).json({ error: error.message });
    // }
  };


  const freezeAccount = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(!user) {
            return res.status(404).json({ error: "User not found" })
        }

        user.isFrozen = true
        await user.save()

        res.status(200).json({ success: true })
        
    } catch (error) {
     console.error("Error in freezeAccount:", error);
     res.status(500).json({ error: error.message });
    }
  } 



export { checkAuth, signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile, getSuggestedUsers, freezeAccount }