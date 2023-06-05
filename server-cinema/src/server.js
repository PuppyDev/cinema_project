require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// All Of Routers
var routers = require("./routes/index");
routers(app);

// catch error
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
});

//Set up default mongoose connection
mongoose
    .connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })
    .then(() => {
        console.log("The server is listening in port 8080");
        app.listen(8080);
    })
    .catch((err) => {
        console.log("🚀 ~ file: app.js:28 ~ mongoose.connect ~ err:", err);
    });
