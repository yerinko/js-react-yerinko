const mongoose = require('mongooseo');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxLength: 50
    },
    email: {
        type: String,
        trim: true, // space를 없애주는 역할
    },
    lastname: {
        type: String,
        maxLength: 50
    },
    role: {
        type: Number,
        default: 0
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

const User = mongoose.model('User', userSchema);

module.exports = { User };