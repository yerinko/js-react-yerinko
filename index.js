const express = require('express'); // package.json 에 있는 express 모듈을 가져온다.
const app = express(); // express을 이용하여 app을 만든다.
const port = 3000;
const bodyParser = require('body-parser');
const { User } = require("./model/User");

// application/x-www-form-urlencoded  와 json 형태를 가져와
// 이렇게 되어있는 데이터를 분석해서 가져 올 수 있도록 도와주는 것
app.use(bodyParser.urlencoded({extend:true}));
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://yerinko:kate0523@@@boilerplate.b4kwc.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected…"))
    .catch(err => console.log(err));



app.get('/', (req, res) => res.send('Hello World!-~ 안녕하세요 ~'));

app.post('/register', (req, res) => {

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});