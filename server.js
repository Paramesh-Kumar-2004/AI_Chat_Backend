import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Database
import connectDB from "./src/db/connectDB.js"

// Routes
import AuthRoutes from "./src/routes/auth.routes.js"
import UserRoutes from "./src/routes/user.routes.js"
import ChatRoutes from "./src/routes/chat.routes.js"

// Error Middleware
import errorMiddleware from "./src/middlewares/error.middleware.js"


// Loading Environment Variables First
dotenv.config()

const app = express()


// Default Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/public", express.static("public"))
app.use(cors({
    origin: "https://paramesh-kumar-2004.github.io",
    credentials: true
}))


// Connect DB
connectDB()


// Routes
app.use("/api/v1/auth", AuthRoutes)
app.use("/api/v1/user", UserRoutes)
app.use("/api/v1/chat", ChatRoutes)


// Health Check
app.get("/", (req, res) => {
    res.status(200).send("AI Chat Server Running...")
})


// 404 API Not Found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API Not Found"
    })
})


// Error Middleware
app.use(errorMiddleware)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Started At The Port : ${PORT}`)
})