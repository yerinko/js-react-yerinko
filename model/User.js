const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true, // space를 없애주는 역할
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxLength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String
    },
    //token의 유효기간
    tokenExp: {
        type: Number
    }
});

userSchema.pre("save", function (next) {
    var user = this; // User모델자체를 가르킴

    // isModified: password가 변경될때
    if (user.isModified("password")) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });

    } else {
        next(); // 비밀번호가 아닌 다른 것을 바꿀때 next()를 해줘야지 나갈 수 있다. 필수 !
    }
}); //*

userSchema.methods.comparePassword = function (plainPassword, cb) {

    // plainPassword 1234567 암호화된 비밀번호 ( plainPassword도 암호화하여 암호화된 비밀번호와 같은지 확인해야한다. )
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err), // 틀리면 콜백에 err
            cb(null, isMatch) // 맞으면 err없이 true
    })

}

const User = mongoose.model("User", userSchema);

module.exports = { User };