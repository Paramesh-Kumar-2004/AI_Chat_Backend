import mongoose from "mongoose";
import bcrypt from "bcrypt"



const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin", "superadmin"],
        default: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String
}, { timestamps: true })


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});


UserSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.model("User", UserSchema);