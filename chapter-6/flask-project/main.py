# main.py : 서버를 가동시키는 실행파일
from flask import Flask
import requests
import pandas as pd

#객체 인스턴스 생성
app = Flask(__name__)

#기본 접속 url
@app.route('/')
def index():
    return "Flask server is running!"

@app.route('/address/<keyword>/')
def address(keyword):
    # 주소기반산업지원서비스 주소 검색 API 호출
    url = "https://business.juso.go.kr/addrlink/addrLinkApi.do"
    params = {
        "confmKey":"발급받은 API 승인KEY",
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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)