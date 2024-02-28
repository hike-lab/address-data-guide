# 4. 제공하는 주소

<br>

#### 작성자: 송채은

## 제공하는 주소

주소정보 제공의 [제공하는 주소](https://business.juso.go.kr/addrlink/adresInfoProvd/guidance/provdAdresInfo.do)는 도형정보 또는 좌표를 포함한 자료로 구성되어 있습니다. 총 11종의 데이터로 구성되어 있으며, 각 데이터의 상세 내용은 아래와 같습니다.  

| 데이터명                 | 설명                                                                         |
|------------------------|------------------------------------------------------------------------------|
| 도로명주소 출입구 정보   | 도로명주소 기준의 출입구 좌표를 제공합니다. 집합건물(예: 아파트)의 경우 주소기준의 주(보조)출입구 제공 / 건물단위 제공 안함 |
| 도로명주소 건물 도형      | 도로명주소의 도형정보(집합건물 일 경우 건물군 제공)/ 출입구 정보/ 연결선 정보를 제공합니다. 건물군 내 상세주소 동 도형: 집합건물(예: 아파트) 내 동이 부여된 도로명주소의 도형정보를 제공합니다. |
| 사물주소 시설 기준점     | 도로명과 기초번호를 이용하여 구성한 사물주소정보의 기준점을 제공합니다.          |
| 사물주소 시설 도형       | 도로명과 기초번호를 이용하여 구성한 사물주소정보의 도형정보를 제공합니다.        |
| 기초번호                | 위치정보 제공을 위한 기초번호 중심점 좌표정보를 제공합니다.                     |
| 국가지점번호 중심점     | 도로명주소 사용에 따라 도로명이 부여되지 않는 국토 및 이와 인접한 해양 등의 위치표시체계 보완을 위해 전국을 일정한 격자 단위로 구획하여 부여한 지점의 번호와 해당 격자의 중심점 좌표를 제공합니다. |
| 국가지점번호 도형       | 도로명주소 사용에 따라 도로명이 부여되지 않는 국토 및 이와 인접한 해양 등의 위치표시체계 보완을 위해 전국을 일정한 격자 단위로 구획하여 부여한 지점의 번호와 가로와 세로의 길이가 각각 100m, 1Km, 10Km, 100Km로 나뉘어진 지점번호 격자 정보를 제공합니다. |
| 도로명이 부여된 도로 도형 | 도로명이 부여된 도로구간 등의 도형(법정구역/도로명/기초번호 사용범위/도로구간/기초구간/도로의실폭 등)을 제공합니다. |
| 구역의 도형              | 법정구역, 행정구역, 기초구역, 지점번호표기의무지역의 경계를 제공합니다.          |
| 기타자료                | 도로명주소 배경지 공원, 철도, 교량, 하천 등 도로명주소 전자지도의 배경으로 활용되는 도형(점,선,면)을 제공합니다. |

제공하는 주소는 공개하는 주소와 달리 별도의 신청이 필요하고, 데이터의 형태가 SHP 파일로 제공됩니다. 이번 장은 제공하는 주소의 신청 방법을 설명하고, 예시 도형데이터를 QGIS 프로그램을 이용해 시각화하는 방법을 설명합니다.

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

3. 화면의 하단에 있는 '신청하기'버튼을 클릭하면, 본인인증을 위한 화면으로 팝업됩니다.

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

