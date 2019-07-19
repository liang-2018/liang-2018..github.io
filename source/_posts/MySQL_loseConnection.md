---
title: 连接池丢失MySQL连接
toc: true
mathjax: true
date: 2018-8-09 11:44:39
top: 1
tags: 
- MySQL
- c3p0
categories: MySQL
---

> 背景：网络爬虫后结构化的数据和原文数据存储在MySQL数据库中，使用Lucene进行全文检索，通过定时器每日定时更新Lucene的索引文件，但是**有时候**会因为莫名原因导致Lucene索引更新失败，最终查看tomcat日志才知道是MySQL连接超时。

<!-- more -->
> 连接池中的链接空闲超过一定时间后，再次访问数据库时候会出现连接超时异常。
>
> mysql wait_timeout默认值为28800秒，即为8小时。即在默认情况下，Mysql在经过8小时（28800秒）不使用后会自动关闭已打开的连接。

抛出异常内容：

> ```
> The last packet successfully received from the server was **** milliseconds ago.  
> The last packet sent successfully to the server was **** milliseconds ago.; 
> nested exception is com.mysql.jdbc.exceptions.
> ```

解决方案：

参考链接：https://blog.csdn.net/frankcheng5143/article/details/50589264

> 本人使用的c3p0连接池，最后在c3p0.properties文件中，添加了如下条件

```properties
c3p0.miniPoolSize=10
c3p0.maxPoolSize=200
c3p0.initialPoolSize=20
c3p0.maxIdleTime=25000
c3p0.acquireIncrement=1
c3p0.acquireRetryAttempts=30
c3p0.acquireRetryDelay=1000
# 一步检测链接的有效性
c3p0.testConnectionOnCheckin=true
# 用来检测链接是否有效的空表，注意，必须是空表
c3p0.automaticTestTable=c3p0test
# 每隔多少秒检测链接的有效性，比 8*3600 小就行，单位是秒
c3p0.idleConnectionTestPeriod =18000
c3p0.checkoutTimeout=3000
```

