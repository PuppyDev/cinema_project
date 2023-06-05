const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screenRoomSchema = new Schema({
    totals_seats: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    cinema: {
        type: Schema.Types.ObjectId,
        ref: "Cinema",
        required: true,
    },
});

module.exports = mongoose.model("ScreenRoom", screenRoomSchema);
