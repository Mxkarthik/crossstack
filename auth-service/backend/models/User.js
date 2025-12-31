import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    otp: String,
    otpExpire: Date,
    refreshToken: String,
    csrfToken: String,
},
    { timestamps: true }
);

export const User = mongoose.model("User", schema);