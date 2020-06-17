const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessfulModel, ErrorModel} = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.query
  const loginData = await login(username, password)
  if(loginData.username){
    ctx.session.username = loginData.username;
    ctx.session.realname = loginData.realname;
    ctx.body = new SuccessfulModel()
    return
  }
  ctx.body = new ErrorModel('登录失败了')
})

router.get('/session-test', async function(ctx, next){
  if(ctx.session.viewCount == null){
    ctx.session.viewCount = 0
  }
  console.log(ctx.session.viewCount)
  ctx.session.viewCount++
  ctx.body = {
    errno: 0,
    viewCount: ctx.session.viewCount
  }
})

module.exports = router