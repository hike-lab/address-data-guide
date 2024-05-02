# 6. Flask로 주소 검색 API 만들기 실습 코드

본 디렉토리에 있는 코드는 6장 실습의 결과물로서 이미 만들어진 Flask 서버를 실행하여 결과물을 확인할 수 있습니다.

**[6. 외부데이터를 연계한 주소 검색 API 만들기](http://hike.cau.ac.kr/docs/guide/contents/chapter-6/chapter-6-1.html)** 독스를 참고하여 새 프로젝트 폴더를 만드는 과정부터 차근차근 실습해보는 것을 권장합니다.

## Flask로 만든 주소 검색 API 확인하기
### 주소기반산업지원 서비스 API 신청
**[6-3장 API로 데이터 가져오기](http://hike.cau.ac.kr/docs/guide/contents/chapter-6/chapter-6-3.html)** 독스를 참고하여 API키를 발급합니다.

### 발급받은 API키를 main.py에 입력
발급받은 API키를 본 디렉토리의 main.py코드를 열어서 코드 내용 중 "발급받은 API 승인KEY" 부분에 대체하여 입력합니다.

### Flask 프로젝트 폴더로 이동
```
cd /chapter-6
```

### 가상환경 생성
```
python -m venv env
```

### 가상환경 진입
```
source env/bin/activate  # mac
env/Scripts/activate.bat  # window cmd
env/Scripts/Activate.Ps1 # window powershell
```
### 필요한 라이브러리 설치
```
pip3 install -r requirements.txt
```

### Flask 서버 실행
```
python main.py
```
서버 실행 시 터미널에 표시되는 서버 접속 주소에 접근합니다. 브라우저 창이 열리며 "Flask is running!"이라는 문구가 표시될 것입니다.

### API 호출
열린 브라우저의 주소창에 **domain/address/"본인이 검색하고 싶은 주소"** 와 같이 url를 입력하여 API를 호출하고 화면에 출력된 결과를 확인합니다.<br>
url 예시 : **http://127.0.0.1:5001/address/정부세종청사**

