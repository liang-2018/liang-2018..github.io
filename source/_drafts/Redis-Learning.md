---
title: Redis Learning
toc: true
mathjax: true
date: 2019-05-13 10:18:11
tags: redis
categories: J2EE
---

> redis 学习笔记
>
> [TOC]

<!-- more -->

## 一、 Redis与NoSQL

## 1.单机MySQL

> 数据存储瓶颈
>
> + 数据量过大，一个机器不足以存储
> + 数据索引大，一个机器内存不足以存放
> + 访问量（读写混合）过大，一个实例不足以承受

## 2. 解决方式

+ Memcached + MySQL + 垂直拆分
+ 主从复制，读写分离
+ 分表分库，水平拆分，MySQL集群

## 3. NoSQL（Not Only SQL）使用

数量过大，关系复杂，使用关系型数据库处理不便。NoSQL数据存储不需要固定的模式，无需多余操作就可以横向扩展。

+ 一般MySQL使用Query Cache，每次表的更新Cache就失效，是一个大粒度的Cache
+ NoSQL的Cache是记录级的，是一种细粒度的Cache

当今web交互频繁，NoSQL在Cache层面上性能高很多。

## 4. 传统RDBMS与NoSQL对比

+ 传统RDBMS

  + 结构化查询语言
  + 数据和关系存储在单独表中
  + 数据操纵语言，数据定义语言
  + 严格一致性
  + 基础事物

+ NoSQL

  + 没有声明性查询语言
  + 没有预定义模式
  + 键值对处处，列存储，文档存储，U型数据库
  + 最终一致性，非ADID
  + 非结构化和不可预知数据
  + CAP定理
  + 高性能，高可用性和可伸缩性

  > 3V:海量Volume 多样Variety 实时 Velocity
  >
  > 3高: 高并发  高可扩 高性能

