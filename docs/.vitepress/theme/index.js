// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import "./style.css";
// giscus
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData();
    const route = useRoute();
    
    // Obtain configuration from: https://giscus.app/
    giscusTalk({
        repo: 'hike-lab/address-data-guide',
        repoId: 'R_kgDOLSwZ3g',
        category: 'General', // default: `General`
        categoryId: 'DIC_kwDOLSwZ3s4CeGKt',
        mapping: 'pathname', // default: `pathname`
        inputPosition: 'top', // default: `top`
        lang: 'ko', // default: `zh-CN`
        lightTheme: 'light', // default: `light`
        darkTheme: 'transparent_dark', // default: `transparent_dark`
        // ...
    }, {
        frontmatter, route
    },
        // Whether to activate the comment area on all pages.
        // The default is true, which means enabled, this parameter can be ignored;
        // If it is false, it means it is not enabled.
        // You can use `comment: true` preface to enable it separately on the page.
        true
    );
  },
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  
}};
