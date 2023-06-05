const authRouter = require("./auth");
const movieRouter = require("./movie");
const commonRouter = require("./common");

module.exports = function (app) {
    // Welcome router
    app.get("/", (req, res) => {
        res.json({
            message: "Connected to server",
        });
    });

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Content-Type", "multipart/form-data");
        next();
    });

    // user routers
    app.use("/auth", authRouter);
    app.use("/movies", movieRouter);
    app.use("/home", commonRouter);
};
