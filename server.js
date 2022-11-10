require("dotenv").config();
const express = require('express');
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectToDB = require("./config/db");

//routes
const authRoute = require("./routes/AuthRoute");
const userRoute = require("./routes/UserRoute");
const blogRoute = require("./routes/BlogRoute");

//setting up dotenv
const PORT = process.env.PORT;

const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));
app.use(function(req, res, next){
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
})

//app routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})