---
title: LeetCode note - part 2
toc: true
mathjax: true
date: 2019-04-09 14:15:06
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
                 while(curIndex >= 0 && jumped[curIndex] == 1){
                     curIndex --;
                 }
            }
            
            if(curIndex <0)return false;
        }
        return true;
    }
}
```


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
            if(i != n -i -1 ){//注意，此处和 i != minLength 是两码事，原因在于int计算取证
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

