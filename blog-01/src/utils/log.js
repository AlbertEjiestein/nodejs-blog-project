const fs = require('fs')
const path = require('path')

// 写日志
function writeLog(writeStream, log){
  writeStream.write(log + '\n')
}

// 生成write stream对象
function createWriteStream(filename){
  const filePath = path.join(__dirname, '../../logs', filename)
  const writeStream = fs.createWriteStream(filePath,{
    flags: 'a'
  })
  return writeStream
}

// 创建写文件对象
const accessWriteStream = createWriteStream('access.log')

// 写访问日志
function access(log){
  writeLog(accessWriteStream, log)
}

module.exports = {
  access
}