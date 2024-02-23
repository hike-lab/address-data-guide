# 4. 테이블 생성하기

<br>

#### 작성자: 박하람

## 테이블 스키마란?

- 테이블 스키마란?
- 도로명주소 한글 활용을 클릭하면, 전체분과 관련지번에 대한 테이블 스키마 제공

## 도로명주소 한글의 테이블 스키마

도로명주소 한글 활용은 PK가 있고, PK는 primary key다. (여기서 식별자 역할을 한다)
이거에 맞춰서 schema를 생성하면 다음과 같다.

### 도로명주소 테이블

```sql
CREATE TABLE `rnaddrkor` (
    `도로명주소관리번호` varchar(26) NOT NULL,
    `법정동코드` varchar(10),
    `시도명` varchar(40),
    `시군구명` varchar(40),
    `읍면동명` varchar(40),
    `리명` varchar(40),
    `산여부` varchar(1),
    `번지` varchar(4),
    `호` varchar(4),
    `도로명코드` varchar(12) NOT NULL,
    `도로명` varchar(80),
    `지하여부` varchar(1) NOT NULL,
    `건물본번` int(5) ZEROFILL NOT NULL,
    `건물부번` int(5) ZEROFILL NOT NULL,
    `행정동코드` varchar(60),
    `행정동명` varchar(60),
    `기초구역번호(우편번호)` varchar(5),
    `이전도로명주소` varchar(400),
    `효력발생일` varchar(8),
    `공동주택구분` varchar(1),
    `이동사유코드` varchar(2),
    `건축물대장건물명` varchar(400),
    `시군구용건물명` varchar(400),
    `비고` varchar(200),
    PRIMARY KEY (`도로명주소관리번호`, `도로명코드`, `지하여부`, `건물본번`, `건물부번`)
);
```

### 관련지번 테이블

```sql
CREATE TABLE `rnaddrkor_jibun` (
    `도로명주소관리번호` varchar(26) NOT NULL,
    `법정동코드` varchar(10) NOT NULL,
    `시도명` varchar(40),
    `시군구명` varchar(40),
    `법정읍면동명` varchar(40),
    `법정리명` varchar(40),
    `산여부` varchar(1) NOT NULL,
    `지번본번(번지)` int(4) ZEROFILL NOT NULL,
    `지번부번(호)` int(4) ZEROFILL NOT NULL,
    `도로명코드` varchar(12),
    `지하여부` varchar(1),
    `건물본번` int(5),
    `건물부번` int(5),
    `이동사유코드` varchar(2),
    PRIMARY KEY (`도로명주소관리번호`, `법정동코드`, `산여부`, `지번본번(번지)`, `지번부번(호)`)
);
```

## 테이블 생성하기

- 아래 함수 3종세트 설명
  - init_db_connection 함수는 데이터베이스 추가
  - query_get: 질의한 결과를 모두 가져오는 함수 (fetchall)
  - query_update: commit하는 거를 가져오는 함수

```py
def init_db_connection():
    connection = pymysql.connect(
        host="localhost",
        port=3306,
        user="root",
        password="root",
        database="address",
        cursorclass=pymysql.cursors.DictCursor,
        charset="utf8",
    )
    return connection

def query_get(sql):
    connection = init_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql)
            return cursor.fetchall()

def query_update(sql):
    connection = init_db_connection()
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(sql)
            connection.commit()
            return True
```

sql 쿼리문안을 앞의 테이블에 있는 내용으로 바꾸면서 2번 하기

```py
sql = '''
    CREATE TABLE `rnaddrkor` (
        `도로명주소관리번호` varchar(26) NOT NULL,
        ...
        PRIMARY KEY (`도로명주소관리번호`, `도로명코드`, `지하여부`, `건물본번`, `건물부번`)
    );
'''

query_update(sql)
```

## 생성한 테이블 확인하기

`rnaddrkor`와 `jibun_rnaddrkor`가 출력된다면 성공적으로 테이블 생성한 것

```py
query_get("SHOW TABLES;")
```

아래와 같이 테이블의 스키마도 확인할 수 있음

```py
query_get("DESC rnaddrkor;")
```
