---
title: "记一次中途放弃的 Hexo 切换"
pubDate: '2020-06-18'
---

## 20201003 更新

我好傻 X 啊，不仔细阅读文档就这样「盲操作」，不出问题才怪。关于 RSS Feed，其实是不知道哪个主题的配置文件里面 `content_limit` 的锅。

于是最终我真的切换到 Hexo，使用的是 [NexT](https://github.com/next-theme/hexo-theme-next/) 主题。

## 原文

其实从 Jekyll 切换到 Hexo 不是很难，所有 markdown 文件连动都不用动就能直接拿来用。Hexo 相比 Jekyll 具有一些优势，但最终我放弃将博客切换到 Hexo 的计划。

现在这个博客使用的是魔改过的 [Hux Blog](https://github.com/Huxpro/huxpro.github.io) 主题，去掉了 Tag、首页友链和几个对我而言没用的功能。Hexo 这边也有基于 Hux Blog 的主题，但我不想再魔改第二遍了，正好这次切换也顺便换个主题。

安装 Hexo 的过程十分顺利，这里略过。

许多 Hexo 主题都支持 [Gitalk](https://github.com/gitalk/gitalk) 和 [Valine](https://valine.js.org/hexo.html)，省去了一个配置步骤。我比较喜欢简洁的风格，分别试用了 [iLiKE](https://github.com/CaiChenghan/iLiKE)、[maupassant](https://github.com/tufu9441/maupassant-hexo) 和 [xoxo-plus](https://github.com/fooying/hexo-theme-xoxo-plus)。

我遇到的第一个问题是某些指定的页面没有生成，必须手动在 Hexo 目录下创建。这个问题暂且跳过，第二个问题又来了，Hexo 生成的 RSS Feed ~~不支持全文，~~个别文章的 HTML 代码只包含了一半，影响 RSS 阅读器的阅读体验。虽然 RSS 现在用的人没那么多，但作为一个强迫症患者，表示不是很喜欢把字符上限修改到像 `999999999` 这样大数值的解决方案。之后在试用 `xoxo-plus` 这个主题时，发现首页文章摘要完全不显示，这是一个完全不能接受的 Bug。同时，由于我不喜欢加 Tag，某些主题文章页面本应出现标签的两个斜杠中间是空的，强迫症患者表示更无法接受。

以上小问题消磨了我的耐心，导致我放弃了切换。由于身体原因，我不能每天熬夜这么折腾，而我的性格是事情一次不做完不罢休，这就有了冲突。最终，在折腾党和能用党之间我选择了后者。
