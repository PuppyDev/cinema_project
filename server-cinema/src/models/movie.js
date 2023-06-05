const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        sub_language: String,
        release_date: {
            type: Schema.Types.Date,
            required: true,
        },
        creator: {
            director: {
                type: String,
                required: true,
            },
            cast: [
                {
                    type: String,
                    required: true,
                },
            ],
        },
        end_date: {
            type: Schema.Types.Date,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        video_trailer: {
            type: String,
            required: true,
        },
        rated: {
            type: String,
            required: true,
            enum: ["T13", "T16", "T18", "K", "P"],
            default: "P",
        },
        isCommingSoon: {
            type: String,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Movie", movieSchema);
