---
title: Class源码阅读
toc: true
mathjax: true
date: 2019-02-13 18:52:23
tags: JDK
categories: Source Code
---

> Class 类 源码粗读

<!-- more -->

## 一. 获取 Class 实例途径

+ 通过应用类型调用 getClass() 方法获取
+ 使用类的 class 成员属性
+ 使用 Class 类的 forName(String class_path) 获取，该方法只能用于引用类型
+ 其他方式，通过包装类 TYPE 属性获取

## 二.常用方法

### 1. toGenericString()

> 返回类的构造方法相关字段,使用 StringBuilder 进行拼接
> 如Set会返回public abstract interface java.util.Set<E>  
> 但是如果是9种原始类型（8种基础数据类型和void类型）则相当于调用toString方法

### 2. forName(String)

> 通过给出的类名或者接口名，返回对应的对象，利用反射和类的加载器实现

```java
//返回对应类的实例
Object a = Class.forName("java.lang.Object").newInstance();
System.out.println(a.toString()); // java.lang.Object@5ce5c367
```

```java
 public static Class<?> forName(String className)
                throws ClassNotFoundException {
        Class<?> caller = Reflection.getCallerClass();
        return forName0(className, true, ClassLoader.getClassLoader(caller), caller);
    }

 public static Class<?> forName(String name, boolean initialize,
                                   ClassLoader loader)
        throws ClassNotFoundException
    {
        Class<?> caller = null;
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            // Reflective call to get caller class is only needed if a security manager
            // is present.  Avoid the overhead of making this call otherwise.
            caller = Reflection.getCallerClass();
            if (sun.misc.VM.isSystemDomainLoader(loader)) {
                ClassLoader ccl = ClassLoader.getClassLoader(caller);
                if (!sun.misc.VM.isSystemDomainLoader(ccl)) {
                    sm.checkPermission(
                        SecurityConstants.GET_CLASSLOADER_PERMISSION);
                }
            }
        }
        return forName0(name, initialize, loader, caller);
    }
```

### 3. newInstance()

> 创建类的实例，实例化时使用的空参构造
> 该方法的避开了编译时错误以提升效率，编译时错误由编译器检查
>
> 使用newInstance()方法时，必须保证：1、这个类已经加载；2、这个类已经连接了。而完成上面两个步骤的正是Class的静态方法forName()所完成的，这个静态方法调用了启动类加载器，即加载java API的加载器。

new关键字和newInstance()方法的区别：

> + newInstance: 弱类型。低效率。只能调用无参构造。 
> + new: 强类型。相对高效。能调用任何public构造

Constructor.newInstance()与Class.newInstance()区别：

> Class.newInstance() 只能够调用无参的构造函数，即默认的构造函数； 
> Constructor.newInstance() 可以根据传入的参数，调用任意构造构造函数。
>
> Class.newInstance() 抛出所有 由被调用构造函数抛出的异常。
> Class.newInstance() 要求被调用的构造函数是可见的，也即必须是public类型的; 
> Constructor.newInstance() 在特定的情况下，可以调用私有的构造函数。

```java
 public T newInstance()
        throws InstantiationException, IllegalAccessException
    {
        if (System.getSecurityManager() != null) {
            checkMemberAccess(Member.PUBLIC, Reflection.getCallerClass(), false);
        }

        // NOTE: the following code may not be strictly correct under
        // the current Java memory model.

        // Constructor lookup
        if (cachedConstructor == null) {
            if (this == Class.class) {
            // 如果加载的类是 Class 类，则报错;即类似如调用则抛出 
			//	Can not call newInstance() on the Class for java.lang.Class 异常
            /*
            	Class clazz = Class.forName("java.lang.Class");
				clazz.newInstance(); 
            */
                throw new IllegalAccessException(
                    "Can not call newInstance() on the Class for java.lang.Class"
                );
            }
            try {
                Class<?>[] empty = {};
                //获取空参构造方法
                final Constructor<T> c = getConstructor0(empty, Member.DECLARED);
                // Disable accessibility checks on the constructor
                // since we have to do the security check here anyway
                // (the stack depth is wrong for the Constructor's
                // security check to work)
                java.security.AccessController.doPrivileged(
                    new java.security.PrivilegedAction<Void>() {
                        public Void run() {
                                c.setAccessible(true);
                                return null;
                            }
                        });
                cachedConstructor = c;// 将构造方法存储起来
            } catch (NoSuchMethodException e) {
                throw (InstantiationException)
                    new InstantiationException(getName()).initCause(e);
            }
        }
        // 通过之前缓存的构造方法定义临时构造方法
        Constructor<T> tmpConstructor = cachedConstructor;
        // Security check (same as in java.lang.reflect.Constructor)
        int modifiers = tmpConstructor.getModifiers();
        if (!Reflection.quickCheckMemberAccess(this, modifiers)) {
            Class<?> caller = Reflection.getCallerClass();
            if (newInstanceCallerCache != caller) {
                Reflection.ensureMemberAccess(caller, this, null, modifiers);
                newInstanceCallerCache = caller;
            }
        }
        // Run constructor
        try {
        // 通过临时构造方法创建实例，并返回
            return tmpConstructor.newInstance((Object[])null);
        } catch (InvocationTargetException e) {
            Unsafe.getUnsafe().throwException(e.getTargetException());
            // Not reached
            return null;
        }
    }
```

### 4. getResourceAsStream

> 1. Class.getResourceAsStream(String path) ： path 不以’/'开头时默认是从此类所在的包下取资源，以’/'开头则是从ClassPath根下获取。其只是通过path构造一个绝对路径，最终还是由ClassLoader获取资源。 
> 2. Class.getClassLoader.getResourceAsStream(String path) ：默认则是从ClassPath根下获取，path不能以’/'开头，最终是由ClassLoader获取资源。 
> 3. ServletContext. getResourceAsStream(String path)：默认从WebAPP根目录下取资源，Tomcat下path是否以’/'开头无所谓，当然这和具体的容器实现有关。 
> 4. Jsp下的application内置对象就是上面的ServletContext的一种实现

getResourceAsStream 主要用法：

> + 前面有“/”。“/”代表了工程的classpath，即编译后 classes 文件夹，一般文件在类的上级目录时使用
>   例如“/”代表了项目的classpath
>   me.class.getResourceAsStream("/com/x/file/myfile.xml"); 
>
> + 前面没有“/”。代表类所处目录，一般文件和类在同目录(或同处一个大目录) ，用这种方式
>   me.class.getResourceAsStream("myfile.xml"); 
>   me.class.getResourceAsStream("file/myfile.xml"); 

```java
// 原理与 getResource 差不多，看下面 getResource 解释就成，只不过这个是返回InputStream 而 getResource 返回的是 URL
public InputStream getResourceAsStream(String name) { 
        name = resolveName(name);
        ClassLoader cl = getClassLoader0();
        if (cl==null) {
            // A system class.
            return ClassLoader.getSystemResourceAsStream(name);
        }
        return cl.getResourceAsStream(name);
    }
```

### 5. getResource

> 从最终生成的.class文件为着手点，不要以.java文件的路径为出发点，因为真正使用的就是.class，不会拿个.java文件使用。path不以'/'开头时，我们就能获取与当前类所在的路径相对路径的资源文件(将包路径的点换成反斜杠)，而以'/'开头时可以获取ClassPath根下任意路径的资源

```java
public java.net.URL getResource(String name) {
        name = resolveName(name);// 将字符串做预处理便于类加载器处理
        ClassLoader cl = getClassLoader0();
    // 如果该类由 the bootstrap class loader(启动类加载器) 加载，则方法授权给ClassLoader.getSystemResource来加载资源
        if (cl==null) {       
            // A system class.
            return ClassLoader.getSystemResource(name);
        }
        return cl.getResource(name);
    }
```

```java
//Add a package name prefix if the name is not absolute, Remove leading "/" if name is absolute 
// 如果字符串不是绝对路径，则添加包前缀(文件相对路径的前缀)，
// 如果字符串是绝对路径，将开头的 "/" 去掉
private String resolveName(String name) {
        if (name == null) {
            return name;
        }
        if (!name.startsWith("/")) {
            Class<?> c = this;
            while (c.isArray()) {
                c = c.getComponentType();
            }
            String baseName = c.getName();
            int index = baseName.lastIndexOf('.');
            if (index != -1) {
                name = baseName.substring(0, index).replace('.', '/')
                    +"/"+name;
            }
        } else {
            name = name.substring(1);
        }
        return name;
    }
```



### 判断相关方法

| 方法名              | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| isLocalClass        | *是不是局部类*                                               |
| isMemberClass       | *是不是成员内部类*                                           |
| isAnonymousClass    | *是不是匿名类*                                               |
| isAnnotation        | *是否是注释类型*                                             |
| isAnnotationPresent | 是否指定类型的注释存在于此元素                               |
| isAssignableFrom    | 此 Class 对象所表示的类或接口与指定的 Class 参数所表示的类或接口是否相同，或是否是其超类或超接口 |
| isEnum              | 当且仅当该类声明为源代码中的枚举时返回 true                  |
| isInstance          | Object 是否与此 Class 所表示的对象赋值兼容                   |
| isInterface         | Class 对象是否表示一个接口类型                               |
| isPrimitive         | Class 对象是否表示一个基本类型                               |
| isSynthetic         | 此类是否为复合类                                             |

### [反射相关方法](https://blog.csdn.net/pan_junbiao/article/details/85236087)

<table border="1" cellpadding="1" cellspacing="1"><thead><tr><th scope="col" style="width:120px;">组成部分</th>
			<th scope="col" style="width:271px;">访问方法</th>
			<th scope="col" style="width:146px;">返回值类型</th>
			<th scope="col" style="width:352px;">说明</th>
		</tr></thead><tbody><tr><td style="width:82px;">包路径</td>
			<td style="width:271px;">getPackage()&nbsp;</td>
			<td style="width:146px;">Package对象</td>
			<td style="width:352px;">获取该类的存放路径</td>
		</tr><tr><td colspan="1" rowspan="3" style="width:82px;">类名称</td>
			<td style="width:271px;">getName()&nbsp;</td>
			<td style="width:146px;">String对象</td>
			<td style="width:352px;">获取该类的名称</td>
		</tr><tr><td style="width:271px;">getSimpleName()</td>
			<td style="width:146px;">String对象</td>
			<td style="width:352px;">源代码中给出的底层类的简称。如果底层类是匿名的则返回一个空字符串</td>
		</tr>tr><td style="width:271px;">getCanonicalName()</td>
			<td style="width:146px;">String对象</td>
			<td style="width:352px;">底层类规范化名称</td>
		</tr><tr><td style="width:82px;">继承类</td>
			<td style="width:271px;">getSuperclass()</td>
			<td style="width:146px;">Class对象</td>
			<td style="width:352px;">获取该类继承的类</td>
		</tr><tr><td style="width:82px;">实现接口</td>
			<td style="width:271px;">getInterfaces()</td>
			<td style="width:146px;">Class型数组</td>
			<td style="width:352px;">获取该类实现的所有接口</td>
		</tr><tr><td colspan="1" rowspan="4" style="width:82px;">构造方法</td>
			<td style="width:271px;">getConstructors()</td>
			<td style="width:146px;">Constructor型数组</td>
			<td style="width:352px;">获取所有权限为public的构造方法</td>
		</tr><tr><td style="width:271px;">getConstructor(Class&lt;?&gt;... parameterTypes)</td>
			<td style="width:146px;">Constructor对象</td>
			<td style="width:352px;">获取权限为public的指定构造方法</td>
		</tr><tr><td style="width:271px;">getDeclaredConstructors()</td>
			<td style="width:146px;">Constructor型数组</td>
			<td style="width:352px;">获取所有构造方法，按照声明顺序返回</td>
		</tr><tr><td style="width:271px;">getDeclaredConstructor(Class&lt;?&gt;... parameterTypes)</td>
			<td style="width:146px;">Constructor对象</td>
			<td style="width:352px;">获取指定构造方法</td>
		</tr><tr><td colspan="1" rowspan="4" style="width:82px;">方法</td>
			<td style="width:271px;">getMethods()</td>
			<td style="width:146px;">Method型数组</td>
			<td style="width:352px;">获取所有权限为public的方法</td>
		</tr><tr><td style="width:271px;">getMethod(String name, Class&lt;?&gt;... parameterTypes)</td>
			<td style="width:146px;">Method对象</td>
			<td style="width:352px;">获取权限为public的指定方法</td>
		</tr><tr><td style="width:271px;">getDeclaredMethods()</td>
			<td style="width:146px;">Method型数组</td>
			<td style="width:352px;">获取所以方法，按照声明顺序返回</td>
		</tr><tr><td style="width:271px;">getDeclaredMethod(String name, Class&lt;?&gt;... parameterTypes)</td>
			<td style="width:146px;">Method对象</td>
			<td style="width:352px;">获取指定方法</td>
		</tr><tr><td colspan="1" rowspan="4" style="width:82px;">成员变量</td>
			<td style="width:271px;">getFields()</td>
			<td style="width:146px;">Field型数组</td>
			<td style="width:352px;">获取所有权限为public的成员变量</td>
		</tr><tr><td style="width:271px;">getField(String name)</td>
			<td style="width:146px;">Field对象</td>
			<td style="width:352px;">获取权限为public的指定成员变量</td>
		</tr><tr><td style="width:271px;">getDeclaredFields()</td>
			<td style="width:146px;">Field型数组</td>
			<td style="width:352px;">获取所有成员变量，按照声明顺序返回</td>
		</tr><tr><td style="width:271px;">getDeclaredField(String name)</td>
			<td style="width:146px;">Field对象</td>
			<td style="width:352px;">获取指定成员变量</td>
		</tr><tr><td colspan="1" rowspan="2" style="width:82px;">内部类</td>
			<td style="width:271px;">getClasses()</td>
			<td style="width:146px;">Class型数组</td>
			<td style="width:352px;">获取所有权限为public的内部类</td>
		</tr><tr><td style="width:271px;">getDeclaredClasses()</td>
			<td style="width:146px;">Class型数组</td>
			<td style="width:352px;">获取所有内部类</td>
		</tr><tr><td style="width:82px;">内部类的声明类</td>
			<td style="width:271px;">getDeclaringClass()</td>
			<td style="width:146px;">Class对象</td>
			<td style="width:352px;">如果该类的内部类，则返回它的成员类，否则返回null</td>
		</tr></tbody></table>

### Modifier 值对应含义

> Class.getModifiers()

```java
	public static final int PUBLIC           = 0x00000001;

    public static final int PRIVATE          = 0x00000002;

    public static final int PROTECTED        = 0x00000004;

    public static final int STATIC           = 0x00000008;

    public static final int FINAL            = 0x00000010;

    public static final int SYNCHRONIZED     = 0x00000020;

    public static final int VOLATILE         = 0x00000040;

    public static final int TRANSIENT        = 0x00000080;

    public static final int NATIVE           = 0x00000100;

    public static final int INTERFACE        = 0x00000200;

    public static final int ABSTRACT         = 0x00000400;

    public static final int STRICT           = 0x00000800;

    // Bits not (yet) exposed in the public API either because they
    // have different meanings for fields and methods and there is no
    // way to distinguish between the two in this class, or because
    // they are not Java programming language keywords
    static final int BRIDGE    = 0x00000040;
    static final int VARARGS   = 0x00000080;
    static final int SYNTHETIC = 0x00001000;
    static final int ANNOTATION  = 0x00002000;
    static final int ENUM      = 0x00004000;
    static final int MANDATED  = 0x00008000;
public static String toString(int mod) {
        StringBuilder sb = new StringBuilder();
        int len;

        if ((mod & PUBLIC) != 0)        sb.append("public ");
        if ((mod & PROTECTED) != 0)     sb.append("protected ");
        if ((mod & PRIVATE) != 0)       sb.append("private ");

        /* Canonical order */
        if ((mod & ABSTRACT) != 0)      sb.append("abstract ");
        if ((mod & STATIC) != 0)        sb.append("static ");
        if ((mod & FINAL) != 0)         sb.append("final ");
        if ((mod & TRANSIENT) != 0)     sb.append("transient ");
        if ((mod & VOLATILE) != 0)      sb.append("volatile ");
        if ((mod & SYNCHRONIZED) != 0)  sb.append("synchronized ");
        if ((mod & NATIVE) != 0)        sb.append("native ");
        if ((mod & STRICT) != 0)        sb.append("strictfp ");
        if ((mod & INTERFACE) != 0)     sb.append("interface ");

        if ((len = sb.length()) > 0)    /* trim trailing space */
            return sb.toString().substring(0, len-1);
        return "";
    }
```

## 三、内部类

> 待完善........

## 参考链接

[深入理解Java类型信息(Class对象)与反射机制](https://blog.csdn.net/javazejian/article/details/70768369)

[Java反射：Class类的使用](https://blog.csdn.net/pan_junbiao/article/details/85236087)

[Instance() 的参数版本与无参数版本详解](https://xiaohuafyle.iteye.com/blog/1607258)