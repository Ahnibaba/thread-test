import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  lastMessage: {
    text: String,
    img: {
      type: String,
      default: ""

    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seen: {
      type: Boolean,
      default: false
    }
  },

}, { timestamps: true })


const conversationModel = mongoose.model("Conversation", conversationSchema)

export default conversationModel