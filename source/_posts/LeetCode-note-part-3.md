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

