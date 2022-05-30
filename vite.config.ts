import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import Pages from "vite-plugin-pages"
import Components from "unplugin-vue-components/vite"
import Markdown from "vite-plugin-md"
// @ts-expect-error
import matter from "gray-matter"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import AutoImport from "unplugin-auto-import/vite"
import PurgeIcons from "vite-plugin-purge-icons"
import { VitePWA } from "vite-plugin-pwa"
import Prism from "markdown-it-prism"
import anchor from "markdown-it-anchor"
// import toc from "markdown-it-table-of-contents"
// @ts-expect-error
import attr from "markdown-it-link-attributes"
import { resolve } from "path"
import { readFileSync } from "fs"


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: [".."],
    },
  },
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },
  define: {
    "process.env": process.env,
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/antfu/vite-plugin-md
    Markdown({
      headEnabled: true,
      wrapperComponent: "post",
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      wrapperClasses: "article-body mb-5",
      markdownItSetup(md) {
        md.use(Prism)
        md.use(anchor, {
          permalink: true,
          permalinkBefore: true,
          permalinkSymbol: "#",
          permalinkAttrs: () => ({ "aria-hidden": true }),
        }),
          md.use(attr, {
            pattern: /^https?:/,
            attrs: {
              target: "_blank",
              rel: "noopener",
            },
          })
      },
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      pagesDir: [
        {
          dir: "src/pages",
          baseRoute: "",
        },
        {
          dir: "posts",
          baseRoute: "posts",
        },
      ],
      extensions: ["vue", "md"],
      extendRoute(route) {
        // https://github.com/antfu/antfu.me
        const path = resolve(__dirname, route.component.slice(1))
        const md = readFileSync(path, "utf-8")
        const { data } = matter(md)
        if (path.split(".").pop() == "md") {
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }
      },
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ["vue", "md"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          prefix: "",
        }),
      ],
      dts: true,
    }),
    // https://github.com/antfu/unplugin-icons
    Icons({
      compiler: "vue3",
    }),

    // https://github.com/windicss/vite-plugin-windicss
    WindiCSS(),

    // https://github.com/antfu/purge-icons/tree/main/packages/vite-plugin-purge-icons
    PurgeIcons(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt"],
      manifest: {
        // You can change this name into your own
        name: "zed8",
        short_name: "zed8",
        description: "zed8 blog with Vite",
        theme_color: "#347f76",
        icons: [
          {
            src: "hello.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "hello.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "hello.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ["vue", "@vueuse/core", "@vueuse/head", "vue-router"],
      dts: true,
    }),
  ],
  optimizeDeps: {
    include: ["vue", "vue-router", "@vueuse/core"],
  },
})
