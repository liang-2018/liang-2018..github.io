---
title: Thread 源码粗读
toc: true
mathjax: true
date: 2019-02-15 18:55:23
tags: JDK
categories: Source Code
---

> Thread 源码粗度

<!-- more -->

## 一、线程基本知识

### 1. 线程特性

+ 每个线程都可以设置优先级、名字等
+ 线程在启动之前可以标记为守护线程

### 2. 线程状态

+ 新建(New) 
+ 就绪(Runnable) : 线程对象创建后，其他线程调用了该对象的 start() 方法来启动该线程
+ 运行(Running) : 合适的时间和权限，cpu 会执行该线程，线程**只能从就绪状态进入运行状态**
+ 阻塞(Blocked) : 因某种原因暂时停止运行，转变为就绪状态
  + 等待阻塞
  + 同步阻塞
  + 其他阻塞
+ 死亡(Dead) : 线程执行完或因一场退出 run() 方法，线程生命周期结束

```java
// 状态由 Thread 的内部类 State 定义
public enum State {
        NEW,  // 尚未执行start
        RUNNABLE, // 已执行start()方法，但是不一定已执行，可能在等待系统处理
        BLOCKED, // 等待监视器给锁权限
        WAITING, // 在调用 Object.wait(),join(),LockSuppot.park()后可能导致
        TIMED_WAITING,// 与 WAITING 类似，但是指定了等待的时间 如：Object.wait(long)
        TERMINATED; // 线程被强行终止或已执行完
}
```

### 3. 线程实现方式

+ 继承 Thread 类创建线程 : Java 单继承，存在局限性
+ 实现 Runnable 接口创建线程
  + 手动 实现 Runnable 接口 ：自己写的线程可能考虑不全面
  + 实现 Callable 接口，通过 FutureTask 包装器创建 Thread 线程
  + 使用 Executor 框架实现有返回接口的线程

## 二、 源码粗读

### 1. 线程属性

```java
// 部分线程属性
private String name; // 线程名
private ClassLoader contextClassLoader; // 上下文类加载器
private boolean daemon; // 用于标记是否为守护线程
private State state; // 用于记录和控制线程的状态
private long id; // 线程id
private boolean interrupted; // 用于记录线程是否接受的中断信号
private int priority; // 用于记录了线程优先级，默认为5，最大为10，最小为1
private boolean alive; // 用于记录线程是否在已结束
private ThreadGroup threadGroup; // 线程组，很少用到
private static long threadSeqNumber; // 用于记录生成的 线程id
private StackTraceElement[] stackTrace;
```

### 2. 部分方法

###  nextThreadID

> 生成下一个线程的id

```java
private static synchronized long nextThreadID() {
        return ++threadSeqNumber;
}
private static synchronized int nextThreadNum() { // 用于自动标号匿名线程
        return threadInitNumber++;
}
```

### sleep

> 根据纳秒，进行四舍五入

```java
public static void sleep(long millis, int nanos)
    throws InterruptedException {
        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }
        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
                                "nanosecond timeout value out of range");
        }
        if (nanos >= 500000 || (nanos != 0 && millis == 0)) {
            millis++;
        }
        sleep(millis);
    }
```

### init

> 线程初始化，Thread 所有的构造器都是调用的这个方法
>
> 构造器传参时，如果没有指定线程名，则系统生成线程名： "Thread-" + nextThreadNum()
> Runnable target 可以传入指定的 run() 方法，用于执行
>  long stackSize 指定新线程的希望的栈空间大小，如果传入 0 则忽略此参数
> AccessControlContext 不详，貌似用于安全管理
> inheritThreadLocals：是否继承当前线程的 thread-locals 属性

```java
private void init(ThreadGroup g, Runnable target, String name,
                      long stackSize, AccessControlContext acc,
                      boolean inheritThreadLocals) {
        if (name == null) {
            throw new NullPointerException("name cannot be null");
        }
        this.name = name;
        Thread parent = currentThread();
        SecurityManager security = System.getSecurityManager();
        if (g == null) {
            /* Determine if it's an applet or not */
            /* If there is a security manager, ask the security manager
               what to do. 
               判断是否为小程序，如果有安全管理器，则让安全管理器指定线程组
               */
            if (security != null) {
                g = security.getThreadGroup();
            }
            /* If the security doesn't have a strong opinion of the matter
               use the parent thread group. 
               如果未指定线程组，则使用父线程的线程组
               */
            if (g == null) {
                g = parent.getThreadGroup();
            }
        }

        /* checkAccess regardless of whether or not threadgroup is
           explicitly passed in. 
           验证是否 threadgroup 是否明确传入
           */
        g.checkAccess();

        /*
         * Do we have the required permissions? 检验是否有所需权限
         */
        if (security != null) {
            if (isCCLOverridden(getClass())) {
                security.checkPermission(SUBCLASS_IMPLEMENTATION_PERMISSION);
            }
        }

        g.addUnstarted();
		// 设置后续相关参数
        this.group = g;
        this.daemon = parent.isDaemon(); // 在运行前可以调用set方法修改，默认继承父线程的值
        this.priority = parent.getPriority();
        if (security == null || isCCLOverridden(parent.getClass()))
            this.contextClassLoader = parent.getContextClassLoader();
        else
            this.contextClassLoader = parent.contextClassLoader;
        this.inheritedAccessControlContext =
                acc != null ? acc : AccessController.getContext();
        this.target = target;
        setPriority(priority);
        if (inheritThreadLocals && parent.inheritableThreadLocals != null)
            this.inheritableThreadLocals =
                ThreadLocal.createInheritedMap(parent.inheritableThreadLocals);
        /* Stash the specified stack size in case the VM cares */
        this.stackSize = stackSize;
        /* Set thread ID */
        tid = nextThreadID(); // 设置线程id
    }
```

### start

>  启动线程，执行run方法

```java
	public synchronized void start() {
        /**
         * This method is not invoked for the main method thread or "system"
         * group threads created/set up by the VM. Any new functionality added
         * to this method in the future may have to also be added to the VM.
         * 
         * A zero status value corresponds to state "NEW".
         状态码为 0 时对应 状态为 new，保证线程只能启动一次
         */
        if (threadStatus != 0)
            throw new IllegalThreadStateException();

        /* Notify the group that this thread is about to be started
         * so that it can be added to the group's list of threads
         * and the group's unstarted count can be decremented. 
         通知线程组，此线程即将启动，该线程加入到线程组李彪，同时线程组未启动线程数量减少
         */
        group.add(this);

        boolean started = false;
        try {
            start0(); // 调用native 方法
            started = true;
        } finally {
            try {
                if (!started) {
                    group.threadStartFailed(this);
                }
            } catch (Throwable ignore) {
                // 如果启动失败，啥也不用干，本地库会处理，传递到调用栈中
                /* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */
            }
        }
    }
public void run() { // 本身没有写run方法具体，需要传入的 Runnable 对象指定具体细节
        if (target != null) {
            target.run();
        }
}
```

### exit

> 在清除相关内容后退出线程并
> 相比 stop()方法，更柔和，允许线程处理完一定内容后退出，而不像stop()直接暴力退出
> stop() 方法已弃用，原则上不再使用，存在较大隐患。

```java
private void exit() {
        if (group != null) {
            group.threadTerminated(this);
            group = null;
        }
        /* Aggressively null out all reference fields: see bug 4006245 */
        target = null;
        /* Speed the release of some of these resources */
        threadLocals = null;
        inheritableThreadLocals = null;
        inheritedAccessControlContext = null;
        blocker = null;
        uncaughtExceptionHandler = null;
    }
```

### interrupt、isInterrupted

> 中断，有些线程的run方法是死循环，可以通过添加 interrupt 状态来判断是否需要退出

```java
public void interrupt() {
        if (this != Thread.currentThread())
            checkAccess();

        synchronized (blockerLock) {
            Interruptible b = blocker;
            if (b != null) {
                interrupt0();           // Just to set the interrupt flag 设置中断标志位
                b.interrupt(this);
                return;
            }
        }
        interrupt0();
    }
public static boolean interrupted() { // 返回是否接收到中断信号
        return currentThread().isInterrupted(true);
    } 
public boolean isInterrupted() { // 是否已中断
        return isInterrupted(false); // 传入 true 和 false 并不会影响返回的值
    }
private native boolean isInterrupted(boolean ClearInterrupted);
```

### setPriority

> 设置线程优先级别

```java
public final void setPriority(int newPriority) {
        ThreadGroup g;
        checkAccess();
        if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) {
            throw new IllegalArgumentException();
        }
        if((g = getThreadGroup()) != null) {
            if (newPriority > g.getMaxPriority()) {
                newPriority = g.getMaxPriority();
            }
            setPriority0(priority = newPriority);
        }
    }
```

### setName

```java
 public final synchronized void setName(String name) {
        checkAccess();
        if (name == null) {
            throw new NullPointerException("name cannot be null");
        }

        this.name = name;
        if (threadStatus != 0) {
            setNativeName(name);
        }
    }
```

###  setDaemon

> 设置是否为 守护线程

```java
public final void setDaemon(boolean on) {
        checkAccess();
        if (isAlive()) {
            throw new IllegalThreadStateException();
        }
        daemon = on;
    }
public final boolean isDaemon() {
        return daemon;
    }
```

### join

> 等待 millis 毫秒后停止，若输入 0，意味一直等待
>
> - 等待调用join方法的线程结束，再继续执行。如：t.join()，主要用于等待t线程运行结束
> - 作用是父线程等待子线程执行完成后再执行，换句话说就是将异步执行的线程合并为同步的线程

```java
public final synchronized void join(long millis)
    throws InterruptedException {
        long base = System.currentTimeMillis();
        long now = 0;

        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            while (isAlive()) {
                long delay = millis - now;
                if (delay <= 0) {
                    break;
                }
                wait(delay);
                now = System.currentTimeMillis() - base;
            }
        }
    }
public final synchronized void join(long millis, int nanos)
    throws InterruptedException {

        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
                                "nanosecond timeout value out of range");
        }

        if (nanos >= 500000 || (nanos != 0 && millis == 0)) {
            millis++;
        }

        join(millis);
    }
```

### yield

> - yield方法的作用是暂停当前线程，以便其他线程有机会执行，不过不能指定暂停的时间，并且也不能保证当前线程马上停止
> - yield只能使**同优先级或更高优先级**的线程有执行的机会

```java
public static native void yield(); // 暂停运行，让有同级别或更高优先权的线程执行
```

###  其他部分不常用方法

```java
// 估计当前处于激活状态的线程数量
public static int activeCount() {
        return currentThread().getThreadGroup().activeCount();
}
// 将当前所有激活的线程组和子线程组 复制到数组中
public static int enumerate(Thread tarray[]) {
        return currentThread().getThreadGroup().enumerate(tarray);
}

public final void checkAccess() {
        SecurityManager security = System.getSecurityManager();
        if (security != null) {
            security.checkAccess(this);
        }
    }
 public ClassLoader getContextClassLoader() {
        if (contextClassLoader == null)
            return null;
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            ClassLoader.checkClassLoaderPermission(contextClassLoader,
                                                   Reflection.getCallerClass());
        }
        return contextClassLoader;
    }
```

### 部分native 方法

```java
public static native Thread currentThread(); // 获取当前在执行的线程对象
// 当前线程休眠（暂时停止运行）指定毫秒后运行，时间精度取决于系统定时器和调度器，该方法不会使线程丢失监听权限
public static native void sleep(long millis) throws InterruptedException; 
private native void start0();
public final native boolean isAlive();// 线程是否还存在，启动但未死亡，意味着活着
```

### sleep() 和 wait() 区别

+ 所属区别。sleep() 方法是Thread 类的静态方法， wait() 是 Object 类中的成员方法

+ 效果区别。

  > + sleep() 方法会让线程暂停指定时间，期间 cpu 会执行其他线程，但是依旧保持线程的监控状态，到指定时间后恢复运行，sleep() 过程中，线程不会释放锁。
  >
  > + 调用wait()方法的时候，线程会放弃对象锁，进入等待此对象的等待锁定池，只有针对此对象调用notify()方法后本线程才进入对象锁定池准备

+ 使用处理。sleep() 方法需要抛异常， wait() 方法不用。原因在于方法的定义，sleep() 抛出了  InterruptedException 异常

+ 使用范围。sleep() 可以在任何地方使用。wait() 方法必须在加锁情况下使用，如同步方法和同步代码块

