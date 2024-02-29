# 6. SQL로 주소 데이터 분석하기

<br>

#### 작성자: 박하람

1. 도로명주소를 부여하는 규칙으로 주소 생성하기
2. 도로명주소 한글과 관련지번 연결하기

## 분석1. 시도별 도로명주소의 개수 분석하기

우선적으로 도로명주소를 만들고, 시도별로 도로명주소의 개수를 분석해야함

### 도로명주소 만들기

건물군 단위까지 도로명주소 조합하기. 활용가이드에서 Oracle로 조합하는 예시가 나와있는데, 이걸 MySQL 바꾸고 View를 만드는게 아니라 Table로 만드려고 함.

- 도로명주소1: 참고항목 포함
- 도로명주소2: 참고항목 미포함

아래 코드가 돌아가는데 걸리는 시간은 \*\*분이라 시간 소요가 많이 됨.

```py
sql = '''
CREATE TABLE full_rna_addr AS
SELECT DISTINCT A.`기초구역번호(우편번호)` AS 새우편번호,
    CONCAT(A.시도명, ' ',
        CASE WHEN A.시군구명 = '' THEN '' ELSE CONCAT(A.시군구명, ' ') END,
        CASE WHEN A.읍면동명 = '' THEN '' ELSE
            CASE WHEN A.리명 = '' THEN '' ELSE CONCAT(A.읍면동명, ' ') END
        END,
        A.도로명, ' ',
        CASE WHEN A.지하여부 = 0 THEN ''
            WHEN A.지하여부 = 1 THEN '지하 '
            WHEN A.지하여부 = 2 THEN '공중 '
            ELSE ''
        END,
        A.건물본번,
        CASE WHEN A.건물부번 = 0 THEN '' ELSE CONCAT('-', A.건물부번) END,
        CASE
            WHEN A.공동주택구분 = '0' THEN
                CASE
                    WHEN A.읍면동명 = '' THEN ''
                    ELSE
                        CASE WHEN A.리명 = '' THEN CONCAT(' (', A.읍면동명, ')') ELSE '' END
                END
            WHEN A.공동주택구분 = '1' THEN
                CASE
                    WHEN A.읍면동명 = '' THEN
                        CASE
                            WHEN A.시군구용건물명 = '' THEN ''
                            ELSE CONCAT(' (', A.시군구용건물명, ')')
                        END
                    ELSE CONCAT(' (',
                        CASE
                            WHEN A.리명 = '' THEN CONCAT(A.읍면동명, ', ')
                            ELSE ''
                        END,
                        CASE
                            WHEN A.시군구용건물명 = '' THEN ''
                            ELSE A.시군구용건물명
                        END,
                    ')')
                END
            ELSE ''
        END
    ) AS 도로명주소1,
    CONCAT(A.시도명, ' ',
        CASE WHEN A.시군구명 = '' THEN '' ELSE CONCAT(A.시군구명, ' ') END,
        CASE WHEN A.읍면동명 = '' THEN '' ELSE
            CASE WHEN A.리명 = '' THEN '' ELSE CONCAT(A.읍면동명, ' ') END
        END,
        A.도로명, ' ',
        CASE WHEN A.지하여부 = 0 THEN ''
            WHEN A.지하여부 = 1 THEN '지하 '
            WHEN A.지하여부 = 2 THEN '공중 '
            ELSE ''
        END,
        A.건물본번,
        CASE WHEN A.건물부번 = 0 THEN '' ELSE CONCAT('-', A.건물부번) END
    ) AS 도로명주소2,
    A.도로명주소관리번호 AS 도로명주소관리번호,
    A.시도명 AS 시도명
FROM rnaddrkor A;
'''

query_update(sql)
```

아래 10줄만 입력하면 잘 생성된 걸 확인할 수 있음

```py
sql = "SELECT * FROM full_rna_addr LIMIT 10;"
query_get(sql)
# [{'새우편번호': '03047',
#   '도로명주소1': '서울특별시 종로구 자하문로 94 (청운동)',
#   '도로명주소2': '서울특별시 종로구 자하문로 94',
#   '도로명주소관리번호': '11110101310001200009400000',
#   '시도명': '서울특별시'},
```

### 시도별 도로명주소의 개수 분석하기

시도별 도로명주소의 개수
코드는 시도명을 기준으로 도로명주소의 개수를 출력함. 도로명주소2나 도로명주소1로 개수를 세도 되지만, 도로명주소관리번호가 개별 id 값이고, 숫자라서 실행시간이 더 적게 걸림.

```py
sql = "SELECT `시도명`, COUNT(`도로명주소관리번호`) AS count FROM full_rna_addr GROUP BY `시도명` ORDER BY count DESC;"
query_get(sql)
# [{'시도명': '경기도', 'count': 1020563},
#  {'시도명': '경상북도', 'count': 713862},
#  {'시도명': '경상남도', 'count': 653480},
#  {'시도명': '전라남도', 'count': 598298},
#  {'시도명': '서울특별시', 'count': 530721},
#  {'시도명': '충청남도', 'count': 491608},
#  {'시도명': '전북특별자치도', 'count': 437063},
#  {'시도명': '강원특별자치도', 'count': 364686},
#  {'시도명': '충청북도', 'count': 335225},
#  {'시도명': '부산광역시', 'count': 301822},
#  {'시도명': '대구광역시', 'count': 229727},
#  {'시도명': '인천광역시', 'count': 186039},
#  {'시도명': '제주특별자치도', 'count': 155426},
#  {'시도명': '광주광역시', 'count': 120474},
#  {'시도명': '대전광역시', 'count': 114026},
#  {'시도명': '울산광역시', 'count': 104458},
#  {'시도명': '세종특별자치시', 'count': 27510}]
```

이걸 판다스의 데이터프레임으로 가져와서 파이썬에서 조작해보자. df를 출력하면 위의 결과가 데이터프레임으로 출력됨.

```py
import pandas as pd

sql = "SELECT `시도명`, COUNT(`도로명주소관리번호`) AS count FROM full_rna_addr GROUP BY `시도명` ORDER BY count DESC;"

conn = init_db_connection()
df = pd.read_sql(sql, con=conn)
```

plotly로 시각화하면 다음과 같음. mysql에 대한 분석결과를 가져와서 파이썬으로 시각화할 수 있음.

```py
import plotly.graph_objects as go
import pandas as pd

# 바그래프 생성
bar = go.Bar(x=df['시도명'], y=df['count'], name='도로명주소관리번호 개수')

# 레이아웃 설정
layout = go.Layout(title='시도별 도로명주소의 개수')

# Figure 생성과 출력
fig = go.Figure(data=bar, layout=layout)
fig.show()
```

<embed src="/docs/6-6-address-count-per-sido.html" width="100%" height="450px"></embed>

## 분석2. 관련지번이 많은 도로명주소 분석하기

(1) 개별 도로명주소를 생성한 테이블에 관련지번 테이블을 연계하고, (2) 하나의 도로명주소에 붙은 관련지번 개수 세기, (3) 상위 10개부터 출력

### 관련지번 테이블에서 PNU 생성하기

관련지번을 식별할 수 있는 고유한 식별자는 PNU (19자리; 법정동코드(10) + 산여부(1) + 번지(4) + 호(4))
jibun_rnaddrkor라는 테이블에 pnu 컬럼 추가, 다음 함수는 여러 줄의 sql을 실행하는 함수

```py
def multi_query_update(sql):
    connection = init_db_connection()
    with connection:
        with connection.cursor() as cursor:
            sql_list = [query.strip() for query in sql.strip().split('\n')]
            for query in sql_list:
                cursor.execute(query)
                print(f"Query executed: {query}")
            connection.commit()
            return True
```

PNU라는 컬럼을 만들고, 값을 조합해서 PNU 생성함

```py
sql = '''
ALTER TABLE jibun_rnaddrkor ADD PNU VARCHAR(19);
UPDATE jibun_rnaddrkor SET PNU = CONCAT(`법정동코드`, `산여부`, LPAD(`지번본번(번지)`, 4, '0'), LPAD(`지번부번(호)`, 4, '0'));
'''
multi_query_update(sql)
```

결과는 다음과 같음

```py
sql = "SELECT PNU FROM jibun_rnaddrkor LIMIT 5;"
query_get(sql)
# [{'PNU': '1111010100001300003'},
#  {'PNU': '1111010100001290002'},
#  {'PNU': '1111010100001290003'},
#  {'PNU': '1111010100001310001'},
#  {'PNU': '1111010100001290001'}]
```

### 도로명주소 테이블과 관련지번 테이블 연결하기

아래와 같이 테이블 연결할 수 있음. 근데 도로명주소에 PNU가 없는 경우는 개별 도로명주소에 관련지번이 없다는 의미.

```py
sql = '''
SELECT A.`도로명주소관리번호`, A.`도로명주소1`, A.`도로명주소2`, B.PNU
FROM full_rna_addr A
LEFT JOIN jibun_rnaddrkor B
ON A.`도로명주소관리번호` = B.`도로명주소관리번호`
LIMIT 10;
'''
query_get(sql)
# [{'도로명주소관리번호': '11110101310001200009400000',
#   '도로명주소1': '서울특별시 종로구 자하문로 94 (청운동)',
#   '도로명주소2': '서울특별시 종로구 자하문로 94',
#   'PNU': None},
# ...
```

도로명주소관리번호를 기준으로 관련지번의 개수를 세보자. 하나의 도로명주소에 관련지번이 많은 순으로 10개 출력.
여기서 도로명주소1, 도로명주소2를 뽑고싶지만, 쿼리 시간이 넘나 오래걸림.

```py
sql = '''
SELECT A.`도로명주소관리번호`, COUNT(DISTINCT B.PNU) AS PNU_COUNT
FROM full_rna_addr A
LEFT JOIN jibun_rnaddrkor B ON A.`도로명주소관리번호` = B.`도로명주소관리번호`
GROUP BY A.`도로명주소관리번호`
ORDER BY PNU_COUNT DESC
LIMIT 10;
'''

conn = init_db_connection()
df1 = pd.read_sql(sql, con=conn)
df1
```

가장 많이 관련지번에 연결된 도로명주소관리번호 10개 가져와서 그 주소가 뭔지 파악해보기

```py
rna_addr_list = df1['도로명주소관리번호'].tolist()

sql = f'''
SELECT * FROM full_rna_addr WHERE `도로명주소관리번호` IN {str(rna_addr_list).replace('[','(').replace(']',')')}
'''

conn = init_db_connection()
df2 = pd.read_sql(sql, con=conn)
df2
```

결과를 비교하면, 서대구센트럴자이와 서대구역화성파크드림 아파트가 관련지번을 많이 갖고있고, 다음은 서울의 평화시장! (가게 하나마다 부속지번 부여?)

```py
merged = df1.merge(df2, on='도로명주소관리번호').sort_values('PNU_COUNT', ascending=False)
merged
```
