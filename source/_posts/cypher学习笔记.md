---
title: cypher学习笔记
toc: true
mathjax: true
date: 2018-07-26 15:05:55
tags:
- cypher
- neo4j
categories:
- database
---

> neo4j操作语言，cypher常用操作笔记

<!-- more -->

## 一、查(match)

###  查询节点

> cypher 在很多方面比较相似，如order by、asc/desc、limit、distinct

```cypher
// 这种方式很像 sql
start n = node(*)  // 该端很多时候省略，表示遍历时在图中的起点，可以通过节点id或者查找获得
match (n:Person)  // 选择指定类型的节点
where n.name = "Jane" //使用相关属性进行筛选
and  n.age = 19
return n
// 也可以以另一种方式书写
match (n:Person{name:"Jane", age:19}) return n
```

如果放在mysql里差不多是这样

```mysql
select * from Person n where n.name = "Jane" and n.age= 19
```

> 对结果进行排序、升降序

```cypher
match (n:Person) return n order by n.age desc limit 25
```

> 分页查询

```cypher
match (n:Person) return n order by n.age desc skip 1 limit 25 // skip 1 limit 25 第一条不返回
```

> where 后条件中的操作符
>
> 数学操作符： + 、 - 、 * 、 / 、 %
>
> | 比较操作符号 | 含义                                        |
> | ------------ | ------------------------------------------- |
> | =            | 相等                                        |
> | <>           | 不等于（字符串等比对等不使用 != 而使用 <>） |
> | <            | 小于                                        |
> | >            | 大于                                        |
> | <=           | 小于等于                                    |
> | >=           | 大于等于                                    |

> 根据索引检索（待验证）

```cypher
START n=node:N_INDEX (USER_NAME='tom') RETURN n SKIP 0 LIMIT 20
START n=node:N_INDEX('USER_NAME:*tom*') RETURN n SKIP 0 LIMIT 20
```

###  查询关系（链）

> 通用查询(注意：关系是**有方向**的)

```cypher
match p = ()-[]-() return p //返回所有关系链
```

> 指定关系类型查询

```cypher
match p = ()-[r:has_father]->() return p // 返回所有父子关系对
```

> 指定关系层数
>
> 目前没发现怎么限定r的方法

```cypher
match p = ()-[r*2]-() return p //返回固定层数
match p = ()-[r*2..4]-() return p // 返回2到4层关系链
match p = ()-[r*..4]-() return p // 返回4层以下关系链
match p = ()-[r*2..]-() return p // 返回2层以上关系链
match p = ()-[*]-() return p // 不限长度
```

> 指定节点到节点的关系

```cypher
match (a:Person),(b:Person),p=(a)-[r:has_father]->(b)
where a.name = "son" and b.name = "father"
return p
```

### 模糊查询

```cypher
match (n:N)
where n.attr =~ '.*a1.*|.*a2.*' // 尽量不要分成两个or
return n
```

## 二、更新（update）

> cypher更新与mysql类似，都需要先定位需要修改的节点或者关系位置
>
> 不同的是，cypher中，如果对已有属性进行set时为更新该属性的值，如果没有该属性，则会新增该属性并设值
>
> 在mysql中如果没有对应字段，则会报错。

```cypher
match (a:Person),(b:Person),p=(a)-[r:has_father]->(b)
where a.name = "son" and b.name = "father"
set r.new_type = `has_son` //如果已有属性new_type则更新值，如果没有，则新增该属性并设值
return p
```

```cypher
match (n:Person{name:"Jane", age:19}) 
set n.nickName = "J" //如果已有属性 nickName 则更新值，如果没有，则新增该属性并设值
return n
```

##  三、增（create、merge）



##  参考博文：

> https://blog.csdn.net/weixin_39012047/article/details/82348881
>
> https://blog.csdn.net/qq_32662595/article/details/79876345
>
> https://www.cnblogs.com/shangbingbing/p/5052964.html

