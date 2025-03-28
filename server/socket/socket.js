import { Server } from "socket.io"
import http from "http"
import express from "express"
import messageModel from "../models/messageModel.js"
import conversationModel from "../models/conversationModel.js"


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
})

const userSocketMap = {}

export const getRecipientSocketId = (recipientId) => {
   return userSocketMap[recipientId]
}


io.on("connection", (socket) => {
   console.log("user connected", socket.id);
   const userId = socket.handshake.query.userId

   if(userId !== "undefined") {
     userSocketMap[userId] = socket.id
   }


   io.emit("getOnlineUsers", Object.keys(userSocketMap))

   socket.on("markMessagesAsSeen", async({ conversationId, userId }) => {
    console.log("conversationId", conversationId);
    console.log("userid", userId);
    
    
    try {
      await messageModel.updateMany(
        {conversationId: conversationId, seen: false},
        {
          $set: { seen: true }
        }
      )
      await conversationModel.updateOne(
         { _id: conversationId },
         { $set: { "lastMessage.seen": true } }
      )

 
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId })
    } catch (error) {
      console.log(error);
      
    }
   })

   socket.on("sendChanges", async ({ data, recipientId }) => {
    let conversationData = await conversationModel.findOne({ _id: data.conversationId }).populate({
      path: "participants",
      select: "username profilePic"
    })

    const update = conversationData.participants.filter(e => e._id.toString() !== recipientId.toString())

    conversationData.participants = update
  
    io.to(userSocketMap[recipientId]).emit("sendChanges", conversationData)
  })

  socket.on("typing", ({ recipientId, text }) => {

      io.to(userSocketMap[recipientId]).emit("typing", text)
      
  })


  socket.on("getAllConversations", async({ recipientId }) => {
    const conversations = await conversationModel.find().populate({
      path: "participants",
      select: "username profilePic"
    })
    
    console.log("333", conversations);

    io.to(userSocketMap[recipientId]).emit("getAllConversations", conversations)

 })


   socket.on("disconnect", () => {
    console.log("user disconnected")
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    
   })
    
})



export { io, server, app }