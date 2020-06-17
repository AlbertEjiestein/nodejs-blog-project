## 博客项目开发

**所用到的技术栈：**

+ 本项目旨在学习`nodejs`，所以前端模板引擎使用的是`EJS`
+ 服务端分别使用原生`nodejs`、`express`和`koa2`来开发，框架中间介绍**中间件原理**
+ 数据库方面：使用 `MySQL`和`redis`，分别存储博客和session
+ 安全方面：登录信息校验和存储使用`cookie` `session`
+ 日志方面：nodejs stream文件操作，写日志、文件拆分、日志分析
+ 线上环境：开发时使用的是`nodemon`，生产环境中使用`pm2`
+ 使用nginx进行反向代理，进行server开发和静态资源的分离



**项目架构图**

![项目流程图.png](https://i.loli.net/2020/06/17/3PzeQqEMcLwZman.png)



**每一部分的教程如下：**

+ 使用原生nodejs开发博客
  + [nodejs及项目介绍](./nodejs及项目介绍.md)
  + [项目接口](./项目接口.md)
  + [数据存储](./数据存储.md)
  + [登录](./登录.md)
  + [安全](./安全.md)
  + [日志](./日志.md)
  + [使用原生nodejs开发博客总结](./使用原生nodejs开发博客总结.md)
+ 使用express重构博客
  + [使用express重构博客](./使用express重构博客.md)
+ 使用koa2重构博客
  + [使用原生nodejs开发博客总结](./使用原生nodejs开发博客总结.md)

+ 线上环境
  + [线上环境](./线上环境.md)