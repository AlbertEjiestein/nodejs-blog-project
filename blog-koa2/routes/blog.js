const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessfulModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

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

router.get('/detail', async (ctx, next) => {
  const detailData = await getDetail(req.query.id)
  ctx.body = new SuccessfulModel(detailData)
})

router.post('/new', loginCheck, async (ctx, next) => {
  ctx.request.body.author = ctx.session.username
  const data = await newBlog(ctx.request.body)
  ctx.body = new SuccessfulModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
  const val = await updateBlog(ctx.query.id, ctx.body)
  if(val){
    res.body = new SuccessfulModel()
  }else{
    res.body = new ErrorModel('更新博客失败')
  }
})

router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username
  const val = delBlog(ctx.query.id,author)
  if(val){
    res.body = new SuccessfulModel()
  }else{
    res.body = new ErrorModel('更新博客失败')
  }
})

module.exports = router