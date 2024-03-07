# 4. 도로명 데이터 살펴보기

<br>

#### 작성자: 송채은, 이정윤

두 번째로 살펴볼 데이터는 공개하는 주소 중 '도로명' 데이터입니다. 현재 공개되어 있는 도로명의 개수를 도로유형별, 행정구역별로 나누어 살펴보고, 간단한 시각화를 진행합니다. 전체 코드와 실행결과는 [코랩 코드](https://colab.research.google.com/drive/1zryZex86ykiYYjz24MTyWVvRQTImvZgR?usp=sharing)에서 확인하세요.

## 데이터 불러오기

실습 데이터는 [주소기반산업지원서비스](https://business.juso.go.kr/addrlink/attrbDBDwld/attrbDBDwldList.do?cPath=99MD&menu=%EB%8F%84%EB%A1%9C%EB%AA%85%EC%A3%BC%EC%86%8C%20%ED%95%9C%EA%B8%80)에서 제공하는 공개하는 주소 중 도로명 데이터의 2024년 1월 기준 전체자료 입니다. 데이터는 txt 파일로 되어 있으며, 각 파일은 "\\|"로 구분되어 있습니다. 데이터를 처리하기 용이하도록 활용가이드에서 확인한 컬럼명을 붙이고, csv 파일로 저장합니다.

```python
path = r"TN_SPRD_RDNM.txt"

## 활용가이드에서 확인한 컬럼명 붙여주기
col = ['시군구코드', '도로명번호', '읍면동일련번호', '도로명', '영문도로명', '시도명', '시군구명',
          '읍면동구분', '읍면동코드', '읍면동명', '사용여부', '부여사유',
          '변경이력사유', '변경이력정보', '영문시도명', '영문시군구명', '영문읍면동명',
          '도로구간의시작지점기초번호', '도로구간끝지점기초번호', '효력발생일', '말소일자']

df = pd.read_csv(path, sep='\|', names = col, engine='python', encoding='cp949', dtype=
str, keep_default_na=False, header = None)

## csv로 저장하기
df.to_csv('/content/drive/MyDrive/HIKE(연구실, 대학원)/2024/주소/address-data-guide/total-road-name_2401.csv', index=False, encoding="utf-8")
```

## 데이터 확인하기

```python
df = pd.read_csv('total-road-name_2401.csv', encoding='utf-8')
df.head()
```

저장한 데이터를 불러온 뒤, 데이터의 기본 정보를 확인합니다. (여기까지는 3-2. 도로명주소 데이터 살펴보기(1)에서 진행한 방식과 동일합니다)

```python
print('총 열 수: ', len(df.columns))
print('총 행 수: ', len(df))
print('중복 제거 후 총 행 수', len(df.drop_duplicates()))
```

```python
## null이 있는 컬럼 확인
df.isnull().sum()
```

```python
## 각 컬럼별 유니크 개수 확인
for i in df.columns:
    print(i, len(df[i].unique()))
```

## 도로유형별 도로명의 수량

도로명을 도로유형별로 분리하여 개수를 확인하고, 유형별 개수 비교를 하는 시각화를 진행하겠습니다.

### 고가대로

```python
df_gsdr = df[df["도로명"].str.endswith("고속도로")]
df_gsdr
```

### 대로

```python
df_dr = df[df["도로명"].str.endswith("대로")]
df_dr
```

### 로

```python
gsdril = list(df_gsdr.index) #고속도로에 해당하는 데이터의 인덱스를 리스트로
dril = list(df_dr.index) #대로에 해당하는 데이터의 인덱스를 리스트로
il = gsdril + dril #고속도로와 대로에 해당하는 데이터의 인덱스가 담긴 리스트

df_ro = df[df["도로명"].str.endswith("로")]
df_ro = df_ro.drop(il) #'로'로 끝나는 데이터 중 고속도로와 대로에 해당하는 데이터를 제외
df_ro
```

'로'는 '고가대로', '대로'에 모두 포함되므로, 두 유형에 포함되지 않는 행 중에서 '로'가 포함되는 행을 추출합니다.

### 길

```python
df_gil = df[df["도로명"].str.endswith("길")]
df_gil
```

### 기타

```python
filtered_rows = df[~df.isin(df_dr.to_dict(orient='list')).all(axis=1) &
                   ~df.isin(df_gsdr.to_dict(orient='list')).all(axis=1) &
                   ~df.isin(df_ro.to_dict(orient='list')).all(axis=1) &
                   ~df.isin(df_gil.to_dict(orient='list')).all(axis=1)]

filtered_rows
```

고가대로, 대로, 로, 길에 해당하지 않는 유형은 32개입니다. 기타 유형에는 '젊음의 거리', '먹자거리', '소양강자전거길좌안'. '공지천자전거길우안' 등이 있습니다.
