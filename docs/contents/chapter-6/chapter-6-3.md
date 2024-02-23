# 3. 데이터베이스 생성하기

<br>

#### 작성자: 박하람

## 관계형 데이터베이스의 구조

데이터 구조에 맞게 데이터베이스와 테이블 생성.

- 데이터베이스란?
- 테이블이란?

## 데이터 구조 살펴보기

도로명주소 한글은 2종류의 파일로 구분. rnaddrkor와 jibun_rnaddrkor -> 하나의 데이터베이스에 테이블 2개 생성

## 데이터베이스 생성하기

address란 데이터베이스 생성.

```py
conn = init_connection()
sql = "CREATE DATABASE address DEFAULT CHARACTER SET utf8;"

with conn:
    with conn.cursor() as cur:
        cur.execute(sql)
        conn.commit()
```

다음의 코드로 address 데이터베이스 생성완료 확인

```py
conn = init_connection()
sql = "SHOW DATABASES;"

with conn:
    with conn.cursor() as cur:
        cur.execute(sql)
        for data in cur:
            print(data)
```

생성한 데이터베이스 삭제하고 싶다면 sql 구분을 `DROP DATABASE address;`로 수정하면 됨
