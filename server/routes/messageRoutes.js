import express from "express"
import { sendMessage, getMessages,  getConversations } from "../controllers/messageController.js"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/conversations", protectRoute, getConversations)
router.post("/", protectRoute, sendMessage)
router.get("/:otherUserId", protectRoute, getMessages)


export default router