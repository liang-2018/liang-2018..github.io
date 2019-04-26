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



##  参考博文：

> https://blog.csdn.net/weixin_39012047/article/details/82348881
>
> https://blog.csdn.net/qq_32662595/article/details/79876345
>
> https://www.cnblogs.com/shangbingbing/p/5052964.html

