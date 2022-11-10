const jwt = require("jsonwebtoken");

//jwt token to validate the current user logged in

authenticateUser = (req, res, next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        return res.status(403).send({auth: false, message: 'No token provided'});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(500).send({auth: false, message: "Failed to authenticate user"});
        }

        req.user = decoded;
        next();
    });
}


module.exports = {authenticateUser};