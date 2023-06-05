const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cinemaSchema = new Schema({
    hotline: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    screenRooms: [
        {
            type: Schema.Types.ObjectId,
            ref: "ScreenRoom",
        },
    ],
});

module.exports = mongoose.model("Cinema", cinemaSchema);
