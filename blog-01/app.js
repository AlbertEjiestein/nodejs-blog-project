const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')
const { access } = require('./src/utils/log')

const getCookieExpires = () => {
  let date = new Date()
  const expires = 10
  date.setTime(date.getTime() + expires*24*60*60*1000)
  return date.toGMTString()
}

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if(req.method !== 'POST'){
      resolve({})
      return
    }
    // 一定要判定数据请求格式
    if(req.headers['content-type'] !== 'application/json'){
      resolve({})
      return
    }
    let postData = ''
    req.on('data',(chunk) => {
      postData += chunk.toString()
    })
    req.on('end',() => {
      if(!postData){
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
}

// 全局session
const SESSION_DATA = {}

const serverHandle = (req,res) => {
  // 写日志
  access(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)

  // 设置返回格式JSON
  res.setHeader('Content-type','application/json')
  
  // 获取path
  const url = req.url
  req.path = url.split('?')[0]

  // 获取query
  req.query = querystring.parse(url.split('?')[1])

  // 获取并解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item){
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const value = arr[1]
    req.cookie[key] = value
  })

  // 获取并解析session
  let needSetCookie = false
  let userId = req.cookie.userid
  if(userId){
    if(!SESSION_DATA[userId]){
      SESSION_DATA[userId] = {}
    }
  }else{
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    SESSION_DATA[userId] = {}
  }
  req.sessionId = userId
  req.session = SESSION_DATA[userId]

  getPostData(req).then(postData => {
    // 获取body
    req.body = postData

    // 处理blog路由
    // const blogData = handleBlogRouter(req, res)
    // if(blogData){
    //   res.end(
    //     JSON.stringify(blogData)
    //   )
    //   return
    // }
    const blogResult = handleBlogRouter(req, res)
    if(blogResult){
      blogResult.then(blogData => {
        if(needSetCookie){
          res.setHeader('Set-Cookie',`userid=${userId}; path="/"; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(blogData)
        )
        return
      })
    }

    // 处理用户路由
    const userResult = handleUserRouter(req, res)
    if(userResult){
      userResult.then(userInfo => {
        if(needSetCookie){
          res.setHeader('Set-Cookie',`userid=${userId}; path="/"; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(userInfo)
        )
        return
      })
    }
  })
}

module.exports = serverHandle
