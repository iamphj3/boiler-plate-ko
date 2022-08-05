const express = require('express') // 모듈 가져옴
const app = express() // 함수를 이용해 앱 만들기
const port = 3001 // 아무렇게나 해도 됨

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hyeonji:eunpha@boilerplate.qfusp1f.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTOpology: true // 에러 방지, useCreateIndex: true, useFindAndModify: false -> 지원x
}).then(() => console.log('MOongoDB Connexted...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => { res.send('Hello World!안녕하세요' ) }) // root 디렉토리에 Hello World 출력

app.listen(port, () => {console.log(`Example app listening on port ${port}`)}) // 3001번 포트에서 실행