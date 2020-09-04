const mysql = require('mysql')

// 创建链接对象
const con = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'XXX',
  port:'3306',
  database:'myblog'
})

// 开始链接
con.connect()

// 执行sql语句
// const sql = `insert into blogs (title,content,createtime,author) values ('标题C','内容C',1591795215586,'wangwu');`
const sql = `select username, password from users where username='zhangsan' and password='123'`
con.query(sql,(err,result) => {
  if(err){
    console.log(err)
    return
  }
  console.log(result)
})

// 关闭链接
con.end()