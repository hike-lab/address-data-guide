# 6.5 데이터 품질 알아보기


5챕터에 걸쳐서 우리는 도로명주소를 정제하고, 도로명주소의 구성요소를 재가공하여 인구데이터와 합칠 수 있는 키 컬럼을 생성하여 두 데이터세트를 합쳤습니다. 이제 분석할 데이터는 준비되었으니, 합쳐진 데이터의 품질을 평가해보고 이를 바탕으로 활용성을 점검해보도록 합시다.

## 데이터 품질이란?

> 데이터 품질에 대해서는 다양한 정의와 해석이 존재하며, 개별 품질 요소에 대해서도 일관적인 평가 체계(metric)가 존재하지 않습니다. 4챕터에서 언급되는 '데이터 품질'과 '품질 평가 요소'에 대한 전반적인 정의와 설명은 다수의 참고 문헌과 공공데이터 관리지침에서 제시된 테이블 형식의 파일 데이터의 품질 요소와 정의, 평가방식을 취사 선택하였습니다. 참고한 내용은 모두 각주로 첨부하였습니다. 

ISO 25012 표준에서는 데이터 품질에 대해 "특정 조건에서 데이터를 사용할 때 명시적이거나 암묵적인 필요를 충족시킬 수 있는 정도"라고 정의합니다. 쉽게 말해 데이터가 사용자에게 유용한 가치를 줄 수 있는 정도라고도 할 수 있습니다.

공공데이터 관리지침에서는 이러한 정의에 따라 데이터 품질 요소로 최신성과 정확성, 상호연계성로 나누어 보고 있으며, 품질관리체계와 데이터 자체에 대한 품질로 나누어 퓸질을 평가합니다. 

그러나, 공공데이터 관리지침은 '관리지침'이므로 관리자 관점에서 평가 체계가 구성되었고, 따라서 데이터 자체를 평가보다는 관리 프로세스 위주로 체계가 구성되어 있다는 한계가 있습니다. 따라서 공공데이터 관리지침의 기준대로 활용의 관점에서 데이터의 측면들을 완전히 평가하는 것은 어렵다고 판단하여, 본 문서에서는 다른 연구에서 사용된 평가 체계의 평가 요소를 위주로 다룹니다.


## 데이터 품질의 평가 영역

데이터 품질 평가의 큰 틀은 Open Data Quality Measurement Framework: Definition and Application to Open Government Data(Antonio Vero,. 2016)에서 제시한 프레임워크의 품질 평가요소와 metric을 따릅니다. 

해당 논문에서 제시한 프레임워크는 SPDQM(Square-Aligned Portal Data Quality Model)에 이론적 기반을 두고 있습니다. 
SPDQM은 데이터 포털의 테이블 형식 데이터를 평가하기 위한 평가요소와 이들에 대한 정의를 제시합니다. SPDQM은 ISO 25012의 내용을 반영하여 비교적 표준화된 정의에서의 품질 요소를 정의하며, 보다 활용 관점에서의 충실한 평가를 위해 이용자 관점의 데이터 평가 모델인 PDQM에서 제안된 평가요소들도 일부 포함하고 있습니다. 또한, 실제 데이터 이용자를 대상으로 설문조사를 진행한 결과를 통해 평가 요소를 추가적으로 추려내었다고 합니다. 

논문에서 제시된 평가 요소는 완전성, 정확성, 이해가능성, 최신성, 유효성, 만기성?, 추적성?이 있습니다. 여기서 추최신성, 추적성, 만기성의 경우, 본 문서에서 다루는 범위가 파일 데이터 수준이므로 제외하였습니다. 또한 다른 평가 요소의 metric에서도 현실적으로 평가하기 어려운 부분에 대해서는 제외하였습니다.

또한, 평가 요소의 metric이 다른 평가 요소의 metric과 의미적으로 유사하거나 모호한 경우도 다른 문헌이나 관리지침의 평가 요소들을 참고해 수정하였습니다. 

예를들어, 완전성의 경우 논문에서 제시한 metric은 1. 비어있지 않은 데이터, 2. 도메인 규칙을 준수하는 데이터(meaningful value)를 함께 합산하여 평가할 것을 제시하는데요. 이 경우 실질적으로 공백인 부분과 구문론적으로 유효하지 않은 부분에 대한 지표를 분리하여 확인할 수 없다는 문제가 존재하였습니다. 또한, '도매인 규칙을 준수하는 데이터'는 곧, '표준화된 규칙을 적용하는지에 대한 여부에 대한 평가인 유효성의 정의에 더 가깝다는 점에서 metric이 평가 요소에 대한 지표를 직관적이고 이해하기 쉽게 나타내지 못하는 것으로 보였습니다.

따라서 앞서 언급된 부분들은 공공데이터 관리지침과 다른 문헌에서 제시한 평가모델들의 지표들을 참고하여 일부 수정하였으며, 논문에서 언급되지 않은 구체적인 평가 대상이나 방법론 역시 타 문헌들을 참고하여 작성하였습니다.


## 품질 요소별 평가 방법


- 완전성에 대한 평가 수식은 다음과 같습니다.

    > 컬럼별 완전성 평가

    $$complete_{C_i} = \frac{dataLength - icc(C_i)}{dataLength},\space icc=number\space of\space incomplete\space cell\space in\space column\space i$$

    >  전체 데이터셋의 완전성 평가

    $$complete_{all} = \frac{(n*DataLength - \Sigma_{i=1}^n icc(C_i))}{n*DataLength}, \space n = number\space of\space columns$$

- 일관성의 경우, 두 쌍의 행을 비교하므로 나머지 평가요소들과 다른 방법이 적용됩니다. 일관성은 논리적관계를 갖는 한 쌍의 컬럼 명칭으로 이뤄진 컬럼 테이블을 평가에 사용하며, 두 값이 논리적으로 올바른 경우 해당 행에는 1, 올바르지 않으면 0, 두 컬럼 중 어느 한 컬럼의 값이라도 공백인 경우는 None을 기입합니다.

    > 컬럼세트별 일관성 평가

    $$consistency_{ColSet_i} =  \frac{dataLength-null(ColSet_i) - ics(ColSet_i)}{dataLength-null(ColSet_i)},\space ics=number\space of\space inconsistence\space rows\space in\space column\space set\space i$$ 

    > 전체 데이터셋 일관성 평가

    $$consistency_{all} = \frac{\Sigma_{i=1}^{n}consistency_{ColSet_i}}{n} , \space n = number\space of\space column\space sets$$

- 일관성, 완전성을 제외한 나머지 평가항목에 대한 평가 산식은 아래의 수식과 같습니다. 유효성이나 정확성 등의 항목들은 각각 평가대상 컬럼들이 포함된 평가 테이블을 만들어 평가를 진행합니다. 개별 평가 항목의 테이블 셀에는 평가 요소에 대한 준수 여부를 ``1(준수)/0(미준수)/공백``으로 체크한 후, 컬럼별 준수 비율과 전체 준수비율을 구하는 방식으로 진행됩니다.

    > 컬럼세트별 일관성 평가

    $$evalaute_{C_i} =  \frac{dataLength-null(C_i) - flasey(C_i)}{dataLength-null(C_i)},\space falsey=number\space of\space flasey\space cells\space in\space column\space set\space i$$ 

    > 전체 데이터셋 일관성 평가

    $$evaluate_{all} = \frac{\Sigma_{i=1}^{n}evaluate_{C_i}}{n} , \space n = number\space of\space columns$$

---

### 완전성

>  구문의 일관적 표기 여부는 일관성의 개념과 유효성의 개념 모두에 포함되는 metric입니다. 일관성을 대체로 컬럼의 논리성의 측면에서 정의하며, 구문적 오표기는 실질적으로 이용의 관점에서 유효하지 않으므로, 실질적으로 유효성의 개념에 포함되는 것이 적합합니다. 따라서 완전성의 정의와 metric에서는 오직 공백 셀에 대한 완전한 셀의 비중으로만 설명합니다.

**정의** |
완전성은 데이터가 필수적으로 가져야 하는 값을 갖고 있는지, 또는 식별자 값에 공백이 없는지 등, 데이터를 활용함에 있어 필요한 정보가 얼마나 온전한지를 나타냅니다. 
필수 작성 컬럼에 대한 정보를 알 수 없는 경우, 일반적으로 데이터셋의 전체 공백 비율로 완전성을 평가합니다. 

**metric** | 전체 데이터셋, 또는 컬럼에서 공백이 아닌 값의 비율


### 유효성

**정의** | 유효성은 컬럼에 표준적으로 적용되는 형식이 존재하는 경우, 이를 준수하고 있는지에 대한 여부를 평가하는 항목입니다. 공공데이터 개방표준에서 제시하는 유효성의 진단 항목으로는 **여부, 수량, 금액, 율, 날짜, 코드**가 있습니다. 유효성은 표기 규칙에 따른 정규표현식을 작성하여 빠르게 확인할 수 있습니다.

**metric** | 전체 데이터셋, 또는 컬럼에서 공백을 제외한 값들 중 표준 형식을 준수하는 값의 비율

### 정확성

**정의** | 정확성은 데이터의 값들이 정확한 값들인지에 대해 평가하는 지표입니다. 예를 들어 공공시설물의 소재지주소가 "서울특별시 동작구 흑석로 84"인데, 실제 위치는 "서울특별시 동작구 흑석로 82-1"인 경우, 정확하지 않은 데이터로 평가합니다. 해당 문서에서 다루는 정확성 대상 컬럼의 범위는, 외부 API를 활용한 검색을 통해 사실 여부를 자동적으로 체크할 수 있는 컬럼으로, **주소, 좌표계**컬럼이 이에 해당됩니다.

**metric** | 전체 데이터셋, 또는 컬럼에서 공백을 제외한 값들 중 API를 통한 검색 결과가 존재하는 값의 비율

### 이해가능성

**정의** | 이해가능성은 사람과 기계 모두가 이해할 수 있는 문자 체계로 작성되었는지에 대한 여부로 평가합니다. 정규표현식으로 영어와 한글, 일자나 전화번호 표기를 위한 "-"나 일반적인 문장부호를 제외한 특수기호의 포함여부를 체크합니다.

**metric** | 전체 데이터셋, 또는 컬럼에서 공백을 제외한 값들 중 사람과 기계가 식별이 불가능한 문자가 포함되지 않은 값의 비율

### 일관성*
    
> 해당 항목은 Accuracy 항목에 제시된 metics 중 하나인 "Accuracy in Aggreagation"을 따로 분리하여 "일관성"이라는 별도의 품질 요소로 분리한 것입니다. 공공데이터 관리지침에서의 정의도 추가하였습니다.

**정의** | 일관성은 컬럼자체가 갖는 논리적 관계를 준수하는지에 대한 평가 항목입니다. 일관성의 평가 대상은 **컬럼논리관계, 시간순서, 총합(타 컬럼 값들에 대한 총합)** 이 있습니다. 예를들어, 어떤 공공시설물의 소재지주소가 "서울특별시 동작구 흑석로 84"인데 소재지 시도명 컬럼에 "경기도"가 표기된 것과 같이, 컬럼간의 사실관계가 상충하는 경우 일관성이 떨어진다고 평가합니다. 일관성은 논리적으로 관계가 있는 두 컬럼의 값들을 비교하거나, 매핑테이블을 활용해 논리적 관계에 어긋나는 값들의 쌍을 찾아내는 방식으로 점검할 수 있습니다.

**metric** | 논리적 관계를 갖는 컬럼-컬럼 쌍에서, 어느 한 컬럼이라도 공백을 갖는 행을 제외한 행들에 대해 논리적으로 옳은 행의 비율


## 권장하는 품질 평가 프로세스

품질 평가는 **유효성 ➡️ 사실성 ➡️ 일관성** 순서로 진행하는 것이 효율적입니다. 유효성은 대체로 정규표현식으로 빠르게 점검이 가능하나 사실성은 외부 데이터를 통한 검증이 이뤄지고, 대체로 API를 활용하므로 시간이 오래 걸리기 때문입니다.

일관성을 가장 마지막으로 점검하는 이유는 유효성과 사실성으로 인한 오류를 제외한 후에 데이터에서 발생하는 일관성 오류만을 파악하는 것이 효과적이기 때문입니다. 따라서, 일관성 검증 시 유효성, 사실성 부분에서 문제가 있는 부분을 제한 후 파악하는 것을 추천합니다.

해당 프로세스는 어디까지나 권장하는 사안이므로, 상황에 맞게 효율적으로 조정하시길 바랍니다. 또한, 다른 데이터에서의 재사용을 위해서 점검 코드를 함수화 하는 방식을 권장합니다.

## 참고자료

1. [김학래. (2020). 공공데이터 개방표준 데이터의 품질평가. 한국콘텐츠학회 논문지, 20(9), 439-447.](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002633333)

2. [박고은 & 김창재. (2015). 공공개방데이터 품질 특성에 관한 연구. 디지털융복합연구, 13(10), 135-146.](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002044798)

3. [공공데이터 관리지침(2021)]()

4. [Vetro, Antonio & Canova, Lorenzo & Torchiano, Marco & Minotas, Camilo & Iemma, Raimondo & Morando, Federico. (2016). Open data quality measurement framework: Definition and application to Open Government Data. Government Information Quarterly. 33. 10.1016/j.giq.2016.02.001.](https://www.researchgate.net/publication/295394863_Open_data_quality_measurement_framework_Definition_and_application_to_Open_Government_Data)

5. [Caro, Angelica & Calero, Coral & Caballero, Ismael & Piattini, Mario. (2008). A proposal for a set of attributes relevant for Web portal data quality. Software Quality Journal. 16. 513-542. 10.1007/s11219-008-9046-7. ](https://www.researchgate.net/publication/220635758_A_proposal_for_a_set_of_attributes_relevant_for_Web_portal_data_quality)

6. [Moraga, C., Moraga, M. Á., Calero, C., & Caro, A. (2009). SQuaRE-Aligned Data Quality Model for Web Portals. 2009 Ninth International Conference on Quality Software, 117–122. ](https://ieeexplore.ieee.org/document/5381502)