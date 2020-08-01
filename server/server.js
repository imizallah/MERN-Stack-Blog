const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/user");
const { auth } = require("./middleware/auth");
const config = require("./config/key");

// mongoDB Connection
mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected::::: '))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/users/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
            // image: req.user.image,
            // cart: req.user.cart,
            // history: req.user.history
    });
});

app.post("/api/users/register", (req, res) => {
    // console.log(req.body) 
    const user = new User(req.body);

    user.save((err, newUser) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, user_data: newUser })
    })

});

app.post("/api/users/login", (req, res) => {
    console.log(req.body)
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "Wrong password"
                });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp); //Pass the experation date of the jwt to the cookie
                res
                    .cookie("w_auth", user.token) // Passing the token from jwt to the cookie
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    });
            });
        });
    });
});


app.get("/", (req, res) => {
    res.send("Home reach!!!!!! ")
})

app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true,
            message: "Logout Successful!!!"
        });
    });
});

// mongodb+srv://imizallah:imizallah1990@react-blog-boiler-plate.o9xxp.mongodb.net/<react-blog-boiler-plate>?retryWrites=true&w=majority

app.listen(port, () => {
    console.log(`Server Running at ${port}`)
});