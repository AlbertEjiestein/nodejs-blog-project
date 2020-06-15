use myblog;

-- show tables;

-- insert into users (username,`password`,realname) values ('zhangsan','123','张三');

-- select * from users;

-- select id,username from users;

-- select * from users where username='zhangsan' or `password`='123';

-- select * from users where username like '%zhang%';

-- select * from users where `password` like '%1%' order by id desc;

-- update users set realname='san' where username='zhangsan';

-- SET SQL_SAFE_UPDATES = 0;

-- delete from users where id=1;

-- 更改表的字符集支持中文
-- alter table blogs convert to character set utf8;

-- update users set username='lisi' where realname='san';
-- update users set realname='李四' where username='lisi';

-- insert into blogs (title,content,createtime,author) values ('内容A','内容A',1591793166918,'lisi');
-- select * from blogs order by createtime desc;

-- delete from blogs where id = 6
select * from users;
-- update users set password='176a0ba1135613115a9924f7af1ccf4b' where username='zhangsan'

-- select version()
