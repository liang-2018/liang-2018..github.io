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
            return (minPoint + 1) % gas.length;
        }
    }
}
```

