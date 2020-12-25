const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const keys = require('../config/key');


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

// cb : call back
userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword를 암호화된 비밀번호와 일치하는지
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // json web token 이용해서 token 생성하기
    // user id 와 두번째 param 으로 토큰을 만들고, param 을 이용하여 나중에 userid를 찾아낸다.
    var token = jwt.sign(user._id.toHexString(), "secretToken")

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user)
    })
};

userSchema.statics.findByToken = function ( token , cb ) {
    var user = this;
    user._id + '' = token;

    // 토큰을 decode 한다.
    // jsonwebtoken 에 작성되어 있는 코드이다.
    jwt.verify(token, 'secretToken', function ( err, decoded) {
       // 유저 아이디를 이용해서 유저를 찾은 다음에
       // 클라이언트에서 가져 온 token 과 DB에 보관 된 토큰이 일치하는지 확인

       user.findOne({"_id": decoded, "token": token}, function (err, user) {

           if(err) return cb(err);
           cb(null, user)
       });
    });

}

const User = mongoose.model("User", userSchema);

module.exports = { User };