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

### 댓글 기능 추가

Public 상태라면, [giscus](https://plugin-comment2.vuejs.press/config/giscus.html) 추가 가능
