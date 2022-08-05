const express = require('express') // 모듈 가져옴
const app = express() // 함수를 이용해 앱 만들기
const port = 3001 // 아무렇게나 해도 됨
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/Users");

//application/x-www-form-urlencoded 분석해서 가져오기
app.use(bodyParser.urlencoded({extended: true}));

//application/json 분석해서 가져오기
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTOpology: true // 에러 방지, useCreateIndex: true, useFindAndModify: false -> 지원x
}).then(() => console.log('MOongoDB Connexted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { res.send('Hello ~~  sWorld!~~안녕하세요' ) }) // root 디렉토리에 Hello World 출력

app.post('/register', (req, res) => {
  // 회원가입 시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다

  const user = new User(req.body) // bodyparser를 통해 받아옴

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {console.log(`Example app listening on port ${port}`)}) // 3001번 포트에서 실행