const express = require("express");

const movieController = require("../controllers/movie");

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");
const { checkParamsAddMovie } = require("../validations/movie.validations");

const router = express.Router();

router.post("/", isAuth, isAdmin, checkParamsAddMovie(), movieController.AddMovie);

router.put("/:id", isAuth, isAdmin, movieController.EditMovie);

router.delete("/:id", isAuth, isAdmin, movieController.DeleteMovie);

router.get("/", isAuth, isAdmin, movieController.GetAllMovie);

module.exports = router;
