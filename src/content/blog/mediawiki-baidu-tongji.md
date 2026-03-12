---
title: "在 MediaWiki 中添加百度统计"
pubDate: '2020-11-26'
---
其实只需几步就能搞定。

1. 在 [这个页面](https://www.mediawiki.org/wiki/Extension:HeadScript) 下载 `HeadScript` 插件，解压后置于 MediaWiki 的 `extensions/` 目录下。
2. 在 [百度统计](https://tongji.baidu.com/) 新增一个网站，`网站首页` 请填写打开域名后的完整 URL。添加网站成功后，点击 `获取代码`。
3. 打开你 MediaWiki 的 `LocalSettings.php` 配置文件，在文件末尾添加以下内容：
```php
wfLoadExtension( 'HeadScript' );
$wgHeadScriptCode = <<<'START_END_MARKER'
<script>获取到的百度统计代码</script>
START_END_MARKER;
```
4. 保存。如果你是在本地编辑的配置文件，将其上传到你的 MediaWiki 目录以覆盖原来的 `LocalSettings.php`。
5. 打开站点首页，查看网页源代码，以验证百度统计代码是否已安装。之后你可以使用百度统计的代码安装检查功能。如果显示「代码安装正确」就 OK，显示「代码未生效」属于正常情况，等待半小时后重试即可。

Google 分析、其他各友商的统计的步骤都差不多，无非就是第三步添加的代码不同。你也可以添加多个 js 代码。