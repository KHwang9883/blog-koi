---
title: "副屏、串流及远控软件的使用体验小结（2024 更新）"
pubDate: '2024-03-23'
---
2022 年 4 月，我买了一部联想小新 Pad Plus。它拥有 11 英寸的大屏，比较适合作为 PC 副屏使用。在将平板作为副屏使用的过程中，我尝试了数款软件，它们各自都有不少优缺点。

## Spacedesk
[Spacedesk](https://www.spacedesk.net) 是一款局域网内实现无线显示的软件，连接平板后就能将其作为 PC 的第二显示器，这属于真正意义上的副屏软件。它支持无线连接，延迟尚可，但是距离电脑稍微远一些，就会非常卡，不能正常使用。Spacedesk 也支持 Android 设备的有线连接，需要借助 adb 输入指令 `adb reverse tcp:28252 tcp:28252`，然后在 Android 端关闭局域网探测，手动添加输入 `127.0.0.1` 即可。得益于小新 Pad Plus 的 USB 3.2 Gen 1 接口，有线传输就稳定许多了，唯一的限制就是平板只能放在电脑旁边。缺点方面，Spacedesk 除了远距离无线连接的流畅度不佳以外，还有键鼠触控板支持不完美（指连接平板的键鼠），不支持鼠标右击，以及它偶尔会抽风导致无法正常连接和断连。另外最新的免费版 Spacedesk 会在 Windows 不停弹通知（只要一动平板屏幕），嫌烦的话可以手动在 Windows 设置中关闭 Spacedesk 的通知权限。

## Parsec
[Parsec](https://parsec.app/) 是真正意义上的「远程桌面」（虽然局域网环境也能用）。Parsec 需要 PC 端和平板端都登录其账号，通过 P2P 传输，所以它的体验要比传统基于服务器中转的远程桌面软件好不少。但是当时移动运营商那边把 Parsec 屏蔽了，我便暂时没有体验，后来 Parsec 又能正常用了。教程这里就不写了，网上可以搜到讲得很详细的视频。如果连接平板的键鼠工作不正常，可以检查一下 Parsec 系统服务是否被禁用，启用服务后问题解决。Parsec 的缺点是对 Android 的触屏和触控板适配不完善。另外 [极客湾利用 Hyper-V 配合 Parsec 搭建了家庭云游戏服务器](https://www.bilibili.com/video/BV1Ad4y1S7Aw)，但是我电脑比较弱鸡，Ryzen 5 3500X CPU *只有*六核六线程，RAM *只有* 16GB，没法像他们那样同时开多个虚拟机，所以云游戏服务器这种构想还是以后再说吧。

## ToDesk
2024 年 3 月，我发现了 [ToDesk](https://www.todesk.com/) 这款软件，于是便下载试用了一下。这软件分免费的个人版和收费的专业版、游戏版和性能版，和 Parsec 一样是通过 P2P 传输。个人版只支持 1080P@30fps，而实际显示效果在我平板上明显比 Parsec 差一挡（界面灰蒙蒙的）。远程控制需要输入密码或在被控端确认，不如 Parsec 方便；结束远控时还会提示是否（给被控端）锁屏，我觉得这个没啥必要。鼠标光标在我这平板上显得大了些。这软件做了一些比较不错的功能，并且不止 Windows PC 可以被控，还支持 macOS、iOS 和 Android 等平台（Android 被控需要收费）。值得一提的是，ToDesk 手机端支持 Wake-on-LAN，可以配合另一款比较牛逼的远控软件 [HiPC](https://hipc.cn/) 使用，就不用购买他家的开机卡了。缺点除了画质略差，还有我平板键盘的触控板工作不正常（貌似 Android 端的远控 app 不少都没做触控板支持）。以及这段文字我是用平板上的 ToDesk 远控 PC 码完的。

（**2024-07-12 更新**）ToDesk 被我卸载了，因为体验不如 Parsec。而它的 Wake-On-LAN 功能我用 [Google Play 上的一款免费 app](https://play.google.com/store/apps/details?id=co.uk.mrwebb.wakeonlan) 替代了，所以就不需要 ToDesk 了。

## Moonlight
[Moonlight](https://moonlight-stream.org/) 是 GeForce Experience 的 NVIDIA Shield 串流的第三方开源客户端，可以在任意 Moonlight 支持的设备上使用。在使用 Moonlight 之前，需要进入 GeForce Experience 的 SHIELD 设置，打开 GAMESTREAM。接着在 Moonlight 里选择 PC，随后平板屏幕上会出现一个四位数验证码，在 PC 上输入这个验证码并确认，就能连上了。虽然 Moonlight 连接时必须选择一个特定游戏，但其实可以选择 Steam，然后将其最小化，这样做就是一个标准的局域网远程桌面。它的优点是可以直接使用连接了平板的键鼠，相当于一部完整的「云电脑」，平板键盘的触控板也是正常的；缺点是远控需要折腾内网穿透。

（更新：现在有了 [Sunshine](https://github.com/LizardByte/Sunshine) 这一服务端，支持非 N 卡，并且可以直接选择桌面（Desktop），体验良好，解决了 Moonlight+GeForce Experience 的诸多痛点。要想把平板作为副屏，最好用第三方的支持虚拟显示器的 Sunshine 修改版，我目前用的是 [这个](https://github.com/qiin2333/Sunshine-Foundation)。以及我才发现 Moonlight 居然也支持 Wake-on-LAN，好评。）

## 其他
我以前也用过不少其他远程桌面软件，例如 TeamViewer、Windows 自带的 RDP 远程桌面。前者没有对局域网环境做优化，而 RDP 我刚试了下没连上，结合以前的使用体验，最终放弃了。

## 幻影米布
注意，本文不是软文推广。

其实我一开始不想提这个软件，因为我在搜有关 Parsec 在移动宽带下不能用的问题的时候看到了不少关于这个软件的传闻，就对其嗤之以鼻。不过抱着好奇心，我就试用了一下。幻影米布和 Parsec 一样，使用 P2P 传输。连接好以后，它会将电脑屏幕镜像到平板，也同样支持键鼠操作。在平板屏幕上会固定显示几个虚拟按键，无法关闭，对我这种强迫症患者不太友好。流畅度方面倒是不错，但分辨率只有几个固定挡位（联想小新 Pad 的屏幕是 15:9，所以默认的那几个分辨率都不能填满屏幕）。用下来感觉这软件离 Parsec 有不小差距，我认为还是别老碰瓷为好。
