---
title: 基础数据类型封装类源码阅读
toc: true
mathjax: true
date: 2019-02-14 18:55:23
tags: JDK
categories: Source Code
---

> Character Boolean Byte Short Integer Long Float Double Void

<!-- more -->

| 基础类型 | 大小(字节) |    默认值    |  封装类   |
| :------: | :--------: | :----------: | :-------: |
|   byte   |     1      |   (byte)0    |   Byre    |
|  short   |     2      |   (short)0   |   Short   |
|   int    |     4      |      0       |  Integer  |
|   long   |     8      |      0L      |   Long    |
|  float   |     4      |     0.0f     |   Float   |
|  double  |     8      |     0.0d     |  Double   |
| boolean  |     -      |    false     |  Boolean  |
|   char   |     2      | \u0000(null) | Character |
|   void   |     -      |      -       |   Void    |

> boolean类型占了单独使用是4个字节，在数组中又是1个字节;
> **原因**：**单个的boolean** 类型变量在编译的时候是**使用的int 类型**。而对于boolean 类型的数组时，在编译的时候是作为byte array来编译的所以boolean 数组里面的每一个元件占一个字节

>  [参考链接](https://www.cnblogs.com/alternative/p/7520332.html)
>
>  1. Java中的数值都是有符号的，不存在无符号的数，它们的取值范围也是固定的，不会随着硬件环境或者操作系统的改变而改变。
>  2. 原始数据类型在传递参数时都是按值传递，封装类都是按引用传递。
>  3. Java语言中，默认声明的小数是double类型的，因此对float类型的变量进行初始化时需要进行类型转换。float类型变量有两种初始化方法：float f = 1.0f  或者 float f =(float) 1.0 。
>  4. "=="和"equals（）"方法：
>
>  　　　　1）基本型和基本型封装型进行“==”运算符的比较，基本型封装型将会自动拆箱变为基本型后再进行比较，因此Integer(0)会自动拆箱为int类型再进行比较，显然返回true。
>  　　　　2）两个Integer类型进行“==”比较，如果其值在-128至127，那么返回true，否则返回false, 这跟Integer.valueOf()的缓冲对象有关.
>  　　　　3）两个基本型的封装型进行equals()比较，首先equals()会比较类型，如果类型相同，则继续比较值，如果值也相同，返回true。
>  　　　　4）基本型封装类型调用equals(),但是参数是基本类型，这时候，先会进行自动装箱，基本型转换为其封装类型，再进行3）中的比较。

## 1. Boolean

```java
public final class Boolean implements java.io.Serializable,
                                      Comparable<Boolean>
	// 表明这个类的对象为原始数据类型 boolean，推测是用于自动拆箱
	public static final Class<Boolean> TYPE = (Class<Boolean>) Class.getPrimitiveClass("boolean");
	// 除了 true 字符串，都返回false
	public static boolean parseBoolean(String s) {
        return ((s != null) && s.equalsIgnoreCase("true"));
    }
    public static Boolean valueOf(String s) {
        return parseBoolean(s) ? TRUE : FALSE;
    }
    // 为 Boolean 实例比较值，否则返回false
	public boolean equals(Object obj) {
        if (obj instanceof Boolean) {
            return value == ((Boolean)obj).booleanValue();
        }
        return false;
    }
    // 只有字符串为 "true" 时返回true
 	public static boolean getBoolean(String name) {
        boolean result = false;
        try {
            result = parseBoolean(System.getProperty(name));
        } catch (IllegalArgumentException | NullPointerException e) {
        }
        return result;
    }
    public static String toString(boolean b) {
        return b ? "true" : "false";
    }
    public String toString() {
        return value ? "true" : "false";
    }
    //1231 代表true， 1237代表false
    public static int hashCode(boolean value) {
        return value ? 1231 : 1237;
    }
 
    public static int compare(boolean x, boolean y) {
        return (x == y) ? 0 : (x ? 1 : -1);
    }
    // 逻辑与
    public static boolean logicalAnd(boolean a, boolean b) {
        return a && b;
    }
	// 逻辑或
    public static boolean logicalOr(boolean a, boolean b) {
        return a || b;
    }
	// 逻辑异或
    public static boolean logicalXor(boolean a, boolean b) {
        return a ^ b;
    }
```

## 2. Byte

> byte 表示的最大值为 127 即 $2^7$-1，最小值为 -128 即 $-2^{7}$

```java
public static final byte   MIN_VALUE = -128;
public static final byte   MAX_VALUE = 127;
```

> 静态内部类，用于缓存范围内的值

```java
private static class ByteCache {
    private ByteCache(){}

    static final Byte cache[] = new Byte[-(-128) + 127 + 1];

    static {
        for(int i = 0; i < cache.length; i++)
            cache[i] = new Byte((byte)(i - 128));
    }
}
```

> 通过 ByteCache 获取值来进行类型转换

```java
public static Byte valueOf(byte b) {
        final int offset = 128;
        return ByteCache.cache[(int)b + offset];
    }
```

> 根据进制将字符串转换为 int 类型，如果值在表示范围内，则返回；否则抛出 NumberFormatException 异常

```java
 public static byte parseByte(String s, int radix)
        throws NumberFormatException {
        int i = Integer.parseInt(s, radix);
        if (i < MIN_VALUE || i > MAX_VALUE)
            throw new NumberFormatException(
                "Value out of range. Value:\"" + s + "\" Radix:" + radix);
        return (byte)i;
    }
// 默认是 10 进制
public static byte parseByte(String s) throws NumberFormatException {
        return parseByte(s, 10);
    }
public Byte(String s) throws NumberFormatException {
        this.value = parseByte(s, 10);
    }
public byte byteValue() {
        return value;
    }
```

> 将字符串转换为 Byte 对象，最终调用的其实是 parseByte

```java
public static Byte valueOf(String s, int radix)
        throws NumberFormatException {
        return valueOf(parseByte(s, radix));
    }
 public static Byte valueOf(String s) throws NumberFormatException {
        return valueOf(s, 10);
    }
```

> 解码，先调用的 Integer 解码方法，详情见 Integer 类
>
> 可解码的字符串，只能为十进制、十六进制、八进制

>
> <dl>
> <dt><i>DecodableString:</i>
> <dd><i>Sign<sub>opt</sub> DecimalNumeral</i>
> <dd><i>Sign<sub>opt</sub></i> {@code 0x} <i>HexDigits</i>
> <dd><i>Sign<sub>opt</sub></i> {@code 0X} <i>HexDigits</i>
> <dd><i>Sign<sub>opt</sub></i> {@code #} <i>HexDigits</i>
> <dd><i>Sign<sub>opt</sub></i> {@code 0} <i>OctalDigits</i>
> <dt><i>Sign:</i>
> <dd>{@code -}
>  <dd>{@code +}
>  </dl>

```java
public static Byte decode(String nm) throws NumberFormatException {
        int i = Integer.decode(nm);
        if (i < MIN_VALUE || i > MAX_VALUE)
            throw new NumberFormatException(
                    "Value " + i + " out of range from input " + nm);
        return valueOf((byte)i);
    }
```

> 数据类型转换

```java
 	public byte byteValue() {
        return value;
    }
    public short shortValue() {
        return (short)value;
    }
    public int intValue() {
        return (int)value;
    }
    public long longValue() {
        return (long)value;
    }
    public float floatValue() {
        return (float)value;
    }
    public double doubleValue() {
        return (double)value;
    }
```

> byte 转字符串，调用的Integer的方法

```java
public String toString() {
    return Integer.toString((int)value);
}
```

## 3. Short

## 4. Integer

## 5. Long

## 6. Float

## 7. Double

## 8. Character

## 9. Void



##  参考链接

[Java中的8种基本和对应的封装类](https://blog.csdn.net/wus_shang/article/details/78705142)

[Java 八种基本类型和基本类型封装类](https://www.cnblogs.com/alternative/p/7520332.html)

[java中boolean类型的长度](https://blog.csdn.net/china_zoujinyong/article/details/8049755)

[Java 八种基本类型和基本类型封装类及不同数据类型间的转换](https://www.cnblogs.com/alternative/p/7520332.html)