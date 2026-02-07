import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.PASS_MAIL,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = async (email, subject, message) => {
    try {
        await transporter.sendMail({
            from: process.env.PASS_MAIL,
            to: email,
            subject: subject,
            text: message
        })
        console.log("Email Sent Successfully")
    }
    catch (err) {
        console.log(err)
    }
}

export default sendMail;