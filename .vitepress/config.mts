import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  title: "编程笔记",
  description: "编程笔记",
  srcDir: "./docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      {
        text: "代码片段",
        link: "/code-snippet/java/spring-boot-application",
        // items: [{ text: "java", link: "/code-snippet/java/index" }],
      },
      { text: "想法", link: "/ideas" },
      { text: "待办", link: "/todos" },
      { text: "工具", link: "/tools" },
    ],
    sidebar: {
      "/code-snippet": [
        {
          text: "java",
          items: [
            {
              text: "springboot配置",
              link: "/code-snippet/java/spring-boot-application",
            },
          ],
        },
        {
          text: "script",
          items: [
            {
              text: "liunx常用命令",
              link: "/code-snippet/script/liunx",
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/hxj0x" }],
    editLink: {
      pattern: "https://github.com/hxj0x/program-docs/blob/main/docs/:path",
    },
  },
});
