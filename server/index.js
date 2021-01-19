const express = require('express'); // package.json 에 있는 express 모듈을 가져온다.
const app = express(); // express을 이용하여 app을 만든다.
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./model/User");

// application/x-www-form-urlencoded  와 json 형태를 가져와
// 이렇게 되어있는 데이터를 분석해서 가져 올 수 있도록 도와주는 것
app.use(bodyParser.urlencoded({extend:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected…"))
    .catch(err => console.log(err));



app.get('/', (req, res) => res.send('Hello World!-~ 안녕하세요 ~'));

app.post('/api/users/register', (req, res) => {

    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    })

});

app.post('/api/users/login',(req,res)=>{
    // 요청된 email을 db에서 찾기
    console.log(req.body)
    User.findOne({email : req.body.email},(err,user)=>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
                return res.json({  loginSuccess : false, message : "비밀번호가 틀렸습니다."})

            // 비밀번호까지 맞다면 토큰을 형성
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess : true, userId : user.user_id})
            })
        })
    })
});

// 예시 , role != 0 ( 어드민 ) , role === 0 ( 일반 유저 )
app.get('/api/users/auth', auth, (req, res) => {

    // 여기까지 미들웨어를 통과해 왔다는 이야기는 ? Authentication 이 True 라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
});


app.get('/api/users/logout', auth, (req, res ) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token:""},
        (err, user) => {
        if(err) return res.json({ success: false, err});
        return res.status(200).send({
            success: true
        })
        })
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});