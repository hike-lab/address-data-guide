# 4. 도로명주소 유효성 평가 & 정제

<br>


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

오류 주소의 비율은 어느정도 되는지, 또 오류가 발생한 행은 주로 어디에 있는지 시각화해서 알아봅시다. 시각화에서는 plotly 라이브러리를 활용하도록 하겠습니다. 시각화 코드는 밑에 코드에서 여러번 재활용 됩니다.


- `make_error_rate_plot` : 주소 데이터의 오류 비율과 오류 발생 부분을 히트맵으로 시각화 하는 함수입니다.
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

위의 함수를 사용하여 구문 오류가 있는 주소 데이터의 비중을 나타내면 다음과 같습니다.

<embed src="/docs/4-4-addr-error.html" width="100%" height="420px"></embed>

대략 5%의 주소에 구문 오류가 있음을 확인할 수 있습니다.

### 2. 유효하지 않은 주소 정제하기


이제 오류 행만 뽑은 데이터프레임 ``errs``를 생성합니다.  
```python
errs = addr_error[(addr_error["pattern"] == 1) | ( addr_error["unvalid_city"] == 1)]
```

구문 오류에 따라 정규표현식을 적용하여 수정하는데요. 단계적으로 오류 사항을 하나씩 수정해나가는 과정을 거칩니다. 


<details>
    <summary>주소의 구문 오류를 정제하는 코드</summary>

- `not_comp_all`, `not_comp` : 도로명주소 내부에 건물명이 기입된 경우를 점검하여 삭제하는 함수
    ```python
    def not_comp(word):
        if word.isalpha()==True and word[-1] not in ["도","시","군","구","로","대로","길","층","동","호",'읍','면'] and "지하" not in word and "(" not in word  and ")" not in word  and "-" not in word and "," not in word:
            return "error"
        else:
            return word

    square_lambda = lambda x: not_comp(x)

    def not_comp_all(addr):
        addr_list = addr.split(" ")
        addr_li = list(map(square_lambda, addr_list))
        new_add = " ".join(addr_li)
        new_add = new_add.replace("error", "").replace("  ", " ")
        return new_add

    ```

- `get_replace` : `re.search` 를 통해 리턴된 구문 오류 부분을 제거하는 함수

    ```python
    def get_replace(pt, addr):
        idx_s = pt.span()[0]
        idx_e = pt.span()[1]
        replacement = addr[idx_s:idx_e]
        return replacement
    ```
다음은 구문 오류별 패턴들에 대한 정규표현식입니다.

- 1. 도로명과 건물번호가 붙어있는 경우 
    > e.g. 서울특별시 동작구 흑석로84
   ```python
    error_pat1 = r"(?P<road>[가-힣\d]+로)(?P<number>\d+(?:-\d+)?)"
    error_pat2 = r"(?P<road>[가-힣\d]+로)(?P<number>\d+(?:-\d+)?)"
    error_pat3 = r"(?P<road>[가-힣\d]+로)(?P<subroad>[가-힣\d]+번길)(?P<number>\d+(?:-\d+)?)"
    error_pat3_ = r"(?P<road>[가-힣\d]+로)(?P<subroad>[가-힣\d]+길)(?P<number>\d+(?:-\d+)?)"
    error_pat4 = r"(?P<road>[가-힣\d]+\d?길)(?P<number>\d+(?:-\d+)?)"
   ``` 

- 2. 지하번호가 띄어쓰인 경우
    > e.g. 경기도 성남시 오리로 지하 33
    ```python
        # 지하번호 기입 오류
        error_pat5 = r"(?P<ground>지하)+\s(?P<number>\d+(?:-\d+)?)"
    ```

 - 3. 참고항목과 건물번호를 붙여 쓴 경우
    > e.g. 서울특별시 동작구 흑석로 84(행복아파트)
    ```python
    # 참고항목과 건물번호를 붙여 씀
    error_pat6 = r"(?P<number>\d+(?:-\d+)?)\((?P<dong>.+?)\)"
    ```
 - 4. 도로명이 분리되어 있는 경우
    > e.g. 경상북도 통영시 북문 2로 34
    ```python
    error_pat7 = r"(?P<road>[가-힣\d]+로)+\s(?P<subroad>[가-힣\d]+번길)+\s(?P<number>\d+(?:-\d+)?)"
    error_pat8 = r"(?P<road>[가-힣\d]+로)+\s(?P<subroad>[가-힣\d]+길)+\s(?P<number>\d+(?:-\d+)?)"
    error_pat9 = r"(?P<road>[가-힣\d]+[^시군구도읍면동])+\s(?P<subroad>[가-힣\d]+[번길|길|로])+\s(?P<number>\d+(?:-\d+)?(?:\d+)?)"
    ```
- 5. 동, 층, 호가 도로명주소와 쉼표로 구분 없이 기재된 경우
    > e.g. 서울특별시 동작구 흑석로 84 3층

    ```python
    error_pat10 = r"(?P<det>(?:\d+층|[가-힣a-zA-Z\d]동+(?:\s)\d층+(?:\s)\d호|[가-힣a-zA-Z\d]동+(?:\s)\d호|\d호|\d층+(?:\s)\d호))"
    error_pat11 =  r"\((?P<dong>.+?)\)+(?:,|,\s|\s|\s,|\s,\s)(?P<det>(?:\d+층|[가-힣a-zA-Z\d]동+(?:\s)\d층+(?:\s)\d호|[가-힣a-zA-Z\d]동+(?:\s)\d호|\d호|\d층+(?:\s)\d호))"
    ```
- 6. 참고항목의 동 명칭 끝에 지번까지 표기된 경우
    > e.g. 서울특별시 동작구 흑석로 84 (흑석동12)

    ```python
    error_pat12 =r"\((?P<dong>.+)동(?P<number>\s?\d+)(?:-\d+)?\)"
    ```

- ``add_refine`` : 앞서 언급한 패턴들 및 기타 구문 오류들을 점검하여 정제하는 함수. 
    > 전체 코드는 파이썬 노트북에서 확인하실 수 있습니다. 

    ```python
    def add_refine(addr):
        # 기본 구문 오류 : 동일한 요소가 중복되어 작성된 경우
        addr = re.sub(r"(?P<word>\w+)\s(?P=word)\s", r"\1 ", addr, count=1)
        sido =addr.split(" ")[0]
        
        # 광역자치단체 단위 생략한 경우 정제
        if sido in sido_map.keys():
            addr = addr.replace(sido, sido_map[sido])
        else:
            pass
        
        # 도로명-건물번호가 붙어있는 경우
        p1 = re.search(error_pat1, addr)
        if p1 != None:
            repl = get_replace(p1, addr)
            newadd= p1["road"] + " " + p1["number"]
            addr = addr.replace(repl, newadd)

        # p2~4까지 거의 동일한 방식으로 진행됩니다.
            
        # 지하번호 기입 오류
        p5 = re.search(error_pat5, addr)
        if p5 != None:
            repl = get_replace(p5, addr)
            newadd= "지하" + p5["number"]
            addr = addr.replace(repl, newadd)
            
        # 참고항목과 건물번호를 붙여 씀
        p6 = re.search(error_pat6, addr)
        if p6 != None:
            repl = get_replace(p6, addr) 
            newadd= p6["number"] + " "+"(" + p6["dong"] + ")"
            addr = addr.replace(repl, newadd)
        
        # 도로명이 분리되어 있는 경우  
        p7 = re.search(error_pat7, addr)
        if p7 != None:
            repl = p7["road"] + " " +p7["subroad"] + " " + p7["number"]
            newadd= p7["road"] + p7["subroad"] + " " + p7["number"]
            addr = addr.replace(repl, newadd)
            
        #p8~9까지 거의 동일한 방식으로 진행됩니다.
        
        # 어느정도 도로명 요소들이 정제된 시점에서
        # 주소 요소에 병기된 건물명을 삭제합니다  
        addr = not_comp_all(addr)
        
        # 마지막으로 참고항목들에 대한 정제를 진행합니다.
        # 참고항목이 상세주소보다 앞에 나오는 경우 - 1
        p10 = re.search(error_pat10, addr)
        if p10 != None:
            remove_pos_start = p10.span()[0]
            remove_pos_end = p10.span()[1]
            remove_string = addr[remove_pos_start:remove_pos_end]
            addr = addr.replace(remove_string, "")
            addr = addr +  ", " + p10["det"]
            
        # 참고항목이 상세주소보다 앞에 나오는 경우 - 2
        p11 = re.search(error_pat11, addr)
        if p11 != None:
            remove_pos_start = p11.span()[0]
            remove_pos_end = p11.span()[1]
            remove_string = addr[remove_pos_start:remove_pos_end]
            addr = addr.replace(remove_string, "")
            addr = addr +  ", " + p11["det"] + " " + "(%s)"%p11["dong"]
        
        # 동 끝에 지번까지 표기된 경우
        p12 = re.search(error_pat12, addr)
        if p12 != None:
            repl = get_replace(p12, addr)
            new_detail = "(%s동)"%p12["dong"]
            addr = addr.replace(repl, new_detail)


        return addr
    ```
</details>

앞서 설명한 `add_refine` 함수를 `errs` 데이터 프레임에 적용해 주소를 정제하고, 이를 `newadds`에 저장합니다.

```python
# 정규표현식 패턴에 따라 주소를 정제하는 Lambda 함수를 적용합니다. 
newadds = errs['data'].apply(lambda x: add_refine(x))
```

그리고 원본데이터의 오류 데이터를 `newadds`의 값으로 바꿔줍니다.
```python
df['소재지도로명주소'][errs.index] = newadds
```
정제가 완료된 후, 앞선 구문 유효성 체크 함수를 다시 실행시킨 후 다시 시각화 해봅시다.


```python
df.index.map(lambda i: element_check(i))
add_error_fig = make_error_rate_plot(addr_error, "pattern")
```
<embed src="/docs/4-4-addr-after-refine.html" width="100%" height="420px"></embed>

대부분의 구문 오류들이 수정된 것을 확인할 수 있습니다.

## API를 통한 유효성 평가 & 정제

API를 통한 주소의 실존 여부에 대한 확인 과정에서는, 추후 행정동별 인구 데이터와의 통합을 위해, 검색된 주소의 행정동 요소도 따로 저장합니다,

### 1. 실존하지 않는 주소 탐색하기

갱신, 폐지되었거나 오기입이 있는 주소를 API를 통해 파악해봅시다. 이 과정에서는 주소를 검색할 수 있는 API 검색 함수 `search_addr`를 생성해 활용합니다.

```python
# 주소 검색 함수
def search_addr(addr):
    # 요청 헤더에는 API 키와 아이디 값을 입력합니다.
    headers = {"X-NCP-APIGW-API-KEY-ID":API_ID, "X-NCP-APIGW-API-KEY":API_SECRET} 

    # 파라미터에는 검색할 주소를 입력합니다. 
    params = {"query" : addr, "output":"json"}

    # 정보를 요청할 url입니다
    url ="https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode" 

    data = requests.get(url, headers=headers, params=params)
    
    return json.loads(data.text)
```

`search_addr`함수를 이용해 도로명주소의 실존 여부를 확인하는 코드는 아래와 같습니다. 응답값의 검색 결과 개수를 기준으로 존재 여부를 체크합니다.



주소가 존재할 경우, 추후 인구데이터와의 병합키를 만들기 위해 동명칭을 검색 결과에서 추출해 `addr_error`테이블의 `API_addr`에 추가합니다.

```python
for i in tqdm(range(len(df))):
    if df['소재지도로명주소'][i] != None:
        re_val = search_addr(df.loc[i, "소재지도로명주소"])
        
        # 검색한 주소가 존재하는지 확인
        if (re_val["status"] != "OK") or (re_val["meta"]["totalCount"] == 0):
            addr_error['exist'][i] = 1
            addr_error['API_addr'][i] = None
            
        else:
            if re_val["status"] == "OK":
                addr_error['exist'][i] = 0
                
                # 동명칭을 추가합니다.
                dong = re_val['addresses'][0]["addressElements"][2]["longName"]
                addr_error['API_addr'][i] = dong
    else:
        addr_error['exist'][i] = None
        addr_error['API_addr'][i] = None
```

결과를 `make_error_rate_plot`함수로 시각화하면 다음과 같습니다.
<embed src="/docs/4-4-addr-exist.html" width="100%" height="420px"></embed>


### 2. 존재하지 않는 주소는 좌표계 데이터로 정제하기

샘플 데이터에는 좌표계 데이터가 존재합니다. 존재하지 않는 도로명주소들에 대해서는 좌표계 데이터를 통한 주소 검색으로 나온 결과값으로 수정합니다.

먼저 정제할 행들을 추출해 `idx`라는 리스트에 넣어줍니다. 이번에는, 도로명주소 컬럼의 결측 행도 포함시켜줍니다.

```python
idx = addr_error[addr_error["exist"]==1].index.tolist()
idx += addr_error[addr_error["exist"].isnull()].index.tolist()
```

`search_coords`는 좌표계를 통해 도로명주소를 검색하는 함수입니다. 앞서 도로명주소를 검색하는 함수와 유사하나, 요청 URL과 요청값이 다릅니다.

```python
# 주소 검색 함수
def search_addr(addr):
    # 요청 헤더에는 API 키와 아이디 값을 입력합니다.
    headers = {"X-NCP-APIGW-API-KEY-ID":API_ID, "X-NCP-APIGW-API-KEY":API_SECRET} 

    # 파라미터에는 검색할 주소를 입력합니다. 
    params = {"query" : addr, "output":"json"}

    # 정보를 요청할 url입니다
    url ="https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode" 

    data = requests.get(url, headers=headers, params=params)
    
    return json.loads(data.text)
```

`search_addr`함수를 이용해 도로명주소의 실존 여부를 확인하는 코드는 아래와 같습니다. 응답값의 검색 결과 개수를 기준으로 존재 여부를 체크합니다.



주소가 존재할 경우, 추후 인구데이터와의 병합키를 만들기 위해 동명칭을 검색 결과에서 추출해 `addr_error`테이블의 `API_addr`에 추가합니다.

```python
for i in tqdm(range(len(df))):
    if df['소재지도로명주소'][i] != None:
        re_val = search_addr(df.loc[i, "소재지도로명주소"])
        
        # 검색한 주소가 존재하는지 확인
        if (re_val["status"] != "OK") or (re_val["meta"]["totalCount"] == 0):
            addr_error['exist'][i] = 1
            addr_error['API_addr'][i] = None
            
        else:
            if re_val["status"] == "OK":
                addr_error['exist'][i] = 0
                
                # 동명칭을 추가합니다.
                dong = re_val['addresses'][0]["addressElements"][2]["longName"]
                addr_error['API_addr'][i] = dong
    else:
        addr_error['exist'][i] = None
        addr_error['API_addr'][i] = None
```

결과를 `make_error_rate_plot`함수로 시각화하면 다음과 같습니다.
<embed src="/docs/4-4-addr-exist.html" width="100%" height="420px"></embed>


### 2. 존재하지 않는 주소는 좌표계 데이터로 정제하기

샘플 데이터에는 좌표계 데이터가 존재합니다. 존재하지 않는 도로명주소들에 대해서는 좌표계 데이터를 통한 주소 검색으로 나온 결과값으로 수정합니다.

먼저 정제할 행들을 추출해 `idx`라는 리스트에 넣어줍니다. 이번에는, 도로명주소 컬럼의 결측 행도 포함시켜줍니다.

```python

idx = addr_error[addr_error["exist"]==1].index.tolist()
idx += addr_error[addr_error["exist"].isnull()].index.tolist()
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

# 지번주소 합성 함수 (본 챕터에서 사용 X)
def addr_maker(addr_obj):
    addr = addr_obj["region"]["area1"]["name"] + " " + addr_obj["region"]["area2"]["name"] + " " + addr_obj["region"]["area3"]["name"]
    if addr_obj["region"]["area4"]["name"] != "":
        addr += " " + addr_obj["region"]["area4"]["name"]
    if addr_obj["land"]["type"] == "1":
        addr += " " + addr_obj["land"]["number1"]
    if addr_obj["land"]["type"] == "2":
        addr += " " + addr_obj["land"]["number1"]+"-"+addr_obj["land"]["number2"]
    return addr

```

다음은 코드에서 사용되는 함수들입니다.

- `search_coords` : 좌표계를 통해 도로명주소를 검색하는 함수입니다. 앞서 도로명주소를 검색하는 함수와 유사하나, 요청 URL과 요청값이 다릅니다.

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

- `road_addr_maker` , `addr_maker`:  API에서 리턴된 주소 구성 요소들을 합성해 도로명주소로 만들어주는 함수입니다. 주소 구문 유형에 따라 다르게 구성요소를 합성합니다.
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

    # 지번주소 합성 함수 (본 챕터에서 사용 X)
    def addr_maker(addr_obj):
        addr = addr_obj["region"]["area1"]["name"] + " " + addr_obj["region"]["area2"]["name"] + " " + addr_obj["region"]["area3"]["name"]
        if addr_obj["region"]["area4"]["name"] != "":
            addr += " " + addr_obj["region"]["area4"]["name"]
        if addr_obj["land"]["type"] == "1":
            addr += " " + addr_obj["land"]["number1"]
        if addr_obj["land"]["type"] == "2":
            addr += " " + addr_obj["land"]["number1"]+"-"+addr_obj["land"]["number2"]
        return addr

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
`non_exist_coord`에는 668행만 존재합니다. 668번행의 데이터의 경우, 주소 검색 과정에서 실존하는 주소임을 확인했으므로, 모든 도로명주소가 유효한 값을 갖게 되었다는 것을 확인할 수 있습니다. 

## 데이터 합치기

> 샘플 데이터와 병합할 인구데이터 원본은 행정동/읍/면 단위로 집계되어 있으며, 출장소나 광역지방자치단체, 기초지방자치단체 단위의 합산값도 포함되어 있습니다. 이번 프로젝트에서는 행정동이 아닌 법정동을 기준으로 집계하며, 출장소나 시/군/구 단위 집계치는 제외된 상태의 정제된 데이터를 활용하도록 하겠습니다. 
> 
> 실습에서 활용된 인구데이터를 정제한 코드와 원본 파일 모두 [깃허브]() 폴더에 있습니다.

이제, 도로명주소 컬럼의 데이터를 활용해 인구 데이터와 합치기 위한 키 컬럼을 만들어줍시다. 

인구데이터 파일과 법정동별로 병합이 필요한 지역에 대한 json table은 [드라이브]()에 있습니다. 다운받아주시길 바랍니다.

앞선 과정에서 API로 주소데이터를 점검함과 동시에 법정동에 대한 정보도 함께 저장했었는데요, 이번에는 인구데이터의 법정동과 도로명주소의 법정동을 key 값으로 두 데이터를 합쳐보도록 합시다.

```python
census = pd.read_excel("census_data_cleaned.xlsx") # 인구 데이터
merge_table = json.load(open("dong_merge_table.json", "r")) # 동 명칭 병합이 필요한 테이블
merge_table = merge_table["data"]
change_list = list(merge_table.keys()) # 법정동끼리 병합이 필요한 지역

# 복수의 법정동이 합산되어 집계된 지역
def mergeing_dong(i):
    if df['소재지도로명주소'][i] != None:
        addr_splits = df['소재지도로명주소'][i].split(" ")
    
        city = addr_splits[0] + " " + addr_splits[1]
        if addr_error["API_addr"][i] in change_list and city == merge_table[addr_error["API_addr"][i]]["city"]:
            addr_error["API_addr"][i] = merge_table[addr_error["API_addr"][i]]["changeto"]

addr_error.index.map(lambda i: mergeing_dong(i))

```

이제 법정동을 기준으로 두 데이터를 합쳐봅시다. 합치기 전에, 행정기관명을 조합하여 키 컬럼을 만듭니다.

```python
census["key"] = census['행정기관']
df["동명칭"] = addr_error["API_addr"]
def key_make(i):
    if df['소재지도로명주소'][i] != None:
        key_match = re.search(r"[가-힣]+(?P<city>특별시|광역시|특별자치도|도|특별자치시)+(\s[가-힣]+(?P<city2>(?:시|군|구)))?+(\s[가-힣]+(?P<local>구))?", df['소재지도로명주소'][i])
        if key_match != None and type(df['동명칭'][i]) == str:
            return df['소재지도로명주소'][i][key_match.span()[0]: key_match.span()[1]] + " " + df["동명칭"][i]
        else:
            return None
    else:
        if df['소재지지번주소'][i] != None:
            key_match = re.search(r"[가-힣]+(?P<city>특별시|광역시|특별자치도|도|특별자치시)+(\s[가-힣]+(?P<city2>(?:시|군|구)))?+(\s[가-힣]+(?P<local>구))?", df['소재지지번주소'][i])
            if key_match != None and type(df['동명칭'][i]) == str:
                return df['소재지지번주소'][i][key_match.span()[0]: key_match.span()[1]]+ " " + df["동명칭"][i]
            else:
                return None
df["key"] = df.index.map(lambda i: key_make(i))
```

이제 생성된 키 컬럼을 기준으로 두 데이터를 합쳐봅시다.

```python
merged = pd.merge(left = df, right = census, on="key", how="left")
```


합쳐진 데이터를 `merged_clean.xlsx`로 저장해줍니다. 다음 챕터에서는 이렇게 합친 데이터의 품질을 평가하는 방법에 대해 알아보도록 하겠습니다.


```python
# 사용하지 않을 컬럼은 제외합니다
merged.drop(["동명칭", "key"], axis = 1, inplace = True)
merged.to_excel("merged_clean.xlsx", index=False)
```