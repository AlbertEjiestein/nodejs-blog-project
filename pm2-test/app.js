const http = require('http')

const server = http.createServer((req, res) => {
  // console.log('cur time', Date.now())
  // console.error('假装出错', Date.now())

  // 模拟错误，测试pm2的进程守护
  if(req.url === '/err'){
    throw new Error('/err 出错了')
  }

  res.setHeader('Content-type', 'application/json')
  res.end(
    JSON.stringify({
      errno: 0,
      msg: 'pm2 test server 3'
    })
  )
})

server.listen(3000, () => {
  console.log('server is running')
})
