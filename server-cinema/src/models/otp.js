const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    otp: {
        type: String,
        allowNull: false,
    },
    expiration_time: {
        type: Date,
        required: true,
    },
    verified_for: {
        type: String,
        default: "account",
    },
});

module.exports = mongoose.model("Otp", otpSchema);
