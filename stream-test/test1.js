// 标准输入输出
// process.stdin.pipe(process.stdout)

// 网络IO
// const http = require('http')

const server = http.createServer((req, res) => {
  if(req.method === 'POST'){
    req.pipe(res)
  }
})

// server.listen(8000)

// 文件IO，复制文件
// const fs = require('fs')
// const path = require('path')

// const fileName1 = path.resolve(__dirname, 'test.txt')
// const fileName2 = path.resolve(__dirname, 'test-copy.txt')
// const readStream = fs.createReadStream(fileName1)
// const writeStream = fs.createWriteStream(fileName2)

// readStream.pipe(writeStream)

// 上边的细节展开
// readStream.on('data', chunk => {
//   console.log(chunk.toString())
// })
// readStream.on('end', () => {
//   console.log('stream end')
// })

// 网络IO和文件IO
// const http = require('http')
// const fs = require('fs')
// const path = require('path')
// const fileName1 = path.resolve(__dirname, 'test.txt')
// const server = http.createServer((req, res) => {
//   if(req.method === 'GET'){
//     const readStream = fs.createReadStream(fileName1)
//     readStream.pipe(res)
//   }
// })
// server.listen(8000)