# 使用express搭建重构博客

+ express下载、安装和使用，**express中间件机制**
+ 开发接口、连接数据库、实现登录、日志记录
+ 分析express中间件原理



### 介绍

**安装express**

```
npm install -g express-generator // express 脚手架
express myproject

//  配置开发环境
"dev": "cross-env NODE_ENV=dev nodemon ./bin/www"
```

**express处理路由**

```js
// express的路由设计分层明确
// 比如针对blog和user两个模块
// app.js中的路由配置如下：
app.user('/blog', blogRouter)
app.user('/user', userRouter)
// 然后在routes的blog.js和user.js中的配置分别如下：
// blog.js
router.get('/list',func1)
router.get('/detail',func2)
// user.js
router.post('/login',func3)
```

**中间件机制**

[app.use是啥，next参数作用](https://cnodejs.org/topic/5757e80a8316c7cb1ad35bab)(面试问)

next函数主要负责将控制权交给下一个中间件，如果当前中间件没有终结请求，并且next没有被调用，那么请求将被挂起，后边定义的中间件将得不到被执行的机会。

注意：在定义路由中间件的时候函数的第三个参数next和我们定义非路由中间件的函数的第三个参数next不是同一个next。

app.use()后边可以有多个中间件，比如进行登录验证

```js
app.use('/login', loginCheck, login)
```

**总结**

+ 初始化代码中，各个插件的作用
+ express如何处理路由
+ express中间件



### 初始化环境

+ 安装插件mysql、xss

+ mysql controller resModel相关代码可以复用

+ 初始化路由，链接mysql数据库



### 登录

+ 使用`express-session`和`connect-redis`插件，session和redis的设置都是在设置路由之前（因为路由中会用到req.session）

```js
// session配置
app.use(session({
  secret: 'Wsdfjs_123#',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}))

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

// 登录测试
router.get('/login-test', (req, res, next) => {
  if(req.session.username){
    res.json(
      new SuccessfulModel({
        errno: 0,
        message: '登录成功'
      })
    )
  }
  res.json(
    new ErrorModel('登录失败')
  ) 
})
```

```js
// 连接redis
const RedisStore = require('connect-redis')(session);  // redis服务存放session
const redisClient = require('./db/redis') // redis客户端配置信息
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'Wsdfjs_123#',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))


// /db/redis.js
const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')
// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
  if(err){
    console.log(err)
  }
})
module.exports = redisClient
```

+ req.session保存登录信息，登录校验做成express中间件

```js
// /middleware/loginCheck.js
const { SuccessfulModel,ErrorModel } = require('../model/resModel')

module.exports = (req, res, next) => {
  if(req.session.username){
    next()
    return
  }
  res.json(
    new ErrorModel('未登录')
  )
}

// 以新建博客为例
const loginCheck = require('../middleware/loginCheck')
router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(
      new SuccessfulModel(data)
    )
  })
})
```

### 开发接口

```js
const express = require('express')
const router = express.Router()
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessfulModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', (req, res, next) => {
  const author = req.query.author || ''
  const keyword = req.query.keyword || ''
  if(req.session.username == null){
    res.json(
      new ErrorModel("未登录，请先登录")
    )
    return
  }
  const result = getList(author,keyword);
  return result.then(listData => {
    res.json(new SuccessfulModel(listData))
  })
})

router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id)
  return result.then(detailData => {
    res.json(
      new SuccessfulModel(detailData)
    )
  })
})

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = newBlog(req.body)
  return result.then(data => {
    res.json(
      new SuccessfulModel(data)
    )
  })
})

router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body)
  return result.then(result => {
    if(result){
      res.json(
        new SuccessfulModel()
      )
    }else{
      res.json(
        new ErrorModel('更新博客失败')
      )
    }
  })
})

router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username
  const result = delBlog(req.query.id,author)
  return result.then(result => {
    if(result){
      res.json(
        new SuccessfulModel()
      )
    }else{
      res.json(
        new ErrorModel('删除博客失败')
      )
    }  
  })
})

module.exports = router
```

### 日志

+ access log记录，直接使用脚手架推荐的`morgan`
+ 自定义日志使用console.log和console.error即可
+ 日志拆分、分析

```js

// morgan模式有很多种，线上combined和开发dev
const ENV = process.env.NODE_ENV
if(ENV !== 'production'){
  app.use(logger('dev', {
    stream: process.stdout
  }))
}else{
  // 日志以流的方式写入 
  const logFileName = path.join(__dirname, './logs/access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }))
}
```

### express中间件原理（重点）

+ 回顾中间件使用
+ 分析如何实现

**分析**

+ app.use用来注册中间件，先收集起来
+ 遇到http请求，根据path和method判断触发哪些
+ 实现next机制，即上一个通过next触发下一个

```js
const http = require('http')
const slice = Array.prototype.slice;

class LikeExpress {
  constructor(){
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }

  register(path){
    const info = {}
    if(typeof path === "string"){
      info.path = path
      // 从第二个参数开始将中间件存入栈中
      info.stack = slice.call(arguments, 1)
    }else{
      info.path = '/'
      info.stack = slice.call(arguments, 0)
    }
    return info
  }

  use(){
    const info = this.register.apply(this, arguments)
    this.routes.all.push(info)
  }
  get(){
    const info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }
  post(){
    const info = this.register.apply(this, arguments)
    this.routes.post.push(info)
  }
  match(url, method){
    let stack = []
    if(url === '/favicon.ico'){
      return stack
    }
    // 获取routes
    let curRoutes = []
    curRoutes = curRoutes.concat(this.routes.all)
    curRoutes = curRoutes.concat(this.routes[method])
    curRoutes.forEach(routeInfo => {
        if(url.indexOf(routeInfo.path) === 0){
          stack = stack.concat(routeInfo.stack)
        }
    })
    return stack
  }
  // 核心的 next 机制
  handle(req, res, stack){
    const next = () => {
      // 获取到第一个匹配的中间件
      const middleware = stack.shift()
      if(middleware){
        // 执行中间件函数
        middleware(req, res, next)
      }
    }
    next()
  }
  callback(){
    return (req, res) => {
      // 实现res.json功能
      res.json = (data) => {
        res.setHeader('Content-type', 'application/json')
        res.end(
          JSON.stringify(data)
        )
      }
      // 解析url、method
      const url = req.url
      const method = req.method.toLowerCase()
      // 根据方法和url去匹配所有会执行的中间件
      const resultList = this.match(url, method)
      // 通过next机制去执行所有中间件
      this.handle(req, res, resultList)
    }
  }
  listen(...args){
    const server = http.createServer(this.callback())
    server.listen(...args)
  }
}
```

