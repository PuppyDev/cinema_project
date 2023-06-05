const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        otp: {
            type: Schema.Types.ObjectId,
            ref: "Otp",
        },
        verified: {
            type: Boolean,
            default: "false",
        },
        role: {
            type: String,
            default: "basic",
            enum: ["basic", "supervisor", "admin"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
