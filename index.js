const express = require('express'); // package.json 에 있는 express 모듈을 가져온다.
const app = express(); // express을 이용하여 app을 만든다.
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://yerinko:kate0523@@@boilerplate.b4kwc.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected…"))
    .catch(err => console.log(err));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});