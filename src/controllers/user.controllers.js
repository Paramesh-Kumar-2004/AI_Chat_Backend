import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import APIFeatures from "../utils/apiFeatures.js";
import asyncHandler from "../utils/asyncHandler.js";



const updateMyProfile = asyncHandler(async (req, res) => {
    console.log("Entered Into Update User Details Controller")
    const { _id } = req.user;
    const {
        fullName,
        email,
        phoneNumber
    } = req.body

    if (!_id || !fullName || !email || !phoneNumber) {
        throw new ApiError(404, "Enter All The Fields")
    }

    const user = await User.findByIdAndUpdate(_id,
        { fullName, email, phoneNumber },
        { new: true }
    )

    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    res.status(200).json({
        message: "User Updated Successfully",
        user
    })
})


const getMyProfile = asyncHandler(async (req, res) => {
    console.log("Entered Into Get My Profile Controller")
    const { _id } = req.user;
    const user = await User.findOne({ _id })

    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    res.status(200).json({
        message: "User Fetched Successfully By User ID",
        user
    })
})


const deleteMyAccount = asyncHandler(async (req, res) => {
    console.log("Entered Into Delete My Account Controller")

    const { _id } = req.user;

    if (!_id) {
        throw new ApiError(404, "Id Is Required")
    }

    const deleteAccount = await User.findByIdAndUpdate(
        _id,
        { isDeleted: true },
        { new: true }
    )
    if (!deleteAccount) {
        throw new ApiError(404, "User Not Found")
    }

    res.status(200).json({
        message: "User Deleted Successfully",
        deleteAccount
    })
})


// Find Players
const findPlayers = asyncHandler(async (req, res) => {
    console.log("Entered Into Get All Users Controller")

    const features = new APIFeatures(
        User.find(),
        req.query
    ).search(["fullName"]).paginate()
    const users = await features.query
    const countDocument = await User.countDocuments()

    res.status(200).json({
        message: "Users Fetched Successfully",
        totalDocument: countDocument,
        count: users.length,
        users
    })
})


// Admin Routes

const getAllPlayers = asyncHandler(async (req, res) => {
    console.log("Entered Into Get All Users Controller")

    const features = new APIFeatures(
        User.find(),
        req.query
    ).filter().search(["fullName"]).paginate()
    const users = await features.query
    const countDocument = await User.countDocuments()

    res.status(200).json({
        message: "Users Fetched Successfully",
        totalDocument: countDocument,
        count: users.length,
        users
    })
})


const getPlayerById = asyncHandler(async (req, res) => {
    console.log("Entered Into Get User By Id Controller")
    const { userId } = req.params;

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    res.status(200).json({
        message: "User Fetched Successfully By User ID",
        user
    })
})



export {
    // Private Routes
    updateMyProfile,
    getMyProfile,
    deleteMyAccount,
    findPlayers,

    // Admin Routes
    getPlayerById,
    getAllPlayers,
}