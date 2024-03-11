# 4. 도로명주소 유효성 평가 & 정제

<br>

**작성자: 안지은**

앞선 챕터에서는 도로명주소 데이터에서 흔히 나타나는 오류에 대해 알아봤습니다. 이번 장에서는 공공데이터에 존재하는 도로명주소 데이터의 유효성을 평가하고, 오류 데이터를 정제하는 방법들을 알아봅시다. 

## 평가 테이블 만들기

본격적인 평가에 앞서, 셀 별 값의 오류를 체크할 테이블을 만들어줍시다. 테이블의 명칭은 ``addr_error``로 하겠습니다.

구문오류 체크와 광역자치단체명 축약 여부, 그리고 API 검색 가능 여부를 확인하기 위한 컬럼과 함께,  추후 정제 과정을 위해 검색된 주소를 저장해놓는 컬럼을 생성해줍시다.

```python
datalength = len(df) # 전체 행의 길이
addr_error = pd.DataFrame(np.zeros((datalength, 4)),
    columns=["pattern","unvalid_city","exist","API_addr"])
addr_error["data"] = df['소재지도로명주소'] # 확인을 위한 원본 데이터
```


## 오류유형 패턴을 통한 유효성 평가

정규표현식을 활용하여 오류유형 패턴에 해당하는 주소들을 탐색하고, 정제해봅시다. 행정구역별로 오류 유형을 탐색하는 패턴 규칙을 나타내는 표 입니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/4-4-patterns.png" title="click console">
</figure>

위의 표에 있는 주소 구성요소 규칙에 따라 유효성을 점검하고 주소를 직접 수정해보도록 합시다.

### 1. 주소의 유효성 평가하기

아래는 표에 제시된 패턴 규칙을 구현한 정규표현식 코드입니다. 

```python
# 특별/광역시/특별자치도/도 + 구/자치시/행정시 + 도로명 + 건물번호
pattern1 = r"(?P<province>[가-힣]+)(?:특별시|광역시|특별자치도|도)\s+(?P<city>[가-힣]+)(시|구)\s+(?P<road>[가-힣\d]+)(?:로|길)\s+(?P<number>[\d])" 

# 광역시/도/특별자치도 + 자치구/군 + 읍/면 + 도로명 + 건물번호
pattern2 = r"(?P<province>[가-힣]+)(?:도|광역시|특별자치도)\s+(?P<city>[가-힣]+)(시|군|구)\s+(?P<local>[가-힣]+)(읍|면)\s+(?P<road>[가-힣\d]+)(?:로|길)\s+(?P<number>[\d])" 

# 특별자치시 + 읍/면 + 도로명 + 건물번호
pattern3 = r"(?P<province>[가-힣]+)(?:특별자치시)\s+(?P<type>[가-힣]+)(?:읍|면)\s+(?P<road>[가-힣\d]+)(?:로|길)\s+(?P<number>[\d])"

# 특별자치시 + 도로명 + 건물번호
pattern4 = r"(?P<province>[가-힣]+)(?:특별자치시)\s+(?P<road>[가-힣\d]+)(?:로|길)\s+(?P<number>[\d])"

# 특별자치도/도 + 자치/행정시 + 일반구 + 도로명 + 건물번호
pattern5 = r"(?P<province>[가-힣]+)(?:도|특별자치도)\s+(?P<city>[가-힣]+)(?:시)\s+(?P<type>[가-힣]+)(?:구)\s+(?P<road>[가-힣\d]+)(?:로|길)\s+(?P<number>[\d])" 

# 특별자치도/도 + 자치/행정시 + 일반구 + 읍/면 + 도로명 + 건물번호
pattern6 = r"(?P<province>[가-힣]+)(?:도|특별자치도)\s+(?P<city>[가-힣]+)(?:시)\s+(?P<type>[가-힣]+)(?:구)\s+(?P<local>[가-힣]+)(?:읍|면)\s+(?P<road>[가-힣\d]+)(?:로|길)\s+(?P<number>[\d])" 
```

위의 패턴들을 적용해 구문오류를 탐색한 후에는, 특별시/광역시/특별자치도/특별자치시와 같은 광역자치단체명의 누락을 찾아냅니다. 이 과정들을 모두 반영하여 주소의 구문 오류를 탐색하는 함수를 작성하면 아래의 코드와 같습니다.

```python
def element_check(i):
    item = df['소재지도로명주소'][i]
    if item != None:
        # 패턴을 통한 구문 오류 체크
        if re.match(pattern1, item) or re.match(pattern2, item) or re.match(pattern3, item) or re.match(pattern4, item) or re.match(pattern5, item) or re.match(pattern6, item):
            addr_error["pattern"][i] = 0
            
        else:
            addr_error["pattern"][i] = 1
            
        # 축약된 광역자치단체명 체크    
        sido = df['소재지도로명주소'][i].split(" ")[0]
        print(sido)
        if sido in sido_map.keys():
            addr_error["unvalid_city"][i] = 1
        else:
            addr_error["unvalid_city"][i] = 0
    # 공백값
    else:
        addr_error["pattern"][i] = None
        addr_error["unvalid_city"][i] = None
            
df.index.map(lambda i: element_check(i))

```

오류 주소의 비율은 어느정도 되는지, 또 오류가 발생한 행은 주로 어디에 있는지 시각화해서 알아봅시다. 시각화에서는 plotly 라이브러리를 활용하도록 하겠습니다.

```python
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def make_error_rate_plot(addr_error):
    # colors
    # 정상 : darkblue, 오류 : darkred, 공백 : lightgrey
    COLORS = ["darkblue", "darkred", "lightgrey"]
    
    # 오류 비중 계산
    
    errors = addr_error["pattern"].value_counts()[1]
    normal = addr_error["pattern"].value_counts()[0]
    blank = len(df) - errors - normal 

    # 서브플롯 객체 생성
    # 히트맵을 위해 2개 컬럼에 걸쳐 히트맵 plot 배정
    fig = make_subplots(rows=1, cols=3, 
                        specs=[[{'type':'pie'}, {"colspan": 2}, None]],
                        subplot_titles=("오류 데이터 비율","오류 행 현황"))

    # 파이차트 추가
    fig.add_trace(go.Pie(labels=['정상','오류','공백'], textinfo='label+percent', 
                        values=[normal, errors, blank],marker=dict(colors=COLORS), showlegend=False,), 
                row=1, col=1)
    # 히트맵차트 추가
    fig.add_trace(go.Heatmap(z=[addr_error['pattern']], x = list(addr_error.index), y= ["error row # "],
                            colorscale = [[0, "darkblue"],[1, "darkred"]]), row=1, col=2)
    
    fig.show()
    return fig
```

<embed src="/docs/4-4-addr-error.html" width="100%" height="420px"></embed>

대략 5%의 주소에 구문 오류가 있음을 확인할 수 있습니다.

### 2. 유효하지 않은 주소 정제하기


이제 오류 행만 뽑아서 정제해봅시다. 

구문 오류에 따라 정규표현식을 적용하여 수정하는데요. 단계적으로 오류 사항을 하나씩 수정해나가는 과정을 거칩니다. 오류 수정 과정은 다음과 같습니다. 


> 각 과정에 해당하는 정규표현식과 전체 코드가 매우 길고 복잡한 관계로, 코드는 파이썬 노트북 파일에서만 설명하고 넘어가겠습니다.


정제가 완료된 후, 앞선 구문 유효성 체크 함수를 다시 실행시켜보면 아래와 같은 그래프를 얻을 수 있습니다.

<embed src="/docs/4-4-addr-after-refine.html" width="100%" height="420px"></embed>

## API를 통한 유효성 평가 & 정제

API를 통한 주소의 실존 여부에 대한 확인 과정에서는, 추후 행정동별 인구 데이터와의 통합을 위해, 검색된 주소의 행정동 요소도 따로 저장합니다,

### 1. 실존하지 않는 주소 탐색하기

멸실 건축물이거나 존재하지 않는 주소를 탐색합니다.

### 2. 첨부사항 추가하기

인구데이터는 읍/면/행정동 단위도 구성되어 있습니다. 행정동이 첨부사항으로 기재되어 있지 않은 데이터들을 보완해줍시다.

결과를 확인해보면 다음과 같습니다.
<embed src="/docs/4-4-addr-exist.html" width="100%" height="420px"></embed>

### 3. 존재하지 않는 주소는 좌표계 데이터로 정제하기

샘플 데이터에는 좌표계 데이터가 존재합니다. 존재하지 않는 도로명주소들에 대해서는 좌표계 데이터를 통한 주소 검색으로 나온 결과값으로 수정합니다.

먼저 정제할 행들을 추출해 `idx`라는 리스트에 넣어줍니다.
```python
idx = addr_error[addr_error["exist"]==1].index.tolist()
```
`search_coords`는 좌표계를 통해 도로명주소를 검색하는 함수입니다. 앞서 도로명주소를 검색하는 함수와 유사하나, 요청 URL과 요청값이 다릅니다.
```python
# 경도, 위도 순으로 입력
def search_coords(x,y):
    coord = f"{x},{y}"
    # 요청 헤더에는 API 키와 아이디 값을 입력합니다.
    headers = {"X-NCP-APIGW-API-KEY-ID":API_ID, "X-NCP-APIGW-API-KEY":API_SECRET} 

    # 파라미터에는 변환할 좌표계를 입력합니다. "경도,위도" 순으로 입력해주세요.
    params = {"coords" : coord, "output":"json", "orders":"roadaddr,addr"}

    # 정보를 요청할 url입니다
    url ="https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc"

    data = requests.get(url, headers=headers, params=params)
    
    return json.loads(data.text)
```

`road_addr_maker`는 API에서 리턴된 주소 구성 요소들을 합성해 도로명주소로 만들어주는 함수입니다. 주소 구문 유형에 따라 다르게 구성요소를 합성합니다.
```python
# 도로명주소를 합성하는 함수
def road_addr_maker(road_obj):
    road = road_obj["region"]["area1"]["name"] + " " + road_obj["region"]["area2"]["name"]
    if road_obj["region"]["area3"]["name"][-1] == "읍" or road_obj["region"]["area3"]["name"][-1] == "면":
        road += " " + road_obj["region"]["area3"]["name"]
    if road_obj["land"]["name"] != "":
        road += " " + road_obj["land"]["name"]
    if road_obj["land"]["number1"] != "":
        road += " " + road_obj["land"]["number1"]
    if  road_obj["land"]["number2"] != "":
        road += "-" + road_obj["land"]["number2"]
    return road
```

이제 앞서 만든 함수들을 활용해서 도로명주소를 정제해봅시다. `non_exist_coord`에는 검색 결과가 존재하지 않는 좌표계의 행 번호를 저장합니다.
```python
# 좌표계 데이터 역시 잘못된 경우 저장
non_exist_coord = []

for i in tqdm(idx):
        # 좌표계 검색
        re_val = search_coords(df.loc[i, "경도"],df.loc[i, "위도"])
      
        # 검색한 좌표계가 존재하는지 확인
        if (re_val["status"]["name"] != "ok") or (len(re_val["results"]) == 0):
            non_exist_coord.append(i)
            
        # 검색한 좌표계가 존재하는 경우   
        else:
            # 도로명주소가 모두 존재하는 지점인 경우
            if len(re_val["results"]) == 2:
                road_obj = re_val["results"][0]

                # 주소 합성
                road = road_addr_maker(road_obj)
                df['소재지도로명주소'][i] = road

```
`non_exist_coord`에 아무런 행도 저장되지 않았으므로, 존재하지 않는 주소도 이제 없습니다. 이로써 모든 도로명주소가 유효한 값을 갖게 되었습니다. 

## 데이터 합치기

이제, 도로명주소 컬럼의 데이터를 활용해 인구 데이터와 합치기 위한 키 컬럼을 만들어줍시다. 