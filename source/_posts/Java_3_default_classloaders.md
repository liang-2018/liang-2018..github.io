---
title: Java类加载器--默认的三种类加载器
toc: true
mathjax: true
date: 2019-02-12 18:52:23
top: 1
tags: JDK
categories: Source Code
---


> 作者：可乐丶 
> 来源：CSDN 
> 原文：https://blog.csdn.net/u013412772/article/details/80837735 
> 版权声明：本文为博主原创文章，转载请附上博文链接！

<!-- more -->

文章引用:

> https://blog.csdn.net/mggwct/article/details/53977898 
>  https://blog.csdn.net/briblue/article/details/54973413 
>  https://blog.csdn.net/fuzhongmin05/article/details/57404890/
> https://blog.csdn.net/irelandken/article/details/7048817

## 一 什么是ClassLoader
大家都知道，当我们写好一个Java程序之后，不是管是CS还是BS应用，都是由若干个.class文件组织而成的一个完整的Java应用程序，当程序在运行时，即会调用该程序的一个入口函数来调用系统的相关功能，而这些功能都被封装在不同的class文件当中，所以经常要从这个class文件中要调用另外一个class文件中的方法，如果另外一个文件不存在的，则会引发系统异常。而程序在启动的时候，并不会一次性加载程序所要用的所有class文件，而是根据程序的需要，通过Java的类加载机制（ClassLoader）来动态加载某个class文件到内存当中的，从而只有class文件被载入到了内存之后，才能被其它class所引用。所以ClassLoader就是用来动态加载class文件到内存当中用的。

其中具体加载过程为:JVM加载.class字节码到内存,而.class文件时怎么被加载到JVM中的就是Java ClassLoader需要做的事情.

### JVM什么时候加载.class文件

> + 当执行new操作时候
> + 当执行Class.forName(“包路径 + 类名”)\ Class.forName(“包路径 + 类名”, ClassLoader)\ ClassLoader.loadClass(“包路径 + 类名”)

以上情况都会触发类加载器去类加载对应的路径去查找对应的.class文件,并创建Class对象.

不过第((2))方式加载字节码到内存后生产的只是一个Class对象,要得到具体的对象实例还需要使用Class对象的newInstance()方法来创建具体实例.

再引用一段话来说明什么是类加载器:

> 虚拟机设计团队把类加载阶段中的“通过一个类的全限定名来获取描述此类的二进制字节流”这个动作放到Java虚拟机外部去实现，以便让应用程序自己决定如何去获取所需要的类。实现这个动作的代码模块称为“类加载器”。

> 类加载器可以说是Java语言的一项创新，也是Java语言流行的重要原因之一，它最初是为了满足Java Applet的需求而开发出来的。虽然目前Java Applet技术基本上已经“死掉”，但类加载器却在类层次划分、OSGi、热部署、代码加密等领域大放异彩，成为了Java技术体系中一块重要的基石，可谓是失之桑榆，收之东隅。

> 类加载器虽然只用于实现类的加载动作，但它在Java程序中起到的作用却远远不限于类加载阶段。对于任意一个类，都需要由加载它的类加载器和这个类本身一同确立其在Java虚拟机中的唯一性，每一个类，都拥有一个独立的类名称空间。这句话可以表达得更通俗一些：比较两个类是否“相等”，只有在这两个类是由同一个类加载器加载的前提下才有意义。否则，即使这两个类来源于同一个Class文件，被同一个虚拟机加载，只要加载它们的类加载器不同，那这两个类就必定不相等。

## 二 AppClassLoader
AppClassLoader应用类加载器,又称为系统类加载器,负责在JVM启动时,加载来自在命令java中的classpath或者java.class.path系统属性或者CLASSPATH操作系统属性所指定的JAR类包和类路径.
```java
public class AppClassLoaderTest {

    public static void main(String[] args) {
        System.out.println(ClassLoader.getSystemClassLoader());
    }

}
```
输出结果如下:

sun.misc.Launcher$AppClassLoader@73d16e93

以上结论说明调用ClassLoader.getSystemClassLoader()可以获得AppClassLoader类加载器.
```java
protected ClassLoader() {
    this(checkCreateClassLoader(), getSystemClassLoader());
}
```
通过查看ClassLoader的源码发现并且在没有特定说明的情况下,用户自定义的任何类加载器都将该类加载器作为自定义类加载器的父加载器.
```java
String classPath = System.getProperty("java.class.path");
for (String path : classPath.split(";")) {
    System.out.println(path);
}
```

通过执行上面的代码即可获得classpath的加载路径.

在上面的main函数的类的加载就是使用AppClassLoader加载器进行加载的,可以通过执行下面的代码得出这个结论
```java
public class AppClassLoaderTest {

    public static void main(String[] args) {
        ClassLoader classLoader = Test.class.getClassLoader();
        System.out.println(classLoader);
        System.out.println(classLoader.getParent());
    }
    
    private static class Test {
    
    }

}
```
执行结果如下:

> sun.misc.Launcher\$AppClassLoader@73d16e93
> sun.misc.Launcher\$ExtClassLoader@15db9742

从上面的运行结果可以得知AppClassLoader的父加载器是ExtClassLoader,接下来继续说一下ExtClassLoader类加载器.

## 三 ExtClassLoader
ExtClassLoader称为扩展类加载器，主要负责加载Java的扩展类库,默认加载JAVA_HOME/jre/lib/ext/目录下的所有jar包或者由java.ext.dirs系统属性指定的jar包.放入这个目录下的jar包对AppClassLoader加载器都是可见的(因为ExtClassLoader是AppClassLoader的父加载器,并且Java类加载器采用了委托机制).

ExtClassLoader的类扫描路径通过执行下面代码来看一下:
```java
String extDirs = System.getProperty("java.ext.dirs");
for (String path : extDirs.split(";")) {
System.out.println(path);
}
```
执行结果如下:

> C:\Java\jdk1.8.0_101\jre\lib\ext
> C:\Windows\Sun\Java\lib\ext

其中C:\Java\jdk1.8.0_101\jre\lib\ext路径下内容为: 

![jre_lib_ext](https://img-blog.csdn.net/201806280927438?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTM0MTI3NzI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

从上面的路径中随意选择一个类,来看看他的类加载器是什么:
```java
ClassLoader classLoader = sun.security.ec.SunEC.class.getClassLoader();
System.out.println(classLoader);
System.out.println(classLoader.getParent());
```
执行结果如下:

> sun.misc.Launcher$ExtClassLoader@6bc7c054
> null

从上面的程序运行结果可知ExtClassLoader的父加载器为null.

## 四 BootstrapClassLoader
称为启动类加载器，是Java类加载层次中最顶层的类加载器，负责加载JDK中的核心类库，如：rt.jar、resources.jar、charsets.jar等，可通过如下程序获得该类加载器从哪些地方加载了相关的jar或class文件：
```java
URL[] urLs = sun.misc.Launcher.getBootstrapClassPath().getURLs();
for (URL url : urLs) {
    System.out.println(url.toExternalForm());
}
```
程序执行结果如下:

> file:/C:/Java/jdk1.8.0_101/jre/lib/resources.jar
> file:/C:/Java/jdk1.8.0_101/jre/lib/rt.jar
> file:/C:/Java/jdk1.8.0_101/jre/lib/sunrsasign.jar
> file:/C:/Java/jdk1.8.0_101/jre/lib/jsse.jar
> file:/C:/Java/jdk1.8.0_101/jre/lib/jce.jar
> file:/C:/Java/jdk1.8.0_101/jre/lib/charsets.jar
> file:/C:/Java/jdk1.8.0_101/jre/lib/jfr.jar
> file:/C:/Java/jdk1.8.0_101/jre/classes

从rt.jar中选择String类,看一下String类的类加载器是什么
```java
ClassLoader classLoader = String.class.getClassLoader();
System.out.println(classLoader);
```
执行结果如下:

> null

可知由于BootstrapClassLoader对Java不可见,所以返回了null,我们也可以通过某一个类的加载器是否为null来作为判断该类是不是使用BootstrapClassLoader进行加载的依据.另外上面提到ExtClassLoader的父加载器返回的是null,那是否说明ExtClassLoader的父加载器是BootstrapClassLoader?

>  Bootstrap ClassLoader是由C/C++编写的，它本身是虚拟机的一部分，所以它并不是一个JAVA类，也就是无法在java代码中获取它的引用，JVM启动时通过Bootstrap类加载器加载rt.jar等核心jar包中的class文件，之前的int.class,String.class都是由它加载。然后呢，我们前面已经分析了，JVM初始化sun.misc.Launcher并创建Extension ClassLoader和AppClassLoader实例。并将ExtClassLoader设置为AppClassLoader的父加载器。Bootstrap没有父加载器，但是它却可以作用一个ClassLoader的父加载器。比如ExtClassLoader。这也可以解释之前通过ExtClassLoader的getParent方法获取为Null的现象