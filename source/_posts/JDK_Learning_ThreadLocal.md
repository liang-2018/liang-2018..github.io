---
title: ThreadLocal 源码阅读
toc: true
mathjax: true
date: 2019-02-16 20:50:32
top: 1
tags: JDK
categories: Source Code
---

> ThreadLocal 类粗读

<!-- more -->

# ThreadLocal 源码阅读

> 了解 ThreadLocal 先了解其类和接口关系
> 内部类 ThreadLocalMap 以及 SuppliedThreadLocal

![1563281580954](JDK_Learning_ThreadLocal/1563281580954.png)

> ThreadLocal是一个本地线程副本变量工具类。主要用于将私有线程和该线程存放的副本对象做一个映射，各个线程之间的变量互不干扰**(ThreadLocal在每个线程中对该变量会创建一个副本，即每个线程内部都会有一个该变量，且在线程内部任何地方都可以使用，线程之间互不影响,由于在每个线程中都创建了副本，所以要考虑它对资源的消耗)**。在高并发场景下，可以实现无状态的调用，特别适用于各个线程依赖不同的变量值完成操作的场景。

## ThreadLocal 与 Thread

> 在线程初始化时，会进行判断，如果父进程的 inheritableThreadLocals 不为空，且允许继承，则会自动将该值复制给子进程

```java
if (inheritThreadLocals && parent.inheritableThreadLocals != null)
            this.inheritableThreadLocals =
                ThreadLocal.createInheritedMap(parent.inheritableThreadLocals); 

/* ThreadLocal values pertaining to this thread. This map is maintained
     * by the ThreadLocal class. 
     // 用于存储当前线程的 ThreadLocalMap 对象
     */
    ThreadLocal.ThreadLocalMap threadLocals = null;
    /*
     * InheritableThreadLocal values pertaining to this thread. This map is
     * maintained by the InheritableThreadLocal class.
     	用于存储父进程的 ThreadLocalMap 对象
     	在 Thread 初始化时，会进行判断
    if (inheritThreadLocals && parent.inheritableThreadLocals != null)
                this.inheritableThreadLocals =
                    ThreadLocal.createInheritedMap(parent.inheritableThreadLocals); 
     */
    ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;
```

## TreadLocal 方法

### 初始化

```java
// 一般在首次使用 get() 方法的时候会调用: get()-->setInitialValue()-->initialValue
//  一般初始化时，更多的是在 内部类 SuppliedThreadLocal#initialValue调用，
/*
如果程序员希望线程局部变量的初始值不是{@code null}，则必须对子代码{@CodeLocal}进行子类化，并重写此方法。 通常，将使用匿名内部类
*/
protected T initialValue() {
        return null;
}
public static <S> ThreadLocal<S> withInitial(Supplier<? extends S> supplier) {
        return new SuppliedThreadLocal<>(supplier);
}
 public ThreadLocal() {
 }

```

### get

> 刚初始化时，map未初始化，使用 get 方法，会向 map 添加 (cur_threadlocal_instance,null)值，并返回 null
> 若 map 已初始化，则从 map 中查找值

```java
 public T get() {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t);
        if (map != null) {
            // ThreadLocal 实例保存在对应线程的 threadLocals 变量(Map)中, 其 key 为 ThreadLocal 实例的引用
            ThreadLocalMap.Entry e = map.getEntry(this);// this 为对应 ThreadLocal 实例
            if (e != null) {
                @SuppressWarnings("unchecked")
                T result = (T)e.value;
                return result;
            }
        }
        return setInitialValue();
 }
private T setInitialValue() {
        T value = initialValue(); // 返回 null
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t); // 获取当前线程的 map (ThreadLocalMap实例)
        if (map != null)
            map.set(this, value); // 不为空则添加 (调用者, null) 键值对
        else
            createMap(t, value); // map 尚未初始化，进行初始化
        return value;
}
```

### set

> 为 ThreadLocal 实例，设置对应值或引用

```java
 public void set(T value) {
        Thread t = Thread.currentThread();
        ThreadLocalMap map = getMap(t); // 每个线程中保存着一个 ThreadLocalMap 实例
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value); // map 尚未初始化，进行初始化
    }
```

### remove

> 由于 ThreadLocal 实现了弱引用，即使不调用，只要外部强引用被回收，弱引用会被JVM自动回收(JVM在垃圾回收时，一旦发现弱引用，会立即回收)。
> 但是如果希望及时回收对象，最好使用 remove 方法将变量移除。如果确实不再需要 ThreadLocal 实例对象了，应像关闭数据库连接一样，及时告诉虚拟机(如将该实例应用置为 null 以加速回收)，避免内存泄漏。

```java
public void remove() {
         ThreadLocalMap m = getMap(Thread.currentThread());
         if (m != null)
             m.remove(this);
}
```

### getMap

> ThreadLocal 实例保存在 对应线程 的 threadLocals 变量(Map)中, 其 key 为 ThreadLocal 实例的引用

```java
ThreadLocalMap getMap(Thread t) {
        return t.threadLocals;
    }
```

### createMap

> 初始化 threadLocals

```java
 void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }
```

### createInheritedMap

> 在线程初始化时会被调用，用于继承父线程的 ThreadLocal 实例

```java
/*
 	在 Thread 初始化方法中，有如下片段
 	if (inheritThreadLocals && parent.inheritableThreadLocals != null)
                this.inheritableThreadLocals =
                    ThreadLocal.createInheritedMap(parent.inheritableThreadLocals); 
*/
static ThreadLocalMap createInheritedMap(ThreadLocalMap parentMap) {
        return new ThreadLocalMap(parentMap);
}
```

### nextHashCode

> 每次新增一个 ThreadLocal 实例，增加 HASH_INCREMENT = 0x61c88647 ，然后 & (INITIAL_CAPACITY - 1) 取得在数组  private Entry[] table 中的索引。

> ####  为什么使用0x61c88647
>
> - 生成hash code间隙为这个魔数，可以让生成出来的值或者说ThreadLocal的ID较为均匀地分布在2的幂大小的数组中。
> - 可以看出，它是在上一个被构造出的ThreadLocal的ID/threadLocalHashCode的基础上加上一个魔数0x61c88647的。
> - 这个魔数的选取与斐波那契散列有关，0x61c88647对应的十进制为1640531527。
> - 斐波那契散列的乘数可以用(long) ((1L << 31) * (Math.sqrt(5) - 1))可以得到2654435769，如果把这个值给转为带符号的int，则会得到-1640531527。换句话说 (1L << 32) - (long) ((1L << 31) * (Math.sqrt(5) - 1))得到的结果就是1640531527也就是0x61c88647 。
> - 通过理论与实践，当我们用0x61c88647作为魔数累加为每个ThreadLocal分配各自的ID也就是threadLocalHashCode再与2的幂取模，得到的结果分布很均匀。
> - ThreadLocalMap使用的是线性探测法，均匀分布的好处在于很快就能探测到下一个临近的可用slot，从而保证效率。。为了优化效率。
>
> 作者：GitBit
>
> 链接：https://juejin.im/post/5b5ecf9de51d45190a434308
>

```java
private final int threadLocalHashCode = nextHashCode();
private static AtomicInteger nextHashCode = new AtomicInteger();// 初始化为0，整形，cas原子类
private static final int HASH_INCREMENT = 0x61c88647;
// 由于是类成员，每次增加一个 ThreadLocal 对象，都会加 HASH_INCREMENT，以做到对象hash值不同
private static int nextHashCode() { 
        return nextHashCode.getAndAdd(HASH_INCREMENT); // 增加操作
}
```

## SuppliedThreadLocal

> SuppliedThreadLocal是JDK8新增的内部类，只是扩展了ThreadLocal的初始化值的方法,
> 允许使用JDK8新增的Lambda表达式赋值。需要注意的是，函数式接口Supplier不允许为null。
>
> 为什么要这样增加，我不明白，可能是因为 Lambda 表达式吧

```java
static final class SuppliedThreadLocal<T> extends ThreadLocal<T> {

        private final Supplier<? extends T> supplier;

        SuppliedThreadLocal(Supplier<? extends T> supplier) {
            this.supplier = Objects.requireNonNull(supplier);
        }

        @Override
        protected T initialValue() {
            return supplier.get();
        }
    }
```

## ThreadLocalMap

> 专门为 ThreadLocal 定制的 HashMap，用于会务当前线程的本地变量，仅能通过 ThreadLocal 进行操作，
>
> 为避免占用空间较大或生命周期较长的数据常驻于内存引发一系列问题，ThreadLocalMap 的key是弱引用WeakReferences。当空间不足时，会清理未被引用的entry

###  内部类 Entry

> Entry 继承了 WeakReference, 其 Key 通常为 ThreadLocal 对象，如果 entry.get() == null，则意味着对应的 key 不再被应用，那么对应的 entry 对象就会从 ThreadLocalMap 对象中移除。

```java
static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
    Object value;
    Entry(ThreadLocal<?> k, Object v) {
        super(k);
        value = v;
    }
}
```

### 成员变量

```java
/**
* The initial capacity -- MUST be a power of two.
* 初始值必须为 2 的正整数次幂，扩容每次也是乘以2，为方便 rehash，具体原因，可以查看 HashMap 源码阅读
*/
private static final int INITIAL_CAPACITY = 16;
/**
* The table, resized as necessary.
* table.length MUST always be a power of two.
* 用于保存 Entry 的数组，根据需要重新确定大小，数组的长度必须是 2 的正整数次幂
*/
private Entry[] table;
/**
* The number of entries in the table.
* table 中有多少个 Entry 对象
*/
private int size = 0;
/**
* The next size value at which to resize.
* 阈值，如果 size / table.length >= threshold 则进行扩容， threshod 默认值为长度的 2/3
*/
private int threshold; // Default to 0
// 在每次扩容的时候，就会进行重新设置阈值
private void setThreshold(int len) {
    threshold = len * 2 / 3;
}
```

###  nextIndex  prevIndex

> 返回下标，没啥好说的

```java
/**
* Increment i modulo len.
*/
private static int nextIndex(int i, int len) {
    return ((i + 1 < len) ? i + 1 : 0);
}

/**
* Decrement i modulo len.
*/
private static int prevIndex(int i, int len) {
    return ((i - 1 >= 0) ? i - 1 : len - 1);
}
```

### ThreadLocalMap 构造器

```java
 /**
 * Construct a new map initially containing (firstKey, firstValue).
 * ThreadLocalMaps are constructed lazily, so we only create
 * one when we have at least one entry to put in it.
 * ThreadLocalMap 是懒加载，因而在初始化的时候至少需要有添加一个entry
 * 在 ThreadLocal#setInitialValue 方法中，会自动设置对应的值
 */
ThreadLocalMap(ThreadLocal<?> firstKey, Object firstValue) {
    table = new Entry[INITIAL_CAPACITY];
    int i = firstKey.threadLocalHashCode & (INITIAL_CAPACITY - 1);
    table[i] = new Entry(firstKey, firstValue);
    size = 1;
    setThreshold(INITIAL_CAPACITY);
}

/**
* Construct a new map including all Inheritable ThreadLocals
* from given parent map. Called only by createInheritedMap.
*
* @param parentMap the map associated with parent thread.
* 这个方法一般只在 Thread 初始化的时候调用，用于继承父线程的 ThreadLocal 对象
*/
private ThreadLocalMap(ThreadLocalMap parentMap) {
    Entry[] parentTable = parentMap.table;
    int len = parentTable.length;
    setThreshold(len);
    table = new Entry[len];

    for (int j = 0; j < len; j++) {
        Entry e = parentTable[j];
        if (e != null) {
            @SuppressWarnings("unchecked")
            ThreadLocal<Object> key = (ThreadLocal<Object>) e.get();
            if (key != null) {
                Object value = key.childValue(e.value);
                Entry c = new Entry(key, value);
                int h = key.threadLocalHashCode & (len - 1);
                while (table[h] != null)
                    h = nextIndex(h, len);
                table[h] = c;
                size++;
            }
        }
    }
}
```

### setEntry

> 对指定的 key 设置对应的值 value
>
> + 判断对应位置的 entry
> + 若为 null 则创建对应的 entry 进行设置，并将 size  加 1，判断是否需要扩容
> + 如果不为 null 
>   + key 为 null，对该 entry 的 key 和 value 进行替换
>   + key 不为 null，直接将该 entry 的 value 覆盖

```java
private void set(ThreadLocal<?> key, Object value) {

    // We don't use a fast path as with get() because it is at
    // least as common to use set() to create new entries as
    // it is to replace existing ones, in which case, a fast
    // path would fail more often than not.

    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);

    for (Entry e = tab[i]; e != null; e = tab[i = nextIndex(i, len)]) {
        ThreadLocal<?> k = e.get(); // 获取 entry 中保存的 弱引用，即 key，在 java.lang.ref.Reference 类中有定义
        if (k == key) {
            e.value = value;
            return;
        }
        if (k == null) { // 将 key 为 null 的 entry 进行覆盖
            replaceStaleEntry(key, value, i);
            return;
        }
    }

    tab[i] = new Entry(key, value);
    int sz = ++size;
    if (!cleanSomeSlots(i, sz) && sz >= threshold)
        rehash();
}
```

### getEntry

> 根据 ThreadLocal 对象，获取对应的 Entry 对象
>

```java
private Entry getEntry(ThreadLocal<?> key) {
    int i = key.threadLocalHashCode & (table.length - 1); // 根据 set 的时候来的
    Entry e = table[i];
    if (e != null && e.get() == key)
        return e;
    else
        return getEntryAfterMiss(key, i, e);
}
```

### getEntryAfterMiss

> 碰撞查找

```java
private Entry getEntryAfterMiss(ThreadLocal<?> key, int i, Entry e) {
    Entry[] tab = table;
    int len = tab.length;

    while (e != null) {
        ThreadLocal<?> k = e.get();
        if (k == key)
            return e;
        if (k == null)
            expungeStaleEntry(i); // 如果对应位置的 key 已成为 null，则应进行擦除
        else // 会进行到这一步，说明发生了 hash 碰撞
            i = nextIndex(i, len);
        e = tab[i];
    }
    return null;
}
```

### expungeStaleEntry

> 清除无效的 Entry 对象，并返回被清除 entry 对应的位置

```java
private int expungeStaleEntry(int staleSlot) {
    Entry[] tab = table;
    int len = tab.length;

    // expunge entry at staleSlot 将指定位置的 entry 的 value 设置为 null，加快回收
    tab[staleSlot].value = null;
    tab[staleSlot] = null;
    size--;

    // Rehash until we encounter null 对所有 entry 进行规整， 直到 entry 为 null ，减少内存泄漏风险
    Entry e;
    int i;
    for (i = nextIndex(staleSlot, len); (e = tab[i]) != null; i = nextIndex(i, len)) {
        ThreadLocal<?> k = e.get();
        if (k == null) { // 如果 key 为null，进行擦除，对 entry 进行回收
            e.value = null;
            tab[i] = null;
            size--;
        } else {
            int h = k.threadLocalHashCode & (len - 1); 
            if (h != i) { // 说明 i 处的 entry 保存为位置不对
                tab[i] = null;

                // Unlike Knuth 6.4 Algorithm R, we must scan until
                // null because multiple entries could have been stale.
                while (tab[h] != null) // 只有遇到 entry 为null 才停止，因为可能有多个 entry 是无效的
                    h = nextIndex(h, len);
                tab[h] = e; // 将 entry 保存至合适的位置
            }
        }
    }
    return i;
}
```

### expungeStaleEntries

> 批量移除

```java
 private void expungeStaleEntries() {
     Entry[] tab = table;
     int len = tab.length;
     for (int j = 0; j < len; j++) {
         Entry e = tab[j];
         if (e != null && e.get() == null)
             expungeStaleEntry(j);
     }
 }
```

### repalceStaleEntry

> 替换无效的 Entry
>
> 会对所有的 entry 进行检查，并一次性清理所有无效的 entry，减少 rehash 次数

```java
 private void replaceStaleEntry(ThreadLocal<?> key, Object value, int staleSlot) {
     
     Entry[] tab = table;
     int len = tab.length;
     Entry e;

     // Back up to check for prior stale entry in current run.
     // We clean out whole runs at a time to avoid continual
     // incremental rehashing due to garbage collector freeing
     // up refs in bunches (i.e., whenever the collector runs).
     // 保留 staleSlot，检查之前的 entry 是否有无效的；
     // 一次性清理掉所有无效 entry，避免因为垃圾回收释放引用束导致持续递增 rehash
     int slotToExpunge = staleSlot;
     for (int i = prevIndex(staleSlot, len); (e = tab[i]) != null; i = prevIndex(i, len))
         if (e.get() == null)
             slotToExpunge = i;

     // Find either the key or trailing null slot of run, whichever occurs first
     // 找到正确的 key， 追踪并清理空槽， 无论哪个的条件先触发，二者都会进行
     for (int i = nextIndex(staleSlot, len); (e = tab[i]) != null; i = nextIndex(i, len)) {
         ThreadLocal<?> k = e.get();

         /* If we find key, then we need to swap it with the stale entry to maintain hash table order. The newly 			stale slot, or any other stale slot encountered above it, can then be sent to expungeStaleEntry to 				remove or rehash all of the other entries in run.
         如果找到目标 key，则用无效的 key 替换以维持哈希表的顺序。 新产生及其他发现的无效 entry，都将通过 expungeStaleEntry 方		  法移除或对其他所有 entry 进行 rehash
         */
         if (k == key) {
             e.value = value;
             tab[i] = tab[staleSlot];
             tab[staleSlot] = e;
             // Start expunge at preceding stale entry if it exists
             if (slotToExpunge == staleSlot)
                 slotToExpunge = i;
             cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
             return;
         }

         // If we didn't find stale entry on backward scan, the
         // first stale entry seen while scanning for key is the
         // first still present in the run.
         // 如果没有找到其他无效的 entry，那第一个无效 entry 位置就是当前
         if (k == null && slotToExpunge == staleSlot)
             slotToExpunge = i;
     }

     // If key not found, put new entry in stale slot 如果没有找到 key，则将当前 entry的值设为null，并设值为新的 entry
     tab[staleSlot].value = null;
     tab[staleSlot] = new Entry(key, value);

     // If there are any other stale entries in run, expunge them 如果有其他无效 entry，进行清除
     if (slotToExpunge != staleSlot)
         cleanSomeSlots(expungeStaleEntry(slotToExpunge), len);
 }
```

### cleanSomeSlots

> 试探性查找无效 entry，该方法在新的元素添加或者有效 entry 被擦除后调用
>
> 如果么有找到无效 entry，将会查找 table 中 $log_{2}{n}$ 个位置

```java
private boolean cleanSomeSlots(int i, int n) {
    boolean removed = false;
    Entry[] tab = table;
    int len = tab.length;
    do {
        i = nextIndex(i, len);
        Entry e = tab[i];
        if (e != null && e.get() == null) {
            n = len;
            removed = true;
            i = expungeStaleEntry(i);
        }
    } while ( (n >>>= 1) != 0);
    return removed; // 在调用过程中，是否有无效 entry 被擦除
}
```

### set

> 类似 setEntry, 有则覆盖，无则创建，完事检查是否要有无效 entry，是否需要 rehash

```java
private void set(ThreadLocal<?> key, Object value) {

    Entry[] tab = table;
    int len = tab.length;
    int i = key.threadLocalHashCode & (len-1);

    for (Entry e = tab[i];
         e != null;
         e = tab[i = nextIndex(i, len)]) {
        ThreadLocal<?> k = e.get();
        if (k == key) {
            e.value = value;
            return;
        }
        if (k == null) {
            replaceStaleEntry(key, value, i);
            return;
        }
    }

    tab[i] = new Entry(key, value);
    int sz = ++size;
    if (!cleanSomeSlots(i, sz) && sz >= threshold)//如果进行了清楚无效 entry，会自行 rehash，则不用检测阈值
        rehash();
}
```

### remove

> 移除对应的

```java
 private void remove(ThreadLocal<?> key) {
     Entry[] tab = table;
     int len = tab.length;
     int i = key.threadLocalHashCode & (len-1);
     for (Entry e = tab[i];
          e != null;
          e = tab[i = nextIndex(i, len)]) {
         if (e.get() == key) {
             e.clear();
             expungeStaleEntry(i);//在每次 remove 操作后都进行擦除操作和检查
             return;
         }
     }
 }
```

### rehash

> 调用后，会先进行一次整体清理，清理完后，如果 size 达到阈值的总长度的 1/2 则进行 resize()，避免滞后
> resize() ：将 Entry 数组长度扩展为原来的2倍

```java
private void rehash() {
    expungeStaleEntries();

    // Use lower threshold for doubling to avoid hysteresis
    if (size >= threshold - threshold / 4)
        resize();
}

/**
* Double the capacity of the table.
* 将 table 扩容为原来的两倍，并复制所有内容
*/
private void resize() {
    Entry[] oldTab = table;
    int oldLen = oldTab.length;
    int newLen = oldLen * 2;
    Entry[] newTab = new Entry[newLen];
    int count = 0;

    for (int j = 0; j < oldLen; ++j) {
        Entry e = oldTab[j];
        if (e != null) {
            ThreadLocal<?> k = e.get();
            if (k == null) {
                e.value = null; // Help the GC
            } else {
                int h = k.threadLocalHashCode & (newLen - 1);
                while (newTab[h] != null)
                    h = nextIndex(h, newLen);
                newTab[h] = e;
                count++;
            }
        }
    }

    setThreshold(newLen);
    size = count;
    table = newTab;
}
```

## 内存泄漏

### 原因

> + 使用static的ThreadLocal，延长了ThreadLocal的生命周期
>
> 原因在于 ThreadLocalMap 的生命周期和线程生命周期一样长，如果定义为 static，在使用后没有进行手动释放，因为线程重复使用，可能导致之前线程对象残留。
>
> + 分配使用了ThreadLocal又不再调用get()、set()、remove()方法
>
> 如果存在 entry的key为null的情况，只要调用了其中一种方法，就会对 ThreadLocalMap 进行一次大清洗。

### 建议

> 每次使用完ThreadLocal，都调用它的remove()方法，清除数据

## 其他

> 最后这段文字，萦绕很久，很多地方出现，但是搞不懂情况。。。。
>
>     // We don't use a fast path as with get() because it is at
>     // least as common to use set() to create new entries as
>     // it is to replace existing ones, in which case, a fast
>     // path would fail more often than not.

## 参考文章

[死磕Java之聊聊ThreadLocal源码(基于JDK1.8)](http://www.hchstudio.cn/article/2018/1766/)

[为什么使用0x61c88647](https://juejin.im/post/5b5ecf9de51d45190a434308)

[ThreadLocalMap 源码解析](https://blog.csdn.net/weixin_41344042/article/details/83024039)

[Threadlocal 和 ThreadLocalMap 原理解析](https://blog.csdn.net/zhuzj12345/article/details/84333765):有一定的图文描述，帮助理解

[ThreadLocal内存泄漏真因探究](https://www.jianshu.com/p/a1cd61fa22da)