# 6.3 데이터베이스 생성하기

<br>

#### 작성자: 박하람

이번 장은 MySQL에서 주소 데이터를 저장할 데이터베이스를 생성합니다. 데이터에 맞게 파이썬으로 데이터베이스를 생성하는 방법에 대해 학습합니다. <span style="color: red">이 장에서 사용되는 데이터는 [구글 드라이브](https://drive.google.com/drive/folders/1l5TRq-lcdlhWHmhAk6KFwPY7wP4BfAUL?usp=drive_link)에서 다운로드 받을 수 있고, 코드 원본은 [깃헙](https://github.com/hike-lab/address-data-guide/tree/main/code/chapter-6)에서 확인할 수 있습니다.</span>

## 데이터 구조 살펴보기

관계형 데이터베이스는 데이터의 특성에 따라 여러 개의 데이터베이스를 생성할 수 있습니다. 하나의 데이터베이스는 여러 개의 테이블을 갖고 있고, 도로명주소 한글 데이터는 2개의 테이블로 구분할 수 있습니다. 건물 또는 건물군까지 표현된 도로명주소의 정보를 담고 있는 `rnaddrkor` 테이블과 도로명주소와 관련된 지번의 정보를 담고 있는 `jibun_rnaddrkor` 테이블이 있습니다. `address`라는 이름의 데이터베이스를 생성하고, 두 개의 테이블을 이 데이터베이스 안에 생성해볼 것입니다.

## 데이터베이스 생성하기

`address`란 이름의 데이터베이스를 생성하는 방법은 `sql` 변수 안에 SQL 구문으로 작성됩니다. `CREATE DATABASE address`는 `address`란 이름의 데이터베이스를 생성하고, `DEFAULT CHARACTER SET utf8`은 기본 인코딩으로 `utf8`을 설정합니다.

```py
conn = init_connection()
sql = "CREATE DATABASE address DEFAULT CHARACTER SET utf8;"

with conn:
    with conn.cursor() as cur:
        cur.execute(sql)
        conn.commit()
```

다음의 코드로 생성된 `address` 데이터베이스를 확인할 수 있습니다. `{'Database': 'address'}`으로 출력되었다면 데이터베이스를 성공적으로 생성한 것입니다.

```py
conn = init_connection()
sql = "SHOW DATABASES;"

with conn:
    with conn.cursor() as cur:
        cur.execute(sql)
        for data in cur:
            print(data)
# {'Database': 'address'}
# {'Database': 'information_schema'}
# {'Database': 'mysql'}
# {'Database': 'performance_schema'}
# {'Database': 'sys'}
```

생성한 데이터베이스를 삭제하고 싶다면 `DROP DATABASE address;`를 실행하면 됩니다. 다만 생성한 데이터베이스를 삭제하게 되면 내부의 정보가 모두 삭제되니 데이터베이스의 삭제는 신중해야 합니다.
