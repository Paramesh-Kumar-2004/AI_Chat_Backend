import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { jwtSign } from "../utils/jwt.utils.js";
import sendMail from "../utils/sendMail.js";



const registerUser = asyncHandler(async (req, res) => {

    console.log("Entered Into Register Controller")
    const {
        fullName,
        email,
        password
    } = req.body;

    if (!fullName || !email || !password) {
        throw new ApiError(404, "Enter All The Fields")
    }

    const exsitingUser = await User.findOne({ email })
    if (exsitingUser) {
        throw new ApiError(400, "User Already Registered")
    }

    const addUser = await User.create({
        fullName, email, password
    })

    res.status(200).json({
        message: "Register Successfully",
    })
})


const loginUser = asyncHandler(async (req, res) => {
    console.log("Entered Into Login User Controller")

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(404, "Enter All The Fields")
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        throw new ApiError(404, "Email Not Found")
    }

    if (!await user.isValidPassword(password)) {
        throw new ApiError(404, "Invalid Password")
    }

    if (await user.isValidPassword(password)) {

        const token = await jwtSign(user._id)
        res.status(200).json({
            message: "Login Successfull",
            email,
            token
        })
    }

})


const logoutUser = asyncHandler(async (req, res) => {
    console.log("Entered Into Logout User Controller")
    const { userId } = req.user._id;

    if (!userId) {
        throw new ApiError(404, "User Not Found")
    }

    await User.findByIdAndUpdate(userId, {
        $unset: { passwordResetToken: "" }
    });

    res.status(200).json({
        message: "Logout Successfull"
    })
})


const forgotPassword = asyncHandler(async (req, res) => {
    console.log("Entered Into Forgot Password Controller")
    const { email } = req.body;

    if (!email) {
        throw new ApiError(404, "Enter All The Fields")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    const token = await jwtSign(user._id)
    user.passwordResetToken = token
    await user.save()

    await sendMail(
        user.email,
        "Password Reset Link",
        `Please Click On The Link To Reset Your Password \n${process.env.CLIENT_URL}/auth/reset-password/${token}`
    )

    res.status(200).json({
        message: "Password Reset Link Sent Successfully"
    })
})


const resetPassword = asyncHandler(async (req, res) => {
    console.log("Entered Into Reset Password Controller")
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        throw new ApiError(404, "Enter All The Fields")
    }

    const user = await User.findOne({ passwordResetToken: token })
    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    user.password = password
    user.passwordResetToken = undefined
    await user.save()

    await sendMail(
        user.email,
        "Password Reset Successfully",
        `Your Password Was Reset`
    )

    res.status(200).json({
        message: "Password Reset Successfully"
    })
})


const changePassword = asyncHandler(async (req, res) => {
    console.log("Entered Into Change Password Controller")
    const { _id } = req.user;
    const { oldPassword, newPassword } = req.body

    if (!_id || !oldPassword || !newPassword) {
        throw new ApiError(404, "Enter All The Fields")
    }

    const user = await User.findById(_id)
    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    const checkPassword = await user.isValidPassword(oldPassword)

    if (!checkPassword) {
        throw new ApiError(404, "Invalid Password")
    }

    if (checkPassword) {
        user.password = newPassword
        await user.save()
        await sendMail(
            user.email,
            "Password Reset Successfully",
            `Your Password Was Changed`
        )

        res.status(200).json({
            message: "Password Changed Successfully"
        })
    }
})


export {
    // Public Routes
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,

    // Private Routes
    logoutUser,
    changePassword,
}