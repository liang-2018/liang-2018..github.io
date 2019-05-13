---
title: 剑指Offer笔记
toc: true
mathjax: true
date: 2019-05-07 15:32:15
tags:
- Algorithm
- 剑指offer
categories:
- Algorithm
---

> 看剑指offer部分笔记

<!-- more -->

+ Page 55  （从后往前合并/修改，减少移动或修改次数，提高效率）
  + 字符串修改
  + 数组合并

+ P59 (循环与递归优缺点)
  + 递归代码简洁
  + 递归需要额外栈内存保存参数、返回地址、临时变量
  + 如果处理链过长，可能导致调用栈溢出，相比之下基于循环的代码鲁棒性要好些

+ P61

  + 二叉搜索树：平均查询时间 O(logn)

+ 判断奇偶数可使用位预算  num&0x01 == 0为偶数，否则为奇数

+ P136 k > 0(无符号数就更骚气了)是忘记判断的。。。。。 

+ P151 关于float与double比较, Java对0做了处理，与C++不同，但是对于非0值，精度不同，即使值相当一般判定不等

  > ```java
  > float a = 0.234f;
  > double b = 0.234;
  > System.out.println(a == b);
  > ```
  >
  > ```
  > false
  > ```
  >
  > ```java
  > float a = 0.0f;
  > double b = 0.0000;
  > System.out.println(a == b);
  > ```
  >
  > ```
  > true
  > ```

+ 

<h3 style="float:left;">ABC项目</h3>
<h3 style="float:right;">2018年01月</h3>

负责了MarkDown 能滤除多余的空格、制表符，使得竖直方向的对齐成为一个难题。 
但 `全角空格` 却是这样一个例外，利用它你可以轻松实现右对齐。 
只不过因为最终要输出 PDF，所以你必须多次输出 PDF 才能得到真正想要的效果。

<h3 style="float:left;">ABC项目</h3>
<h3 style="float:right;">2019年01月</h3>

