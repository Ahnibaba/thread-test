import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

dotenv.config()
connectDB()

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json()) // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })) // To parse form data in the req.body
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)


app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    
})