---
title: Django 学习笔记
toc: true
mathjax: true
top: 1
date: 2019-12-01 14:49:00
tags: Django
categories:
- Python
- Django
---

> 种种原因，用了一波Django写后台，总体而言，就使用上，比Spring那一条学起来容易许多。

<!-- more -->

> 在SpringMVC中，请求和到页面的模式为MVC模式，即 Model-View-Controller；在Django中使用的是MTV，即 Model-Template-View，但在Django中
> MTV模式
> M:model，模型，负责与数据库交互
> V:view，视图是核心，负责接收请求、获取数据、返回结果；与MVC中Controller对应
> T:template，模板，负责呈现内容到浏览器，与MVC中View

## 一、安装及项目初始化

### 1. 相关指令

> 个人仅了解相关指令，开发时更多使用的是pycharm进行操作

```bash
pip install django  # 个人使用的 python3
django-admin startproject project_name  # 创建项目
python manager.py runserver  # 服务器运行
python startapp app_name  # 新建模块(个人更愿意称之为模块)
python manager makemigrations  # 让模块中的模型生效
python manager migrate  # 让模块中的模型和数据库的表对应，如果数据库没有表，则自动建立
```

### 2. 项目文件结构

![1575185066070](DjangoLearning/1575185066070.png)

> 截图为新建项目TKG结构，其中student和auth_manage为新建的两个应用
> django project  框架目录结构
> |TKG             //项目名 后期可修改建议不修改
> |--- __init__.py        //python项目必带  模块化思想
> |--- settings.py        //项目的总配置文件  里面包含数据库 web应用 时间等各种配置
> |--- urls.py            //URL配置文件  Django项目中所有地址中（页面）都需要我们自己去配置其URL
> |--- wsgi.py            //python服务器网关接口，一般部署时用到
> |manage.py              //django项目管理文件 与项目进行交互的命令行工具集的入口
>
> django 应用目录结构
> student
> |-- migrations                         //数据移植（迁移）模块
> |------- __init__.py
> |-- __init__.py
> |-- admin.py                            //该应用后台管理系统配置
> |-- apps.py                             //该应用的一些配置 1.9以后自动生成
> |-- models.py                           //数据模块
> |-- tests.py                            //自动化测试模块  在这里编写测试脚本
> |-- views.py                            //执行响应的代码所在模块  代码逻辑处理主要地点  项目大部分代码在此编写
> |--templates                            //模板 放置模板文件的文件夹  包括HTML css JavaScript的文件夹

## 二、应用(App)注册生效

## 三、Django字段定义