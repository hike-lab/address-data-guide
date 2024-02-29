# 4. 제공하는 주소

<br>

#### 작성자: 송채은

## 제공하는 주소

주소정보 제공의 [제공하는 주소](https://business.juso.go.kr/addrlink/adresInfoProvd/guidance/provdAdresInfo.do)는 도형정보 또는 좌표를 포함한 자료로 구성되어 있습니다. 총 11종의 데이터로 구성되어 있으며, 각 데이터의 상세 내용은 아래와 같습니다.

| 데이터명                  | 설명                                                                                                                                                                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 도로명주소 출입구 정보    | 도로명주소 기준의 출입구 좌표를 제공합니다. 집합건물(예: 아파트)의 경우 주소기준의 주(보조)출입구 제공 / 건물단위 제공 안함                                                                                                                               |
| 도로명주소 건물 도형      | 도로명주소의 도형정보(집합건물 일 경우 건물군 제공)/ 출입구 정보/ 연결선 정보를 제공합니다. 건물군 내 상세주소 동 도형: 집합건물(예: 아파트) 내 동이 부여된 도로명주소의 도형정보를 제공합니다.                                                           |
| 사물주소 시설 기준점      | 도로명과 기초번호를 이용하여 구성한 사물주소정보의 기준점을 제공합니다.                                                                                                                                                                                   |
| 사물주소 시설 도형        | 도로명과 기초번호를 이용하여 구성한 사물주소정보의 도형정보를 제공합니다.                                                                                                                                                                                 |
| 기초번호                  | 위치정보 제공을 위한 기초번호 중심점 좌표정보를 제공합니다.                                                                                                                                                                                               |
| 국가지점번호 중심점       | 도로명주소 사용에 따라 도로명이 부여되지 않는 국토 및 이와 인접한 해양 등의 위치표시체계 보완을 위해 전국을 일정한 격자 단위로 구획하여 부여한 지점의 번호와 해당 격자의 중심점 좌표를 제공합니다.                                                        |
| 국가지점번호 도형         | 도로명주소 사용에 따라 도로명이 부여되지 않는 국토 및 이와 인접한 해양 등의 위치표시체계 보완을 위해 전국을 일정한 격자 단위로 구획하여 부여한 지점의 번호와 가로와 세로의 길이가 각각 100m, 1Km, 10Km, 100Km로 나뉘어진 지점번호 격자 정보를 제공합니다. |
| 도로명이 부여된 도로 도형 | 도로명이 부여된 도로구간 등의 도형(법정구역/도로명/기초번호 사용범위/도로구간/기초구간/도로의실폭 등)을 제공합니다.                                                                                                                                       |
| 구역의 도형               | 법정구역, 행정구역, 기초구역, 지점번호표기의무지역의 경계를 제공합니다.                                                                                                                                                                                   |
| 기타자료                  | 도로명주소 배경지 공원, 철도, 교량, 하천 등 도로명주소 전자지도의 배경으로 활용되는 도형(점,선,면)을 제공합니다.                                                                                                                                          |

제공하는 주소는 공개하는 주소와 달리 별도의 신청이 필요하고, 도형데이터가 제공됩니다.  
이번 장은 제공하는 주소의 신청방법을 소개하고, 예시 도형데이터를 QGIS 프로그램을 이용해 시각화하는 방법을 설명합니다.

각 데이터의 세부 내용은 이용목적에 따라 제공하는 주소의 데이터 레이아웃과 활용가이드문서를 참고하시기 바랍니다.

## 제공하는 주소 신청방법

1. 제공하는 주소의 첫화면에 신청을 위한 양식이 있습니다. 기본정보, 신청인 정보, 신청사유, 추가신청 정보를 입력합니다. 개인이 신청할 경우, 시스템명은 없음으로 입력하셔도 됩니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-form-input.png" title="신청방법">
    <figcaption style="text-align: center;"></figcaption>
</figure>

2. 입력이 완료되면 '개인정보 수집 및 이용 동의'버튼을 클릭한 뒤, 원하는 데이터를 선택합니다.  
아래 예시는 도로명주소 출입구와 도로명주소 건물 도형의 전체분과 변동분을 선택한 결과입니다.
<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-form-select.png" title="신청방법">
    <figcaption style="text-align: center;"></figcaption>
</figure>

3. 화면의 하단에 있는 '신청하기'버튼을 클릭하면, 본인인증을 위한 화면이 팝업됩니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-form-security.png" title="신청방법">
    <figcaption style="text-align: center;"></figcaption>
</figure>

4. 본인인증을 완료하면, 신청이 완료되었다는 메시지가 나타납니다. 신청한 데이터는 '신청내역'에서 확인할 수 있습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-form-log.png" title="신청방법">
    <figcaption style="text-align: center;"></figcaption>
</figure>

이 때, 신청한 기관명(개인일 경우 이름)과 신청한 데이터의 목록이 나타납니다. 빨간색 박스로 표시된 구역을 클릭하면, 신청한 데이터의 처리현황을 확인할 수 있습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-form-log-detail.png" title="신청방법">
    <figcaption style="text-align: center;"></figcaption>
</figure>

5. 신청처리가 완료된 데이터는 상세내역에서 개별로 다운로드할 수 있습니다. 다운로드한 데이터는 압축파일로 제공되며, 지역별로 제공하는 경우 모든 데이터를 개별적으로 다운로드해야 합니다.

## QGIS를 이용한 주소데이터 시각화

주소데이터의 도형정보는 SHP파일로 제공되며, 시각화를 위해 QGIS 프로그램을 사용합니다.
QGIS는 무료로 사용가능한 오픈소스 기반의 지리정보시스템(GIS)으로, 지리정보를 시각화하고 분석하는데 사용됩니다. QGIS 프로그램은 [QGIS 공식홈페이지](https://qgis.org/ko/site/)에서 다운로드할 수 있습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

이번 장은 QGIS를 이용해 도형데이터를 불러오고 시각화하는 방법을 설명합니다. 최소한의 기능만을 사용하여 데이터를 시각화하는 방법을 소개하며, QGIS의 모든 기능을 사용하는 방법은 [QGIS 사용자 지침서](https://docs.qgis.org/3.28/ko/docs/user_manual/index.html)에서 확인할 수 있습니다.

---

1. QGIS 프로그램을 실행한 뒤, 좌측 상단의 '프로젝트 > 새로 생성'버튼을 클릭하여 새로운 프로젝트를 생성합니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-1.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

---
2. 좌측 상단의 '레이어 > 레이어 추가 > 벡터 레이어 추가'을 클릭하여 불러올 파일을 선택합니다. 
<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-2.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>
<br>
데이터 원본 관리자 화면에서 `'''`버튼을 클릭하여 파일을 선택합니다.
도형데이터는 DBF(도형의 속성정보), SHP(도형 벡터파일), SHX(도형의 위치, 방향정도) 파일을 모두 선택해 불러옵니다. 예시는 '도로명주소 건물 도형' 전체분의 서울특별시 데이터입니다.
<br>
<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-3.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>
<br>
속성정보 중 한글이 포함된 경우 한글이 깨지는 현상이 발생할 수 있습니다. 이를 방지하기 위해 옵션의 'ENCODING'에 'CP949'를 입력합니다. 모든 설정을 완료한 뒤, '추가'버튼을 클릭합니다.

<br>
<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-4.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

---
3. 데이터를 불러오면, 맵 화면에 도형데이터가 나타납니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-5.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

왼쪽 하단의 레이어 패널에서 원하는 기능을 선택하여 데이터를 시각화할 수 있습니다. 예를 들어, 첫번째 아이콘은 개체의 색깔을 변경할 수 있는 레이어 스타일링 패널입니다. 기존의 주황색에서 초록색으로 변경한 결과입니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-6.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

'레이어 속성' 창은 데이터에 대한 정보를 파악할 수 있게 도와줍니다. '필드 관리'탭을 클릭하면, 현재 데이터의 스키마를 확인할 수 있습니다. 속성정보는 제공하는 주소의 레이아웃과 동일하게 제공되므로, 영문으로 표시된 필드명을 확인하고 수정할 수 있습니다.
<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-7.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

---
4. 시각화된 데이터 중 특정 개체를 식별하려면, 오른쪽 상단의 '객체 식별'버튼을 클릭한 뒤, 맵 화면에서 원하는 개체를 클릭합니다. 클릭한 개체의 정보가 나타납니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-8.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

전체 객체의 속성 정보를 파악하거나, 필터링하여 원하는 데이터만을 시각화할 수 있습니다. 오른쪽 상단의 '속성 테이블'버튼을 클릭하여 속성정보를 확인할 수 있습니다.

:::info 속성 테이블의 범위 설정
상세 버튼을 클릭하면 속성 테이블의 범위를 설정할 수 있습니다. 기본값은 모든 속성을 불러오기 때문에 파일 크기에 따라 과부하가 발생할 수 있습니다. 필요에 따라 속성 테이블과 피처표시를 필터링하여 사용하시기 바랍니다.
:::

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-9.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

---
5. 속성 정보에 대한 통계를 확인하려면, 오른쪽 상단의 '통계'버튼을 클릭합니다. 통계창에서는 선택한 필드의 통계정보를 확인할 수 있습니다.  

왼쪽 하단의 패널에서 원하는 레이어와 속성 필드를 선택합니다. 아래 예시는 'SIG_CD' 필드를 선택한 결과입니다. 'SIG_CD' 필드는 시군구코드를 의미하므로, 시군구별 데이터 현황을 파악할 수 있습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-10.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

통계를 간략히 해석하면, 아래와 같습니다.

- 개수: 서울특별시는 총 530,979개의 건물 도형이 존재함
- 개수 (고윳값): 서울특별시는 25개의 시군구로 구성되어 있음
- 최소값과 최대값: 단순 숫자의 비교이므로 해석이 불가능함
- 가장 빈도가 낮은 값(Minority): 11350(노원구)의 건물 도형이 가장 적게 존재함
- 다수 기준(Majority): 11620(관악구)의 건물 도형이 가장 많이 존재함

---
6. 데이터를 시각화하고 분석한 프로젝트는 '프로젝트 > 저장'버튼을 클릭하여 저장합니다. 프로젝트를 저장하면, 다음에 프로그램을 실행할 때 이전에 작업한 내용을 불러올 수 있습니다.

<figure class="flex flex-col items-center justify-center">
    <img src="../img/2-4-qgis-step-11.png" title="QGIS">
    <figcaption style="text-align: center;"></figcaption>
</figure>

---

이번 장에서는 제공하는 주소와 QGIS 프로그램을 이용해 도형데이터를 시각화하는 방법을 설명했습니다. 도형데이터를 분석하는 방법은 QGIS 외에도 ArcGIS 프로그램, 파이썬 등 다양하게 존재합니다. 상세한 분석과 시각화는 목적에 맞게 적절한 프로그램을 선택하여 활용하시기 바랍니다.