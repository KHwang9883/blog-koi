---
title: "Jekyll 博客迁移到云服务器"
pubDate: '2019-12-18'
---

今天我把博客迁移到了阿里云轻量应用服务器香港机房，解决了国内访问速度慢的问题。

## 过程

我的博客是基于 [Hux Blog](https://github.com/Huxpro/huxpro.github.io) 魔改，Hux Blog 是基于 Jekyll，因此需要在我们的服务器上搭建 Jekyll 环境。

Jekyll 需要 Ruby 环境。我的服务器操作系统是 CentOS 7，其软件源的 Ruby 版本过低，因此需要通过其他手段安装新版本，例如 `rvm`。
```
gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
\curl -sSL https://get.rvm.io | bash -s stable
```
然后安装 Ruby（在此之前你需要运行 `source /etc/profile.d/rvm.sh`）：
```
rvm install 2.6.6
```
将会自动编译并安装 Ruby。

接下来安装 Jekyll。不需要按照官方教程说的那样安装 `bundler`，在我的环境下会报错。
```
gem install jekyll
```
现在需要创建一个博客。由于我已经有了现成的博客，因此只需将它上传到服务器的一个目录中，如 `~/blog`（即 `用户主目录/blog`）。

然后，你需要新建一个站点并绑定域名，我这里是 `/data/wwwroot/kevinh.wang`。

检查 `_config.yml`，有这样一段内容：
```
# Gems
# from PR#40, to support local preview for Jekyll 3.0
# make sure you have this gem installed
# `$ gem install jekyll-paginate`
plugins: [jekyll-paginate]
```
因此需要安装 `jekyll-paginate` 插件，按上面所述安装即可，如果不这样做，会报错。

之后就可以构建站点：
```
jekyll build -s ~/blog -d /data/wwwroot/kevinh.wang
```
在浏览器中打开你的域名，就可以访问刚才构建的静态博客了。
