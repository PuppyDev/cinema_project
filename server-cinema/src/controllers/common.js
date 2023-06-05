const cloudinary = require("../configs/cloudinary.config");
const { PAGE, LIMIT } = require("../consts/pagination");
const paginate = require("../helpers/pagination");
const Image = require("../models/image");

const handleUploadImage = async (files, isBanner = false) => {
    if (!files || files.length === 0) {
        const error = new Error("Can not found any images. You need to upload more than 1 image");
        error.statusCode = 404;
        throw error;
    }

    const uploadPromises = files.map((file) => {
        const imagePath = file.path;
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(imagePath, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const saveToDB = uploadResults.map((image) => {
        const newImage = new Image({ ...image, isBanner });

        return new Promise((resolve, reject) => {
            newImage
                .save()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => reject(error));
        });
    });

    const resultUploadImageToDB = await Promise.all(saveToDB);

    return resultUploadImageToDB;
};

exports.UploadImage = async (req, res, next) => {
    try {
        const files = await req.files;
        const resultUploadImageToDB = handleUploadImage(files);

        return res.json({ message: "Images upload successfully!!!", data: resultUploadImageToDB });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.DeleteImages = async (req, res, next) => {
    try {
        const { publicIds } = req.body;

        const deletionPromises = publicIds.map((publicId) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        const deletionResults = await Promise.all(deletionPromises);

        return res.json({ message: "Delete images successfully!!!", data: deletionResults });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.GetBanners = async (req, res, next) => {
    try {
        const currentPage = Number(req.query._page) || PAGE;
        const perpage = Number(req.query._limit) || LIMIT;
        const options = {
            search: {
                isBanner: true,
            },
        };
        const response = await paginate(Image, currentPage, perpage, options);
        res.json({ message: "Get Banners Successfully!!!", ...response });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.AddBanners = async (req, res, next) => {
    try {
        const files = req.files;
        const response = await handleUploadImage(files, true);
        res.json({ message: "Add Banners Successfully!!!", result: response });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.DeleteBanners = async (req, res, next) => {};
