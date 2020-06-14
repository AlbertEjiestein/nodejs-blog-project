## 博客项目开发

### 所用到的技术栈：

+ 本项目旨在学习`nodejs`，所以前端模板引擎使用的时`EJS`

+ 服务端分别使用原生`nodejs`、`express`和`koa2`来开发
+ 数据库方面：使用 `MySQL`和`redis`，分别存储博客和session
+ 安全方面：登录信息校验和存储使用`cookie` `session`
+ 日志方面：nodejs stream文件操作，写日志、文件拆分、日志分析
+ 线上环境开发时使用的是`nodemon`，生产环境中使用`pm2`
