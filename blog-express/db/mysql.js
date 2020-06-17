const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db')

// 创建链接
const con = mysql.createConnection(MYSQL_CONF)

// 开始链接
con.connect()

// 统一执行sql语句
function exec(sql){
  return new Promise((resolve,reject) => {
    con.query(sql,(err, result) => {
      if(err){
        reject(err)
        return
      }
      resolve(result)
    })
  })
}

module.exports = {
  exec,
  escape: mysql.escape
}