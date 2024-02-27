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

<embed src="/docs/address-count-per-sido.html" width="100%" height="450px"></embed>

### 시도별 도로명주소의 개수 분석하기

시도별 도로명주소의 개수

## 분석2. 관련지번
