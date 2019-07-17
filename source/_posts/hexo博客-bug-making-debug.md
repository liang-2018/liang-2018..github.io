---
title: hexo博客踩坑
toc: true
mathjax: true
date: 2018-12-08 19:52:23
tags: hexo
categories: tools
---

> 每次写完markdown笔记后上传到csdn都是件恼火的事情，如果没有图片，倒也方便，若是有较多图片，那就脑壳疼了。起意很久，还是用github&gitee实践一波自己的博客吧。期间遇到很多bug，**感谢文末链接**中的大佬们，前人踩坑，后来者接着踩。

<!-- more -->
# 环境搭建

1. 安装Git

   > 在Windows系统，部署相关指令主要在Git Bash中运行
   >
   > 博客发布在Gitee/Github上都需要使用到Git

2. 安装Node.js

3. 安装hexo及初始化本地博客

> Hexo相关指令介绍
>
> + hexo init ：初始化本地博客
>
> ```bash
> $ hexo init <folder> # 在指定文件夹初始化项目
> $ hexo init # 在当前文件夹初始化项目
> ```
> + hexo generate： 通过markdown文件生成静态网页
>
> + hexo deploy：将public文件夹中的静态资源发布到指定仓库
>
> ```bash
> $ hexo generate --watch # 一般默认自带--watch，根据文件的sha1值以比对文件是否改动，从而及时刷新
> $ hexo generate --deploy
> $ hexo deploy --generate # 两者的效果一样，生成完毕后自动部署
> ```
>
> ```bash
> $ hexo g -d
> $ hexo d -g # 上面两个指令的简写，同理，hexo server 可以简写为 hexo s
> ```
> + hexo server：在本地发布服务，提供访问
>
> ```bash
> # 安装服务器模块，3.0默认是个别模块
> $ npm install hexo-server --save
> $ hexo server -p 5000 # 指定端口发布
> $ hexo server -s # 静态模式，不会动态跟进source文件夹文件变动
> $ hexo server -i ip_addr # 一般不会用到这种骚操作
> ```
>
> + hexo new：新建页面或者blog
>
> ```bash
>   $ hexo new [layout] <title> 
> # layout默认是_post,可以在_config.yml中的default_layout修改对应参数，
> # 同时如果标题包含空格，用括号将内容包裹  
> ```
>
> ```bash
> $ hexo new page page_name # 新建页面，提供访问，可以在主题的 _config.yml中修改提供访问 
> ```
> + hexo clean: 清除缓存文件(db.json)和已生成的静态文件(public文件夹中内容)，在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行该命令。
>
>  [其他命令详情见](https://hexo.io/zh-cn/docs/commands.html)

```bash
# 在指定文件夹中新建所需要的文件，如果后续不接参数，则在当前文件夹建立
hexo init <folder> 
cd <folder>
# 根据对应的package.json安装相关的npm依赖包
npm install
```

建立完成后，指定文件夹目录如下

```bash
.
├── _config.yml # 网站的相关配置信息
├── package.json # 应用程序的信息，及相关依赖
├── scaffolds # 模板文件夹，新建页面和文章时，会根据模板初始化
├── source # 资源文件夹，_posts 文件夹之外，开头命名为 _ (下划线)的文件 / 文件夹和隐藏的文件将会被忽略。
|   ├── _drafts 
|   └── _posts 
└── themes # 主题文件夹，hexo根据不同的主题生成静态页面
```

4. 将本地博客同步到仓库（Gitee/Coding/Github等）

   发布前预备工作，以git为例，其他代码托管网站原理一致

> + 安装 hexo-deployer-git
>
> ```bash
> $ npm install hexo-deployer-git --save
> ```
> + 修改_config.yml配置文件,**冒号后务必有空格**
> ```yml
> deploy:
> - type: git
>     repo: <repository url>
>     branch: [branch]
>     message: [message]
> - type: git
>     repo: <repository url>
>     branch: [branch]
>     message: [message]
> ```
> 仓库取名：默认情况不是子目录，需要将仓库名取为: **<用户名>.github.io** 这样命名，github的page服务会自动识别处理，否则需要额外设置子目录，如果想在子目录发布，需要额外在_config.yml中配置
>
> 分支名称：如果您使用的是 GitHub 或 GitCafe 的话，程序会尝试自动检测。也可以在仓库中的setting中勾选GitHub Pages勾选分支
>
> + 其他如Heroku、Netlify、Rsync等[详见官网文档](https://hexo.io/zh-cn/docs/deployment)
> + 附：在子目录中发布参数修改
>
> ```yml
> url: <github仓库地址> # 仓库访问地址
> root: <子目录> # 一般子目录也就是项目名
> ```
>

# 主题选择与优化

主题有多种，各种折腾后，最后我选择的next主题。

[hexo的next主题个性化教程：打造炫酷网站](https://blog.csdn.net/qq_33699981/article/details/72716951)

# 相关插件配置

1. 本地搜索

2. 评论

   [评论系统从Disqus到Valine - 简书](https://www.jianshu.com/p/532acf1d41c1)

3. 公式支持

   [hexo next主题解决无法显示数学公式 - MrYx - CSDN博客](https://blog.csdn.net/yexiaohhjk/article/details/82526604)

   [在Hexo中使用mathjax渲染数学公式 - DH's Den - CSDN博客](https://blog.csdn.net/u013282174/article/details/80666123)

# 相关参考链接

[Hexo主题更改以及小功能的添加](https://www.jianshu.com/p/c9de55660d1b)

[Hexo博客教程(二):基本功能和网站优化](https://www.jianshu.com/p/2a70262295e4?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)

[hexo生成博文插入图片](https://blog.csdn.net/sugar_rainbow/article/details/57415705)

[Hexo添加categories页面](https://www.voidking.com/2018/06/11/deve-hexo-categories/)

[hexo的next主题个性化教程：打造炫酷网站](https://blog.csdn.net/qq_33699981/article/details/72716951)

[Hexo 博客优化之博客美化（看板娘/鼠标点击爱心字体烟花爆炸效果/自定义鼠标指针样式/彩色滚动变换字体/背景音乐/网页标题恶搞/动态线条/人体时钟挂件/雪花飘落/背景动态彩带......）](https://blog.csdn.net/qq_36759224/article/details/85420403)

[hexo添加小功能 - 青花猪的忧伤的博客 - CSDN博客](https://blog.csdn.net/qq_43020645/article/details/82793753)

[hexo next主题解决无法显示数学公式 - MrYx - CSDN博客](https://blog.csdn.net/yexiaohhjk/article/details/82526604)

[在Hexo中使用mathjax渲染数学公式 - DH's Den - CSDN博客](https://blog.csdn.net/u013282174/article/details/80666123)

[遇见西门 - simon96.online](https://www.simon96.online/)

[Hexo使用细节及各种问题 - Selier的博客 - CSDN博客](https://blog.csdn.net/the_liang/article/details/82288346)

[Hexo博客之速度优化 - 简书](https://www.jianshu.com/p/93b63852f0b3)