const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');




const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

//'pre' helps us encrypt the password before the 'save' method is called
userSchema.pre('save', function(next) { //The 'next' here means after the 'save' method is called immediately the password is encrypted
    var user = this; //'this' means the userSchema

    if (user.isModified('password')) { //So it doent with our password whenever the user model is called. Checks for when password is modified
        // console.log('password changed')
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                // console.log()
                if (err) return next(err);
                user.password = hash;
                next()
            })
        })
    } else {
        next()
    }
});

// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //After using 'secret' to 'decode' and verify, we will get 'user._id' since we used user id & secret for token
    //'user._id' will be returned in the 'decode' parameter
    jwt.verify(token, 'secret', function(err, decode) {
        user.findOne({ "_id": decode, "token": token }, function(err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('user', userSchema);

module.exports = { User }