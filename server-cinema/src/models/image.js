const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    asset_id: {
        type: String,
        required: true,
    },
    public_id: String,
    signature: String,
    width: Number,
    height: Number,
    format: String,
    resource_type: String,
    bytes: Number,
    etag: String,
    url: {
        type: String,
        required: true,
    },
    secure_url: String,
    original_filename: String,
    isBanner: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Image", imageSchema);
