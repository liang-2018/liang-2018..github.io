## [拼凑正方形](https://www.nowcoder.com/questionTerminal/563c6a69fd714e59a942d97047cedcb3?toCommentId=3282642)

> 牛牛有4根木棍,长度分别为a,b,c,d。羊羊家提供改变木棍长度的服务,如果牛牛支付一个硬币就可以让一根木棍的长度加一或者减一。牛牛需要用这四根木棍拼凑一个正方形出来,牛牛最少需要支付多少硬币才能让这四根木棍拼凑出正方形。  

解题思路：

> 有四个数字，a, b, c, d,从小到大排序，假设边长定为 x，则需要改变的次数为
> total =  ![img](https://www.nowcoder.com/equation?tex=%7Cx-a%7C%20%2B%20%7Cx-b%7C%20%2B%20%7Cx-c%7C%20%2B%20%7Cx-d%7C&preview=true)
> 四个数，能构成五个区域，两端的不考虑，不做解释。
>
> - x 在 a 和 b 之间时，结果为 ![img](https://www.nowcoder.com/equation?tex=b%2Bc%2Bd-a-2x&preview=true),由于 ![img](https://www.nowcoder.com/equation?tex=a%3C%3Dx%3C%3Db&preview=true),x 取b最小，为![img](https://www.nowcoder.com/equation?tex=c%2Bd-a-b&preview=true)
> - x 在 b 和 c 之间时，结果为 ![img](https://www.nowcoder.com/equation?tex=c%2Bd-a-b&preview=true)
> - x 在 c 和 d 之间时，结果为 ![img](https://www.nowcoder.com/equation?tex=2x-a-b-c%2Bd&preview=true)，由于 ![img](https://www.nowcoder.com/equation?tex=c%3C%3Dx%3C%3Dd&preview=true),x取c最小，为![img](https://www.nowcoder.com/equation?tex=c%2Bd-a-b&preview=true)

```java
import java.io.*;
import java.util.Arrays;
public class Main{
 
  public static void main(String[] args) throws Exception {
          BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
          String line = null;
          while((line = br.readLine()) != null){
              int[] a = new int[4];
              String[] s = line.trim().split(" ");
              for(int i=0;i<4;i++){
                  a[i] = Integer.parseInt(s[i]);
              }
              Arrays.sort(a);
              int money = a[2]-a[0]+a[3]-a[1];
              System.out.println(money);
          }
      }
}
```

