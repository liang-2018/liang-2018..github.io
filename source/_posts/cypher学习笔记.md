---
title: cypher学习笔记
toc: true
mathjax: true
date: 2018-07-26 15:05:55
top: 1
tags:
- cypher
- neo4j
categories:
- database
---

> neo4j操作语言，cypher常用操作笔记

<!-- more -->

## 参考博文：

> https://blog.csdn.net/weixin_39012047/article/details/82348881
>
> https://blog.csdn.net/qq_32662595/article/details/79876345
>
> https://www.cnblogs.com/shangbingbing/p/5052964.html



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

## 二、更新（set/remove）

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

### set 

```cypher
// 使用 键值对 添加属性
merge (n:Student{name:"小明"}) SET n += { hungry: TRUE , position: 'outside the classroom' } return n
// 使用set 设置多个属性
match(n:Student) where n.name="小明" set n.hungry="True", n.position="outside the classroom" return n
// 给节点添加标签
MATCH (n { name: 'Stefan' }) SET n :German RETURN n
MATCH (n { name: 'Emil' }) SET n :Swedish:Bossman RETURN n 
```

### remove

```cypher
// 删除属性
match (n:Student) where n.name="小明" REMOVE n.age return n
// 删除节点的标签,其写法与set的设置标签一样
match (n:Student:Person:LeagueMember) where n.name="小明" REMOVE n:Student:LeagueMember return n
```

##  三、增（create、merge）

> 不同于mysql，在neo4j中，即使数据库中已有数据完全一致的节点，使用create依旧会创建新节点，原因在于neo4j中的每一个节点都有一个独一无二的id，使用id(n)可以获得其id。因而也就有了merge，merge会先检查是否已存在满足条件的节点，然后再进行操作。

### create

> 创建节点

```cypher
create (n:Person:Student) set n.name = "小明" return n //创建带多个标签的节点，小明既是人，也是学生
 create (n:Person {name:"weiw",age:23}) return n 
create (n:Person) set n.name = "weiw", n.age =23 return n   //创建节点并对属性设值   
```

> 创建关系
>
> 值得注意的是，neo4j中，关系也可以和节点一样，设置properties

```cypher
// 创建两个节点间关系
match (a:Person),(b:Person) where a.name="zhangs" and b.name="lisi"  create (a)-[r:RELTYPE]->(b) return r
// 创建关系，并对关系设值
match (a:Person),(b:Person) where a.name="zhangs" and b.name="lisi" 
create (a)-[r:RELTYPE {name:a.name +"<->" + b.name}]->(b) return r
// 设置多个节点间的关系,最好通过match来定位节点
create p=(an {name:"an"})-[:WORKS_AT]->(neo)<-[:WORKS_AT]-(mach {name:"mach"}) return p;                       
```

### merge

>和create不同的是，对不存在的节点进行创建，存在的直接返回。

> 合并 节点

```cypher
merge (n:Person{name:"小明"}) set n.age = 23 return n
merge (n:Person) where n.name = "小明" set n.age = 23 return n
```

> 条件 合并

```cypher
// 找到节点就设值
merge (keanu:Person {name:"Keanu"}) on  match set person.found=true return person;
// 在创建节点的时候，进行set设值
merge (keanu:Person {name:"Keanu"}) on create set keanu.created=timestamp() return keanu;
// 找到就设值，没找到就创建节点并设值
merge (keanu:Person {name:"Keanu"}) on create set keanu.created=timestamp() on match set keanu.lastSeen=timestamp() return keanu;
```

> 合并 关系

```cypher
// 一般先match 节点，再进行merge/create
match (charlie:Person {name:"Charlie"}),(wall:Movie {title:"Wall"})
merge (charlie)-[r:ACTED_AT]->(wall)  return r;
// 合并非直接关系(在创建关系的时候必须有方向，merge 创建关系时，默认的方式是前者指向后者)
MATCH (charlie:Person { name:'Charlie Sheen' }),(oliver:Person { name:'Oliver Stone' }) 
MERGE (charlie)-[r:KNOWS]-(oliver) RETURN r 
```

> 约束

```cypher
CREATE CONSTRAINT ON (n:Person) ASSERT n.name IS UNIQUE; 
CREATE CONSTRAINT ON (n:Person) ASSERT n.role IS UNIQUE;
MERGE (laurence:Person { name: 'Laurence Fishburne' }) RETURN laurence ；
```

## 四、删(delete)

> 删和查有点类似，只不过将对应的return换成delete即可,
>
> 需要注意的是，在neo4j中，如果有关系没有删除，节点是不允许删除的

```cypher
// 删除节点
MATCH (n:Student) where n.name="小明" DELETE n;
// 删除关系
MATCH (a:Studeng)-[r:love]-(b:Studeng) where a.name="小明" and b.name="小红" DELETE r
// 删除 关系和节点
MATCH (a:Studeng)-[r:love]-(b:Studeng) where a.name="小明" and b.name="小红" DELETE r，a, b
```

## 五、其他特殊关键字与函数

当前用得不多，待后面继续更新。