const router = require("express").Router();
const Blog = require("../models/Blog");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/authentication");

/**
 * @description gets all posts for the front end, no authentication required.
 */
router.get("/", async (req, res) => {
    try{
        const allPosts = await Blog.find();
        res.status(200).json({posts: allPosts, status: "success"})
    }catch(err){
        res.status(500).json({error: err})
    }
})

/**
 * @description creates new post for the user
 * 
 */
router.post("/create", authenticateUser, async(req, res) => {
    try{
        
        let { title, body, image, author } = req.body;

        if(!title){
            title = "Helt Article";   
        }
        
        if(!image){
            image = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80";
        }
        
        if(!author){
            author = "Helt Staff";
        }
        
        try{
            const newPost = new Blog({
                title: title,
                body: body,
                image: image,
                author: author,
            });

            await newPost.save().then(_ => {
                res.status(200).json({status: "Success"});
            })

        }catch(err){
            res.status(500).json({error: err});
            console.log(err);
        }


    }catch(err){
        res.status(500).json({error: err});
        console.log(err);
    }
})

router.get("/:id", async (req, res) => {
    try{
        const currentPost = await Blog.findById(req.params.id)
        res.status(200).json(currentPost);
    } catch(err){
        res.status(500).json({error: err})
    }
})

router.put("/:id/update", authenticateUser, async (req, res) => {
    try{
        const { title, body, image, author } = req.body;
        
        if(!title){
            title = "Helt Article";   
        }
        
        if(!image){
            image = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80";
        }


        await Blog.findByIdAndUpdate(req.params.id, {
            title: title,
            body: body,
            image: image,
            author: author
        }).then(_ => {
            res.status(200).json({status: "Successfully updated"})
        })

    } catch(err){
        res.status(500).json({error: err})
    }
});

router.delete("/:id/delete", authenticateUser, async (req, res) => {
    try{
        await Blog.findByIdAndDelete(req.params.id).then(_ => {
            res.status(200).json({status: "Successfully deleted"})
        })
    }catch(err){
        res.status(500).json({error: err})
    }
})

module.exports = router;
