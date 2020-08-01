const { User } = require('../models/user');

let auth = (req, res, next) => {
    let token = req.cookies.w_auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({
            isAuth: false,
            error: true,
            message: "Unauthorized to view this page"
        });

        req.token = token; //Pass token to the 'req' object
        req.user = user; //Passw user to the 'req' object
        next(); //Call the next middleware
    });
};

module.exports = { auth };