---
title: "切换到 Linux 一周使用体验小记"
pubDate: '2026-11-08'
---

笔者的主力 PC 操作系统一直都是最新版的 Windows。Win 11 相比以往版本，更容易出现拖慢的情况，因为它”太重“了，而且这跟我安装的第三方软件没啥关系。在此之前笔者一直想安装 Linux 作为主力系统试用一段时间，但在 2025 年以前，条件还尚不具备，因为确实存在一些 Windows 限定的场景。

现在是 2026，不但 GNU/Linux 生态取得了长足进步，而且由于我的一个 Clickteam Fusion 2.5 项目也已经完结，又少了一大切换系统的障碍。几天前 Win 11 更新又把我设置的旧版右键菜单改回不够齐全的新版菜单。另外前不久不是出了 Adobe 全家桶的 [LLM 复刻版](https://getartcraft.com/apps) 吗，看起来切换的时机已到。

## 发行版的选择

这点还是比较纠结的。deb 系发行版易上手，有 Ubuntu、Mint、deepin 这种开箱即用的发行版，但它们的问题是，Ubuntu 的 snap 不太受欢迎，Mint 虽然适合 Windows 迁移用户，但底层有些旧，deepin 小问题比较多并且笔者也不太喜欢”非官方“打包的第三方应用。

Arch 系发行版有 Arch 本尊、CachyOS、EndeavourOS、Manjaro 等。Manjaro 第一个被排除，因为和 AUR 兼容性的问题；有了 CachyOS 和 EndeavourOS，Arch 原版也不再是我考虑的范围，毕竟前两者开箱即用，预配置了不少东西。CachyOS 和 EndeavourOS 笔者都曾实机安装过，后者比较偏原生 Arch 一些，而前者则针对比较新的硬件重新编译了大部分软件包。于是我就选择了 CachyOS。

我以前安装 Linux 要么是从现有 Windows 磁盘划分出一个小分区安装试用，要么是在一个副硬盘全盘安装。但是这次我将我装有 Windows 的 1TB SSD 的系统迁移到一块 2TB SSD，并在这块 1TB SSD 上全盘安装 CachyOS。我将其定义为主硬盘是因为它插在 CPU 直连的满速 PCIe 接口，而那块 2TB SSD 则是插在比较慢的接口。

桌面环境肯定选择 KDE Plasma，自由度高，对 Windows 用户也友好。GNOME、Cosmic 这种更适合 macOS 用户，而像 Hyprland 这种窗口管理器个人用不太来。

## 安装常用软件

浏览器（Firefox）、编辑器（VS Codium）、即时通讯（QQ、Discord 等）、游戏启动器（Steam、Minecraft 等），以及前面提到的 Adobe 全家桶的复刻版都有原生 GNU/Linux 版。数据迁移也比想象中简单：Firefox 数据本身支持云同步，但我还是从 Windows 版导出了一份 200 多 MB 的完整备份并导入 Linux 版；VS Codium 不支持微软云同步，我便让 OpenCode 把我 Windows 版 VS Code 数据迁到 VS Codium（LLM 在这方面确实好用）。其他软件数据没那么重要，就没特意迁移。

Arch 系安装软件首选 Flatpak，其次是 AUR。大多数国产软件都通过 AUR 安装，但有一部分更新不太及时（例如 Trae、Motrix）。另外 AUR 也比较挑网络环境。我还是觉得 AUR 不太合我口味，所以之后又更换了发行版（见后文）。

中文输入法选择的是 fcitx5 + Rime（雾凇拼音），更符合微软拼音的使用习惯；对于 KDE Plasma 本身我也做了一些设置改动，毕竟默认配置还是和 Windows 习惯有一些差别。

## 更换发行版

Arch 系虽然软件包新，但第三方软件官方却极少为 Arch 打包，特别依赖 Flatpak 和 AUR；而 deb 系除了 Debian sid/testing 又没有一个底层较新的发行版。于是我又看了下 Fedora。

在这次以前，笔者对 rpm 系发行版有着不小的刻板印象，以至于上次用这类发行版还是六年前笔者 VPS 上的 CentOS 8。实机安装后，我对它的偏见很快消除了。于是我就打算整体重装，正好 11 月 4 日 Fedora 45 正式发布了。

在重装前我让 OpenCode 把 KDE Plasma、fcitx5 和 VS Codium 的配置打包备份至移动硬盘，想着重装之后能很快恢复，不需要我从头再来。也正如我所愿，装好后 OpenCode 出色地恢复了 Plasma 等的配置，省去了不少繁琐步骤。不过，这么做有一个前提：底层版本要足够新，假如我的迁移目标是 Kubuntu LTS 这种就不行了。

Fedora 默认不附带 NVIDIA 驱动和 H.264/HEVC 编解码，需要添加第三方源并自行安装，这是它为数不多不够“开箱即用”的地方，而除 Debian 外的其他主流发行版则应配尽配。

另外，不要为 Fedora 自带源配置镜像源，很容易导致检查更新失败。Fedora 默认会自动寻找更快的镜像源的。

## Fedora 满足我的使用需求了吗？

首先，可以直接安装的软件变多了，绝大多数提供安装包的第三方软件都提供了 rpm 格式。即使像 Workbuddy 这种官网没有提供安装包的软件，[其实也有 rpm 版本](https://github.com/ziyue67/workbuddy-linux)。Steam 没有 rpm 安装包，但可以通过第三方源安装（Flatpak 版不太推荐）。

网易云音乐目前已经下线了老的 Linux 版，并且最近也在封杀各种第三方播放器。不过，它提供了一个高度可用的 [网页版](https://music.163.com/st/webplayer)。在 Firefox 的 `about:config` 中，启用 `browser.taskbarTabs.enabled`，即可将网页添加为一个独立窗口（和直接将标签页拖到新窗口是两回事）。这个网页版是支持系统媒体控制的，并且也可以通过 KDE Connect 被手机控制，甚至我的小米手机还将 KDE Connect 的媒体播放上岛，控制起来更加方便。

游戏兼容性也不再是问题，《极限竞速：地平线 6》这样的 3A 大作可以完美运行（虽然不支持 HDR）。反作弊确实没办法，但我并不是这类电竞游戏的忠实玩家。

我把我的一些 git 项目复制到 Linux 磁盘，在使用 Desktop Plus 操作时发现比 Windows 下快非常多。以及 Linux 的命令行相比 PowerShell，对 Agent 天生更友好。

Windows 11 的“顿挫感”在 Linux 下不复存在，这种“确定性”是 Win 11（以及 macOS 26 之流）所给不到的。

所以在 2026 年，Fedora + KDE Plasma 这套组合满足了我的使用需求吗？

答案是它至少能满足我 90% 的需求。这里我没有使用“替代 Windows”这种措辞，实际上这一周我还是重启进过 Windows 数次的，不过我已经将 Fedora 在 UEFI BIOS 中设置为第一启动项。虽然我不能完全保证后面不会重新切换回去，但这次的体验和往次的切换尝试已经不可同日而语。
