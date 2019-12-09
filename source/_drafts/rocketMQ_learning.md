---
title: RocketMQ 学习笔记
toc: true
mathjax: true
date: 2019-04-05 21:03:27
tags: 
- rocketMQ
- docker
categories: Linux
---

> RocketMQ学习笔记

<!-- more -->

## 一、RocketMQ











## debug

> 报错
> org.apache.rocketmq.remoting.exception.RemotingConnectException: connect to ******

原因是：docker桥接网络，然后配置文件在没有额外配置的情况，使用了docker的桥接网络，我暴力删除了桥接网络后，结局了问题。