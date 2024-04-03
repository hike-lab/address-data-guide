// https://vitepress.vuejs.org/config/#markdown-options

import { onBeforeMount, onMounted } from "vue";

export default {
  async transformPageData(pageData) {
    pageData.frontmatter.head ??= [];

    let newheader = getJSONLD(pageData);
    pageData.frontmatter.head.push([
      "script",
      { type: "application/ld+json" },
      `${newheader}`,
    ]);
    getOGTag(pageData);
  },

  lang: "ko-KR",
  title: "Address Data Guide",
  description: "Address Data Guide for HIKE Lab. at CAU",
  base: "/docs/guide/",
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
    plugins: ["markdown-it-html5-embed"],
  },

  build: { outDir: "/theme/" },
  themeConfig: {
    nav: [
      { text: "Guide", link: "/contents/guide/guide.html" },
      // {
      //   text: "Info",
      //   items: [
      //     { text: "Item A", link: "/item-1" },
      //     { text: "Item B", link: "/item-2" },
      //     { text: "Item C", link: "/item-3" },
      //   ],
      // },
    ],
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
        {
          text: "1.2 한국의 주소",
          link: "/contents/chapter-1/chapter-1-2.html",
        },
        {
          text: "1.3 도로명주소의 이해",
          link: "/contents/chapter-1/chapter-1-3.html",
        },
      ],
    },
    {
      text: "2. 주소의 역사",
      link: "https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=1uRR7MA8VW8TE8mveK2tjwcW3BCyp_NIB18MG9RxOYNw&font=Default&lang=ko&initial_zoom=2&height=800",
      collapsed: true,
    },
    {
      text: "3. 주소 데이터 이해하기",
      collapsed: true,
      items: [
        {
          text: "3.1 개요",
          link: "/contents/chapter-3/chapter-3-1.html",
        },
        {
          text: "3.2 주소정보 누리집",
          link: "/contents/chapter-3/chapter-3-2.html",
        },
        {
          text: "3.3 공개하는 주소",
          link: "/contents/chapter-3/chapter-3-3.html",
        },
        {
          text: "3.4 제공하는 주소",
          link: "/contents/chapter-3/chapter-3-4.html",
        },
        {
          text: "3.5 제공하는 주소 신청방법과 QGIS 사용법",
          link: "/contents/chapter-3/chapter-3-5.html",
        },
        {
          text: "3.6 주소 관련 코드체계",
          link: "/contents/chapter-3/chapter-3-6.html",
        },
      ],
    },
    {
      text: "4. 주소 데이터 살펴보기",
      collapsed: true,
      items: [
        {
          text: "4.1 프로젝트 소개",
          link: "/contents/chapter-4/chapter-4-1.html",
        },
        {
          text: "4.2 프로젝트 환경 구축하기",
          link: "/contents/chapter-4/chapter-4-2.html",
        },
        {
          text: "4.3 도로명주소 데이터 EDA",
          link: "/contents/chapter-4/chapter-4-3.html",
        },
        {
          text: "4.4 도로명 데이터 EDA",
          link: "/contents/chapter-4/chapter-4-4.html",
        },
        {
          text: "4.5 주소 데이터 활용하기",
          link: "/contents/chapter-4/chapter-4-5.html",
        },
      ],
    },
    {
      text: "5. 파이썬과 MySQL로 구축하는 주소 데이터베이스",
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
          text: "5.3 데이터베이스 생성하기",
          link: "/contents/chapter-5/chapter-5-3.html",
        },
        {
          text: "5.4 테이블 생성하기",
          link: "/contents/chapter-5/chapter-5-4.html",
        },
        {
          text: "5.5 데이터 삽입하기",
          link: "/contents/chapter-5/chapter-5-5.html",
        },
        {
          text: "5.6 SQL로 데이터 분석하기",
          link: "/contents/chapter-5/chapter-5-6.html",
        },
      ],
    },
    {
      text: "6. 외부데이터를 연계한 주소 검색 API 만들기",
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
          text: "6.3 API로 데이터 가져오기",
          link: "/contents/chapter-6/chapter-6-3.html",
        },
        {
          text: "6.4 외부데이터를 연계한 주소 검색 API 만들기",
          link: "/contents/chapter-6/chapter-6-4.html",
        },
      ],
    },
    {
      text: "7. 도로명주소의 품질을 평가하고 정제하기",
      collapsed: true,
      items: [
        {
          text: "7.1 프로젝트 소개",
          link: "/contents/chapter-7/chapter-7-1.html",
        },
        {
          text: "7.2. 프로젝트 환경 구축하기",
          link: "/contents/chapter-7/chapter-7-2.html",
        },
        {
          text: "7.3 도로명주소 오류 유형 알아보기",
          link: "/contents/chapter-7/chapter-7-3.html",
        },
        {
          text: "7.4 도로명주소 유효성 평가 및 정제",
          link: "/contents/chapter-7/chapter-7-4.html",
        },
        {
          text: "7.5 데이터 품질 요소 알아보기",
          link: "/contents/chapter-7/chapter-7-5.html",
        },
        {
          text: "7.6 데이터 품질 평가해보기",
          link: "/contents/chapter-7/chapter-7-6.html",
        },
      ],
    },
    {
      text: "8. 주소 지식모델 (TBD)",
      collapsed: true,
      items: [
        {
          text: "8.1 프로젝트 소개 ",
          link: "/contents/chapter-8/chapter-8-1.html",
        },
      ],
    },
    {
      text: "9. 주소 지식그래프 구축 (TBD)",
      collapsed: true,
      items: [
        {
          text: "9.1 프로젝트 소개",
          link: "/contents/chapter-9/chapter-9-1.html",
        },
      ],
    },
    {
      text: "10. 주소 지식그래프 활용 (TBD)",
      collapsed: true,
      items: [
        {
          text: "10.1 프로젝트 소개",
          link: "/contents/chapter-10/chapter-10-1.html",
        },
      ],
    },
    {
      text: "부록",
      collapsed: true,
      items: [
        {
          text: "관련 자료 목록",
          link: "/contents/appendix/contents.html",
        },
      ],
    },
  ];
}

function getJSONLD(pageData) {
  return `{
  "@context":"http://schema.org",
  "@type":"TechArticle",
  "mainEntityOfPage" : {
    "@type" : "WebPage",
    "@id" : "http://hike.cau.ac.kr/docs/guide${pageData.frontmatter.url}"
  },
  "name":"${pageData.frontmatter.title}",
  "url" : "http://hike.cau.ac.kr/docs/guide${pageData.frontmatter.url}",
  "description":"${pageData.frontmatter.description}",
  "keywords" : ${pageData.frontmatter.keywords},
  "dateCreated" : "2024. 04. 01",
  "version":"1.0",
  "inLanguage":"ko",
  "technicalAudience" : "developer",
  "proficiencyLevel" : "beginner",
  "publisher" : "HIKE Lab.",
  "genre" : "how-to",
  "creator" : {
    "@type" : "Organization",
    "legalName" : "HIKE Lab.",
    "url" : "http://hike.cau.ac.kr",
    "parentOrganization" : {
      "@type" : "Organization",
      "legalName" : "Chung-Ang University",
      "url" : "http://www.cau.ac.kr",
      "location" : {
        "@type" : "Place",
        "address" : "84 Heukseok-ro, Dongjak-gu, Seoul, South Korea",
        "hasMap" : "https://www.google.co.kr/maps/place/%EC%A4%91%EC%95%99%EB%8C%80%ED%95%99%EA%B5%90+%EA%B5%90%EC%88%98%EC%97%B0%EA%B5%AC%EB%8F%99+%EB%B0%8F+%EC%B2%B4%EC%9C%A1%EA%B4%80(305%EA%B4%80)/data=!3m1!4b1!4m9!1m2!2m1!1z7KSR7JWZ64yA7ZWZ6rWQ!3m5!1s0x357ca1d896e73025:0xf6614ef31c11e9c1!8m2!3d37.5043687!4d126.9545641!16s%2Fg%2F11bxdd4hby?hl=ko&entry=ttu"
      }
    }
  },
  "author" : {
    "@type" : "Organization",
    "legalName" : "HIKE Lab.",
    "url" : "http://hike.cau.ac.kr",
    "parentOrganization" : {
      "@type" : "Organization",
      "legalName" : "Chung-Ang University",
      "url" : "http://www.cau.ac.kr",
      "location" : {
        "@type" : "Place",
        "address" : "84 Heukseok-ro, Dongjak-gu, Seoul, South Korea",
        "hasMap" : "https://www.google.co.kr/maps/place/%EC%A4%91%EC%95%99%EB%8C%80%ED%95%99%EA%B5%90+%EA%B5%90%EC%88%98%EC%97%B0%EA%B5%AC%EB%8F%99+%EB%B0%8F+%EC%B2%B4%EC%9C%A1%EA%B4%80(305%EA%B4%80)/data=!3m1!4b1!4m9!1m2!2m1!1z7KSR7JWZ64yA7ZWZ6rWQ!3m5!1s0x357ca1d896e73025:0xf6614ef31c11e9c1!8m2!3d37.5043687!4d126.9545641!16s%2Fg%2F11bxdd4hby?hl=ko&entry=ttu"
      }
    }
  },
  "dependencies" : "Python",
  "proficiencyLevel" : "beginner",
  "technicalAudience" : "developer, DBA, Web Developer"
}`;
}

function getOGTag(pageData) {
  pageData.frontmatter.head.push([
    "meta",
    { property: "og:title", content: pageData.frontmatter.title },
  ]);
  pageData.frontmatter.head.push([
    "meta",
    { property: "og:description", content: pageData.frontmatter.description },
  ]);
  pageData.frontmatter.head.push([
    "meta",
    { property: "og:url", content: pageData.frontmatter.url },
  ]);
  pageData.frontmatter.head.push([
    "meta",
    { property: "og:type", content: "website" },
  ]);
  pageData.frontmatter.head.push([
    "meta",
    { property: "og:site_name", content: "주소데이터활용가이드" },
  ]);
  pageData.frontmatter.head.push([
    "meta",
    { property: "og:locale", content: "ko_KR" },
  ]);
  const metaData = {
    "@context": "http://schema.org",
    "@type": "TechArticle",
    name: pageData.frontmatter.title,
    url: `http://hike.cau.ac.kr/docs/guide${pageData.frontmatter.url}`,
    description: pageData.frontmatter.description,
    keywords: pageData.frontmatter.keywords, // 배열을 쉼표로 구분된 문자열로 변환
    dateCreated: "2024-04-01", // 날짜 형식에 유의
    version: "1.0",
    inLanguage: "ko",
    technicalAudience: "developer, DBA, Web Developer",
    proficiencyLevel: "beginner",
    publisher: "HIKE Lab.",
    genre: "how-to",
    creator: "HIKE Lab.",
    author: "HIKE Lab.",
    dependencies: "Python", // 추가 정보에 따라 수정 가능
  };

  const metaTags = Object.entries(metaData).map(([key, value]) => {
    // 특수 문자를 이스케이프 처리하여 메타 태그 생성
    const content =
      typeof value === "string" ? value.replace(/"/g, "&quot;") : value;
    pageData.frontmatter.head.push([
      "meta",
      { property: key, content: content },
    ]);
  });
}
