---
title: LeetCode note - part 1
toc: true
mathjax: true
date: 2018-10-02 11:44:39
tags: 
- LeetCode
- Algorithm
categories: LeetCode
---

> 刷LeetCode的笔记，方便自己查看做题遇到的坑

<!-- more -->

# Best Time to Buy and Sell Stock II

Say you have an array for which the ith element is the price of a given stock on day i.

Design an algorithm to find the maximum profit. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times).

**Note: **You may not engage in multiple transactions at the same time (i.e., you must sell the stock before you buy again).

**Example 1:**
```
Input: [7,1,5,3,6,4]
Output: 7
Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
             Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
```
**Example 2:**
```
Input: [1,2,3,4,5]
Output: 4
Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
             Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are
             engaging multiple transactions at the same time. You must sell before buying again.
```
**Example 3:**
```
Input: [7,6,4,3,1]
Output: 0
Explanation: In this case, no transaction is done, i.e. max profit = 0.
```


```Java
class Solution {
    public int maxProfit(int[] prices) {
        return calculate(prices, 0);
    }

    public int calculate(int prices[], int s) {
        if (s >= prices.length)
            return 0;
        int max = 0;
        for (int start = s; start < prices.length; start++) {
            System.out.println("======new start== "+start+" ====");
            int maxprofit = 0;
            for (int i = start + 1; i < prices.length; i++) {
                if (prices[start] < prices[i]) {
                    System.out.println("index :"+start+"--"+i+"  buy: "+prices[start] +"  sell: " + prices[i]);
                    int profit = calculate(prices, i + 1) + prices[i] - prices[start];
                    if (profit > maxprofit){
                        System.out.println("profit change:"+ maxprofit +" --> " +profit);
                         maxprofit = profit;
                    }     
                }
            }
            if (maxprofit > max){
                System.out.println("max profit change:"+ max +" --> " +maxprofit);
                max = maxprofit;
            }         
        }
        System.out.println("profit:"+max);
        return max;
    }
}
```


```Java
int[] price = new int[]{7,1,5,3,6,4};
new Solution().maxProfit(price);
```

    ======new start== 0 ====
    ======new start== 1 ====
    index :1--2  buy: 1  sell: 5
    ======new start== 3 ====
    index :3--4  buy: 3  sell: 6
    ======new start== 5 ====
    profit:0
    profit change:0 --> 3
    index :3--5  buy: 3  sell: 4
    max profit change:0 --> 3
    ======new start== 4 ====
    ======new start== 5 ====
    profit:3
    profit change:0 --> 7
    index :1--3  buy: 1  sell: 3
    ======new start== 4 ====
    ======new start== 5 ====
    profit:0
    index :1--4  buy: 1  sell: 6
    ======new start== 5 ====
    profit:0
    index :1--5  buy: 1  sell: 4
    max profit change:0 --> 7
    ======new start== 2 ====
    index :2--4  buy: 5  sell: 6
    ======new start== 5 ====
    profit:0
    profit change:0 --> 1
    ======new start== 3 ====
    index :3--4  buy: 3  sell: 6
    ======new start== 5 ====
    profit:0
    profit change:0 --> 3
    index :3--5  buy: 3  sell: 4
    ======new start== 4 ====
    ======new start== 5 ====
    profit:7

# 125. Valid Palindrome
Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

Note: For the purpose of this problem, we define empty string as valid palindrome.

**Example 1:**
```
Input: "A man, a plan, a canal: Panama"
Output: true
```
**Example 2:**
```
Input: "race a car"
Output: false
```


```Java
// 自己的解决方案
class Solution {
    public boolean isPalindrome(String s) {
        //利用正则，去除空格和无关符号，倒转看知否相等
        String pattern = "^[a-z0-9]";
        s = s.toLowerCase();
        List<Character> list = new ArrayList<>();
        for(int i =0 ; i< s.length(); i++){
            if(String.valueOf(s.charAt(i)).matches(pattern)){
                list.add(s.charAt(i));
            }
        }
        Object[] strArray = list.toArray();
        return isPalindromeArray(strArray);
    }
    private boolean isPalindromeArray(Object[] array){
        int length = array.length;
        for(int i = 0; i< array.length /2; i++){
            if( array[i] != array[length-1-i]){
                return false;
            }
        }
        return true;
    }
}
```


```Java
// 最好的解决方案
class Solution {
 private static final int[] map = new int[256];
    static{
        for(int i = 0; i < 10; i++){
            map[i + '0'] = (i + 1);
        }
        for(int i = 0; i < 26; i++){
            map[i + 'a'] = map[i + 'A'] = (i + 11);
        }
    }
    public boolean isPalindrome(String s) {
        char[] arrays = s.toCharArray();
        int start = 0, end = arrays.length - 1;
        int startVal, endVal;
        while(start < end){
            startVal = map[arrays[start]];
            endVal = map[arrays[end]];
            if(startVal != 0 && endVal != 0){
                if(startVal != endVal)
                    return false;
                start++;
                end--;
            }else{
                if(startVal == 0) start++;
                else end--;
            }
        }
        return true;
    }
}
```

# 136. Single Number
Given a non-empty array of integers, every element appears twice except for one. Find that single one.

Note:

Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

Example 1:
```
Input: [2,2,1]
Output: 1
```
Example 2:
```
Input: [4,1,2,1,2]
Output: 4
```


```Java
//自己写的错误方法
class Solution {
    public int singleNumber(int[] nums) {
        int[] positive = new int[Integer.MAX_VALUE];
        int[] negative = new int[Integer.MAX_VALUE];
        for( int i = 0; i < nums.length; i++ ){
            if( nums[i] >=0 ){
                positive[nums[i]]++;
            }
            else{
                negative[-nums[i]]++;
            }
            
        }
        for( int i = 0; i < Integer.MAX_VALUE; i++){
            if(positive[i] == 1 )return i;
            if(negative[i] == 1 )return i;
        }
        return nums[0];
    }
}
```


```Java
// 推荐的方法
class Solution {
    public int singleNumber(int[] nums) {
        int a = 0;
        for( int i = 0; i < nums.length; i++ ){
           a ^= nums[i];
        }        
        return a;
    }
}
```

# 141. Linked List Cycle
Given a linked list, determine if it has a cycle in it.

Follow up:

Can you solve it without using extra space?


```Java
// my Code 
//错误原因：有环，但是不一定首尾相连，可能是中间部位
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
class ListNode {
      int val;
      ListNode next;
      ListNode(int x) {
          val = x;
          next = null;
      }
  }
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode head_bak = head;
        if( null ==  head || head.next == null )return false;
        while(null != head.next){
             head = head.next;
            if( head_bak == head){
                return true;
            }  
        }
        return false;
    }
}
```


```Java
/**  正确解法有两种：
    *一种通过Set来逐个加入，判断是否已含有，如果有则表示有环
    *双指针解法，一个一次走一步，一个一次走两步，如果有环，总有一次会遇上
**/
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
class ListNode {
      int val;
      ListNode next;
      ListNode(int x) {
          val = x;
          next = null;
      }
  }
public class Solution {
    public boolean hasCycle(ListNode head) {
        if( null ==  head || head.next == null )return false;
        ListNode walker = head;
        ListNode runner = head.next;        
        while(walker != runner){
            if( null == walker.next || null== runner.next){
                return false;
            }  
            walker = walker.next;
            runner = runner.next.next;
        }
        return true;
    }
}
```

# 8. String to Integer (atoi)
Implement atoi which converts a string to an integer.

The function first discards as many whitespace characters as necessary until the first non-whitespace character is found. Then, starting from this character, takes an optional initial plus or minus sign followed by as many numerical digits as possible, and interprets them as a numerical value.

The string can contain additional characters after those that form the integral number, which are ignored and have no effect on the behavior of this function.

If the first sequence of non-whitespace characters in str is not a valid integral number, or if no such sequence exists because either str is empty or it contains only whitespace characters, no conversion is performed.

If no valid conversion could be performed, a zero value is returned.

Note:

Only the space character ' ' is considered as whitespace character.
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. If the numerical value is out of the range of representable values, INT_MAX (231 − 1) or INT_MIN (−231) is returned.
Example 1:
```
Input: "42"
Output: 42
```
Example 2:
```
Input: "   -42"
Output: -42
Explanation: The first non-whitespace character is '-', which is the minus sign.
             Then take as many numerical digits as possible, which gets 42.
```
Example 3:
```
Input: "4193 with words"
Output: 4193
Explanation: Conversion stops at digit '3' as the next character is not a numerical digit.
```
Example 4:
```
Input: "words and 987"
Output: 0
Explanation: The first non-whitespace character is 'w', which is not a numerical 
             digit or a +/- sign. Therefore no valid conversion could be performed.
```
Example 5:
```
Input: "-91283472332"
Output: -2147483648
Explanation: The number "-91283472332" is out of the range of a 32-bit signed integer.
             Thefore INT_MIN (−231) is returned.
```


```Java
//我的答案
class Solution {
    public int myAtoi(String str) {
        if(null == str)return 0;
        String toInt = str.trim();
        if( 0 ==  toInt.length())return 0;
        int start = 0;
        int end = 0;
        if(toInt.startsWith("-") || toInt.startsWith("+"))start ++;
        for(end = start; end < toInt.length(); ){
            if('0'<= toInt.charAt(end) && '9'>= toInt.charAt(end)){
                end++;
            }else{
                break;
            }
        }
        if(end - start < 1)return 0;
        int value = 0;
        try{
            value =  Integer.parseInt(toInt.substring(0,end));
        }catch(Exception e){
            if(toInt.startsWith("-")){
                return Integer.MIN_VALUE;
            }else{
                return Integer.MAX_VALUE;
            }            
        }
        return value; 
    }
}
```


```Java
// 推荐答案
class Solution {
    public int myAtoi(String str) {
        if(str==null || str.length() == 0) return 0;
        
        int index = 0;
        while(index < str.length() && str.charAt(index) == ' ')
            index++;
        
        int sign = 1;
        // 正负只能有一个，同时及时判断是否out of index
        if(index < str.length() && str.charAt(index) == '-') {
            sign = -1;
            index++;
        } else if (index < str.length() && str.charAt(index) == '+') {
            index++;
        }
        
        int total = 0;
        while(index < str.length()) {
            int digit = str.charAt(index) - '0';
            if(digit < 0 || digit > 9) break;
            
            if((Integer.MAX_VALUE - digit) / 10 < total) {//判断是否超过int值范围
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            total = total * 10 + digit;
            index++;
        }
        
        return total * sign;
    }
}
```

# 5. Longest Palindromic Substring
Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example 1:
```
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.
```
Example 2:
```
Input: "cbbd"
Output: "bb"
```


```Java
// 我的答案
class Solution {
   public String longestPalindrome(String s) {
        if(null == s || s.length() == 0 ) return "";
        if(s.length() == 1) return s;
        int start = 0;
        int end = 1;
        String palindromeStr = "";
        while(start !=s.length()){
            String temp = s.substring(start,end);
            if(isPalindromic(temp)){ 
                if(temp.length() >= palindromeStr.length()){
                     palindromeStr = temp;
                }   
            }
            end++;
            if(end > s.length()){
                start++;
                end = start +1;
            }
        }
        return palindromeStr;
    }
    public boolean isPalindromic(String s){
        StringBuilder sb = new StringBuilder(s);
        return s.equals(sb.reverse().toString());
    }
}
```


```Java
//推荐答案
class Solution {
   public String longestPalindrome(String s) {
               if (s == null || s.length() <= 1) return s;
        
        int len = s.length();
        for (int i = 0; i < len - 1; i++) {
            extendPalindrome(s, i, i); // assume odd length, try to extend Palindrome as possible
            extendPalindrome(s, i, i + 1); // assume even length
        }
        return s.substring(lo, lo + maxLen);
    }
    
    private void extendPalindrome(String s, int i, int j) {
        while (i >= 0 && j < s.length() && s.charAt(i) == s.charAt(j)) {
            i--;
            j++;
        }
        
        if (maxLen < j - i - 1) {//j-i+1 -2
            maxLen = j - i - 1;
            lo = i + 1;
        }
    }
}
```

# 3. Longest Substring Without Repeating Characters
Given a string, find the length of the longest substring without repeating characters.

Example 1:
```
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 
```
Example 2:
```
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```
Example 3:
```
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

**注释部分是自己写ac的答案**

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
      /*char[]  sArray = s.toCharArray();
        int maxLength = 0;
        for(int i = 0; i < sArray.length; i++){
            Set<Character> set = new HashSet<>();
            for(int j = i; j < sArray.length; j++){
                if(set.contains(sArray[j])) break;
                set.add(sArray[j]);
            }
            maxLength = maxLength > set.size() ? maxLength : set.size();
        }
        return maxLength;*/
        
       /* int len = 0;
        if(s==null || s.length() == 0) return len;
        int start = 0;
        int end = 1;
        len++;
        Set<Character> set = new HashSet<>();
        char[] c = s.toCharArray();
        set.add(c[0]);
        int max = len;

        while( end != c.length){
            if( set.contains(c[end])){
                set.remove(c[start]);
                start++;
                len--;
                continue;
            }
            set.add(c[end]);
            len++;
            end++;
            max = max > len ? max : len;
        }
        return max; */
        int[] arr = new int[256];
        int rep = 0;
        int max = 0;
        for(int i = 1; i <= s.length(); i++){
            int c = s.charAt(i-1);
            rep = Math.max(rep,arr[c]);
            int count = i -rep ;//如果没有重复，rep等于0，count等于i，相当于count++
            max = max > count ? max : count;     
            arr[c] = i;
        }
        return max;
    }
}
```

# 11. Container With Most Water
Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

Note: You may not slant the container and n is at least 2.
![image.png](LeetCode-note-part-1/11.png)
The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

Example:
```
Input: [1,8,6,2,5,4,8,3,7]
Output: 49
```


```Java
//逐个遍历求面积然后取最大值，肯定能做出来，但是效率太差
class Solution {
    public int maxArea(int[] height) {
        int start = 0;
        int end = height.length -1;
        int cap = 0;

        while (start < end){
            int min_height = Math.min(height[start], height[end]);
            int tempCap = min_height * (end -start);
            if(height[start] < height[end]){//我用的比较左右面积来移动，得出结果是错的；需思考为何用高度是对的
                start ++;
            }else{
                end --;
            }
            cap = cap > tempCap ? cap : tempCap;
        }
        return cap;
    }
}
```

# 15. 3Sum
Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

Note:

The solution set must not contain duplicate triplets.

Example:
```
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```


```Java
// 我的ac
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {      
        List<List<Integer>> list = new ArrayList<>();
        if(3 > nums.length)  return list;
        int num1Index = 0;
        int num2Index = 1;
        boolean is3Zero = false;
        boolean isAllZero = true;
          for(int i = 0; i < nums.length; i++){//需要考虑全是0的特殊情况，避免大量判断
            if(nums[i] != 0){
                isAllZero = false;
                break;
            }
        }
        if(isAllZero){
            List<Integer> tmp = new ArrayList<>();
            tmp.add(0);
            tmp.add(0);
            tmp.add(0);
            list.add(tmp);
            return list;
        }
        while(num1Index < nums.length-2){
            for(int i = num2Index + 1; i < nums.length; i++){
                if(nums[num1Index] + nums[num2Index] + nums[i] == 0){
                    List<Integer> tmp = new ArrayList<>();
                    tmp.add(nums[num1Index]);
                    tmp.add(nums[num2Index]);
                    tmp.add(nums[i]);
                    if(nums[num1Index] == 0 && nums[num2Index] == 0 && !is3Zero){
                        list.add(tmp);
                        is3Zero = true;
                        continue;
                    }
                    if(isDuplicated(list,tmp))continue;
                    list.add(tmp);
                }
            }
            if(num2Index == nums.length-2){
                num1Index ++;
                num2Index = num1Index +1;
            }else{
                num2Index ++;
            }
        }
        return list;
    }
    public boolean isDuplicated(List<List<Integer>> list , List<Integer> list2){
        for(List<Integer> temp : list){
            if(temp.containsAll(list2))return true;
        }
        return false;
    }
}
```


```Java
// 推荐答案，先进行排序，然后进行相关判断（子对队列首、尾相加并进行判断）
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> resultArray=new ArrayList<>();
        if(nums==null||nums.length<3) return resultArray;
        Arrays.sort(nums);

        for(int i=0;i<nums.length-2;i++){
            if(i>0&&nums[i]==nums[i-1])continue;
            List<List<Integer>> result=find(nums,i+1,nums.length-1,nums[i]);
            resultArray.addAll(result);
        }
        return resultArray;
    }
    public List<List<Integer>> find(int[] nums,int start,int end,int target){
        List<List<Integer>> result=new ArrayList<>();
        int left=start,right=end;
        while(left<right){
            if(nums[left]+nums[right]+target==0){
                List<Integer> list=new ArrayList<>();
                list.add(nums[left]);
                list.add(nums[right]);
                list.add(target);
                result.add(list);
                while(left<right&&nums[left]==nums[left+1])left++;
                while(left<right&&nums[right]==nums[right-1])right--;
                left++;
                right--;
            }
            else if(nums[left]+nums[right]<-1*target)//要使和大一些，那么right保持不动，left向右移动
            {
            
                left++;
            }
            else
            {
              
                right--;
            }
        }
        return result;
    }
}
```

# 16. 3Sum Closest
Given an array nums of n integers and an integer target, find three integers in nums such that the sum is closest to target. Return the sum of the three integers. You may assume that each input would have exactly one solution.

Example:
```
Given array nums = [-1, 2, 1, -4], and target = 1.

The sum that is closest to the target is 2. (-1 + 2 + 1 = 2).
```


```Java
//我的答案
class Solution {
    public int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int diff = 0;
        while(true){
            for(int i = 0; i <nums.length; i++){
            // nums[i] + num[start] + nums[end] = target + diff
                if(find(nums, i+1, nums.length-1, target + diff - nums[i])){
                    return target + diff;
                }
            // nums[i] + num[start] + nums[end] = target - diff
                if(find(nums, i+1, nums.length-1, target - diff - nums[i])){
                    return target - diff;
                }
            }
            diff++;
        }   
    }
    
    public boolean find(int[] nums, int start, int end, int target){
        while(start < end){
            if(nums[start] + nums[end] == target){
                return true;
            }else if(nums[start] + nums[end] < target){
                start++;
            }else{
                end--;
            }
        }      
        return false;
    }
}
```


```Java
//使用空间最小的答案
class Solution {
    public int threeSumClosest(int[] nums, int target) {
        if(nums==null || nums.length<3) return 0;
        Arrays.sort(nums);
        int len = nums.length;
        int result = nums[0]+nums[1]+nums[len-1];
        for(int i=0; i<len-2; i++){
            int val1 = nums[i];
            int j=i+1;
            int k=len-1;
            while(j<k){
                int sum = val1+nums[j]+nums[k];
                if(sum >target){
                    k--;
                }else{
                    j++;               
                }
                if(Math.abs(target-result) > Math.abs(target-sum)){
                    result = sum;
                }                
            }            
        }
        return result;
    }
}
```

# 17. Letter Combinations of a Phone Number
Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

![image.png](LeetCode-note-part-1/17.png)

Example:
```
Input: "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
```
Note:

Although the above answer is in lexicographical order, your answer could be in any order you want.


```Java
// 我的方法，使用循环实现
class Solution {
    public String[] letterTable = {"","","abc", "def", "ghi", "jkl", "mno", 
                                "qprs", "tuv", "wxyz"};
    public List<String> letterCombinations(String digits) {
        
        List<String> list = new ArrayList<>();
        if(digits.length() == 0)return list;
        for(int i = 0; i < letterTable[digits.charAt(0) - '0'].length(); i++){
            list.add(letterTable[digits.charAt(0) - '0'].charAt(i) + "");
        }
        for(int i = 1; i < digits.length(); i++){
            int digit = digits.charAt(i) - '0';
            String numStr = letterTable[digit];
            List<String> tmpList = new ArrayList();
            for(String str : list){
                for(int j = 0; j < numStr.length(); j++){
                    tmpList.add(str + numStr.charAt(j));
                }
            }
            list = tmpList;
        }
        
        return list;
    }
   
}
```


```Java
// 当前排名使用最少空间的，使用的是递归的方法，其实原理和循环类似，通过substring方法完成递归实现
class Solution {
    
    Map<Character, String> phone = new HashMap<Character, String>() {{
        put('2', "abc");
        put('3', "def");
        put('4', "ghi");
        put('5', "jkl");
        put('6', "mno");
        put('7', "pqrs");
        put('8', "tuv");
        put('9', "wxyz");
    }};

    List<String> output;
    
    public void backtrack(String combination, String next_digits){

        // if there is no more digits to check
        if(next_digits.length() == 0){
            // the combination is done
            output.add(combination);
        }
        // if there are still digits to check
        else {
            // iterate over all letters which map
            // the next available digit
            char digit = next_digits.charAt(0);
            String letters = phone.get(digit);
            for(int i = 0 ; i < letters.length() ; i++){
                char letter = phone.get(digit).charAt(i);
                // append the current letter to the combination
                // and proceed to the next digits
                backtrack(combination + letter, next_digits.substring(1));
            }
        }
    }
    
    public List<String> letterCombinations(String digits) {
        output = new ArrayList<>();
        if(digits.length() != 0){
            backtrack("", digits);
        }
        return output;
    }
}
```

# 18. 4Sum
Given an array nums of n integers and an integer target, are there elements a, b, c, and d in nums such that a + b + c + d = target? Find all unique quadruplets in the array which gives the sum of target.

Note:

The solution set must not contain duplicate quadruplets.

Example:
```
Given array nums = [1, 0, -1, 0, -2, 2], and target = 0.

A solution set is:
[
  [-1,  0, 0, 1],
  [-2, -1, 1, 2],
  [-2,  0, 0, 2]
]
```


```Java
//我的ac  25 ms
class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {       
        List<List<Integer>> result=new ArrayList<>();
        Arrays.sort(nums);
         if(nums.length < 4)return  result;
        for(int i = 0; i < nums.length - 3; i++){
            for(int j = i + 1; j < nums.length -2; j++){
                List<List<Integer>> tmpresult =find(nums, i, j, j + 1, nums.length - 1, target -nums[i] - nums[j]);
                result.addAll(tmpresult);
                while(j<nums.length-2 && nums[j] == nums[j+1])j++;//注意重复数值可能导致添加重复组合
            }
            while(i<nums.length-2 && nums[i] == nums[i+1]) i++;//注意重复数值可能导致添加重复组合
        }
        return result;
    }
    public List<List<Integer>> find (int[] nums, int ind1, int ind2, int left, int right, int target){
        List<List<Integer>> result = new ArrayList<>();
        while(left < right){
           if(nums[left] + nums[right] == target){
                List<Integer> tmp = new ArrayList();
                tmp.add(nums[ind1]);
                tmp.add(nums[ind2]);
                tmp.add(nums[left]);
                tmp.add(nums[right]);
                result.add(tmp);
                while(left<right&&nums[left] == nums[left+1])left++;//注意重复数值可能导致添加重复组合
                while(left<right&&nums[right] == nums[right-1])right--;//注意重复数值可能导致添加重复组合
                left ++;//注意，这里还是得前进，因为前面只是排除重复的
                right --;//注意，这里还是得前进，因为前面只是排除重复的
            }else if(nums[left] + nums[right] < target){
                left ++;
            }else{
                right --;
            } 
        }
        return result;
    }
}
```


```Java
//查看其它ac后的改良版本 10 ms
class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {       
        List<List<Integer>> result=new ArrayList<>();
        Arrays.sort(nums);
         if(nums.length < 4)return  result;
        for(int i = 0; i < nums.length - 3; i++){
            // 此处为改良处，提前判断后续是否有合适的结果，减少不必要的计算
            if(nums[i]+nums[i+1]+nums[i+2]+nums[i+3] > target)
                break;
            if(nums[i]+nums[nums.length-1]+nums[nums.length-2]+nums[nums.length-3]<target)
                continue;
            for(int j = i + 1; j < nums.length -2; j++){
                // 此处为改良处，提前判断后续是否有合适的结果，减少不必要的计算
                if(nums[i]+nums[j]+nums[j+1]+nums[j+2]>target)
                    break;
                if(nums[i]+nums[j]+nums[nums.length-1]+nums[nums.length-2]<target)
                    continue;  
                List<List<Integer>> tmpresult =find(nums, i, j, j + 1, nums.length - 1, target -nums[i] - nums[j]);
                result.addAll(tmpresult);
                while(j<nums.length-2 && nums[j] == nums[j+1])j++;
            }
            while(i<nums.length-2 && nums[i] == nums[i+1]) i++;
        }
        return result;
    }
    public List<List<Integer>> find (int[] nums, int ind1, int ind2, int left, int right, int target){
        List<List<Integer>> result = new ArrayList<>();
        while(left < right){
           if(nums[left] + nums[right] == target){
                List<Integer> tmp = new ArrayList();
                tmp.add(nums[ind1]);
                tmp.add(nums[ind2]);
                tmp.add(nums[left]);
                tmp.add(nums[right]);
                result.add(tmp);
                while(left<right&&nums[left] == nums[left+1])left++;
                while(left<right&&nums[right] == nums[right-1])right--;
                left ++;
                right --;
            }else if(nums[left] + nums[right] < target){
                left ++;
            }else{
                right --;
            } 
        }
        return result;
    }
}
```


```Java
// 最少空间的ac
```

# 19. Remove Nth Node From End of List
Given a linked list, remove the n-th node from the end of list and return its head.

Example:
```
Given linked list: 1->2->3->4->5, and n = 2.

After removing the second node from the end, the linked list becomes 1->2->3->5.
```
Note:

Given n will always be valid.


```Java
// my ac
/**
 Definition for singly-linked list.*/
 public class ListNode {
     int val;
     ListNode next;
     ListNode(int x) { val = x; }
 }
 
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode point = head;
        int size = 1;
        while(point.next != null){
            size ++;
            point = point.next;
        }
        if(size ==1 && n>=1)return null;
        if(size == n)return head.next;
        point = head;
        for(int i = 0; i < size - n -1; i++){
            point = point.next;
        }        
        if(point == head){
            if(size > 2){
                head.next = head.next.next;
            }else{
                head.next = null;
            }
        }else{
            if(null != point.next){
                point.next = point.next.next;
            }
        }
        return head;
    }
}
```


```Java
// min space ,使用的递归方法
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {

        if(head == null || head.next == null)
        {
            return null;
        }
        int i = getNodeIndex(head,n);
        if(i == n)
        {
            head = head.next;
        }
        return head;
    }
    
    private int getNodeIndex(ListNode node, int n)
    {        
        if(node.next == null)
        {
            return 1;
        }
        int i = 1 + getNodeIndex(node.next,n);

        if( n == i-1)
        {
            node.next = node.next.next;           
            return i ; 
        }                    
        return i;
    }
}
```

# 22. Generate Parentheses
Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

For example, given n = 3, a solution set is:
```
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
```


```Java
// 第一次错误方法
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> list = new ArrayList();
        if(n == 0)return list;
        list.add("()");
        for(int i = 1; i < n; i++){
            List<String> tmp = new ArrayList();
            for(String str : list){
                tmp.add("(" + str +")");                        
                String tmpstr = str + "()";
                if(tmpstr.equals("()"+str)){
                    tmp.add(tmpstr);    
                }else{
                    tmp.add(str + "()");
                    tmp.add("()" + str);                  
                }        
            }
            list = tmp;
        }
        return list;
    }
}
```


```Java
//第二次错误方法
class Solution {
    public List<String> generateParenthesis(int n) {
        List<List<String>> listAll = new ArrayList();
        List<String> tmp = new ArrayList();
        if(n == 0)return tmp;
        tmp.add("()");
        listAll.add(tmp);
        for(int i = 1; i < n; i++){
            tmp =  new ArrayList();
            for(int j = 1; j <= i/2 + 1; j++){
                
                if( j==1 ){
                    for(String str : listAll.get(i-1)){
                        tmp.add("(" + str + ")");                                       
                    }
                }
                    
                    for(String str1:listAll.get(j-1)){
                        for(String str2 : listAll.get(i - j)){
                            tmp.add(str2 + str1);
                        }
                    }
                                                
            }
            if(i>=2)tmp.remove(tmp.size() -1);
            listAll.add(tmp);
        }
        return listAll.get(n-1);
    }
}
```


```Java
// 推荐方法
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> list = new ArrayList();
        if(n == 0){
            list.add("");
        }else{
            for(int i = 0; i < n; i++){
                for(String left : generateParenthesis(i)){
                    for(String right : generateParenthesis(n - i -1)){
                        list.add("(" + left + ")" + right);//此处添加了一对括号
                    }
                }
            }
        }
        return list;
    }
}
```


```Java
//回溯法
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> ans = new ArrayList();
        backtrack(ans, "", 0, 0, n);
        return ans;
    }

    public void backtrack(List<String> ans, String cur, int open, int close, int max){
        if (cur.length() == max * 2) {
            ans.add(cur);
            return;
        }

        if (open < max)
            backtrack(ans, cur+"(", open+1, close, max);
        if (close < open)
            backtrack(ans, cur+")", open, close+1, max);
    }
}
```


```Java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> combinations = new ArrayList();
        generateAll(new char[2 * n], 0, combinations);
        return combinations;
    }

    public void generateAll(char[] current, int pos, List<String> result) {
        if (pos == current.length) {
            if (valid(current))
                result.add(new String(current));
        } else {
            current[pos] = '(';
            generateAll(current, pos+1, result);
            current[pos] = ')';
            generateAll(current, pos+1, result);
        }
    }

    public boolean valid(char[] current) {
        int balance = 0;
        for (char c: current) {
            if (c == '(') balance++;
            else balance--;
            if (balance < 0) return false;
        }
        return (balance == 0);
    }
}
```

# 24. Swap Nodes in Pairs
Given a linked list, swap every two adjacent nodes and return its head.

You may not modify the values in the list's nodes, only nodes itself may be changed.

Example:
```
Given 1->2->3->4, you should return the list as 2->1->4->3.
```


```Java
// my ac

//  Definition for singly-linked list.
public class ListNode {
  int val;
  ListNode next;
  ListNode(int x) { val = x; }
}
class Solution {
    public ListNode swapPairs(ListNode head) {        
        return douExchange(head);
    }
    public ListNode douExchange(ListNode left){
        if(left == null)return null;
        if(left.next ==null)return left;
        ListNode point = left.next.next;
        ListNode right = left.next;
        // 如果右边是最后一个，需要额外考虑
        if(null == right.next){
            left.next = null;
            right.next = left;
            return right;
        }else{
            left.next = right.next.next;
            right.next = left;
        }
        
        
        left.next = douExchange(point);
        return right;
    }
}
```


```Java
// better ac
class Solution {
    public ListNode swapPairs(ListNode head) {  
        if(head ==null || head.next ==null)return head;
        ListNode tmp = head;
        head = head.next;
        tmp.next = head.next;
        head.next = tmp;
       // tmp.next =  swapPairs(tmp.next);
         head.next.next =  swapPairs(head.next.next);//这样写，即使是head.next是最后一个节点也可以解决
        return head;
    }  
}
```

# 29. Divide Two Integers
Given two integers dividend and divisor, divide two integers without using multiplication, division and mod operator.

Return the quotient after dividing dividend by divisor.

The integer division should truncate toward zero.

Example 1:
```
Input: dividend = 10, divisor = 3
Output: 3
```
Example 2:
```
Input: dividend = 7, divisor = -3
Output: -2
```
Note:

+ Both dividend and divisor will be 32-bit signed integers.
+ The divisor will never be 0.
+ Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [$−2^{31}$,$2^{31}$ − 1]. For the purpose of this problem, assume that your function returns 231 − 1 when the division result overflows.


```Java
//MY AC
class Solution {
    public int divide(int dividend, int divisor) {
        if(dividend == Integer.MIN_VALUE && divisor ==-1)return Integer.MAX_VALUE;
        try{
            int result =  dividend/divisor;
            if(result < Integer.MIN_VALUE || result >= Integer.MAX_VALUE)return Integer.MAX_VALUE;
            return result;
        }catch(Exception e) {
            return Integer.MAX_VALUE;
        }
    }
}
```


```Java
// BETTER AC 
class Solution {
    public int divide(int dividend, int divisor) {
        if (dividend == 0) {
            return 0;
        }
        
        if (dividend == Integer.MIN_VALUE && divisor == -1) {
            return Integer.MAX_VALUE;
        }
        
        boolean isPositive = true;
        if (dividend > 0 && divisor < 0 || (dividend < 0 && divisor > 0)) {
            isPositive = false;
        }
        
        long a = Math.abs((long) dividend);
        long b = Math.abs((long) divisor);
        int shift = 0;
        int result = 0;
        // 所有的整数都能用2的若干次幂求和得到，同时采用位移操作，能加快运算效率
        while (a >= b) {
            while (a >= b << shift) {
                shift++;
            }
            a -= b << (shift - 1);
            result += 1 << (shift - 1);
            shift = 0;
        }
        
        return isPositive ? result : -result;
    }
}
```

# 33. Search in Rotated Sorted Array
Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.

(i.e., [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2]).

You are given a target value to search. If found in the array return its index, otherwise return -1.

You may assume no duplicate exists in the array.

Your algorithm's runtime complexity must be in the order of O(log n).

Example 1:
```
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```
Example 2:
```
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```


```Java
class Solution {
    public int search(int[] nums, int target) {
        if(nums.length ==0)return -1;
        if(nums[0] == target)return 0;
        return find(nums, 0, nums.length-1, target);
    }
    public int find(int[] nums, int left, int right, int target){
        if(right <left)return -1;

        if(nums[left] == target)return left;
        if(nums[right] == target)return right;        
        int mid = left + (right -left)/2;
        if(nums[mid] == target)return mid;
        //判断右边的数值是否比左边的小，如果是，则说明翻转过
        if(nums[mid] < nums[right]){
            //判断target落在哪个区间
            //一定只会有两种可能，要么在左边，要么在右边
            if(nums[mid] < target && target < nums[right]) {
               return find(nums, mid+1, right, target);   
            }else{    
                return find(nums, left, mid-1, target);                
            }
            
        }else{
           if(nums[left] < target && target < nums[mid]) {
               return find(nums, left, mid-1, target);   
            }else{               
                return find(nums, mid+1, right, target);
            }
        }
    }
}
```

# 34. Find First and Last Position of Element in Sorted Array
Given an array of integers nums sorted in ascending order, find the starting and ending position of a given target value.

Your algorithm's runtime complexity must be in the order of O(log n).

If the target is not found in the array, return [-1, -1].

Example 1:
```
Input: nums = [5,7,7,8,8,10], target = 8
Output: [3,4]
```
Example 2:
```
Input: nums = [5,7,7,8,8,10], target = 6
Output: [-1,-1]
```


```Java
// my ac
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int tindex = find(nums, 0, nums.length-1, target);
        int left = tindex, right = tindex;
        while(left >0 &&nums[left -1] == target){
            left --;
        }
        while(right < nums.length-1 && nums[right +1] == target){
            right ++;
        }
        return new int[]{left, right};
    }
    public int find(int[] nums, int left, int right, int target){
        if(left > right)return -1;
        if(nums[left] == target)return left;
        if(nums[right] == target)return right;
        int mid = left + (right - left)/2;
        if(nums[mid] == target)return mid;
        if( nums[mid] < target && target < nums[right]){
            return find(nums, mid +1, right, target);
        }else{
            return find(nums, left, mid-1, target);
        }
    }
}
```

# 36. Valid Sudoku
Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

+ Each row must contain the digits 1-9 without repetition.
+ Each column must contain the digits 1-9 without repetition.
+ Each of the 9 3x3 sub-boxes of the grid must contain the digits 1-9 without repetition.
![image.png](LeetCode-note-part-1/36.png)
A partially filled sudoku which is valid.

The Sudoku board could be partially filled, where empty cells are filled with the character '.'.

Example 1:
```
Input:
[
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
]
Output: true
```
Example 2:
```
Input:
[
  ["8","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  [".",".",".",".","8",".",".","7","9"]
]
Output: false

Explanation: Same as Example 1, except with the 5 in the top left corner being 
    modified to 8. Since there are two 8's in the top left 3x3 sub-box, it is invalid.
```
Note:

+ A Sudoku board (partially filled) could be valid but is not necessarily solvable.
+ Only the filled cells need to be validated according to the mentioned rules.
+ The given board contain only digits 1-9 and the character '.'.
+ The given board size is always 9x9.


```Java
// my ac
class Solution {
    public boolean isValidSudoku(char[][] board) {
        // 先进行判断
        for(int i = 0;  i <9; i++){
            Set<Character> set = new HashSet();
            for(int j = 0; j<9; j++){
                if(!(board[i][j] == '.')){
                    if(set.contains(board[i][j]))return false;
                    set.add(board[i][j]);
                }     
            }
        }
        // 进行列判断
         for(int i = 0;  i <9; i++){
            Set<Character> set = new HashSet();
            for(int j = 0; j<9; j++){
                if(! (board[j][i] == '.')){
                    if(set.contains(board[j][i]))return false;
                    set.add(board[j][i]);
                }   
            }
        }
        // 九宫格判断
         for(int i = 0;  i <9; i = i + 3){            
            for(int j = 0; j<9; j = j + 3){
                Set<Character> set = new HashSet();
                for(int k = 0; k<3; k++){
                    for(int h=0; h<3; h++){
                        if(!(board[i+k][j+h] == '.')){
                            if(set.contains(board[i+k][j+h]))return false;
                                set.add(board[i+k][j+h]);
                            }    
                    }
                }
                 
            }
        }
        return true;
    }
}
```


```Java
// suggested ac
class Solution {
  public boolean isValidSudoku(char[][] board) {
    // init data
    HashMap<Integer, Integer> [] rows = new HashMap[9];
    HashMap<Integer, Integer> [] columns = new HashMap[9];
    HashMap<Integer, Integer> [] boxes = new HashMap[9];
    for (int i = 0; i < 9; i++) {
      rows[i] = new HashMap<Integer, Integer>();
      columns[i] = new HashMap<Integer, Integer>();
      boxes[i] = new HashMap<Integer, Integer>();
    }

    // validate a board
    for (int i = 0; i < 9; i++) {
      for (int j = 0; j < 9; j++) {
        char num = board[i][j];
        if (num != '.') {
          int n = (int)num;
          int box_index = (i / 3 ) * 3 + j / 3;

          // keep the current cell value
          rows[i].put(n, rows[i].getOrDefault(n, 0) + 1);
          columns[j].put(n, columns[j].getOrDefault(n, 0) + 1);
          boxes[box_index].put(n, boxes[box_index].getOrDefault(n, 0) + 1);

          // check if this value has been already seen before
          if (rows[i].get(n) > 1 || columns[j].get(n) > 1 || boxes[box_index].get(n) > 1)
            return false;
        }
      }
    }

    return true;
  }
}
```


```Java
// my preferred ac
class Solution {
    public boolean isValidSudoku(char[][] board) {
          for (int i = 0; i < 9; i++) {
            int[] row = new int[9];
            int[] col = new int[9];
            int[] cube = new int[9];
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != '.') {
                    if (row[board[i][j] - '1'] == 1) {
                        return false;
                    } else {
                        row[board[i][j] - '1'] = 1;
                    }
                }

                if (board[j][i] != '.') {
                    if (col[board[j][i] - '1'] == 1) {
                        return false;
                    } else {
                        col[board[j][i] - '1'] = 1;
                    }
                }
                // 每一宫内行列的变化
                int cubeX = 3 * (i / 3) + j / 3;
                int cubeY = 3 * (i % 3) + j % 3;
                if (board[cubeX][cubeY] != '.') {
                    if (cube[board[cubeX][cubeY] - '1'] == 1) {
                        return false;
                    } else {
                        cube[board[cubeX][cubeY] - '1'] = 1;
                    }
                }
            }
        }
        return true;
    }
}
```

# 39. Combination Sum
<span style='color:red;font-size:30px'>Mark</span>

Given a set of candidate numbers (candidates) (without duplicates) and a target number (target), find all unique combinations in candidates where the candidate numbers sums to target.

The same repeated number may be chosen from candidates unlimited number of times.

Note:

All numbers (including target) will be positive integers.
The solution set must not contain duplicate combinations.

Example 1:
```
Input: candidates = [2,3,6,7], target = 7,
A solution set is:
[
  [7],
  [2,2,3]
]
```
Example 2:
```
Input: candidates = [2,3,5], target = 8,
A solution set is:
[
  [2,2,2,2],
  [2,3,3],
  [3,5]
]
```


```Java
class Solution {  
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList();
        List<Integer> tmp = new ArrayList();
        Arrays.sort(candidates);//貌似本身排好序的，加上无伤大雅
        find(candidates, 0, result, tmp, target);
        return result;
    }
    public void find(int[] candidates, int sIndex, List<List<Integer>> result, List<Integer> tmp, int target ){
        if(target == 0){
            result.add(tmp);
            return ;
        }
        if(target < 0){
            return;
        }
        for(int i = sIndex; i < candidates.length; i++){
            List<Integer> tmpc = new ArrayList(tmp);
            tmpc.add(candidates[i]);
            find(candidates, i, result, tmpc, target - candidates[i]);
        }
    }
}
```


```Java
// better answer ，利用数组替换List能够节省空间
class Solution {
    
    List<List<Integer>> ans=new ArrayList<>();
    int [] path=new int[100];//记录答案
    int len=0;
    
    public void robot(int idx,int [] nums,int target){//idx是扫描到数组哪个数字
        if(target==0){
            //拼答案,把记录在path里的数字拿出来
            List<Integer> res=new ArrayList<>();
            for(int i=0;i<len;i++){
                res.add(path[i]);
            }
            ans.add(res);
            return;
        }        
        if(target<0||idx>=nums.length)
            return;
        //写递归,两种策略取和不取nums[idx]
        path[len]=nums[idx];
        len++;
        robot(idx,nums,target-nums[idx]);//取但是idx不加1，因为下一次还可以取这个数
        len--;//必须加这行，因为递归结束后不满足条件的数要从刚加入的删除掉，也就是指针回滚
        robot(idx+1,nums,target);//不在取前面的数
    }
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
      robot(0,candidates,target);
      return ans;
    }
}
```

# 40. Combination Sum II
<span style='color:red;font-size:30px'>Mark</span>

Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sums to target.

Each number in candidates may only be used once in the combination.

Note:

All numbers (including target) will be positive integers.
The solution set must not contain duplicate combinations.
Example 1:
```
Input: candidates = [10,1,2,7,6,1,5], target = 8,
A solution set is:
[
  [1, 7],
  [1, 2, 5],
  [2, 6],
  [1, 1, 6]
]
```
Example 2:
```
Input: candidates = [2,5,2,1,2], target = 5,
A solution set is:
[
  [1,2,2],
  [5]
]
```


```Java
// my extreme difficult ac
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList();
        List<Integer> tmp = new ArrayList();
        find(candidates, 0, result, tmp, target);
        return result;
    }
    
    public void find(int[] candidates, int sidx, List<List<Integer>> result, List<Integer> tmp, int target){
        if(target ==0){
            result.add(tmp);
            return;
        }
        if(target < candidates[0]){//相比小于0，能更快结束递归
            return ;
        }
        for(int i = sidx; i < candidates.length && candidates[i] <= target; i++){                             
             /*
            if (i > sidx && candidates[i] == candidates[i-1]){//达到的效果和后面while一样
                continue;
            }*/
            List<Integer> tmpc = new ArrayList(tmp);
            tmpc.add(candidates[i]);
            find(candidates, i+1, result, tmpc, target - candidates[i]);
            while(i < candidates.length -1 && candidates[i] == candidates[i+1]){
                i++;
            }            
        }
    }
}
```

# 43. Multiply Strings
Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string.

Example 1:
```
Input: num1 = "2", num2 = "3"
Output: "6"
```
Example 2:
```
Input: num1 = "123", num2 = "456"
Output: "56088"
```
Note:

+ The length of both num1 and num2 is < 110.
+ Both num1 and num2 contain only digits 0-9.
+ Both num1 and num2 do not contain any leading zero, except the number 0 itself.
+ You must not use any built-in BigInteger library or convert the inputs to integer directly.


```Java
// my ac
class Solution {
    public String multiply(String num1, String num2) {
        if("0".equals(num1) || "0".equals(num2))return "0";
        
        return bigMul(num1, num2).toString();
        
    }
    public StringBuilder bigMul(String num1, String num2){
        StringBuilder result = new StringBuilder();
        // 先将字符串翻转，方便计算
        String num1rev = new StringBuilder(num1).reverse().toString();
        String num2rev = new StringBuilder(num2).reverse().toString();
        for(int i = 0; i < num1rev.length(); i++ ){
            StringBuilder tmp = new StringBuilder();
            int carry = 0;
            for(int count = 0; count < i; count++){
                tmp.append("0");
            }
            int mul1 = num1rev.charAt(i) - '0';
            for(int j = 0; j < num2rev.length(); j++){
                int mul2 = num2rev.charAt(j) - '0';
                int product = mul1 * mul2 + carry;
                carry = product /10;
                tmp.append(product % 10);
            }
            if(carry > 0)tmp.append(carry);
            result = bigAdd(result.toString(), tmp.reverse().toString());
        }
        return result;
    }
    public StringBuilder bigAdd(String num1, String num2){
        StringBuilder result = new StringBuilder();
        // 先将字符串翻转，方便计算
        String num1rev = new StringBuilder(num1).reverse().toString();
        String num2rev = new StringBuilder(num2).reverse().toString();
        int carry = 0;
        int i = 0;
        for(i = 0; i < num1rev.length() && i< num2rev.length(); i++){
            int add1 = num1rev.charAt(i) - '0';
            int add2 = num2rev.charAt(i) - '0';
            int sum = add1 + add2 +carry;
            carry = sum /10;
            result.append(sum %10);
        }
        while(i < num1rev.length()){
            int add = num1rev.charAt(i) - '0';
            int sum = add + carry;
            carry = sum /10;
            result.append(sum %10);
            i++;
        }
        while(i < num2rev.length()){
            int add = num2rev.charAt(i) - '0';
            int sum = add + carry;
            carry = sum /10;
            result.append(sum %10);
            i++;
        }
        if(carry >0)result.append(carry);
        return result.reverse();
    }
}
```


```Java
// better ac，利用数组处理结果能够良好节省计算过程空间和时间
class Solution {
    public String multiply(String num1, String num2) {
      StringBuilder res = new StringBuilder();
        char[] a = num1.toCharArray();
        char[] b = num2.toCharArray();
        if ((num1.length()==1&&num1.equals("0"))||(num2.length()==1&&num2.equals("0")))return "0";
        //两数相乘最大不会超过两位相加的位数
        int[] result = new int[a.length + b.length];
        //两数倒向相乘
        for (int i = a.length-1; i >=0; i--) {
            for (int j=b.length-1; j >=0;  j--) {
                result[a.length-1-i + b.length-1-j]+= (a[i] - 48) * (b[j] - 48);
            }
        }
        for (int i = 0; i < result.length - 1; i++) {
            if (result[i] >= 10) {
                result[i + 1] += result[i] / 10;
                result[i] = result[i] % 10;
            }
        }
        //从前向后判断是否可以读取也就是第一位是不是为零
        boolean juge = false;
        for (int i = result.length - 1; i >= 0; i--) {
            if (result[i] != 0) {
                juge = true;
            }
            if (juge) {
                res.append(result[i]);
            }
        }
        return res.toString();

 
    }
}
```

# 46. Permutations
Given a collection of distinct integers, return all possible permutations.

Example:
```
Input: [1,2,3]
Output:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```


```Java
// my ac
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList();
        List<Integer> tmp = new ArrayList();
        combine(result, tmp, nums);
        return result;
    }
    public void combine(List<List<Integer>> result, List<Integer> tmp, int[] nums){
        if(tmp.size() == nums.length){
            result.add(tmp); 
            return;
        }else{
             for(int i = 0; i < nums.length; i++){
                if(tmp.contains(nums[i]))continue;
                List<Integer> tmpc = new ArrayList(tmp);
                tmpc.add(nums[i]);
                combine(result, tmpc, nums);
            }
        }
       
    }
}
```


```Java
// seems better ac ? 利用数组记录该数是否已包含该数字，而不是用list判断
class Solution {
   private List<List<Integer>> numList;
    private boolean[] isContain;
    public List<List<Integer>> permute(int[] nums) {
        numList = new ArrayList<>();
        isContain = new boolean[nums.length];
        for (int i = 0; i < isContain.length; i++) {
            isContain[i] = false;
        }
        List<Integer> integerList = new ArrayList<>();
        getPermute(nums, 0 , integerList);
        return numList;
    }

    /**
     *
     * @param nums
     * @param index
     * @param result
     */
    private void getPermute(int[] nums, int index, List<Integer> result){
        if(index == nums.length){
            List<Integer> tempList = new ArrayList<>(result);
            numList.add(tempList);
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if(!isContain[i]){
                result.add(nums[i]);
                isContain[i] = true;
                getPermute(nums, index + 1, result);
                //判断完后回溯
                result.remove(result.size() - 1);
                isContain[i] = false;
            }
        }
    }
}
```


```Java
// 不是很好理解 2ms
/**
每次将已经选过的数字换在前面去，
如第n个数是nums[m],则将nums[m]和nums[n]互换
未利用额外空间，同时只对数组进行操作
*/
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        
        if(nums ==null)return result;
        int len = nums.length;
        sortNums(nums, 0, len);
        return result;
    }
    List<List<Integer>> result = new ArrayList<List<Integer>>();
    public void sortNums(int[] nums, int n, int len){
        List<Integer> list = new ArrayList();
        if(len-1 ==n){
                for(int i =0; i <len; i++){
                    list.add(nums[i]);
                
                }
        result.add(list);
        return;
        }
            for(int j =n; j <len; j++){
                swap(nums,n,j);
                sortNums(nums,n+1,len);
                swap(nums,n,j);      //不还原，for不同次的循环使用的nums不同
            }
    }
    public void swap(int[] nums, int n, int j){
        int temp = 0;
        temp = nums[n];
        nums[n] = nums[j];
        nums[j] = temp;
    }

}
```

# 47. Permutations II
Given a collection of numbers that might contain duplicates, return all possible unique permutations.

Example:
```
Input: [1,1,2]
Output:
[
  [1,1,2],
  [1,2,1],
  [2,1,1]
]
```


```Java
// my ac,实验证明用数组记录是否已包含该数值会比用list.contains效果更好，因为前者可以定位到具体位置的数字，而不是判断值是否相等
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList();
        List<Integer> tmp = new ArrayList();
        boolean[] isContained = new boolean[nums.length];
        combine(result, tmp, nums, isContained);
        return result;
    }
    public void combine(List<List<Integer>> result, List<Integer> tmp, int[] nums, boolean[] isContained){
        if( tmp.size() == nums.length ){
            result.add(tmp);
            return;
        }
        for(int i = 0; i < nums.length; i++){
            if(isContained[i])continue;
            List<Integer> tmpc = new ArrayList(tmp);
            tmpc.add(nums[i]);
            isContained[i] = true;
            combine(result, tmpc, nums, isContained);
            isContained[i] = false;
            while(i < nums.length -1 && nums[i] == nums[i+1]){
                i++;
            }
            
        }
    }
}
```


```Java
// 使用的回溯，相比之下，比我的方法能节约多次new ArrayList(tmp)的空间
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> ret = new ArrayList<List<Integer>>();
        if (nums == null || nums.length == 0) {
            return ret;
        }
        Arrays.sort(nums);
        boolean[] visited = new boolean[nums.length];
        List<Integer> list = new ArrayList<Integer>();
        dfs(nums, visited, list, ret);
        return ret;
    }
    
    public void dfs(int[] nums, boolean[] visited, List<Integer> list, List<List<Integer>> ret) {
        if (list.size() == nums.length) {
            ret.add(new ArrayList<Integer>(list));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            if (i > 0 && nums[i] == nums[i - 1] && !visited[i - 1]) {
                continue;
            }
            
            if (!visited[i]) {
                list.add(nums[i]);
                visited[i] = true;
                dfs(nums, visited, list, ret);
                list.remove(list.size() - 1);
                visited[i] = false;
            }
        }
    }
}
```


```Java
// 和上一题一样，还是这货，用的换值的方法 3ms
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        traceback(nums,0,nums.length-1,result);
        return result;

    }

    private void traceback(int[] nums, int start, int length, List<List<Integer>> res) {
        if (start==length){
            List<Integer> item = new ArrayList<>();
            for (int num:nums) {
                item.add(num);
            }
            res.add(item);
            return;
        }

        for (int i = start; i <=length; i++) {
            if(isDuplicate(nums,start,i)){
                swap(nums,start,i);
                traceback(nums,start+1,length,res);
                swap(nums,start,i);
            }

        }

    }

    private boolean isDuplicate(int[] nums, int start, int end) {
        for (int j = start; j <end; j++) {
            if (nums[j]==nums[end]){
                return false;
            }
        }
        return true;
    }

    private void swap(int[] nums, int i, int start) {
        int temp = nums[i];
        nums[i] = nums[start];
        nums[start] = temp;
    }
}
```

# 48. Rotate Image
You are given an n x n 2D matrix representing an image.

Rotate the image by 90 degrees (clockwise).

Note:

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.

Example 1:
```
Given input matrix = 
[
  [1,2,3],
  [4,5,6],
  [7,8,9]
],

rotate the input matrix in-place such that it becomes:
[
  [7,4,1],
  [8,5,2],
  [9,6,3]
]
```
Example 2:
```
Given input matrix =
[
  [ 5, 1, 9,11],
  [ 2, 4, 8,10],
  [13, 3, 6, 7],
  [15,14,12,16]
], 

rotate the input matrix in-place such that it becomes:
[
  [15,13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7,10,11]
]
```


```Java
// my ac 2ms
class Solution {
    public void rotate(int[][] matrix) {
        // 先逐行将数据倒转顺序
        int sideLen = matrix.length;
        int evenOdd = sideLen %2;
        for(int row = 0; row < matrix.length; row++){
            
            for(int col = 0; col < matrix[0].length /2 + evenOdd; col ++){
                int tmp = matrix[row][col];
                matrix[row][col] = matrix[row][sideLen - col -1] ;
                matrix[row][sideLen - col -1] = tmp;
            }
        }    
        // 将数组matrix对折，matrix[i][j]与matrix[n-j][n-i]
        //将数组matrix对折，matrix[i][j]与matrix[j][i]交换为逆时针
        for(int row = 0; row < matrix.length ; row++){
            
            for(int col = 0; col < sideLen - row ; col ++){
                int tmp = matrix[row][col];
                matrix[row][col] = matrix[sideLen -1 - col][sideLen - row -1];
                matrix[sideLen -1 - col][sideLen - row -1] = tmp;
            }
        }
    }

}
```


```Java
// shortest time 1ms
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        float translate = (n - 1) / 2.0f;
        int last;
        int col, row;
//        剥洋葱
        for (int i = 0; i < n / 2; i++) { // 圈
            for (int j = i; j < n - i - 1; j++) { // 边
                last = matrix[i][j];// 为第一次交换存值
                row = i;
                col = j;
                //加上后面三次，四条边，交换四次
                for (int k = 0; k < 3; k++) { // 点
//                    pre_point
                    int pre_col = row;
                    int pre_row = (int) (2 * translate - col);

                    matrix[row][col] = matrix[pre_row][pre_col];
                    row = pre_row;
                    col = pre_col;
                }
                matrix[row][col] = last;
            }
        }
    }
}
```

# 49. Group Anagrams
Given an array of strings, group anagrams together.

Example:
```
Input: ["eat", "tea", "tan", "ate", "nat", "bat"],
Output:
[
  ["ate","eat","tea"],
  ["nat","tan"],
  ["bat"]
]
```
Note:

+ All inputs will be in lowercase.
+ The order of your output does not matter.


```Java
// my ac 1741ms
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> result = new ArrayList();
        if(strs.length == 0)return result;
        List<String> temp = new ArrayList();
        temp.add(strs[0]);
        result.add(temp);
        for(int i = 1; i < strs.length; i++){
            boolean added = false;
            for(int j = 0; j < result.size(); j++){
                temp = result.get(j);
                if(compareString(temp.get(0), strs[i])){
                    temp.add(strs[i]);
                    added = true;
                }
            }
            if(!added){
                    temp = new ArrayList();
                    temp.add(strs[i]);
                    result.add(temp);
            }
            
        }
        return result;
    }
    public boolean compareString(String a, String b){
        if(a.length() != b.length() ) return false;
        int[] countA = new int[26];
        int[] countB = new int[26];
        int len = a.length();
        for(int i = 0; i < len; i++){
            countA[a.charAt(i) - 'a'] ++;
            countB[b.charAt(i) - 'a'] ++;
        }
        for(int i = 0; i < 26; i++ ){
            if(countA[i] != countB[i])return false;
        }
        return true;
    }
}
```


```Java
// best ac
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
    //只有质数才能保证相乘的结果是真的唯一
        int[] prime = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 41, 43, 47, 53, 
                            59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103};//最多10609个z    
        List<List<String>> resultList = new ArrayList<List<String>>();	// 
        
        // key = 唯一键值， value = resultList 中的 Key 的下标；
        HashMap<Integer, Integer> map = new HashMap<Integer, Integer>();	
        
        for (String s : strs) {
            int key = 1;
            for (char c : s.toCharArray()) {// 获得唯一Key
                key *= prime[c - 'a'];
            }
            
            List<String> targetList;
            if (map.containsKey(key)) {
                targetList = resultList.get(map.get(key));
            } else {
                targetList = new ArrayList<String>();
                resultList.add(targetList);
                map.put(key, resultList.size() - 1);
            }
            targetList.add(s);
        }
        return resultList;
    }
}
```

# 50. Pow(x, n)
Implement pow(x, n), which calculates x raised to the power n (xn).

Example 1:
```
Input: 2.00000, 10
Output: 1024.00000
```
Example 2:
```
Input: 2.10000, 3
Output: 9.26100
```
Example 3:
```
Input: 2.00000, -2
Output: 0.25000
Explanation: 2-2 = 1/22 = 1/4 = 0.25
```
Note:

+ -100.0 < x < 100.0
+ n is a 32-bit signed integer, within the range [$−2^{31}$, $2^{31}$ − 1]


```Java
// 这道题的关键在于超时和效率
class Solution {
    public double myPow(double x, int n) {
        double result = 1.0;
        for(int i = n; i != 0; i = i/2){//i==0时结束，n可能小于0，所以判断不等于0是最好的方式。
            if(i%2 !=0){
                result *= x;
            }
            x *= x;
        }
        return n > 0 ? result : 1.0/result;
    }
    
}
```
