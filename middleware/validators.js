const { check, validationResult } = require("express-validator");


const userSignInValidation = () => {
    return [
        check("email", "Invalid email").not().isEmpty().isEmail(),
        check("password", "Invalid password").not().isEmpty().isLength({min: 4, max: 20})
    ];
};

const validateSignIn = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var messages = [];
        errors.array().forEach((error) => {
            messages.push(error.msg);
        });
        return res.status(409).json({error: messages});
    }
    next();
}

module.exports = {
    userSignInValidation,
    validateSignIn,
}