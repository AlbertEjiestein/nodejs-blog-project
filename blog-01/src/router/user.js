const { login } = require('../controler/user')
const { SuccessfulModel, ErrorModel} = require('../model/resModel')
const { set, get } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method

  if(method === 'GET' && req.path === '/api/user/login'){
    // const { username, password } = req.body
    const { username, password } = req.query
    const result = login(username, password)
    return result.then(loginData => {
      if(loginData.username){
        // 设置cookie
        // res.setHeader('Set-Cookie',`username=${loginData.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
        // 设置session
        req.session.username = loginData.username;
        req.session.realname = loginData.realname;
        // 同步到redis
        set(req.sessionId, req.session)

        return new SuccessfulModel()
      }
      return new ErrorModel('登录失败')
    })
  }

  // 登录验证的测试
  // if(method === 'GET' && req.path === '/api/user/login-test'){
  //   if(req.session.username){
  //     return Promise.resolve(
  //       new SuccessfulModel({
  //         username:req.session.username
  //       })
  //     )
  //   }
  //   return Promise.resolve(new ErrorModel('尚未登录'))
  // }
}

module.exports = handleUserRouter
