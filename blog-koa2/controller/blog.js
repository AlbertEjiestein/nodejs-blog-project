const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = async (author, keyword) => {
  // 先返回假数据（格式是正确的）
  let sql = `select * from blogs where 1=1 `
  if(author){
    sql += `and author='${author}' `
  }
  if(keyword){
    sql += `and title like '%${keyword}%' `
  }
  return await exec(sql)
}

const getDetail = async (id) => {
  const sql = `select * from blogs where id='${id}'`
  const rows = await exec(sql)
  return rows[0]
  // return exec(sql).then(rows => {
  //   return rows[0]
  // })
}

const newBlog = async (blogData ={}) => {
  // blogData是一个博客对象，包含title,content,author,createtime属性
  const title = xss(blogData.title);
  const content = xss(blogData.content);
  const author = xss(blogData.author);
  const createtime = Date.now();

  const sql = `
    insert into blogs (title,content,author,createtime) values('${title}','${content}','${author}',${createtime});
  `

  const insertData = await exec(sql)
  return {
    id: insertData.insertId
  }
}

const updateBlog = async (id, blogData) => {
  const title = xss(blogData.title);
  const content = xss(blogData.content);

  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id}
  `

  const updateData = await exec(sql)
  if(updateData.affectedRows > 0){
    return true
  }
  return false
}

const delBlog = async (id,author) => {
  const sql = `
    delete from blogs where id=${id} and author='${author}'
  `

  const delData = exec(sql)
  if(delData.affectedRows > 0){
    return true
  }
  return false
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
