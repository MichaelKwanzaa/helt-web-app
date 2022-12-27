const jwt = require("jsonwebtoken")
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const {authenticateUser} = require("../middleware/authentication");
const { userSignInValidation,
    validateSignIn} = require("../middleware/validators")

//register a user with middle function to check input errors
/** @todo - be deleted */
router.post("/register", async (req, res) => {
    console.log("registering user")
    const { name, email, password } = req.body;

    //hash current password sent from client
    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.USER_SECRET_KEY);

    try{
        //checks for existing user before creating
           const existingUser = await User.findOne({email : email});
           if(!existingUser){
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword
            })
    
            //saves user then sends token to be valid until logged out(only for this project)
            newUser.save().then(async result => {
                const token = await jwt.sign({
                    user_id : result._id,
                    role: result.role
                }, process.env.JWT_SECRET_KEY)
    
                res.status(200).json({auth: true, token: token})
            }).catch(error => res.status(500).json({error: error}))
        } else {
            res.status(409).json({error: "This user already exists"});
        }
    }catch(err){
        res.status(500).json({error: err})
    }  

})

    //logs in a user with middle function to check input errors

router.post("/login", userSignInValidation(), validateSignIn, async (req, res) => {
    const {email, password} = req.body;

    try{
        //finds user first
        await User.findOne({email: email}).exec().then(async user => {

            //password decryptor for current hashed password in DB 
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.USER_SECRET_KEY
            );

            //compares submitted  password to password in DB
            const cryptoPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

            if(cryptoPassword !== password){
                res.status(401).json({error: "Something went wrong!"});
                return
            } else {
                const token = await jwt.sign({
                    user_id : user._id,
                    role: user.role,
                }, process.env.JWT_SECRET_KEY,
                {expiresIn: "30m"})

                res.status(200).json({auth: true, token: token});
            }
        })


    }catch(err){
        console.log(err, "error")
        //usually means user is not found in this instance
        res.status(500).json({error: "User not found!"})
    }


})

module.exports = router;