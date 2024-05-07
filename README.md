# Address Data Guide

주소데이터 활용 예시 가이드 문서입니다.

### 설치

```bash
npm install
npm run docs:dev
npm run docs:build # deploy
```

### 마크다운 사용하기

- [vitepress markdown 설명서](https://vitepress.vuejs.org/guide/markdown)에 접속하면 상세한 사용방법을 확인할 수 있습니다.

### 이미지 폴더 생성하기

사용하는 이미지는 `contents/img` 폴더에 이미지를 저장합니다.  
사용 예시는 아래와 같습니다.

```
<figure class="flex flex-col items-center justify-center">
    <img src="../img/example.png" title="juso.go.kr guide">
</figure>
```

### 목차 생성하기

- `.vitepress` 폴더의 `config.js`에서 목차를 생성합니다.
- `config.js`의 가장 하단에 있는 `sidebarMain()`에서 아래와 같이 추가합니다.

```js
function sidebarMain() {
  return [
    {
      text: "Introduction",
      collapsible: true,
      items: [
        { text: "0. 추천 학습 가이드", link: "/nlp/0-introduction.html" },
      ],
    },
    {
      text: "자연어처리 기초 개념",
      collapsible: true,
      items: [
        { text: "1-1. 자연어처리란?", link: "/nlp/1-1-what-is-nlp.html" },
        {
          text: "1-2. 한국어 자연어처리가 어려운 이유",
          link: "/nlp/1-2-nlp-for-korean.html",
        },
        {
          text: "1-3. 텍스트 데이터 수집하기",
          link: "/nlp/1-3-get-text-data.html",
        },
      ],
    },
  ];
}
```

### 추가적으로 설치가 필요한 라이브러리

- **timeline.js**

  - [공식문서](https://timeline.knightlab.com/?_gl=1*ztgdcs*_ga*NDE2NjI4MzE0LjE3MDg2NzMzMDM.*_ga_8F4WPDMPL5*MTcwODY3MzMwMy4xLjEuMTcwODY3NDE3MS4wLjAuMA..)
  - `Chapter  1 - 1. 주소란 무엇인가` 에서 사용
  - [연보 기입 스프레드 시트](https://docs.google.com/spreadsheets/d/1uRR7MA8VW8TE8mveK2tjwcW3BCyp_NIB18MG9RxOYNw/edit?usp=sharing)
  - 터미널에 `npm i @knight-lab/timelinejs` 입력하여 다운로드

  - 사용법
    1. 스프레드 시트에 추가 정보 작성 후 저장 (시트 내용, 파일명 등 변경 사항 있을 때마다 새 링크로 받아야 함.)
    2. 저장한 다음 상단 `파일 > 공유 > 웹에 게시` 클릭
    3. 웹 게시 후, 주소 창의 주소 복사 (웹 게시 팝업에 나오는 주소 X)
    4. `docs > .vitepress > theme > components` 폴더의 `timeLine.vue` 파일에서 스프레드 시트 링크 부분 수정
    5. 커널 종료했다가 재실행

### 댓글 기능 추가

- Public 상태라면, [giscus](https://github.com/T-miracle/vitepress-plugin-comment-with-giscus?tab=readme-ov-file) 추가 가능
- 2024년 3월 20일 추가완료 (필요없다면 추후 삭제)

### Git actions

- 2024년 5월 7일 자동 build 기능 추가