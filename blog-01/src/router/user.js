const { login } = require('../controler/user')
const { SuccessfulModel, ErrorModel} = require('../model/resModel')

const getCookieExpires = () => {
  let date = new Date()
  const expires = 10
  date.setTime(date.getTime() + expires*24*60*60*1000)
  return date.toGMTString()
}

const handleUserRouter = (req, res) => {
  const method = req.method

  if(method === 'GET' && req.path === '/api/user/login'){
    // const { username, password } = req.body
    const { username, password } = req.query
    const result = login(username, password)
    const expires = getCookieExpires()
    return result.then(loginData => {
      if(loginData.username){
        res.setHeader('Set-Cookie',`username=${loginData.username}; path=/; httpOnly; expires=${expires}`)
        return new SuccessfulModel()
      }
      return new ErrorModel('登录失败')
    })
  }
  if(method === 'GET' && req.path === '/api/user/login-test'){
    if(req.cookie.username){
      return Promise.resolve(new SuccessfulModel({
        username:req.cookie.username
      }))
    }
    return Promise.resolve(new ErrorModel('登录失败'))
  }
}

module.exports = handleUserRouter
