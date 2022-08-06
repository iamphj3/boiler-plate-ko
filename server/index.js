const express = require('express') // 모듈 가져옴
const app = express() // 함수를 이용해 앱 만들기
const port = 3001 // 아무렇게나 해도 됨
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/Users");

//application/x-www-form-urlencoded 분석해서 가져오기
app.use(bodyParser.urlencoded({extended: true}));

//application/json 분석해서 가져오기
app.use(bodyParser.json());
// test4@naver.com"
app.use(cookieParser());

const mongoose = require('mongoose');
const { userInfo } = require('os');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTOpology: true // 에러 방지, useCreateIndex: true, useFindAndModify: false -> 지원x
}).then(() => console.log('MOongoDB Connexted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { res.send('Hello World! 안녕하세요' ) }) // root 디렉토리에 Hello World 출력

// register Route
// 회원가입 시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다
app.post('/api/users/register', (req, res) => {

  const user = new User(req.body) // bodyparser를 통해 받아옴
  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
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
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등. -> 여기서는 쿠키에 저장
        res.cookie("x_auth", user.token) 
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})

// auth -> 미들웨어(중간에 뭘 해주는것)
app.get('/api/users/auth', auth , (req, res) => {
  
  // 여기까지 미들웨어를 통과해왔으면 Authentication이 True라는 것
  res.status(200).json({
    _id: req.user._id,
    // role 0 -> 일반 유저, 0이 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth , (req, res) => {

  User.findByIdAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})


app.listen(port, () => {console.log(`Example app listening on port ${port}`)}) // 3001번 포트에서 실행