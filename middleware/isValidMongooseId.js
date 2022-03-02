const mongoose = require('mongoose');

function isValidMongooseId(req, res, next) {
    // generalize this to id (take as fcn param)
    if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
        return res.status(400).json({
            message: 'Invalid Mongo Object ID specified'
        });
    } else {
        next();
    }
}

module.exports = { isValidMongooseId };