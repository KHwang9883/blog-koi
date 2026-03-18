---
title: "在 Windows 下为 iOS 设备更新 iOS 13 Beta 版"
pubDate: '2019-06-05'
---

> 最新版本的 iTunes 已经支持 iOS 13 的升级。

> 部分国产「苹果助手」虽然也能进行刷机，但对于那些对国产软件没啥好感的用户，可以尝试此法。

## 20190618 更新

iOS 13 Developer Beta 2 发布，Apple 这次提供了描述文件，能 OTA 的就尽量不用此方法折腾了。

---

昨天凌晨，Apple 发布了 iOS 13 和全新的 iPadOS。发布会结束后，固件包也随即放出。但这次 Apple 没有提供 iOS 13 Beta 的描述文件，需要使用 iTunes 刷机。

经过测试，Windows 版 iTunes 无法直接刷入 iOS 13 Beta，需要一台 Mac，升级 macOS 10.15 Beta 或安装 XCode 11 Beta 后再进行刷机。因此这次的更新方式对 Windows 用户不是很友好。

后来我看到有网友分享了在 [Windows 下更新 iOS 13 的方法](https://bbs.feng.com/forum.php?mod=viewthread&tid=12299118&extra=&fid=670&page=1)，亲测 iPad (2018) 使用此方法成功刷入 iPadOS 13 Beta。

## 准备

- 首先安装 **Apple 官网版 [iTunes](https://www.apple.com/cn/itunes/download/)** （不要用 Microsoft Store 版）
- 此方法不会清除设备上的数据，但**刷机前一定要先备份**，以防万一

## 步骤

1. 打包下载 [此 repo](https://github.com/Devjam81/libimobile2019) 的全部内容（[直链](https://github.com/Devjam81/libimobile2019/archive/master.zip)），解压
2. 下载对应设备的 ipsw 固件包，并将其放在刚才的位置
3. 将设备重启到 [恢复模式](https://support.apple.com/zh-cn/HT201263)，连接电脑
4. 以管理员方式打开命令提示符（cmd），定位到刚才的位置，例如 `D:\libimobile2019`，我们先输入 `D:` 回车，输入 `cd` 空格并将步骤一中解压的文件夹拖入 cmd 窗口后输入回车
5. 输入 `idevicerestore -d` 空格，将下载的固件包拖入至窗口，回车
6. 等待十分钟左右，直到命令行提示 `Status: Restore Finished`，现在可以断开设备与电脑的连接
7. 设备重启，提示恢复数据，输入两次密码（如果有），确认即可
8. 继续等待，设备再次重启，进入系统

## 故障排除

参照 [此文](https://allthings.how/how-to-install-ios-13-from-windows-10-command-line-not-itunes/) 第七步的步骤操作。

最后放几张我的 iPad 更新 iPadOS 13 后的截图。

<img src="/img/in-post/IMG_0023.webp" />
<img src="/img/in-post/IMG_0024.webp" />
<img src="/img/in-post/IMG_0020.webp" />
<img src="/img/in-post/IMG_0021.webp" />