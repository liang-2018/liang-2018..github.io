---
title: LeetCode note - part 3
toc: true
mathjax: true
date: 2019-04-22 21:03:27
tags: 
- LeetCode
- Algorithm
categories: LeetCode
---

> 刷LeetCode笔记3

<!-- more -->

## [102. Binary Tree Level Order Traversal](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

> Given a binary tree, return the *level order* traversal of its nodes' values. (ie, from left to right, level by level).
>
> For example:
> Given binary tree `[3,9,20,null,null,15,7]`,
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```
>
> 
>
> return its level order traversal as:
>
> ```
> [
>   [3],
>   [9,20],
>   [15,7]
> ]
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
    private List<List<Integer>> result = new ArrayList();
    public List<List<Integer>> levelOrder(TreeNode root) {
        levelOrder(root,0);
        return result;
    }
    public void levelOrder(TreeNode root, int level){
        if(root == null)return ;
        if(level >= result.size()){            
            result.add(new ArrayList<Integer>());
        }
        List<Integer> list = result.get(level);
        list.add(root.val);
        levelOrder(root.left, level + 1);
        levelOrder(root.right, level + 1);
    }
}
```

## [103. Binary Tree Zigzag Level Order Traversal](https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/)

> Given a binary tree, return the *zigzag level order* traversal of its nodes' values. (ie, from left to right, then right to left for the next level and alternate between).
>
> For example:
> Given binary tree `[3,9,20,null,null,15,7]`,
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```
>
> 
>
> return its zigzag level order traversal as:
>
> ```
> [
>   [3],
>   [20,9],
>   [15,7]
> ]
> ```

```java
// 4ms 34.4MB
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
    private List<List<Integer>> result = new ArrayList();
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        if(null == root)return result;
        Stack<TreeNode> stack1 = new Stack();
        Stack<TreeNode> stack2 = new Stack();
        stack2.push(root);
        boolean flag = false;
        while(!(stack1.isEmpty() && stack2.isEmpty())){
            List<Integer> list = new ArrayList();
            if(flag){
                flag = false;
                while(!stack1.isEmpty()){
                    TreeNode tree = stack1.pop();
                    list.add(tree.val);
                    if(tree.right != null){
                        stack2.push(tree.right);
                    }
                    if(tree.left != null){
                        stack2.push(tree.left);
                    }
                }
            }else{
                flag = true;
                while(!stack2.isEmpty()){
                    TreeNode tree = stack2.pop();
                    list.add(tree.val);
                    if(tree.left != null){
                        stack1.push(tree.left);
                    }
                    if(tree.right != null){
                        stack1.push(tree.right);
                    }
                }
            }
            result.add(list);
        }
        return result;
    }
}
```

```java
// 2ms 34.8MB
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
    private List<List<Integer>> result = new ArrayList();
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        zigzagLevelOrder(root, 0);
        return result;
    }
    public void zigzagLevelOrder(TreeNode root, int level){
        if(null == root)return ;
        if(level >= result.size()){
            result.add(new LinkedList());
        }
        LinkedList<Integer> list = (LinkedList<Integer>)result.get(level);
        if(level % 2 == 0){
            list.addLast(root.val);
        }else{
            list.addFirst(root.val);
        }
        zigzagLevelOrder(root.left, level + 1);
        zigzagLevelOrder(root.right, level + 1);
    }
}
```

## [104. Maximum Depth of Binary Tree](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> Given a binary tree, find its maximum depth.
>
> The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.
>
> **Note:** A leaf is a node with no children.
>
> **Example:**
>
> Given binary tree `[3,9,20,null,null,15,7]`,
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```
>
> return its depth = 3.

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
    public int maxDepth(TreeNode root) {
        if(null == root)return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}
```

## [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

> Given preorder and inorder traversal of a tree, construct the binary tree.
>
> **Note:**
> You may assume that duplicates do not exist in the tree.
>
> For example, given
>
> ```
> preorder = [3,9,20,15,7]
> inorder = [9,3,15,20,7]
> ```
>
> Return the following binary tree:
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
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
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        return buildTree(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);
    }

    private TreeNode buildTree(int[] preorder, int ps, int pe, int[] inorder, int is, int ie) {
        if(ps > pe)return null;
        int val = preorder[ps];
        TreeNode root = new TreeNode(val);
        int iroot = is;
        while(iroot < ie && val != inorder[iroot]){
            iroot ++;
        }
        root.left = buildTree(preorder, ps +1, ps + iroot -is, inorder, is, iroot -1);
        root.right = buildTree(preorder, ps + iroot - is + 1, pe, inorder, iroot +1, ie);
        return root;
    }
}
```

## [106. Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

> Given inorder and postorder traversal of a tree, construct the binary tree.
>
> **Note:**
> You may assume that duplicates do not exist in the tree.
>
> For example, given
>
> ```
> inorder = [9,3,15,20,7]
> postorder = [9,15,7,20,3]
> ```
>
> Return the following binary tree:
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```

```java
// 3ms 36.8MB
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
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        return buildTree(inorder, 0, inorder.length-1, postorder, 0, postorder.length -1);
    }
    public TreeNode buildTree(int[] inorder, int is, int ie, int[] postorder, int ps, int pe){
        if(ps > pe){
            return null;
        }
        int val = postorder[pe];
        TreeNode root = new TreeNode(val);
        int iroot = ie;
        while(iroot >= is && inorder[iroot] != val){
            iroot --;
        }
        root.left = buildTree(inorder,is, iroot -1, postorder, ps, ps + iroot - is -1);
        root.right = buildTree(inorder,iroot + 1, ie, postorder,ps + iroot - is , pe - 1);
        return root;
    }
}
```

```java
// 原理一样，不同的表达而已
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
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        if(postorder.length==0) return null;
        return builfTree(postorder,postorder.length-1,inorder,inorder.length-1,inorder.length);
    }
    
   private TreeNode builfTree(int[] postorder,int pe, int[] inorder,int ie,int len){
        
        if(len==1){
            return new TreeNode(postorder[pe]);
        }
        if(len<1){
            return null;
        }
        TreeNode node=new TreeNode(postorder[pe]);
        int midLen=0;
        for(int i=0;i<len;i++){
            if(inorder[ie-i]==postorder[pe]){
                midLen=i;
                break;
            }
        }
        node.right=builfTree(postorder,pe-1,inorder,ie,midLen);
        node.left=builfTree(postorder,pe-midLen-1,inorder,ie-1-midLen,len-midLen-1);
        return node;
    }
}
```

## [107. Binary Tree Level Order Traversal II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/)

Given a binary tree, return the *bottom-up level order* traversal of its nodes' values. (ie, from left to right, level by level from leaf to root).

For example:
Given binary tree `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```



return its bottom-up level order traversal as:

```
[
  [15,7],
  [9,20],
  [3]
]
```

```java
// 2ms 35.8MB
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
    private List<List<Integer>> result = new ArrayList(); 
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        levelOrderBottom(root, 0);
        return result;
    }
    public void levelOrderBottom(TreeNode root, int level){
        if(null == root)return;
        if(level >= result.size()){
            result.add(0, new ArrayList<Integer>());
        }
        List<Integer> list = result.get(result.size() - level - 1);
        list.add(root.val);
        levelOrderBottom(root.left, level +1);
        levelOrderBottom(root.right, level +1);
    }
}
```

## [108. Convert Sorted Array to Binary Search Tree](https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/)

> Given an array where elements are sorted in ascending order, convert it to a height balanced BST.
>
> For this problem, a height-balanced binary tree is defined as a binary tree in which the depth of the two subtrees of *every* node never differ by more than 1.
>
> **Example:**
>
> ```
> Given the sorted array: [-10,-3,0,5,9],
> 
> One possible answer is: [0,-3,9,-10,null,5], which represents the following height balanced BST:
> 
>       0
>      / \
>    -3   9
>    /   /
>  -10  5
> ```

```java
// 逆 中序遍历
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
    public TreeNode sortedArrayToBST(int[] nums) {
        if(0 == nums.length) return null;
        return build(nums, 0, nums.length-1);
    }
    public TreeNode build(int[] nums, int start, int end){
        if(start > end)return null;
        int mid = start + (end - start)/2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = build(nums, start, mid -1);
        root.right = build(nums, mid +1, end);
        return root;
    }
}
```

## [Mark-109. Convert Sorted List to Binary Search Tree](https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/)

> 

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
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
    /** 
     * 考点：快慢指针法、DSF
     */
    public TreeNode sortedListToBST(ListNode head) {
        // 递归截止
        if(head == null || head.next == null){
            return head == null ? null : new TreeNode(head.val);
        }
        ListNode pre = head,mid = head,mid_next = head;
        while(mid_next != null && mid_next.next != null){// 快慢指针法找到中间节点
            pre = mid;
            mid = mid.next;
            mid_next = mid_next.next.next;
        }
        pre.next = null; // 断链
        TreeNode root = new TreeNode(mid.val); // 构造根节点，左右子节点DSF
        root.left = sortedListToBST(head);
        root.right = sortedListToBST(mid.next);
        return root;
    }
}
```

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
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
    public TreeNode sortedListToBST(ListNode head) {
        return buildBST(head, null);
    }

    private TreeNode buildBST(ListNode start, ListNode end) {
        if (start == end) return null;
        ListNode midNode = start, fast = start;
        while (fast != end && fast.next != end) {
            midNode = midNode.next;
            fast = fast.next.next;
        }
        TreeNode root = new TreeNode(midNode.val);
        root.left = buildBST(start, midNode);
        root.right = buildBST(midNode.next, end);
        return root;
    }
}
```

## [110. Balanced Binary Tree](https://leetcode-cn.com/problems/balanced-binary-tree/)

> Given a binary tree, determine if it is height-balanced.
>
> For this problem, a height-balanced binary tree is defined as:
>
> > a binary tree in which the depth of the two subtrees of *every* node never differ by more than 1.
>
> **Example 1:**
>
> Given the following tree `[3,9,20,null,null,15,7]`:
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```
>
> Return true.
>
> **Example 2:**
>
> Given the following tree `[1,2,2,3,3,null,null,4,4]`:
>
> ```
>        1
>       / \
>      2   2
>     / \
>    3   3
>   / \
>  4   4
> ```
>
> Return false.

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
    public boolean isBalanced(TreeNode root) {
        if(root == null)return true;
        if(Math.abs(height(root.left) - height(root.right)) > 1)return false;
        return isBalanced(root.left) && isBalanced(root.right);
    }
    private int height(TreeNode root){
        if(root == null)return 0;
        return Math.max(height(root.left), height(root.right)) + 1;
    }
}
```

## [111. Minimum Depth of Binary Tree](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

> Given a binary tree, find its minimum depth.
>
> The minimum depth is the number of nodes along the shortest path from the root node down to the nearest leaf node.
>
> **Note:** **A leaf is a node with no children.**
>
> **Example:**
>
> Given binary tree `[3,9,20,null,null,15,7]`,
>
> ```
>     3
>    / \
>   9  20
>     /  \
>    15   7
> ```
>
> return its minimum depth = 2.

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
    public int minDepth(TreeNode root) {
        if(root == null)return 0;
        if(root.left == null && root.right == null)return 1;
        if(root.left == null) return minDepth(root.right) + 1;
        if(root.right == null)return minDepth(root.left) + 1;
        return Math.min(minDepth(root.left), minDepth(root.right)) + 1;
    }
}
```

## [112. Path Sum](https://leetcode-cn.com/problems/path-sum/)

> Given a binary tree and a sum, determine if the tree has a root-to-leaf path such that adding up all the values along the path equals the given sum.
>
> **Note:** A leaf is a node with no children.
>
> **Example:**
>
> Given the below binary tree and `sum = 22`,
>
> ```
>       5
>      / \
>     4   8
>    /   / \
>   11  13  4
>  /  \      \
> 7    2      1
> ```
>
> return true, as there exist a root-to-leaf path `5->4->11->2` which sum is 22.

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
    public boolean hasPathSum(TreeNode root, int sum) {
        if(root == null) return false;
        if(root.left == null && root.right == null)return 0 == sum - root.val;
        return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum -root.val);
    }
}
```

## [113. Path Sum II](https://leetcode-cn.com/problems/path-sum-ii/)

> Given a binary tree and a sum, find all root-to-leaf paths where each path's sum equals the given sum.
>
> **Note:** A leaf is a node with no children.
>
> **Example:**
>
> Given the below binary tree and `sum = 22`,
>
> ```
>       5
>      / \
>     4   8
>    /   / \
>   11  13  4
>  /  \    / \
> 7    2  5   1
> ```
>
> Return:
>
> ```
> [
>    [5,4,11,2],
>    [5,8,4,5]
> ]
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
    private List<List<Integer>> result = new ArrayList();
    public List<List<Integer>> pathSum(TreeNode root, int sum) {
       pathSum(root, sum, new ArrayList());
        return result;
    }
    private void pathSum(TreeNode root, int sum, List<Integer> list){
        if(root == null) return ;        
        if(root.left == null && root.right == null ){//到达叶节点
            if(sum - root.val == 0){
                list.add(root.val);
                result.add(new ArrayList(list));
                list.remove(list.size() -1);
            }
            
            return;
        }
        list.add(root.val);
        pathSum(root.left, sum - root.val, list);
        pathSum(root.right, sum - root.val, list);
        list.remove(list.size() -1);
    }
}
```

## [sMark-114. Flatten Binary Tree to Linked List](https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/)

> Given a binary tree, flatten it to a linked list in-place.
>
> For example, given the following tree:
>
> ```
>     1
>    / \
>   2   5
>  / \   \
> 3   4   6
> ```
>
> The flattened tree should look like:
>
> ```
> 1
>  \
>   2
>    \
>     3
>      \
>       4
>        \
>         5
>          \
>           6
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
    public void flatten(TreeNode root) {
        if(null == root)return ;
        flatten(root.left);
        flatten(root.right);
        if(root.left == null && root.right == null)return;
        if(root.left != null && root.right != null){
            TreeNode node = root.left;
            while(node.right != null){
                node = node.right;
            }
            node.right = root.right;
            root.right = root.left;
            root.left = null;
        }else if(root.left != null){
            root.right = root.left;
            root.left = null;
        }        
    }    
}
```

