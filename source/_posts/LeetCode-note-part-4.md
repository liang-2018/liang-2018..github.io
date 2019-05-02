---
title: LeetCode note - part 4
toc: true
mathjax: true
date: 2019-05-03 00:26:16
tags:
- LeetCode
- Algorithm
categories: LeetCode
---

> LeetCode 刷题笔记 4

<!-- more -->

## [166. Fraction to Recurring Decimal](https://leetcode-cn.com/problems/fraction-to-recurring-decimal/)

> Given two integers representing the numerator and denominator of a fraction, return the fraction in string format.
>
> If the fractional part is repeating, enclose the repeating part in parentheses.
>
> **Example 1:**
>
> ```
> Input: numerator = 1, denominator = 2
> Output: "0.5"
> ```
>
> **Example 2:**
>
> ```
> Input: numerator = 2, denominator = 1
> Output: "2"
> ```
>
> **Example 3:**
>
> ```
> Input: numerator = 2, denominator = 3
> Output: "0.(6)"
> ```

> 此题关键在于一个知识点：能写成分数的都是有理数，**有理数要么是有限的，要么是无限循环小数**
>
> 为避免溢出，使用long
>
> <https://www.cnblogs.com/grandyang/p/4238577.html>

```java
class Solution {
    public String fractionToDecimal(int numerator, int denominator) {
        if(denominator==0)
            return "NaN";
        if(numerator==0)
            return "0";
        StringBuilder sb=new StringBuilder();
        Boolean sign=(numerator>=0)^(denominator>=0);//都为正和都为负的时候为false，不需加负号
        if(sign)
        	sb.append('-');
        long n=Math.abs((long)numerator);
        long d=Math.abs((long)denominator);
        long m = n / d; //整数部分的商
        long r= n - m * d; // 余数
        sb.append(m);
        if(r == 0){
            return sb.toString();
        }
        sb.append(".");
        r = r * 10;
        Map<Long, Integer> map = new HashMap();   
        map.put(r, sb.length());
        while(r != 0){            
            m = r / d;
            r = r - m * d;   
            sb.append(m);
            r = r * 10;
            if(map.containsKey(r)){
                sb.append(')');
                sb.insert((int)map.get(r), '(');//StringBuilder的insert方法
                break;
            }else{               
                map.put(r, sb.length());
            }
            if(r == 0){
                return sb.toString();
            }
        }
       return sb.toString();
    }  
}
```

