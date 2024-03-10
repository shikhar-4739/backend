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

export { app }