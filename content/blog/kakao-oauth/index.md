---
title: 👮 React와 Kakao OAuth를 사용해 회원가입 구현하기
date: "2024-08-01T22:40:32.169Z"
description: 우리 Kakao OAuth로 소셜 로그인 구현해보자! (라던 과거의 나..)
tags: 
  - frontend
  - react
---

안녕하세요? 이번에 백엔드 친구와 함께 소셜 로그인을 구현하게 되었는데요. 제가 하고 싶어서 하자고 한 건데.. 뭔가 뚝딱 될 줄 알았는데 그냥 슥 보는 걸로는 이해가 안되더라구요!   

![](https://i.imgur.com/41f7ngD.png)

이해도 못하고 코드만 주워다 쓰고 싶지 않았습니다.... 그래서 OAuth의 동작 원리도 정리해보고 프론트에서는 도대체 어떠한 역할을 해야하는지에 대해 적어보도록 하겠습니다.   

🛠️ 프로젝트에서 사용한 스택 🛠️  

**백엔드**  
- SpringBoot 3.3.2   
- Java 17  
- OAuth2 Client   
- MySQL  

**프론트**  
- Vite 5.3.4  
- React 18.3.3. 
- React router dom 6.25.1  
- Axios 1.7.2  
- React cookie 7.2.0  

# 👮 OAuth?

구글, 페이스북, 네이버, 카카오 등의 플랫폼 사용자 데이터에 접근하기 위해 **제 3자가 사용자의 접근 권한을 위임받을 수 있는 표준 프로토콜**입니다. 
즉, 내가 만든 앱을 사용할 사용자의 데이터를 다른 플랫폼에서 가져와 사용할 수 있도록 권한을 위임 받는 것입니다.  

#### 프로토콜 동작 방식   

OAuth에는 4가지의 역할이 존재합니다.  

1. Client
	- resource를 요청합니다.   
	- 우리가 개발하는 서비스가 클라이언트가 됩니다.  
2. Resource Owner 
	- 우리가 사용하고자 하는 resource의 소유자입니다.  
	- 사람일 경우 end-user라고도 부릅니다.  
3. Resource Server 
	- resource를 호스팅하는 서버입니다.  
	- 엑세스 토큰을 사용하여 resource 요청에 응답합니다.  
4. Authorization Server
	- resource가 성공적으로 인증이 되면 클라이언트에게 엑세스 토큰을 발급하는 서버입니다.  

이떄 사용하는 사람에 따라 Resource Server와 Authorization Server가 같을 수도 있습니다. 이렇게만 보면 감이 잘 안 오는데요.. 아래의 사진과 함께 이해를 해보도록 하겠습니다.  

![](https://i.imgur.com/sK4EMNd.png)

1. Client는 Resource Owner에게 인가를 요청합니다. 요청은 Resource Owner에게 직접적으로 할 수도 있지만 Authorization Server에 요청하는 것을 권유한다고 합니다.  
2. 클라이언트는 Resource owner에게서 인증을 받습니다. 
3. 클라이언트는 권한 부여 인증서를 Authorization Server에 가서 엑세스 토큰을 요청합니다.  
4. Authorization Server는 권한 부여 인증서를 검증하여 유효할 경우 엑세스 토큰을 발급합니다.  
5. 클라이언트는 Resource Server에 엑세스 토큰을 제시하여 resource를 요청합니다.  
6. Resource Server는 엑세스 토큰을 검증하고 유효할 경우 요청을 정상적으로 처리합니다.  


![](https://i.imgur.com/zpFjk2F.png)

아직도 감이 잘 안 옵니다. (저만 그럴수도요...)  
이번엔 kakao에서 제공해주는 REST API를 살펴보며 실제 동작 과정을 살펴보도록 하겠습니다.  

# 🍫 카카오 REST API를 이용해 회원가입 구현하기

카카오에서는 **REST API**를 이용한 카카오 로그인/회원가입 방법을 제시해주는데요! 이 과정을 한 번 살펴보며 구현도 해보겠습니다.  

### Step 1. 인가 코드 받기 


![](https://i.imgur.com/3BgBlqh.jpeg)

먼저 로그인을 요청하는 버튼을 만듭니다. 그리고 백엔드에서 던져준 로그인 endpoint으로 이동을 시켜줍니다. 그리고 백엔드는 또 이걸 kakao 계정 인증 서버로 redirect 시켜줍니다.  

```js
const socialLogin = () => {
	location.href = '당신의 백엔드가 준 url';
}

<button onClick={socialLogin}>카카오로 시작하기</button>
```

![](https://i.imgur.com/D0MWIjf.png)

이런 화면 다들 한 번쯤은 보셨죠?! 바로 여기로 이동이 됩니다. 이제 로그인을 하고 동의 화면이 뜨는데요! 이건 처음에 카카오 client id를 만들때 설정해둔 동의 항목에 따라 달라집니다. 이제 카카오는 동의 항목에 따른 인가 코드를 만듭니다. 이 인가 코드는 동의 화면을 통해 인가받은 **동의 항목 정보**를 가지고 있습니다.  
그리고 이 발급 받은 인가 코드와 Redirect URI로 302 Redirect를 시켜줍니다. 이 redirect uri는 client id를 만들때 생성 되게 되는데요.. 저는 백엔드에게 말해서 돌아오는 링크를 프론트 쪽으로 넘겨달라고 했습니다. 왜냐면 사실 redirect url이 백엔드 서버면 어떻게 처리를 해야하는지 알 수가 없더라구요.. 아시는 분 계시면 댓글 주시면 감사하겠습니다!  

##### 네트워크 상태 

요청

```
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}
```

응답 (정상적으로 진행 된 경우)

```
HTTP/1.1 302 
Found Content-Length: 0 
Location: ${REDIRECT_URI}?code=${AUTHORIZE_CODE}
```

응답 (로그인을 취소한 경우)

```
HTTP/1.1 302 Found 
Content-Length: 0 
Location: ${REDIRECT_URI}?error=access_denied&error_description=User%20denied%20access
```

### Step 2. 토큰 받기 

![](https://i.imgur.com/qx0Zg96.jpeg)

이게 전체적인 흐름인데요! 저희 프로젝트의 프론트와 백을 보면 이렇습니다.   

![](https://i.imgur.com/8AUFYza.jpeg)

redirect uri에 담긴 인가코드를 파싱해서 백엔드에서 준 token 받아오는 api를 전달하고 백엔드에서 카카오와 이러쿵 저러쿵 해서 token을 프론트에 다시 넘겨줍니다!   

자 이제 프론트 쪽으로 인가 코드가 넘어왔습니다. 형식은 이런씩인데요..  

```
http://localhost:5173/{당신의 redirect uri}?code={인가 코드}
```

이제 우리는 이걸 이용해서 인가 코드를 파싱해주면 됩니다. 그 전에 컴포넌트를 만들어서 routing을 시켜 쿼리를 받아와보도록 하겠습니다!  

```js
const routes = createBrowserRouter([
  {
    path: '/{redirect uri}',
    element: <CallBackPage />,
  }
])
```

이렇게 컴포넌트를 만들어서 RoutesProvider에 넘겨줬습니다.   
(여기서 주의해야 할 점은.. redirect uri가 api로 시작하면 백엔드 설정 및 프론트에서 설정한 프록시에 따라 api 문서만 주구장창 화면에 뜰 수 있으니 주의하세요.. 이걸 어떻게 알았냐면 저도 알고싶지 않았답니다.................)  

![](https://i.imgur.com/TzBNOjU.png)
그러면 이런 화면이 뜹니다. 척 봐도.. 주소창에 뜬 친구를 파싱해줘야 할 것 같습니다.  

```js
  const parseCode = () => {
    const code: string = window.location.search.substring(6);
  }
```

저는 이렇게 파싱을 해줬습니다. window 객체에서 쿼리만을 추출해와서 code에 넣어주었습니다. 이제 이걸 백엔드 친구가 정해준 api로 전달을 하면 됩니다!  

```
{
  "code": "200",
  "message": "요청을 성공적으로 처리했습니다.",
  "data": {
    "accessToken": "당신의 엑세스 토큰",
    "refreshToken": "당신의 리프래시 토큰"
  }
}
```

일단 저희 백이 주는 욫어 결과는 아래와 같았습니다. 그래서 액세스 토큰과 리프래시 토큰을 가져와서 사용하면 됐는데요!  

```js
    axios
      .get(`http://localhost:8080/{백엔드가 준 api}?code=${code}`)
      .then((res) => {
        const data = res.data.data;
        const accessToken: string = data.accessToken;
        const refreshToken: string = data.refreshToken;
      })
      .catch((err) => {
        console.log(err);
      });
  };
```

이렇게.. axios를 이용해서 가져와주었습니다.   
### Step 3. 유저 등록 / 회원가입 완료

![](https://i.imgur.com/DenY2VD.jpeg)

드디어 완료입니다... 이제 로그인이 완료됐을때 보여주고 싶은 컴포넌트로 넘겨주면 끝입니다.... 는 아니고요! 로그인은 됐지만 이제 이걸 유지를 시켜줘야합니다. 그것이... 토큰을 발급받은 이유니까요.......   

![](https://i.imgur.com/bKkGdnn.png)

글이 너무 길어져서.. 로그인은 다음 글에 작성해보도록 하겠습니다!  

----
참고 링크  
- https://www.oauth.com/
- https://datatracker.ietf.org/doc/html/rfc6749#section-1.2
- https://hudi.blog/oauth-2.0/
- https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
- https://hudi.blog/open-id/