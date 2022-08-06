const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        thim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: { // 유효성 검사
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ){
    var user = this;
    // 비밀번호를 바꿀때만 암호화
    if (user.isModified('password')) {
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                // Store hash in your password DB.
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else { // 비밀번호가 아닌 다른 걸 바꿀 때
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // (1) plainPassword 1234567 , (2) 암호화된 비밀번호 $2b$10$E99al3CRPIHGfJA.yOqmF.ogRCU0kt/ppDwB20B6ehnpA9WoMzrQy
    // 1을 암호화해서 2와 비교해야 함. 2를 복호화 할 수는 없음!

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.methods.findByToken = function ( token, cb ) {
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해 유저를 찾은 후에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOns({"_id": decoded, "token": token}, function (err, user){
            if(err) return cb(err);
            cb(null, user)

        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }