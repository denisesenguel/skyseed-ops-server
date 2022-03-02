const mongoose = require('mongoose');

function isValidMongooseId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid Mongo Object ID specified'
        });
    } else {
        next();
    }
}

module.exports = { isValidMongooseId };