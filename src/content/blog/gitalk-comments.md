---
title: "为 Hux Blog 配置 Gitalk 评论框"
pubDate: '2019-06-02'
---

今天我为本站添加了基于 GitHub Issues 的 [Gitalk](https://github.com/gitalk/gitalk/) 评论系统。配置过程并不复杂，比较适合 GitHub Pages 站点。

至此，本站初期的建设就告一段落了。

## 配置

**以下内容仅针对 [Hux Blog](https://github.com/Huxpro/huxpro.github.io)。**

首先 [申请一个 OAuth Application](https://github.com/settings/applications/new)

`Authorization callback URL` 填写你博客的地址，如 `https://kevinh.wang`。之后你会得到一个 `Cilent ID` 和 `Client Secret`。

然后在 `_config.yml` 添加以下内容：
```yaml
# Gitalk
gitalk:
  enable: true
  repo: khwang9883.github.io		# Issues 所在的仓库
  owner: KHwang9883			# 仓库所有者
  admin: KHwang9883			# 对仓库有写权限的用户
  clientID: 'cilentID'			# GitHub Application Client ID
  clientSecret: 'cilentSecret'		# GitHub Application Client Secret
```
然后在需要的页面添加代码，我在 `_layouts/post.html` 的 `Post Container` 中添加了一个容器：
```html
{% if site.gitalk %}
<!-- Gitalk 评论 start -->
<div id="gitalk-container"></div>
<!-- Gitalk 评论 end -->
{% endif %}
```
并添加了一段 JavaScript 代码：
```html
<!-- Gitalk 评论 start  -->
{% if site.gitalk.enable %}
<!-- Link Gitalk 的支持文件  -->
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>

    <script type="text/javascript">
    var gitalk = new Gitalk({

    // gitalk的主要参数
        clientID: '{{ site.gitalk.clientID }}',
        clientSecret: '{{ site.gitalk.clientSecret }}',
        repo: '{{ site.gitalk.repo }}',
        owner: '{{ site.gitalk.owner }}',
        admin: ['{{ site.gitalk.admin }}'],
        id: '{{ page.url }}',
        distractionFreeMode: false  // Facebook-like distraction free mode
    });
    gitalk.render('gitalk-container');
</script>
{% endif %}
<!-- Gitalk end -->
```
如果需要，也可以在 `about.html` `friends.html` 添加这两段代码。

之后授权登录 GitHub，并逐一进入各页面，Gitalk 就配置完成了。