# 2. 프로젝트 환경 구축하기

<br>

#### 작성자: 박하람

## Docker로 MySQL 설치하기

- 윈도우/맥 버전별 docker 설치방법
- 버전: Docker version 20.10.12

### MySQL 이미지 가져오기

```bash
$ docker pull mysql
Using default tag: latest
latest: Pulling from library/mysql
ea4e27ae0b4c: Pull complete
837904302482: Pull complete
3c574b61b241: Pull complete
654fc4f3eb2d: Pull complete
32da9c2187e3: Pull complete
dc99c3c88bd6: Pull complete
970181cc0aa6: Pull complete
d77b716c39d5: Pull complete
9e650d7f9f83: Pull complete
acc21ff36b4b: Pull complete
Digest: sha256:ff5ab9cdce0b4c59704b4e2a09deed5ab8467be795e0ea20228b8528f53fcf82
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest
```

가져온 도커 이미지 확인

```bash
$ docker images
REPOSITORY                      TAG               IMAGE ID       CREATED         SIZE
mysql                           latest            e68e2614955c   4 weeks ago     638MB
```

### Docker MySQL 실행하기

```bash
$ docker run --name mysql -e MYSQL_ROOT_PASSWORD=<password> -d -p 3306:3306 mysql:latest
```

```bash
$ docker ps -a
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                               NAMES
5dedb08a6941   mysql:latest   "docker-entrypoint.s…"   22 seconds ago   Up 22 seconds   0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
```

### Docker 컨테이너 접속

초기비번 root로 설정

```bash
$ docker exec -it mysql bash
bash-4.4# mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.3.0 MySQL Community Server - GPL

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.02 sec)
```

### Docker 컨테이너 시작, 중지, 재시작

```bash
# MySQL Docker 컨테이너 중지
$ docker stop mysql

# MySQL Docker 컨테이너 시작
$ docker start mysql

# MySQL Docker 컨테이너 재시작
$ docker restart mysql
```

## 파이썬 노트북으로 MySQL 연결하기

pymysql 다운로드

```py
!pip3 install pymysql
```

```py
import pymysql

conn = pymysql.connect(
    host="localhost",
    port=3306,
    user="root",
    password="root",
    cursorclass=pymysql.cursors.DictCursor,
    charset="utf8",
)

sql = "SHOW DATABASES;"
cursor = conn.cursor()
cursor.execute(sql)
```

열린거 닫아주기

```py
conn.close()
```

## 데이터 다운로드

[도로명주소 한글](https://business.juso.go.kr/addrlink/attrbDBDwld/attrbDBDwldList.do?cPath=99MD&menu=%EB%8F%84%EB%A1%9C%EB%AA%85%EC%A3%BC%EC%86%8C%20%ED%95%9C%EA%B8%80) (데이터에 대한 자세한 설명은 chapter 2 참고)
2024년 1월 전체자료 다운로드
건물군 단위까지 데이터 제공

데이터 설명

- rnaddrkor: 건물군까지 도로명주소 데이터 제공
  - 경로: code/data/rnaddrkor
- jibun_rnaddrkor: 건물군까지 관련 지번 제공
  - 경로: code/data/jibun_rnaddrkor

## 참고문헌

- https://poiemaweb.com/docker-mysql
