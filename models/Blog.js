const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        require: true,
        min: 4,
        max: 150
    },
    body: {
        type: String,
        require: true,
        min: 5,
    },
    image: {
        type: String,
        require: false,
        default: ""
    },
    author: {
        type: String,
        require: false,
        default: "Helt Staff"
    }
},
    {timestamps: true} 
);

module.exports = mongoose.model("Blog", blogSchema)