const mongoose = require("mongoose");

//connection to mongodb
const dbConnection = async () => {
    try{
        mongoose.connect(
            process.env.MONGODB_URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Connected to MongoDB");
              }
            });
    } catch(err) {
        console.log(err, " - MongoDB error");
        return error;
    }
}

module.exports = dbConnection;