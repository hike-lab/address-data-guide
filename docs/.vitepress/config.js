// https://vitepress.vuejs.org/config/#markdown-options

import { onMounted } from "vue";

export default {
  lang: "ko-KR",
  title: "Address Data Guide",
  description: "Address Data Guide for HIKE Lab. at CAU",
  base: "/docs/",
  lastUpdated: true,
  ignoreDeadLinks: true,

  head: [
    ["link", { rel: "icon", href: "../static/icon/hikeLogo.svg" }],

    // SEO
    // ['meta', { name: 'description', content: description}]
  ],

  // markdown-it-footnote
  markdown: {
    lineNumbers: true,
    math: true,
    config: (md) => {
      md.use(require("markdown-it-katex"));
      md.use(require("markdown-it-footnote"));
    },
    plugins: ["markdown-it-html5-embed"],
  },

  build: { outDir: "/theme/" },
  themeConfig: {
    nav: nav(),
    logo: "/static/icon/hikeLogo.svg",

    sidebar: {
      "/": sidebarMain(),
    },

    editLink: {
      pattern: "https://github.com/hike-lab/address-data-guide",
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

    outline: [2, 3],

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
          text: "1.1 주소란 무엇인가?",
          link: "/contents/chapter-1/chapter-1-1.html",
        },
      ],
    },

    {
      text: "2. 주소 데이터 이해하기",
      collapsed: true,
      items: [
        {
          text: "2.1 개요",
          link: "/contents/chapter-2/chapter-2-1.html",
        },
        {
          text: "2.2 주소정보 누리집",
          link: "/contents/chapter-2/chapter-2-2.html",
        },
        {
          text: "2.3 공개하는 주소",
          link: "/contents/chapter-2/chapter-2-3.html",
        },
        {
          text: "2.4 제공하는 주소",
          link: "/contents/chapter-2/chapter-2-4.html",
        },
        {
          text: "2.5 제공하는 주소 신청방법과 QGIS 사용법",
          link: "/contents/chapter-2/chapter-2-5.html",
        },
        {
          text: "2.6 주소 관련 코드체계",
          link: "/contents/chapter-2/chapter-2-6.html",
        },
      ],
    },
    {
      text: "3. 주소 데이터 살펴보기",
      collapsed: true,
      items: [
        {
          text: "3.1 프로젝트 소개",
          link: "/contents/chapter-3/chapter-3-1.html",
        },
        {
          text: "3.2 프로젝트 환경 구축하기",
          link: "/contents/chapter-3/chapter-3-2.html",
        },
        {
          text: "3.3 도로명주소 데이터 살펴보기(1)",
          link: "/contents/chapter-3/chapter-3-3.html",
        },
        {
          text: "3.4 도로명주소 데이터 살펴보기(2)",
          link: "/contents/chapter-3/chapter-3-4.html",
        },
        {
          text: "3.5 도로명 데이터 살펴보기",
          link: "/contents/chapter-3/chapter-3-5.html",
        },
      ],
    },
    {
      text: "4. 도로명 주소의 구성과 품질",
      collapsed: true,
      items: [
        {
          text: "4.1 프로젝트 소개",
          link: "/contents/chapter-4/chapter-4-1.html",
        },
        {
          text: "4.2 프로젝트 환경 세팅",
          link: "/contents/chapter-4/chapter-4-2.html",
        },
        {
          text: "4.3 도로명주소 오류 유형 알아보기",
          link: "/contents/chapter-4/chapter-4-3.html",
        },
        {
          text: "4.4 도로명주소 유효성 평가 및 정제",
          link: "/contents/chapter-4/chapter-4-4.html",
        },
        {
          text: "4.5 데이터 품질 요소 알아보기",
          link: "/contents/chapter-4/chapter-4-5.html",
        },
        {
          text: "4.6 데이터 품질 평가해보기",
          link: "/contents/chapter-4/chapter-4-6.html",
        },
      ],
    },
    {
      text: "5. 외부데이터를 연계한 주소 검색 API 만들기",
      collapsed: true,
      items: [
        {
          text: "5.1 프로젝트 소개",
          link: "/contents/chapter-5/chapter-5-1.html",
        },
        {
          text: "5.2 프로젝트 환경 구축하기",
          link: "/contents/chapter-5/chapter-5-2.html",
        },
        {
          text: "5.3 API로 데이터 가져오기",
          link: "/contents/chapter-5/chapter-5-3.html",
        },
        {
          text: "5.4 외부데이터를 연계한 주소 검색 API 만들기",
          link: "/contents/chapter-5/chapter-5-4.html",
        },
      ],
    },
    {
      text: "6. 파이썬과 MySQL로 구축하는 주소 데이터베이스",
      collapsed: true,
      items: [
        {
          text: "6.1 프로젝트 소개",
          link: "/contents/chapter-6/chapter-6-1.html",
        },
        {
          text: "6.2 프로젝트 환경 구축하기",
          link: "/contents/chapter-6/chapter-6-2.html",
        },
        {
          text: "6.3 데이터베이스 생성하기",
          link: "/contents/chapter-6/chapter-6-3.html",
        },
        {
          text: "6.4 테이블 생성하기",
          link: "/contents/chapter-6/chapter-6-4.html",
        },
        {
          text: "6.5 데이터 삽입하기",
          link: "/contents/chapter-6/chapter-6-5.html",
        },
        {
          text: "6.6 SQL로 데이터 분석하기",
          link: "/contents/chapter-6/chapter-6-6.html",
        },
      ],
    },
    {
      text: "7. 주소 지식모델 (TBD)",
      collapsed: true,
      items: [
        {
          text: "7.1 프로젝트 소개", 
          link: "/contents/chapter-7/chapter-7-1.html"
        }
      ]
    },
    {
      text: "8. 주소 지식그래프 구축 (TBD)",
      collapsed: true,
      items: [
        {
          text: "8.1 프로젝트 소개", 
          link: "/contents/chapter-8/chapter-8-1.html"
        }
      ]
    },
    {
      text: "9. 주소 지식그래프 활용 (TBD)",
      collapsed: true,
      items: [
        {
          text: "9.1 프로젝트 소개", 
          link: "/contents/chapter-9/chapter-9-1.html"
        }
      ]
    },
    {
      text: "Appendix",
      collapsed: true,
      items: [
        {
          text: "자료 목록", 
          link: "/contents/appendix/contents.html"
        }
      ]
    }
  ];
}
