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

const mongoose = require('mongoose');
const { userInfo } = require('os');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTOpology: true // 에러 방지, useCreateIndex: true, useFindAndModify: false -> 지원x
}).then(() => console.log('MOongoDB Connexted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { res.send('Hello World! 안녕하세요' ) }) // root 디렉토리에 Hello World 출력

// register Route
// 회원가입 시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다
app.post('/register', (req, res) => {

  const user = new User(req.body) // bodyparser를 통해 받아옴
  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    
    // 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password , (err, isMatch ) => {
      if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      
      // 비밀번호도 맞다면 토큰을 생성
      user.generateToken((err, user) => {
        
      })

    })

  })

})

app.listen(port, () => {console.log(`Example app listening on port ${port}`)}) // 3001번 포트에서 실행