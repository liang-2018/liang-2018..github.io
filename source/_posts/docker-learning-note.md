---
title: docker学习笔记
toc: true
mathjax: true
date: 2019-04-05 20:59:08
tags:
- docker
- Linux
categories:
- Linux
---

> 当前更多是集群环境，从部署到运维相对工作量大。Docker一次构建，处处运行。
>
> 实验室相关项目最终也决定使用docker部署

<!-- more -->

## 一、Docker安装

参考链接:

http://www.docker.org.cn/book/install/linux.html  

https://docs.docker.com/install/linux/docker-ce/centos/

### 1、依赖检查

> CentOS 7 安装
>
> 依赖要求：Docker需要一个64位系统的Linux系统，内核的版本必须大于3.10
>
> 可以通过 uname -r 来检查内核版本

### 2、安装

#### （1）脚本安装

```bash
sudo yum update # 更新现有yum包
curl -sSL https://get.docker.com/ | sh  # 脚本安装
sudo service docker start # 启动docker服务
sudo docker version # 查看是否启动成功
```

#### （2）yum指令安装

```bash
sudo yum update # 更新现有yum包
# 安装需要的工具和依赖包
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
# 添加repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 安装docker-ce
sudo yum install docker-ce docker-ce-cli containerd.io
# 查看可安装的docker版本
yum list docker-ce --showduplicates | sort -r
# 安装指定版本的docker
sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
# 启动 docker
sudo systemctl start docker
# 通过运行 hello-image 镜像，测试是否正确安装
sudo docker run hello-world
```

#### （3）离线安装

参考链接：https://blog.csdn.net/u013058742/article/details/80075633 

> 1、下载所需的docker安装包
>
> <https://download.docker.com/linux/centos/7/x86_64/stable/Packages/>
>
> 2、下载所需的依赖
>
> <http://mirrors.163.com/centos/7/os/x86_64/Packages/> 下载如下8个依赖
>
> - audit-libs-python-2.7.6-3.el7.x86_64.rpm
> - checkpolicy-2.5-4.el7.x86_64.rpm
> - libcgroup-0.41-13.el7.x86_64.rpm
> - libseccomp-2.3.1-3.el7.x86_64.rpm
> - libsemanage-python-2.5-8.el7.x86_64.rpm
> - policycoreutils-python-2.5-17.1.el7.x86_64.rpm
> - python-IPy-0.75-6.el7.noarch.rpm
> - setools-libs-3.3.8-1.1.el7.x86_64.rpm
>
> http://mirror.centos.org/centos/7/extras/x86_64/Packages/container-selinux-2.95-2.el7_6.noarch.rpm
>
> 下载 container-selinux-2.95-2.el7_6.noarch.rpm

```bash
# 安装依赖
rpm -ivh *.rpm
# 安装container
rpm -ivh container-selinux-2.9-4.el7.noarch.rpm
# 安装docker
rpm -ivh docker-ce-17.12.0.ce-1.el7.centos.x86_64.rpm
# 启动docker
service dockerstart
# 查看版本及是否已运行
docker version
```

## 二、Docker镜像

### 1、切换为阿里云镜像

进入阿里云镜像仓库库 参考链接：

https://www.cnblogs.com/zhxshseu/p/5970a5a763c8fe2b01cd2eb63a8622b2.html

进入后，根据提示操作，如图：

![](docker-learning-note/1559736972755.png)

### 2、Docker状态查询

```bash
docker version # 查看docker版本信息
# 查看docker运行状态
service docker status 
systemctl is-active docker
# 查看运行情况,ps指令和linux类似
docker ps
```

### 3、镜像操作

> 就镜像拉取、提交来说，其实和Git一样，只不过把git换成了docker

#### （1）镜像查看

```bash
# 添加 -a 后会将悬空镜像（none:none）的镜像一并列举出来
docker images [-a]
docker image ls [-a]
# 只显示镜像的id,可以用于批量删除
docker image ls -q
# 只显示仓库名和对应的Tag，首字母大写 {{.Size}}
docker image ls --format "{{.Repository}}\t{{.Tag}}"
# 只查看悬空镜像，除dangling外还有 before、since、label 
docker image ls --filter dangling=true
# 也可以使用reference过滤,如仅显示标签为latest的镜像
docker image ls --filter=reference="*:latest"
```

#### （2）镜像查询与拉取

> 要注意的是latest是一个非强制标签，不保证支线跟仓库中最新的镜像，只能说大多是指向最新的。

> 由于镜像是分层的，所以为节省空间和提升性能，多个镜像之间会共享镜像层，这意味着镜像下载多了后，后面的镜像由于共享镜像层，所需下载的新的数据量就更少。

```bash
# 搜索镜像
docker search tomcat
docker search tomcat --filter "is-official=true"  # 只显示官方镜像
docker search tomcat --filter "is-automated=true" # 自动创建的仓库
# 拉取镜像, [image] 为可选项，可写可不写,写时去掉中括号，如：docker image pull tomcat
docker [image] pull tomcat # 默认拉取tag为latest的版本
docker [image] pull nginx:1.17 # 拉取tag为1.17的nginx
docker [image] pull mysql:5.6.31
```

```bash
# 为准确拉取镜像，也可以通过镜像签名值下载
docker image ls --digests mysql # 查看mysql镜像签名
# 通过镜像签名拉取对应镜像
docker pull mysql:d99ad1a8a2f8859dc986566cc31741c00a050d5fbf9305e7cd74398ade79f36
```

```bash
# 镜像查看,能够查看详细信息及镜像层信息，docker history有类似功能，不过没有inspect严谨
docker image inspect centos:latest
```

![1559740258069](docker-learning-note/1559740258069.png)

#### （3）镜像删除

> docker image rm [OPTIONS] IMAGE [IMAGE...]
>
> 可以多个一起删除，后面可以增加参数：
>
> -f, --force      Force removal of the image
> --no-prune   Do not delete untagged parents

```bash
# 删除指定的镜像
docker image rm mysql:5.6.31 centos:latest
# 批量删除, -f 代表强制删除，因为镜像有实例在运行的话，默认不让删除
docker image rm $(docker image ls -q) -f
```

## 三、Docker容器

### 1、容器启动（run）

> 参考链接：https://www.cnblogs.com/vikings-blog/p/4238062.html
>
> 或者 输入： docker run --help
>
> 调用格式：docker run [OPTIONS] IMAGE [COMMAND] [ARG...] 