# 总结

+ 开发了哪些功能模块，完整的流程
  + 处理http接口
  + 连接数据库
  + 实现登录
  + 安全
  + 日志
  + 上线（最后再一起讲）

**功能模块**

+ 处理http接口
+ 连接数据库
+ 实现登录
+ 安全
  + 

![server开发流程](C:/Users/Alber/Pictures/server开发流程.PNG)

+ 用到了哪些核心的知识点
  + http，nodejs处理http、处理路由，mysql
  + cookie、session、redis，nginx反向代理
  + sql注入，xss攻击和密码加密
  + 日志，stream，crontab，readline
  + （线上环境的知识点）

+ 回顾“server和前端的区别”
  + 服务端稳定性（最后讲）
  + 内存 CPU（优化 ：日志、stream，扩展：redis、mysql）
  + 日志记录
  + 安全（包括登录校验）
  + 集群和服务拆分（nodejs，mysql，redis，nginx）