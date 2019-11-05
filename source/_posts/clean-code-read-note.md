---
title: 代码整洁之道阅读笔记
toc: true
mathjax: true
top: 1
date: 2019-10-09 19:21:35
tags:
- code
categories:
- 读书笔记
---

> 代码整洁之道阅读笔记，逐步更新中，愿毕业前能把笔记整理完。

<!-- more -->

## 整洁代码

### 简单代码规则

> 按照重要程度排序

+ 能通过所有测试
+ 没有重复代码
+ 体现系统中的全部设计理念
+ 包括尽量少的实体，比如类、方法、函数等

> 代码重复、有意义的命名 --> 减少重复和提高表达力
> 让营地比你来时更干净！

## 一、有意义的命名

### 1. 名副其实

> 有意义的命名：通过命名了解目的与用处

### 2. 避免误导

+ 避免使用与本意相悖的词
  + hp, aix, sco 等专用名称
  + List, Map, Set 等慎用，即使本身是对应的集合类型也尽量别写出容器类型名
+ 提防使用不同之处较小的名称
  + 小写字母 l 和 数字 1；大写字母 O 与 数字 0
  + 比较长的命名应尽可能区分大，如：XYZControllerForEfficientHandlingOfStrings 与 XYZControllerForEfficientStorageOfStrings 难以快速区分