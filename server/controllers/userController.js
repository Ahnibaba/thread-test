import userModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js"


const getUserProfile = async (req, res) => {
    const { username } = req.params

    try {
        const user = await userModel.findOne({ username }).select("-password").select("-updatedAt")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in profile: ", error.message);
    }
}

const signupUser = async (req, res) => {

    try {
        const { name, email, username, password } = req.body

        const user = await userModel.findOne({ $or: [{ email }, { username }] })

        if (user) {
            return res.status(400).json({ mesage: "User already exists" })
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
                username: newUser.username
            })
        } else {
            res.status(400).json({ messsage: "Invalid user data" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in signupUser: ", error.message);

    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) return res.status(400).json({ message: "Invalid username or password" })

        generateTokenAndSetCookies(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params
        const userToFollowOrUnfollow = await userModel.findById(id)
        const loggedInUser = await userModel.findById(req.user._id)

        if (!userToFollowOrUnfollow || !loggedInUser) return res.status(400).json({ message: "User not found" })

        if (id === req.user._id.toString()) return res.status(400).json({ message: "You cannot follow/unfollow yourself" })

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
        res.status(500).json({ message: error.message })
        console.log("Error in followUnFollowUser: ", error.message);

    }
}

const updateUser = async (req, res) => {
    const { name, username, email, password, profilePic, bio } = req.body;
    try {

        const user = await userModel.findById(req.user._id);
        if (!user) return res.status(400).json({ message: "User not found" });

        if (req.params.id !== user._id.toString())
            return res.status(400).json({ message: "You cannot update other user's profile" })

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        user.name = name || user.name
        user.username = username || user.username
        user.email = email || user.email
        user.profilePic = profilePic || user.profilePic
        user.bio = bio || user.bio

        await user.save();

        return res.status(200).json({ message: "User updated successfully", user });




    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log("Error in updateUser: ", error.message);
    }
}



export { signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, getUserProfile }