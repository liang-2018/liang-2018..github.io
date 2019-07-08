1. 那你能讲讲 HashMap的实现原理吗？ 

   > https://www.cnblogs.com/yangming1996/p/7997468.html
   > https://www.cnblogs.com/yuanblog/p/4441017.html
   >
   > + **利用key的hashCode重新hash计算出当前对象的元素在数组中的下标**
   > + **存储时，如果出现hash值相同的key，此时有两种情况。(1)如果key相同，则覆盖原始值；(2)如果key不同（出现冲突），则将当前的key-value放入链表中**
   > + **获取时，直接找到hash值对应的下标，在进一步判断key是否相同，从而找到对应值。**
   > + **理解了以上过程就不难明白HashMap是如何解决hash冲突的问题，核心就是使用了数组的存储方式，然后将冲突的key的对象放入链表中，一旦发现冲突就在链表中做进一步的对比**

2. HashMap什么时候会进行 rehash？

   > 当HashMap的容量达到threshold时就需要进行扩容，这个时候就要进行ReHash操作,这样为了最大程度避免哈希冲突，提高HashMap效率

3. 结合源码说说 HashMap在高并发场景中为什么会出现死循环？ 

   > ```java
   > void resize(int newCapacity) {
   >         Entry[] oldTable = table;
   >         int oldCapacity = oldTable.length;
   >         if (oldCapacity == MAXIMUM_CAPACITY) {
   >             threshold = Integer.MAX_VALUE;
   >             return;
   >         }
   >  
   >         Entry[] newTable = new Entry[newCapacity];
   >         transfer(newTable);
   >         table = newTable;
   >         threshold = (int)(newCapacity * loadFactor);
   >     }
   > ```
   >
   > 这段代码中又调用了transfer()方法，而这种方法实现的机制就是将每一个链表转化到新链表，而且链表中的位置发生反转，而这在多线程情况下是非常easy造成链表回路。从而发生get()死循环。
   > 再次插入新的key，并且映射到同一个hash时，找不到冲突域中的null，陷入死循环。
   >
   > ```java
   > void transfer(Entry[] newTable) {
   >         Entry[] src = table;
   >         int newCapacity = newTable.length;
   >         for (int j = 0; j < src.length; j++) {
   >             Entry<K,V> e = src[j];
   >             if (e != null) {
   >                 src[j] = null;
   >                 do {
   >                     Entry<K,V> next = e.next;
   >                     int i = indexFor(e.hash, newCapacity);
   >                     e.next = newTable[i];
   >                     newTable[i] = e;
   >                     e = next;
   >                 } while (e != null);
   >             }
   >         }
   >     }
   > ```
   >
   > 假如有两个线程P1、P2，以及链表 a.......>b.......>null
   >
   > 1、P1先运行，运行完"Entry<K,V> next = e.next;"代码后发生堵塞，或者其它情况不再运行下去，此时e=a。next=b
   >
   > 2、而P2已经运行完整段代码，于是当前的新链表newTable[i]为b.......>a.......>null
   >
   > 3、P1又继续运行"Entry<K,V> next = e.next;"之后的代码，则运行完"e=next;"后，newTable[i]为a《=》b。则造成回路，while(e!=null)一直死循环

4. JDK1.8中对 HashMap做了哪些性能优化？

   > + **当链表超过8时，链表就转换为红黑树**，利用红黑树快速增删改查的特点提高HashMap的性能，其中会用到红黑树的插入、删除、查找等算法.
   > + dk1.8中没有indexFor函数，直接使用table[index = (n – 1) & hash]（与运算交换左右，结果不变）。其中table数组为HashMap解决哈希冲突的数组+链表法中的数组。
   > + 旧版本的HashMap存在一个问题，即使负载因子和Hash算法设计的再合理，也免不了会出现拉链过长的情况，一旦出现拉链过长，则会严重影响HashMap的性能。于是，在JDK1.8版本中，对数据结构做了进一步的优化，引入了**红黑树**。而当链表长度太长（TREEIFY_THRESHOLD默认超过**8**）时，链表就转换为红黑树，利用红黑树快速增删改查的特点提高HashMap的性能（O(logn)）。当长度小于（UNTREEIFY_THRESHOLD默认为**6**），就会退化成链表。
   > + HashMap使用的是2次幂的扩容(指长度扩为原来2倍)。所以，元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置。在扩充HashMap的时候，不需要像JDK1.7的实现那样重新计算hash，**只需要看看原来的hash值新增的那个bit是1还是0就好了，是0的话索引没变，是1的话索引变成“原索引+oldCap”**。(每个节点e的hash早就计算好，并保存在final hash中)。通过`if ((e.hash & oldCap) == 0)`判定前面那个bit是不是1，如果是1则加上oldCap。
   > + jdk1.8中用Node替代了Entry。

5. HashMap和 HashTable有何不同？

   > 1、HashMap是继承自AbstractMap类，而HashTable是继承自Dictionary类。不过它们都实现了同时实现了map、Cloneable（可复制）、Serializable（可序列化）这三个接口。
   >
   > 2、Hashtable比HashMap多提供了elments() 和contains() 两个方法。
   >
   > 3、HashMap的key-value支持key-value，null-null，key-null，null-value四种。而**Hashtable**只支持key-value一种（即**key和value都不为null这种形式**）。既然HashMap支持带有null的形式，那么在**HashMap中不能由get()方法来判断HashMap中是否存在某个键**， 而应该**用containsKey()方法来判断**，因为使用get的时候，当返回null时，你无法判断到底是不存在这个key，还是这个key就是null，还是key存在但value是null。
   >
   > 4、线程安全性不同，HashMap的方法都没有使用synchronized关键字修饰，都是非线程安全的，而Hashtable的方法几乎都是被**synchronized**关键字修饰的。但是，当我们需要HashMap是线程安全的时，怎么办呢？我们可以通过**Collections.synchronizedMap(hashMap)**来进行处理，亦或者我们使用线程安全的**ConcurrentHashMap**。ConcurrentHashMap虽然也是线程安全的，但是它的效率比Hashtable要高好多倍。因为**ConcurrentHashMap使用了分段锁，并不对整个数据进行锁定**。
   >
   > 5、初始容量大小和每次扩充容量大小的不同 
   > **Hashtable默认的初始大小为11**，之后每次扩充，**容量变为原来的2n+1**。**HashMap默认**的初始化大小为**16**。之后每次扩充，**容量变为原来的2倍。**
   >
   > 6、计算hash值的方法不同 
   > 为了得到元素的位置，首先需要根据元素的 KEY计算出一个hash值，然后再用这个hash值来计算得到最终的位置。Hashtable直接使用对象的hashCode。hashCode是JDK根据对象的地址或者字符串或者数字算出来的int类型的数值。然后再使用除留余数发来获得最终的位置。**Hashtable在计算元素的位置时需要进行一次除法运算，而除法运算是比较耗时的。** **HashMap为了提高计算效率**，将**哈希表的大小固定为了2的幂**，这样在**取模预算时，不需要做除法，只需要做位运算**。**位运算比除法的效率要高**很多。HashMap的效率虽然提高了，但是hash冲突却也增加了。因为它得出的hash值的低位相同的概率比较高，而计算位运算为了解决这个问题，HashMap重新根据hashcode计算hash值后，又对hash值做了一些运算来打散数据。使得取得的位置更加分散，从而减少了hash冲突。当然了，为了高效，HashMap只做了一些简单的位处理。从而不至于把使用2 的幂次方带来的效率提升给抵消掉。
   >
   > 原文：https://blog.csdn.net/luojishan1/article/details/81952147 
   > 版权声明：本文为博主原创文章，转载请附上博文链接！

6. HashMap 和 ConcurrentHashMap 的区别？  

   > + ConcurrentHashMap **不允许将null作为key或value**
   > + 遵守与 Hashtable 相同的功能规范，并且包括对应于 Hashtable 的每个方法的方法版本。不过，尽管所有**操作都是线程安全的**，但**获取操作不必锁定**，并且不支持以某种防止所有访问的方式锁定整个表

7. ConcurrentHashMap和LinkedHashMap有什么区别？ 

   > + ConcurrentHashMap是使用了锁分段技术技术来保证线程安全的，锁分段技术：首先将数据分成一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问
   > + ConcurrentHashMap 是在每个段（segment）中线程安全的
   > + LinkedHashMap维护一个双链表，可以将里面的数据按写入的顺序读出

8. 为什么ConcurrentHashMap中的(桶中)链表转红黑树的阀值是8？

   > 理想情况下，在随机哈希代码下，桶中的节点频率遵循泊松分布。由频率表可以看出，桶的长度超过8的概率非常非常小。所以作者应该是根据概率统计而选择了8作为阀值。
   >
   > Ignoring variance, the expected occurrences of list size k are (exp(-0.5) * pow(0.5, k) / factorial(k)). The first values are:
   >
   > 0: 0.60653066
   > 1: 0.30326533
   > 2: 0.07581633
   > 3: 0.01263606
   > 4: 0.00157952
   > 5: 0.00015795
   > 6: 0.00001316
   > 7: 0.00000094
   > 8: 0.00000006
   > more: less than 1 in ten million
   > 原文：https://blog.csdn.net/daiyuhe/article/details/89424736 

9. 还看过其他的源码吗？Spring的源码有了解吗？ 

10. SpringBoot的源码呢？知道starter是怎么实现的吗？

