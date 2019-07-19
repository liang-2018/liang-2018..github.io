---
title: LeetCode note - part 3
toc: true
mathjax: true
date: 2018-10-22 21:03:27
top: -1
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

## [116. Populating Next Right Pointers in Each Node](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node/)

> You are given a **perfect binary tree** where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:
>
> ```
> struct Node {
>   int val;
>   Node *left;
>   Node *right;
>   Node *next;
> }
> ```
>
> Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.
>
> Initially, all next pointers are set to `NULL`.
>
>  
>
> **Example:**
>
> ![img](https://assets.leetcode.com/uploads/2019/02/14/116_sample.png)
>
> ```
> Input: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":null,"right":null,"val":4},"next":null,"right":{"$id":"4","left":null,"next":null,"right":null,"val":5},"val":2},"next":null,"right":{"$id":"5","left":{"$id":"6","left":null,"next":null,"right":null,"val":6},"next":null,"right":{"$id":"7","left":null,"next":null,"right":null,"val":7},"val":3},"val":1}
> 
> Output: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":{"$id":"4","left":null,"next":{"$id":"5","left":null,"next":{"$id":"6","left":null,"next":null,"right":null,"val":7},"right":null,"val":6},"right":null,"val":5},"right":null,"val":4},"next":{"$id":"7","left":{"$ref":"5"},"next":null,"right":{"$ref":"6"},"val":3},"right":{"$ref":"4"},"val":2},"next":null,"right":{"$ref":"7"},"val":1}
> 
> Explanation: Given the above perfect binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B.
> ```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node left;
    public Node right;
    public Node next;

    public Node() {}

    public Node(int _val,Node _left,Node _right,Node _next) {
        val = _val;
        left = _left;
        right = _right;
        next = _next;
    }
};
*/
class Solution {
    public Node connect(Node root) {
        if(null == root)return null;
        Node cur = root;

        while(cur != null && cur.left != null){
            cur.left.next = cur.right;
            if(cur.next != null){
                cur.right.next = cur.next.left;
            }
            cur = cur.next;
        }
        connect(root.left);
        return root;
    }
}
// 用循环和用递归，只要脑子转得过来，看实际情况，怎么方便怎么来，没必要刻意
class Solution {
    public Node connect(Node root) {
        if(null == root)return null;
        Node cur = root, pre = root;
        while(pre.left != null){
            cur = pre;
            while(cur != null){
                cur.left.next = cur.right;
                if(cur.next != null){
                    cur.right.next = cur.next.left;
                }
                cur = cur.next;
            }
            pre = pre.left;
        }
        return root;
    }
}
```

## [Mark-117. Populating Next Right Pointers in Each Node II](https://leetcode-cn.com/problems/populating-next-right-pointers-in-each-node-ii/)

> Given a binary tree
>
> ```
> struct Node {
>   int val;
>   Node *left;
>   Node *right;
>   Node *next;
> }
> ```
>
> Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to `NULL`.
>
> Initially, all next pointers are set to `NULL`.
>
>  
>
> **Example:**
>
> ![img](https://assets.leetcode.com/uploads/2019/02/15/117_sample.png)
>
> ```
> Input: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":null,"right":null,"val":4},"next":null,"right":{"$id":"4","left":null,"next":null,"right":null,"val":5},"val":2},"next":null,"right":{"$id":"5","left":null,"next":null,"right":{"$id":"6","left":null,"next":null,"right":null,"val":7},"val":3},"val":1}
> 
> Output: {"$id":"1","left":{"$id":"2","left":{"$id":"3","left":null,"next":{"$id":"4","left":null,"next":{"$id":"5","left":null,"next":null,"right":null,"val":7},"right":null,"val":5},"right":null,"val":4},"next":{"$id":"6","left":null,"next":null,"right":{"$ref":"5"},"val":3},"right":{"$ref":"4"},"val":2},"next":null,"right":{"$ref":"6"},"val":1}
> 
> Explanation: Given the above binary tree (Figure A), your function should populate each next pointer to point to its next right node, just like in Figure B.
> ```

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node left;
    public Node right;
    public Node next;

    public Node() {}

    public Node(int _val,Node _left,Node _right,Node _next) {
        val = _val;
        left = _left;
        right = _right;
        next = _next;
    }
};
*/
class Solution {
    public Node connect(Node root) {
        if (root == null) {
            return null;
        }
        // 借助队列实现层次遍历
        LinkedList<Node> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            while (size-- > 0) {
                Node node = queue.remove();
                if (size > 0) {
                    node.next = queue.peek();
                }
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
        }
        return root;
    }
}
// 先确保 root.right 下的节点的已完全连接，因 root.left 下的节点的连接
// 需要 root.left.next 下的节点的信息，若 root.right 下的节点未完全连
// 接（即先对 root.left 递归），则 root.left.next 下的信息链不完整，将
// 返回错误的信息。可能出现的错误情况如下图所示。此时，底层最左边节点将无
// 法获得正确的 next 信息：
//                  o root
//                 / \
//     root.left  o —— o  root.right
//               /    / \
//              o —— o   o
//             /        / \
//            o        o   o

class Solution {
    public Node connect(Node root) {
        if (root == null) return null;
        if (root.left == null && root.right == null) return root;
        //查找next节点可以考虑抽成额外方法
        // 需要先right后left的原因在于寻找next
        Node childNext = root.next;
        while (childNext != null) {
            if (childNext.left != null) {
                childNext = childNext.left;
                break;
            }
            if (childNext.right != null) {
                childNext = childNext.right;
                break;
            }
            childNext = childNext.next;
        }
        if (root.left != null && root.right != null) {
            root.left.next = root.right;
            root.right.next = childNext;
            connect(root.right);
            connect(root.left);
        } else if (root.left != null) {
            root.left.next = childNext;
            connect(root.left);
        } else {
            root.right.next = childNext;
            connect(root.right);
        }
        return root;
    }
}
```

## [118. Pascal's Triangle](https://leetcode-cn.com/problems/pascals-triangle/)

> Given a non-negative integer *numRows*, generate the first *numRows* of Pascal's triangle.
>
> ![img](https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif)
> In Pascal's triangle, each number is the sum of the two numbers directly above it.
>
> **Example:**
>
> ```
> Input: 5
> Output:
> [
>      [1],
>     [1,1],
>    [1,2,1],
>   [1,3,3,1],
>  [1,4,6,4,1]
> ]
> ```

```java
class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> result = new ArrayList();
        for(int i = 0; i < numRows; i++){
            List<Integer> list = new ArrayList();
            for(int j = 0; j <= i; j++){
                if(j == i || j == 0){
                    list.add(1);
                }else{
                    List<Integer> preRow = result.get(i -1);
                    int val = preRow.get(j -1) + preRow.get(j);
                    list.add(val);
                }
            }
            result.add(list);
        }
        return result;
    }
}
```

## [119. Pascal's Triangle II](https://leetcode-cn.com/problems/pascals-triangle-ii/)

> Given a non-negative index *k* where *k* ≤ 33, return the *k*th index row of the Pascal's triangle.
>
> Note that the row index starts from 0.
>
> ![img](https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif)
> In Pascal's triangle, each number is the sum of the two numbers directly above it.
>
> **Example:**
>
> ```
> Input: 3
> Output: [1,3,3,1]
> ```
>
> **Follow up:**
>
> Could you optimize your algorithm to use only *O*(*k*) extra space?

```java
// 最笨的方法
class Solution {
    public List<Integer> getRow(int rowIndex) {
        List<Integer> preRow = null;
        for(int i = 0; i <= rowIndex; i ++){
            List<Integer> tmp = new ArrayList();
            for(int j = 0; j < i + 1; j ++){
                if(j == 0 || j == i){
                    tmp.add(1);
                }else{
                    int val = preRow.get(j-1) + preRow.get(j);
                    tmp.add(val);
                }
            }
            preRow = tmp;
        }
        return preRow;
    }
}
```

```java
// 通过数学规律将对应位置数值的表达式计算出来
class Solution {
    public List<Integer> getRow(int rowIndex) {
        List<Integer> result = new ArrayList();
        long val = 1; // 后面数据太大，用int存不下
        for(int i = 0; i <= rowIndex; i ++){
            result.add((int)val);
            val = val * (rowIndex - i) / (i + 1);
        }
        return result;
    }
}
```

## [sMark-120. Triangle](https://leetcode-cn.com/problems/triangle/)

> Given a triangle, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.
>
> For example, given the following triangle
>
> ```
> [
>      [2],
>     [3,4],
>    [6,5,7],
>   [4,1,8,3]
> ]
> ```
>
> The minimum path sum from top to bottom is `11` (i.e., **2** + **3** + **5** + **1** = 11).
>
> **Note:**
>
> Bonus point if you are able to do this using only *O*(*n*) extra space, where *n* is the total number of rows in the triangle.

> 这道题C++做起来更轻松些，Java的基础类型传值不传引用，这种情况下指针大法好(直接修改原数据)。

```java
class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
       if (triangle == null || triangle.size() == 0){
            return 0;
        }
        int[] rms = new int[triangle.size() + 1];
        for(int i = triangle.size(); i > 0; i --){
            List<Integer> curRow = triangle.get(i - 1);
            for(int j = 0; j < curRow.size(); j++){
                rms[j] = Math.min(rms[j], rms[j+1]) + curRow.get(j);
            }
        }
        return rms[0];
    }
}
```

```java
// 自下而上不用额外寻找最小值
public int minimumTotal(List<List<Integer>> triangle) {
        if (triangle == null || triangle.size() == 0){
            return 0;
        }
        // 加1可以不用初始化最后一层
        int[][] dp = new int[triangle.size()+1][triangle.size()+1];

        for (int i = triangle.size()-1; i>=0; i--){
            List<Integer> curTr = triangle.get(i);
            for(int j = 0 ; j< curTr.size(); j++){
                dp[i][j] = Math.min(dp[i+1][j], dp[i+1][j+1]) + curTr.get(j);
            }
        }
        return dp[0][0];
    }
}
```

## [121. Best Time to Buy and Sell Stock](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

> Say you have an array for which the *i*th element is the price of a given stock on day *i*.
>
> If you were only permitted to complete at most one transaction (i.e., buy one and sell one share of the stock), design an algorithm to find the maximum profit.
>
> Note that you cannot sell a stock before you buy one.
>
> **Example 1:**
>
> ```
> Input: [7,1,5,3,6,4]
> Output: 5
> Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
>              Not 7-1 = 6, as selling price needs to be larger than buying price.
> ```
>
> **Example 2:**
>
> ```
> Input: [7,6,4,3,1]
> Output: 0
> Explanation: In this case, no transaction is done, i.e. max profit = 0.
> ```

```java
class Solution {
    public int maxProfit(int[] prices) {
        int min = Integer.MAX_VALUE;
        int profit = 0;
        for(int i = 0; i < prices.length; i ++){
            if(prices[i] < min && i != prices.length){
                min = prices[i];
                continue;
            } 
            profit = profit > prices[i] - min ? profit : prices[i] - min;
        }
        return profit;
    }
}
```

## [122. Best Time to Buy and Sell Stock II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

> Say you have an array for which the *i*th element is the price of a given stock on day *i*.
>
> Design an algorithm to find the maximum profit. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times).
>
> **Note:** You may not engage in multiple transactions at the same time (i.e., you must sell the stock before you buy again).
>
> **Example 1:**
>
> ```
> Input: [7,1,5,3,6,4]
> Output: 7
> Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
>              Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
> ```
>
> **Example 2:**
>
> ```
> Input: [1,2,3,4,5]
> Output: 4
> Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
>              Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are
>              engaging multiple transactions at the same time. You must sell before buying again.
> ```
>
> **Example 3:**
>
> ```
> Input: [7,6,4,3,1]
> Output: 0
> Explanation: In this case, no transaction is done, i.e. max profit = 0.
> ```

```java
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        for(int i = 0; i < prices.length - 1; i ++){         
            if(prices[i+1] > prices[i]){
                profit += prices[i+1] - prices[i]; // 把式子连起来就清楚了，会把部分中间项抵消
            }
        }                
        return profit;
    }
}
```

## [Hard-123. Best Time to Buy and Sell Stock III](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/)

> Say you have an array for which the *i*th element is the price of a given stock on day *i*.
>
> Design an algorithm to find the maximum profit. You may complete at most *two* transactions.
>
> **Note:** You may not engage in multiple transactions at the same time (i.e., you must sell the stock before you buy again).
>
> **Example 1:**
>
> ```
> Input: [3,3,5,0,0,3,1,4]
> Output: 6
> Explanation: Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
>              Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.
> ```
>
> **Example 2:**
>
> ```
> Input: [1,2,3,4,5]
> Output: 4
> Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
>              Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are
>              engaging multiple transactions at the same time. You must sell before buying again.
> ```
>
> **Example 3:**
>
> ```
> Input: [7,6,4,3,1]
> Output: 0
> Explanation: In this case, no transaction is done, i.e. max profit = 0.
> ```

```java
class Solution {
    public int maxProfit(int[] prices) {
       int fstBuy = Integer.MIN_VALUE, fstSell = 0;
        int secBuy = Integer.MIN_VALUE, secSell = 0;
        for(int p : prices) {
            fstBuy = Math.max(fstBuy, -p);
            fstSell = Math.max(fstSell, fstBuy + p);
            secBuy = Math.max(secBuy, fstSell - p);
            secSell = Math.max(secSell, secBuy + p); 
        }
        return secSell;
    }
}
```

```java
https://blog.csdn.net/qq_41855420/article/details/87867155
```

## [125. Valid Palindrome](https://leetcode-cn.com/problems/valid-palindrome/)

> Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.
>
> **Note:** For the purpose of this problem, we define empty string as valid palindrome.
>
> **Example 1:**
>
> ```
> Input: "A man, a plan, a canal: Panama"
> Output: true
> ```
>
> **Example 2:**
>
> ```
> Input: "race a car"
> Output: false
> ```

```java
class Solution {
    static int[] map = new int[256];
    static{ 
            for(int i =0 ; i < 10 ; i++){
                map[ i + '0'] = i + 1;
            }
            for(int i =0 ; i < 26 ; i++){
                map[ i + 'a'] = map[ i + 'A'] = i + 11;
            }
        }    
    public boolean isPalindrome(String s) {
        char[] arrays = s.toCharArray();
        int start = 0;
        int end = arrays.length - 1;
        int startChar, endChar; //注意 int转换为char会报错，因为值范围不同，会出现数据损失
        while(start < end){
            startChar = map[arrays[start]];
            endChar = map[arrays[end]];
            if( startChar !=0 && endChar !=0){
                if(startChar != endChar){
                    return false;
                }
                start++;
                end--;
            }else
            {
                if( startChar ==0 )
                    start++;
                if( endChar ==0)
                    end--;
            }
        }
        return true;
    }
    
}
```

## [Mark-127. Word Ladder](https://leetcode-cn.com/problems/word-ladder/)

Given two words (*beginWord* and *endWord*), and a dictionary's word list, find the length of shortest transformation sequence from *beginWord* to *endWord*, such that:

1. Only one letter can be changed at a time.
2. Each transformed word must exist in the word list. Note that *beginWord* is *not* a transformed word.

**Note:**

- Return 0 if there is no such transformation sequence.
- All words have the same length.
- All words contain only lowercase alphabetic characters.
- You may assume no duplicates in the word list.
- You may assume *beginWord* and *endWord* are non-empty and are not the same.

**Example 1:**

```
Input:
beginWord = "hit",
endWord = "cog",
wordList = ["hot","dot","dog","lot","log","cog"]

Output: 5

Explanation: As one shortest transformation is "hit" -> "hot" -> "dot" -> "dog" -> "cog",
return its length 5.
```

**Example 2:**

```
Input:
beginWord = "hit"
endWord = "cog"
wordList = ["hot","dot","dog","lot","log"]

Output: 0

Explanation: The endWord "cog" is not in wordList, therefore no possible transformation.
```

> https://www.cnblogs.com/grandyang/p/4539768.html

```java
// 计算每多一步，计算量是指数级增长，如果从两端逼近，能有效减少计算量（分成了两份，但指数减小了）
class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        if (wordList == null || wordList.size() == 0) return 0;
        HashSet<String> start = new HashSet<>();
        HashSet<String> end = new HashSet<>();
        HashSet<String> dic = new HashSet<>(wordList);
        start.add(beginWord);
        end.add(endWord);
        if (!dic.contains(endWord)) return 0;
        return bfs(start, end, dic, 2);

    }

    public int bfs(HashSet<String> st, HashSet<String> ed, HashSet<String> dic, int l) {
        if (st.size() == 0) return 0;
        if (st.size() > ed.size()) {
            return bfs(ed, st, dic, l);// 通过两端向中间靠拢，所以需要交换
        }
        dic.removeAll(st);
        HashSet<String> next = new HashSet<>();
        for (String s : st) {
            char[] arr = s.toCharArray();
            for (int i = 0; i < arr.length; i++) {
                char tmp = arr[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (tmp == c) continue;
                    arr[i] = c;
                    String nstr = new String(arr);
                    if (dic.contains(nstr)) {
                        if (ed.contains(nstr)) return l;//st到ed存在可以改变一个字母完成改变的，说明转换队列完成
                        else next.add(nstr);
                    }
                }
                arr[i] = tmp;
            }
        }
        return bfs(next, ed, dic, l + 1);
    }

}
```

```java
// 187ms 69.9 MB
class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        if (wordList == null || wordList.size() == 0) return 0;
        Queue<String> queue = new LinkedList<>();// 用于存储新生成的且之前没出现过的string
        Map<String, Integer> map = new HashMap<>();//用于保存转换到该词需要多少步
        map.put(beginWord, 1);
        HashSet<String> dic = new HashSet<>(wordList);
        queue.add(beginWord);
        if (!dic.contains(endWord)) return 0;
        while( !queue.isEmpty() ){
            String str = queue.poll();
            char[] arr = str.toCharArray();
            for(int i = 0; i < arr.length; i++){
                char tmp = arr[i];
                for(char c = 'a'; c <= 'z'; c ++){
                    arr[i] = c;
                    String newWord = new String(arr);
                    if(dic.contains(newWord) && newWord.equals(endWord)){
                        return map.get(str) + 1;
                    }
                    if(dic.contains(newWord) && !map.containsKey(newWord)){
                        queue.add(newWord);
                        map.put(newWord, map.get(str) + 1);
                    }
                }//for 'a' ~ 'z'
                arr[i] = tmp;
            }//for
        }// while        
        return 0;
    }
}
```

## [129. Sum Root to Leaf Numbers](https://leetcode-cn.com/problems/sum-root-to-leaf-numbers/)

> Given a binary tree containing digits from `0-9` only, each root-to-leaf path could represent a number.
>
> An example is the root-to-leaf path `1->2->3` which represents the number `123`.
>
> Find the total sum of all root-to-leaf numbers.
>
> **Note:** A leaf is a node with no children.
>
> **Example:**
>
> ```
> Input: [1,2,3]
>     1
>    / \
>   2   3
> Output: 25
> Explanation:
> The root-to-leaf path 1->2 represents the number 12.
> The root-to-leaf path 1->3 represents the number 13.
> Therefore, sum = 12 + 13 = 25.
> ```
>
> **Example 2:**
>
> ```
> Input: [4,9,0,5,1]
>     4
>    / \
>   9   0
>  / \
> 5   1
> Output: 1026
> Explanation:
> The root-to-leaf path 4->9->5 represents the number 495.
> The root-to-leaf path 4->9->1 represents the number 491.
> The root-to-leaf path 4->0 represents the number 40.
> Therefore, sum = 495 + 491 + 40 = 1026.
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
    private int sum = 0;
    public int sumNumbers(TreeNode root) {
        sumNumbers(root, 0);
        return sum;
    }
    private void sumNumbers(TreeNode root, int preVal){
        if(root == null)return ;
        preVal = 10 * preVal + root.val;
        if(root.left == null && root.right == null){
            sum += preVal;
        }
        if(root.left != null){
            sumNumbers(root.left, preVal);
        }
        if(root.right != null){
            sumNumbers(root.right, preVal);
        }
    }
}
```

## [sMark-130. Surrounded Regions](https://leetcode-cn.com/problems/surrounded-regions/)

> Given a 2D board containing `'X'` and `'O'` (**the letter O**), capture all regions surrounded by `'X'`.
>
> A region is captured by flipping all `'O'`s into `'X'`s in that surrounded region.
>
> **Example:**
>
> ```
> X X X X
> X O O X
> X X O X
> X O X X
> ```
>
> After running your function, the board should be:
>
> ```
> X X X X
> X X X X
> X X X X
> X O X X
> ```
>
> **Explanation:**
>
> Surrounded regions shouldn’t be on the border, which means that any `'O'` on the border of the board are not flipped to `'X'`. Any `'O'` that is not on the border and it is not connected to an `'O'` on the border will be flipped to `'X'`. Two cells are connected if they are adjacent cells connected horizontally or vertically.

> 对矩阵边界上所有的O做深度优先搜索，将相连的O更改为-，然后编辑数组，将数组中O更改为X，将数组中-更改为O。只有外层为‘O’才会继续往内遍历。

```java
class Solution {
    int row,col;
    public void solve(char[][] board) {
        if(board==null||board.length==0)
            return ;
        row=board.length;
        col=board[0].length;
        for(int i=0;i<row;i++){
                dfs(board,i,0);
                dfs(board,i,col-1);
        }
        for(int j=0;j<col;j++){
                dfs(board,0,j);
                dfs(board,row-1,j);
        }
        for(int i=0;i<row;i++){
            for(int j=0;j<col;j++){
                if(board[i][j]=='O')
                    board[i][j]='X';
                if(board[i][j]=='-')
                    board[i][j]='O';
            }
        }
        return ;
    }
    public void dfs(char[][] board,int i,int j){
        if(i<0||j<0||i>=row||j>=col||board[i][j]!='O')
            return;
        board[i][j]='-';
            dfs(board,i-1,j);
            dfs(board,i+1,j);
            dfs(board,i,j-1);
            dfs(board,i,j+1);
        return ;
    }
}
```

## [method-131. Palindrome Partitioning](https://leetcode-cn.com/problems/palindrome-partitioning/)

> Given a string *s*, partition *s* such that every substring of the partition is a palindrome.
>
> Return all possible palindrome partitioning of *s*.
>
> **Example:**
>
> ```
> Input: "aab"
> Output:
> [
>   ["aa","b"],
>   ["a","a","b"]
> ]
> ```

> https://www.cnblogs.com/grandyang/p/4270008.html

```java
class Solution {
    List<List<String>> result = new ArrayList<>();
    List<String> list = new ArrayList<>();
    char[] arr;
    String s;
    
    void core(int index){
        // 从index开始分割
        if (index == arr.length){
            result.add(new ArrayList<>(list));
            return;
        }
        for (int i = index; i < arr.length; i++){
            if (isPalindrome(index,i)){
                list.add(s.substring(index,i + 1));
                core(i + 1);
                list.remove(list.size() - 1);
            }
        }
    }
    
    boolean isPalindrome(int left,int right){// 减少substring次数，直接使用索引
        int L = left,R = right;
        while (L <= R){
            if (arr[L++] != arr[R--]){
                return false;
            }
        }
        return true;
    }
    
    public List<List<String>> partition(String s) {
        arr = s.toCharArray(); // 可以有效节约空间和时间
        this.s = s;
        core(0);
        return result;
    }
}
```

## [map-133. Clone Graph](https://leetcode-cn.com/problems/clone-graph/)

> Given a reference of a node in a **connected** undirected graph, return a [**deep copy**](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) (clone) of the graph. Each node in the graph contains a val (`int`) and a list (`List[Node]`) of its neighbors.
>
>  
>
> **Example:**
>
> ![img](https://assets.leetcode.com/uploads/2019/02/19/113_sample.png)
>
> ```
> Input:
> {"$id":"1","neighbors":[{"$id":"2","neighbors":[{"$ref":"1"},{"$id":"3","neighbors":[{"$ref":"2"},{"$id":"4","neighbors":[{"$ref":"3"},{"$ref":"1"}],"val":4}],"val":3}],"val":2},{"$ref":"4"}],"val":1}
> 
> Explanation:
> Node 1's value is 1, and it has two neighbors: Node 2 and 4.
> Node 2's value is 2, and it has two neighbors: Node 1 and 3.
> Node 3's value is 3, and it has two neighbors: Node 2 and 4.
> Node 4's value is 4, and it has two neighbors: Node 1 and 3.
> ```
>
>  
>
> **Note:**
>
> 1. The number of nodes will be between 1 and 100.
> 2. The undirected graph is a [simple graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)#Simple_graph), which means no repeated edges and no self-loops in the graph.
> 3. Since the graph is undirected, if node *p* has node *q* as neighbor, then node *q* must have node *p* as neighbor too.
> 4. You must return the **copy of the given node** as a reference to the cloned graph.

> https://www.cnblogs.com/grandyang/p/4267628.html

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> neighbors;

    public Node() {}

    public Node(int _val,List<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
*/
class Solution {
    Map<Integer, Node> map = new HashMap<>();
    
    public Node cloneGraph(Node node) {
        if (node == null)
            return null;
        
        if (map.containsKey(node.val)) 
            return map.get(node.val);
        
        Node copyNode = new Node(node.val, new ArrayList<Node>());
        map.put(node.val, copyNode);
        for (Node neighbour: node.neighbors) {
            copyNode.neighbors.add(cloneGraph(neighbour));
        }
        
        return copyNode;
    }
}
```

## [134. Gas Station](https://leetcode-cn.com/problems/gas-station/)

> There are *N* gas stations along a circular route, where the amount of gas at station *i* is `gas[i]`.
>
> You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from station *i* to its next station (*i*+1). You begin the journey with an empty tank at one of the gas stations.
>
> Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.
>
> **Note:**
>
> - If there exists a solution, it is guaranteed to be unique.
> - Both input arrays are non-empty and have the same length.
> - Each element in the input arrays is a non-negative integer.
>
> **Example 1:**
>
> ```
> Input: 
> gas  = [1,2,3,4,5]
> cost = [3,4,5,1,2]
> 
> Output: 3
> 
> Explanation:
> Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
> Travel to station 4. Your tank = 4 - 1 + 5 = 8
> Travel to station 0. Your tank = 8 - 2 + 1 = 7
> Travel to station 1. Your tank = 7 - 3 + 2 = 6
> Travel to station 2. Your tank = 6 - 4 + 3 = 5
> Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
> Therefore, return 3 as the starting index.
> ```
>
> **Example 2:**
>
> ```
> Input: 
> gas  = [2,3,4]
> cost = [3,4,3]
> 
> Output: -1
> 
> Explanation:
> You can't start at station 0 or 1, as there is not enough gas to travel to the next station.
> Let's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
> Travel to station 0. Your tank = 4 - 3 + 2 = 3
> Travel to station 1. Your tank = 3 - 3 + 3 = 3
> You cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.
> Therefore, you can't travel around the circuit once no matter where you start.
> ```

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int start = 0;
        int total = 0;
        int current = 0;
        for (int i = 0; i < gas.length; i++) {
            total += gas[i] - cost[i];
            current += gas[i] - cost[i];
            if (current < 0) {// 说明从start出发，会存在无法到达的情况（油不够）
                start = i + 1; // 在站点i才发生油不够的情况，说明从站点i到达i+1，因而至少从站点i+1出发
                current = 0;
            }
        }
        return total >= 0 ? start : -1;
        
    }
}
```

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int tmpSum = 0, min = Integer.MAX_VALUE, minPoint = 0;
        for (int i = 0; i < gas.length; i++) {
            tmpSum += gas[i] - cost[i];
            if (tmpSum < min) {
                min = tmpSum;
                minPoint = i;
            }
        }
        if (tmpSum < 0) {
            return -1;
        } else {
            return (minPoint + 1) % gas.length; //如果到底了，自动回到 0 站点
        }
    }
}
```

## [136. Single Number](https://leetcode-cn.com/problems/single-number/)

> Given a **non-empty** array of integers, every element appears *twice* except for one. Find that single one.
>
> **Note:**
>
> Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?
>
> **Example 1:**
>
> ```
> Input: [2,2,1]
> Output: 1
> ```
>
> **Example 2:**
>
> ```
> Input: [4,1,2,1,2]
> Output: 4
> ```

```java
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

```java
class Solution {
    public int singleNumber(int[] nums) {
        if(nums.length==0)return -1;
        if(nums.length==1)return nums[0];
        Arrays.sort(nums);
        for(int i=0;i<nums.length-1;i+=2){
            if(nums[i]!=nums[i+1])
                return nums[i];
        }
        return nums[nums.length-1];
    }
}
class Solution {
    public int singleNumber(int[] nums) {
    	
    	Set<Integer> set = new HashSet<>();
    	
    	for(int i=0;i<nums.length;i++) {
    		int value = nums[i];
    		if(set.contains(value)) {
    			set.remove(value);
    		}else {
    			set.add(value);
    		}
    	}
        
    	return set.iterator().next();
    }
}
```

## [137. Single Number II](https://leetcode-cn.com/problems/single-number-ii/)

> Given a **non-empty** array of integers, every element appears *three* times except for one, which appears exactly once. Find that single one.
>
> **Note:**
>
> Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?
>
> **Example 1:**
>
> ```
> Input: [2,2,3,2]
> Output: 3
> ```
>
> **Example 2:**
>
> ```
> Input: [0,1,0,1,0,1,99]
> Output: 99
> ```

> 通用做法，统计所有数字各个对应位1的总数，如第i位1的总数不是3的整数(此处余1)，说明那个特殊数字在该位置是1，遍历所有位，如此则能统计该数每个位上是0还是1,最终得到the single one 的值。
>
> **[更效率的办法是模仿数电，使用真值表求出表达式](https://blog.csdn.net/yutianzuijin/article/details/50597413)** 但是需要比较熟悉，

```java
class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        int mask = 1;
        while(mask != 0){
            int count = 0;
            for(int x : nums){
                if((x & mask) != 0){
                    count ++;
                }                
            }
            if(count % 3 == 1){
                result = result | mask;
            }
            mask = mask << 1;
        }
        return result;
    }
}
```

```java
class Solution {
    public int singleNumber(int[] nums) {
        int high = 0, low = 0;
        for(int x : nums){
            low = low ^ x & ~ high;
            high = high ^ x & ~low;
        }
        return low;
    }
}
```

## [138. Copy List with Random Pointer](https://leetcode-cn.com/problems/copy-list-with-random-pointer/)

> A linked list is given such that each node contains an additional random pointer which could point to any node in the list or null.
>
> Return a [**deep copy**](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) of the list.
>
>  
>
> **Example 1:**
>
> **![img](https://discuss.leetcode.com/uploads/files/1470150906153-2yxeznm.png)**
>
> ```
> Input:
> {"$id":"1","next":{"$id":"2","next":null,"random":{"$ref":"2"},"val":2},"random":{"$ref":"2"},"val":1}
> 
> Explanation:
> Node 1's value is 1, both of its next and random pointer points to Node 2.
> Node 2's value is 2, its next pointer points to null and its random pointer points to itself.
> ```
>
>  
>
> **Note:**
>
> 1. You must return the **copy of the given head** as a reference to the cloned list.

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public Node next;
    public Node random;

    public Node() {}

    public Node(int _val,Node _next,Node _random) {
        val = _val;
        next = _next;
        random = _random;
    }
};
*/
class Solution {
    private Map<Node, Node> map = new HashMap();
    public Node copyRandomList(Node head) {
        if(head == null) return null;
        if(map.containsKey(head)){
            return map.get(head);
        }
        Node copyHead = new Node(head.val);
        map.put(head, copyHead);
        copyHead.random = copyRandomList(head.random);
        copyHead.next = copyRandomList(head.next);
        return copyHead;
    }
}
```

```java
class Solution {
   /**
     * 复制带随机指针的链表
     * 给定一个链表，每个节点包含一个额外增加的随机指针，该指针可以指向链表中的任何节点或空节点。
     * 对每个node复制，插入到其他node的后面，新旧交替成为重复链表，遍历每个旧node复制随机指针，将新旧两个链表叉开，返回新的链表
     */
    public Node copyRandomList(Node head) {
        if (head == null) return head;
        Node node = head;
        while (node != null) { //复制链表
            Node newNode = new Node(node.val,null,null);
            newNode.next = node.next;
            node.next = newNode;
            node = newNode.next;
        }
        node = head;
        while (node != null) {  //复制随机指针
            if (node.random != null)
                node.next.random = node.random.next; //应指向对应的复制节点
            node = node.next.next;
        }
        Node newHead = head.next;
        node = head;
        while (node != null) {  //拆分链表
            Node newNode = node.next;
            node.next = newNode.next;
            if (newNode.next != null) {
                newNode.next = newNode.next.next;
            }
            node = node.next;
        }
        return newHead;
    }
}
```

## [139. Word Break](https://leetcode-cn.com/problems/word-break/)

> Given a **non-empty** string *s* and a dictionary *wordDict* containing a list of **non-empty** words, determine if *s* can be segmented into a space-separated sequence of one or more dictionary words.
>
> **Note:**
>
> - The same word in the dictionary may be reused multiple times in the segmentation.
> - You may assume the dictionary does not contain duplicate words.
>
> **Example 1:**
>
> ```
> Input: s = "leetcode", wordDict = ["leet", "code"]
> Output: true
> Explanation: Return true because "leetcode" can be segmented as "leet code".
> ```
>
> **Example 2:**
>
> ```
> Input: s = "applepenapple", wordDict = ["apple", "pen"]
> Output: true
> Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
>              Note that you are allowed to reuse a dictionary word.
> ```
>
> **Example 3:**
>
> ```
> Input: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
> Output: false
> ```

> 通过遍历从0到i的子串是否存在于字典，result[i] 为true表示0到i能够完成拆分

```java
class Solution {
    
    public boolean wordBreak(String s, List<String> wordDict) {// 当前方法会造成优先匹配短的，所以会出问题
        boolean[] result = new boolean[s.length() + 1];
        result[0] = true;
        for(int i = 0; i <= s.length(); i++){
            for(int j = 0; j < i; j++){
                if(result[j] && wordDict.contains(s.substring(j, i))){
                    result[i] = true;
                    break;
                }
            }
        }
        return result[s.length()];
    }
} 
```

> 原理类似，进行优化。先得出字典中字符串最大长度，优先查找长串（背包先装大的）
>
> 同时Set在查找效率上比List高(判断contains的时候)

```java
class Solution {
    
    public boolean wordBreak(String s, List<String> wordDict) {
        boolean[] result = new boolean[s.length() + 1];
        HashSet<String> dict = new HashSet<>(wordDict); //使用的hash，查找效率比List高
        result[0] = true;
        int maxLen = 0;
        for(String word : wordDict){
            if(maxLen < word.length()){
                maxLen = word.length();
            }
        }
        for(int i = 0; i <= s.length(); i++){
            for(int j = Math.max(0, i - maxLen - 1); j < i; j++){
                if(result[j] && dict.contains(s.substring(j, i))){
                    result[i] = true;
                    break;
                }
            }
        }
        return result[s.length()];
    }
}
```

##  [142. Linked List Cycle II](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

> Given a linked list, return the node where the cycle begins. If there is no cycle, return `null`.
>
> To represent a cycle in the given linked list, we use an integer `pos` which represents the position (0-indexed) in the linked list where tail connects to. If `pos` is `-1`, then there is no cycle in the linked list.
>
> **Note:** Do not modify the linked list.
>
>  
>
> **Example 1:**
>
> ```
> Input: head = [3,2,0,-4], pos = 1
> Output: tail connects to node index 1
> Explanation: There is a cycle in the linked list, where tail connects to the second node.
> ```
>
> ![img](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)
>
> **Example 2:**
>
> ```
> Input: head = [1,2], pos = 0
> Output: tail connects to node index 0
> Explanation: There is a cycle in the linked list, where tail connects to the first node.
> ```
>
> ![img](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test2.png)
>
> **Example 3:**
>
> ```
> Input: head = [1], pos = -1
> Output: no cycle
> Explanation: There is no cycle in the linked list.
> ```
>
> ![img](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test3.png)

> 使用快慢指针，快的每次走两步，慢的一步，相遇时，快指针所走的路程是慢指针路程2倍
>
> 假设非环段长度为 a ，环部分长度为b, 假设相遇时距离环节点x
>
> 慢指针路程 s1 = a + mb + x  （讲道理，慢指针应该没走满一圈）  
>
> 快指针路程为 s2 = a + nb + x  
>
> 由于有 s2 = 2 * s1  
>
> 则可得 a + x = (n - 2m) b
>
> 假设此时 再走 a 步数，则有s2 + a = a + (2n - 2m)b, 即 a + n圈，正好回到环点 
>
> 而从头部到达环点正好需要走 a 步，
>
> 即此时从头部出发，另一个从之前相遇点出发，都一次一步，能够同时到达环点

```java
public class Solution {
    
    // A+B+N = 2A+2B
    // N=A+B
    public ListNode detectCycle(ListNode head) {
        if(head == null || head.next == null){
            return null;
        }
        ListNode fast = head;
        ListNode slow = head;
        while(fast != null && fast.next != null){  //快节点和快节点的next节点不为空时可能有环
            fast = fast.next.next;
            if(fast == null) return null;
            slow = slow.next;
            if(slow == fast){   //相等时才有环
                while(slow != head && slow != null){
                   head = head.next;
                   slow = slow.next;
                }
                return slow;
            }
        }
        return null;
    }
}
```

## [143. Reorder List](https://leetcode-cn.com/problems/reorder-list/)

> Given a singly linked list *L*: *L*0→*L*1→…→*L**n*-1→*L*n,
> reorder it to: *L*0→*L**n*→*L*1→*L**n*-1→*L*2→*L**n*-2→…
>
> You may **not** modify the values in the list's nodes, only nodes itself may be changed.
>
> **Example 1:**
>
> ```
> Given 1->2->3->4, reorder it to 1->4->2->3.
> ```
>
> **Example 2:**
>
> ```
> Given 1->2->3->4->5, reorder it to 1->5->2->4->3.
> ```

> + 利用快慢指针快速定位，将链表分成两部分
> + 将后半部分链表反转
> + 将两部分量表合并

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
    public void reorderList(ListNode head) {
        if(head == null || head.next == null)return ;
        ListNode slow = head;
        ListNode fast = head;
        while(fast != null && fast.next != null){
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode part1Point = head;
        ListNode part2Point = reverse(slow.next);
        slow.next = null;
        while(part1Point != null && part2Point != null){
            ListNode part1next = part1Point.next;
            ListNode part2next = part2Point.next;
            part1Point.next = part2Point;
            part2Point.next = part1next;
            part1Point = part1next;
            part2Point = part2next;
        }        
        
    }
    private ListNode reverse(ListNode head){
        ListNode prev = null;
        ListNode cur = head;
        ListNode next = head;
        while(cur != null){
            next = cur.next;
            cur.next = prev;
            prev = cur;                        
            cur = next;
        }
        return prev;
    }
}
```

## [144. Binary Tree Preorder Traversal](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

> Given a binary tree, return the *preorder* traversal of its nodes' values.
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
> Output: [1,2,3]
> ```
>
> **Follow up:** Recursive solution is trivial, could you do it iteratively?

> 递归

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
    public List<Integer> preorderTraversal(TreeNode root) {
        if(root != null ){
            result.add(root.val);
            preorderTraversal(root.left);
            preorderTraversal(root.right);
        }
        return result;
    }
}
```

> 迭代方式

```java
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList();
        if(root == null)return result;
        Stack<TreeNode> stack = new Stack();
        stack.push(root);
        while(!stack.isEmpty()){
            TreeNode node = stack.pop();
            result.add(node.val);
            if(node.right != null){
                stack.push(node.right);
            }
            if(node.left != null){
                stack.push(node.left);
            }
        }                
        
        return result;
    }
}
```

## [145.Binary Tree Postorder Traversal](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

> Given a binary tree, return the *postorder* traversal of its nodes' values.
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
> Output: [3,2,1]
> ```
>
> **Follow up:** Recursive solution is trivial, could you do it iteratively?

> 递归

```java
class Solution{
 	private List<Integer> res = new ArrayList<Integer>();
    public List<Integer> postorderTraversal(TreeNode root) {//递归写法
        if(root == null)
            return res;
        postorderTraversal(root.left);
        postorderTraversal(root.right);
        res.add(root.val);
        return res;
    }   
}
```

> 迭代

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
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList();
        if(root == null)return result;
        Stack<TreeNode> stack = new Stack();
        stack.push(root);
        TreeNode pre = null;
        while(!stack.isEmpty()){
            root = stack.peek();
            if(root.left ==null && root.right == null ||
              (pre != null && (pre == root.left || pre == root.right))){
                result.add(root.val);
                pre = root;
                stack.pop();
            }else{
                if(root.right != null)stack.push(root.right);
                if(root.left != null)stack.push(root.left);
            }
        }
        return result;
    }
}
```

```java
class Solution{
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<Integer>();
        if(root == null)
            return res;
        Stack<TreeNode> stack = new Stack<TreeNode>();
        stack.push(root);
        while(!stack.isEmpty()){
            TreeNode node = stack.pop();
            if(node.left != null) stack.push(node.left);//和传统先序遍历不一样，先将左结点入栈
            if(node.right != null) stack.push(node.right);//后将右结点入栈
            res.add(0,node.val);                        //逆序添加结点值
        }     
        return res;
    }
}

```

## [146. LRU Cache](https://leetcode-cn.com/problems/lru-cache/)

Design and implement a data structure for Least Recently Used (LRU) cache. It should support the following operations: get and put.

get(key) - Get the value (will always be positive) of the key if the key exists in the cache, otherwise return -1.
put(key, value) - Set or insert the value if the key is not already present. When the cache reached its capacity, it should invalidate the least recently used item before inserting a new item.

The cache is initialized with a positive capacity.

Follow up:
Could you do both operations in O(1) time complexity?

Example:
```java
LRUCache cache = new LRUCache( 2 /* capacity */ );

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // returns 1
cache.put(3, 3);    // evicts key 2
cache.get(2);       // returns -1 (not found)
cache.put(4, 4);    // evicts key 1
cache.get(1);       // returns -1 (not found)
cache.get(3);       // returns 3
cache.get(4);       // returns 4
```

>  [方法一](https://leetcode-cn.com/problems/lru-cache/solution/lru-huan-cun-ji-zhi-by-leetcode/):哈希表+双向链表

```java
import java.util.Hashtable;
public class LRUCache {

  class DLinkedNode {
    int key;
    int value;
    DLinkedNode prev;
    DLinkedNode next;
  }

  private void addNode(DLinkedNode node) {
    /**
     * Always add the new node right after head.
     */
    node.prev = head;
    node.next = head.next;

    head.next.prev = node;
    head.next = node;
  }

  private void removeNode(DLinkedNode node){
    /**
     * Remove an existing node from the linked list.
     */
    DLinkedNode prev = node.prev;
    DLinkedNode next = node.next;

    prev.next = next;
    next.prev = prev;
  }

  private void moveToHead(DLinkedNode node){
    /**
     * Move certain node in between to the head.
     */
    removeNode(node);
    addNode(node);
  }

  private DLinkedNode popTail() {
    /**
     * Pop the current tail.
     */
    DLinkedNode res = tail.prev;
    removeNode(res);
    return res;
  }

  private Hashtable<Integer, DLinkedNode> cache = new HashMap();
  private int size;
  private int capacity;
  private DLinkedNode head, tail;

  public LRUCache(int capacity) {
    this.size = 0;
    this.capacity = capacity;

    head = new DLinkedNode();
    // head.prev = null;

    tail = new DLinkedNode();
    // tail.next = null;

    head.next = tail;
    tail.prev = head;
  }

  public int get(int key) {
    DLinkedNode node = cache.get(key);
    if (node == null) return -1;

    // move the accessed node to the head;
    moveToHead(node);

    return node.value;
  }

  public void put(int key, int value) {
    DLinkedNode node = cache.get(key);

    if(node == null) {
      DLinkedNode newNode = new DLinkedNode();
      newNode.key = key;
      newNode.value = value;

      cache.put(key, newNode);
      addNode(newNode);

      ++size;

      if(size > capacity) {
        // pop the tail
        DLinkedNode tail = popTail();
        cache.remove(tail.key);
        --size;
      }
    } else {
      // update the value.
      node.value = value;
      moveToHead(node);
    }
  }
}

```

> [方法二](https://leetcode-cn.com/problems/lru-cache/solution/lru-huan-cun-ji-zhi-by-leetcode/):有序字典,Java这边有点投机

```java
class LRUCache extends LinkedHashMap<Integer, Integer>{
    private int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75F, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity; 
    }
}

/**
 * LRUCache 对象会以如下语句构造和调用:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
```




## [147. Insertion Sort List](https://leetcode-cn.com/problems/insertion-sort-list/)

> Sort a linked list using insertion sort.
>
> 
>
> ![img](https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif)
> A graphical example of insertion sort. The partial sorted list (black) initially contains only the first element in the list.
> With each iteration one element (red) is removed from the input data and inserted in-place into the sorted list
>  
>
> 
>
> **Algorithm of Insertion Sort:**
>
> 1. Insertion sort iterates, consuming one input element each repetition, and growing a sorted output list.
> 2. At each iteration, insertion sort removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.
> 3. It repeats until no input elements remain.
>
> 
> **Example 1:**
>
> ```
> Input: 4->2->1->3
> Output: 1->2->3->4
> ```
>
> **Example 2:**
>
> ```
> Input: -1->5->3->4->0
> Output: -1->0->3->4->5
> ```

```java
// 中规中矩的办法
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public ListNode insertionSortList(ListNode head) {
        if(head == null || head.next == null)return head;
        ListNode preHead = new ListNode(0);
       
        while(head != null){
            ListNode next = head.next;
            ListNode insert = preHead;
            while(insert.next != null && head.val > insert.next.val){
                insert = insert.next;
            }
            head.next = insert.next;
            insert.next = head;                                                                            
            head = next;
        }
        return preHead.next;
    }
}
```

> 归并排序

```java
class Solution {
    public ListNode insertionSortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode fast = head;
        ListNode slow = head;
        ListNode pre = null;
        while (fast != null && fast.next != null) {
            pre = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        pre.next = null;
        ListNode l1 = insertionSortList(head);
        ListNode l2 = insertionSortList(slow);
        return merge(l1, l2);
    }

    public static ListNode merge(ListNode l1, ListNode l2) {
        if (l1 == null || l2 == null) return l1 == null ? l2 : l1;
        if (l1.val < l2.val) {
            l1.next = merge(l1.next, l2);
            return l1;
        } else {
            l2.next = merge(l1, l2.next);
            return l2;
        }
    }
}
```

## [148. Sort List](https://leetcode-cn.com/problems/sort-list/)

> Sort a linked list in *O*(*n* log *n*) time using constant space complexity.
>
> **Example 1:**
>
> ```
> Input: 4->2->1->3
> Output: 1->2->3->4
> ```
>
> **Example 2:**
>
> ```
> Input: -1->5->3->4->0
> Output: -1->0->3->4->5
> ```

> 貌似是合格的，但是没太详细看，用的貌似是 Java 11

```java
public class Solution {
    public ListNode SortList(ListNode head) {
        if (head == null) return null;
        var n = 0;
        for (var current = head; current != null; current = current.next) n += 1;
        var dummy1 = new ListNode(-1);
        dummy1.next = head;
        var dummy2 = new ListNode(-1);
        for (var m = 1; m < n; m *= 2) {
            var prev1 = dummy1;
            while (prev1.next != null) {

                // Grab up to the next m items into list1.
                var list1 = prev1.next;
                var prev2 = list1;
                for (var i = 0; i < m - 1 && prev2 != null; i++) prev2 = prev2.next;

                if (prev2 == null) break;

                // Grab up to the next m items into list2.
                var list2 = prev2.next;
                var prev3 = list2;
                for (var i = 0; i < m - 1 && prev3 != null; i++) prev3 = prev3.next;

                // Save the remaining items, if any.
                var list3 = prev3 != null ? prev3.next : null;

                // Terminate list1 and list2.
                prev2.next = null;
                if (prev3 != null) prev3.next = null;

                // Merge the two lists, terminating with remaining items.
                (prev1.next, prev1) = Merge(dummy2, list1, list2, list3);
            }
        }
        return dummy1.next;
    }
    private (ListNode, ListNode) Merge(ListNode dummy, ListNode list1, ListNode list2, ListNode list3) {
        var prev = dummy;
        while (list1 != null || list2 != null) {
            var first = false;
            if (list1 == null) first = false;
            else if (list2 == null) first = true;
            else first = list1.val <= list2.val;
            if (first) {
                prev.next = list1;
                list1 = list1.next;
            }
            else {
                prev.next = list2;
                list2 = list2.next;
            }
            prev = prev.next;
        }
        prev.next = list3;
        return (dummy.next, prev);
    }
}
```

> 归并排序，在空间要求上实际上是不合理的

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
    public ListNode sortList(ListNode head) {
        if(head == null || head.next == null)return head;
        ListNode prev = null;
        ListNode slow = head;
        ListNode fast = head;
        while(fast != null && fast.next != null){
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        prev.next = null;
        ListNode list1 = sortList(head); 
        ListNode list2 = sortList(slow);
        return merge(list1, list2);
    }
    private ListNode merge(ListNode node1, ListNode node2){
        if(node1 == null || node2 == null)return node1 == null ? node2 : node1;
        if(node1.val < node2.val){
            node1.next = merge(node1.next, node2);
            return node1;
        }else{
            node2.next = merge(node2.next, node1);
            return node2;
        }
    }
}
```

## [Method-150. Evaluate Reverse Polish Notation](https://leetcode-cn.com/problems/evaluate-reverse-polish-notation/)

> Evaluate the value of an arithmetic expression in [Reverse Polish Notation](http://en.wikipedia.org/wiki/Reverse_Polish_notation).
>
> Valid operators are `+`, `-`, `*`, `/`. Each operand may be an integer or another expression.
>
> **Note:**
>
> - Division between two integers should truncate toward zero.
> - The given RPN expression is always valid. That means the expression would always evaluate to a result and there won't be any divide by zero operation.
>
> **Example 1:**
>
> ```
> Input: ["2", "1", "+", "3", "*"]
> Output: 9
> Explanation: ((2 + 1) * 3) = 9
> ```
>
> **Example 2:**
>
> ```
> Input: ["4", "13", "5", "/", "+"]
> Output: 6
> Explanation: (4 + (13 / 5)) = 6
> ```
>
> **Example 3:**
>
> ```
> Input: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
> Output: 22
> Explanation: 
>   ((10 * (6 / ((9 + 3) * -11))) + 17) + 5
> = ((10 * (6 / (12 * -11))) + 17) + 5
> = ((10 * (6 / -132)) + 17) + 5
> = ((10 * 0) + 17) + 5
> = (0 + 17) + 5
> = 17 + 5
> = 22
> ```

> 真是的，Postfix Expression 后缀表达式，说 逆波兰表达式  我一脸懵逼。。。。。

```java
// 中规中矩的办法
class Solution {
    public int evalRPN(String[] tokens) {
        if(null == tokens || tokens.length == 0) return 0;
        Stack<Integer> stack = new Stack();
        Set<String> calSign = new HashSet<String>(){ 
            {
                add("+");
                add("-");
                add("*");
                add("/");
            } 
        };
        for(String token : tokens){
            if(calSign.contains(token)){
                int b = stack.pop();
                int a = stack.pop();
                stack.push(cal(a, b, token));
            }else{
                stack.push(Integer.parseInt(token));
            }
        }
        return stack.pop();
    }
    private int cal(int a, int b, String op){
        int result = 0;
        switch(op){
            case "+":
                result = a + b;
                break;
            case "-":
                result = a - b;
                break;
            case "*":
                result = a * b;
                break;
            case "/":
                result = a / b;
                break;
        }
        return result;
    }
}
```

> 递归版本

```java
class Solution {
     private int N =-1;
   public int evalRPN(String[] tokens) {

        if(N==-1)
            N=tokens.length-1;
        String s = tokens[N--];
        char c = s.charAt(0);
        if(s.length()==1&&"+-*/".indexOf(c)!=-1){
            int a = evalRPN(tokens);
            int b = evalRPN(tokens);
            switch(c){
                case '+':return a+b;
                case '-':return b-a;
                case '*':return a*b;
                case '/':return b/a;
                default:break;
            }
        }
        return Integer.parseInt(s);
    }
}
```

## [151. Reverse Words in a String](https://leetcode-cn.com/problems/reverse-words-in-a-string/)

> Given an input string, reverse the string word by word.
>
>  
>
> **Example 1:**
>
> ```
> Input: "the sky is blue"
> Output: "blue is sky the"
> ```
>
> **Example 2:**
>
> ```
> Input: "  hello world!  "
> Output: "world! hello"
> Explanation: Your reversed string should not contain leading or trailing spaces.
> ```
>
> **Example 3:**
>
> ```
> Input: "a good   example"
> Output: "example good a"
> Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
> ```
>
>  
>
> **Note:**
>
> - A word is defined as a sequence of non-space characters.
> - Input string may contain leading or trailing spaces. However, your reversed string should not contain leading or trailing spaces.
> - You need to reduce multiple spaces between two words to a single space in the reversed string.
>
>  
>
> **Follow up:**
>
> For C programmers, try to solve it *in-place* in *O*(1) extra space.

```java
// 笨方法
class Solution {
    public String reverseWords(String s) {
        StringBuilder sb = new StringBuilder();
        char pre = ' ';  
        for(int i = 0; i < s.length(); i ++){
            char cur = s.charAt(i);
            if(cur == ' ' && pre == ' ')continue;
            pre = cur;
            sb.append(cur);            
        }
        String[] words = sb.toString().trim().split(" ");
        sb = new StringBuilder();
        for(int i = words.length -1; i > 0; i --){
            sb.append(words[i]).append(" ");            
        }
        sb.append(words[0]);
        return sb.toString();
    }
}
```

```java
// 通过两个数来定位 单词的 始末位置， 由后往前遍历
class Solution {
    public String reverseWords(String s) {
        StringBuilder builder = new StringBuilder(s.length());
        int i = s.length() - 1;
        while (i >= 0) {
            while (i >= 0 && s.charAt(i) == ' ') i--;
            if (i == -1) break;
            
            int j = s.lastIndexOf(' ', i); //从位置 i 开始， 从后往前找出 ' ' 第一次出现的位置
            builder.append(s.substring(j + 1, i + 1) + " ");
            i = j - 1;
        }    
        if (builder.length() > 0) builder.deleteCharAt(builder.length() - 1);
        return builder.toString();
    }
}
```

## [Means - 152. Maximum Product Subarray](https://leetcode-cn.com/problems/maximum-product-subarray/)

> Given an integer array `nums`, find the contiguous subarray within an array (containing at least one number) which has the largest product.
>
> **Example 1:**
>
> ```
> Input: [2,3,-2,4]
> Output: 6
> Explanation: [2,3] has the largest product 6.
> ```
>
> **Example 2:**
>
> ```
> Input: [-2,0,-1]
> Output: 0
> Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
> ```

> 动态规划，由于题目要求连续，故而只需保留当前和前一步的状态即可

```java
class Solution {
    public int maxProduct(int[] nums) {
        int max = Integer.MIN_VALUE, imax = 1, imin = 1; //一个保存最大的，一个保存最小的。
        for(int i=0; i<nums.length; i++){
            if(nums[i] < 0){ int tmp = imax; imax = imin; imin = tmp;} //如果数组的数是负数，那么会导致最大的变最小的，最小的变最大的。因此交换两个的值。
            imax = Math.max(imax*nums[i], nums[i]);// 假如存在 0， 则会刷新当前子集 积
            imin = Math.min(imin*nums[i], nums[i]);            
            max = Math.max(max, imax);
        }
        return max;
    }
}
```

## [自身逻辑不擅长此类--153. Find Minimum in Rotated Sorted Array](https://leetcode-cn.com/problems/find-minimum-in-rotated-sorted-array/)

> Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand.
>
> (i.e.,  `[0,1,2,4,5,6,7]` might become  `[4,5,6,7,0,1,2]`).
>
> Find the minimum element.
>
> You may assume no duplicate exists in the array.
>
> **Example 1:**
>
> ```
> Input: [3,4,5,1,2] 
> Output: 1
> ```
>
> **Example 2:**
>
> ```
> Input: [4,5,6,7,0,1,2]
> Output: 0
> ```

```java
class Solution {
    public int findMin(int[] nums) {
        if(nums.length == 1)return nums[0];
        int start = 0;
        int end = nums.length -1;
        if(nums[start] <= nums[end])return nums[start];// 用于过滤有序数组
        int mid = 0;
        while(start < end && end - start > 1){// 不添加 end - start > 1 有可能会陷入死循环
            mid = start + (end - start) / 2;
            if(nums[start] > nums[end]){                
                if(nums[mid] > nums[start]){
                    start = mid; // 这里不能写 start = mid + 1; 因为可能nums[mid+1]正好是最小值而陷入死循环
                }else{
                    end = mid;// 同理不能写 end = nums[mid - 1],否则可能造成死循环
                }                
            }
        }
        return Math.min(nums[start], nums[end]);
    }
}
```

```java
class Solution {
    public int findMin(int[] nums) {
        int start = 0;
        int end = nums.length -1;
        if(nums[start] <= nums[end])return nums[start];
        int mid = 0;
        while(start <= end){
            mid = start + (end - start) / 2;;
            if(nums[mid] > nums[mid + 1])return nums[mid+1]; // 这一步为了避免造成死循环
            if(nums[mid] > nums[start]){// nums[mid] > nums[start]已经保证了 nums[start] > nums[end]
                start = mid + 1;
            }else{
                end = mid - 1;
            }
        }
        return nums[0];
    }
}
```

## [源码的重要性--155. Min Stack](https://leetcode-cn.com/problems/min-stack/)

> Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
>
> - push(x) -- Push element x onto stack.
> - pop() -- Removes the element on top of the stack.
> - top() -- Get the top element.
> - getMin() -- Retrieve the minimum element in the stack.
>
> 
>
> **Example:**
>
> ```
> MinStack minStack = new MinStack();
> minStack.push(-2);
> minStack.push(0);
> minStack.push(-3);
> minStack.getMin();   --> Returns -3.
> minStack.pop();
> minStack.top();      --> Returns 0.
> minStack.getMin();   --> Returns -2.
> ```

> 有很多人使用两个栈解决这个问题，感觉有点投机，
>
> 我第一遍做的时候，用的List,后面看答案的时候，觉得下面这个最合题意，某方面来说就是仿的jdk源码

```java
class MinStack {

    private int capacity;
    private int size;
    private int[] data;
    private int[] min;

    public MinStack() {
        capacity = 4;
        size = 0;
        data = new int[capacity];
        min = new int[capacity];
    }

    public void push(int x) {
        if (size >= capacity) {
            expand();
        }
        int min = size > 0 ?this.min[size-1] : Integer.MAX_VALUE;
        data[size] = x;
        this.min[size++] = x > min ? min : x; //记录size为指定值时的最小值，如果移除值，只是根据size移动下标即可
    }

    public void pop() {
        size--;
    }

    public int top() {
        return size > 0 ? data[size-1] : -1;
    }

    public int getMin() {
        return size > 0 ? min[size-1] : -1;
    }

    private void expand() {
        int newCapacity = capacity * 2;
        int[] newData = new int[newCapacity];
        int[] newMin = new int[newCapacity];
        System.arraycopy(data, 0, newData, 0, capacity);
        System.arraycopy(min, 0, newMin, 0, capacity);
        capacity = newCapacity;
        data = newData;
        min = newMin;
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(x);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```

## [160. Intersection of Two Linked Lists](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

> Write a program to find the node at which the intersection of two singly linked lists begins.
>
> For example, the following two linked lists:
>
> ![img](https://assets.leetcode.com/uploads/2018/12/13/160_statement.png)
>
> 
>
> begin to intersect at node c1.
>
>  
>
> **Example 1:**
>
> ![img](https://assets.leetcode.com/uploads/2018/12/13/160_example_1.png)
>
> 
>
> ```
> Input: intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
> Output: Reference of the node with value = 8
> Input Explanation: The intersected node's value is 8 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [4,1,8,4,5]. From the head of B, it reads as [5,0,1,8,4,5]. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B.
> ```
>
>  
>
> **Example 2:**
>
> ![img](https://assets.leetcode.com/uploads/2018/12/13/160_example_2.png)
>
> 
>
> ```
> Input: intersectVal = 2, listA = [0,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
> Output: Reference of the node with value = 2
> Input Explanation: The intersected node's value is 2 (note that this must not be 0 if the two lists intersect). From the head of A, it reads as [0,9,1,2,4]. From the head of B, it reads as [3,2,4]. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B.
> ```
>
>  
>
> **Example 3:**
>
> ![img](https://assets.leetcode.com/uploads/2018/12/13/160_example_3.png)
>
> 
>
> ```
> Input: intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
> Output: null
> Input Explanation: From the head of A, it reads as [2,6,4]. From the head of B, it reads as [1,5]. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values.
> Explanation: The two lists do not intersect, so return null.
> ```
>
>  
>
> **Notes:**
>
> - If the two linked lists have no intersection at all, return `null`.
> - The linked lists must retain their original structure after the function returns.
> - You may assume there are no cycles anywhere in the entire linked structure.
> - Your code should preferably run in O(n) time and use only O(1) memory.

> 定义两个指针, 第一轮让两个到达末尾的节点指向另一个链表的头部, 最后如果相遇则为交点(在第一轮移动中恰好抹除了长度差)
> 两个指针等于移动了相同的距离, 有交点就返回, 无交点就是各走了两条指针的长度
> 在这里第一轮体现在pA和pB第一次到达尾部会移向另一链表的表头, 而第二轮体现在如果pA或pB相交就返回交点, 不相交最后就是null==null

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if(null == headA || null == headB)return null;
        ListNode curA = headA;
        ListNode curB = headB;
        while(curA != curB){
            curA = curA == null ? headB : curA.next;
            curB = curB == null ? headA : curB.next;              
        }
        
        return curA;
    }
}
```

## [162. Find Peak Element](https://leetcode-cn.com/problems/find-peak-element/)

> A peak element is an element that is greater than its neighbors.
>
> Given an input array `nums`, where `nums[i] ≠ nums[i+1]`, find a peak element and return its index.
>
> The array may contain multiple peaks, in that case return the index to any one of the peaks is fine.
>
> You may imagine that `nums[-1] = nums[n] = -∞`.
>
> **Example 1:**
>
> ```
> Input: nums = [1,2,3,1]
> Output: 2
> Explanation: 3 is a peak element and your function should return the index number 2.
> ```
>
> **Example 2:**
>
> ```
> Input: nums = [1,2,1,3,5,6,4]
> Output: 1 or 5 
> Explanation: Your function can return either index number 1 where the peak element is 2, 
>              or index number 5 where the peak element is 6.
> ```
>
> **Note:**
>
> Your solution should be in logarithmic complexity.

> **二分法在变更起点和终点的时候应结合实际情况灵活变更**
>
> + O(logN)一般考虑二分搜索
>
> + 如果nums[i] > nums[i+1]，则在i之前一定存在峰值元素
>
> + 如果nums[i] < nums[i+1]，则在i+1之后一定存在峰值元素

```java
class Solution {
    public int findPeakElement(int[] nums) {
        if(nums == null || 0 == nums.length)return 0;
        int length = nums.length;
        int start = 0;
        int end = length - 1;
       
        while(start < end){
            int mid = start + ((end - start) >>> 1);
            if( nums[mid] > nums[mid + 1] ){
                // mid 可能是峰值点，如果此处直接写mid + 1,则应在前面判断mid是否为峰值点
                end = mid; 
            }else{
                // mid 一定不是峰值点，如果此处写mid的话，最后可能需要从 start 和 end 之间判断哪个是峰值点
                start = mid + 1; 
            }                      
        }
        return left;
    }
}
```

## [165. Compare Version Numbers](https://leetcode-cn.com/problems/compare-version-numbers/)

> Compare two version numbers *version1* and *version2*.
> If  ***version1* > *version2*  return 1**; if ***version1* < *version2* return -1; otherwise return `0`**.
>
> You may assume that the version strings are non-empty and contain only digits and the `.` character.
>
> The `.` character does not represent a decimal point and is used to separate number sequences.
>
> For instance, `2.5` is not "two and a half" or "half way to version three", it is the fifth second-level revision of the second first-level revision.
>
> You may assume the default revision number for each level of a version number to be `0`. For example, version number `3.4` has a revision number of `3` and `4` for its first and second level revision number. Its third and fourth level revision number are both `0`.
>
>  
>
> **Example 1:**
>
> ```
> Input: version1 = "0.1", version2 = "1.1"
> Output: -1
> ```
>
> **Example 2:**
>
> ```
> Input: version1 = "1.0.1", version2 = "1"
> Output: 1
> ```
>
> **Example 3:**
>
> ```
> Input: version1 = "7.5.2.4", version2 = "7.5.3"
> Output: -1
> ```
>
> **Example 4:**
>
> ```
> Input: version1 = "1.01", version2 = "1.001"
> Output: 0
> Explanation: Ignoring leading zeroes, both “01” and “001" represent the same number “1”
> ```
>
> **Example 5:**
>
> ```
> Input: version1 = "1.0", version2 = "1.0.0"
> Output: 0
> Explanation: The first version number does not have a third level revision number, which means its third level revision number is default to "0"
> ```
>
>  
>
> **Note:**
>
> 1. Version strings are composed of numeric strings separated by dots `.` and this numeric strings **may** have leading zeroes.
> 2. Version strings do not start or end with dots, and they will not be two consecutive dots.

> 最不费脑的方法是用split分成数组，比较烧时间，但是容易理解

```java
class Solution {
    public int compareVersion(String version1, String version2) {
        String[] v1 = version1.split("\\.");
        String[] v2 = version2.split("\\.");
        int length = v1.length < v2.length ? v1.length : v2.length;
        int v1product = 0;
        int v2product = 0;
        for(int i = 0; i < length; i++){//先将相同段进行计数计算，如 7.5.2 ==> 752
            v1product = v1product * 10 + Integer.parseInt(v1[i]);
            v2product = v2product * 10 + Integer.parseInt(v2[i]);
            if(v1product != v2product)return v1product - v2product > 0 ? 1 : -1;
        }        
        // 如果前面值不等于0 判断后面长度数值 计数值,如果比较大于
        if(v1.length > v2.length){
            for(int i = v2.length; i < v1.length; i++){
                int tmp = Integer.parseInt(v1[i]);
                if(tmp == 0)continue;
                return 1;
            }
        }
        if(v1.length < v2.length){
            for(int i = v1.length; i < v2.length; i++){
                int tmp = Integer.parseInt(v2[i]);
                if(tmp == 0)continue;
                return -1;
            }
        }
        
        return 0;
    }
}
```

> 这个是榜单最佳

```java
class Solution {
    public int compareVersion(String version1, String version2) {
        if(version1 == null || version2 == null) return 0;
        char[] v1 = version1.toCharArray();
        char[] v2 = version2.toCharArray();
        for (int i = 0,j = 0;i < v1.length || j < v2.length;i++,j++){
            int ver1 = 0, ver2 = 0;
            for (;i<v1.length && v1[i]!='.';i++) ver1 = ver1 * 10 + v1[i] - '0';
            for (;j<v2.length && v2[j]!='.';j++) ver2 = ver2 * 10 + v2[j] - '0';
            if(ver1 < ver2) return -1;
            else if(ver1 > ver2) return 1;
        }
        return 0;
    }
}
```

