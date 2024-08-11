---
title: 🐬 MySQL 로 데이터베이스 스키마 만들고 사용해보기 (기초)
date: "2024-07-25T22:40:32.169Z"
description: 마이쓰껄을 정리해보자... 그런데 이제 기초만 곁들인
tags: 
  - database
  - MySQL
---

안녕하세요? 오늘은 MySQL을 사용해 데이터베이스를 설계하고 사용해보도록 하겠습니다.  

![](https://i.imgur.com/QCy3kjB.png)

분명 학교 다닐 때 데이터베이스에 대한 공부를 했던 것 같은데요.. 하나도 기억이 안 나고.. 그래서 초심으로 돌아가 알아가보는 시간을 가져보도록 하겠습니다!   

## 🐬 RDBMS 란 무엇인가   

RDBMS는 Relational Database Management System의 약자로 관계형 데이터 베이스 관리 시스템인데요! 관계형 데이터 베이스에서는 **테이블**을 이용해서 데이터를 정의하고 이런 테이블들간의 **상호 작용을 논리적으로 연결**합니다.  

##### 테이블이란?

![](https://i.imgur.com/d2DUErx.png)


이런씩으로 생긴 녀석을 테이블이라고 하는데요. 2차원으로 이루어져있고 속성 (Attribute, Field) 이 주어지고 속성 값 (Record) 이 주어집니다. 또 이런 테이블 하나하나의 이름을 엔티티(Entity)라고 부릅니다. 엑셀로 따지면 sheet name입니다. 뭐! 테이블을 현대에 살아가며 엑셀 좀 만져보고 표 좀 칠 줄 아는 사람이면 다들 한눈에 이해가 될 것 같습니다!   

##### 스키마 (Schema) 란?

RDBMS의 가장 중요한 특징 중 하나인데요! 바로 스키마가 존재한다는 것입니다. 스키마는 **데이터 설계도**라고 이해를 하시면 편합니다.  

![](https://i.imgur.com/0WdjKEw.png)

이렇게 생긴거.. 개발을 하다보면 많이 보게 되는데요. 이런씩으로 데이터를 정의하고, 데이터들 간의 관계를 미리 정의해두는 것을 스키마라고 합니다. SQL을 사용해서 정의를 하게 되는데요!   

##### SQL 이란?

Structured Query Language의 줄임말로 관계형 데이터베이스 관리 시스템의 데이터를 관리하기 위해 설계한 특수 목적의 프로그래밍 언어입니다. 데이터 베이스를 만들고, 테이블을 만들고, 테이블 간 관계를 정의하고 등등의 일을 할 수 있습니다. 

## 🐬 MySQL 사용해보기

이론적인 이야기들은 역시나 직접 만들어가고 사용해보며 배우는게 가장 빠른 것 같습니다. 한 번 직접 데이터베이스를 만들고 사용해보도록 하겠습니다. 저는 DBeaver를 사용했는데요 사실 뭘 써도 뭐 상관은 없습니다만.. 워크밴치는 안 예뻐서요. DBeaver가 혹시 없으신 분들은 [이 블로그](https://daslyee.tistory.com/112)를 참고해서 초기세팅을 하시면 될 것 같습니다.   

### 🐙 데이터 베이스 생성 

저장하고 싶은 위치에 데이터 SQL script를 하나 생성해줍니다. 그리고 데이터 베이스를 생성합니다.  

```sql
CREATE DATABASE practice;
```

저는 practice라는 이름의 데이터베이스를 생성했습니다.  

![](https://i.imgur.com/AvI90Jy.jpeg)

이런씩으로 데이터베이스가 생깁니다. 그리고 이걸 사용하고 싶으면  

```sql
use practice;
```

이렇게 사용해주시면 practice 데이터베이스를 사용을 할 수 있게 됩니다.  

### 🐙 스키마 정의하기

이제 테이블 만들고 어쩌구 저쩌구.. 해주면 되는데요! 그 전에 스키마를 정의해보도록 하겠습니다.  

![](https://i.imgur.com/2nVuHQ5.png)


스키마는 [여기]( https://dbdiagram.io/d)에서 제공하는 기본 스키마를 살짝 수정해서 가져와봤습니다. 이제 이걸 SQL로 테이블을 만들고 관계를 설정해줘보도록 하겠습니다.  데이터 타입에 관한 건 [여기](https://www.w3schools.com/sql/sql_datatypes.asp)에서 한 번 보시면 좋을 것 같습니다.  

##### users 테이블 생성 

```sql
CREATE TABLE users (
	id INT not null auto_increment,
	username VARCHAR(50) not null,
	profile_pic VARCHAR(50) default '/default.png',
	PRIMARY KEY (id)
);
```

- **id**
	- not null : null이 들어오면 안됩니다. 
	- auto_increment : 1부터 시작해서 데이터가 하나씩 추가될 떄마다 1씩 증가하도록 해줍니다. 
- **username**
	- VARCHAR : 가변 데이터타입인 varchar을 사용했습니다. 최대 길이는 50입니다. 
- **profile_pic**
	- default : null이 들어오면 '/default.png'를 기본으로 넣어줍니다. 
- **primary key (id)**
	- 기본키를 id로 정해줍니다. 

##### posts 테이블 생성 

```sql
CREATE TABLE posts (
	id INT not null auto_increment,
	title VARCHAR(50) not null,
	content TEXT,
	user_id INT not null,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

이 테이블의 핵심은 user_id인데요. user_id는 외래키입니다. 외래키는 **한 테이블의 필드 중 다른 테이블의 행을 식별할 수 있는 키**를 말합니다. 즉, users 테이블의 id를 user_id에 사용하겠다는 거죠.  
**ON DELETE CASCADE**를 통해 users의 id가 삭제되면 함께 삭제되도록 해줍니다.  

##### follows 테이블 생성  

```sql
CREATE TABLE follows (
	id INT not null auto_increment,
	following_user_id INT not null,
	followed_user_id INT not null,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	UNIQUE KEY unique_follow (following_user_id, followed_user_id),
	FOREIGN KEY (following_user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (followed_user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

posts와 마찬가지로 외래키를 사용해주는데요. 여기서 핵심은 **UNIQUE KEY**입니다.  
Unique Key는 **유일 키**로 값 중복을 허용하지 않습니다. 즉 following id와 followed id의 조합이 같은 것이 한 개 이상 있으면 안된다는 의미죠. 안 그러면 중복 데이터가 계속해서 쌓일테니까요.  

이렇게 해서 스키마가 완성되었습니다. Tables 우클릭 > View diagram을 클릭하면 ERD를 확인할 수 있습니다. 이제 이 테이블들을 이용하여 데이터베이스를 사용해보도록 하겠습니다!  

![](https://i.imgur.com/YE1VnHR.jpeg)


### 🐙 데이터베이스 CRUD 사용하기

##### 테이블 수정하기 

그런데 테이블을 다 만들고 보니.. users가 가입한 시간도 기록해두면 좋을 것 같다는 생각이 들었습니다. 그래서 테이블에 필드를 추가해주도록 할 건데요!  

```sql
ALTER table users add created_at TIMESTAMP default CURRENT_TIMESTAMP;
```

이렇게 **ALTER**를 사용해주면 됩니다. 그 외에도 필드 삭제, 수정, 추가 등이 있으니 필요하신 대로 해보면서 사용하면 좋을 것 같습니다.  

##### 데이터 입력하기 

유저를 가입시켜 보겠습니다.   

**users**   
```sql
INSERT INTO users (username, profile_pic) VALUES 
('유재석', '/jaeseok.png'),
('박명수', '/myungsoo.png'),
('하하', '/haha.png'),
('정준하', '/junha.png'),
('정형돈', '/doni.png'),
('노홍철', '/dorai.png');
```

두 필드 값만 받는 것으로 설정을 해주었습니다. 같은 방식으로 posts, follows를 설정해줍니다.   

**posts**  
```sql
INSERT INTO posts (title, content, user_id) VALUES
('저는 유재석입니다.', '안녕하세요!', 3),
('이제는', '더이상 물러날 곳이 없다!', 6),
('꿈은 없고요!', '그냥 놀고싶습니다!', 4);
```

**follows**  
```sql
INSERT INTO follows (following_user_id, followed_user_id) VALUES
(3, 4),
(4, 3),
(6, 7),
(6, 5),
(5, 3);
```

##### 데이터 수정하기

```sql
UPDATE users
SET profile_pic = '/yoonu.png'
WHERE id = 3;
```

이렇게 업데이트를 할 테이블, 업데이트 할 필드 이름과 값, 그리고 id값을 주면 됩니다.  

##### 데이터 삭제하기

```sql
DELETE FROM follows
WHERE id = 5;
```

수정하기와 같은 형식으로 지워주면 됩니다.   

##### 데이터 조회하기 

```sql
SELECT id, username FROM users;
SELECT * FROM users;
SELECT id, username FROM users ORDER BY id DESC;
SELECT id, username FROM users WHERE id > 3 AND id < 10;
```

이런씩으로 조회를 할 수 있습니다.   

그때그때 필요한 걸 검색하면서 사용하면 될 것 같습니다. 기초적인 CRUD는 여기까지 하고 다음 글에서는 데이터 분석을 하는 방법을 알아보도록 하겠습니다.  

----

참고 링크  
- https://dbdiagram.io/d
- https://brunch.co.kr/@dan-kim/26
- https://im-codding.tistory.com/59
- https://121202.tistory.com/27
- https://www.inflearn.com/course/sql-db-mysql-%ED%8C%8C%EC%9D%B4%EC%8D%AC-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B6%84%EC%84%9D/dashboard