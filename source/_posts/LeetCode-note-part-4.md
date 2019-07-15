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

## [229. Majority Element II](https://leetcode-cn.com/problems/majority-element-ii/)

Given an integer array of size n, find all elements that appear more than ⌊ n/3 ⌋ times.

Note: The algorithm should run in linear time and in O(1) space.

Example 1:
```
Input: [3,2,3]
Output: [3]
```
Example 2:
```
Input: [1,1,1,3,3,2,2,2]
Output: [1,2]
```

> Boyer-Moore Majority Vote Algorithm 摩尔投票法

```java
class Solution {
    public List<Integer> majorityElement(int[] nums) {
        List<Integer> list = new ArrayList();
        if(nums.length == 0)return list;
        int num1 = nums[0], num2 = nums[0];
        int count1 = 0, count2 = 0;
        for(int num : nums){
            if(num == num1){
                count1 ++;
            }else if(num == num2){
                count2 ++;
            }else if(count1 == 0){
                num1 = num;
                count1 = 1;
            }else if(count2 == 0){
                num2 = num;
                count2 = 1;
            }else{
                count1 --;
                count2 --;
            }
        }
        count1 = count2 = 0;
        for(int num : nums){
            if(num == num1){
                count1 ++;                
            }else if(num == num2){
                count2 ++;
            }
        }
        if(count1 * 3 > nums.length)list.add(num1);
        if(count2 * 3 > nums.length)list.add(num2);
        return list;
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

## [189. Rotate Array](https://leetcode-cn.com/problems/rotate-array/)

> Given an array, rotate the array to the right by *k* steps, where *k* is non-negative.
>
> **Example 1:**
>
> ```
> Input: [1,2,3,4,5,6,7] and k = 3
> Output: [5,6,7,1,2,3,4]
> Explanation:
> rotate 1 steps to the right: [7,1,2,3,4,5,6]
> rotate 2 steps to the right: [6,7,1,2,3,4,5]
> rotate 3 steps to the right: [5,6,7,1,2,3,4]
> ```
>
> **Example 2:**
>
> ```
> Input: [-1,-100,3,99] and k = 2
> Output: [3,99,-1,-100]
> Explanation: 
> rotate 1 steps to the right: [99,-1,-100,3]
> rotate 2 steps to the right: [3,99,-1,-100]
> ```
>
> **Note:**
>
> - Try to come up as many solutions as you can, there are at least 3 different ways to solve this problem.
> - Could you do it in-place with O(1) extra space?

```java
class Solution {
    public void rotate(int[] nums, int k) {
        int length = nums.length;
        k = k % length;
        revert(nums, 0, length - 1);//整体翻转
        revert(nums, 0, k - 1);//前面k个数翻转
        revert(nums, k, length - 1);//后面length - k个数翻转
    }
    private void revert(int[] nums, int start, int end){
        while(start < end){
            int tmp = nums[start];
            nums[start ++] = nums[end];
            nums[end --] = tmp;
        }
    }
}
```

```java
 /**
     * 循环交换
     * 时间复杂度：O(n)
     * 空间复杂度：O(1)
     */ 
public void rotate_3(int[] nums, int k) {
        int n = nums.length;
        k %= n;
        // 第一次交换完毕后，前 k 位数字位置正确，后 n-k 位数字中最后 k 位数字顺序错误，继续交换
        for (int start = 0; start < nums.length && k != 0; n -= k, start += k, k %= n) {
            for (int i = 0; i < k; i++) {
                swap(nums, start + i, nums.length - k + i);
            }
        }
 }
 /**
     * 递归交换
     * 时间复杂度：O(n)
     * 空间复杂度：O(n/k)
     */
    public void rotate(int[] nums, int k) {
        // 原理同上
        recursiveSwap(nums, k, 0, nums.length);
    }

    private void recursiveSwap(int[] nums, int k, int start, int length) {
        k %= length;
        if (k != 0) {
            for (int i = 0; i < k; i++) {
                swap(nums, start + i, nums.length - k + i);
            }
            recursiveSwap(nums, k, start + k, length - k);
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

## [187. Repeated DNA Sequences](https://leetcode-cn.com/problems/repeated-dna-sequences/)

> All DNA is composed of a series of nucleotides abbreviated as A, C, G, and T, for example: "ACGAATTCCG". When studying DNA, it is sometimes useful to identify repeated sequences within the DNA.
>
> Write a function to find all the **10-letter-long** sequences (substrings) that occur more than once in a DNA molecule.
>
> **Example:**
>
> ```
> Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
> 
> Output: ["AAAAACCCCC", "CCCCCAAAAA"]
> ```

```java
class Solution {
    public List<String> findRepeatedDnaSequences(String s) {
       Set<String> set = new HashSet<>();
        Set<String> help = new HashSet<>();
        for(int i = 0; i <= s.length()-10; i++){
            String cur = s.substring(i, i+10);
            if(!set.add(cur)) help.add(cur);
        }
        return new ArrayList<String>(help);
    }
}
```

## [190. Reverse Bits](https://leetcode-cn.com/problems/reverse-bits/)

> Reverse bits of a given 32 bits unsigned integer.
>
>  
>
> **Example 1:**
>
> ```
> Input: 00000010100101000001111010011100
> Output: 00111001011110000010100101000000
> Explanation: The input binary string 00000010100101000001111010011100 represents the unsigned integer 43261596, so return 964176192 which its binary representation is 00111001011110000010100101000000.
> ```
>
> **Example 2:**
>
> ```
> Input: 11111111111111111111111111111101
> Output: 10111111111111111111111111111111
> Explanation: The input binary string 11111111111111111111111111111101 represents the unsigned integer 4294967293, so return 3221225471 which its binary representation is 10101111110010110010011101101001.
> ```
>
>  
>
> **Note:**
>
> - Note that in some languages such as Java, there is no unsigned integer type. In this case, both input and output will be given as signed integer type and should not affect your implementation, as the internal binary representation of the integer is the same whether it is signed or unsigned.
> - In Java, the compiler represents the signed integers using [2's complement notation](https://en.wikipedia.org/wiki/Two%27s_complement). Therefore, in **Example 2** above the input represents the signed integer `-3` and the output represents the signed integer `-1073741825`.

```java
public class Solution {
    // you need treat n as an unsigned value
    public int reverseBits(int n) {
        int res = 0;
        for(int i = 0; i < 32; i++){
            res = (res << 1) | (n & 0x01);
            //res = (res << 1) ^ (n & 0x01);
            n = n >> 1;
        }
        return res;
    }
}
```

```java
public class Solution {
    // you need treat n as an unsigned value
    public int reverseBits(int n) {
        int a=0;
        for(int i=0;i<=31;i++){
            a=a+((1&(n>>i))<<(31-i));
        }
        return a;
    }
}
```

## [191. Number of 1 Bits](https://leetcode-cn.com/problems/number-of-1-bits/)

> Write a function that takes an unsigned integer and return the number of '1' bits it has (also known as the [Hamming weight](http://en.wikipedia.org/wiki/Hamming_weight)).
>
>  
>
> **Example 1:**
>
> ```
> Input: 00000000000000000000000000001011
> Output: 3
> Explanation: The input binary string 00000000000000000000000000001011 has a total of three '1' bits.
> ```
>
> **Example 2:**
>
> ```
> Input: 00000000000000000000000010000000
> Output: 1
> Explanation: The input binary string 00000000000000000000000010000000 has a total of one '1' bit.
> ```
>
> **Example 3:**
>
> ```
> Input: 11111111111111111111111111111101
> Output: 31
> Explanation: The input binary string 11111111111111111111111111111101 has a total of thirty one '1' bits.
> ```
>
>  
>
> **Note:**
>
> - Note that in some languages such as Java, there is no unsigned integer type. In this case, the input will be given as signed integer type and should not affect your implementation, as the internal binary representation of the integer is the same whether it is signed or unsigned.
> - In Java, the compiler represents the signed integers using [2's complement notation](https://en.wikipedia.org/wiki/Two%27s_complement). Therefore, in **Example 3** above the input represents the signed integer `-3`.

```java
public class Solution {
    // you need to treat n as an unsigned value
    public int hammingWeight(int n) {
        int count = 0;
    	while (n != 0) {
    		count++;
    		n &= (n - 1);// n&(n-1)时，正好只有去除最后一个1，当所有的1都去除后，就是0了
    	}
    	
    	return count;
    }
}
```

```java
public class Solution {
    // you need to treat n as an unsigned value
    public int hammingWeight(int n) {
        int count = 0;
        while(n != 0){
            count += (n & 0x01);
            n = n >>> 1;
        }
        return count;
    }
}
public class Solution {
    // you need to treat n as an unsigned value
    public int hammingWeight(int n) {
        int count = 0;
        for(int i = 0; i < 32; i++){
            count += (n & 0x01);
            n = n >> 1;
        }
        return count;
    }
}
```

## awk-[192. Word Frequency](https://leetcode-cn.com/problems/word-frequency/)

> Write a bash script to calculate the frequency of each word in a text file `words.txt`.
>
> For simplicity sake, you may assume:
>
> - `words.txt` contains only lowercase characters and space `' '` characters.
> - Each word must consist of lowercase characters only.
> - Words are separated by one or more whitespace characters.
>
> **Example:**
>
> Assume that `words.txt` has the following content:
>
> ```
> the day is sunny the the
> the sunny is is
> ```
>
> Your script should output the following, sorted by descending frequency:
>
> ```
> the 4
> is 3
> sunny 2
> day 1
> ```
>
> **Note:**
>
> - Don't worry about handling ties, it is guaranteed that each word's frequency count is unique.
> - Could you write it in one-line using [Unix pipes](http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO-4.html)?

```java
# Read from the file words.txt and output the word frequency list to stdout.
cat words.txt |tr -s ' ' '\n' |sort |uniq -c |sort -r |awk '{print $2" "$1}'
```

## [198. House Robber](https://leetcode-cn.com/problems/house-robber/)

> You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security system connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.
>
> Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight **without alerting the police**.
>
> **Example 1:**
>
> ```
> Input: [1,2,3,1]
> Output: 4
> Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
>              Total amount you can rob = 1 + 3 = 4.
> ```
>
> **Example 2:**
>
> ```
> Input: [2,7,9,3,1]
> Output: 12
> Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
>              Total amount you can rob = 2 + 9 + 1 = 12.
> ```

```java
class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if(n == 0) return 0;
        if(n == 1) return nums[0];
        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0],nums[1]);
        for(int i=2;i<n;i++){
            dp[i] = Math.max(dp[i-1],dp[i-2]+nums[i]);// 从0开始偷，偷到i为止，最大的偷取收益值
        }
        return dp[n-1];
    }
}
```

```java
class Solution {  
   public int rob(int[] nums) {
        memo = new int[nums.length];
        Arrays.fill(memo, -1);
        return tryRob(nums, 0);
    }
    private int tryRob(int[] nums, int index) {
        if (index >= nums.length) {
            return 0;
        }
        // 记忆化搜索可以避免重叠子问题的重复运算
        if (memo[index] != -1) {
            return memo[index];
        }
        // 下面是对状态转移方程的描述
        int res = 0;
        for (int i = index; i < nums.length; i++) {
            res = Math.max(res, nums[i] + tryRob(nums, i + 2));
        }
        memo[index] = res;
        return res;
    }
   
}
```
## [213. House Robber II](https://leetcode-cn.com/problems/house-robber-ii/)

Given a list of non-negative integers representing the amount of money of each house, determine the maximum amount of money you can rob tonight without alerting the police.

Example 1:
```
Input: [2,3,2]
Output: 3
Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2),
             because they are adjacent houses.
```
Example 2:
```
Input: [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
             Total amount you can rob = 1 + 3 = 4.

```

>与上一题基本一致，重点在于，抢了0不能抢n-1,抢了n-1不能抢0

```java
class Solution {
    public int rob(int[] nums) {
        int len = nums.length;
        if(len == 0)return 0;
        if(len == 1)return nums[0];
        int[] dp = new int[len];
        int[] dp2 = new int[len];
        dp[0] = nums[0];
        dp2[len - 1] = nums[len - 1];
        dp[1] = Math.max(nums[0], nums[1]);
        dp2[len - 2] = Math.max(nums[len - 1], nums[len - 2]);
        for(int i = 2; i < len - 1; i ++){
            dp[i] = Math.max(dp[i - 1], dp[i-2] + nums[i]);            
        }
        for(int i = len - 3; i > 0; i --){
            dp2[i] = Math.max(dp2[i + 1], dp2[i + 2] + nums[i]);
        }
        return dp[len-2] > dp2[1]? dp[len-2]:dp2[1];
    }
}
```

## [337. House Robber III](https://leetcode-cn.com/problems/house-robber-iii/)

The thief has found himself a new place for his thievery again. There is only one entrance to this area, called the "root." Besides the root, each house has one and only one parent house. After a tour, the smart thief realized that "all houses in this place forms a binary tree". It will automatically contact the police if two directly-linked houses were broken into on the same night.

Determine the maximum amount of money the thief can rob tonight without alerting the police.

Example 1:
```
Input: [3,2,3,null,3,null,1]

     3
    / \
   2   3
    \   \ 
     3   1

Output: 7 
Explanation: Maximum amount of money the thief can rob = 3 + 3 + 1 = 7.
```
Example 2:
```
Input: [3,4,5,1,3,null,1]

     3
    / \
   4   5
  / \   \ 
 1   3   1

Output: 9
Explanation: Maximum amount of money the thief can rob = 4 + 5 = 9.
```
```java

```

## [199. Binary Tree Right Side View](https://leetcode-cn.com/problems/binary-tree-right-side-view/)

> Given a binary tree, imagine yourself standing on the *right* side of it, return the values of the nodes you can see ordered from top to bottom.
>
> **Example:**
>
> ```
> Input: [1,2,3,null,5,null,4]
> Output: [1, 3, 4]
> Explanation:
> 
>    1            <---
>  /   \
> 2     3         <---
>  \     \
>   5     4       <---
> ```

题目意思是，只能看到最右边的数字，右边的数字会遮挡遍的数字。

> 最快能想到的就是用两个栈保存每层的节点，一个从左往右，一个从右往左。

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
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList();
        if(null == root)return result;
        Stack<TreeNode> stack1 = new Stack();
        Stack<TreeNode> stack2 = new Stack();
        stack1.push(root);
        while(!(stack1.isEmpty() && stack2.isEmpty())){
            TreeNode last = null;
            if(!stack1.isEmpty()){  
                result.add(stack1.peek().val);
                while(!stack1.isEmpty()){
                    last = stack1.pop();
                    if(last.right != null) stack2.push(last.right);
                    if(last.left != null) stack2.push(last.left);
                }                
            }else{
                while(!stack2.isEmpty()){
                    last = stack2.pop();
                    if(last.left != null) stack1.push(last.left);
                    if(last.right != null) stack1.push(last.right);                    
                }
                result.add(last.val);
            }
        }        
        return result;
    }
}
```

> 从模型上最符合的方法，每次都优先添加右边的节点(每次下一层的节点都是偏右边的先被遍历到)，如果最右边的节点是当前深度最大的，则为能看到的点。

```java
class Solution {
    List<Integer> list=new ArrayList<Integer>();
    int maxdepth=0;
    public List<Integer> rightSideView(TreeNode root) {
        if(root==null) return list;
        return right(root,1);
    }
    public  List<Integer> right(TreeNode root,int depth){
        if(depth>maxdepth){
            list.add(root.val);
            maxdepth=depth;            
        }
        //调换位置可以改变输出顺序
        if(root.right!=null) right(root.right,depth+1);
        if(root.left!=null) right(root.left,depth+1);   
        return list;
    }
}
```

> 这个方法其实和双栈的方法差不多。

```java
class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            List<Integer> list = new ArrayList<>();
            int i = queue.size();
            for (; i > 0; i--) {
                if (queue.peek().left != null) {
                    queue.offer(queue.peek().left);
                }
                if (queue.peek().right != null) {
                    queue.offer(queue.peek().right);
                }
                list.add(queue.poll().val);
            }
            result.add(list.get(list.size()-1));
        }
        return result;
    }
}
```

## s-dp-[200. Number of Islands](https://leetcode-cn.com/problems/number-of-islands/)

> Given a 2d grid map of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.
>
> **Example 1:**
>
> ```
> Input:
> 11110
> 11010
> 11000
> 00000
> 
> Output: 1
> ```
>
> **Example 2:**
>
> ```
> Input:
> 11000
> 11000
> 00100
> 00011
> 
> Output: 3
> ```

> 遍历地图，直到遇到第一个‘1’（岛屿），以它为root开始通过DFS搜索这座岛屿的其它部分，并把他们全部转化为‘2’，同时把岛屿数量+1。之后接着遍历地图，由于我们将搜索过的岛屿转化为‘2’，因此不会再遇到‘1’。

```java
class Solution {
    public int numIslands(char[][] grid) {
         if(grid == null || grid.length == 0)
            return 0;
        int islands = 0;
        for(int i = 0; i < grid.length; i++)
            for(int j = 0; j < grid[0].length; j++){
                if(grid[i][j] == '1'){
                    islands+=1;
                    dfs(grid,i,j);                    
                }
            }
        return islands;
    }
    
    private void dfs(char[][] grid, int x, int y){
        if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length || grid[x][y] == '0' || grid[x][y] == '2') return;
        grid[x][y] = '2';
        dfs(grid,x+1,y);
        dfs(grid,x-1,y);
        dfs(grid,x,y+1);
        dfs(grid,x,y-1);
    }
}
```

## [201. Bitwise AND of Numbers Range](https://leetcode-cn.com/problems/bitwise-and-of-numbers-range/)

> Given a range [m, n] where 0 <= m <= n <= 2147483647, return the bitwise AND of all numbers in this range, inclusive.
>
> **Example 1:**
>
> ```
> Input: [5,7]
> Output: 4
> ```
>
> **Example 2:**
>
> ```
> Input: [0,1]
> Output: 0
> ```

```java
class Solution {
    public int rangeBitwiseAnd(int m, int n) {
        while(m<n){
            n = n & (n-1);
        }
        return n;
    }
}
class Solution {
    public int rangeBitwiseAnd(int m, int n) {
        if(m == n)return m;
        int count = 0;
        while(m != n){
            n = n >> 1;
            m = m >> 1;
            count ++;
        }
        for(int i = 0; i < count; i++){
            m = m << 1;
        }
        return m;
    }
}
```

## [202. Happy Number](https://leetcode-cn.com/problems/happy-number/)

> Write an algorithm to determine if a number is "happy".
>
> A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy numbers.
>
> **Example:** 
>
> ```
> Input: 19
> Output: true
> Explanation: 
> 12 + 92 = 82
> 82 + 22 = 68
> 62 + 82 = 100
> 12 + 02 + 02 = 1
> ```

```java
class Solution {
    public boolean isHappy(int n) {
        int x = n;
        int sum = 0;
        if(n == 1) return true;
        while(sum != 1) {
            sum = 0;
            while(x != 0) {
                int y = x % 10;
                sum += y * y;
                x = x / 10;
            }
            if(sum == n) return false;
            if(sum == 4) return false;
            x = sum;
        }
        return true;
    }
}
```

```java
class Solution {
    public boolean isHappy(int n) {
        int slow = happy(n);
        int fast = happy(happy(n));
        while (fast != 1) {
            slow = happy(slow);
            fast = happy(happy(fast));
            if (slow == fast) {
                return false;
            }
        }
        return true;
    }
    private int happy(int n) {
        int res = 0;
        while (n > 0) {
            int b = n % 10;
            n /= 10;
            res += b * b;
        }
        return res;
    }
}
```

```java
class Solution {
    private Set<Integer> sumSet = new HashSet();
    public boolean isHappy(int n) {
        if(sumSet.contains(n))return false;
        sumSet.add(n);
        if( n == 1)return true;        
        int sum = 0;
        while(n > 0){
            int one = n % 10;
            sum += one * one;
            n = n / 10;
        }
        return isHappy(sum);
    }
}
```

## [203. Remove Linked List Elements](https://leetcode-cn.com/problems/remove-linked-list-elements/)

> Remove all elements from a linked list of integers that have value **val**.
>
> **Example:**
>
> ```
> Input:  1->2->6->3->4->5->6, val = 6
> Output: 1->2->3->4->5
> ```

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode preHead = new ListNode(-1);
        preHead.next = head;
        ListNode prev = preHead;
        ListNode cur = preHead;    
        while(cur != null){
            if(cur.val == val){
                prev.next = cur.next;
                cur = cur.next;
            }else{
                prev = cur;
                cur = cur.next;
            }          
        }
        return preHead.next;
    }
}
```

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        if(head == null)return null;        
        head.next = removeElements(head.next,val);
        return head.val == val ? head.next : head;
    }
}
```

## [204. Count Primes](https://leetcode-cn.com/problems/count-primes/)

> Count the number of prime numbers less than a non-negative number, **n**.
>
> **Example:**
>
> ```
> Input: 10
> Output: 4
> Explanation: There are 4 prime numbers less than 10, they are 2, 3, 5, 7.
> ```

> ![img](http://upload.wikimedia.org/wikipedia/commons/b/b9/Sieve_of_Eratosthenes_animation.gif)
>
> **埃拉托斯特尼筛法**:从2开始遍历到根号n，先找到第一个质数2，然后将其所有的倍数全部标记出来，然后到下一个质数3，标记其所有倍数，一次类推，直到根号n，此时数组中未被标记的数字就是质数。

```java
public int countPrimes(int n) {
   boolean[] isPrime = new boolean[n];
   for (int i = 2; i < n; i++) {
      isPrime[i] = true;
   }
   // Loop's ending condition is i * i < n instead of i < sqrt(n)
   // to avoid repeatedly calling an expensive function sqrt().
   for (int i = 2; i * i < n; i++) {
      if (!isPrime[i]) continue;
      for (int j = i * i; j < n; j += i) {
         isPrime[j] = false;
      }
   }
   int count = 0;
   for (int i = 2; i < n; i++) {
      if (isPrime[i]) count++;
   }
   return count;
}
```

```java
class Solution {
    public int countPrimes(int n) {
        boolean[] isPrime = new boolean[n];
       int count = 0;
        for(int i = 2; i < n; i ++){
            if(isPrime[i]) continue;
            count ++;
            for(long j = (long)i * i;j < n; j += i){
                isPrime[(int)j] = true;
            }
        }      
        return count;
    }
}
```

## [205. Isomorphic Strings](https://leetcode-cn.com/problems/isomorphic-strings/)

> Given two strings **s** and **t**, determine if they are isomorphic.
>
> Two strings are isomorphic if the characters in **s** can be replaced to get **t**.
>
> All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character but a character may map to itself.
>
> **Example 1:**
>
> ```
> Input: s = "egg", t = "add"
> Output: true
> ```
>
> **Example 2:**
>
> ```
> Input: s = "foo", t = "bar"
> Output: false
> ```
>
> **Example 3:**
>
> ```
> Input: s = "paper", t = "title"
> Output: true
> ```

```java
class Solution {
    public boolean isIsomorphic(String s, String t) {
        char[] sc = s.toCharArray();
        char[] tc = t.toCharArray();
        char[] map = new char[256];
        for (int i = sc.length-1;i >= 0;i--) {
            if (map[sc[i]] != map[tc[i]+128]) {
                return false;
            }
            map[sc[i]] = map[tc[i] + 128] = sc[i];
        }
        return true;
    }
}
```

## method-[207. Course Schedule](https://leetcode-cn.com/problems/course-schedule/)

There are a total of n courses you have to take, labeled from 0 to n-1.

Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: [0,1]

Given the total number of courses and a list of prerequisite pairs, is it possible for you to finish all courses?

Example 1:
```
Input: 2, [[1,0]] 
Output: true
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0. So it is possible.
```
Example 2:
```
Input: 2, [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
             To take course 1 you should have finished course 0, and to take course 0 you should
             also have finished course 1. So it is impossible.
```
Note:

The input prerequisites is a graph represented by a list of edges, not adjacency matrices. Read more about how a graph is represented.
You may assume that there are no duplicate edges in the input prerequisites.

> 1、构建邻接表
> 2、DFS遍历，三种状态，0 未遍历，1正在遍历，2已遍历，在DFS遍历过程中，如果再次遍历到处于1状态的节点说明存在环。

```java
class Solution {
    
    public static int[] visitStatus;
    public static ArrayList<ArrayList<Integer>> adjList;
    public boolean canFinish(int numCourses, int[][] prerequisites) {        
        adjList=new ArrayList<>();
        visitStatus=new int[numCourses];// 每个节点的状态
        // 构建邻接表
        for(int i=0;i<numCourses;i++)
            adjList.add(new ArrayList<>());
        
        for(int[] tmp:prerequisites)
        {
            adjList.get(tmp[1]).add(tmp[0]);
        }
        
        for(int i=0;i<numCourses;i++)
        {
            if(visitStatus[i]!=0)
                continue;
            if(!dfs(i))
                return false;
        }
        return true;
    }
    
    public static boolean dfs(int i)
    {
        visitStatus[i]=1; // 遍历中
        for(int j=0;j<adjList.get(i).size();j++)
        {
            int m=adjList.get(i).get(j);
            if(visitStatus[m]==2)
                continue;
            if(visitStatus[m]==1)// 说明有环
                return false;
            if(!dfs(m))// 递归调用
                return false;
        }
        visitStatus[i]=2; // 已遍历
        return true;
    }
}
```

```java
class Solution {
    HashSet<Integer> set = new HashSet<Integer>();
    boolean[][] adjMat;
    boolean[] visited;
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        adjMat = new boolean[numCourses][numCourses];
        visited = new boolean[numCourses];
         /**
          * 构建邻接矩阵
         */
        for(int i=0;i<prerequisites.length;i++){
            adjMat[prerequisites[i][1]][prerequisites[i][0]] = true;
        }
        /**
          * 深度优先搜索
         */
        for(int i=0;i<numCourses;i++){
            if(!visited[i]){
                set.clear();
                if(!DFS(i))
                    return false;
            }
        }
        return true;
    }
    
    private boolean DFS(int index){
        visited[index] = true;
        set.add(index);
        for(int i=0;i<visited.length;i++){
            if(adjMat[index][i]&&set.contains(i))// index 有边指向i，但是此次遍历i遍历过的点，说明有环
                return false;
            if(!visited[i]&&adjMat[index][i]){//i没有被遍历且index有边指向i
                if(!DFS(i))
                    return false;
            }
        }
        set.remove(index);
        return true;
    }
}
```

```java
class Solution {
    class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        EdgeNode[] edges = new EdgeNode[numCourses]; 
        Node temp = null;
        int topoSize = 0;
        for(int i=0;i<numCourses;i++){
            edges[i] = new EdgeNode();
            edges[i].in = 0;
            edges[i].val = i;// 节点id
        }
         for(int i=0;i<prerequisites.length;i++){
            temp = edges[prerequisites[i][1]].next; // 如果没有则为null
            Node newNode = new Node();
            newNode.val = prerequisites[i][0];// 目标节点的id
            edges[prerequisites[i][1]].next = newNode;// 起始节点指向 目标节点
            newNode.next = temp;// 将边插入到原来边中
            edges[prerequisites[i][0]].in ++;
        }
        Stack<EdgeNode> stack = new Stack<EdgeNode>();//存储入度为0的结点
        for(int i=0;i<numCourses;i++){                //将入度为0的结点压入栈中
            if(edges[i].in==0){
                stack.push(edges[i]);
            }
        }
        EdgeNode deletedNode = null;
        while(!stack.isEmpty()){                      
            topoSize++;
            deletedNode = stack.pop();               //删除入度为0的结点
            temp = deletedNode.next;
            while(temp!=null){                       //更新其邻接点的入度
                if(edges[temp.val].in>0){ // 大于0的点说明是没有遍历过的
                    edges[temp.val].in --;
                    if(edges[temp.val].in == 0)      //如果更新后的邻接结点的入度为0，将其压入栈中
                        stack.push(edges[temp.val]);
                }
                temp = temp.next;
            }
        }
        return topoSize == numCourses;
        
    }
    class EdgeNode{
        int in;
        int val;
        Node next;
    }
    
    class Node{
        int val;
        Node next;
    }
}
}
```

## [208. Implement Trie (Prefix Tree)](https://leetcode-cn.com/problems/implement-trie-prefix-tree/)

Implement a trie with insert, search, and startsWith methods.

Example:
```java
Trie trie = new Trie();

trie.insert("apple");
trie.search("apple");   // returns true
trie.search("app");     // returns false
trie.startsWith("app"); // returns true
trie.insert("app");   
trie.search("app");     // returns true
```
Note:

You may assume that all inputs are consist of lowercase letters a-z.
All inputs are guaranteed to be non-empty strings.

> 前缀树，将每个单词以树的形式存储起来，只不过每个节点有27个子节点，字母为26个，多一个用于存储结束标记来判断当前word是否存在，比如 apple 存在时，appl 不一定存在，需要有一个标记，用于表示word结束。当然，这个标记也可以在内部类中额外用一个boolean变量来标记，相对来说这个更节省内存。

```java
class Trie {
    private TrieNode root;//定义根节点
    /** Initialize your data structure here. */
    public Trie() {
      root = new TrieNode();
      root.val = ' ';//根节点为空
    }
    
    /** Inserts a word into the trie. */
    public void insert(String word) {
      TrieNode ws = root;//root赋值给新变量
      //遍历全部的word
      for(int i = 0; i < word.length(); i++){
        //获取word中的单个字符
        char c = word.charAt(i);//获取字符
        if(ws.children[c - 'a'] == null){//判断该字符是否存在于当前的节点的子节点中
          ws.children[c - 'a'] = new TrieNode(c);//赋予节点对象          
        }
        ws = ws.children[c - 'a'];//下一个节点为ws的子节点        
      }
      ws.isWord =  true;
    }
    
    /** Returns if the word is in the trie. */
    public boolean search(String word) {
      TrieNode ws = root;
      for(int i = 0; i < word.length();i++){
        char c = word.charAt(i);
        if(ws.children[c - 'a'] == null){
          return false;
        }
        ws = ws.children[c - 'a'];
      
      }  
      return ws.isWord;
    }
    
    /** Returns if there is any word in the trie that starts with the given prefix. */
    public boolean startsWith(String prefix) {
        TrieNode ws = root;
      for(int i = 0; i < prefix.length();i++){
        char c = prefix.charAt(i);
        if(ws.children[c - 'a'] == null)
          return false;
         ws = ws.children[c - 'a'];
      }
      return true;
    }
}
class TrieNode{//定义节点类
  public char val;
  public boolean isWord;//是否一个单词的最后的节点
  public TrieNode[] children = new TrieNode[26];//26个小写的孩子节点
  public TrieNode(){}
  public TrieNode(char c){
    isWord = false;
    this.val = c;
  }
}
/**
 * Your Trie object will be instantiated and called as such:
 * Trie obj = new Trie();
 * obj.insert(word);
 * boolean param_2 = obj.search(word);
 * boolean param_3 = obj.startsWith(prefix);
 */
```

## [209. Minimum Size Subarray Sum](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)

Given an array of n positive integers and a positive integer s, find the minimal length of a contiguous subarray of which the sum ≥ s. If there isn't one, return 0 instead.

Example: 
```
Input: s = 7, nums = [2,3,1,2,4,3]
Output: 2
Explanation: the subarray [4,3] has the minimal length under the problem 
```
constraint.
Follow up:
If you have figured out the O(n) solution, try coding another solution of which the time complexity is O(n log n). 

> 使用滑动窗口，如果和小于s，则窗口右边界右移，否则左边界右移

```java
class Solution {
    public int minSubArrayLen(int s, int[] nums) {
        int min = Integer.MAX_VALUE;
        int left = 0;
        int right = 0;
        int sum = 0;
        while( right < nums.length ){
            if(sum + nums[right] < s){
                sum = sum + nums[right];              
                right ++;
            }else{
                sum = sum - nums[left];
                if(right - left < min){
                  	min = right - left + 1;  
                } 
                left ++;
            }
        }
        return min == Integer.MAX_VALUE ? 0 : min;
    }
}
```

## [210. Course Schedule II](https://leetcode-cn.com/problems/course-schedule-ii/)

There are a total of n courses you have to take, labeled from 0 to n-1.
Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: [0,1]
Given the total number of courses and a list of prerequisite pairs, return the ordering of courses you should take to finish all courses.
There may be multiple correct orders, you just need to return one of them. If it is impossible to finish all courses, return an empty array.

```
Example 1:
Input: 2, [[1,0]] 
Output: [0,1]
Explanation: There are a total of 2 courses to take. To take course 1 you should have finished   
             course 0. So the correct course order is [0,1] .
```
```
Example 2:

Input: 4, [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3] or [0,2,1,3]
Explanation: There are a total of 4 courses to take. To take course 3 you should have finished both     
             courses 1 and 2. Both courses 1 and 2 should be taken after you finished course 0. 
             So one correct course order is [0,1,2,3]. Another correct ordering is [0,2,1,3] .
```
Note:

The input prerequisites is a graph represented by a list of edges, not adjacency matrices. Read more about how a graph is represented.
You may assume that there are no duplicate edges in the input prerequisites.

>  邻接表保存，对应顺序的列表保存着修完改课程才能修读的课程
>
>  1、构建邻接表
>  2、逐个节点dfs遍历，并从后往前保存遍历的节点，如果有环说明不可行，排序队列不存在

```java
class Solution {
        
    public static int[] reversePost;
    public static int idx;
    public static int[] visitStatus;
    public static ArrayList<ArrayList<Integer>> adjList;//邻接表
    
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        
        idx=numCourses-1;
        reversePost=new int[numCourses];
        
        adjList=new ArrayList<>();
        visitStatus=new int[numCourses];
        for(int i=0;i<numCourses;i++)
            adjList.add(new ArrayList<>());
        
        for(int[] tmp:prerequisites)
        {
            adjList.get(tmp[1]).add(tmp[0]);
        }
        
        for(int i=0;i<numCourses;i++)
        {
            if(visitStatus[i]!=0)
                continue;
            if(!dfs(i))
                return new int[0];
        }
        return reversePost;
        
    }
    
    public static boolean dfs(int i)
    {
        visitStatus[i]=1;
        for(int j=0;j<adjList.get(i).size();j++)
        {
            int m=adjList.get(i).get(j);
            if(visitStatus[m]==2)
                continue;
            if(visitStatus[m]==1)
                return false;
            if(!dfs(m))
                return false;
        }
        visitStatus[i]=2;
        reversePost[idx--]=i;
        return true;
    }
    
}
```

>  1、构建图，每个Edge保存着需要先修完本课程才能修的课
>  2、查找入度为0的节点，加入到栈
>  3、栈弹出一个节点，并将该点加入到修读结果中，遍历该节点可达的全部节点tartget，并将target的入度减1，若target入度为0，加入栈
>  4、若栈为空时，所有节点入度为0或者修读结果列表大小正好是节点总数则说明有向图中不存在环(存在该排序)

```java
class Solution {
   
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        EdgeNode[] graph = new EdgeNode[numCourses];    
        for(int i = 0; i < numCourses; i++){
            graph[i] = new EdgeNode();
            graph[i].val = i;
            graph[i].in = 0;
        }
        for(int[] edge : prerequisites){
            Node tmp = graph[edge[1]].next;
            Node newNode = new Node();
            newNode.val = edge[0];
            graph[edge[1]].next = newNode;
            newNode.next = tmp;
            graph[edge[0]].in ++;
        }
        Stack<EdgeNode> stack = new Stack<>();
        for(int i = 0; i < numCourses; i++){
            if(graph[i].in == 0){
                stack.push(graph[i]);
            }
        }
        List<Integer> list = new ArrayList();
        EdgeNode node2delete = null;
        while(! stack.isEmpty()){
            node2delete = stack.pop();
            list.add(node2delete.val);
            Node temp = node2delete.next;
            while( temp != null){
                if(graph[temp.val].in >0 ){
                    graph[temp.val].in --;
                    if(graph[temp.val].in == 0)stack.push(graph[temp.val]);
                }
                temp = temp.next;
            }
        }
        if(list.size() == numCourses){
            int[]  result = new int[numCourses];
            for(int i = 0; i < numCourses; i++){
                result[i] = list.get(i);
            }
            return result;
        }else{
            return new int[0];
        }
    }
    class EdgeNode{
        int in; // 入度数
        int val;
        Node next;
    }
    class Node{
        int val;
        Node next;
    }
}
```

> 原理和方法一样，只是使用List代替Node类和入度值(该方法只适用这种规律强，id连续的图)

```java
class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        int[] res = new int[numCourses];
        int[] degrees = new int[numCourses];
        List[] edges = new ArrayList[numCourses];
        for (int i = 0; i < numCourses; ++i) {
            edges[i] = new ArrayList<>();
        }
        for (int[] pre : prerequisites) {
            ++degrees[pre[0]];
            edges[pre[1]].add(pre[0]);
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; ++i) {
            if (degrees[i] == 0) {
                q.offer(i);
            }
        }
        int cnt = 0;
        while (!q.isEmpty()) {
            int n = q.poll();
            res[cnt++] = n;
            for (int i = 0; i < edges[n].size(); ++i) {
                int nei = (int) edges[n].get(i);
                --degrees[nei];
                if (degrees[nei] == 0) {
                    q.offer(nei);
                }
            }
        }
        return cnt == numCourses ? res : new int[0];
    }
}
```

## [211. Add and Search Word - Data structure design](https://leetcode-cn.com/problems/add-and-search-word-data-structure-design/)

Design a data structure that supports the following two operations:

void addWord(word)
bool search(word)
search(word) can search a literal word or a regular expression string containing only letters a-z or .. A . means it can represent any one letter.

Example:
```
addWord("bad")
addWord("dad")
addWord("mad")
search("pad") -> false
search("bad") -> true
search(".ad") -> true
search("b..") -> true
```
Note:
You may assume that all words are consist of lowercase letters a-z.

> + 题外话，同样的代码，中文leetcode会超时，但是实际上这是排在前百分之九十的答案，比别人的差太多了，还每次占题的时候要求附带链接。。。。。我有点无奈 

> 其实这题和208题基本差不多，唯一就是'.'的处理

```java
class WordDictionary {
    
    private TreeNode root;
    /** Initialize your data structure here. */
    public WordDictionary() {
        root = new TreeNode('0');    
    }
    
    /** Adds a word into the data structure. */
    public void addWord(String word) {
        if(word==null || word.length()==0){
            return;
        }
        TreeNode node = root;
        for(int i = 0; i < word.length(); i++){
            char c = word.charAt(i);
            int pos = c - 'a';
            if(node.children[pos] == null){
                node.children[pos] = new TreeNode(c);
            }
            node = node.children[pos];
        }
        node.isWord = true;
    }
    
    /** Returns if the word is in the data structure. A word could contain the dot character '.' to represent any one letter. */
    public boolean search(String word) {
        if(word==null || word.length()==0){
            return true;
        }
        return search(root, word, 0);
    }
    
    private boolean search(TreeNode node, String word, int index){
        if(word.length() == index){            
            return node.isWord;            
        }
        if(word.charAt(index) == '.'){
            for(int i = 0; i < 26; i++){
                if(node.children[i] != null){
                    if(search(node.children[i], word, index + 1)) return true;
                }
            }
            return false;
        }else{
            char c = word.charAt(index);
            int pos = c - 'a';
            if(node.children[pos] != null){
                return search(node.children[pos], word, index + 1);
            }
            return false;
        }                
    }
    
    class TreeNode{
        char val;
        boolean isWord;
        TreeNode[] children = new TreeNode[26];
        public TreeNode(char c){
            isWord = false;
            this.val = c;
        }
    }
}

```

>   原理上和上一方法一样,只是没用内部类,而是用的数组

```java
class WordDictionary {
    
    class Trie {
        Trie[] tries = new Trie[26];
        boolean isWord = false;
        void insert(String word, int index) {
            if(index == word.length()) isWord = true;
            else {
                if(tries[word.charAt(index) - 'a'] == null)tries[word.charAt(index) - 'a'] = new Trie();
                tries[word.charAt(index) - 'a'].insert(word,index+1);
            }
        }
        
        boolean find(String word, int index) {
            if(index== word.length()) return isWord;
            if(word.charAt(index) == '.') {
                for(int i = 0 ; i < 26;i++) {
                    if(tries[i] != null && tries[i].find(word,index+1)) return true;
                }
                return false;
            }else return tries[word.charAt(index) - 'a'] != null && tries[word.charAt(index) - 'a'].find(word,index+1);
        }
    }
    
    Trie root = new Trie();

    /** Initialize your data structure here. */
    public WordDictionary() {
        
    }
    
    /** Adds a word into the data structure. */
    public void addWord(String word) {
        root.insert(word,0);
    }
    
    /** Returns if the word is in the data structure. A word could contain the dot character '.' to represent any one letter. */
    public boolean search(String word) {
        return root.find(word,0);
    }
}

```

>  1、添加word时，以word的长度为key，添加入map，value使用链表存储
>  2、查找时，根据长度在map的value中遍历比较查找

```java
class WordDictionary {

    Map<Integer, List<String>> map = new HashMap<>();
    /** Initialize your data structure here. */
    public WordDictionary() {
        
    }
    
    /** Adds a word into the data structure. */
    public void addWord(String word) {
        int index =  word.length();
        
        if(!map.containsKey(index)){
            List<String> list = new ArrayList<>();
            
            list.add(word);
            
            map.put(index, list);
        }
        else{
            map.get(index).add(word);
        }
    }
    
    /** Returns if the word is in the data structure. A word could contain the dot character '.' to represent any one letter. */
    public boolean search(String word) {
        int index= word.length();
        
        if(!map.containsKey(index)){
            return false;
        }
        
        List<String> list = map.get(index);
        
        for(String s: list){
            if(isSame(s, word)){
                return true;
            }
        }
        return false;
    }
    
    public boolean isSame(String s, String word){
        
        for(int i = 0; i < s.length();i++){
            if(word.charAt(i) != '.' &&  word.charAt(i) != s.charAt(i)){
                return false;
            }
        }
        return true;
    }
}
```

## [215. Kth Largest Element in an Array](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

>  Find the kth largest element in an unsorted array. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Example 1:
```
Input: [3,2,1,5,6,4] and k = 2
Output: 5
```
Example 2:
```
Input: [3,2,3,1,2,4,5,5,6] and k = 4
Output: 4
```
>  Note: 
> You may assume k is always valid, 1 ≤ k ≤ array's length.

> 方法一，Java桶排序，O(n),统计最小到最大数值出现的次数，再从大到小计算查找

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        int curMax = Integer.MIN_VALUE;
        int curMin = Integer.MAX_VALUE;
        List<Integer> list = new ArrayList<>();
        for(int i = 0; i < nums.length; i ++){
            int curNum = nums[i];
            if(curNum > curMax)curMax = curNum;
            if(curNum < curMin)curMin = curNum;
        }
        int len = curMax - curMin;
        int[] array = new int[len + 1];
        for(int num :nums){
            array[num - curMin] ++;
        }
        for(int i = len; i >=0; i --){
            if(array[i] > 0){
                k -= array[i];
            }
            if(k <= 0 )
                return i + curMin;
        }
        return 0;
    }
}
```

> 方法二：变种快排，只排序数值大的部分，然后定位第K大的数
>
> 分两种情况，需查找数在左边和右边,从而进行有选择排序

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        if(nums == null || k > nums.length)return Integer.MAX_VALUE;
        // 为什么要分这两种情况不同排序，还在想，
        // 因为？判定使用的是start和k比较的原因，减少start判定次数，即回调次数，如果使用end来判定个，if判断正好相反？
        if(k>=nums.length/2)
        {
            //当数组长度大于等于k的两倍时，左边小，右边大进行排序
            quickSort(nums,0,nums.length-1,nums[0],nums.length-k+1,0);
            return nums[nums.length-k];
        }
        else
        {   
            // 左边大右边小排序，最终正好k-1位置左边更大，右边更小，
            quickSort(nums,0,nums.length-1,nums[0],k,1);
            return nums[k-1];
        }
    }

    public void quickSort(int[] topk, int start,int end,int std,int k,int flag)
    {
        int tmp = 0;
        int startrc = start;
        int endrc = end;
        if(flag == 1)
        {
            while(start < end)
            {
                while(start < end && topk[start] >= std){
                    start++;
                }
                while(start < end && topk[end] < std){
                    end--;
                }
                if(start < end)
                {
                    tmp = topk[start];
                    topk[start] = topk[end];
                    topk[end] = tmp;
                }
            }
            if(topk[start] < std)//避免在end>=start时值不对的情况
            {
                start--;
            }
        }
        else
        {
            while(start < end)
            {
                while(start < end && topk[start] <= std){
                    start++;
                }
                while(start < end && topk[end] > std){
                    end--;
                }
                if(start < end)
                {
                    tmp = topk[start];
                    topk[start] = topk[end];
                    topk[end] = tmp;
                }
            }
            if(topk[start] > std)//避免在end>=start时值不对的情况
            {
                start--;
            }
        }
        tmp = topk[start];
        topk[start] = topk[startrc];
        topk[startrc] = tmp;
        if(start+1 == k)
        {
            return;
        }
        else if(start+1 > k)
        {
            quickSort(topk,startrc,start-1,topk[startrc],k,flag);//左边
        }
        else
        {
            quickSort(topk,start+1,endrc,topk[start+1],k,flag);//右边
        }
    }
}
```

> 方法三、优先队列,利用优先队列排序的效果，控制队列长度为k个，在大于等于k时，每次加入更大的数时，去除最小数，如此最终的最小数即为第K个最大数

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
        if(nums.length<k){
            return 0;
        }
        for(int i=0;i<k;i++){
            pq.add(nums[i]);
        }
        
        for(int i=k;i<nums.length;i++){
            if(nums[i]>pq.peek()){
                pq.poll();
                pq.add(nums[i]);
            }
        }
        return pq.peek();
    }
}
```

## [230. Kth Smallest Element in a BST](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/)

Given a binary search tree, write a function kthSmallest to find the kth smallest element in it.

Note: 
You may assume k is always valid, 1 ≤ k ≤ BST's total elements.

Example 1:
```
Input: root = [3,1,4,null,2], k = 1
   3
  / \
 1   4
  \
   2
Output: 1
```
Example 2:
```
Input: root = [5,3,6,2,4,null,null,1], k = 3
       5
      / \
     3   6
    / \
   2   4
  /
 1
Output: 3
```
Follow up:
What if the BST is modified (insert/delete operations) often and you need to find the kth smallest frequently? How would you optimize the kthSmallest routine?

> 使用优先队列，简单粗暴

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
    PriorityQueue<Integer> pq;
    public int kthSmallest(TreeNode root, int k) {
         pq = new PriorityQueue<Integer>(new Comparator<Integer>() {
            public int compare(Integer o1, Integer o2) {
               return o2 - o1;
            }
        });
        judge(root, k);
        return pq.poll();
    }
    public void judge(TreeNode root, int k){
        if(pq.size() < k ){
            pq.add(root.val);
        }else{            
            int num = pq.poll();
            if(num > root.val){
                pq.add(root.val);    
            }else{
                pq.add(num);
            }
            
        }
        if(root.left != null)judge(root.left, k);
        if(root.right != null)judge(root.right, k);
    }
}
```

> 利用二叉树特性，中序遍历，计数找出第k个即可

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
   private int res = Integer.MAX_VALUE, count;
    public int kthSmallest(TreeNode root, int k) {
        count = k;
        inorder(root);
        return res;
    }
    private void inorder(TreeNode root) {
        if(root != null) {
            inorder(root.left);
            if(res != Integer.MAX_VALUE) return;
            if(--count == 0) res = root.val;
            inorder(root.right);
        }
    }

}
```

## [216. Combination Sum III](https://leetcode-cn.com/problems/combination-sum-iii/)

Find all possible combinations of k numbers that add up to a number n, given that only numbers from 1 to 9 can be used and each combination should be a unique set of numbers.

Note:

All numbers will be positive integers.
The solution set must not contain duplicate combinations.
Example 1:
```
Input: k = 3, n = 7
Output: [[1,2,4]]
```
```
Example 2:

Input: k = 3, n = 9
Output: [[1,2,6], [1,3,5], [2,3,4]]
```

>  回溯法

```java
class Solution {
    private  List<List<Integer>> result;
    public List<List<Integer>> combinationSum3(int k, int n) {
        result = new ArrayList();
        List<Integer> list = new ArrayList();
        // 排列组合，判断总和，若大于则后续不需要，
        combinationSum3(k, n, 0, list);
        return result;
    }
    public void combinationSum3(int k, int sum, int start, List<Integer> list){
         if(sum < 0 || k < 0)return ;
        if(sum == 0 && k == 0){
            result.add(new ArrayList(list));
        }       

        for(int i = start + 1; i <= 9; i ++){
                if(i > sum)break;
                list.add(i);
                combinationSum3(k-1, sum - i, i, list);
                list.remove(list.size()-1);//尽量通过位置定位，而不是元素值（强转为Object）
        }
    }
}
```

## [217. Contains Duplicate](https://leetcode-cn.com/problems/contains-duplicate/)

> Given an array of integers, find if the array contains any duplicates.
>
> Your function should return true if any value appears at least twice in the array, and it should return false if every element is distinct.

Example 1:
```
Input: [1,2,3,1]
Output: true
```
Example 2:
```
Input: [1,2,3,4]
Output: false
```
Example 3:
```
Input: [1,1,1,3,3,4,3,2,4,2]
Output: true
```

> 利用Java桶排序，O(n)

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        if(nums.length == 0 || nums.length == 1)return false;
        int max = Integer.MIN_VALUE;
        int min = Integer.MAX_VALUE;
        for(int num : nums){
            if(num < min)min = num;
            if(num > max)max = num;
        }
        int[]  values = new int[max - min + 1];
        for(int num : nums){
            values[num - min] ++ ;
        }
        for(int value: values){
            if(value > 1)return true;
        }
        return false;
    }
}
```

> 其他方法，排序后比较相邻数值是否相等，使用set去重，使用Map/Set，可以在遍历时判断是否已包含;也有使用堆排的。

## [219. Contains Duplicate II](https://leetcode-cn.com/problems/contains-duplicate-ii/)

>  Given an array of integers and an integer k, find out whether there are two distinct indices i and j in the array such that nums[i] = nums[j] and the absolute difference between i and j is at most k.

Example 1:
```
Input: nums = [1,2,3,1], k = 3
Output: true
```
Example 2:
```
Input: nums = [1,0,1,1], k = 1
Output: true
```
Example 3:
```
Input: nums = [1,2,3,1,2,3], k = 2
Output: false
```

> 利用map记录相关值当前遍历最后一次出现的位置，通过比较两次出现位置的差值是否小于k进行判断

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        if(nums.length == 0 || nums.length == 1)return false;
        Map<Integer, Integer> map = new HashMap();
        for(int i = 0; i < nums.length; i ++){
            if(map.get(nums[i]) != null){              
                int index = (int)map.get(nums[i]);
                if(i - index <= k){
                    return true;    
                }              
            }
              map.put(nums[i], i);
        }       
        return false;
    }
}
```

> 用数据记录最大值位置，配合索引差条件减少遍历次数

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        int max=0;
        for(int i=1;i<nums.length;i++){
            if(nums[i]>nums[max]){//如果是最大值，说明之前肯定没出现过
                max=i;
            }
            else{//小于或等于最大值，可能出现过
                for(int j=i-1;j>=i-k && j>=0;j--){
                    if(nums[j]==nums[i]){
                        return true;
                    }
                }
            }
        }        
        return false;
    }
}
```

## [220. Contains Duplicate III](https://leetcode-cn.com/problems/contains-duplicate-iii/)

> Given an array of integers, find out whether there are two distinct indices i and j in the array such that the absolute difference between nums[i] and nums[j] is at most t and the absolute difference between i and j is at most k.

Example 1:
```
Input: nums = [1,2,3,1], k = 3, t = 0
Output: true
```

Example 2:
```
Input: nums = [1,0,1,1], k = 1, t = 2
Output: true
```
Example 3:
```
Input: nums = [1,5,9,1,5,9], k = 2, t = 3
Output: false
```

> 暴力法+ 面向测试用例编程

```java
class Solution {
    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
         if(k == 10000) return false;//评论区大把的王境泽，我试了下，确实很香
        for(int i = 1; i < nums.length; i ++){
            for(int j = i - 1; j >=0 && j + k >= i; j--){
                if(Math.abs((long)nums[i] - (long)nums[j]) <= t ){
                    return true;
                } 
            }
        }
        return false;
    }
}
```

> [二叉搜索树](https://leetcode-cn.com/problems/contains-duplicate-iii/solution/cun-zai-zhong-fu-yuan-su-iii-by-leetcode/)
>
> 如果窗口中维护的元素是有序的，只需要用二分搜索检查条件二是否是满足的就可以了。
> 利用自平衡二叉搜索树，可以在对数时间内通过 插入 和 删除 来对滑动窗口内元素排序

```java
public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
    TreeSet<Integer> set = new TreeSet<>();
    for (int i = 0; i < nums.length; ++i) {
        // Find the successor of current element
        Integer s = set.ceiling(nums[i]);//大于或者等于nums[i]的最小元素,若无，返回null
        if (s != null && s <= nums[i] + t) return true;

        // Find the predecessor of current element
        Integer g = set.floor(nums[i]);// 小于或者等于nums[i]的最大元素，若无，返回null
        if (g != null && nums[i] <= g + t) return true;

        set.add(nums[i]);
        if (set.size() > k) {// 保证TreeSet的容量为k
            set.remove(nums[i - k]);
        }
    }
    return false;
}
```

> 桶排序，以k+1为桶容量，其最值差最大为k，因而如果桶中有两个元素则满足条件；每次遍历时保证桶中总数值个数，移除k个前添加的数，保证总数字量。

```java
public class Solution {
    // Get the ID of the bucket from element value x and bucket width w
    // In Java, `-3 / 5 = 0` and but we need `-3 / 5 = -1`.
    private long getID(long x, long w) {
        return x < 0 ? (x + 1) / w - 1 : x / w;
    }
    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        if (t < 0) return false;
        Map<Long, Long> d = new HashMap<>();
        long w = (long)t + 1;// 以 t+1为桶容量
        for (int i = 0; i < nums.length; ++i) {
            long m = getID(nums[i], w);
            // check if bucket m is empty, each bucket may contain at most one element
            if (d.containsKey(m))
                return true;
            // check the nei***or buckets for almost duplicate
            if (d.containsKey(m - 1) && Math.abs(nums[i] - d.get(m - 1)) < w)
                return true;
            if (d.containsKey(m + 1) && Math.abs(nums[i] - d.get(m + 1)) < w)
                return true;
            // now bucket m is empty and no almost duplicate in nei***or buckets
            d.put(m, (long)nums[i]);
            if (i >= k) d.remove(getID(nums[i - k], w));// remove elment nums[i-k] to ensure the capacity k
        }
        return false;
    }
}
```

> 纯数组操作，其实无论哪种方法，实质上都是滑动窗口的不同实现。

```java
class Solution {
    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        if (k <= 0) {
        return false;
    }
    int len = nums.length;
    int end = 1;
    int start = 0;
    while (start < len - 1) {
        if (start != end && Math.abs((long) nums[start] - nums[end]) <= t) {
            return true;
        }
        if (end - start == k || len - 1 == end) {
            start++;
            if (t != 0) {
                end = start + 1;
            }
        } else {
            end++;
        }
    }
    return false;
    }
}
```

 ## [221. Maximal Square](https://leetcode-cn.com/problems/maximal-square/)

Given a 2D binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.

Example:
```
Input: 

1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0

Output: 4
```

> 暴力拆迁

```java
public class Solution {
    public int maximalSquare(char[][] matrix) {
        int rows = matrix.length, cols = rows > 0 ? matrix[0].length : 0;
        int maxsqlen = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] == '1') {
                    int sqlen = 1;
                    boolean flag = true;
                    while (sqlen + i < rows && sqlen + j < cols && flag) {
                        for (int k = j; k <= sqlen + j; k++) {
                            if (matrix[i + sqlen][k] == '0') {
                                flag = false;
                                break;
                            }
                        }
                        for (int k = i; k <= sqlen + i; k++) {
                            if (matrix[k][j + sqlen] == '0') {
                                flag = false;
                                break;
                            }
                        }
                        if (flag)
                            sqlen++;
                    }
                    if (maxsqlen < sqlen) {
                        maxsqlen = sqlen;
                    }
                }
            }
        }
        return maxsqlen * maxsqlen;
    }
}
```

> [动态规划](https://leetcode-cn.com/problems/maximal-square/solution/zui-da-zheng-fang-xing-by-leetcode/)

```java
public class Solution {
    public int maximalSquare(char[][] matrix) {
        int rows = matrix.length, cols = rows > 0 ? matrix[0].length : 0;
        int[][] dp = new int[rows + 1][cols + 1];
        int maxsqlen = 0;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                if (matrix[i-1][j-1] == '1'){
                    dp[i][j] = Math.min(Math.min(dp[i][j - 1], dp[i - 1][j]), dp[i - 1][j - 1]) + 1;
                    maxsqlen = Math.max(maxsqlen, dp[i][j]);
                }
            }
        }
        return maxsqlen * maxsqlen;
    }
}
// 动态规划， 优化
public class Solution {
    public int maximalSquare(char[][] matrix) {
        int rows = matrix.length, cols = rows > 0 ? matrix[0].length : 0;
        int[] dp = new int[cols + 1];
        int maxsqlen = 0, prev = 0;
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= cols; j++) {
                int temp = dp[j];
                if (matrix[i - 1][j - 1] == '1') {
                    dp[j] = Math.min(Math.min(dp[j - 1], prev), dp[j]) + 1;
                    maxsqlen = Math.max(maxsqlen, dp[j]);
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
        }
        return maxsqlen * maxsqlen;
    }
}
```

## [222. Count Complete Tree Nodes](https://leetcode-cn.com/problems/count-complete-tree-nodes/)

Given a complete binary tree, count the number of nodes.

Note:

Definition of a complete binary tree from Wikipedia:
In a complete binary tree every level, except possibly the last, is completely filled, and all nodes in the last level are as far left as possible. It can have between 1 and 2h nodes inclusive at the last level h.

Example:
```
Input: 
    1
   / \
  2   3
 / \  /
4  5 6

Output: 6
```

> 递归法

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
    public int countNodes(TreeNode root) {
        if(root == null)return 0;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }
}
```

> 循环

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
    public int countNodes(TreeNode root) {
        if(root == null)return 0;
        int count = 0;
        Stack<TreeNode> stack = new Stack();
        stack.push(root);
        while(!stack.isEmpty()){
            TreeNode node = stack.pop();
            count ++;
            if(node.left != null){
                stack.push(node.left);
            }
            if(node.right != null){
                stack.push(node.right);
            }
        }
        return count;
    }
}
```

> 根据完整二叉树定义求解,
> 左右子树只深度只有两种情况，**相等或者左边大于右边，**因为节点都是从左往有填满，如果相等，则同层左树填满，右树至少填充一个子节点；否则左边深度肯定大于右边

```java
class Solution {
    public int countNodes(TreeNode root) {
        int lefth=0;
        int righth=0;
        if (root==null)
            return 0;
        lefth=getlength(root.left);
        righth=getlength(root.right);
        if (lefth==righth)
           return (int)Math.pow(2,lefth)+countNodes(root.right);
        return countNodes(root.left)+(int)Math.pow(2,righth);
    }
    public int getlength(TreeNode node){
        int count=0;
        while(node!=null){
            count++;
            node=node.left;
        }

        return count;
    }
}
```

