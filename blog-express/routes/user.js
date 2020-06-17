const express = require('express')
const router = express.Router()
const { login } = require('../controller/user')
const { SuccessfulModel, ErrorModel} = require('../model/resModel')

// 用get测试，实际上应该是post
router.get('/login', function(req, res, next){
  const { username, password } = req.query
  const result = login(username, password)
  return result.then(loginData => {
    if(loginData.username){
      req.session.username = loginData.username;
      req.session.realname = loginData.realname;

      res.json(
        new SuccessfulModel()
      )
      return
    }
    res.json(
      new ErrorModel('登录失败了')
    )
  })
})

router.get('/login-test', (req, res, next) => {
  if(req.session.username){
    res.json(
      new SuccessfulModel({
        errno: 0,
        message: '登录成功'
      })
    )
    return
  }
  res.json(
    new ErrorModel('登录失败')
  ) 
})

// router.get('/session-test', (req, res, next) => {
//   let session = req.session;
//   if(session.viewNum == null){
//     session.viewNum = 0
//   }
//   session.viewNum++
//   res.json({
//     viewNum: session.viewNum
//   })
// })

module.exports = router