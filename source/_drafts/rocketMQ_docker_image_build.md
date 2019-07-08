---
title: RocketMQ docker镜像制作
toc: true
mathjax: true
date: 2019-04-05 21:03:27
tags: 
- rocketMQ
- docker
categories: Linux
---

> 自从使用docker后，感觉整片天空都明朗了许多，部署什么的一键搞定，但是不是所有都有对应的镜像。所以不得不自己造(其实 docker hub好像有，但是阿里云没有)。此为学习 rocketMQ 时搭建环境时的笔记。

<!-- more -->

## 一、安装

> 核心参考：https://github.com/apache/rocketmq-externals
> 将绝大多数 rocketmq 要用到的外部插件和工具都开源给用户了
> docker 镜像制作及容器启动相关内容都在 **rocketmq-docker** 文件夹中

安装步骤：

1. 生成 RocketMQ docker 镜像

   ```bash
   # 默认是CentOS7的指令，所以如果是ubuntu的话，需要有所调整
   cd image-build
   sh build-image.sh RMQ-VERSION # 看网速，如果网速不好，可能会因为下载rocketmq.zip包超时失败，所以建议提前下载好放在当前目录
   ```

   

## 二、some bugs

### 1、在ubuntu下使用相关脚本

```bash
# Linux报错：Syntax error: "(" unexpected解决办法， 兼容性问题，因为linux将sh默认指向了dash，而不是bash 
dpkg-reconfigure dash # 选择否
# 安装 yum，使ubuntu只是 yum 指令
 sudo apt-get install build-essential # 检查是否安装build-essential程序包
 sudo apt-get install yum # 安装 yum
 yum # 检查yum是否安装成功
```

