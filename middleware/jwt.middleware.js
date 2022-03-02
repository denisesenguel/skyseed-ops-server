const jwt = require('express-jwt');

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'payload', 
    getToken: getTokenFromHeaders
});

// extract JWT token from request Authorization Headers
function getTokenFromHeaders(req) {
    // check if token is available in the headers
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        // get encoded token string
        const token = req.headers.authorization.split(" ")[1];
        return token
    } else {
        return null 
    }
}

module.exports = { isAuthenticated };