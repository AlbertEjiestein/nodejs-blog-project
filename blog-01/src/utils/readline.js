const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 日志文件路径
const fileName = path.join(__dirname, '../../logs', 'access.log')
// 创建readstream对象
const readStream = fs.createReadStream(fileName)

// 创建readline对象
const readLine = readline.createInterface({
  input: readStream
})

let chromeNum = 0
let num = 0

// 逐行读取数据
readLine.on('line',lineData => {
  if(!lineData){
    return
  }
  num++
  const arr = lineData.split('--')
  if(arr[2] && arr[2].indexOf('Chrome') > 0){
    chromeNum++
  }
})

// 监听读取完成
readLine.on('close',() => {
  console.log('chrome 占比：',chromeNum/num)
})


