const { body } = require("express-validator");

const User = require("../models/user");

exports.checkSignUp = () => {
    return [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email.")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("Email address already exists!");
                    }
                });
            })
            .normalizeEmail(),
        body("phone")
            .trim()
            .isMobilePhone()
            .withMessage("Please enter a valid phone number.")
            .custom((value, { req }) => {
                return User.findOne({ phone: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject("Phone already exists!");
                    }
                });
            }),
        body("password")
            .trim()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            })
            .withMessage("Please enter a valid password."),
        body("name").trim().not().isEmpty(),
        body("gender")
            .trim()
            .custom((value) => {
                return value.toLowerCase() === "male" || value.toLowerCase() === "female";
            }),
    ];
};

exports.checkSignIn = () => {
    return [
        body("email").trim().isEmail().withMessage("Please enter a valid email.").normalizeEmail(),
        body("password")
            .trim()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            })
            .withMessage("Please enter a valid password."),
    ];
};

exports.checkCreatePost = () => {
    return [body("content").trim().isLength({ min: 5 }).withMessage("content must at least 5 characters")];
};

exports.checkChangePass = () => {
    return [
        body("password")
            .trim()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            })
            .withMessage("Please enter a valid password."),
        body("newPw")
            .trim()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1,
            })
            .withMessage("Please enter a valid new password."),
        body("confirmNewPw")
            .exists({ checkFalsy: true })
            .withMessage("You must type a confirmation password")
            .custom((value, { req }) => value === req.body.newPw)
            .withMessage("The confirm new password do not match"),
    ];
};

exports.checkResetPass = () => {
    return [body("email").trim().isEmail().withMessage("Please enter a valid email.").normalizeEmail()];
};

exports.checkParamsAddGroup = () => {
    return [body("name").trim().not().isEmpty()];
};
