---
title: LeetCode note - part 2
toc: true
mathjax: true
date: 2018-10-12 14:15:06
top: -1
tags: 
- LeetCode
- Algorithm
categories: LeetCode
---

> 刷LeetCode笔记2

<!-- more -->

## 54. Spiral Matrix

**第一次做的时候，会多加或者漏了最里面的行或者列**  

> Given a matrix of m x n elements (m rows, n columns), return all elements of the matrix in spiral order.
>
> ```
> Example 1:
> 
> Input:
> [
>  [ 1, 2, 3 ],
>  [ 4, 5, 6 ],
>  [ 7, 8, 9 ]
> ]
> Output: [1,2,3,6,9,8,7,4,5]
> ```
> ```
> Example 2:
> 
> Input:
> [
>   [1, 2, 3, 4],
>   [5, 6, 7, 8],
>   [9,10,11,12]
> ]
> Output: [1,2,3,4,8,12,11,10,9,5,6,7]
> ```


```Java
// my ac with great difficulty
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> list = new ArrayList<>();
        int m = matrix.length;
        if(m == 0) return list;
        int n = matrix[0].length;
        if(n == 0 )return list;
        int minLength = Math.min(m,n);
        for(int i = 0; i <= (minLength - 1)/2; i++){
            //往右
            for(int j = i; j <= n - i -1; j++){
                list.add(matrix[i][j]);
            }   
            //往下
            for(int j = i + 1; j <= m - i -1;j++){
                list.add(matrix[j][n - i -1]);
            }
            
            //往左
             if(i != m -i -1){ // 即当i == ( m-1 )/2,当行数为奇数行时，最后一次只有向右，没有向左
                for(int j = n - i -2; j >= i; j--){
                    list.add(matrix[m -i -1][j]);
                }
             }
            //往上
            if(i != n -i -1){// 即当i == ( n-1 )/2,当列数为奇数列时，最后一次只有向下，没有向上
                for(int j = m - i -2; j >= i + 1; j--){
                    list.add(matrix[j][i]);
                }
            }
        }
        return list;
    }
}
```


```Java
 public List<Integer> spiralOrder(int[][] matrix) {
           List<Integer> list=new ArrayList();
           if(matrix.length==0)  return list;
           int startX=0;
           int startY=0;
           int endX=matrix[0].length-1;
           int endY=matrix.length-1;
           while(startX<=endX&&startY<=endY){
               //如果只有一列
               if(startX==endX){
                   for(int i=startY;i<=endY;i++){
                       list.add(matrix[i][endX]);
                   }
                   return list;
               }
               //如果只有一行
               if(startY==endY){
                   for(int i=startX;i<=endX;i++){
                        list.add(matrix[endY][i]);             
                   }
                   return list;
               }
               //遍历StartX->endX
               for(int i=startX;i<endX;i++){
                     list.add(matrix[startY][i]);
               }
               //遍历startY->endY
               for(int i=startY;i<endY;i++){
                     list.add(matrix[i][endX]);
               }
               //遍历endX->startX
               for(int i=endX;i>startX;i--){
                     list.add(matrix[endY][i]);
               }
               //遍历endY->startY
               for(int i=endY;i>startY;i--){
                     list.add(matrix[i][startX]); 
               }
               startX++;
               startY++;
               endX--;
               endY--;
           }
          return list;
    }
}
```

## 55. Jump Game
> Given an array of non-negative integers, you are initially positioned at the first index of the array.
> Each element in the array represents your maximum jump length at that position.
> Determine if you are able to reach the last index.
>
> ```
> Example 1:
> 
> Input: [2,3,1,1,4]
> Output: true
> Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
> ```
> ```
> Example 2:
> 
> Input: [3,2,1,0,4]
> Output: false
> Explanation: You will always arrive at index 3 no matter what. Its maximum
>              jump length is 0, which makes it impossible to reach the last index.
> ```

> 标记跳过的位置，一旦遇到0，返回之前未起跳的位重新跳

```Java
// my ac
class Solution {
    public boolean canJump(int[] nums) {
        if(nums.length > 1 && nums[0] == 0)return false;
        int[]  jumped = new int[nums.length];
        int curIndex = 0;        
        while(curIndex < nums.length){
            int curVal = nums[curIndex];            
            if(curIndex + curVal >= nums.length -1){
                return true;
            }
            jumped[curIndex] = 1;            
            curIndex = curIndex + curVal;     
            if(nums[curIndex] == 0){    
                 while(curIndex >= 0 && jumped[curIndex] == 1){// 跳过已跳过的位置，只从之前未起跳的位置重新开始跳
                     curIndex --;
                 }
            }
            
            if(curIndex <0)return false;
        }
        return true;
    }
}
```

> 逆向思维，可以从 0 起步跳到 最后，也能从最后跳到 0 


```Java
// best ac o(n)算法
/**
 * if jumping from index 0 to the end could achieve,
 * then jumping from the end to index 0 could also achieve.
 */
class Solution {
    public boolean canJump(int[] nums) {
        int index = nums.length - 2,right = nums.length - 1;
        while(index >= 0){
            // 当前 index 加上步数大于 末端位置，说明当前位置是可以从后面往回跳回来
            if(index + nums[index] >= right) right = index;//只有满足条件，才更新right 下标值
            index--;
        }
        return right == 0;//index可能小于0
    }
}
```

## 56. Merge Intervals
> Given a collection of intervals, merge all overlapping intervals.  
> Attention : the order of list is not ensured
>```
> Example 1:
>
> Input: [[1,3],[2,6],[8,10],[15,18]]
> Output: [[1,6],[8,10],[15,18]]
> Explanation: Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].
>```
>```
> Example 2:
>
> Input: [[1,4],[4,5]]
> Output: [[1,5]]
> Explanation: Intervals [1,4] and [4,5] are considered overlapping.
> ```

> 使用自定义集合排序，只要 后一个数组开头小于等于前一个数组结尾，则可以合并

```Java
// my ac 17ms, 使用了自定义集合排序
/*Definition for an interval.*/
public class Interval {
    int start;
    int end;
    Interval() { start = 0; end = 0; }
    Interval(int s, int e) { start = s; end = e; }
 }
class Solution {
    public List<Interval> merge(List<Interval> intervals) {
        List<Interval> list = new ArrayList<>();
        if(0 == intervals.size())return list;
        
        Collections.sort(intervals, new Comparator<Interval>(){
            @Override
            public int compare(Interval o1, Interval o2){
                if(o1.start == o2.start){
                    return o1.end - o2.end;
                }else{
                    return o1.start -o2.start;
                }
            }
        });
        
        Interval first = intervals.get(0);
        list.add(new Interval(first.start, first.end));

        for(int i = 1 ; i < intervals.size(); i ++){
            Interval former = list.get(list.size()-1);
            Interval latter = intervals.get(i);            
            if(former.end >= latter.start){
                former.end = Math.max(former.end, latter.end);
                former.start = Math.min(former.start, latter.start);
            }else {
                list.add(new Interval(latter.start, latter.end));
            }
            
        }
        return list;
    }
}
```

> 从左往右，遍历查找能合并的对象，逐个合并


```Java
// 10ms
/**
 * 两层循环，在O(n*n)遍历过程中合并所有能合并的Interval
 */
class Solution {
    public List<Interval> merge(List<Interval> intervals) {
        List<Interval> list=new ArrayList<Interval>();
        Interval L=new Interval();//一层循环保存对象
        Interval R=new Interval();//二层循环保存对象
        for(int i=0;i<intervals.size();i++){
            L=intervals.get(i);
            int j=i+1;
            for(;j<intervals.size();j++){
                R=intervals.get(j);
                 if(R.start==L.start){
                    intervals.set(j,new Interval(L.start,Math.max(L.end,R.end)));
                    break;
                }else if(L.start<R.start){
                     if(L.end>=R.start){
                        Interval inter=new Interval(L.start,Math.max(L.end,R.end));
                        intervals.set(j,inter);
                        break;
                     }                    
                }else{
                     if(R.end>=L.start){
                        Interval inter=new Interval(R.start,Math.max(L.end,R.end));
                        intervals.set(j,inter);
                        break;
                     }
                }
            }            
            if(j>=intervals.size()){
                list.add(intervals.get(i));
            }
        }
        return list;
    } 
}
```

>  通过数域的性质，只用关心起始和终止点，直接进行拼接即可，较难想到(这理论不一定知道)


```Java
// 11ms, 通过数域的性质，只用关心起始和终止点，直接进行拼接即可，较难想到
class Solution {
    public List<Interval> merge(List<Interval> intervals) {
        List<Interval>  res=new ArrayList<>();
        int len=intervals.size();
        int[] start=new int[len];
        int[] end=new int[len];
        int i=0;
        for(Interval interval:intervals){
            start[i]=interval.start;
            end[i]=interval.end;
            i++;
        }
        Arrays.sort(start);
        Arrays.sort(end);
        int j=0;
        for(i=0,j=0;i<len;i++){
            if(i<len-1 && end[i]<start[i+1]){
                res.add(new Interval(start[j],end[i]));
                j=i+1;
            }else if(i==len-1){
                res.add(new Interval(start[j],end[i]));
            }
        }
        return res;
    }
}
```

## 59. Spiral Matrix II
> Given a positive integer n, generate a square matrix filled with elements from 1 to n2 in spiral order.
>
> Example:
>
> Input: 3
> Output:
> [
>  [ 1, 2, 3 ],
>  [ 8, 9, 4 ],
>  [ 7, 6, 5 ]
> ]

> 按照要求进行，注意拐角点

```Java
class Solution {
    public int[][] generateMatrix(int n) {
        int[][] matrix = new int[n][n];
        int minLength = (n-1)/2;
        int value = 1;
        for(int i = 0; i <= minLength; i++){            
            //right-->
            for(int j = i; j <= n -i -1; j++){
                matrix[i][j] = value;
                value ++;
            }
            //down 
            for(int j = i + 1; j <= n - i -1; j++){
                matrix[j][n -i -1] = value;
                value ++;
            }
            if(i != n -i -1 ){//注意，此处和 i != minLength 是两码事，原因在于int计算取整
                // left <--
                for(int j = n - i -2; j >= i; j--){
                    matrix[n - i -1][j] = value;
                    value ++;
                }
                //up
                for(int j = n -i -2; j > i; j--){
                    matrix[j][i] = value;
                    value ++;
                }                
            }                                    
        }
        return matrix;
    }
}
```


```Java
class Solution {
    public int[][] generateMatrix(int n) {

        int[][] matrix = new int[n][n];
        int end = n - 1;
        int start = 0, i = 0, j = 0; 
        int value = 1;
        while(start <= end){
            //right
            while(j <= end){
                matrix[i][j++] = value++; 
            }
            i++;
            j--;//每次进行完赋值后，对下标进行修正
            
            //down
            while(i <= end){
                matrix[i++][j] = value ++;
            }            
            i--;
            j--;//每次进行完赋值后，对下标进行修正
            
            // left
            while(j >= start){
                matrix[i][j--] = value ++;
            }            
            j++;
            i--;//每次进行完赋值后，对下标进行修正
            
            // up
            while(i > start){
                matrix[i--][j] = value ++;
            }
            j++;
            i++;//每次进行完赋值后，对下标进行修正
            
            start ++;
            end --;
            
        }        
        return matrix;
        
    }
}
```

## [Mark-60. Permutation Sequence](https://leetcode-cn.com/problems/permutation-sequence/)

<span style="color:red;font-size:25px">康托展开Mark</span>

> The set `[1,2,3,...,*n*]` contains a total of *n*! unique permutations.
>
> By listing and labeling all of the permutations in order, we get the following sequence for *n* = 3:
>
> 1. `"123"`
> 2. `"132"`
> 3. `"213"`
> 4. `"231"`
> 5. `"312"`
> 6. `"321"`
>
> Given *n* and *k*, return the *k*th permutation sequence.
>
> **Note:**
>
> - Given *n* will be between 1 and 9 inclusive.
> - Given *k* will be between 1 and *n*! inclusive.
>
> **Example 1:**
>
> ```
> Input: n = 3, k = 3
> Output: "213"
> ```
>
> **Example 2:**
>
> ```
> Input: n = 4, k = 9
> Output: "2314"
> ```

```java
// 需学习康拓展开
class Solution {
    public String getPermutation(int n, int k) {
        int[] FAC={1,1,2,6,24,120,720,5040,40320,362880};
        List<Integer> list=new ArrayList<>();
       StringBuilder sb=new StringBuilder();
       for(int i=1;i<=n;i++){
           list.add(i);
       }
        k=k-1;
        while(n!=0){
            int a=k/FAC[n-1];
            int r=k%FAC[n-1];
            if(a<list.size()){
                sb.append(list.get(a));
                list.remove(a);
            }
            k=r;//余数当被除数
            n--; 
        }       
       return sb.toString(); 
    }
 
}
```

##  [61. Rotate List](https://leetcode-cn.com/problems/rotate-list/)

> Given a linked list, rotate the list to the right by *k* places, where *k* is non-negative.
>
> **Example 1:**
>
> ```
> Input: 1->2->3->4->5->NULL, k = 2
> Output: 4->5->1->2->3->NULL
> Explanation:
> rotate 1 steps to the right: 5->1->2->3->4->NULL
> rotate 2 steps to the right: 4->5->1->2->3->NULL
> ```
>
> **Example 2:**
>
> ```
> Input: 0->1->2->NULL, k = 4
> Output: 2->0->1->NULL
> Explanation:
> rotate 1 steps to the right: 2->0->1->NULL
> rotate 2 steps to the right: 1->2->0->NULL
> rotate 3 steps to the right: 0->1->2->NULL
> rotate 4 steps to the right: 2->0->1->NULL
> ```

```java
// My Ac
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if(null ==head)return head;
        if(head.next == null)return head;
        int listSize = 1;
        ListNode pointer = head;
        while(pointer.next != null){
                pointer = pointer.next;
                listSize++;
        } 
        k = k % listSize;
        
        for(int i = 0; i < k ; i++){
            pointer = head;
            while(pointer.next.next != null){
                pointer = pointer.next;
            }            
            ListNode last = pointer.next;
            pointer.next = null;
            last.next = head;
            head = last;
        }
        return head;
    }
}
```

```java
// best ac
// 将链表先收尾相连成一个环，位移后，再重新拆环
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
public ListNode rotateRight(ListNode head, int k) {
        if(head==null||k==0){
            return head;
        }
        ListNode cursor=head;
        ListNode tail=null;//尾指针
        int length=1;
        while(cursor.next!=null)//循环 得到总长度
        {
            cursor=cursor.next;
            length++;
        }
        int loop=length-(k%length);//得到循环的次数
        tail=cursor;//指向尾结点
        cursor.next=head;//改成循环链表
        cursor=head;//指向头结点
        for(int i=0;i<loop;i++){//开始循环
            cursor=cursor.next;
            tail=tail.next;
        }
        tail.next=null;//改成单链表
        return cursor;//返回当前头
    }
}
```

## [Mark-62. Unique Paths](https://leetcode-cn.com/problems/unique-paths/)

<span style="color:red;font-size:25px">Mark,结果溢出</span>

> A robot is located at the top-left corner of a *m* x *n* grid (marked 'Start' in the diagram below).
>
> The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).
>
> How many possible unique paths are there?
> ![img](LeetCode-note-part-2/robot_maze-1564480945576.png)
> Above is a 7 x 3 grid. How many possible unique paths are there?
> **Note:** *m* and *n* will be at most 100.
>
> **Example 1:**
>
> ```
> Input: m = 3, n = 2
> Output: 3
> Explanation:
> From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
> 1. Right -> Right -> Down
> 2. Right -> Down -> Right
> 3. Down -> Right -> Right
> ```
>
> **Example 2:**
>
> ```
> Input: m = 7, n = 3
> Output: 28
> ```

```java
// 不假思索就想到的方法多半是坑，因为阶乘数据太大，很容易计算结果溢出
class Solution {
    public int uniquePaths(int m, int n) {
        return fac(m + n -2)/(fac(m-1)*fac(n-1));
    }
    public int fac(int n){
        if(n == 0 || n== 1){
            return 1;
        }else{
            return n * fac(n-1);
        }        
    }
}
```

> **分析（1）：**  
>
> 由于机器人智能往右或者往下，所以到达(i,j)的方式只有两种：从（i-1,j）往右和从(i,j-1)往下；从而易得出到达（i,j）的路径总数为dp\[i\]\[j\]=dp\[i-1\]\[j\]+dp\[i\]\[j-1\]
>
> **分析（2）：**   
>
> 由高中数学可知答案就是$C_{m+n-2}^{m-1}​$或者$C_{m+n-2}^{n-1}​$。其中
>
> $$C_m^n=\frac{m!}{n!*(m-n)!}$$(1)
>
> 如果m或者n较小，结果容易得出，但是由于m，n最大可能100，使用阶乘计算的话溢出是必定的。
>
> 同时有性质：
> $C_{m+1}^{n+1}=C_m^n+C_m^{n+1}​$                                 (2)  
> $C_n^0+C_n^1+C_n^2+C_n^3+...+C_n^n=2^n​$       (3)
>
> 通过式（2），很容易想到这题使用动态规划计算。
>
> 假设使用数组dp存储结果，则有：dp\[m\]\[n\]=$C_{m+n-2}^{n-1}=C_{m+n-3}^{n-2}+C_{m+n-3}^{n-1}​$
>
> 结合公式（2）得出：dp\[m\]\[n\]=dp\[m-1\]\[n\]+dp\[m\]\[n-1\]
>
> **注意：**dp\[m-1\]\[n-1\]=$C_{m+n-4}^{n-2}​$

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        for(int i = 0; i < m; i++){
            for(int j = 0; j < n; j++){
                if(i==0 || j==0){
                    dp[i][j] = 1;
                }else{
                    dp[i][j] = dp[i][j-1] + dp[i-1][j]; // dp[i][j]记录着i行j列时的路径数
                }
            }
        }
        return dp[m-1][n-1];
    }
}
```

## [63. Unique Paths II](https://leetcode-cn.com/problems/unique-paths-ii/)

> A robot is located at the top-left corner of a *m* x *n* grid (marked 'Start' in the diagram below).
>
> The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).
>
> Now consider if some obstacles are added to the grids. How many unique paths would there be?

![img](LeetCode-note-part-2/robot_maze.png)

> An obstacle and empty space is marked as `1` and `0` respectively in the grid.
>
> **Note:** *m* and *n* will be at most 100.
>
> **Example 1:**
>
> ```
> Input:
> [
> [0,0,0],
> [0,1,0],
> [0,0,0]
> ]
> Output: 2
> Explanation:
> There is one obstacle in the middle of the 3x3 grid above.
> There are two ways to reach the bottom-right corner:
> 1. Right -> Right -> Down -> Down
> 2. Down -> Down -> Right -> Right
> ```

> 分析：与之前不同，需要判断是否有障碍，有障碍则无法到达该点，即到达该点的路径数为0.

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        if(obstacleGrid[0][0] ==1)return 0;
        if(m==1 || n==1){//这里不额外判断也可以
            for(int i = 0; i < m; i++){
                for(int j = 0; j < n; j++){
                    if(obstacleGrid[i][j] == 1){
                        return 0;
                    }
                }
            }
            return 1;
        }             
        for(int i = 0; i < m; i++){
            for(int j = 0 ; j < n; j++){
                if(i == 0 && j > 0){
                    if(obstacleGrid[i][j] ==0){//Java创建二维数组的代价非常大，能用现成的尽可能别新建
                        obstacleGrid[i][j] = obstacleGrid[i][j-1];
                    }else{
                        obstacleGrid[i][j] = 0;
                    }
                }else if(i > 0  && j ==0){
                     if(obstacleGrid[i][j] ==0){
                        obstacleGrid[i][j] = obstacleGrid[i-1][j];
                    }else{
                        obstacleGrid[i][j] = 0;
                    }
                }else if(i ==0 && j==0){
                    obstacleGrid[i][j] = 1;
                }else{                    
                    if(obstacleGrid[i][j] ==0){
                        obstacleGrid[i][j] = obstacleGrid[i-1][j] + obstacleGrid[i][j-1];
                    }else{
                        obstacleGrid[i][j] = 0;
                    }                                        
                }
            }
        }
        return obstacleGrid[m-1][n-1];
        
    }
}
```

## [64. Minimum Path Sum](https://leetcode-cn.com/problems/minimum-path-sum/)

> Given a *m* x *n* grid filled with non-negative numbers, find a path from top left to bottom right which *minimizes* the sum of all numbers along its path.
>
> **Note:** You can only move either down or right at any point in time.
>
> **Example:**
>
> ```
> Input:
> [
>   [1,3,1],
>   [1,5,1],
>   [4,2,1]
> ]
> Output: 7
> Explanation: Because the path 1→3→1→1→1 minimizes the sum.
> ```

> 分析：这道题，和前面两道题，换汤不换药，一样做。也可以使用递归形式熟悉额，道理都一样

```java
// 循环方式
class Solution {
    public int minPathSum(int[][] grid) {
        //利用dp记录到达某个点的最短长度，因为题目要求只会往右或者往下，不会往回走，只是单向遍历，可以使用动态规划
        int row = grid.length;
        int col = grid[0].length;
        for(int i = 1; i < row; i++){
            grid[i][0] += grid[i-1][0];
        }
         for(int i = 1; i < col; i++){
            grid[0][i] += grid[0][i-1];
        }      
        
        for(int i = 1; i < row; i++){
            for(int j = 1; j < col; j++){
                grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);                
            }
        }
        return grid[row-1][col-1];
    }
}
```

```java
// 递归方式
class Solution {
    private int[][] dp;
    private int core(int[][] m,int row,int col){
        if (row == m.length - 1 && col == m[0].length - 1) return m[row][col];
        if (dp[row][col] != 0) return dp[row][col];
        int result = m[row][col];
        if (row == m.length - 1){
            // 只能右走
            result += core(m,row,col + 1);
        }else if (col == m[0].length - 1){
            // 只能向下走
            result += core(m,row + 1,col);
        }else{
            result += Math.min(core(m,row,col + 1) , core(m,row + 1,col));
        }
        dp[row][col] = result;
        return result;
    }
    
    public int minPathSum(int[][] grid) {
        dp = new int[grid.length][grid[0].length];
        return core(grid,0,0);
    }
}
```

## [71. Simplify Path](https://leetcode-cn.com/problems/simplify-path/)

> Given an **absolute path** for a file (Unix-style), simplify it. Or in other words, convert it to the **canonical path**.
>
> In a UNIX-style file system, a period `.` refers to the current directory. Furthermore, a double period `..` moves the directory up a level. For more information, see: [Absolute path vs relative path in Linux/Unix](https://www.linuxnix.com/abslute-path-vs-relative-path-in-linuxunix/)
>
> Note that the returned canonical path must always begin with a slash `/`, and there must be only a single slash `/` between two directory names. The last directory name (if it exists) **must not** end with a trailing `/`. Also, the canonical path must be the **shortest**string representing the absolute path.
>
>  
>
> **Example 1:**
>
> ```
> Input: "/home/"
> Output: "/home"
> Explanation: Note that there is no trailing slash after the last directory name.
> ```
>
> **Example 2:**
>
> ```
> Input: "/../"
> Output: "/"
> Explanation: Going one level up from the root directory is a no-op, as the root level is the highest level you can go.
> ```
>
> **Example 3:**
>
> ```
> Input: "/home//foo/"
> Output: "/home/foo"
> Explanation: In the canonical path, multiple consecutive slashes are replaced by a single one.
> ```
>
> **Example 4:**
>
> ```
> Input: "/a/./b/../../c/"
> Output: "/c"
> ```
>
> **Example 5:**
>
> ```
> Input: "/a/../../b/../c//.//"
> Output: "/c"
> ```
>
> **Example 6:**
>
> ```
> Input: "/a//b////c/d//././/.."
> Output: "/a/b/c"
> ```

>  一开始想到的比较笨的方式，将字符串转换为数组进行判断
>
> 每个位置有三个可能：/  .  字母
>  / + 字母  ： 追加
>  / + /  : 跳过
>  . + /  : 跳过
>  . + .  : 通过lastIndexOf("/")定位剔除最后一段
>
> 但是死于输入 "/..."，喵的，
>  "..."在linux还真能建立，但是用ll都查看不到，但是确实能通过 cd ... 进入该文件夹
>
> 所以，换种方式：
>
> 通过 split将字符串分割，只需判断是否为空，是否为“.”和".."三种情况，其他的追加上去就好。

```java
class Solution {
    public String simplifyPath(String path) {

        String[]  StrArr = path.split("/");
        StringBuilder sb = new StringBuilder();
        for(String str :StrArr){
            if("".equals(str))continue;
            if(".".equals(str)){
                continue;
            }else if("..".equals(str)){
                int lindex = sb.lastIndexOf("/");
                if(lindex == -1){
                    continue;
                }
                String tmp = sb.toString().substring(0, lindex);
                sb = new StringBuilder(tmp);
            }else{
                sb.append("/" + str);
            }
        }
        if(sb.length()==0){
            sb.append("/");
        }
        return sb.toString();
    }
}
```

```java
// 最短用时 2ms
class Solution {
    public String simplifyPath(String path) {
        int i = path.length() - 1, count = 0;
        StringBuilder builder = new StringBuilder(i);
        while (i > 0) {
            int j = path.lastIndexOf('/', i);// 从i开始向前搜索 "/"
            if (i == j) i--; //说明 i 处 正好是 "/"
            else {
                String x = path.substring(j + 1, i + 1);
                i = j - 1;
                if (".".equals(x)) ;
                else if ("..".equals(x)) count++;
                else if (count > 0) count--;
                else builder.insert(0, "/" + x);
            }
        }
        return builder.length() == 0 ? "/" : builder.toString();
    }
}
```

## [73. Set Matrix Zeroes](https://leetcode-cn.com/problems/set-matrix-zeroes/)

> Given a *m* x *n* matrix, if an element is 0, set its entire row and column to 0. Do it [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm).
>
> **Example 1:**
>
> ```
> Input: 
> [
> [1,1,1],
> [1,0,1],
> [1,1,1]
> ]
> Output: 
> [
> [1,0,1],
> [0,0,0],
> [1,0,1]
> ]
> ```
>
> **Example 2:**
>
> ```
> Input: 
> [
> [0,1,2,0],
> [3,4,5,2],
> [1,3,1,5]
> ]
> Output: 
> [
> [0,0,0,0],
> [0,4,5,0],
> [0,3,1,0]
> ]
> ```
>
> **Follow up:**
>
> - A straight forward solution using O(*m**n*) space is probably a bad idea.
> - A simple improvement uses O(*m* + *n*) space, but still not the best solution.
> - Could you devise a constant space solution?

> 使用标记法，标记需要重置为 0 的行和列

```java
// O(m+n) space 2ms
class Solution {
    public void setZeroes(int[][] matrix) {
        int row = matrix.length;
        int col = matrix[0].length;
        int[] rowZero = new int[row]; 
        int[] colZero = new int[col];
        for(int i = 0; i < row; i++){
            for(int j = 0; j < col; j++){
                if(matrix[i][j] == 0){
                    rowZero[i] = 1;
                    colZero[j] = 1;                          
                }
            }         
        }
        for(int i = 0; i < row; i++){
            if(rowZero[i] == 1){
                setRowZero(matrix, i);
            }            
        }
        for(int j = 0; j < col; j++){
            if(colZero[j] == 1){
                setColZero(matrix, j);
            } 
        }
        
    }
    public void setRowZero(int[][] matrix, int row){        
        int col = matrix[0].length;
        for(int i = 0; i < col; i++){
            matrix[row][i] = 0;
        }
    }
     public void setColZero(int[][] matrix, int col){
        int row = matrix.length;
         for(int i = 0; i < row; i++){
            matrix[i][col] = 0;
        }
    }
}
```

```java
// 少于 O(m+n)额外空间的，将首行和首列用来存储对应行列是否存在0
class Solution {
    public void setZeroes(int[][] matrix) {
   	//如果首行或首列有元素为0，在最后将行或列置为0
    	boolean rowFlag = false;
        //判断首行
        for (int i = 0; i < matrix[0].length; i++) {
            if (matrix[0][i] == 0) {
            	rowFlag=true;
                break;
            }
        }

        //判断首列
        boolean colFlag = false;
        for (int i = 0; i < matrix.length; i++) {
            if (matrix[i][0] == 0) {
            	matrix[0][0]=0;
                break;
            }
        }

        //把对应的首行首列置为0，从[1][1]开始遍历
        for (int i = 1; i < matrix.length; i++) {
            for (int j = 1; j < matrix[0].length; j++) {
                if (matrix[i][j] == 0){
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }

        //行置0
        for (int i = 1; i < matrix[0].length; i++) {
            if (matrix[0][i] == 0) {
                for (int j = 0; j < matrix.length; j++) {
                    matrix[j][i] = 0;
                }
            }
        }
        //列置0
        for (int i = 1; i < matrix.length; i++) {
            if (matrix[i][0] == 0) {
                for (int j = 0; j < matrix[0].length; j++) {
                    matrix[i][j] = 0;
                }
            }
        }
        //如果首列中有0，将首列置为0
        if (matrix[0][0]==0){
            for (int i = 0; i < matrix.length; i++) {
                matrix[i][0] = 0;
            }
        }
        //如果首行有0，将首行置为0
        if (rowFlag){
            for (int i = 0; i < matrix[0].length; i++) {
                matrix[0][i] = 0;
            }
        }
    }    
}
```

## [74. Search a 2D Matrix](https://leetcode-cn.com/problems/search-a-2d-matrix/)

> Write an efficient algorithm that searches for a value in an *m* x *n* matrix. This matrix has the following properties:
>
> - Integers in each row are sorted from left to right.
> - The first integer of each row is greater than the last integer of the previous row.
>
> **Example 1:**
>
> ```
> Input:
> matrix = [
> [1,   3,  5,  7],
> [10, 11, 16, 20],
> [23, 30, 34, 50]
> ]
> target = 3
> Output: true
> ```
>
> **Example 2:**
>
> ```
> Input:
> matrix = [
> [1,   3,  5,  7],
> [10, 11, 16, 20],
> [23, 30, 34, 50]
> ]
> target = 13
> Output: false
> ```

> The first integer of each row is greater than the last integer of the previous row.
> 这个条件可以考虑，将二维转成一维数组进行二分排序

```java
// 日常判断  传入的值可能为 null 或者 长度为0
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if(null == matrix)return false;
        int row = matrix.length;
        if(0 == row)return false;
        int col = matrix[0].length;
        if(0 == col)return false;
        for(int i = 0; i < row; i++){
            if (matrix[i][col-1] == target || matrix[i][0] == target) {
                return true;
            } else if(matrix[i][col-1] > target){
                return rowFind(matrix[i], target);
            }
        }
        return false;
    }
// 行查找使用二分查找，对于更长的矩阵，具有更高的效率
    public boolean rowFind(int[] row, int target){
        int left = 0;
        int right = row.length - 1;
        int mid = -1;
        while (left <= right) {
            mid = (right + left) / 2;
            if (row[mid] == target) {
                return true;
            } else if (row[mid] > target) {
                right = mid - 1;
            } else if (row[mid] < target) {
                left = mid + 1;
            }
        }
        return false;
    }
}
```



## [75. Sort Colors](https://leetcode-cn.com/problems/sort-colors/)

Given an array with *n* objects colored red, white or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white and blue.

Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.

**Note:** You are not suppose to use the library's sort function for this problem.

**Example:**

```
Input: [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
```

**Follow up:**

- A rather straight forward solution is a two-pass algorithm using counting sort.
  First, iterate the array counting number of 0's, 1's, and 2's, then overwrite array with total number of 0's, then 1's and followed by 2's.
- Could you come up with a one-pass algorithm using only constant space?

```java
// 遍历，把红的往前放，蓝的往后放，每次交换两处索引的值就可以了。
class Solution {
    public void sortColors(int[] nums) {
        //遍历，把红的往前放，把蓝的往后放
        int left = 0;
        int right = nums.length -1;
        int index = 0;
        while(left < right && index <=right){
            if(left < index && nums[index] == 0){
                swap(nums, left, index);
                left ++;
            }else if(nums[index] == 2){
                swap(nums, right, index);
                right --;
            }else{
                index ++;
            }
        }
        
    }
    public void swap(int[] nums, int index1, int index2){
        int tmp = nums[index1];
        nums[index1] = nums[index2];
        nums[index2] = tmp;
    }
}
```

## [77. Combinations](https://leetcode-cn.com/problems/combinations/)

Given two integers *n* and *k*, return all possible combinations of *k* numbers out of 1 ... *n*.

**Example:**

```
Input: n = 4, k = 2
Output:
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

```java
// 最先想到的办法，回溯
class Solution {
    private List<List<Integer>> list = new ArrayList();
    public List<List<Integer>> combine(int n, int k) {
        combine(n, k, new ArrayList<Integer>());
       return list;
    }
    
    public void combine(int n, int k, List<Integer> combine){
		if(k == 0){
            list.add(new ArrayList(combine));
            return;
        }
        if(n < 1)return;            
        for(int i = n; i > 0 && i >= k; i--){ 
            // 注意，添加 i >= k 可以节约很多时间，避免大量无用功，差不多是5ms和57ms的区别              
            combine.add(i);
            combine(i-1, k-1, combine);
            combine.remove((Object)i); // 建议使用 combine.remove(combine.size()-1);移除速度更快
        }
    }
}
```

```java
// 原理差不多，一个从大到小组合，一个从小到大组合
class Solution {
    private int max;

	private int num;

	private List<List<Integer>> res;

	public List<List<Integer>> combine(int n, int k)
	{
		max = n;
		num = k;
		res = new ArrayList<>();

		if (k == 0) {
			return res;
		}

		getCombine(1, new ArrayList<>());

		return res;
	}

	private void getCombine(int index, List<Integer> form)
	{
		if (form.size() == num) {
			res.add(new ArrayList<>(form));

			return;
		}
		// 剪枝，[i, n]区间至少需要有k - form.size()个元素，否则跳过
		int range = max - num + form.size() + 1;

		for (int i = index; i <= range; i++) {
			form.add(i);
			getCombine(i + 1, form);
			form.remove(form.size() - 1);
		}
	}
}
```

## [78. Subsets](https://leetcode-cn.com/problems/subsets/)

> Given a set of **distinct** integers, *nums*, return all possible subsets (the power set).
>
> **Note:** The solution set must not contain duplicate subsets.
>
> **Example:**
>
> ```
> Input: nums = [1,2,3]
> Output:
> [
> [3],
> [1],
> [2],
> [1,2,3],
> [1,3],
> [2,3],
> [1,2],
> []
> ]
> ```

> 回溯，选 或者 不选
> <https://leetcode-cn.com/problems/subsets/solution/hui-su-suan-fa-by-powcai-5/>

```java
class Solution {
    private List<List<Integer>> res = null;
    public List<List<Integer>> subsets(int[] nums) {
        res = new ArrayList<>();
        ArrayList <Integer> temp = new ArrayList<>();
        sub(nums,temp, 0);
        return res;
    }
    public void sub(int[] nums, List temp, int index) {
        if(index == nums.length) {
            res.add(new ArrayList(temp));
            return;
        }
        temp.add(nums[index]);
        sub(nums, temp, index + 1);
        temp.remove(temp.size() - 1);// 这里尽可能使用 索引位置移除，更快
        sub(nums, temp, index + 1);
    }
}
```

```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<Integer>());
        for(int n:nums){
            int size = result.size();
            for(int i=0;i<size;i++){
                List<Integer> temp = new ArrayList<Integer>(result.get(i));
                temp.add(n);
                result.add(temp);
            }
        }
        return result;
    }
}
```

## [79. Word Search](https://leetcode-cn.com/problems/word-search/)

> Given a 2D board and a word, find if the word exists in the grid.
>
> The word can be constructed from letters of sequentially adjacent cell, where "adjacent" cells are those horizontally or vertically neighboring. The same letter cell may not be used more than once.
>
> **Example:**
>
> ```
> board =
> [
>   ['A','B','C','E'],
>   ['S','F','C','S'],
>   ['A','D','E','E']
> ]
> 
> Given word = "ABCCED", return true.
> Given word = "SEE", return true.
> Given word = "ABCB", return false.
> ```

```java
// 10 ms 38.7MB
class Solution {
    private char[][] board = null;
    private int[][] mark = null;
    private String word = null;
    public boolean exist(char[][] board, String word) {
        // 通过遍历定位首字母位置，然后再逐步递归调用比较旁边位置，  将起始坐标都保存
        // 同时还需要标记 相应位置 是否已经使用过（由于可能多个方向可能相同，需要使用到回溯）
        this.board = board;
        this.word = word;
        int row = board.length;
        int col = board[0].length;
        mark = new int[row][col];
        List<int[]> starts = find(word.charAt(0));
        for(int[] point : starts){
            mark[point[0]][point[1]] = 1;
            if(exist(point[0], point[1], 0)){
                return true;
            }
            mark[point[0]][point[1]] = 0;
        }
        return false;
        
    }
    private boolean exist(int curRow, int curCol, int curIndex){
        if(word.charAt(curIndex) == board[curRow][curCol] && curIndex == word.length() -1){
            return true;
        }
        if( word.charAt(curIndex) == board[curRow][curCol]){
            //判断四个方向是否可行
            // 上
            if(curRow - 1 >= 0 && mark[curRow-1][curCol] ==0){
                mark[curRow -1][curCol] = 1;
                boolean exist = exist(curRow -1, curCol, curIndex + 1);
                mark[curRow -1][curCol] = 0;
                if(exist)return exist;
            }
            // 下
            if(curRow + 1 < board.length && mark[curRow+1][curCol] ==0){
                mark[curRow + 1][curCol] = 1;
                boolean exist = exist(curRow + 1, curCol, curIndex + 1);
                mark[curRow + 1][curCol] = 0;
                if(exist)return exist;
            }
            // 左
            if(curCol -1 >= 0 && mark[curRow][curCol -1] == 0){
                mark[curRow][curCol - 1] = 1;
                boolean exist = exist(curRow, curCol -1, curIndex + 1);
                mark[curRow][curCol - 1] = 0;
                if(exist)return exist;
            }
            // 右
            if(curCol + 1 < board[0].length && mark[curRow][curCol + 1] == 0){
                mark[curRow][curCol + 1] = 1;
                boolean exist = exist(curRow, curCol + 1, curIndex + 1);
                mark[curRow][curCol + 1] = 0;
                if(exist)return exist;
            }            
        }else{
            return false;
        }        
        return false;
    }
    // 查找首字母的位置
    private List<int[]> find(char head){
        List<int[]> list = new ArrayList();
        for(int i = 0; i < board.length; i++){
            for(int j = 0; j < board[0].length; j++){
                if(board[i][j] == head){
                    list.add(new int[]{i, j});
                }
            }
        }
        return list;
    }
}
```

```java
// 将上面的逻辑统一简化处理  14ms 43.9MB
class Solution {
    private char[][] board = null;
    private int[][] mark = null;
    private String word = null;
    public boolean exist(char[][] board, String word) {
        // 通过遍历定位首字母位置，然后再逐步递归调用比较旁边位置，  将起始坐标都保存
        // 同时还需要标记 相应位置 是否已经使用过（由于可能多个方向可能相同，需要使用到回溯）
        this.board = board;
        this.word = word;
        int row = board.length;
        int col = board[0].length;
        mark = new int[row][col];
        for(int i = 0; i < board.length; i++){
            for(int j = 0; j < board[0].length; j++){
                if(board[i][j] == word.charAt(0)){
                   if(exist(i, j, 0))return true;
                }
            }
        }
        return false;  
    }
    private boolean exist(int curRow, int curCol, int curIndex){
        if( curIndex == word.length()){
            return true;
        }
        if(curRow < 0 || curRow == board.length || curCol < 0 || curCol == board[0].length || mark[curRow][curCol] == 1){
            return false;
        }
        if( word.charAt(curIndex) == board[curRow][curCol]){
            //判断四个方向是否可行
            mark[curRow][curCol] = 1; // 位置，回溯标记
            if(exist(curRow - 1, curCol, curIndex + 1) 
              || exist(curRow + 1, curCol, curIndex + 1)
              || exist(curRow, curCol -1, curIndex + 1)
              || exist(curRow, curCol + 1, curIndex + 1)){
                return true;
            }  
            mark[curRow][curCol] = 0;
        }    
        return false;
    }
}
```

```java
// 由于是比较值是相同，所以可以通过临时改变值使不相同来做标记，节省内存  8ms  39.6MB
class Solution {
    private char[][] board = null;
    private String word = null;
    public boolean exist(char[][] board, String word) {
        // 通过遍历定位首字母位置，然后再逐步递归调用比较旁边位置
        // 同时还需要标记 相应位置 是否已经使用过（由于可能多个方向可能相同，需要使用到回溯）
        this.board = board;
        this.word = word;
        int row = board.length;
        int col = board[0].length;
        for(int i = 0; i < board.length; i++){
            for(int j = 0; j < board[0].length; j++){
                if(board[i][j] == word.charAt(0)){
                   if(exist(i, j, 0))return true;
                }
            }
        }
        return false;
        
    }
    private boolean exist(int curRow, int curCol, int curIndex){
        if( curIndex == word.length()){
            return true;
        }
        if(curRow < 0 || curRow == board.length || curCol < 0 || curCol == board[0].length){
            return false;
        }
        if( word.charAt(curIndex) == board[curRow][curCol]){
            //判断四个方向是否可行
            board[curRow][curCol] ^= 256; // 使用位运算，加快计算速度，同时计算后不是字母，相当于标记了已遍历
            if(exist(curRow - 1, curCol, curIndex + 1) 
              || exist(curRow + 1, curCol, curIndex + 1)
              || exist(curRow, curCol -1, curIndex + 1)
              || exist(curRow, curCol + 1, curIndex + 1)){
                return true;
            }  
            board[curRow][curCol] ^= 256; // 二次异或，回复原值
        }    
        return false;
    }
}
```

## [80. Remove Duplicates from Sorted Array II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array-ii/)

> Given a sorted array *nums*, remove the duplicates [**in-place**](https://en.wikipedia.org/wiki/In-place_algorithm) such that duplicates appeared at most *twice* and return the new length.
>
> Do not allocate extra space for another array, you must do this by **modifying the input array in-place** with O(1) extra memory.
>
> **Example 1:**
>
> ```
> Given nums = [1,1,1,2,2,3],
> 
> Your function should return length = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.
> 
> It doesn't matter what you leave beyond the returned length.
> ```
>
> **Example 2:**
>
> ```
> Given nums = [0,0,1,1,1,1,2,3,3],
> 
> Your function should return length = 7, with the first seven elements of nums being modified to 0, 0, 1, 1, 2, 3 and 3 respectively.
> 
> It doesn't matter what values are set beyond the returned length.
> ```
>
> **Clarification:**
>
> Confused why the returned value is an integer but your answer is an array?
>
> Note that the input array is passed in by **reference**, which means modification to the input array will be known to the caller as well.
>
> Internally you can think of this:
>
> ```java
> // nums is passed in by reference. (i.e., without making a copy)
> int len = removeDuplicates(nums);
> 
> // any modification to nums in your function would be known by the caller.
> // using the length returned by your function, it prints the first len elements.
> for (int i = 0; i < len; i++) {
>     print(nums[i]);
> }
> ```

```java
// 理解容易，写起来绕
class Solution {
    public int removeDuplicates(int[] nums) {
        if( 0 == nums.length)return 0;
        int newLength = 0;
        int count = 0;
        int preVal = nums[0];
        for(int i = 1; i < nums.length; i++){
            if(preVal == nums[i]) {                
                count ++;                  
            }else{                
                count = 0;                
            }
            preVal = nums[i];
            if(count < 2){//在这里控制重复的个数是多少
                 newLength++;;
            }
            if(i > newLength){//如果没有超过3个的重复数，则没必要交换
                swap(nums, i, newLength);
            }             
        }
        return newLength + 1;//长度是最后索引+1
    }
    private void swap(int[] nums, int index1, int index2){
        int tmp = nums[index1];
        nums[index1] = nums[index2];
        nums[index2] = tmp;
    }
}
```

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int flag = 0;
        if (nums == null || nums.length <= 0){
            return flag;
        }
        for (int i = 0;i < nums.length;i++){
            if (flag < 2 || nums[i] > nums[flag - 2]){
                //flag 指向有效值赋值后一位置，（即newLength）,因而flag-2指向上一个值
               	// 可以通过修改 flag 减少 num 来控制多少个重复
                nums[flag++] = nums[i];
            }
        }
        return flag;
    }
}
```

## [Mark-81. Search in Rotated Sorted Array II](https://leetcode-cn.com/problems/search-in-rotated-sorted-array-ii/)

> Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.
>
> (i.e., `[0,0,1,2,2,5,6]` might become `[2,5,6,0,0,1,2]`).
>
> You are given a target value to search. If found in the array return `true`, otherwise return `false`.
>
> **Example 1:**
>
> ```
> Input: nums = [2,5,6,0,0,1,2], target = 0
> Output: true
> ```
>
> **Example 2:**
>
> ```
> Input: nums = [2,5,6,0,0,1,2], target = 3
> Output: false
> ```
>
> **Follow up:**
>
> - This is a follow up problem to [Search in Rotated Sorted Array](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/description/), where `nums` may contain duplicates.
> - Would this affect the run-time complexity? How and why?

```java
class Solution {
    public boolean search(int[] nums, int target) {
        if(nums.length == 0)return false;
        return find(nums, 0, nums.length - 1, target);
    }
    public boolean find(int[] nums, int left, int right, int target){
        if(left > right)return false;
        if(nums[left] == target || nums[right] == target){
            return true;
        }
        if(left == right )return false;
        int mid = left + (right - left) / 2;
        if(nums[mid] == target)return true;
        if(nums[left] < nums[mid]){
           if(nums[left] <=target && target <= nums[mid]){
               return find(nums, left, mid -1, target);
           }else{
               return find(nums, mid+1, right, target);
           }
        }else if(nums[right] > nums[mid]){
            if(nums[mid] <= target && target <= nums[right]){
                return find(nums, mid +1, right, target);
            }else{
                return find(nums, left, mid -1, target);
            }
        }else{
            if(nums[mid] == nums[left]){
                return find(nums, left +1, right, target);
            }else{
                return find(nums, left, right -1, target);
            }
        }
    }
}
```

> 每次先遍历去除重复值位置，问题就简化了

```java
class Solution {
    public boolean search(int[] nums, int target) {
       int l = 0, r = nums.length-1;
        while(l<=r){
            //处理重复数字
            while(l<r&&nums[l]==nums[l+1]) ++l;
            while(l<r&&nums[r]==nums[r-1]) --r;
            int mid = l+(r-l)/2;
            if(nums[mid]==target) return true;
            //左半部分有序
            if(nums[mid]>=nums[l]){
                if(target<nums[mid]&&target>=nums[l]) r = mid-1;//target落在左半边
                else l = mid+1;
            }else{//右半部分有序
                if(target>nums[mid]&&target<=nums[r]) l = mid+1;//target落在右半边
                else r = mid-1;
            }
        }
        return false;
    }
}
```

## [Mark-82. Remove Duplicates from Sorted List II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/)

> Given a sorted linked list, delete all nodes that have duplicate numbers, leaving only *distinct*numbers from the original list.
>
> **Example 1:**
>
> ```
> Input: 1->2->3->3->4->4->5
> Output: 1->2->5
> ```
>
> **Example 2:**
>
> ```
> Input: 1->1->1->2->3
> Output: 2->3
> ```

```java
// 先虚拟一个前节点，用于获取指针
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(null == head || null == head.next)return head;  
        ListNode dHead = new ListNode(0);
        dHead.next = head;
        ListNode pointer = head;
        ListNode prePoint = dHead;

        while(pointer!= null && pointer.next != null){
           if(pointer.val == pointer.next.val){
               while(null != pointer.next && pointer.val == pointer.next.val){
                   pointer.next = pointer.next.next;
               }
               prePoint.next = pointer.next;
               pointer = pointer.next;
           }else{
               prePoint = prePoint.next;
               pointer = pointer.next;
           }   
            
        }

        return dHead.next;
    }
}
// 递归调用
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if(null == head || null == head.next)return head;  
        if(head.val == head.next.val){
            while(null != head.next && head.val == head.next.val){
                head.next = head.next.next;
            }
            head = head.next;
            return deleteDuplicates(head);
        }else{
            head.next = deleteDuplicates(head.next);
            return head;
        }
    }
}
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;
        while( null != cur){
            if(cur.next != null && cur.val == cur.next.val){
                while(null != cur.next && cur.val == cur.next.val){
                    cur.next = cur.next.next;                
                }
                cur = cur.next;
                if(prev == null){
                    head = cur;
                }else{
                    prev.next = cur;// 修改节点的next，否则还是指向重复的
                }
            }else{
                prev = cur;
                cur = cur.next;
            }
        }
        return head;
    }
}
```

## [86. Partition List](https://leetcode-cn.com/problems/partition-list/)

<center>Mark</center>

> Given a linked list and a value *x*, partition it such that all nodes less than *x* come before nodes greater than or equal to *x*.
>
> You should preserve the original relative order of the nodes in each of the two partitions.
>
> **Example:**
>
> ```
> Input: head = 1->4->3->2->5->2, x = 3
> Output: 1->2->2->4->3->5
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
    public ListNode partition(ListNode head, int x) {
        // 建立两个虚拟头部来链接值
        ListNode less_head = new ListNode(0);//用来链接比x更小的值
        ListNode more_head = new ListNode(0);//用来链接比x更大或相等的值
 
        ListNode less_cur = less_head;// 插入点
        ListNode more_cur = more_head;//插入点
        
        while(head != null){
            if(head.val < x){
                less_cur.next = head;
                less_cur = less_cur.next;
            }
            else{
                more_cur.next = head;
                more_cur = more_cur.next;
            }
            head = head.next;
        }
        
        less_cur.next = more_head.next;
        more_cur.next = null;
        return less_head.next;
    }
}
```

## [89. Gray Code](https://leetcode-cn.com/problems/gray-code/)

> The gray code is a binary numeral system where two successive values differ in only one bit.
>
> Given a non-negative integer *n* representing the total number of bits in the code, print the sequence of gray code. A gray code sequence must begin with 0.
>
> **Example 1:**
>
> ```
> Input: 2
> Output: [0,1,3,2]
> Explanation:
> 00 - 0
> 01 - 1
> 11 - 3
> 10 - 2
> 
> For a given n, a gray code sequence may not be uniquely defined.
> For example, [0,2,3,1] is also a valid gray code sequence.
> 
> 00 - 0
> 10 - 2
> 11 - 3
> 01 - 1
> ```
>
> **Example 2:**
>
> ```
> Input: 0
> Output: [0]
> Explanation: We define the gray code sequence to begin with 0.
>              A gray code sequence of n has size = 2n, which for n = 0 the size is 20 = 1.
>              Therefore, for n = 0 the gray code sequence is [0].
> ```

> 这道题如果了解格雷码构成的原理就很简单了

```java
class Solution {
    public List<Integer> grayCode(int n) {
        if(n == 0){
            List<Integer> list = new ArrayList();
            list.add(0);
            return list; 
        }       
        List<Integer> list = new ArrayList();
        List preList = grayCode(n - 1);
        for(Object val : preList){
            list.add((int)val);
        }
        int addVal = 1 <<(n-1);
        for(int i = preList.size() - 1; i>=0; i--){            
            list.add((int)preList.get(i) + addVal);
        }
        return list;
    }
}
```

## [90. Subsets II](https://leetcode-cn.com/problems/subsets-ii/)

> Given a collection of integers that might contain duplicates, **nums**, return all possible subsets (the power set).
>
> **Note:** The solution set must not contain duplicate subsets.
>
> **Example:**
>
> ```
> Input: [1,2,2]
> Output:
> [
> [2],
> [1],
> [1,2,2],
> [2,2],
> [1,2],
> []
> ]
> ```

> 子集类，基本就在于取和不取，此题关键点在于规避重复值

```java
class Solution {
    private List<List<Integer>> result = new ArrayList<>();
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        
        result.add(new ArrayList<Integer>());
        Arrays.sort(nums);
        for(int i = 1; i <= nums.length; i ++){
            genSub(nums, 0, i, new ArrayList(i));
        }
        return result;
    }
    private void genSub(int[] nums, int sIndex, int len, List<Integer> sub){
        if(len == sub.size()){
            result.add(new ArrayList(sub));            
            return;
        }

        for(int i = sIndex; i + len - sub.size() <= nums.length; i++){
             // 判断条件很重要  i + len - sub.size() <= nums.length
            sub.add(nums[i]);
            genSub(nums, i + 1, len , sub);
            sub.remove(sub.size() -1);
            while(i < nums.length -1 && nums[i] == nums[i+1]){
                i++ ;
            }                       
        }                
    }
}
```

```java
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> res = new ArrayList<List<Integer>>();
        List<Integer> tmp = new ArrayList<Integer>();
        Arrays.sort(nums);
        helper(nums,res,tmp,0);
        return res;
        
    }
    
    public void helper(int[] nums, List<List<Integer>> res, List<Integer> tmp, int start){
        res.add(new ArrayList<Integer>(tmp));
        for (int i = start; i < nums.length; i++){
            if (i > start && nums[i] == nums[i-1]) continue;
            tmp.add(nums[i]);
            helper(nums,res,tmp,i+1);
            tmp.remove(tmp.size()-1);
        }
    }
}
```

## [91. Decode Ways](https://leetcode-cn.com/problems/decode-ways/)

> A message containing letters from `A-Z` is being encoded to numbers using the following mapping:
>
> ```
> 'A' -> 1
> 'B' -> 2
> ...
> 'Z' -> 26
> ```
>
> Given a **non-empty** string containing only digits, determine the total number of ways to decode it.
>
> **Example 1:**
>
> ```
> Input: "12"
> Output: 2
> Explanation: It could be decoded as "AB" (1 2) or "L" (12).
> ```
>
> **Example 2:**
>
> ```
> Input: "226"
> Output: 3
> Explanation: It could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).
> ```

> 组合相关基本使用  动态规划、回溯、分治等

```java
class Solution {
    public int numDecodings(String s) {
        char[] ss=s.toCharArray();
        int n=ss.length;
        if(n==0) {//没有数字的情况
        	return 0;
        }
        int[] dp=new int[n+1];//dp[i]表示前i个数字的组合数
        dp[0]=1;//为了后面的好计算
        for(int i=1;i<=n;i++) {
        	int t=ss[i-1]-'0';
        	if(t>=1&&t<=9) {//最后一个数字
        		dp[i]+=dp[i-1];
        	}
        	if(i>=2) {//最后两个组合成数字
        		t=(ss[i-2]-'0')*10+(ss[i-1]-'0');
        		if(t>=10&&t<=26) {
        			dp[i]+=dp[i-2];
        		}
        	}
        }
        return dp[n];
    }
}
```

```python
class Solution:
    # 原型还是斐波那契的思路，第i的个数由i-1和i-2的个数决定
    def numDecodings(self, s: str) -> int:
        # '0'开头的全部违规
        if s[0] == '0':
            return 0
        # '0'结尾的，前一位比2大也全部违规，受测试用例'230'的启发
        # 其实下面的循环也实现了，但就是想早点剔除违规的哈哈哈
        if s[-1] == '0' and s[-2] > '2':
            return 0
        # 这有点斐波那契的意思，因为第i位在不违规的情况下，
        # 要么自己成一位，要么和前一位组成两位的字母，所以可就是f(i) = f(i-1) + f(i-2)
        a = 1 # 第i-1位的组合个数
        b = 1 # 第i-2位的组合个数
        for i in range(1, len(s)):
            # 连续两个0肯定违规
            if s[i-1] == '0' and s[i] == '0':
                return 0
            # 小于26就有可能i和i+1配对变斐波那契
            elif s[i-1]+s[i] <= '26':
                # i为0，就只能f(i) = f(i-2),和前一个合体，不能自己单独
                if s[i] == '0':
                    a, b = b, a
                # 如果前一个为0，而自己为不为0，f(i) = f(i-1)
                elif s[i-1] == '0':
                    a = b
                # 一切正常，f(i) = f(i-1) + f(i-2)
                else:
                    a, b = b, a+b
            # 删除任何30，40，50这种出现在尾部，中部的违规组合
            elif s[i] == '0':
                return 0
            else:
                a = b
        
        return b
            
```

## [92. Reverse Linked List II](https://leetcode-cn.com/problems/reverse-linked-list-ii/)

> Reverse a linked list from position *m* to *n*. **Do it in one-pass.**
>
> **Note:** 1 ≤ *m* ≤ *n* ≤ length of list.
>
> **Example:**
>
> ```
> Input: 1->2->3->4->5->NULL, m = 2, n = 4
> Output: 1->4->3->2->5->NULL
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
    public ListNode reverseBetween(ListNode head, int m, int n) {
        if(m == n || head == null || head.next == null)return head;
        ListNode prev = null;
        ListNode cur = head;
        ListNode part1Start = head;
        ListNode part1End = null, part2Start = null, part2End = null, part3Start = null;
        for(int i = 1; cur != null; i++){
            if(i == m ){
                part1End = prev;
                part2End = cur;
            }
            if(i == n){
                part2Start = cur;
                part3Start = cur.next;
            }
            if( i >= m && i <= n){
                ListNode next = cur.next;
                cur.next = prev;
                prev = cur;            
                cur = next;
            }else{
                prev = cur;
                cur = cur.next;
            }            
        }
        if(m == 1){
            head = part2Start;
            part2End.next = part3Start;
        }else{
            part1End.next = part2Start;
            part2End.next = part3Start;
        }
        return head;           
    }
}
```

## [93. Restore IP Addresses](https://leetcode-cn.com/problems/restore-ip-addresses/)

> Given a string containing only digits, restore it by returning all possible valid IP address combinations.
>
> **Example:**
>
> ```
> Input: "25525511135"
> Output: ["255.255.11.135", "255.255.111.35"]
> ```

```java
// 4ms 37.4MB
class Solution {
    private List<String> result = new ArrayList();
    public List<String> restoreIpAddresses(String s) {
        restore(s, "", 4);
        return result;
    }
    private void restore(String s, String sb, int len){
        if(len == 0 && s.length() == 0){
            result.add(sb.substring(0, sb.length() -1));
            return;
        }
        if(s.length() > len * 3 || len == 0 || s.length() < 1){
            return;
        }
        
        restore(s.substring(1), sb + s.substring(0,1) +".", len -1);  
        if(s.length() >= 2 ){
            int val = Integer.parseInt(s.substring(0, 2));
            if(val > 9){
                restore(s.substring(2), sb + s.substring(0,2) +".", len -1);     
            }                
        }  
        if(s.length() >= 3){
            int val = Integer.parseInt(s.substring(0, 3));
            if( val > 99 && val < 256){
                 restore(s.substring(3), sb + s.substring(0,3) +".", len -1);    
            }
        }                            
        
    }
}
// 也可以用 StringBuilder  4ms  34.7MB
class Solution {
    private List<String> result = new ArrayList();
    public List<String> restoreIpAddresses(String s) {
        restore(s, new StringBuilder(), 4);
        return result;
    }
    private void restore(String s, StringBuilder sb, int len){
        if(len == 0 && s.length() == 0){
            result.add(sb.toString().substring(0, sb.length() -1));
            return;
        }
        if(s.length() > len * 3 || len == 0 || s.length() < 1){
            return;
        }
        sb.append(s.substring(0,1)).append(".");
        restore(s.substring(1), sb, len -1); 
        sb.delete(sb.length()-2, sb.length());
        if(s.length() >= 2 ){
            int val = Integer.parseInt(s.substring(0, 2));
            if(val > 9){
                sb.append(s.substring(0,2)).append(".");
                restore(s.substring(2), sb, len -1);   
                sb.delete(sb.length()-3, sb.length());
            }                
        }  
        if(s.length() >= 3){
            int val = Integer.parseInt(s.substring(0, 3));
            if( val > 99 && val < 256){
                sb.append(s.substring(0,3)).append(".");
                 restore(s.substring(3), sb, len -1);   
                 sb.delete(sb.length()-4, sb.length());
            }
        }                            
        
    }
}
```

```java
// 2ms 37.2MB
class Solution {
    public List<String> restoreIpAddresses(String s) {
        int[] splits = new int[5];                        //分割的每一段的开始位置，从1开始
        List<String> ips = new ArrayList<>(); 
        restoreIpAddresses(0,splits,s,ips);
        return ips;
    }
    //通过寻找原IP地址的四个分段的起始位置来确定新的IP地址
    private void restoreIpAddresses(int level,int[] s,String ip,List<String> ips){        
        if(level == 4 && s[4] != ip.length()){   //生成的ip地址的长度不和原ip地址长度相同则退出
            return;
        }
        
        if(level == 4 && s[4] == ip.length()){
           String r = ip.substring(s[0],s[1])+"."+ip.substring(s[1],s[2])+"."+ip.substring(s[2],s[3])+"."+ip.substring(s[3]);
           ips.add(r);
        }
        
        
        int num = 0;
        for(int i = s[level];i<ip.length();i++){
            num = num*10+ip.charAt(i)-'0';
            if((num == 0 && i==s[level]) || (num>0 && num<=255)){  //越界检查，当num为0时，i必须与该段的开始位置相等
                s[level+1]=i+1;
                restoreIpAddresses(level+1,s,ip,ips);
                if(num == 0 && i==s[level])   //如果是0，则0后面不能有其他数字
                    break;
                continue;
            }
            break;
        }
    }
    
}
```

## [94. Binary Tree Inorder Traversal](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

> Given a binary tree, return the *inorder* traversal of its nodes' values.
>
> **Example:**
>
> ```
> Input: [1,null,2,3]
>    1
>     \
>      2
>     /
>    3
> 
> Output: [1,3,2]
> ```
>
> **Follow up:** Recursive solution is trivial, could you do it iteratively?

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
    private List<Integer> result = new ArrayList();
    public List<Integer> inorderTraversal(TreeNode root) {
        if(root == null)return result;
        if(root.left == null && root.right == null){
            result.add(root.val);
            return result;
        }
        if(root.left != null){
            inorderTraversal(root.left);
        }
        result.add(root.val);
        if(root.right != null){
            inorderTraversal(root.right);
        }
        return result;
    }
}
```

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
    private List<Integer> result = new ArrayList();
    public List<Integer> inorderTraversal(TreeNode root) {
        if(root == null)return result;
        TreeNode curRoot = root;
        Stack<TreeNode> stack = new Stack<TreeNode>();
        while(curRoot != null || !stack.isEmpty()){
            while(curRoot != null){
                stack.push(curRoot);
                curRoot = curRoot.left;
            }
            curRoot = stack.pop();
            result.add(curRoot.val);           
            curRoot = curRoot.right;            
        }
        return result;
    }
}
```

## [95. Unique Binary Search Trees II](https://leetcode-cn.com/problems/unique-binary-search-trees-ii/)

> Given an integer *n*, generate all structurally unique **BST's** (binary search trees) that store values 1 ... *n*.
>
> **Example:**
>
> ```
> Input: 3
> Output:
> [
>   [1,null,3,2],
>   [3,2,null,1],
>   [3,1,null,null,2],
>   [2,1,3],
>   [1,null,2,null,3]
> ]
> Explanation:
> The above output corresponds to the 5 unique BST's shown below:
> 
>    1         3     3      2      1
>     \       /     /      / \      \
>      3     2     1      1   3      2
>     /     /       \                 \
>    2     1         2                 3
> ```

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
    
    public List<TreeNode> generateTrees(int n) {
        if (n == 0)
            return new ArrayList();
        return generate(1, n);
    }
    private List<TreeNode> generate(int start, int end) {
        List<TreeNode> res = new ArrayList<>();
        if (start > end) {
            res.add(null);
            return res;
        }
        if (start == end) {
            res.add(new TreeNode(start)); 
            return res;
        }
        for (int i = start; i <= end; i++) {
            List<TreeNode> leftSubTrees = generate(start, i-1);
            List<TreeNode> rightSubTrees = generate(i+1, end);
            for (TreeNode left : leftSubTrees) {
                for(TreeNode right : rightSubTrees) {
                    TreeNode node = new TreeNode(i);
                    node.left = left;
                    node.right = right;
                    res.add(node);
                }
            }
        }
        return res;
    }
}
```

## [96. Unique Binary Search Trees](https://leetcode-cn.com/problems/unique-binary-search-trees/)

> Given *n*, how many structurally unique **BST's** (binary search trees) that store values 1 ... *n*?
>
> **Example:**
>
> ```
> Input: 3
> Output: 5
> Explanation:
> Given n = 3, there are a total of 5 unique BST's:
> 
>    1         3     3      2      1
>     \       /     /      / \      \
>      3     2     1      1   3      2
>     /     /       \                 \
>    2     1         2                 3
> ```

```java
class Solution {
    public int numTrees(int n) {
        int[] dp = new int[n+1];
        dp[0] = 1;
        dp[1] = 1;
        for(int i = 2; i <= n; i ++){
            for(int j = 0; j < i; j++){
                dp[i] += dp[j]* dp[i - j -1];
            }
        }
        return dp[n];
    }
}
```

## [98. Validate Binary Search Tree](https://leetcode-cn.com/problems/validate-binary-search-tree/)

> Given a binary tree, determine if it is a valid binary search tree (BST).
>
> Assume a BST is defined as follows:
>
> - The left subtree of a node contains only nodes with keys **less than** the node's key.
> - The right subtree of a node contains only nodes with keys **greater than** the node's key.
> - Both the left and right subtrees must also be binary search trees.
>
> **Example 1:**
>
> ```
> Input:
>     2
>    / \
>   1   3
> Output: true
> ```
>
> **Example 2:**
>
> ```
>     5
>    / \
>   1   4
>      / \
>     3   6
> Output: false
> Explanation: The input is: [5,1,4,null,null,3,6]. The root node's value
>              is 5 but its right child's value is 4.
> ```

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
    // 注意：Double.MIN_VALUE 不是最小负数，而是最小非负数
    double preVal = -Double.MAX_VALUE;
    public boolean isValidBST(TreeNode root) {
        //不仅要保证 左节点<根节点<右节点，同时左节点的所有节点都得小于根节点；右节点同理
        if(root == null)return true;
        if(isValidBST(root.left)){
            if(preVal < root.val){
                preVal = root.val;
                return isValidBST(root.right);
            }
        }
        return false;
    }
}
```

## [100. Same Tree](https://leetcode-cn.com/problems/same-tree/)

> Given two binary trees, write a function to check if they are the same or not.
>
> Two binary trees are considered the same if they are structurally identical and the nodes have the same value.
>
> **Example 1:**
>
> ```
> Input:     1         1
>           / \       / \
>          2   3     2   3
> 
>         [1,2,3],   [1,2,3]
> 
> Output: true
> ```
>
> **Example 2:**
>
> ```
> Input:     1         1
>           /           \
>          2             2
> 
>         [1,2],     [1,null,2]
> 
> Output: false
> ```
>
> **Example 3:**
>
> ```
> Input:     1         1
>           / \       / \
>          2   1     1   2
> 
>         [1,2,1],   [1,1,2]
> 
> Output: false
> ```

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
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if(p == null && q==null)return true;
        if(p == null | q == null)return false;
        if(p.val != q.val)return false;
        return isSameTree(p.left, q.left)&& isSameTree(p.right, q.right);
    }
}
```

## [101. Symmetric Tree](https://leetcode-cn.com/problems/symmetric-tree/)

> Given a binary tree, check whether it is a mirror of itself (ie, symmetric around its center).
>
> For example, this binary tree `[1,2,2,3,4,4,3]` is symmetric:
>
> ```
>     1
>    / \
>   2   2
>  / \ / \
> 3  4 4  3
> ```
>
> 
>
> But the following `[1,2,2,null,3,null,3]` is not:
>
> ```
>     1
>    / \
>   2   2
>    \   \
>    3    3
> ```
>
> 
>
> **Note:**
> Bonus points if you could solve it both recursively and iteratively.

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
    public boolean isSymmetric(TreeNode root) {
        if(root ==  null)return true;
        return isSymmetric(root.left, root.right);
    }
    public boolean isSymmetric(TreeNode left, TreeNode right){
        if(left == null && right == null)return true;
        if(left == null || right == null)return false;
        if(left.val == right.val){
            return isSymmetric(left.left, right.right) && isSymmetric(left.right, right.left);
        }
        return false;
    }
}
```

