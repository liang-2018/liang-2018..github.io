---
title: LeetCode note - part 5
toc: true
mathjax: true
date: 2019-06-03 00:26:16
tags:
- LeetCode
- Algorithm
categories: LeetCode
---

> leetcode笔记，待整理

<!-- more -->

## [223. Rectangle Area](https://leetcode-cn.com/problems/rectangle-area/)

Find the total area covered by two rectilinear rectangles in a 2D plane.

Each rectangle is defined by its bottom left corner and top right corner as shown in the figure.

![Rectangle Area](https://assets.leetcode.com/uploads/2018/10/22/rectangle_area.png)

Example:
```
Input: A = -3, B = 0, C = 3, D = 4, E = 0, F = -1, G = 9, H = 2
Output: 45
```
Note:

Assume that the total area is never beyond the maximum possible value of int.

> 貌似有先决条件 D > B , C > A; G > E, H > F

```java
class Solution {
    public int computeArea(int A, int B, int C, int D, int E, int F, int G, int H) {
        if(B >= H || D <= F || C <= E || G <= A){
            return (C - A)*(D - B) + (G - E)*(H - F);
        }
        int height = Math.min(D,H)- Math.max(B,F);;
        int width = Math.min(C,G)-Math.max(E,A);;
        int total = (C - A)*(D - B) + (G - E)*(H - F);
        return total - height * width;
    }
}
```

## [225. Implement Stack using Queues](https://leetcode-cn.com/problems/implement-stack-using-queues/)

Implement the following operations of a stack using queues.

+ push(x) -- Push element x onto stack.
+ pop() -- Removes the element on top of the stack.
+ top() -- Get the top element.
+ empty() -- Return whether the stack is empty.

Example:

```
MyStack stack = new MyStack();

stack.push(1);
stack.push(2);  
stack.top();   // returns 2
stack.pop();   // returns 2
stack.empty(); // returns false
```
Notes:

> + You must use only standard operations of a queue -- which means only push to back, peek/pop from front, size, and is empty operations are valid.
> + Depending on your language, queue may not be supported natively. You may simulate a queue by using a list or deque (double-ended queue), as long as you use only standard operations of a queue.
> + You may assume that all operations are valid (for example, no pop or top operations will be called on an empty stack).

```java
class MyStack {
    private Queue<Integer> queue1;
    private Queue<Integer> queue2;
    private boolean flag;

    /** Initialize your data structure here. */
    public MyStack() {
        queue1 = new LinkedList();
        queue2 = new LinkedList();
        flag = true;
    }
    
    /** Push element x onto stack. */
    public void push(int x) {
        if(flag){
            queue1.add(x);
        }else{
            queue2.add(x);
        }
    }
    
    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        int val = 0;
        if(flag){
            flag = false;
            while(!queue1.isEmpty()){
                val = queue1.poll();
                if(queue1.isEmpty())break;
                queue2.add(val);
            }
        }else{
            flag = true;
            while(!queue2.isEmpty()){
                val = queue2.poll();
                if(queue2.isEmpty())break;
                queue1.add(val);
            }
        }
        return val;
    }
    
    /** Get the top element. */
    public int top() {
        int val = 0;
        if(flag){
            flag = false;
            while(!queue1.isEmpty()){
                val = queue1.poll();
                queue2.add(val);
            }
        }else{
            flag = true;
            while(!queue2.isEmpty()){
                val = queue2.poll();
                queue1.add(val);
            }
        }
        return val;
    }
    
    /** Returns whether the stack is empty. */
    public boolean empty() {
        return queue1.isEmpty() && queue2.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

## [226. Invert Binary Tree](https://leetcode-cn.com/problems/invert-binary-tree/)

Invert a binary tree.

Example:
```
Input:

     4
   /   \
  2     7
 / \   / \
1   3 6   9
```
Output:
```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```
Trivia:
This problem was inspired by this original tweet by Max Howell:

Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so fuck off.

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
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root == null)return null;
        TreeNode temp = invertTree(root.right);
        root.right = invertTree(root.left);
        root.left = temp;
        return root;
    }
}
```

## [227. Basic Calculator II](https://leetcode-cn.com/problems/basic-calculator-ii/)

Implement a basic calculator to evaluate a simple expression string.

The expression string contains only non-negative integers, +, -, *, / operators and empty spaces . The integer division should truncate toward zero.

Example 1:
```
Input: "3+2*2"
Output: 7
```
Example 2:
```
Input: " 3/2 "
Output: 1
```
Example 3:
```
Input: " 3+5 / 2 "
Output: 5
```
Note:

+ You may assume that the given expression is always valid.

+ Do not use the eval built-in library function.

  > 典型 中缀表达式转 前、后缀表达式
  > https://www.cnblogs.com/ysocean/p/7910432.html

```java

```

