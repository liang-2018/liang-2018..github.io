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
        long n=Math.abs((long)numerator);//int征服转换有可能溢出
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

> 使用两个StringBuilder 不用操心插入括号的位置了

```java
class Solution {
    public String fractionToDecimal(int numerator, int denominator) {
    	return fractionToDecimal2(numerator, denominator);
    }
    public String fractionToDecimal2(long numerator, long denominator) {
    	StringBuilder sb1 = new StringBuilder();
    	if (numerator<0&&denominator>0) {
    		sb1.append("-");
    		numerator = -numerator;
    	} else if(numerator>0&&denominator<0) {
    		sb1.append("-");
    		denominator = -denominator;
    	} if(numerator<0&&denominator<0) {
    		numerator = -numerator;
    		denominator = -denominator;
    	}
    	sb1.append( numerator/denominator );
    	if(numerator%denominator==0)
    		return sb1.toString();
    	sb1.append(".");
    	numerator %= denominator;
    	while(numerator!=0&&denominator%2==0||denominator%5==0) {
    		if(denominator%10==0)
    			denominator /= 10;
    		else if(denominator%2==0) {
    			denominator /= 2;
    			numerator *= 5;
    		} else {
			denominator /= 5;
			numerator *= 2;
		}
    		sb1.append(numerator/denominator);
    		numerator %= denominator;
    	}
    	if(numerator%denominator==0)
    		return sb1.toString();
    	numerator %= denominator;
    	long reminder = numerator;
    	StringBuilder sb2 = new StringBuilder();
    	while(true) {
    		reminder *= 10;
    		sb2.append(reminder/denominator);
    		reminder = reminder%denominator;
    		if(reminder%denominator==0||reminder==numerator)
    			break;
    	}
    	if(reminder%denominator==0)
    		return sb1.append(sb2).toString();
    	else
    		return sb1.append("(").append(sb2).append(")").toString();
    }    
}
```



## [167. Two Sum II - Input array is sorted](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)

> Given an array of integers that is already **sorted in ascending order**, find two numbers such that they add up to a specific target number.
>
> The function twoSum should return indices of the two numbers such that they add up to the target, where index1 must be less than index2.
>
> **Note:**
>
> - Your returned answers (both index1 and index2) are not zero-based.
> - You may assume that each input would have *exactly* one solution and you may not use the *same* element twice.
>
> **Example:**
>
> ```
> Input: numbers = [2,7,11,15], target = 9
> Output: [1,2]
> Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.
> ```

```java
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;
        while(left < right){
            int addup = numbers[left] + numbers[right];
            if(addup == target){
                return new int[]{left + 1, right + 1};
            }
            if(addup > target){
                right --;   
            }else{
                left ++;    
            }            
        }
        return new int[]{-1,-1};
    }
}
```

## [168. Excel Sheet Column Title](https://leetcode-cn.com/problems/excel-sheet-column-title/)

> Given a positive integer, return its corresponding column title as appear in an Excel sheet.
>
> For example:
>
> ```
>     1 -> A
>     2 -> B
>     3 -> C
>     ...
>     26 -> Z
>     27 -> AA
>     28 -> AB 
>     ...
> ```
>
> **Example 1:**
>
> ```
> Input: 1
> Output: "A"
> ```
>
> **Example 2:**
>
> ```
> Input: 28
> Output: "AB"
> ```
>
> **Example 3:**
>
> ```
> Input: 701
> Output: "ZY"
> ```

> 10进制转26进制，不过由于10进制是从0到9，而 26进制是从'A' ~ 'Z'，由于 1 对应 A，但是没有字母对应数字 0，需要对数值进行预处理（减一处理）

```java
class Solution {
    public String convertToTitle(int n) {
        StringBuilder sb = new StringBuilder();
       
        while(n > 0){
            n --; // 减一处理，
            sb.append((char) (n % 26 + 'A'));
            n = n / 26;
        }
        return sb.reverse().toString();
    }
}
```

## [169. Majority Element](https://leetcode-cn.com/problems/majority-element/)

> Given an array of size *n*, find the majority element. The majority element is the element that appears **more than** `⌊ n/2 ⌋` times.
>
> You may assume that the array is non-empty and the majority element always exist in the array.
>
> **Example 1:**
>
> ```
> Input: [3,2,3]
> Output: 3
> ```
>
> **Example 2:**
>
> ```
> Input: [2,2,1,1,1,2,2]
> Output: 2
> ```

> 偷鸡法，排序然后去中间那个那个。
> 实际上排序需要的时间复杂度是 (nlogn)

```java
class Solution {
    public int majorityElement(int[] nums) {
        Arrays.sort(nums);
        return nums[nums.length / 2];
    }
}
```

> 正儿八经计数 ：从第一个数开始count=1，遇到相同的就加1，遇到不同的就减1，减到0就重新换个数开始计数，总能找到最多的那个

```java
class Solution {
    public int majorityElement(int[] nums) {
        int majority = nums[0];
        int count = 0;
        for(int i = 0; i < nums.length; i++){
            if(majority == nums[i]){
                count ++;
            }else{
                count --;
                if(count == 0){
                    majority = nums[ i + 1];
                }
            }
        }
        
        return majority;
    }
}
```

## [172. Factorial Trailing Zeroes](https://leetcode-cn.com/problems/factorial-trailing-zeroes/)

> Given an integer *n*, return the number of trailing zeroes in *n*!.
>
> **Example 1:**
>
> ```
> Input: 3
> Output: 0
> Explanation: 3! = 6, no trailing zero.
> ```
>
> **Example 2:**
>
> ```
> Input: 5
> Output: 1
> Explanation: 5! = 120, one trailing zero.
> ```
>
> **Note:** Your solution should be in logarithmic time complexity.

> 由于是阶乘，所以0在乘积后面且连续的，故而分解可得 x * $10^y$ ,也即 x * $2^y * 5^y$,由于阶乘分解后 2的个数远多于5的个数，所以 0 的个数，取决于分解后 5 的个数。

```java
class Solution {
    public int trailingZeroes(int n) {
        int count = 0;
        while(n >= 5){
            count += n / 5;
            n = n / 5;
        }
        return count;
    }
}
```

```java
class Solution {
    public int trailingZeroes(int n) {
        if( n < 5 )return 0;
        return n / 5 + trailingZeroes(n / 5);
    }
}
```

> 错误想法，一来不符合题目时间要求，二来考虑不够周全

```java
class Solution {
    public int trailingZeroes(int n) {
        int count = 0;
        for(int i = 1; i <= n; i ++){
            if(i % 5 == 0)count ++; // 遇到数字 25  625之类的数值就会出现错误
        }
        return count;
    }
}
```

## [173. Binary Search Tree Iterator](https://leetcode-cn.com/problems/binary-search-tree-iterator/)

> Implement an iterator over a binary search tree (BST). Your iterator will be initialized with the root node of a BST.
>
> Calling `next()` will return the next smallest number in the BST.
>
>  
>
> 
>
> **Example:**
>
> **![img](https://assets.leetcode.com/uploads/2018/12/25/bst-tree.png)**
>
> ```
> BSTIterator iterator = new BSTIterator(root);
> iterator.next();    // return 3
> iterator.next();    // return 7
> iterator.hasNext(); // return true
> iterator.next();    // return 9
> iterator.hasNext(); // return true
> iterator.next();    // return 15
> iterator.hasNext(); // return true
> iterator.next();    // return 20
> iterator.hasNext(); // return false
> ```
>
>  
>
> **Note:**
>
> - `next()` and `hasNext()` should run in average O(1) time and uses O(*h*) memory, where *h* is the height of the tree.
> - You may assume that `next()` call will always be valid, that is, there will be at least a next smallest number in the BST when `next()` is called.

> 通过数组通过 后 中 前  存储所有的数据，用来遍历

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class BSTIterator {
    private Object[] data;
    private int size;
    public BSTIterator(TreeNode root) {
        Stack<TreeNode> stack = new Stack();
        TreeNode pre = null;
        List<Integer> result = new ArrayList();
        while(root!=null||!stack.empty()){
            while(root!=null){
                stack.add(root);
                root=root.right;
            }
            root=stack.peek();
            result.add(root.val);
            stack.pop();
            root=root.left;
        }
        data = result.toArray();
        size = data.length;
    }
    
    /** @return the next smallest number */
    public int next() {
        return (int)data[size -- - 1];
    }
    
    /** @return whether we have a next smallest number */
    public boolean hasNext() {
        return size > 0;
    }
}

/**
 * Your BSTIterator object will be instantiated and called as such:
 * BSTIterator obj = new BSTIterator(root);
 * int param_1 = obj.next();
 * boolean param_2 = obj.hasNext();
 */
```

> 最快捷的

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class BSTIterator {
    private ArrayList<Integer> order = new ArrayList<>();
    private int currIdx;
    private int size;
    public BSTIterator(TreeNode root) {
        inOrder(root);
        currIdx = -1;
        size = order.size();
    }
    
    /** @return the next smallest number */
    public int next() {
        if (hasNext())
            return order.get(++currIdx);
        return -1; // 表示不存在下一个元素
    }
    
    /** @return whether we have a next smallest number */
    public boolean hasNext() {
        return currIdx < size - 1;
    }
    
    private void inOrder(TreeNode root) {
        if (root == null)
            return ;
        inOrder(root.left);
        order.add(root.val);
        inOrder(root.right);
    } 
}

/**
 * Your BSTIterator object will be instantiated and called as such:
 * BSTIterator obj = new BSTIterator(root);
 * int param_1 = obj.next();
 * boolean param_2 = obj.hasNext();
 */
```

