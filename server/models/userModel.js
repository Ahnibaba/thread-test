import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    bio: {
        type: String,
        default: ""
    },
    isFrozen:{
        type: Boolean,
        default: false
    }


}, { timestamps: true })

const userModel = mongoose.model("User", userSchema)

export default userModel