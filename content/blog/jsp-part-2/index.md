---
title: 📡 JSP로 간단한 CRUD 사이트를 MVC 패턴으로 구축해보기 part 2
date: "2024-08-13T22:40:32.169Z"
description: 이미지를 로컬 서버에 저장을 하고 불러와보자!
tags: 
  - backend
  - java
  - jsp
---

![](https://i.imgur.com/YSPNRWK.png)

안녕하세요? 이번엔 저번 글을 이어서.. 서블릿과 WAS에 대해서 알아보고 Controller 폴더에 들어갈 코드들을 마저 작성해보도록 하겠습니다. 이번 글은 코딩과 동시에 실시간으로 작성했기 땜시.. 의식의 흐름이 될 것 같습니다.  
# Controller 🔧  컨트롤러 작성하기 (1)

먼저 컨트롤러 기본 베이스 코드를 작성해보겠습니다.  

인터페이스를 먼저 작성해줍시다!  

```java
public interface WebtoonController {
    void process(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException;
}
```

짠.. 이제 WebtoonController하나만 있으면 Controller 무한 확장 가능입니다 ,, 처음 다형성을 접했을때는 뭐라고,,? (동태눈알..) 이었는데 쓰다보니 이보다 섹시한 문법 또 없는 것 같습니다 ㅎㅋ  아무튼!   

```java
public class ListController implements WebtoonController{
    @Override
    public void process(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        System.out.println("연결 되었습니다.");
    }
}
```

다음으로 웹툰 리스트를 보여줄 **ListController**를 작성했습니다. 아직 구현한 기능은 없구요.. 화면에 출력만 해줄 거라서 콘솔창만 찍어봅시다!  

아 참 그 전에.. HttpServletRequest, HttpServletResponse가 뭐길래 Controller들에 전달해주고 있는지 한 번 알아봅시다.  

#### HttpServletRequest, Response 란?

![](https://i.imgur.com/oN81hDc.jpeg)

흐름은 위의 사진과 같습니다. 즉 브라우저가 무언가 요청을 보내면 WAS에서 HttpServletRequest, HttpServletResponse 객체를 만들고 Servlet에 파라미터로 전달을 합니다. 그럼 Servlet에서 필요한 메소드를 override 해 사용할 수 있게 됩니다.   

궁금하면 오백원.. 은 아니고요 [이 링크](https://docs.oracle.com/javaee%2F7%2Fapi%2F%2F/javax/servlet/http/HttpServletRequest.html)에 들어가서 찍어보고 싶은 메소드를 찍어보시면 좀 더 와닿을 것 같습니다.  

![](https://i.imgur.com/WRh6hH8.png)

이 메소드를 찍어보시면 URI가 출력이 됩니다.  

![](https://i.imgur.com/6ZiBQZ7.png)
# Controller 🔧  servlet 작성하기 

대망의 서블릿 작성입니다! 서블릿을 이용해 url과 controller을 mapping을 해줄건데요.. **HttpServlet**을 상속받아 만들것입니다.  

**HttpServlet** 클래스는 HTTP 통신과 관련된 데이터를 처리할 수 있습니다. [이곳](https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServlet.html)에서 관련 자료를 찾아볼 수 있는데요! 메소드 중 하나를 필수적으로 오버라이딩을 해야한다고 합니다. 일반적으로 **service** 메소드는 개발자가 재정의 해줄 필요는 없다곤 하지만.. 메인 서블릿에서는 http 요청을 바로 처리할 것이 아니기 때문에 **service** 메소드를 이용해서 컨트롤러와 uri를 매핑해주도록 해봅시다!  

```java
@WebServlet("/webtoons/*")
public class WebtoonsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        Map<String, WebtoonController> mapController = new HashMap<>();
        mapController.put("/webtoons/list", new ListController());

        String reqURI = req.getRequestURI();
        WebtoonController controller = mapController.get(reqURI);

        if (controller == null) {
            System.out.println("아아 오류입니다");
            return;
        }

        controller.process(req, res);
    }
}
```

이렇게 해두면 사용자가 입력하는 것에 따라 webtoons에 따라서 들어온거면 그에 맞춰서 controller가 연결이 됩니다. 만약 컨트롤러가 존재하지 않는다면 콘솔창에 오류라고 뜨게 됩니다.  

![](https://i.imgur.com/g5OmGut.png)

이제 아까 만들어준 **ListController**가 제대로 불러와지는지 확인하기 위해 "/webtoons/list"를 입력해보면 화면도 이동이 되고 서버 로그에도 연결 되었습니다 가 뜨게 됩니다. 얏호!  

#  Controller 🔧  컨트롤러 작성하기 (2)

연결이 잘 된 것을 확인했으니 컨트롤러를 마저 작성해봅시다! 앞서 써둔 코드에서도 알 수 있듯 Controller에서는 HttpServletRequest, HttpServletResponse를 받아서 처리를 하도록 되어있는데요.. **ListController**는 화면에 전체를 출력하는 것입니다.  

근데 출력이고 나발이고~ 먼저 화면에 연결될 jsp가 뭔지 알려주면 화면에도 뜨고.. 좀 더 코딩할 맛이 날 것 같습니다! 그래서 저희는 아래의 메소드를 사용해 주도록 하겠습니다.  

![](https://i.imgur.com/DGZVnFs.png)

이 메소드는 resource가 있는 path를 넘겨주면 이걸 감싸주는 역할을 하는 RequestDispatcher를 반환한다고 합니다. [RequestDispatcher](https://docs.oracle.com/javaee%2F7%2Fapi%2F%2F/javax/servlet/RequestDispatcher.html)에서 보면 알 수 있듯, 브라우저가 보낸 요청을 다른 서블릿, jsp 등으로 포워딩이 가능하다고 합니다.  

```java
String view = "/WEB-INF/views/WebtoonList.jsp";  
req.getRequestDispatcher(view).forward(req, res);
```

그래서 이런씩으로 포워딩을 해주면  

![](https://i.imgur.com/E3Xh1iu.png)
요로코롬..path에 있는 jsp가 화면에 잘 뜨는 것을 확인할 수 있습니다! 얏호 ..  

그럼 이제 다시 화면에 웹툰 전체가 다 뜨게 하면 만들어 봅시다.  

```java
        try {
                List<Webtoon> list = webtoonService.getWebtoonList();
                req.setAttribute("webtoonList", list);
        } catch (Exception e) {
            e.printStackTrace();
            req.setAttribute("error", e.getMessage());
        }
```

이렇게.. 해주면 attribute를 만들어서 **httpServletRequest**에 설정을 할 수 있게 됩니다. 이제 jsp를 작성해보도록 하겠습니다!  

#  Views 🔧  JSP 작성하기 (1)

attribute를 보내주면 EL(expression language)가 알아서 가져와주고요.. jstl 을 사용해서 간단하게 리스트를 사용해보도록 하겠습니다!  

```jsp
<%@ page isELIgnored="false" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Webtoons</title>
</head>
<body>
  <h1>웹툰 리스트입니다!</h1>
  <ul>
      <c:forEach var="webtoon" items="${webtoonList}" varStatus="status">
          <li>
              <div>
                  <h2>${webtoon.getTitle()}</h2>
                  <span>작가: ${webtoon.getAuthor()} / ${webtoon.getPlatform()}</span>
                  <br/>
                  <span>${webtoon.getSummary()}</span>
              </div>
          </li>
      </c:forEach>
  </ul>
</body>
</html>
```

이렇게 해봤는데요!  

![](https://i.imgur.com/tls0o9h.png)
이렇게 뜨게 됩니다 ㅎㅎ 어떤가요.. 신나지 않으신가요.. 그러면 이제 저희는 CRUD에서 **Read**를 완성하게 됐습니다. 그러면 이제.. 나머지 cud도 해보도록 하겠습니다. 조금 귀찮은데요.. 쩝.. 해야하나? 해야죠.. 3해봅시다..  

![](https://i.imgur.com/kpTwkFe.png)

# 📸 이미지 저장하기  

그 전에! 해결해야 할 것이 하나 있습니다.. 바로 이미지를 저장하는 건데요! 간단한 프로젝트인 만큼 로컬에 저장을 해보도록 하겠습니다. 먼저 form을 만들고 어떤씩으로 파일 업로드가 들어오는지 확인해보겠습니다.  

```jsp
    <form
        action="/webtoons/list?action=addWebtoon"
        method="post"
        enctype="multipart/form-data"
    >
        <input id="title" name="title" placeholder="title" required />
        <input id="author" name="author" placeholder="author" required />
        <input id="platform" name="platform" placeholder="platform" required />
        <textarea id="summary" name="summary" placeholder="summary" required></textarea>
        <input id="img" name="img" type="file" required/>
        <button type="submit">저장하기</button>
    </form>
```

이렇게 폼 태그를 만들어주었습니다. post 방식으로 보내는 걸로 했구요.. text랑 file을 둘 다 보내야해서 **Multipart/form-data**로 설정해주었습니다!   

이제 이걸 프린트 해봅시다.  

```java
    String action = req.getParameter("action");
        if (action != null && action.equals("addWebtoon")) {
            String title = req.getParameter("title");
            String author = req.getParameter("author");
            String platform = req.getParameter("platform");
            String summary = req.getParameter("summary");
            System.out.println("제목 : " + title);
            System.out.println("작가: " + author);
            System.out.println("플랫폼: " + platform);
            System.out.println("줄거리: " + summary);

            Part part = req.getPart("img");
            String header = part.getHeader("content-disposition");
            System.out.println(header);
        }
```

[Part](https://docs.oracle.com/javaee/7/api/javax/servlet/http/Part.html)는 **multipart/form-data**를 post로 가져왔을 때 form item을 나타냅니다. 아무튼 이렇게 해서 가져와보면 .. null이 뜹니다! 그 이유는 **MultipartConfig**를 안 설정해주었기 때문입니다.  

다시 Servlet 파일로 돌아가서 `@MultipartConfig(location = "{파일을 저장하고 싶은 path}")` 이 어노테이션을 추가해주도록 합니다. [여기](https://docs.oracle.com/javaee/7/api/javax/servlet/annotation/MultipartConfig.html)에 나와있듯! 이 어노테이션을 서블릿에 추가해주면 **multipart/form-data** 형식으로 들어온 **part**를 가져올 수 있다고 합니다. 그리고 다양한 옵션을 줄 수 있는데요! 저는 다른 건 딱히 필요 없어서.. Location만 추가해주었습니다.   

아무튼 이제 다시 실행해보면  


![](https://i.imgur.com/Tv1Y9jM.png)

이렇게 뜹니다! 그럼 저희는 이제.. filename을 가져와서 어째저째 처리를 해주면 될 것 같은데요!  

![](https://i.imgur.com/Hsbs0Du.png)

이 메소드를 사용하도록 하겠습니다. fileName을 넘겨주면 MultipartConfig에 준 location에 파일이 저장이 된다고 합니다.  

```java
    Part part = req.getPart("img");
    String header = part.getHeader("content-disposition");
    int index = header.indexOf("filename=");
    String filename = header.substring(index + 10, header.length() - 1);
    part.write(filename);
```

이렇게 하고 저장을 하면!  

![](https://i.imgur.com/kBo2yzP.png)
이렇게.. 사진 파일이 저장이 되게 됩니다.  

![](https://i.imgur.com/TJPSbyQ.png)

신기하네요... 저만 그런가요? ㅋㅎ 아무튼 저번에 작성하다가 만 Service 파일을 마저 작성해보도록 하겠습니다.   

**addWebtoon**

```java
    @Override
    public void addWebtoon(HttpServletRequest req) throws Exception {
        String title = req.getParameter("title");
        String author = req.getParameter("author");
        String platform = req.getParameter("platform");
        String summary = req.getParameter("summary");

        Part part = req.getPart("img");
        String header = part.getHeader("content-disposition");
        int start = header.indexOf("filename=");
        String filename = header.substring(start + 10, header.length()-1);

        if (filename != null && !filename.isEmpty()) {
            part.write(filename);
        }

        Webtoon webtoon = new Webtoon(title, author, platform, filename, summary);
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

        Part part = req.getPart("img");
        String header = part.getHeader("content-disposition");
        int start = header.indexOf("filename=");
        String filename = header.substring(start + 10, header.length()-1);

        if (filename != null && !filename.isEmpty()) {
            part.write(filename);
            webtoon.setCover_img(filename);
        }

        webtoonDAO.updateWebtoon(webtoon);
    }
```

이렇게 해주면 됩니다.. 그런데 여기서 또 문제가.. add가 끝나면 다시 list로 돌아와주었으면 좋겠습니다.  

```java
if (action != null && action.equals("addWebtoon")) {
    webtoonService.addWebtoon(req);
    res.sendRedirect(req.getRequestURI());
    return;
}
```

짠.. 그러면 이제 추가를 한 후에 다시 list로 돌아와 추가된 친구를 확인할 수 있습니다!  

![](https://i.imgur.com/cuYHgvs.png)
근데 너무 허전하지 않나요? 리스트에 이미지도 볼 수 있게 해보겠습니다.  

```jsp
<img src="/{사진 파일 경로}/${webtoon.getCover_img()}" alt="커버 이미지" style="width: 300px; height: auto;"  />
```

그냥.. 별 거 없습니다! Jsp에 경로를 찾아서 넣어주면 됩니다. 

![](https://i.imgur.com/5gma4FG.jpeg)

완성.. 됐습니다! 드디어 **Create**가 완성이 되었습니다. 이제 Update, delete를 해봅시다... 흠흠..  

![](https://i.imgur.com/ItAQMjp.png)

려고 했는데요 ! 햄들어서.. ud는 다음 포스트에서 찾아뵙도록 하겠습니다!  

----
참고 링크  
- https://docs.oracle.com/javaee%2F7%2Fapi%2F%2F/javax/servlet/http/HttpServletRequest.html
- https://velog.io/@oliviarla/HttpServletRequest-HttpServletResponse-%EA%B0%9D%EC%B2%B4%EB%9E%80
- https://yunamom.tistory.com/179
- https://atoz-develop.tistory.com/entry/JSP-EL-%ED%91%9C%ED%98%84%EC%8B%9D-%EB%AC%B8%EB%B2%95%EA%B3%BC-%EC%82%AC%EC%9A%A9-%EB%B0%A9%EB%B2%95
- https://docs.oracle.com/javaee/6/tutorial/doc/gmhal.html
- https://docs.oracle.com/javaee/7/api/javax/servlet/http/Part.html