import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

export const Organization = mongoose.model("Organization", schema);
