---
title: redis_learning
toc: true
mathjax: true
date: 2018-09-29 21:50:14
top: 1
tags:
- Redis
- command
categories:
- Redis
---

> Redis简介以及常用指令

<!-- more -->

## 一、简介

> Redis : Remote Dictionary Service
>
> - Redis支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
> - Redis不仅仅支持简单的key-value类型的数据，同时还提供list，set，zset，hash等数据结构的存储。
> - Redis支持数据的备份，即master-slave模式的数据备份。

> Redis是速度非常快的非关系型内存键值数据库
>
> + 速度非常快
> + 非关系型
> + 内存
> + 键值数据库

> Redis的键的类型只能为字符串，包含五种数据类型：
>
> + String  字符串
> + List  列表
> + Set  集合
> + ZSet  有序集合
> + Hash  散列表

| 数据类型 |      可以存储的值      |                             操作                             |
| :------: | :--------------------: | :----------------------------------------------------------: |
|  STRING  | 字符串、整数或者浮点数 | 对整个字符串或者字符串的其中一部分执行操作</br> 对整数和浮点数执行自增或者自减操作 |
|   LIST   |          列表          | 从两端压入或者弹出元素 </br> 对单个或者多个元素</br> 进行修剪，只保留一个范围内的元素 |
|   SET    |        无序集合        | 添加、获取、移除单个元素</br> 检查一个元素是否存在于集合中</br> 计算交集、并集、差集</br> 从集合里面随机获取元素 |
|   HASH   | 包含键值对的无序散列表 | 添加、获取、移除单个键值对</br> 获取所有键值对</br> 检查某个键是否存在 |
|   ZSET   |        有序集合        | 添加、获取、删除元素</br> 根据分值范围或者成员来获取元素</br> 计算一个键的排名 |

> 详情参考 https://redislabs.com/ebook/part-1-getting-started/chapter-1-getting-to-know-redis/

### 环境搭建

> 我使用的docker
>
> ```bash
> docker pull redis
> docker run -d --name redis -p 6379:6379 redis # 仅用于学习时使用，所有就没做持久化设置
> docker exec -it redis bash
> redis-cli # 使用客户端进行连接
> ```

### 使用场景

- 计数器：利用自增自减计数，Redis读写性能高，适合频繁读写
- 缓存：热点数据缓存
- 查找表：如 DNS记录
- 消息队列：可起到对应作用，但没Kafka、RabbitMQ等消息中间件功能丰富
- 会话缓存：分布式会话统一存储
- 分布式锁：分布式情况下，多节点进程同步，使用SETNX或RedLock实现

## 二、数据类型及常用指令

### 通用指令

```bash
SELECT 1; # 默认是第0个库，可以通过 select 进行跳转选择
FLUSHALL # 清空当前库
FLUSHDB # 清空所有库
KEYS *e* # 查看相关的 key， 支持正则表达式
TTL key_name # 查看变量的状态，-1 代表一直存在， -2 说明不存在，其他代表在对应秒数后删除
```





##  三、相关理论

### NoSQL 数据库分类

###  分布式数据库CAP理论

BASE:

> BASE 是三个属于的缩写，其提出是为了解决关系数据库强一致性引起可用性较低的问题。
>
> + Basically Available 基本可用
> + Soft State 软状态
> + Eventually Consistant 最终一致

### CAP

> + Consistency 强一致性
> + Availability 高可用性
> + Partition Tolerance 分区容错性

