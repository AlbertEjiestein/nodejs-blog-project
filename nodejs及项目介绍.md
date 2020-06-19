# 项目介绍

### `nodejs`安装

```
node多版本安装--nvm

nvm use [version]
```

### `ECMAScript`、`javascript` 和 `nodejs`

```
ECMAScript是语法规范
	包含了文法、语义、运行时三个方面，但不能DOM操作，BOM操作，事件绑定，Ajax，http请求，文件操作
javascript是ECMAScript + web API
nodejs是ECMAScript + nodejs API
```

### server开发和前端开发的区别(重点)

+ 稳定性
  + 使用PM2做进程守候，防止server挂掉，比较稳定，开发时使用nodemon
+ 考虑内存和CPU
  + 使用stream写日志
  + 使用redis服务存储session
  + pm2支持多进程
+ 日志记录
  + 原生nodejs需要自定义写日志函数
  + express使用morgan插件
  + koa使用koa-logger插件
+ 安全
  + sql注入
  + xss攻击
  + 密码加密
+ 集群和服务拆分
  + 使用nginx反向代理来配置静态资源服务器和开发服务器
  + 扩展redis和mysql服务

### 技术方案

+ 数据如何存储（数据库）
  + 博客信息
  + 用户信息
+ 如何与前端对接，即接口设计，类似`rap2.taobao.com`