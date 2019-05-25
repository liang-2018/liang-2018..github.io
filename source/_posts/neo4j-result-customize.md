---
title: 自定义neo4j查询结果格式
toc: true
mathjax: true
date: 2019-05-25 22:07:40
tags:
- neo4j
- database
categories:
- database
---

> 由于neo4j不像mysql一样有固定的字段，同时也因为neo4j不如mysql使用那么频繁，公开的工具类比较稀少。因而不得不自定义其结果返回格式。

<!-- more -->

## apache的HttpClient方式请求数据(有注入风险)

> 使用Apache的HttpClient进行查询，由于查询方式是直接输入执行的cypher字符串，弄不好有注入风险，这就像mybatis中使用$ 取值有注入风险一样，至少我当前理解是这样。

> 需要使用的jar包

```xml
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.7</version>
</dependency>
```

> 连接方式及数据返回格式选择

```java
package com.liang.neo4j;

import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

public class HttpClientConnection {
    // 对应的连接url
    private static String url = "http://localhost:7474/db/data/transaction/commit";
    private static CredentialsProvider credsProvider = null;
    private static CloseableHttpClient httpClient = null;
    static {
        credsProvider = new BasicCredentialsProvider();
        credsProvider.setCredentials( new AuthScope("localhost", 7474),
                new UsernamePasswordCredentials("username", "passwd"));//设置对应的用户名和密码
        httpClient = HttpClients.custom().setDefaultCredentialsProvider(credsProvider).build();
    }
    public static String httpExecute(String executeString) {
        StringEntity s = new StringEntity("{\n" +
                "  \"statements\" : [ {\n" +
                "    \"statement\" : \""+ executeString+"\"\n" +
                "  } ]\n" +
                "}","UTF-8");
        s.setContentEncoding("UTF-8");
        s.setContentType("application/json");//发送json数据需要设置contentType

        HttpPost httppost = new HttpPost(url);
        httppost.setEntity(s);
        httppost.addHeader("Content-Type", "application/json");
        httppost.addHeader("charset", "UTF-8");
        CloseableHttpResponse response = null;
        //获取结果
        String respString = "";
        try {
            response = httpClient.execute(httppost);
            // 注意，如果结果中有中文，不表明编码格式可能会乱码
            respString = EntityUtils.toString(response.getEntity(),"UTF-8");

        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try {
                if (response != null) {
                    response.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return respString;

    }
    public static void main(String[] args) {
        String str = httpExecute("MATCH (n:State) RETURN n LIMIT 5");
        System.out.println(str);
    }

}
```

返回结果如下：

```json
{"results":[{"columns":["n"],"data":[{"row":[{"ChineseName":"阿肯色","name":"Arkansas","Code":"AR"}],"meta":[{"id":191954,"type":"node","deleted":false}]},{"row":[{"ChineseName":"阿拉巴马","name":"Alabama","Code":"AL"}],"meta":[{"id":191958,"type":"node","deleted":false}]},{"row":[{"ChineseName":"阿拉斯加","name":"Alaska","Code":"AK"}],"meta":[{"id":191962,"type":"node","deleted":false}]},{"row":[{"ChineseName":"爱达荷","name":"Idaho","Code":"ID"}],"meta":[{"id":191966,"type":"node","deleted":false}]},{"row":[{"ChineseName":"爱荷华","name":"Iowa","Code":"IA"}],"meta":[{"id":191979,"type":"node","deleted":false}]}]}],"errors":[]}{"results":[{"columns":["n"],"data":[{"row":[{"ChineseName":"美国","code":"USA"}],"meta":[{"id":49961,"type":"node","deleted":false}]}]}],"errors":[]}
```

## 使用neo4j的GraphDatabase驱动操作

> 使用到的jar包

```xml

```

> Java代码

```java
package com.kg.database;

import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.neo4j.driver.v1.*;

import java.io.IOException;

/**
 * @author Liang
 *
 */
public class Neo4jUtil {
	/**
	 * @time:2019年3月3日 下午4:53:54
	 * @description:执行对应的cypher语句并返回json形式数据
	 */	
	private static String url = "http://localhost:7474/db/data/transaction/commit";
    private static CredentialsProvider credsProvider = null;
    private static CloseableHttpClient httpClient = null;
	private static String uri="Bolt://192.168.128.54:7687";
//	private static String uri="Bolt://localhost:7687";
	//后续可能要考虑添加自动关闭连接时长的设置，避免无用连接长时间保留，在config中设置
	private static Driver driver = GraphDatabase.driver(uri, AuthTokens.basic("username","passwd"));

    static {
    	credsProvider = new BasicCredentialsProvider();
    	credsProvider.setCredentials( new AuthScope("localhost", 7474),
    			new UsernamePasswordCredentials("username", "passwd"));
    	httpClient = HttpClients.custom().setDefaultCredentialsProvider(credsProvider).build(); 	
    }

	/**
	 * execute the cypher only if the cypher grammar is Ok
	 * Attention: this method to access database is not suggested(at least from my perspective) since the
	 * danger of injection might occur, at the same time, the format of result is specified which means extra
	 * deal with result is almost impossible.
	 * this method executed by http post
	 * @param executeString the cypher sentence
	 * @return the string json result
	 */
	public static String httpExecute(String executeString) {
		 StringEntity s = new StringEntity("{\n" +
	                "  \"statements\" : [ {\n" +
	                "    \"statement\" : \""+ executeString+"\"\n" +
	                "  } ]\n" +
	                "}","UTF-8");
	        s.setContentEncoding("UTF-8");
	        s.setContentType("application/json");//发送json数据需要设置contentType


	        HttpPost httppost = new HttpPost(url);
	        httppost.setEntity(s);
	        httppost.addHeader("Content-Type", "application/json");
	        httppost.addHeader("charset", "UTF-8");
	        CloseableHttpResponse response = null;

	        //获取结果
	        String respString = "";
	        try {
	            response = httpClient.execute(httppost);
	             respString = EntityUtils.toString(response.getEntity());

	        } catch (IOException e) {
	            e.printStackTrace();
	        }finally {
	            try {
	                if (response != null) {
	                    response.close();
	                }
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
		return respString;
		
	}
	
	/**
	 * execute cypher with value for pre-compiling
	 * @param sentence cypher sentence
	 * @param objects params to replace sign "?" for pre-compiling
	 * @return return "succeed" when the transaction proceeded with no exception
	 */
	public static String execute(String sentence, Object... objects) {
		Value value = Values.parameters(objects);
		try (Session session = driver.session()) {
			String result = session.writeTransaction((Transaction tx)-> {
					tx.run(sentence, value);
					return "succeed";
			});
			System.out.println(result);
			session.close();
			return result;
		}
	}

	/**
	 *
	 * @param sentence
	 * @param objects the params to
	 * @return
	 */
    public static StatementResult query(String sentence, Object... objects){
			StatementResult result;
			Value value = Values.parameters(objects);
			try(Session session = driver.session()){
				result = session.run(sentence, value);
			}
			return result;
	  }
	/**
	 * close the connection
	 */
    public static void close(){
        driver.close();
    }
    public static void main(String[] args) {
		StatementResult result = Neo4jUtil.query("MATCH (n:SecurityPerson) RETURN n LIMIT 25");
		System.out.println(result);
		close();
	}
	
}

```







```java
package com.kg.helper;

import com.kg.database.Neo4jUtil;
import org.neo4j.driver.v1.Record;
import org.neo4j.driver.v1.StatementResult;
import org.neo4j.driver.v1.Value;
import org.neo4j.driver.v1.types.Node;
import org.neo4j.driver.v1.types.Path;
import org.neo4j.driver.v1.types.Relationship;

import java.util.*;

public class Result2Json {
    /**
     * transfer the neo4j query result to Json String
     * @param result  neo4j result
     * @return  json string transferred from result
     */
    public static String parseRelationResult(StatementResult result) {
        StringBuilder relations = new StringBuilder();
        StringBuilder nodes = new StringBuilder();
        Set nodeSet = new HashSet();
        relations.append("\"edges\":[");
        nodes.append("\"nodes\":[");
        while (result.hasNext()) {
            Record record = result.next();
            List<Value> values = record.values();
            for (Value value : values) {
                relations.append(parsePathRelation(value.asPath(), result.hasNext()));
                nodes.append(parsePathNodes(value.asPath(), result.hasNext(), nodeSet));
            }
        }
        if(nodes.charAt(nodes.length() -1) == ',')nodes.deleteCharAt(nodes.length() - 1);
        relations.append("]");
        nodes.append("]");
        System.out.println("{" + nodes.toString() + "," + relations.toString() + "}");
        return "{" + nodes.toString() + "," + relations.toString() + "}";
    }

    /**
     * transfer result which contains only nodes into json String
     * @param result result contains only nodes
     * @return json string transferred from nodes
     */
    public static String parseNodeResult(StatementResult result){
        StringBuilder nodes = new StringBuilder();
        Set nodeSet = new HashSet();
        nodes.append("[");
        while(result.hasNext()){
            Record record = result.next();
            List<Value> values = record.values();
            for(Value value : values){
                nodes.append(parseNode(value.asNode(), nodeSet));
            }
            if(result.hasNext()){
                nodes.append(",");
            }
        }
        nodes.append("]");
        return nodes.toString();
    }

    /**
     * transfer result which contains only nodes into json String, both Chinese and English Info
     * @param result result contains both Chinese and English Info
     * @return json string transferred from nodes (Chinese & English)
     */
    public static String parseBilingualNodeResult(StatementResult result){
        StringBuilder bilingual = new StringBuilder();
        StringBuilder nodes_cn = new StringBuilder();
        StringBuilder nodes_en = new StringBuilder();
        Set nodeSet_cn = new HashSet();
        Set nodeSet_en = new HashSet();
        nodes_cn.append("[");
        nodes_en.append("[");
        while(result.hasNext()){
            Record record = result.next();
            List<Value> values = record.values();
            System.out.println("===size:===" + values.size());
            nodes_cn.append(parseNode(values.get(0).asNode(), nodeSet_cn));
            nodes_en.append(parseNode(values.get(1).asNode(), nodeSet_en));
            if(result.hasNext()){
                nodes_cn.append(",");
                nodes_en.append(",");
            }
        }
        nodes_cn.append("]");
        nodes_en.append("]");
        bilingual.append("{ \"ChineseInfo\":").append(nodes_cn).append(",");
        bilingual.append("\"EnglishInfo\":").append(nodes_en).append("}");
        return bilingual.toString();
    }

    /**
     * transform the path info in the record into String
     * @param path path contained relations
     * @param hasNextResult true if the path is the last one record
     * @return relation string (json formatted) transformed from path
     */
    private static String parsePathRelation(Path path, boolean hasNextResult) {
        Iterator<Relationship> relationships = path.relationships().iterator();
        StringBuilder sb = new StringBuilder();
        while (relationships.hasNext()) {
            Relationship relationship = relationships.next();
            long startNodeId = relationship.startNodeId();
            long endNodeId = relationship.endNodeId();
            String relType = relationship.type();
            Iterator<String> relKeys = relationship.keys().iterator();
            sb.append("{\"source\":").append(startNodeId);
            sb.append(",\"target\":").append(endNodeId);
            sb.append(",\"relation\":\"").append(relType).append("\"");

            while (relKeys.hasNext()) {
                String relKey = relKeys.next();
                String relValue = relationship.get(relKey).asObject().toString();
                sb.append(",\"").append(relKey).append("\"");
                sb.append(":\"").append(formatContent(relValue)).append("\"");
            }
            if(!relationships.hasNext() && !hasNextResult){
                sb.append("}");
            } else {
                //如果是最后一个，只需要添加}即可
                sb.append("},");
            }
        }
        return sb.toString();
    }

    /**
     * transfer the node data to json string
     * Attention: remember to add the "[" & "]" for the whole json
     * add "," between each row
     * @param node data node
     * @param nodeSet set stored the nodes transferred before
     * @return json string transferred from node
     */
    private static String parseNode(Node node, Set nodeSet){
        StringBuilder sb = new StringBuilder();
        boolean isExist = nodeSet.contains(node.id());
        if(isExist)return "";
        Iterator<String> nodeProperties = node.keys().iterator();
        sb.append("{");

        while (nodeProperties.hasNext()) {
            String nodeProperty = nodeProperties.next();
            String content = node.get(nodeProperty).asObject().toString();
            sb.append("\"").append(nodeProperty).append("\"");
            if(content.startsWith("[")){
                sb.append(":").append(formatContent(content)).append(",");
            }else{
                sb.append(":\"").append(formatContent(content)).append("\",");
            }
        }
        sb.append("\"id\":");
        sb.append(node.id());
        Iterator<String> nodeTypes = node.labels().iterator();
        //添加节点类型,节点类型用的是labels，可能一个节点可以属于多个类别
        //绝大多数情况下属于一个类别！
        String nodeType = nodeTypes.next();
        sb.append(",").append("\"type\":\"");
        sb.append(nodeType).append("\"");
        sb.append("}");
        nodeSet.add(node.id());
        return sb.toString();
    }
    public static String parseNodeProperty(StatementResult result){
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        while (result.hasNext()){
            Record record = result.next();
            String property = record.values().get(0).asString();
            String content = formatContent(property);
            if(result.hasNext()){
                sb.append("\"").append(content).append("\",");
            }else{
                sb.append("\"").append(content).append("\"");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    /**
     * transfer the node in path to json string
     * @param path path in the record
     * @param hasNextResult true if the result has next record
     * @param nodeSet set stored the nodes transferred before
     * @return json string transferred from path
     */
    private static String parsePathNodes(Path path, boolean hasNextResult, Set nodeSet) {
        Iterator<Node> nodes = path.nodes().iterator();
        StringBuilder sb = new StringBuilder();
        while (nodes.hasNext()) {
            Node node = nodes.next();
            boolean isExist = nodeSet.contains(node.id());
            if(isExist)continue;
            sb.append(parseNode(node, nodeSet));
            //除了最后一个都需要添加逗号
            if(nodes.hasNext() || hasNextResult){
                sb.append(",");
            }
        }
        System.out.println(sb);
        return sb.toString();
    }

    /**
     * replace the special signs
     * @param content string to deal with
     * @return string dealt
     */
    private static String formatContent(String content) {
        return content.replaceAll("\t", "").replaceAll("\t", "").replaceAll("\n", "");
    }

    /**
     *
     * @param result the result return from neo4j must be like this "match (n:SecurityPerson),p=(n)-[]->() return p,n",
     *               the relation must be in front of node
     * @return
     */
    public static String parseRawRelationResult(StatementResult result) {
        Set<Node> nodeSet = new HashSet<>();
        StringBuilder nodesb = new StringBuilder();
        StringBuilder entityNamesb = new StringBuilder();
        StringBuilder resultsb = new StringBuilder();
        nodesb.append("\"nodes\":[");
        entityNamesb.append("\"entityNames\":[");
        List<Path> relationshipList = new ArrayList<>();
        while(result.hasNext()){
            Record record = result.next();
            List<Value> values = record.values();
            System.out.println("===size:===" + values.size());
            nodeSet.add(values.get(1).asNode());// whenever what it add, it'll never exist repeated node
            relationshipList.add(values.get(0).asPath());
        }
        Set<Long> emptySet = new HashSet<>();
        for(Node node : nodeSet){
            nodesb.append(parseNode(node, emptySet)).append(",");
        }
        nodesb.deleteCharAt(nodesb.length() - 1);//删除最后一个多余的逗号
        nodesb.append("]");
        for(Path path : relationshipList){//there are possible double direction path
//            Node start = path.start();
            Node end = path.end();
            // actually even one path, there might be more than two node,we could get only start node and end node directly
            // and if we wanna get all nodes we could use the method path.nodes() and iterate it
            if(nodeSet.contains(end))continue;
            entityNamesb.append("\"").append(end.get("chineseName")).append("\",");
        }
        entityNamesb.deleteCharAt(entityNamesb.length() - 1);
        entityNamesb.append("]");
        resultsb.append("{").append(nodesb).append(",").append(entityNamesb).append("}");
        return resultsb.toString();
    }

    public static void main(String[] args) {
        String queryStr = "match (n:`SecurityPerson`),p=(n)-[]->() where n.chineseName=\"埃德温·威尔逊\" return p,n";
        System.out.println(queryStr);
        StatementResult result = Neo4jUtil.query(queryStr);
        System.out.println(parseRawRelationResult(result));
        /*result = Neo4jUtil.query("MATCH (n:`井号`) RETURN n LIMIT 25");
        System.out.println(parseNodeResult(result));
        result = Neo4jUtil.query("match (n:`SecurityPerson`) return n.name limit 25");
        System.out.println(parseNodeProperty(result));*/
        Neo4jUtil.close();
    }
}

```

