---
title: "nginx 下基于浏览器语言实现域名重定向"
pubDate: '2021-08-30'
---
## 需求
我有个 MediaWiki 站点，它有多种语言版本，分别在 `zh.wiki.marioforever.net` 和 `en.wiki.marioforever.net`，host 为 `wiki.marioforever.net` 时，此前一直是 301 重定向到 `zh` 子域名。现在要求实现在中文环境下跳转到 `zh`，其他语言环境下跳转到 `en`。Web 服务器是 nginx。 

## 配置
nginx 不支持 `if` 嵌套和 `if` 条件的逻辑运算，所以传统的思路行不通。

```
# 判断是否在访问 wiki 子域名
if ($host = wiki.marioforever.net) {
	set $redirect 1;
}

# 判断浏览器语言，1 为中文
set $lang 0;
if ($http_accept_language ~* ^zh) {
	set $lang 1;
}

# 使用变量代替逻辑运算
set $sign "${redirect}${lang}";

if ($sign = 11) {
	return 302 $scheme://zh.wiki.marioforever.net$request_uri;
}
if ($sign = 10) {
	return 302 $scheme://en.wiki.marioforever.net$request_uri;
}
```