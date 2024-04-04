import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,          // kis kis ko access dena hai 
    credentials: true
}))

app.use(express.json({limit: "16kb"}))                              // json format ko accept karne ke liye
app.use(express.urlencoded({extended: true, limit: "16kb"}))        // url sei accept karne ke liye
app.use(express.static("public"))                                   // files or folder ko store karne ke liye in public folder
app.use(cookieParser())                                             // used for cookies

// routes import 
import userRouter from "./routes/user.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)   // when it hit users it calls the userRouter
app.use("api/v1/comments", commentRouter)
app.use("api/v1/tweets", tweetRouter)

export { app }