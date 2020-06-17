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