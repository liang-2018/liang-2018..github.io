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
            dp[i] = Math.max(dp[i-1],dp[i-2]+nums[i]);
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
            deletedNode = stack.pop();               //删除入读为0的结点
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

