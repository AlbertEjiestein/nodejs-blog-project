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

module.exports = () => {
  return new LikeExpress()
}