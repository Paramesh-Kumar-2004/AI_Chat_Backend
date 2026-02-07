import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()



const jwtSign = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    )
}

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY)
    }
    catch (err) {
        return err.message
    }
}

export { jwtSign, jwtVerify }