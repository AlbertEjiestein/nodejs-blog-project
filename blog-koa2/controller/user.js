const { exec,escape } = require('../db/mysql')
const { genPassword } = require('../utils/crypto')

const login = async (username, password) => {
  // 防止sql注入
  username = escape(username)
  // 密码加密
  password = genPassword(password)
  console.log(password)
  password = escape(password)
  let sql = `
    select username, realname from users where username=${username} and password=${password}
  `
  const rows = await exec(sql)
  return rows[0] || {}
}

module.exports = {
  login
}