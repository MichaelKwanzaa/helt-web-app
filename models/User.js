const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        min: 4,
        max: 100
    },
    email: {
        type: String,
        require: true,
        min: 6, 
        max: 70,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 20,
    },
},
    {timestamps: true}
)

module.exports = mongoose.model("User", userSchema);