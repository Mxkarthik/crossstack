import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
    },
    token: { // Hashed token
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

export const Invite = mongoose.model("Invite", schema);
