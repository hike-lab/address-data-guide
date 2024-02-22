// https://vitepress.vuejs.org/config/#markdown-options

export default {
  lang: "ko-KR",
  title: "Address Data Guide",
  description: "Address Data Guide for HIKE Lab. at CAU",
  base: "/docs/",

  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [["link", { rel: "icon", href: "../static/icon/hikeLogo.svg" }]],

  // markdown-it-footnote
  markdown: {
    lineNumbers: true,
    math: true,
    config: (md) => {
      md.use(require("markdown-it-katex"));
      md.use(require("markdown-it-footnote"));
    },
  },
  build: { outDir: "/theme/" },
  themeConfig: {
    nav: nav(),
    logo: "/static/icon/hikeLogo.svg",

    sidebar: {
      "/": sidebarMain(),
    },

    editLink: {
      pattern: "https://github.com/hike-lab/nlp-docs",
      text: "Edit this page on GitHub",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/hike-lab" }],

    footer: {
      // message: 'Docs are released under the MIT License.',
      copyright: "Copyright © 2024 HIKE Lab.",
    },

    search: {
      provider: "local",
    },

    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // }
  },
};

function nav() {
  return [
    // { text: 'JustBoil.me', link: '/free/', activeMatch: '/free/' }
    { text: "HIKE Lab.", link: "http://hike.cau.ac.kr" },
  ];
}

function sidebarMain() {
  return [
    {
      text: "1. 주소의 개념",
      collapsed: true,
      items: [
        {
          text: "1. 주소란 무엇인가?",
          link: "/contents/chapter-1/chapter-1-1.html",
        },
      ],
    },

    {
      text: "2. 주소 데이터",
      collapsed: true,
      items: [
        {
          text: "1. 개요",
          link: "/contents/chapter-2/chapter-2-1.html",
        },
        {
          text: "2. 주소정보 누리집",
          link: "/contents/chapter-2/chapter-2-2.html",
        },
        {
          text: "3. 공개하는 주소",
          link: "/contents/chapter-2/chapter-2-3.html",
        },
        {
          text: "4. 제공하는 주소",
          link: "/contents/chapter-2/chapter-2-4.html",
        },
        {
          text: "5. 주소 관련 코드체계",
          link: "/contents/chapter-2/chapter-2-5.html",
        },
      ],
    },
    {
      text: "3. 주소 데이터 EDA",
      collapsed: true,
      items: [
        {
          text: "1. 프로젝트 소개",
          link: "/contents/chapter-3/chapter-3-1.html",
        },
        {
          text: "2. 도로명주소 데이터 살펴보기",
          link: "/contents/chapter-3/chapter-3-2.html",
        },
        {
          text: "2. 도로명 데이터 살펴보기",
          link: "/contents/chapter-3/chapter-3-3.html",
        },
      ],
    },
    {
      text: "4. 도로명 주소의 구성과 품질",
      collapsed: true,
      items: [
        {
          text: "1. 프로젝트 소개",
          link: "/contents/chapter-4/chapter-4-1.html",
        },
      ],
    },
    {
      text: "5. 주소 데이터 API 활용한 검색 기능 구현",
      collapsed: true,
      items: [
        {
          text: "1. 프로젝트 소개",
          link: "/contents/chapter-5/chapter-5-1.html",
        },
      ],
    },
    {
      text: "6. 파이썬과 MySQL로 구축하는 주소 데이터베이스",
      collapsed: true,
      items: [
        {
          text: "1. 프로젝트 소개",
          link: "/contents/chapter-6/chapter-6-1.html",
        },
        {
          text: "2. 프로젝트 환경 구축하기",
          link: "/contents/chapter-6/chapter-6-2.html",
        },
        {
          text: "3. 데이터베이스 생성하기",
          link: "/contents/chapter-6/chapter-6-3.html",
        },
        {
          text: "4. 테이블 생성하기",
          link: "/contents/chapter-6/chapter-6-4.html",
        },
        {
          text: "5. 데이터 삽입하기",
          link: "/contents/chapter-6/chapter-6-5.html",
        },
        {
          text: "6. SQL로 데이터 분석하기",
          link: "/contents/chapter-6/chapter-6-6.html",
        },
      ],
    },
  ];
}
