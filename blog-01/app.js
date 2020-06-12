const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')

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

const serverHandle = (req,res) => {
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
        res.end(
          JSON.stringify(userInfo)
        )
        return
      })
    }
  })
}

module.exports = serverHandle
