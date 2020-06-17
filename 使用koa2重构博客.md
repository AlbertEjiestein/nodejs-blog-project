# 基于koa2开发博客

+ express中间件是异步回调，koa2原生支持async/await
+ 新开发框架和系统，都开始基于koa2，例如egg.js



**目录**

+ async/await介绍，并介绍安装koa2

```js
cnpm i koa2-generator -g // 脚手架
koa2 myproject
```

+ 接口开发，登录，连接数据库，日志信息
+ 分析koa2的原理



### 接口开发

区别与express的路由，koa2实现了路由的分离：koa和koa-router；然后中间件使用async/await

```js
// get方式
const router = require('koa-router')()

router.prefix('/api/blog')

router.get('/list', async function(ctx, next) {
  const query = ctx.query
  ctx.body = {
    errno: 0,
    query,
    data: ['获取博客列表']
  }
})

module.exports = router

// post方式
const router = require('koa-router')()

router.prefix('/api/user')

router.post('/login', (ctx, next) => {
  const {username, password} = ctx.request.body
  ctx.body = {
    errno: 0,
    username,
    password  
  }
})

module.exports = router
```

### 实现登录

基于koa-generic-session和koa-redis

```js
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

// 配置session
app.keys = ['Wjsdf#23423_']
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: redisStore({
    all: '127.0.0.1:6379'
  })
}))

// 测试session
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
```

### 开发路由

```js
// blog.js
const router = require('koa-router')()

router.prefix('/api/blog')

// 以博客列表为例
router.get('/list', async function(ctx, next) {
  const author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  if(ctx.session.username == null){
    ctx.body = new ErrorModel("未登录，请先登录")
    return
  }
  const result = await getList(author,keyword);
  ctx.body = new SuccessfulModel(listData)
})

// app.js
app.use(blog.routes(), blog.allowedMethods())
```

### 记录日志

```js
// 考虑开发和生成环境
const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  app.use(logger('dev', {
    stream: process.stdout
  }))
}else{
  const logFileName = path.join(__dirname, './logs/access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }))
}
```

### 中间件机制原理

```js
const http = require('http')

// 组合函数，next机制，是通过middlewareList来实现的
function compose(middlewareList){
  return function(ctx){
    const dispatch = (i) => {
      const fn = middlewareList[i]
      console.log(fn)
      try{
        // Promise.resolve是为了防止fn中忘记加async
        return Promise.resolve(
          // 相当于fn(ctx, next)
          fn(ctx, dispatch.bind(null, i+1))
        )
      }catch (err){
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }
}

class LikeKoa2 {
  constructor(){
    this.middlewareList = []
  }

  use(fn){
    this.middlewareList.push(fn)
    return this
  }

  createContext(req, res){
    const ctx = {
      req, 
      res
    }
    return ctx
  }

  callback(){
    const fn = compose(this.middlewareList)
    return (req, res) => {
      const ctx = this.createContext(req, res)
      return fn.call(null, ctx)
    }
  }

  listen(...args){
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}

module.exports = () => {
  return new LikeKoa2()
}


// 联调
const koa  = require('./like-koa2')

const app = koa()

app.use(async (ctx, next) => {
  console.log("start request...")
  next()
})

app.use(async (ctx, next) => {
  console.log("start api...")
  next()
})

app.use(async (ctx, next) => {
  console.log("start api v1...")
})

app.listen(3000, () => {
  console.log('server is running')
})
```

