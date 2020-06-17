const koa  = require('./like-koa2')

const app = koa()

app.use(async (ctx, next) => {
  console.log("start request...")
  next()
})

app.use(async (ctx, next) => {
  console.log("start api...")
  next()
})

app.use(async (ctx, next) => {
  console.log("start api v1...")
})

app.listen(3000, () => {
  console.log('server is running')
})