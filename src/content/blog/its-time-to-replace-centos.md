---
title: "是时候不用 CentOS 了"
pubDate: '2020-12-15'
---

> 本文仅针对个人用途 VPS/服务器，不适用于有一定业务量规模的企业、机构。

CentOS 官方发文称 CentOS Stream 才是 CentOS 项目的未来，在接下来的一年里，将逐步把开发工作的重心从 CentOS Linux 往 CentOS Stream 转移。而 CentOS 8 将于 2021-12-31 EOL。

那还玩个卵？不得不说，CentOS 国内用得比较多，我最初建站时阿里云默认选中的就是 CentOS 7。其实我事先搜过各种发行版对比，众说纷纭，但消息出来之后，应该来说心里有底了。

于是我便再次切换操作系统（上一次是 CentOS 7 到 8），换成了 Debian。

其实主流发行版基本都靠谱，但经过这波操作之后，反正 CentOS 是用不得了，还是老老实实用 Debian 系吧。

## 碎碎念

一开始我真的什么都不懂，于是用了 [OneinStack](https://oneinstack.com/) 一键包，服务器软件不选 nginx，偏偏听信不知道是谁写的教程选了 Apache httpd；Discuz 和 MediaWiki 所需的 PHP 扩展一个都没装（存疑，我忘了当时的细节，反正论坛最终跑起来了），因此踩了不少坑；不会使用 `service xxx reload` 这种命令，要么直接重启服务器（还是从服务器控制台重启的，其实只要 `reboot` 就行），要么 `service xxx restart`（并不优雅）；网站搭了半年多后才意识到备份的重要性，一年后才学会将网站数据备份到外部空间例如对象存储；直到上个月我才彻底不用密码登录 SSH……虽然做的时候自我感觉良好但其实我是真的菜。（于是我买了个树莓派，以后用它来练练手什么的

不过经过一年多时间，我的姿势水平确实有了明显提升，我曾[这样描述自己](https://kevinh.wang/post/1st-anniversary/)——比不过大佬，但比小白强 N 个级别。

## 参考

[CentOS 已死 - OSCHINA](https://www.oschina.net/news/122962/future-is-centos-stream)

[[CentOS-announce] CentOS Project shifts focus to CentOS Stream](https://lists.centos.org/pipermail/centos-announce/2020-December/048208.html)