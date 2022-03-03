const router = require("express").Router();
const User = require("../models/User.model");

router.get("/", async (req, res, next) => {
    try {
        const allUsers = await User.find().lean();
        // remove password hash before sending response
        const allUsersNoPw = allUsers.map(({password, ...rest}) => rest);
        return res.status(200).json(allUsersNoPw);
    } catch (err) {
        next(err);
    }
});

module.exports = router;