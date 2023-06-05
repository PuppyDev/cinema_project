const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const { checkErrorMiddleware } = require("../helpers/checkErrorsValidate");
const { generatePassword } = require("../helpers");

const User = require("../models/user");
const Otp = require("../models/otp");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: "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",
        },
    })
);

const generateOtp = () => otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

const hashPw = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hasdedpw = bcrypt.hashSync(password, salt);
    return hasdedpw.toString();
};

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

exports.SignUp = async (req, res, next) => {
    try {
        checkErrorMiddleware(req);
        const { email, phone, password, name, gender } = req.body;

        const otp = new Otp({ otp: generateOtp(), expiration_time: AddMinutesToDate(new Date(), 60) });
        const newOtp = await otp.save();

        const user = new User({ email, phone, password: hashPw(password), name, otp: newOtp._id, gender });

        await transporter.sendMail({
            to: email,
            from: process.env.FROM_EMAIL,
            subject: "Signup successfully!!!",
            html: `<h1> You successfully signed up! </h1></br><p>Your otp is ${otp.otp}</p>`,
        });

        await user.save();

        res.status(201).json({
            message: "User created!",
            userId: user._id,
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.SignIn = async (req, res, next) => {
    try {
        checkErrorMiddleware(req);
        const { email, password } = req.body;

        const user = await User.findOne({ email: email }).select("-posts -otp");

        if (!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            throw error;
        }

        const isEqual = bcrypt.compareSync(password, user.password);

        if (!isEqual) {
            const error = new Error("Wrong password!");
            error.statusCode = 401;
            throw error;
        }

        const generateToken = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });
        res.status(200).json({ token: generateToken, user });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.VerifiedOtp = async (req, res, next) => {
    const userId = req.userId;

    const { otp: otpEntered } = req.body;

    try {
        const user = await User.findById(userId).populate("otp");

        if (!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            throw error;
        }

        const { verified, otp } = user;

        if (!verified) {
            const isExpired = moment(otp?.expiration_time).isBefore(new Date());
            const isValidOtp = otpEntered.trim() == otp?.otp?.trim();

            if (isExpired) {
                const error = new Error("A otp has expired!!!");
                error.statusCode = 402;
                throw error;
            } else if (isValidOtp) {
                user.verified = true;
                user.otp = undefined;

                await user.save();

                await Otp.findByIdAndRemove(otp._id);

                return res.json({
                    message: "success",
                });
            } else {
                const error = new Error("Wrong otp!!!");
                error.statusCode = 402;
                throw error;
            }
        }

        return res.json({
            message: "verified",
        });
    } catch (err) {
        console.log("🚀 ~ file: auth.js:136 ~ exports.VerifiedOtp= ~ err:", err);
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.ResendOtp = async (req, res, next) => {
    try {
        const type = req.params.type || "Email";
        const userId = req.userId;

        const user = await User.findById(userId).populate("otp");
        const otp = await Otp.findByIdAndUpdate(user.otp._id, { otp: generateOtp(), expiration_time: AddMinutesToDate(new Date(), 60) });

        if (type === "Email") {
            transporter.sendMail({
                to: user.email,
                from: process.env.FROM_EMAIL,
                subject: "OTP resend",
                html: `<h1> Your otp is: ${otp.otp}</h1>`,
            });
        } else {
            // add send otp using SIM in here
        }

        res.json({
            message: "send",
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.ResetPass = async (req, res, next) => {
    try {
        const { email } = await req.body;
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            throw error;
        }

        const newPw = generatePassword();

        user.password = hashPw(newPw);
        await user.save();

        await transporter.sendMail({
            to: email,
            from: process.env.FROM_EMAIL,
            subject: "Change password successfully",
            html: `<h1> Change password successfully </h1></br><p>Your new password is ${newPw}</p>`,
        });

        res.json({
            message: "Send new password successfully",
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

exports.ChangePass = async (req, res, next) => {
    const userId = req.userId;

    try {
        const { password, newPw, confirmNewPw } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            throw error;
        }

        const isEqual = bcrypt.compare(password, user.password);

        if (!isEqual) {
            const error = new Error("Wrong password!");
            error.statusCode = 401;
            throw error;
        }

        if (newPw !== confirmNewPw) {
            const error = new Error("Password must match");
            error.statusCode = 401;
            throw error;
        }

        user.password = hashPw(newPw);
        await user.save();

        res.json({
            message: "change password successfully",
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
