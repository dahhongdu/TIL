---
title: 🌏 리액트+타입스크립트+Context API로 로그인 여부 상태 관리하기
date: "2024-08-20T22:40:32.169Z"
description: 그냥 전역으로 휘뚜루마뚜루 관리하면 되는거아냐?! 했다가 꽤나 삽질했습니다만 이런 제가 바보같은가요
tags: 
  - frontend
  - react
  - context api
  - auth
---


안녕하세요? 오랜만에 글을 쓰는 것 같습니다..하하.. 너무 덥네요..  

![](https://i.imgur.com/cC0Syqm.png)

이번엔.. 로그인과 회원가입 구현을 완료했으니 로그인 상태를 전역에서 알 수 있도록 해주어서 User에게 보여줄 페이지와 감출 페이지를 구분하고 싶습니다!   
# createContext

### interface 생성 

먼저 ContextType을 생성해줍니다! 위치는 src > @types에 생성을 해주었구요 파일 이름은 .d.ts로 끝나야 합니다.  

```ts
interface LoginStateContextType {
  isLoggedIn: boolean | undefined;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}
```

이렇게 해주었는데요! 로그인 여부를 참/거짓으로 확인하고 useState를 이용해 isLoggedIn 상태를 바꿔줍니다. useState의 set 함수의 type이 **Dispatch<SetStateAction<타입>>** 입니다.  

### Context 생성 

저는 context를 위한 폴더를 따로 만들어서 파일을 새로 만들었습니다.  

```ts
export const LoginStateContext = createContext<
  LoginStateContextType | undefined
>(undefined);
```

이렇게 만들어줍니다. 이제 Provider를 만들어줘야합니다.  

```ts
export const ContextsProvider = ({ children }: { children: ReactNode }) => {
  let state: boolean;
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginStateContext.Provider>
  );
};
```

근데 제가 처음에는 이렇게 그냥 초기값을 false로 해서 넘겨줬는데요..  

![z25AelJ.png](https://i.imgur.com/z25AelJ.png)

헤엑.. 이렇게 사람 열받게.. 버그가 계속 생깁니다. 처음에 user가 링크를 바로 쳐서 들어가거나 새로고침이 되면 context api가 초기화가 돼서 그렇습니다. 사실 한참의 삽질 후에 뭘 놓쳤는지 알았는데용.. 덕분에 useState의 초깃값이 얼마나 중요한지! 그냥 가볍게 정하고 넘어가면 안되는지! 깨달았습니다 ㅋㅅㅋ ...  

```ts
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    state = true;
  } else {
    state = false;
  }
  
const [isLoggedIn, setIsLoggedIn] = useState(state);
```

그래서 이렇게 중간에 localStorage에서 토큰이 있는지 확인을 하고 useState의 값을 초기화해서 Provider에게 넘겨줍니다. 이렇게 하면 .. user가 새로고침을 백번 천번 눌러도 ! 모든것에 대비가 됩니다.. 근데 새로고침 아니어도 애초에 초깃값을 그냥 아무거나 임의로 정해서 냅다 넘겨준거 자체가 멍청이슈네요 .   

++) 백엔드 팀원이 로컬만 확인하면 토큰 만료 여부를 알 수 없지 않냐고.. 맞는 말입니다! 바보가팅 왜 로컬 스토리지만 확인할 생각을 했는지 모르겠네요 허거덩.. 아무튼 액세스 토큰의 유효성도 검사해주어야 합니다! 해봅시다!  

[카카오에서 제공해주는 api 문서]([https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info))를 살펴보면 사용할 수 있는 api가 나와있습니다 ㅎㅅㅎ  `https://kapi.kakao.com/v1/user/access_token_info` 바로 요 api입니다! 여기로 요청을 보내면  

```json
{
    "data": {
        이런저런 데이터들
    },
    "status": 200,
    "statusText": "OK",
    "headers": {
		이모저모 헤더 내용 
    },
    "config": {
	    이모저모 config들!
    },
    "request": {}
}
```

성공하면 이런씩으로 응답이 옵니다. 이게 아니라면 401, 404 등 상황에 맞는 http 응답 코드가 온다고 합니다. 이에 알맞게 처리는.. 나중에 하고 저희는 성공했을때에 맞춰서 코드를 구현해보겠습니다.  

### api 처리하기

```ts
export const userApi = {

// 이런저런 api 처리 로직들 ...

  isAccessTokenValid: async (token: string): Promise<number> => {
    const res = await axios.get(
      'https://kapi.kakao.com/v1/user/access_token_info',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.status;
  }
}
```

header에 토큰을 실어서 보내라는 형식대로 요청을 보내도록 해줍니다!   

### Provider 로직 마저 처리하기

```ts
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const isAccessTokenValid = async (token: string) => {
      const statusCode = await userApi.isAccessTokenValid(token);
      if (statusCode === 200) {
        setIsLoggedIn(true);
      }
    };

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken !== null) {
      isAccessTokenValid(accessToken);
    }
  }, []);

  return (
    <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginStateContext.Provider>
  );
```

저는 이렇게 해주었습니다. api를 가져오는 부분 때문에.. 비동기 처리를 해주었습니다. 이때 첫 마운트 시에만 token 검증을 하게 해주었구요! 이대로 그냥 하면 무한 랜더링 지옥에 갇히게 됩니다 ^-^   

![](https://i.imgur.com/wDFt6Aa.png)

지옥에서 빠져나오기 위해.. 먼저 **isAccessTokenValid** 함수를 따로 빼주었습니다.

```ts
const isAccessTokenValid = async (token: string) => {
  const statusCode = await userApi.isAccessTokenValid(token);
  if (statusCode === 200) {
    return true;
  }
  return false;
};
```

그리고 Provider는  

```ts
export const ContextsProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken !== null) {
      const res = isAccessTokenValid(accessToken);
      if (typeof(res) === 'boolean') {
        setIsLoggedIn(res);
      }
    }
  }, []);

  return (
    <LoginStateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginStateContext.Provider>
  );
};
```

이렇게 변경해주었습니다!  

# 커스텀 Hook 만들기  

이거.. typescript잖아요?! 매번 가져다 쓸 때마다 context가 undefined인지 아닌지 체크를 해줘야 합니다. 세상 불편. 그래서 이걸 대신 해줄 훅을 만들어줍니다.  

```ts
export const useLoginState = () => {
  const context = useContext(LoginStateContext);
  if (context === undefined) {
    throw new Error('로그인 context 사용 코드.. 뭔가 문제가 생겼다잉..')
  }
  return context;
}
```  
이렇게.. 훅 까지 완성입니다.  

# 컴포넌트에서 사용하기 

먼저 가장 상위 컴포넌트를 ContextProvider로 감싸줍니다.   

```ts
<ContextsProvider>
    <RouterProvider router={routes} />
</ContextsProvider>
```

와 이러면 진짜 끝입니다. 그냥 가져다가 쓰면 됩니다!  

```ts
const { isLoggedIn } = useLoginState();

{isLoggedIn ? (
	    <로그인 했을 시 보여주고 싶은 페이지>
    ) : (
        <로그인을 하지 않았을 시 보여주고 싶은 페이지>
	)
}
```

이런씩으로.. 그냥 가져다가 쓰면 됩니다!  

![](https://i.imgur.com/5DdwgUL.png)

끝입니다! 처음 해보는 거라 조금 .. 허접하게 구현을 한 것 같은데요! 더 좋은 방법으로 리팩토링을 하게 되면 다시 한 번 글을 써보겠습니다 ㅎㅅㅎ  

----
참고 링크  
- https://react.dev/learn/passing-data-deeply-with-context
- https://react.dev/reference/react/useContext#updating-data-passed-via-context
- https://merrily-code.tistory.com/209#google_vignette
- [https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#get-token-info)
- https://www.youtube.com/watch?v=-yIsQPp31L0