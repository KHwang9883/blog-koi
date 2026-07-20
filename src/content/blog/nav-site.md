---
title: "（更新：站点重构）Kevin Huang 的导航站上线了"
pubDate: '2026-06-16'
---

Kevin Huang 的导航站收录了我本人常用的一些软件和游戏的官方地址，以及一些我收藏或推荐的网址链接。网址：https://nav.kevinh.wang/

导航站原本是基于 [hexo-theme-webstack](https://github.com/HCLonely/hexo-theme-webstack/)，运行了五年多。2026-06-16，我使用 [Nuxt.js](https://nuxt.com/) 框架 + [Tailwind CSS](https://tailwindcss.com/) 重构了整个站点，并新增了复制 winget 安装命令的按钮。导航站重构后，我将有更多的自由度来为导航站添加新功能。

<img src="/img/in-post/nav-site.webp" />

2026-07-21，由于 Cloudflare 部署问题，我重新让 AI 用 [Astro](https://astro.build/) 重构了导航站，本次重构保留了 Nuxt 版的界面样式和功能。

导航站灵感/部分应用图标来源于 [狼导 - 音速装机](https://sonic.volf.club/)。

## 发现有所缺失？

目前导航站已基本完善，如有相关问题请 [提交 Issue](https://github.com/KHwang9883/nav.kevinh.wang/issues)。

如你在导航站未找到某款软件，可能是因为：

- 站长不知道/没有使用过该软件；
- 站长使用过该软件，但由于某些原因，软件已经被卸载了；
- 出于某些原因，站长不推荐/不认可该软件；
- 软件已停止维护或不再可用；
- ……