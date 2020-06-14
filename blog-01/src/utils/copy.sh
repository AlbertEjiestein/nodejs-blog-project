#!bin/sh
cd E:\\前端必备技术栈\\NodeJS学习\\web-server博客项目\\blog-01\\logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log