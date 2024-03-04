# 3. 도로명주소 데이터 살펴보기(2)

<br>

#### 작성자: 이정윤

<i>[3-2 도로명주소 데이터 살펴보기(1)](../chapter-3/chapter-3-2.md)과 연속되는 내용입니다.</i>

이번에는 인구데이터와 면적데이터를 추가로 활용하여 도로명주소 데이터를 살펴보고 지도시각화를 진행합니다. 전체 코드와 실행결과는 [코랩 코드](https://colab.research.google.com/drive/1ESR6gu4l9QlUx8uW8ngBUWd5MO9BUV5u?usp=sharing)에서 확인하세요.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/3-3-mapbox.png" title="sido geo data">
    <figcaption style="text-align: center;"></figcaption>
</figure>

시작하기 앞서, 이번장에서 진행하는 지도시각화 툴인 mapbox를 사용하기 위해선 token이 있어야 합니다. [mapbox.com](https://www.mapbox.com/)으로 들어가서 회원가입을 한 뒤, Account로 들어가면 위와 같은 화면을 볼 수 있습니다. mapbox는 일정 사용량까지는 무료이고, 한도를 넘으면 과금이 되므로 각자 billing을 확인하면서 사용하면 됩니다. python에서 mapbox를 사용할 때 입력해줘야 하는 token은 화면 하단의 'Default public token'에 나와 있습니다. 복사해서 아래 지도 시각화를 진행하는 부분에서 사용하면 됩니다.

## 인구데이터

인구데이터는 행정안전부에서 제공하는 [행정동별 주민등록 인구 및 세대현황](https://jumin.mois.go.kr/)의 전체시군구현황 데이터를 사용합니다. 데이터는 csv 혹은 xlsx 형식입니다. 데이터를 불러온 뒤 데이터의 형태, 수정이 필요한 부분 확인 등 간단한 전처리를 진행합니다.

```python
df_pop = pd.read_excel('202401_202401_주민등록인구및세대현황_월간.xlsx', header=2)

## 중복 데이터 확인하기
df_pop[df_pop['행정기관'].duplicated(keep=False)]
```

2024년 1월 기준으로 다운받은 데이터에 '세종특별자치시'는 행정기관코드가 다른 동일한 행이 중복으로 기재되어 있습니다. [행정표준코드관리시스템](https://www.code.go.kr/stdcode/regCodeL.do)에서 확인해보면 세종특별자치시의 행정동코드는 '3611000000'이므로 올바르지 않은 행은 삭제합니다.

```python
df_pop = df_pop[df_pop['행정기관코드']!=3600000000]
df_pop.reset_index(inplace=True, drop=True)
```

정리한 최종 인구데이터는 다음과 같습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/3-3-population-ex.png" title="population data">
    <figcaption style="text-align: center;"></figcaption>
</figure>

## 면적데이터

면적데이터는 주소기반산업지원서비스에서 제공하는 제공하는 주소 중 [구역의 도형](https://business.juso.go.kr/addrlink/elctrnMapProvd/geoDBDwldList.do?menu=%EA%B5%AC%EC%97%AD%EC%9D%98%20%EB%8F%84%ED%98%95) 2024년 1월 전체자료입니다. 제공하는 주소는 신청서를 작성한 뒤 데이터를 제공받을 수 있습니다. 사이트에서 신청하여 받거나, 구글 드라이브에 저장된 'geojson' 폴더를 다운받아 사용하세요.

```python
sido_file_list = glob.glob('geojson/*/*_CTPRVN.shp')

sido_geojson = pd.DataFrame()

for file in tqdm(sido_file_list):
    df_tmp = gpd.read_file(file, encoding="cp949")
    sido_geojson = pd.concat([sido_geojson, df_tmp])

sido_geojson.columns = ["code", "eng_nm", "kor_nm", "geometry"]
sido_geojson["code"] = sido_geojson["code"].apply(lambda x: str(x) + "00000000")
sido_geojson.reset_index(inplace=True, drop=True)

print(sido_geojson.shape)
sido_geojson.head()
```

제공되는 데이터는 shp 형식입니다. shp 파일을 geopandas를 통해 읽어오고, 데이터프레임으로 정의합니다. 이후 컬럼명을 부여하고 코드는 행정동코드와 같은 형식이 되도록 수정해줍니다. 데이터프레임으로 정리한 시도 면적데이터 예시는 다음과 같습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/3-3-sido-geo.png" title="sido geo data">
    <figcaption style="text-align: center;"></figcaption>
</figure>

시군구 데이터도 동일한 방법으로 진행합니다. 세종특별자치시의 경우 시군구가 없으므로 '세종특별자치시'하나의 행을 포함하고 있습니다.

## 인구당, 면적당 도로명주소 개수

인구 당 도로명주소의 개수를 시도별로 확인하기 위해서 시도별 도로명주소 개수, 인구수, 면적데이터를 하나의 데이터프레임으로 합쳐야 합니다. 세 데이터는 각각의 데이터프레임에 저장되어 있으므로 다음과 같은 순서로 진행하겠습니다. 시군구별 데이터와 이와 동일한 과정으로 진행합니다.

1.  도로명주소 개수와 인구수를 '행정구역명' 기준으로 합치기
2.  1에서 합친 df와 면적데이터를 '행정동코드' 기준으로 합치기
3.  경계 데이터를 활용해 '면적'을 계산하고 '인구당 도로명주소 개수', '면적당 도로명주소 개수' 계산하기

### (1) 데이터 프레임 합치기

```python
## 시도별 도로명주소 개수
sido = pd.DataFrame(df.groupby('시도명')["도로명관리번호"].count())
sido.reset_index(inplace=True)

## 시도별 인구수
df_pop['행정기관'] = df_pop['행정기관'].apply(lambda x:x.strip())
sido_pop = df_pop[df_pop['행정기관'].isin(list(sido['시도명']))].copy()

## 시도별 면적 (위에서 정의함)
# sido_geojson
```

합치기 위한 도로명주소 개수와 인구수 데이터프레임을 각각의 변수로 정의합니다.

```python
## 시도명, 행정기관 컬럼 -> 좌우 공백 없애기
sido['시도명'] = sido['시도명'].apply(lambda x:x.strip())
sido_pop['행정기관'] = sido_pop['행정기관'].apply(lambda x:x.strip())

## 행정기관코드, code -> string으로 바꾸기
sido_pop['행정기관코드'] = sido_pop['행정기관코드'].astype('str')
sido_geojson['code'] = sido_geojson['code'].astype('str')

## '도로명관리번호', '총인구수' -> int로 타입 바꾸기
sido['도로명관리번호'] = sido['도로명관리번호'].astype(int)
sido_pop['총인구수'] = sido_pop['총인구수'].str.replace(',', '').astype(int)
```

데이터프레임을 합칠 때 기준이 되는 컬럼들은 동일한 값을 인식할 수 있도록 좌우 공백을 없애고, 데이터 타입을 동일하게 수정합니다. 계산을 해줘야 하는 '도로명관리번호' (도로명주소 개수) 컬럼과 '총인구수' 컬럼은 int로 바꿔줍니다.

```python
## 시도별 도로명주소개수, 인구수, 면적데이터 합치기
sido_address_pop = pd.merge(sido, sido_pop, left_on='시도명', right_on='행정기관')
sido_total = sido_address_pop.merge(sido_geojson, left_on='행정기관코드', right_on='code', how='outer')

## 컬럼 정리하기
sido_total.drop(['행정기관', 'code', 'kor_nm'], axis=1,  inplace=True)
sido_total.rename(columns={'도로명관리번호':'도로명개수', 'eng_nm':'영문시도명', 'geometry':'면적'}, inplace=True)
sido_total = sido_total[['시도명', '영문시도명', '행정기관코드', '도로명개수', '총인구수', '세대수', '세대당 인구', '남자 인구수', '여자 인구수', '남여 비율', '면적']]
```

최종적으로 세 개의 데이터프레임을 합치고, 컬럼을 정리합니다.

### (2) 면적 데이터 구하고 인구당, 면적당 계산하기

```python
gdf_sido = gpd.GeoDataFrame(sido_total)

## 면적 계산
gdf_sido = gdf_sido.set_crs(epsg=5179, allow_override=True)
gdf_sido["면적"] = gdf_sido["geometry"].area
```

최종 데이터프레임을 geoDataFrame으로 변환합니다.

```python
## 인구대비, 면적대비 도로명주소 개수 계산
gdf_sido["인구 대비 도로명주소 개수"] = gdf_sido.apply(lambda row: row["도로명개수"] / row["총인구수"], axis=1)
gdf_sido["면적 대비 도로명주소 개수"] = gdf_sido.apply(lambda row: row["도로명개수"] / row["면적"], axis=1)

# 좌표계 변환
gdf_sido = gdf_sido.to_crs(epsg=4326)
```

## 지도 시각화

```python
token = "본인의 token"

gdf_sido = pd.read_csv('/content/drive/MyDrive/HIKE(연구실, 대학원)/2024/주소/address-data-guide/sido-viz.csv', encoding='utf-8')
gdf_sigungu = pd.read_csv('/content/drive/MyDrive/HIKE(연구실, 대학원)/2024/주소/address-data-guide/sigungu-viz.csv', encoding='utf-8')
geo_data_sido = '/content/drive/MyDrive/HIKE(연구실, 대학원)/2024/주소/address-data-guide/sido-geoj.geojson'
geo_data_sigungu = '/content/drive/MyDrive/HIKE(연구실, 대학원)/2024/주소/address-data-guide/sigungu-geoj.geojson'

with open(geo_data_sido, 'rt', encoding='utf-8') as f_sido:
    gj_sido = geojson.load(f_sido)

with open(geo_data_sigungu, 'rt', encoding='utf-8') as f_sigungu:
    gj_sigungu = geojson.load(f_sigungu)
```

처음에 받아 둔 mapbox의 token은 이 부분에서 사용합니다. 위에서 저장한 csv와 geojson 파일을 불러오는 작업을 진행합니다.

```python
viz = ChoroplethViz(data=gj_sido,
                    color_property='인구 대비 도로명주소 개수',
                    access_token=token,
                    color_stops=create_color_stops([0, 0.05, 0.1, 0.15, 0.2, 0.4], colors='BuPu'),
                    color_function_type='interpolate',
                    line_stroke='--',
                    line_color='rgb(128,0,38)',
                    line_width=1,
                    line_opacity=0.9,
                    opacity=0.8,
                    center = (128, 36),
                    zoom=6,
                    below_layer='waterway-label',
                    legend_layout='horizontal',
                    legend_key_shape='bar',
                    legend_key_borders_on=False)
viz.show()
```

저희는 지도 시각화 중 Choropleth 라는 면적에 지정한 값에 따라 다양한 색상과 스타일로 시각화하여 지도 위에 나타내며, 데이터의 패턴이나 특징을 빠르게 이해할 수 있도록 하는 시각화를 진행할 예정입니다. 위 코드에서 중요 파라미터를 하나씩 살펴보겠습니다.
위 코드는 Python 언어를 사용하여 지리적 데이터를 시각화하는 데에 사용되는 ChoroplethViz라는 객체를 생성하고, 이를 통해 지도 위에 색상으로 표현된 지리적 정보를 나타내는 코드입니다. 코드는 Mapbox의 ChoroplethViz를 사용하며, 아래는 코드의 각 부분에 대한 설명입니다.

- `data`: 시각화하고자 하는 지리적 데이터가 저장된 변수를 지정합니다.
- `color_property`: 시각화에서 사용할 색상의 기준이 되는 데이터 속성을 설정합니다.
- `access_token=token`: Mapbox에서 제공하는 API 토큰을 지정하여 지도를 불러올 때 인증에 사용합니다.
- `color_stops`: 시각화에 사용할 색상의 범위를 정의합니다. 'BuPu'는 파란색에서 보라색으로 그라데이션된 색상을 나타냅니다.
- `line_stroke='--', line_color='rgb(128,0,38)', line_width=1, line_opacity=0.9`: 지도의 경계를 나타내는 선의 스타일과 속성을 설정합니다.
- `opacity`: 전체 시각화의 투명도를 설정합니다.
- `center = (128, 36), zoom=5.5`: 지도의 초기 중심 위치와 확대 수준을 설정합니다. 대한민국의 중심 좌표를 지정해줬습니다.
- `below_layer='waterway-label'`: 시각화가 지도의 어떤 레이어 아래에 표시될지를 설정합니다. 여기서는 'waterway-label' 레이어 아래에 표시됩니다.
- `legend_layout='horizontal', legend_key_shape='bar', legend_key_borders_on=False`:
- 범례의 레이아웃 및 모양을 설정합니다.

<embed src="/docs/3-3-person-per-address.html" width="100%" height="450px"></embed>

인구 대비 도로명주소의 개수를 살펴보면 서울, 경기, 부산, 대구, 세종, 광주 등 특별시, 광역시, 특별자치시와 같이 비교적 인구가 많은 지역은 연한색으로 나타나서 인구 대비 도로명주소의 개수가 적은 것을 알 수 있습니다. 앞서 3-2에서 시도별 도로명주소 개수를 확인했을 때, 세종특별자치시, 울산, 대전은 도로명주소의 개수가 가장 적은 하위 3개 시도인 것을 감안헀을 때, 이들은 인구수는 많지만 도로명주소의 개수는 적어 인구 대비 도로명주소의 개수가 적다는 것을 확인할 수 있습니다.

```python
# 맵을 -15도 만큼 좌우 회전하고, 45도 만큼 상하 회전합니다.
viz.bearing = -15
viz.pitch = 45

# 각 데이터에 '인구 대비 도로명주소 개수'를 기준으로 height 값을 줍니다.
viz.height_property = '인구 대비 도로명주소 개수'

## 높이의 값
numeric_stops = create_numeric_stops([0, 0.05, 0.1, 0.15, 0.2, 0.4], 0, 10000)

viz.height_stops = numeric_stops
viz.height_function_type = 'interpolate'

html = open('person_per_address_3d.html', "w", encoding="UTF-8")
html.write(viz.create_html())
html.close()

viz.show()
```

<embed src="/docs/3-3-person-per-address-3d.html" width="100%" height="450px"></embed>
동일한 시각화에서 위와 같은 파라미터를 추가하면, 각 면적의 height를 지정하여 입체적인 지도 시각화를 진행할 수 있습니다.

<embed src="/docs/3-3-sigungu-area-per-address.html" width="100%" height="450px"></embed>
시군구별 데이터를 통해 면적 대비 도로명주소의 개수를 확인해보았습니다. 파란색으로 표시된 지역일수록 면적 대비 도로명주소의 개수가 많으며, 특히 서울, 부산, 대전, 광주 등 광역시 지역에서 해당 비율이 높은 것으로 나타났습니다.
