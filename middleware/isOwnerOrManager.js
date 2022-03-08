const Project = require("../models/Project.model");

// this is always to be used AFTER isAuthenticated middleware
async function isOwnerOrManager(req, res, next) {
    
    const projectFromDB = await Project.findById(req.params.id);
    if (!projectFromDB.owner) {
        res.status(400).json({ message: "Project does not exist or has no owner." });
    } else if (projectFromDB.owner.toString() === req.payload._id) {
        next();
    } else if (projectFromDB.managers.some(manager => manager._id.toString() === req.payload._id)) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized to make this request." })
    }

}

module.exports = { isOwnerOrManager };