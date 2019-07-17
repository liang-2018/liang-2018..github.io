---
title: LeetCode note - part 5
toc: true
mathjax: true
date: 2018-11-03 00:26:16
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

  > 由于没有括号，可以简单化，遇到乘除法按照顺序先计算，最后退化成 加减法，就容易了

```java
class Solution {
    public int calculate(String s) {
        Stack<Integer> stack = new Stack();
        int res = 0;
        int num = 0;
        char sign = '+';
        char[] sArray = s.toCharArray();
        for(int i = 0; i < sArray.length; i++){
            if(sArray[i] >= '0' && sArray[i] <= '9'){
                num = 10 *num + sArray[i] - '0';
            }
            
            if((sArray[i] < '0' && sArray[i] != ' ') || i == sArray.length - 1){
                if(sign == '+'){
                    stack.push(num);
                }else if(sign == '-'){
                    stack.push(-num);
                }else if(sign == '*'){
                    stack.push(num * stack.pop());
                }else if(sign == '/'){
                    stack.push(stack.pop() / num);
                }
                sign = sArray[i];
                num = 0;
            }            
        }
        while(!stack.isEmpty()){
            res += stack.pop();
        }
        return res;
    }
}
```

> 总体原理差不多，不过使用数组相比栈增速不少

```java
class Solution {
	public int calculate(String s) {
		// 用于在字符串遍历的过程中保存数字
		int num = 0;
		boolean hasNum = false;
		// 字符堆栈
		char[] charStack = new char[2];
		// 字符堆栈栈顶
		int charStackTop = 0;
		// 数字堆栈
		int[] numStack = new int[3];
		// 数字堆栈栈顶
		int numStackTop = 0;
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			if (c != ' ') {
				if (c >= '0' && c <= '9') {
					num = num * 10 + (c - '0');
					hasNum = true;
				} else {
					//数字扫描结束
					if (hasNum) {
						numStack[numStackTop++] = num;
						num = 0;
						hasNum = false;
					}
					boolean continueFlag = true;
					do {
						continueFlag = false;
						if (c == '+' || c == '-') {
							if (charStackTop > 0) {
								int acb = calculate0(numStack[--numStackTop], numStack[--numStackTop], charStack[--charStackTop]);
								numStack[numStackTop++] = acb;
								continueFlag = true;
							}
						} else if (charStackTop > 0 && ((charStack[charStackTop - 1]) == '*' || (charStack[charStackTop - 1]) == '/')) {
							int acb = calculate0(numStack[--numStackTop], numStack[--numStackTop], charStack[--charStackTop]);
							numStack[numStackTop++] = acb;
							continueFlag = true;
						}
					}while(continueFlag);
					charStack[charStackTop++] = c;
				}
			}
		}
		if (hasNum) {
			numStack[numStackTop] = num;
		}
		if (charStackTop == 0) {
			return numStack[0];
		} else {
			return (charStackTop == 1 ? calculate0(numStack[1], numStack[0], charStack[0]) :
					calculate0(calculate0(numStack[2], numStack[1], charStack[1]), numStack[0], charStack[0]));
		} 
	}


	private int calculate0(int b, int a, char c) {
		if (c == '+') {
			return a + b;
		} else if (c == '-') {
			return a - b;
		} else if (c == '*') {
			return a * b;
		} else {
			return a / b;
		}
	}
}
```

## [228. Summary Ranges](https://leetcode-cn.com/problems/summary-ranges/)

Given a sorted integer array without duplicates, return the summary of its ranges.

Example 1:
```
Input:  [0,1,2,4,5,7]
Output: ["0->2","4->5","7"]
Explanation: 0,1,2 form a continuous range; 4,5 form a continuous range.
```
Example 2:
```
Input:  [0,2,3,4,6,8,9]
Output: ["0","2->4","6","8->9"]
Explanation: 2,3,4 form a continuous range; 8,9 form a continuous range.
```

> 很简单的题，需要考虑最后一个数

```java
class Solution {
    public List<String> summaryRanges(int[] nums) {
        List<String> list = new ArrayList();
        if(nums.length == 0)return list;
        int start = nums[0];
        int prev = nums[0];
        for(int num : nums){
            if(num > prev + 1){
                if(start == prev){
                    list.add(start + "");
                }else{
                     list.add(start + "->" + prev);
                }               
                start = num;
            }            
            prev = num;
        }
        if(start == nums[nums.length -1]){
            list.add(prev + "");
        }
        if(start < nums[nums.length -1]){
            list.add(start + "->" + prev + "");
        }
        return list;
    }
}
```

## [231. Power of Two](https://leetcode-cn.com/problems/power-of-two/)

Given an integer, write a function to determine if it is a power of two.

Example 1:
```
Input: 1
Output: true 
Explanation: 20 = 1
```
Example 2:
```
Input: 16
Output: true
Explanation: 24 = 16
```
Example 3:
```
Input: 218
Output: false
```

> 只要抓住2的幂用二进制表示都只有1个1，题目就比较简单，方法有很多，但是一样能玩出花来

> 因为看JDK源码的缘故，第一反应竟然是，Integer#bitCount

```java
class Solution {
    public boolean isPowerOfTwo(int n) {
        if(n < 1)return false;
        n = n - ((n >>> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n>>>2) & 0x33333333);
        n = (n + (n>>>4)) & 0x0f0f0f0f;
        n = n + (n >>> 8);
        n = n + (n >>> 16);
        n = n & 0x3f;
        return n == 1;
    }
}
// 这个方法原理也是数二进制时 1的个数
class Solution {
    public boolean isPowerOfTwo(int n) {
        int count = 0;
        while(n > 0){
            n = n & (n -1);
            count ++;
        }
        if(count == 1)return true;
        return false;
    }
}
```

> 常规除法。

```java
class Solution {
    public boolean isPowerOfTwo(int n) {
        if(n<=0){
            return false;
        }
        if(n==1){
      		return true;
        }
        if(n%2!=0){
            return false;
        }      
       return  isPowerOfTwo(n/2);
    }
}
```

## [232. Implement Queue using Stacks](https://leetcode-cn.com/problems/implement-queue-using-stacks/)

Implement the following operations of a queue using stacks.

push(x) -- Push element x to the back of queue.
pop() -- Removes the element from in front of queue.
peek() -- Get the front element.
empty() -- Return whether the queue is empty.
Example:
```
MyQueue queue = new MyQueue();

queue.push(1);
queue.push(2);  
queue.peek();  // returns 1
queue.pop();   // returns 1
queue.empty(); // returns false
```
Notes:

You must use only standard operations of a stack -- which means only push to top, peek/pop from top, size, and is empty operations are valid.
Depending on your language, stack may not be supported natively. You may simulate a stack by using a list or deque (double-ended queue), as long as you use only standard operations of a stack.
You may assume that all operations are valid (for example, no pop or peek operations will be called on an empty queue).

> 概念题，知晓 栈 和 队列 的定义即可

```java
class MyQueue {
    Stack<Integer> stack1 = new Stack();
    Stack<Integer> stack2 = new Stack();
    int peek = 0;
    /** Initialize your data structure here. */
    public MyQueue() {
        
    }
    
    /** Push element x to the back of queue. */
    public void push(int x) {
        stack1.push(x);
        if(stack1.size() == 1)peek = x;
    }
    
    /** Removes the element from in front of queue and returns that element. */
    public int pop() {
        int res = -1;
        while(!stack1.isEmpty()){
            if(stack1.size() == 2){
                peek = stack1.pop();
                stack2.push(peek);
            }else if(stack1.size() == 1){
                res =  stack1.pop();
            }else{
                stack2.push(stack1.pop());
            }
        }
        while(!stack2.isEmpty()){
            stack1.push(stack2.pop());
        }
        return res;
    }
    
    /** Get the front element. */
    public int peek() {
        return peek;
    }
    
    /** Returns whether the queue is empty. */
    public boolean empty() {
        return stack1.isEmpty() && stack2.isEmpty();
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```

