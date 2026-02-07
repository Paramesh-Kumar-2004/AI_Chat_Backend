import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


const DB_URL = process.env.DB_URL

const connectDB = async () => {
    await mongoose.connect(DB_URL)
        .then(() => {
            console.log("Database Connected Successfully")
        })
        .catch(err => console.log("Error :", err))
}

export default connectDB