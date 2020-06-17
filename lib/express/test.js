const express = require('./like-express')

const app = express()

app.use((req, res, next) => {
  console.log("start request...", req.method, req.url)
  next()
})

app.use('/api',(req, res, next) => {
  console.log("start api...", req.method, req.url)
  next()
})

app.use('/api/v1',(req, res, next) => {
  console.log("start api v1...", req.method, req.url)
})

app.listen(3000, () => {
  console.log('server is running')
})