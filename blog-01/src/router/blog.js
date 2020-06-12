const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controler/blog')
const { SuccessfulModel, ErrorModel } = require('../model/resModel')

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
    // const blogData = newBlog(req.body)
    // return new SuccessfulModel(blogData)
    req.body.author = 'zhangsan'  // 假数据，待开发登录时改成真数据
    const result = newBlog(req.body)
    return result.then(data => {
      return new SuccessfulModel(data)
    })
  }
  if(method === 'POST' && req.path === '/api/blog/update'){
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
    const author = 'wangwu'  // 假数据，待开发登录时改成真数据
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