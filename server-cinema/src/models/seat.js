const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const seatSchema = new Schema({
    row: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    type_seat: {
        type: String,
        required: true,
        enum: ["normal", "vip", "couple"],
        default: "vip",
    },
    status: {
        type: String,
        required: true,
        enum: ["hold", "sold"],
    },
    screen_room: {
        type: Schema.Types.ObjectId,
        ref: "ScreenRoom",
    },
});

module.exports = mongoose.model("Seat", seatSchema);
