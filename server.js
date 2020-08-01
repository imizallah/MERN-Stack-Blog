const express = require("express");
const app = express();
const port = process.env.PORT || 5000
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const config = require("./config/key");

// mongoDB Connection
const connect = mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/api/users/register", (req, res) => {
    // console.log(req.body)
    const user = new User(req.body);

    user.save((err, newUser) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, user_data: newUser })
    })
})


app.get("/", (req, res) => {
    res.send("Home reach!!!!!! ")
})

// mongodb+srv://imizallah:imizallah1990@react-blog-boiler-plate.o9xxp.mongodb.net/<react-blog-boiler-plate>?retryWrites=true&w=majority

app.listen(port, () => {
    console.log(`Server Running at ${port}`)
});