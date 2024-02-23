# 5. 데이터 삽입하기

<br>

#### 작성자: 박하람

## local infile 허용하기

local infile이라는 코드 사용. 그 전에 MySQL에서 이 코드 사용 허용해줘야 함. 그렇지 않으면 실행할 때 이런 에러가 뜸

```py
OperationalError: (3948, 'Loading local data is disabled; this must be enabled on both the client and server sides')
```

도커 실행할 때 server 상에서도 설정해줬지만, client 상에서도 설정 해줘야 함

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
        local_infile=True # 클라이언스 상에서 조건 추가
    )
    return connection
```

## 데이터 경로 확인하기

데이터가 어디 경로에 적혀져 있는지 확인. 한번에 도로명주소 테이블에 담길 txt 가져오기.

```py
import glob

file_list = glob.glob("data/rnaddrkor/rnaddrkor_*.txt")

for file in file_list:
    print(file)
```

## 데이터 업로드하기

전체 과정

- 파일 읽은 후에 cp949로 읽기
- cp949로 읽은 것을 utf8로 다시 적어서 임시 파일에 저장
- sql 쿼리로 경로 입력해서 한번에 저장
- 임시파일 삭제
- 총 raw data 행 수 세기

도로명주소 테이블 넣는데 1분 40초 걸림 / 지번주소 넣는데 25초 걸림

```py
import os
from tqdm import tqdm

total_line_count = 0  # 총 행수를 저장할 변수

for file in tqdm(file_list, desc='Processing files'):
    file_path = os.path.abspath(file)

    # cp949로 파일 읽고 행 불러오기
    with open(file_path, 'r', encoding='cp949', errors='ignore') as f:
        lines = f.readlines()

    # 행 수 계산
    line_count = len(lines)

    # 총 행 수에 더하기
    total_line_count += line_count

    # cp949로 읽은 파일을 utf8로 임시파일에 저장
    temp_file_path = "temp_file.txt"
    with open(temp_file_path, 'w', encoding='utf8') as f:
        f.writelines(lines)

    sql = f'''
        LOAD DATA LOCAL INFILE "{temp_file_path}" INTO TABLE rnaddrkor
        FIELDS TERMINATED BY "|";
    '''
    print(f"Processing file: {file_path}, Number of lines: {line_count}")
    query_put(sql)

    # 임시파일 삭제
    os.remove(temp_file_path)

print(f"Total number of lines: {total_line_count}")
# Processing files: 100%|██████████| 17/17 [01:43<00:00,  6.12s/it]
# Total number of lines: 6384988
```

## 데이터 업로드 확인하기

```py
sql = "SELECT * FROM rnaddrkor LIMIT 5;"
query_get(sql)
```

```py
sql = "SELECT COUNT(*) FROM rnaddrkor;"
query_get(sql)
# [{'COUNT(*)': 6384988}]
```
