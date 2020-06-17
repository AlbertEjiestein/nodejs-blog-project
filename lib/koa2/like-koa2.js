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