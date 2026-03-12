---
title: "关于应对网站服务器被攻击的一些记录"
pubDate: '2024-11-09'
---
我目前运营着 [Mario Forever 社区](https://www.marioforever.net/)，运行在腾讯云香港轻量应用服务器上。服务器配置不是很高，双核、2GB RAM，由于算是个小站，所以我觉得足够了。但从去年开始，经常间歇性出现社区无法访问、报 502 的情况。502 说明服务器端出现问题，由于论坛是 PHP 程序，显然是 PHP 出了问题。

那么，是什么原因会导致报 502 呢？我查看了当前负载，吓了我一跳——

<img src="/img/in-post/xprober-htop.webp" />

我发现非常多 PHP 子进程吃满了 CPU。尝试通过 nginx 访问日志分析是不是有人在攻击，然后发现一个叫 `thesis-research-bot` 的爬虫在以每分钟上百条的速度访问论坛页面，于是我把它屏蔽了。但过了几天，又出现了高负载的异常情况。

我服务器运行着 MF 社区 (Discuz)、[MF Wiki](https://zh.wiki.marioforever.net/) (MediaWiki) 和 SMBX 社区 (Flarum) 这几个 PHP 程序，我发现 Wiki 的 nginx 访问日志大小比其他站都大，我就试图从 MediaWiki 本身找原因。我注意到，在日志中有许多搜索引擎爬虫在抓取一些很杂乱的、不是内容页面的 url，我参照 [MediaWiki 官网的说明](https://www.mediawiki.org/wiki/Manual:Robots.txt/zh) 给 `robots.txt` 添加了以下内容：

```
User-agent: *
Disallow: /w/index.php?
```

注意这仅适用于配置了 [短网址](https://www.mediawiki.org/wiki/Special:MyLanguage/Manual:Short_URL) 的 MediaWiki 站点。效果立竿见影，每天的日志文件大小从之前的 40MB 减到了不到 10MB。

在今年 1 月底，Wiki 又出现了访问速度慢的情况。这次并没有 502，只是网站速度慢。我又看了下日志，看到一个 `47.76.35.19` 的 IP 地址在以差不多每秒一次的速度访问 Wiki，导致服务器的负载保持在 5 左右，虽然不像之前那么高，但也不是个正常情况，我就把这 IP 屏蔽了。我还发现 [其他人的网站也被这 IP 攻击过](https://www.gongyesheji.org/?p=2588)。

<img src="/img/in-post/47.76.35.19.png" />

消停了没几天，高负载的异常又来了。光看日志也始终找不到什么明显的不对，因为并不像之前那样固定的 IP 或者固定的 user-agent，它没有一个固定的特征，我只发现有些 ua 的浏览器和操作系统版本非常老旧。

<img src="/img/in-post/log.png" />

今年 4 月初，我给服务器重装了 Debian 12，同时尝试用包管理器部署 LEMP，参考了 [烧饼博客](https://u.sb/debian-install-nginx-php-mysql/) 的教程。这里多提几句，服务器之前运行的是 Debian 11，使用 OneinStack 一键包安装的 LEMP。2023 年，[OneinStack 爆出“投毒”事件](https://www.secrss.com/articles/59526)，我了解到投毒事件是在 2023 年 11 月，而投毒行为发生的时间则在几个月前，这期间我还编译升级过部分软件。这令我一度怀疑负载高与投毒相关，是不是服务器被植入了什么木马，后来排除了这种可能。但运行环境必须要换了，这也导致我重装了系统。

系统重装完后，过了一段时间，又出现了间歇性高负载的情况。这时我开始从 PHP 的配置文件着手，首先将子进程相关的配置调低：

```
pm = dynamic
pm.max_children = 25
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 15
pm.max_requests = 1000
```

调完之后，还是会有很多 PHP 进程占用 CPU 导致负载高的情况，但负载最高也只到 30 左右，不会出现调整之前高达 50 的离谱数值了。

一次偶然的机会，我把高负载时的 htop 截图扔给了 ChatGPT，ChatGPT 指出 MariaDB 也占用了不少服务器资源。我便开始在数据库上找原因，我在 MariaDB 控制台输入 `SHOW PROCESSLIST;`，输出结果令我吃惊——

```
MariaDB [(none)]> SHOW PROCESSLIST;
+--------+----------------------+-----------+--------------+---------+------+------------------+------------------+----------+
| Id     | User                 | Host      | db           | Command | Time | State            | Info             | Progress |
+--------+----------------------+-----------+--------------+---------+------+------------------+------------------+----------+
| 106578 | wiki                 | localhost | wikidb_mf_zh | Sleep   |   13 |                  | NULL             |    0.000 |
| 106579 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106584 | root                 | localhost | NULL         | Query   |    0 | starting         | SHOW PROCESSLIST |    0.000 |
| 106619 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106620 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    4 |                  | NULL             |    0.000 |
| 106624 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106626 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    6 |                  | NULL             |    0.000 |
| 106628 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    3 |                  | NULL             |    0.000 |
| 106629 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    4 |                  | NULL             |    0.000 |
| 106630 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106631 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    3 |                  | NULL             |    0.000 |
| 106632 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106633 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    3 |                  | NULL             |    0.000 |
| 106634 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106635 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106636 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106637 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    3 |                  | NULL             |    0.000 |
| 106638 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    2 |                  | NULL             |    0.000 |
| 106639 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106640 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106641 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    2 |                  | NULL             |    0.000 |
| 106643 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    2 |                  | NULL             |    0.000 |
| 106644 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106645 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106646 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106647 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106648 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    2 |                  | NULL             |    0.000 |
| 106650 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106651 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106652 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106653 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106654 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    1 |                  | NULL             |    0.000 |
| 106655 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    1 |                  | NULL             |    0.000 |
| 106656 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106657 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106658 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106659 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106660 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106661 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106662 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106663 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106664 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106665 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106666 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106667 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106668 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106669 | wiki                 | localhost | wikidb_mf_zh | Sleep   |    0 |                  | NULL             |    0.000 |
| 106670 | unauthenticated user | localhost | NULL         | Connect |    0 | Reading from net | NULL             |    0.000 |
+--------+----------------------+-----------+--------------+---------+------+------------------+------------------+----------+
48 rows in set (0.002 sec)
```

`wikidb_mf_zh`（中文 MF Wiki）数据库有很多个进程处于 Sleep，这可能就是罪魁祸首了。ChatGPT 建议我把超时时间改为 300 秒，但我担心会有副作用，就没改。ChatGPT 还提醒我 MariaDB 的慢查询日志没有打开，遂打开它，希望在下次负载高时能从日志中得到有用的信息。结果略有点失望，因为高负载时慢日志根本没有更新。

这样下去也不是办法，我干脆使出“负载高就重启 PHP”这一招，检测到负载超过 15，就自动重启 PHP-FPM，并进行日志记录。因为经过实测，重启 MariaDB 没用，但重启 PHP-FPM 却能让负载立马降下来。于是就写了个脚本，cron 每 3 分钟执行一次。这样做虽然治标不治本，但却可以避免高负载导致的长时间 downtime。

我还做了一些性能优化，包括升级到 PHP 8.2 并开启 OPCache JIT、给 Discuz 和 MediaWiki 用上像 Redis、Memcached 这样的缓存优化、打开 MediaWiki 的 [文件缓存](https://www.mediawiki.org/wiki/Manual:File_cache/zh)、打开 Wiki 的 [图片懒加载](https://www.mediawiki.org/wiki/Special:MyLanguage/Manual:$wgNativeImageLazyLoading) 等。虽然未能缓解高负载，但 Wiki 的响应速度有了不小的提升。

间歇性高负载仍然在持续，我的邮箱每天可以收到数封 [UptimeRobot](https://uptimerobot.com/) 发来的提醒邮件。我重新从 nginx 日志着手，发现曾经被忽视的那些老旧操作系统和浏览器的 ua 很可能就是元凶了。我随便搜了几个相关 IP 地址，归属地都是国内，并且跟社区任何吧友所在地都对不上。我首先尝试 nginx 层面进行限流，在 `nginx.conf` 的 `http` 块中添加两行：

```
limit_req_zone $binary_remote_addr zone=allips:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=perip:10m;
```

并在 wiki 站点配置文件添加：

```
location / {
    limit_conn perip 6;
    limit_req zone=allips burst=5 nodelay;
}
```

（因为某些原因，我是添加到了 MediaWiki rewrite 相关配置文件中的，因此仅供参考）

同时还要配合 fail2ban，这样超限的 IP 就会被暂时封禁。在 `/etc/fail2ban/filter.d/` 目录新建名为 `nginx-http-limit-request.conf` 的文件：

```
#fail2Ban configuration file
#
# supports: ngx_http_limit_req_module module
 
[Definition]
 
failregex = limiting requests, excess:.* by zone.*client: <HOST>
 
# Option: ignoreregex
# Notes.: regex to ignore. If this regex matches, the line is ignored.
# Values: TEXT
#
ignoreregex =
```

之后在 `/etc/fail2ban/jail.local` 中添加以下内容：

```
[nginx-http-limit-request]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
findtime = 120
bantime = 600
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
```

其中 `logpath` 路径应为 nginx 错误日志的实际路径。添加完成后记得重启 nginx 和 fail2ban 服务。

结果接下来几天，并没有任何 IP 因为触发限流而被封禁，间歇性高负载的情况也依然在持续。这时的我已经彻底意识到 Wiki 就是被人 CC 攻击了，我立刻在 wiki 的 nginx 配置中加了一段，把那些有异常的 ua 全给 403 拦截掉：

```
if ($http_user_agent ~* "(Firefox/([0-6][0-9]|[0-9])\.|Chrome/([0-3][0-9]|[0-9])\.|MSIE [0-7]\.|Presto/2|Windows 95|Windows 98|Windows NT 4.0|Windows NT 5.0|Windows NT 5.2|Android [0-3]\.[0-9]*|iPhone OS [34]_|iPad OS 4_|Linux i686|PPC Mac OS X|Intel Mac OS X 10_[0-7]_)") {
	return 403;
}
```

被拦截的包括老版本 Firefox/Chrome/IE/Opera、Win95/98/2000 和 64 位 XP（我想国内肯定没人用这类早该淘汰的操作系统访问 Wiki 吧）、Android 1~3、iOS 3/4（nginx 日志中这两个版本的 iOS 出现频率特别高）、32 位 Linux、PowerPC 版 OS X 及老版本的 Intel OS X。虽然有小概率误伤，但这个措施肯定是有效的。其实这类 ua 当中还有一种特征，就是浏览器语言很多都是小语种，而不是中英文，但我没有按语言进行屏蔽。

同时我还采取了另一个措施，就是利用 [Lockdown](https://www.mediawiki.org/wiki/Extension:Lockdown/zh) 插件，给绝大部分 MediaWiki 特殊页面设置权限，游客无法访问，这样做也能减少许多异常访问。

在我做了这一系列举措之后，这几天 UptimeRobot 没有再给我发邮件，之前的 PHP-FPM 自动重启脚本也没再记录重启的操作。但我不能提前开香槟，还是得继续观察一段时间。

可能有同学会问，为什么不升级服务器配置？我只能说，想升也升不了，我当前的腾讯云香港轻量应用服务器是老套餐，[已经下架了](https://cloud.tencent.com/document/product/1207/89233)，新套餐又比较贵，况且升配置事实上还是治标不治本啊。

## （2024-11-11 更新）
今天凌晨，那个 PHP-FPM 的重启脚本记录了两次重启操作记录，但 UptimeRobot 没有监测到异常，说明这次的高负载影响并不算大。但我还是在日志中发现了一些漏网之鱼，所以我更新了 nginx 配置：

```
if ($http_user_agent ~* "(Firefox/([0-6][0-9]|[0-9])\.|Chrome/([0-3][0-9]|[0-9])\.|MSIE [0-9]\.|Presto/2|Windows 95|Windows 98|Windows NT 4.0|Windows NT 5.0|Windows NT 5.2|Windows CE|Android [0-3]\.[0-9]*|Android 4\.[0-3]*|iPhone OS [1-4]_|iPad OS [1-4]_|Linux i686|PPC Mac OS X|Intel Mac OS X 10_[0-7]_)") {
	return 403;
}
```
其中新增拦截了 IE 8-9、Windows CE、Android 4.0-4.3 和某些没有覆盖到的古董 iOS 版本。有人建议我把 IE 全部 ban 掉，虽然目前 IE 早就淘汰了，但我个人觉得还是过于激进了，况且日志中也没几个 IE 10-11 的记录。

如果之后又监测到 PHP-FPM 重启，我会继续调整。

## （2024-12-30 更新）
今天中午 PHP-FPM 重启了一次，查看日志发现当时有大量 Chrome 60-79 的访问请求，故调整了屏蔽范围。这次调整可能会误伤某些采用老旧内核的国产浏览器，但面对攻击，我别无选择。

## （2025-08-31 更新）
不久前我了解到 [Anubis](https://anubis.techaro.lol/) 的存在，其可以拦截大部分爬虫请求，应对 CC 攻击也比较有效。不过 CC 攻击早已平息，我后续有机会的话可以尝试在 Wiki 上实装它。（**2025-10-25 更新：已经实装**）