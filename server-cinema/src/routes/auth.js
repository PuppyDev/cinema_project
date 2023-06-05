const express = require("express");

const authController = require("../controllers/auth");
const { checkSignUp, checkSignIn, checkChangePass, checkResetPass } = require("../middlewares/checkValidator");

const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.post("/signUp", checkSignUp(), authController.SignUp);

router.post("/signIn", checkSignIn(), authController.SignIn);

router.post("/verifiedOtp", isAuth, authController.VerifiedOtp);

router.get("/resendOtp", isAuth, authController.ResendOtp);

router.patch("/resetPass", checkResetPass(), authController.ResetPass);

router.patch("/changePass", isAuth, checkChangePass(), authController.ChangePass);

module.exports = router;
