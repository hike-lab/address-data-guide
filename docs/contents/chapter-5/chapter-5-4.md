# ４. Flask로 주소 검색 API 만들기

<br>

#### 작성자: 최은혜, 박예준

이번 장에서는 파이썬 웹 프레임워크인 Flask를 활용하여 API를 만드는 방법을 안내합니다. 주소기반산업지원서비스의 주소 검색 API에 내고장알리미 데이터를 연계하여, 주소를 검색하면 그 주소에 대한 행정구역 데이터를 제공하는 우리만의 주소 검색 API를 만드는 실습을 진행합니다.

## Flask 개발 환경 세팅하기

Flask는 파이썬 웹 프레임워크입니다. 웹 프레임워크라고 하는 것은 웹사이트, 웹 애플리케이션을 더 쉽게 개발할 수 있도록 미리 만들어 놓은 일종의 틀(Frame)이라고 설명할 수 있습니다. Flask는 그 중에서도 가볍고 코드가 단순하기 때문에 간단한 웹사이트 등을 개발하는 데 특화된 프레임워크입니다. Flask에 대한 더 자세한 정보는 [Flask 공식 문서](https://flask.palletsprojects.com/en/3.0.x/)에서 확인할 수 있습니다.

### 1. 가상환경 사용하기

Flask로 서버를 개발하는 과정에서 보통 서버 구현에 필요한 다양한 패키지들을 추가로 설치하게 됩니다. 다양한 라이브러리나 패키지 등을 설치하다보면 원래 사용하던 노트북 환경의 상태가 변화하여 다른 작업을 할 때 문제가 발생할 수 있기 때문에 가상환경을 생성하여 그곳에서 작업을 진행하는 것이 일반적입니다. 

#### 가상환경 생성하기
먼저 프로젝트를 진행할 폴더를 만들어서 Visual Studio Code에서 폴더를 열어줍니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-vscnewfolder.png" >
</figure>

<br>

`Ctrl + ~`를 눌러서 Visual Studio Code의 터미널을 열어줍니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-terminal.png" >
</figure>

<br>

터미널에 다음과 같이 입력하고 `enter`를 눌러 명령어를 실행합니다. 가상환경을 생성하는 코드입니다.

```
python -m venv env
```
이 명령어에서 `python -m venv`는 파이썬의 venv라는 가상환경 모듈을 사용하겠다는 의미입니다. env는 우리가 생성할 가상환경의 이름을 입력한 것으로, 꼭 env로 이름을 지을 필요는 없습니다. 

<br>
잠시 후 우리의 프로젝트 폴더에 다음과 같이 env라는 폴더가 생긴 것을 확인할 수 있습니다.
<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-venv.png" >
</figure>

가상환경은 서버 환경 개발 작업을 최초로 진행할 때 한 번만 생성하면 됩니다. 이후에 이어서 작업할 때는 이미 만들어 놓은 가상환경에 진입만 하면됩니다.

<br>

#### 가상환경 진입하기

터미널에 다시 다음과 같이 명령어를 입력하고 `enter`를 누릅니다. 가상환경을 활성화하는 코드입니다.
```
env\Scripts\activate
```
<br>

터미널의 프로젝트 경로 앞에 `(env)`가 생긴 것을 확인할 수 있습니다. 가상환경에 진입했다는 표시입니다. Flask 서버 개발 작업을 할 때는 이렇게 가상환경에 진입하여 작업을 진행하면 됩니다. 
<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-venvactivate.png" >
</figure>

가상환경에서 나오려면 터미널에 `deactivate`를 입력해주면됩니다.


### 2. Flask 설치하기

이제 Flask를 설치해보도록 하겠습니다. 가상환경에 진입했는지 확인하고 터미널에 다음 명령어를 실행하여 Flask를 설치해줍니다. 

```
pip install flask
```

## Flask로 API 서버 개발하기

### 1. Flask 애플리케이션 생성하기

먼저 프로젝트 폴더에 서버를 실행하는 파일을 만들어줍니다. 파일 이름은 main.py로 하겠습니다.

Flask를 import 하고 Flask 객체 인스턴스를 생성해줍니다.

```
#main.py

from flask import Flask

#객체 인스턴스 생성
app = Flask(__name__)

```
<br>

`@app.route('/')`코드를 추가하여 Flask 서버의 기본 접속 url을 설정하고 로컬 환경에서 서버를 실행하는 코드를 작성합니다.
```
#기본 접속 url
@app.route('/')
def index():
    return "Flask server is running" #url 접속시 문구 출력

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
```
<br>

이렇게 만든 실행파일 main.py는 터미널에 다음과 같이 입력하여 실행합니다.
```
python main.py
```

<br>

 서버가 실행되면 터미널에 접속 주소`127.0.0.1:5001`가 표시됩니다.<br>

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-runserver.png" >
</figure>

<br>

 `127.0.0.1:5001`에 접속하면 우리가 지정한 문구가 출력되는 것을 볼 수 있습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-flaskisrunning.png" >
</figure>


이렇게 Flask는 `@app.route()`를 추가하는 방식으로 웹 페이지를 추가하고 연결합니다. (Python 데코레이터)

## 내고장알리미 데이터 연계하기

### 1. 내고장알리미 데이터란?
[내고장알리미 https://www.laiis.go.kr/myMain.do](https://www.laiis.go.kr/myMain.do) (지방행정종합정보시스템)는 지방자치단체의 행정구역 현황, 단체장, 새소식, 문화관광, 상품권 등의 정보를 종합적으로 제공하는 웹 사이트입니다.
우리가 연계하려는 내고장알리미 데이터는 이 웹사이트에서 제공하는 시군구에 대한 정보를 크롤링해서 csv로 만든 데이터입니다.

[내고장알리미 데이터 파일 다운로드](./mygojang-crawling-data-2024-02-26.csv)

### 2. 검색 API와 내고장알리미 데이터 연계하기

5-2장(API로 데이터 가져오기)에서 작성한 코드에서 나아가 주소기반산업지원서비스 API와 내고장알리미 데이터를 시군구코드 기준으로 연계해보겠습니다.

우리의 현재 프로젝트 폴더에 `test.ipynb`로 ipynb파일을 하나 만들어서 5-2장(API로 데이터 가져오기)의 실습 코드를 이어서 작성할 수 있도록 합니다. 또한 다운로드한 내고장알리미 데이터 csv 파일을 프로젝트 폴더에 같이 위치시킵니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-testipynb.png" >
</figure>

<br> 

API 호출을 위한 라이브러리인 `requests`와 csv 데이터를 다루기 위해 필요한 라이브러리인 `pandas`를 import해서 사용하기 위해서 터미널에 다음의 코드를 입력합니다. 우리는 지금 가상환경이라는 독립된 환경에서 작업하고 있기 때문에 기존에 다른 작업에서 이미 사용하던 라이브러리라도 새로 install 해주는 과정이 필요합니다. 가상환경에 진입한 상태가 맞는지 다시 한 번 확인하고서 install을 진행해줍니다.

```
pip install requests pandas
```

<br>

이제 `test.ipynb`에서 API 데이터와 내고장알리미 데이터를 시군구코드 기준으로 연계하는 코드를 작성해보겠습니다.

API 데이터에서 시군구코드 값을 포함하는 컬럼은 admCd입니다. 그런데 이 컬럼의 값은 시군구코드 값을 포함할 뿐만 아니라 법정동까지 식별하는 법정동코드를 의미하기 때문에 시군구까지만 나타내는 앞의 5자리까지 자르고, 00000을 붙여서 시군구코드 10자리를 만들어 `search_code`변수에 담아줍니다. 

```
#주소기반산업지원서비스 API

url = "https://business.juso.go.kr/addrlink/addrLinkApi.do"
keyword = "정부세종청사"
params = {
    "confmKey":"발급받은 API 승인 KEY",
    "currentPage":"1",
    "countPerPage":"10",
    "keyword": keyword, 
    "resultType":"json"
}

# Keyword로 검색된 결과
api_result = requests.get(url, params=params)
admCd = api_result.json()['results']['juso'][0]['admCd'] #행정동코드
search_code = int(admCd[:5]+'00000') #시군구코드 
```
<br>

내고장알리미 데이터에서 DIST_CODE(시군구코드)가 `search_code`와 일치하는 행을 추출합니다. 시군구코드 기준으로 내고장알리미 데이터를 검색 추출하는 것입니다.

```
# 내고장알리미 데이터에서 시군구코드 일치하는 데이터 반환
mygojang = pd.read_csv('mygojang-crawling-data-2024-02-26.csv') 
result = mygojang.loc[mygojang['DIST_CODE']==search_code].T.iloc[:,0]
```
`result`에 담긴 검색결과는 다음과 같습니다. 정부세종청사가 위치한 세종특별자치시의 행정 정보 등이 담긴 데이터입니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-result.png" >
</figure>


<br> 

### 3. 주소 검색 API 만들기


이제 우리가 앞서 만들어둔 Flask 서버에 내고장 알리미 데이터 검색 결과를 출력하는 라우터를 추가하여 우리만의 API를 만들어 보겠습니다. main.py에 이어서 코드를 작성해보겠습니다.

```
@app.route('/address/<keyword>/')
def address(keyword):
    # 주소기반산업지원서비스 주소 검색 API 호출
    url = "https://business.juso.go.kr/addrlink/addrLinkApi.do"
    params = {
        "confmKey":"발급받은 API 승인 KEY",
        "currentPage":"1",
        "countPerPage":"10",
        "keyword": keyword,
        "resultType":"json"
    }

    # Keyword로 검색된 결과
    result = requests.get(url, params=params)
    admCd = result.json()['results']['juso'][0]['admCd']
    search_code = int(admCd[:5]+'00000')

    # 내고장알리미 데이터에서 시군구코드 일치하는 데이터 반환
    mygojang = pd.read_csv('mygojang-crawling-data-2024-02-26.csv') # 내고장알리미 데이터
    result = mygojang.loc[mygojang['DIST_CODE']==search_code].T.iloc[:,0]
    return result.to_json(force_ascii=False)
```

이 때, `@app.route('/address/<keyword>/')`의 `<keyword>`는 주소 검색어가 들어갈 변수입니다. 
<br>예를 들어, `127.0.0.1:5001/address/정부세종청사/`를 url로 입력하면 주소 검색어는 '정부세종청사'가 되는 것입니다.

이렇게 API를 만들어서 해당 API url에 접속해보면 서버 화면에 주소 검색 결과 데이터가 출력됩니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/5-3-apiresult.png" >
</figure>



