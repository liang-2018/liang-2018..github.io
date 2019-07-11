Class.forName方法
通过上述的案例，我们也就知道Class.forName()方法的调用将会返回一个对应类的Class对象，因此如果我们想获取一个类的运行时类型信息并加以使用时，可以调用Class.forName()方法获取Class对象的引用，这样做的好处是无需通过持有该类的实例对象引用而去获取Class对象，如下的第2种方式是通过一个实例对象获取一个类的Class对象，其中的getClass()是从顶级类Object继承而来的，它将返回表示该对象的实际类型的Class对象引用。
```java
public static void main(String[] args) {

    try{
      //通过Class.forName获取Gum类的Class对象
      Class clazz=Class.forName("com.zejian.Gum");
      System.out.println("forName=clazz:"+clazz.getName());
    }catch (ClassNotFoundException e){
      e.printStackTrace();
    }
    
    //通过实例对象获取Gum的Class对象
    Gum gum = new Gum();
    Class clazz2=gum.getClass();
    System.out.println("new=clazz2:"+clazz2.getName());

  }
```
注意调用forName方法时需要捕获一个名称为ClassNotFoundException的异常，因为forName方法在编译器是无法检测到其传递的字符串对应的类是否存在的，只能在程序运行时进行检查，如果不存在就会抛出ClassNotFoundException异常。

Class字面常量
在Java中存在另一种方式来生成Class对象的引用，它就是Class字面常量，如下：

//字面常量的方式获取Class对象
Class clazz = Gum.class;

这种方式相对前面两种方法更加简单，更安全。因为它在编译器就会受到编译器的检查同时由于无需调用forName方法效率也会更高，因为通过字面量的方法获取Class对象的引用不会自动初始化该类。更加有趣的是字面常量的获取Class对象引用方式不仅可以应用于普通的类，也可以应用用接口，数组以及基本数据类型，这点在反射技术应用传递参数时很有帮助，关于反射技术稍后会分析，由于基本数据类型还有对应的基本包装类型，其包装类型有一个标准字段TYPE，而这个TYPE就是一个引用，指向基本数据类型的Class对象，其等价转换如下，一般情况下更倾向使用.class的形式，这样可以保持与普通类的形式统一。

boolean.class = Boolean.TYPE;
char.class = Character.TYPE;
byte.class = Byte.TYPE;
short.class = Short.TYPE;
int.class = Integer.TYPE;
long.class = Long.TYPE;
float.class = Float.TYPE;
double.class = Double.TYPE;
void.class = Void.TYPE;

前面提到过，使用字面常量的方式获取Class对象的引用不会触发类的初始化，这里我们可能需要简单了解一下类加载的过程，如下：



加载：类加载过程的一个阶段：通过一个类的完全限定查找此类字节码文件，并利用字节码文件创建一个Class对象

链接：验证字节码的安全性和完整性，准备阶段正式为静态域分配存储空间，注意此时只是分配静态成员变量的存储空间，不包含实例成员变量，如果必要的话，解析这个类创建的对其他类的所有引用。

初始化：类加载最后阶段，若该类具有超类，则对其进行初始化，执行静态初始化器和静态初始化成员变量。

由此可知，我们获取字面常量的Class引用时，触发的应该是加载阶段，因为在这个阶段Class对象已创建完成，获取其引用并不困难，而无需触发类的最后阶段初始化。下面通过小例子来验证这个过程：
```java
import java.util.*;

class Initable {
  //编译期静态常量
  static final int staticFinal = 47;
  //非编期静态常量
  static final int staticFinal2 =
    ClassInitialization.rand.nextInt(1000);
  static {
    System.out.println("Initializing Initable");
  }
}

class Initable2 {
  //静态成员变量
  static int staticNonFinal = 147;
  static {
    System.out.println("Initializing Initable2");
  }
}

class Initable3 {
  //静态成员变量
  static int staticNonFinal = 74;
  static {
    System.out.println("Initializing Initable3");
  }
}

public class ClassInitialization {
  public static Random rand = new Random(47);
  public static void main(String[] args) throws Exception {
    //字面常量获取方式获取Class对象
    Class initable = Initable.class;
    System.out.println("After creating Initable ref");
    //不触发类初始化
    System.out.println(Initable.staticFinal);
    //会触发类初始化
    System.out.println(Initable.staticFinal2);
    //会触发类初始化
    System.out.println(Initable2.staticNonFinal);
    //forName方法获取Class对象
    Class initable3 = Class.forName("Initable3");
    System.out.println("After creating Initable3 ref");
    System.out.println(Initable3.staticNonFinal);
  }
}
```
执行结果：

After creating Initable ref
47
Initializing Initable
258
Initializing Initable2
147
Initializing Initable3
After creating Initable3 ref
74

从输出结果来看，可以发现，通过字面常量获取方式获取Initable类的Class对象并没有触发Initable类的初始化，这点也验证了前面的分析，同时发现调用Initable.staticFinal变量时也没有触发初始化，这是因为staticFinal属于编译期静态常量，在编译阶段通过常量传播优化的方式将Initable类的常量staticFinal存储到了一个称为NotInitialization类的常量池中，在以后对Initable类常量staticFinal的引用实际都转化为对NotInitialization类对自身常量池的引用，所以在编译期后，对编译期常量的引用都将在NotInitialization类的常量池获取，这也就是引用编译期静态常量不会触发Initable类初始化的重要原因。但在之后调用了Initable.staticFinal2变量后就触发了Initable类的初始化，注意staticFinal2虽然被static和final修饰，但其值在编译期并不能确定，因此staticFinal2并不是编译期常量，使用该变量必须先初始化Initable类。Initable2和Initable3类中都是静态成员变量并非编译期常量，引用都会触发初始化。至于forName方法获取Class对象，肯定会触发初始化，这点在前面已分析过。到这几种获取Class对象的方式也都分析完，ok~,到此这里可以得出小结论：

获取Class对象引用的方式3种，通过继承自Object类的getClass方法，Class类的静态方法forName以及字面常量的方式”.class”。

其中实例类的getClass方法和Class类的静态方法forName都将会触发类的初始化阶段，而字面常量获取Class对象的方式则不会触发初始化。

初始化是类加载的最后一个阶段，也就是说完成这个阶段后类也就加载到内存中(Class对象在加载阶段已被创建)，此时可以对类进行各种必要的操作了（如new对象，调用静态成员等），注意在这个阶段，才真正开始执行类中定义的Java程序代码或者字节码。

关于类加载的初始化阶段，在虚拟机规范严格规定了有且只有5种场景必须对类进行初始化：

使用new关键字实例化对象时、读取或者设置一个类的静态字段(不包含编译期常量)以及调用静态方法的时候，必须触发类加载的初始化过程(类加载过程最终阶段)。

使用反射包(java.lang.reflect)的方法对类进行反射调用时，如果类还没有被初始化，则需先进行初始化，这点对反射很重要。

当初始化一个类的时候，如果其父类还没进行初始化则需先触发其父类的初始化。

当Java虚拟机启动时，用户需要指定一个要执行的主类(包含main方法的类)，虚拟机会先初始化这个主类

当使用JDK 1.7 的动态语言支持时，如果一个java.lang.invoke.MethodHandle 实例最后解析结果为REF_getStatic、REF_putStatic、REF_invokeStatic的方法句柄，并且这个方法句柄对应类没有初始化时，必须触发其初始化(这点看不懂就算了，这是1.7的新增的动态语言支持，其关键特征是它的类型检查的主体过程是在运行期而不是编译期进行的，这是一个比较大点的话题，这里暂且打住)
