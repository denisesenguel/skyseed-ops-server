const Project = require("../models/Project.model");

// this is always to be used AFTER isAuthenticated middleware
async function isOwner(req, res, next) {
    
    // use this later to reuse for non-project routes!
    // console.log("baseurl: ", req.baseUrl)
    const idFromDB = await Project.findById(req.params.id);
    if (!idFromDB.owner) {
        res.status(400).json({ message: "Project does not exist or has no owner." });
    } else if (idFromDB.owner.toString() === req.payload._id) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized to make this request." })
    }
}

module.exports = { isOwner };