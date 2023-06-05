const { body } = require("express-validator");

exports.checkParamsAddMovie = () => {
    return [
        body("name").trim().not().isEmpty().withMessage("name cannot be empty"),
        body("description").trim().not().isEmpty().withMessage("description cannot be empty"),
        body("language").trim().not().isEmpty().withMessage("language cannot be empty"),
        body("release_date").trim().not().isEmpty().withMessage("release date cannot be empty"),
        body("director").trim().not().isEmpty().withMessage("director date cannot be empty"),
        body("cast").trim().not().isEmpty().withMessage("release date cannot be empty"),
        body("end_date").trim().not().isEmpty().withMessage("release date cannot be empty"),
        body("thumbnail").trim().not().isEmpty().withMessage("thumbnail cannot be empty"),
        body("video_trailer").trim().not().isEmpty().withMessage("video trailer  cannot be empty"),
        body("rated")
            .trim()
            .not()
            .isEmpty()
            .withMessage("rated cannot be empty")
            .isIn(["T13", "T16", "T18", "K", "P"])
            .withMessage("rated must be one of T13, T16, T18, K, P"),
    ];
};
