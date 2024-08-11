---
title: 📡 JSP로 간단한 CRUD 사이트를 MVC 패턴으로 구축해보기 part 1
date: "2024-08-11T22:40:32.169Z"
description: 스프링이 등장하기 전 서버 구현은 어떻게 했을까? 체험해보기
tags: 
  - backend
  - java
  - jsp
---

안녕하세요? 오늘은 Spring이 없던 시절로 돌아가.. jsp로 간단한 CRUD 기능을 가진 사이트를 MVC 패턴으로 구현해보겠습니다.   

# MVC 패턴이란? 

MVC는 **Model, View, Controller**로 관심사를 구분하여 프로젝트를 구성하도록 하는 소프트웨어 디자인 패턴입니다. 과거 모든걸 한데 때려박아 코드의 가독성도 떨어지고 유지보수도 힘들었다고 하는데요.. MVC 패턴의 로직을 한 번 예제와 함께 이해해보도록 하겠습니다.  

1. **Model**: 데이터와 비즈니스 로직 관리   
2. **View**: 레이아웃과 화면 처리   
3. **Controller**: 모델과 뷰로 명령 전달   

![](https://i.imgur.com/2OduHDy.jpeg)


위의 그림은.. update 요청이 들어왔을 때의 프로젝트 흐름을 포현해본것인데요!  

1. View의 입력 폼으로 무언가가 들어옵니다. View는 이것을 Controller에게 전달합니다.  
2. Controller는 이러한 입력에 적절하게 Model을 처리를 한 후 데이터를 View에 보냅니다. 
3. View가 업데이트 되어 적절히 처리된 화면이 user에게 보여집니다.  

어허? 이렇게 보면 그다지 어려울 건 없어보입니다....만! 내 프로젝트에 적용하는 건 또 다르죠.. 한번 해보도록 하겠습니다.   

### 📂 디렉토리 구조 

샤라웃 투 티쳐 choi,,, 슬쩍 디렉토리 구조를 훔쳐와보았습니다.  

```
📂 src
|--	📂 main
|-----	📂 com.webtoons
|---------- 📂 controller  // 로직 설정 
|----------	📂 util        // Connection 연결 및 설정 
|----------	📂 service     // Http request 처리 
|----------	📂 model       // Webtoon 객체 모델 
|----------	📂 dao         // Database 관리 
|-----	📂 webapp
|---------- 📂 WEB-INF
|---------------- 📂 views // 화면에 보여질 views (jsp) 작성 
```

이렇게.. 나누었는데요! 

1. **controller** : 페이지에 보여질 view를 업데이트 하거나 model을 업데이트 할 때 필요한 로직들을 작성합니다. 
2. **util** : DB와의 connection을 위한 static class를 만들어서 싱글톤 패턴으로 관리합니다.  
3. **service** : http request를 처리할 로직을 작성합니다.  
4. **model** : Webtoon의 객체 모델을 정의합니다.  
5. **dao** : data access object라는 뜻으로 데이터 베이스에 접근하는 객체를 만듭니다.  
6. **views** : jsp를 작성해줍니다! 

이렇게 구성을 해주려고 합니다. 그런데 이렇게 보면 그렇게 와닿진 않는데요.. 그래서 또 흐름을 그림으로 그려보았습니다.  

![](https://i.imgur.com/4GKSaZb.jpeg)

음.. 이제 좀 눈에 보이는데요.. 이런 흐름으로.. 한번 구현을 해보겠습니다.  

# 필요한 Dependency 추가 

그 전에 필요한 친구들을 다 다운받아줘야 하겠죠! 아.. 자바는 세팅하는게 제일 어려운 것 같습니다.. 코딩 시작도 전에 지쳐버리는 내 모습.... 하지만 어쩌겠습니까. 내가 선택한 자반데 해야죠.. 쩝   

![](https://i.imgur.com/VqGljAY.png)
*노제씨농협은행...*

1. [톰캣 설치](https://goddaehee.tistory.com/247)
2. [MySQL connector 설치](https://mvnrepository.com/artifact/com.mysql/mysql-connector-j)
3. [jstl 설치](https://mvnrepository.com/artifact/javax.servlet/jstl)
4. [dbcp 설치](https://mvnrepository.com/artifact/org.apache.tomcat/tomcat-dbcp)

뭐... 다운받아서 jar를 추가하든! Maven dependency로 넣던.. 편하신 형태로 하시면 될 것 같습니다. 저는 `pom.xml`에 dependency로 넣어서 우클릭 > Maven > Reload Project로 해주었습니다.

그 다음 [이 링크에 나와있는 대로](https://velog.io/@wlsdud11457/IntelliJ-Apache-tomcat-%EC%97%B0%EB%8F%99-%EB%B0%8F-%EC%84%A4%EC%A0%95)따라 가면 서버가 돌아가는 것을 확인할 수 있습니다. 이제 이걸 이용해서 DB를 연결하고 CRUD 작업과 간단한 라우팅 작업을 해보도록 하겠습니다.   

아 참 그리고 Tomcat의 edit configuration을 누르면 바로 나오는 URL만 바꾸시면 제대로 작동을 안 합니다.  
![](https://i.imgur.com/t1mpriP.png)
이렇게.. deployment의 application context도 꼭 본인이 원하는 주소로 맞춰서 바꿔주시기 바랍니다!  

# Database 만들기 

저는 MySQL을 사용해주었습니다. 연결을 하기 전에 먼저 db를 만들어주어야 하는데요 ! 저는 요즘 무협 웹툰 광인이기때문에.. 웹툰 관련 디비를 만들기로 결심했습니다.  

```sql
CREATE DATABASE webtoons;

CREATE TABLE webtoon (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    author VARCHAR(50) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    cover_img VARCHAR(255) NOT NULL,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

연습용이기 때문에 테이블은 하나만 만들어줬습니다.  

# Utils 🔧 DBCP 설정하기  

이제 디비를 어플리케이션과 연결을 해야하는데요! DBCP를 사용해줄겁니다.  

DBCP는 **DataBase Connection Pool**는 매번 connection을 가져오고 반납하는 것을 반복하는 대신 pool에 connection을 여러개 열어놓고 가져와서 쓰는 것을 말합니다.  

![](https://i.imgur.com/dsWQuML.jpeg)

이렇게 말이죠.. 매번 connection을 하기 위해 DB와 연결하고 끊는 것 보다 속도 면에서 훨씬 빠르다고 합니다. 커넥션 풀은 많은 곳에서 제공이 되는데요! 저는 `tomact dbcp`를 사용하려 합니다.  

[이 곳](https://commons.apache.org/proper/commons-dbcp/apidocs/org/apache/commons/dbcp2/BasicDataSource.html)에 들어가보면 attribute이 어떤게 있는지 확인할 수 있는데요! 여기서 필요한 것들을 가져와 사용해 보도록 하겠습니다.   

```java
import org.apache.tomcat.dbcp.dbcp2.BasicDataSource;

public class ConnectionPool {
    public static class DBPool {
        private static final BasicDataSource dataSource = new BasicDataSource();

        private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
        private static final String URL = "jdbc:mysql://{당신의 url}";
        private static final String USER = {당신의 username};
        private static final String PASSWORD = {당신의 비밀번호};

        static {
            dataSource.setDriverClassName(DRIVER);
            dataSource.setUrl(URL);
            dataSource.setUsername(USER);
            dataSource.setPassword(PASSWORD);
        }
    }

	public static Connection getDataSource() throws SQLException {  
	    return dataSource.getConnection();  
    }
}
```

아파치에서 제공해주는 BasicDataSrouce를 이용해서 dataSource를 만들어주었습니다. driver, url, user, password를 설정해서 세팅을 해줍니다. 그리고 static 메소드를 만들어서 연결된 connection을 사용가능하도록 해줍니다.  

이 외에도 connection과 관련된 메소드들을 설정해서 연결 수 같은것도 관리할 수 있으니 입맛에 맞게 해보시면 될 것 같습니다!   

# Model 🔧 모델 객체 작성하기  

```java
@Getter
@Setter
@AllArgsConstructor
public class Webtoon {
    private int id;
    private String title, author, platform, cover_img, summary, created_at;

    public Webtoon(String title, String author, String platform, String cover_img, String summary) {
        this.title = title;
        this.author = author;
        this.platform = platform;
        this.cover_img = cover_img;
        this.summary = summary;
    }
}
```

일전에 작성해둔 MySQL의 테이블을 참고해서 모델 객체를 작성해줍니다.  

# DAO 🔧 DB 관리 로직 작성하기 

DAO는 **data access object**의 준말입니다. 즉 Db에 접근해 다루는 로직을 작성하는 곳입니다!  

### 🧩 interface 작성 

다형성을 위해.. 인터페이스를 작성해줍니다!  

```java
public interface WebtoonDAO {
    // 웹툰 추가하기
    void addWebtoon(Webtoon webtoon) throws Exception;
    // 웹툰 전체 보기 
    List<Webtoon> getWebtoonList() throws Exception;
    // 특정 웹툰 불러오기 
    Webtoon getById(int id) throws Exception;
    // 웹툰 업데이트 하기 
    void updateWebtoon(Webtoon webtoon) throws Exception;
    // 웹툰 삭제하기 
    void deleteWebtoon(Webtoon webtoon) throws Exception;
}
```

CRUD에 필요한 것들은.. 이정도면 될 것 같습니다. 이제 Implement 해보겠습니다.  

### 🧩 DAOImpl 작성 

##### addWebtoon

```java
    @Override
    public void addWebtoon(Webtoon webtoon) throws Exception {
        String stmt = "INSERT INTO webtoon (title, author, platform, cover_img, summary) values (?, ?, ?, ?, ?)";
        try (
                Connection connection = DBPool.getDataSource();
                PreparedStatement pstmt = connection.prepareStatement(stmt);
                ) {
            String title = webtoon.getTitle();
            String author = webtoon.getAuthor();
            String platform = webtoon.getPlatform();
            String cover_img = webtoon.getCover_img();
            String summary = webtoon.getSummary();
            pstmt.setString(1, title);
            pstmt.setString(2, author);
            pstmt.setString(3, platform);
            pstmt.setString(4, cover_img);
            pstmt.setString(5, summary);

            pstmt.executeUpdate();
        }
    }
```

##### getWebtoonList

```java
    @Override
    public List<Webtoon> getWebtoonList() throws Exception {
        List<Webtoon> webtoonList = new ArrayList<>();
        String stmt = "SELECT * FROM webtoon";

        try (
            Connection conn = DBPool.getDataSource();
            PreparedStatement pstmt = conn.prepareStatement(stmt);
        ) {
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String author = rs.getString("author");
                String platform = rs.getString("platform");
                String cover_img = rs.getString("cover_img");
                String summary = rs.getString("summary");
                String created_at = rs.getString("created_at");

                Webtoon webtoon = new Webtoon(id, title, author, platform, cover_img, summary, created_at);
                webtoonList.add(webtoon);
            }
        }

        return webtoonList;
    }
```

##### getById

```java
    @Override
    public Webtoon getById(int id) throws Exception {
        Webtoon webtoon = null;
        String stmt = "SELECT title, author, platform, cover_img, summary, created_at FROM webtoon WHERE id = ?";

        try (
                Connection conn = DBPool.getDataSource();
                PreparedStatement pstmt = conn.prepareStatement(stmt);
                ) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String title = rs.getString("title");
                String author = rs.getString("author");
                String platform = rs.getString("platform");
                String cover_img = rs.getString("cover_img");
                String summary = rs.getString("summary");
                String created_at = rs.getString("created_at");

                webtoon = new Webtoon(id, title, author, platform, cover_img, summary, created_at);
            }
        }

        return webtoon;
    }
```

##### updateWebtoon

```java
    @Override
    public void updateWebtoon(Webtoon webtoon) throws Exception {
        String stmt = "UPDATE webtoon SET title = ?, author = ?, platform = ?, cover_img = ?, summary = ? WHERE id = ?";

        try (
                Connection conn = DBPool.getDataSource();
                PreparedStatement pstmt = conn.prepareStatement(stmt);
                ) {
            pstmt.setString(1, webtoon.getTitle());
            pstmt.setString(2, webtoon.getAuthor());
            pstmt.setString(3, webtoon.getPlatform());
            pstmt.setString(4, webtoon.getCover_img());
            pstmt.setString(5, webtoon.getSummary());
            pstmt.setInt(6, webtoon.getId());
            pstmt.executeUpdate();
        }
    }
```

#### deleteWebtoon 

```java
    @Override
    public void deleteWebtoon(int id) throws Exception {
        String stmt = "DELETE FROM webtoon WHERE id = ?";

        try (
                Connection conn = DBPool.getDataSource();
                PreparedStatement pstmt = conn.prepareStatement(stmt);
                ) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        }
    }
```

이렇게 MySQL의 CRUD 로직은 작성을 완료했습니다.  

# service 🔧 http 요청에 따라 DAO 다루는 로직 작성 

### 🧩 interface 작성 

DAO 인터페이스에서 복붙해옵니다 ㅋ 근데 이제 http req가 들어오겠죠? 따라서 파라미터만 슬~쩍 바꿔줍니다.  

```java
public interface WebtoonService {
    // 웹툰 추가하기
    void addWebtoon(HttpServletRequest req) throws Exception;
    // 웹툰 전체 보기
    List<Webtoon> getWebtoonList() throws Exception;
    // 특정 웹툰 불러오기
    Webtoon getById(HttpServletRequest req) throws Exception;
    // 웹툰 업데이트 하기
    void updateWebtoon(HttpServletRequest req) throws Exception;
    // 웹툰 삭제하기
    void deleteWebtoon(HttpServletRequest req) throws Exception;
}
```

### 🧩 ServiceImpl 작성 

먼저 WebtoonDAO 인스턴스를 하나 생성해줍니다! DAO에게 일해라 절해라 해야하기 때문입습죠..  

```java
public class WebtoonServiceImpl implements WebtoonService {
    WebtoonDAO webtoonDAO = new WebtoonDAOImpl();
}
```

#### getWebtoonList, getById, deleteWebtoon

제일 간단한 메소드 세 개 부터 해결해봅시다.  

```java
    @Override
    public List<Webtoon> getWebtoonList() throws Exception {
        return webtoonDAO.getWebtoonList();
    }

    @Override
    public Webtoon getById(HttpServletRequest req) throws Exception {
        int id = Integer.parseInt(req.getParameter("id"));
        return webtoonDAO.getById(id);
    }

    @Override
    public void deleteWebtoon(HttpServletRequest req) throws Exception {
        int id = Integer.parseInt(req.getParameter("id"));
        webtoonDAO.deleteWebtoon(id);
    }
```

#### addWebtoon, updateWebtoon  

흠.. 이 친구들은 이미지 때문에 갑자기 난이도 급상승인데요! 파일 업로드를 통해 이미지를 올리고 내리게 할 것입니다. 이따가 서블릿을 작성을 하겠지만! 유저가 클릭클릭을 통해 파일을 업로드 하면 **multipart/form-data POST** 방식으로 요청이 들어올 건데요.. **HttpServletRequest**에서 part를 가져와서 사용해주도록 합니다.  Part에는 업로드 된 파일의 정보가 들어있습니다.  여기서 img의 경로만을 추출해서 DB에 넣어주면 됩니다.  

![](https://i.imgur.com/FC0osiq.png)

지금은 로직이 한 눈에 잘 보이지 않기 때문에.. 파일 업로드는 다음 게시글에서 서블릿 작성 후 자세히 설명해보도록 하겠습니다.   

**addWebtoon**

```java
    @Override
    public void addWebtoon(HttpServletRequest req) throws Exception {
        String title = req.getParameter("title");
        String author = req.getParameter("author");
        String platform = req.getParameter("platform");
        String summary = req.getParameter("summary");

		// 이미지 처리 로직 

        Webtoon webtoon = new Webtoon(title, author, platform, img, summary);
        webtoonDAO.addWebtoon(webtoon);
    }
```

**updateWebtoon**

```java
    @Override
    public void updateWebtoon(HttpServletRequest req) throws Exception {
        int id = Integer.parseInt(req.getParameter("id"));

        Webtoon webtoon = webtoonDAO.getById(id);

        webtoon.setTitle(req.getParameter("title"));
        webtoon.setAuthor(req.getParameter("author"));
        webtoon.setPlatform(req.getParameter("platform"));
        webtoon.setSummary(req.getParameter("summary"));

        // 이미지 처리 로직 

        webtoonDAO.updateWebtoon(webtoon);
    }
```

![](https://i.imgur.com/Ds5Sz9C.png)

이번 글은 여기까지 하고.. 이제 다음 글에서.. 서블릿과 WAS에 대해 공부를 하고 **Controller**를 마저 작성해보도록 하겠습니다!  

---
참고 링크  
- https://developer.mozilla.org/ko/docs/Glossary/MVC
- https://m.blog.naver.com/aservmz/222081244906
- https://devlog-wjdrbs96.tistory.com/139
- https://www.tutorialspoint.com/jdbc/jdbc-introduction.htm
- https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServlet.html
- https://commons.apache.org/proper/commons-dbcp/apidocs/org/apache/commons/dbcp2/BasicDataSource.html
- https://d2.naver.com/helloworld/5102792
- https://lordofkangs.tistory.com/37
- https://tomcat.apache.org/tomcat-8.5-doc/jdbc-pool.html
- https://www.geeksforgeeks.org/httpservlet-class-in-java/
- https://www.openmaru.io/was-java-servlet%EC%84%9C%EB%B8%94%EB%A6%BF-%EB%8F%99%EC%9E%91-%EB%B0%A9%EC%8B%9D-%ED%95%9C%EB%88%88%EC%97%90-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0/