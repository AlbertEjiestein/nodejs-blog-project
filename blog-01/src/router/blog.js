const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controler/blog')
const { SuccessfulModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controler/user')

// 统一的登录验证中间件
const loginCheck = (req) => {
  if(!req.session.username){
    return Promise.resolve(
      new ErrorModel("登录失败")
    )
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id

  if(method === 'GET' && req.path === '/api/blog/list'){
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    // const listData = getList(author, keyword) // 获取博客列表
    // return new SuccessfulModel(listData)  // 返回给前端的数据格式
    const result = getList(author,keyword);
    return result.then(listData => {
      return new SuccessfulModel(listData)
    })
  }
  if(method === 'GET' && req.path === '/api/blog/detail'){
    // const detailData = getDetail(id)
    // return new SuccessfulModel(detailData)
    const result = getDetail(id)
    return result.then(detailData => {
      return new SuccessfulModel(detailData)
    })
  }
  if(method === 'POST' && req.path === '/api/blog/new'){
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      // 未登录
      return loginCheckResult
    }
    // const blogData = newBlog(req.body)
    // return new SuccessfulModel(blogData)
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessfulModel(data)
    })
  }
  if(method === 'POST' && req.path === '/api/blog/update'){
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      // 未登录
      return loginCheckResult
    }

    const result = updateBlog(id, req.body)
    return result.then(result => {
      if(result){
        return new SuccessfulModel()
      }else{
        return new ErrorModel('更新博客失败')
      }
    })
  }
  if(method === 'POST' && req.path === '/api/blog/delete'){
    const loginCheckResult = loginCheck(req)
    if(loginCheckResult){
      // 未登录
      return loginCheckResult
    }

    const author = req.session.username
    const result = delBlog(id,author)
    return result.then(result => {
      if(result){
        return new SuccessfulModel()
      }else{
        return new ErrorModel('删除博客失败')
      }  
    })
  }
}

module.exports = handleBlogRouter