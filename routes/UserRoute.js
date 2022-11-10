const jwt = require("jsonwebtoken")
const router = require("express").Router();
const User = require("../models/User");
const {authenticateUser} = require("../middleware/authentication");

//gets current authenticated user 
router.get("/", authenticateUser, async (req, res) => {
    try{
        const currentUser = await User.findById(req.user.user_id);
        const { password, updatedAt, createdAt, ...others } = currentUser._doc
        res.status(200).json(others)
    }catch(err){
        console.log(err)
        res.status(500).json({error: err})
    }
})

router.put("/:id/update", authenticateUser, async (req, res) => {
    try{
        const {name, email, password} = req.body;


        await User.findByIdAndUpdate(req.params.id, {
            name: name, 
            email: email,
            password: password
        }).then(_ => {
            res.status(200).json({status: "Successfully updated!"})
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error: err})
    }
})

router.post("/create", authenticateUser, async (req, res) => {
    try{
        let { name, email, password } = req.body;

        const existingUser = await User.findOne({email : email});
            if(!existingUser){

            const hashedPassword = CryptoJS.AES.encrypt(password, process.env.USER_SECRET_KEY);


            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            newUser.save().then(_ => {
                res.status(200).json({status: "Successfully created"})
            })
        } else {
            res.status(409).json({error: "This user already exists"});
        }
    } catch(err){
        res.status(500).json({error: err})
    }
})

module.exports = router;