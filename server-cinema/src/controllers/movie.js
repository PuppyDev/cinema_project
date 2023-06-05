const mongoose = require("mongoose");
const { LIMIT, PAGE } = require("../consts/pagination");

const { checkErrorMiddleware } = require("../helpers/checkErrorsValidate");
const Movie = require("../models/movie");

exports.AddMovie = async (req, res, next) => {
    try {
        checkErrorMiddleware(req);
        const { name, description, language, sub_language, release_date } = req.body;
        const { cast, end_date, thumbnail, video_trailer, rated, director } = req.body;

        const movie = new Movie({
            name,
            description,
            language,
            sub_language,
            release_date,
            creator: {
                cast,
                director,
            },
            end_date,
            thumbnail,
            video_trailer,
            rated,
        });

        await movie.save();

        res.status(201).json({
            message: "Movie create successfully!!!",
            data: movie,
        });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        next(error);
    }
};

exports.EditMovie = async (req, res, next) => {
    try {
        checkErrorMiddleware(req);
        const { id } = req.params;
        const updateMovie = req.body;
        const filter = {
            _id: id,
        };
        const result = await Movie.findOneAndUpdate(filter, updateMovie, {
            new: true,
            upsert: true,
            rawResult: true,
        });

        res.status(202).json({
            message: "Movie edit successfully!!!",
            data: result.value,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const err = new Error("Can't not find the movie with id " + error.value);
            err.statusCode = 404;
            next(err);
        } else {
            if (!error.statusCode) error.statusCode = 500;
            next(error);
        }
    }
};

exports.DeleteMovie = async (req, res, next) => {
    try {
        checkErrorMiddleware(req);
        const { id } = req.params;
        const result = await Movie.findOneAndDelete({
            _id: id,
        });

        res.status(202).json({
            message: "Delete movie successfully!!!",
            data: result,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const err = new Error("Can't not find the movie with id " + error.value);
            err.statusCode = 404;
            next(err);
        } else {
            if (!error.statusCode) error.statusCode = 500;
            next(error);
        }
    }
};

exports.GetAllMovie = async (req, res, next) => {
    try {
        checkErrorMiddleware(req);

        const currentPage = Number(req.query._page) || PAGE;
        const perpage = Number(req.query._limit) || LIMIT;
        const key = req.query._key || "";
        const filter = { name: { $regex: key, $options: "i" } };

        const allMovies = await Movie.find(filter)
            .skip((currentPage - 1) * perpage)
            .sort({ createdAt: -1 })
            .limit(perpage);

        const totalItem = await Movie.find(filter).countDocuments();

        res.json({
            message: "Fetched All Movie Successfully!!!",
            data: allMovies,
            total: totalItem,
            totalPage: Math.round(totalItem / perpage),
            currentPage,
            limit: perpage,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            const err = new Error("Can't not find the movie with id " + error.value);
            err.statusCode = 404;
            next(err);
        } else {
            if (!error.statusCode) error.statusCode = 500;
            next(error);
        }
    }
};
