const User = require("../models/user");

module.exports = async (req, res, next) => {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        next(error);
    }

    if (user.role === "basic") {
        const error = new Error("you don't have permisstion to do that");
        error.statusCode = 403;
        next(error);
    }
    next();
};
