import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";

async function sendMessage(req, res){
  try {
    const { recipientId, message } = req.body
    const senderId = req.user._id

    let conversation = await conversationModel.findOne({
        participants: { $all: [senderId, recipientId] }
    })

    if(!conversation) {
      conversation = new conversationModel({
        participants: [senderId, recipientId],
        lastMessage: {
            text: message,
            sender: senderId
        }
      })
      await conversation.save()
    }

    const newMessage = new messageModel({
        conversationId: conversation._id,
        sender: senderId,
        text: message
    })

    await Promise.all([
        newMessage.save(),
        conversationModel.updateOne({
            lastMessage: {
                text: message,
                sender: senderId
            }
        })
    ])

    res.status(201).json(newMessage)

  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in sendMessage: ", error.message);
  }
}



async function getMessages(req, res) {
   const { otherUserId } = req.params
   const userId = req.user._id
   try {
     const conversation = await conversationModel.findOne({
       participants: { $all: [userId, otherUserId] }
     })

     if(!conversation) {
      return res.status(404).json({ error: "Conversation not found" })
     }

     const messages = await messageModel.find({
       conversationId: conversation._id
     }).sort({createdAt: 1})

     res.status(200).json(messages)


   } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in getMessages: ", error.message);
   }
}


async function  getConversations(req, res) {
  const userId = req.user._id
  try {
    const conversations = await conversationModel.find({ participants: userId }).populate({
      path: "participants",
      select: "username profilePic"
    })

    res.status(200).json(conversations)


  } catch (error) {
    res.status(500).json({ error: error.message })
    console.log("Error in : ", error.message);
  }
}


export { sendMessage, getMessages,  getConversations }


// res.status(500).json({ error: error.message })
// console.log("Error in : ", error.message);