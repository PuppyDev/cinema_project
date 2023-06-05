const express = require("express");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const commonController = require("../controllers/common");

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

const router = express.Router();

router.post("/uploadImages", isAuth, upload.array("files"), commonController.UploadImage);

router.post("/deleteImages", isAuth, commonController.DeleteImages);

router.get("/banners", isAuth, commonController.GetBanners);

router.post("/banners/add", isAuth, isAdmin, upload.array("files"), commonController.AddBanners);

router.delete("/banners/delete", isAuth, isAdmin, commonController.DeleteBanners);

module.exports = router;
