---
title: "太阳神三国杀通过 VPS 内网穿透联机"
pubDate: '2024-01-28'
---
你需要：
- 每方下载相同的太阳神三国杀游戏端
- 一台拥有公网 IP 的服务器
- frpc（服务端/房主端）/ frps（VPS 端）

## 为什么不用 Sakura frp 或类似服务？
因为我试了好几次都搭不起来。并且 Sakura frp 使用国内节点需要实名认证（虽然我认证过了，但可能有人会介意）

## 下载 frp
到 GitHub 的 frp [Release 页](https://github.com/fatedier/frp/releases) 下载。房主端下载 Windows amd64 版；VPS 端根据 CPU 架构选择相应的 Linux 版（一般都是 amd64），使用 wget 下载到方便的路径下（我这边下载到了 `/opt`），解压，之后会生成类似 `frp_0.53.2_linux_amd64` 的目录，建议重命名为 `frp`

## 编辑配置文件
> frp 自 v0.52 开始默认配置文件格式为 TOML，INI 将被弃用。此处提供了 INI 和 TOML 两种格式。

使用编辑器打开房主端的 `frpc.ini` 或 `frpc.toml`，复制以下内容：

### frpc.ini
```ini
[common]
server_addr = 114.5.1.4 # 你的 VPS 公网 IP
server_port = 7000
token = xxxxx # 为了安全，强烈建议配置

[qsanguosha]
type = tcp
local_ip = 127.0.0.1
local_port = 9527
remote_port = 9527
```

### frpc.toml
```toml
serverAddr = "114.5.1.4" # 你的 VPS 公网 IP，带引号
serverPort = 7000
auth.token = "xxxxx" # 为了安全，强烈建议配置，带引号

[[proxies]]
name = "qsanguosha"
type = "tcp"
localIP = "127.0.0.1"
localPort = 9527
remotePort = 9527
```

保存即可。

**如果在房主端配置了 token**，请使用文本编辑器打开 VPS 端的 `frps.ini` 或 `frps.toml`，把上面的 `token = xxxxx`（ini）/ `auth.token = "xxxxx"`（toml）复制到配置文件中，保存即可。

## 配置 VPS 安全组及防火墙（重要）
如果你的 VPS 有安全组，请将 TCP 端口 7000、9527 放开。

部分机器可能需要配置防火墙。在我的 VPS 上安装有 ufw，所以使用以下命令：

```
ufw allow 7000/tcp
ufw allow 9527/tcp
```

## 运行 frp
房主端建议写一个批处理，这样前台不会有 cmd 窗口：

```bat
@echo off
if "%1" == "h" goto begin
mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit

:begin
REM
frpc.exe -c frpc.toml
```
（配置文件是 ini 请把 toml 改为 ini）
保存为 frpc.bat，放在 frpc 所在路径下。

VPS 端也建议创建一个服务，具体步骤请见 [官方文档](https://gofrp.org/zh-cn/docs/setup/systemd/)

房主端打开 frpc.bat，VPS 端启动 frps 服务，这样内网穿透就打通了。

## 太阳神三国杀，启动！
房主端运行太阳神三国杀程序，点击主界面「启动服务器」，配置游戏规则。在「高级」一栏有「地址」和「端口」，确保其与房主端配置文件的 `localIP` 和 `localPort` 相同。点击确定，游戏服务端就运行起来了。

再打开一个太阳神三国杀窗口，这次点击「加入游戏」，输入你的玩家名称。`主机` 请填写你的 VPS 公网 IP，例如 `114.5.1.4`。如果端口不是默认的 9527，则后面需要跟上你设定的 `remotePort` 端口号，例如 `114.5.1.4:9528`。为了方便，还是建议配置为默认端口，这样只需输入 IP 即可。点击「连接」，如显示这个界面，即为成功。

<img src="/img/in-post/qsgs-ingame.webp" />

现在，请你的小伙伴也按照上面的说明加入游戏，就可以进行三国杀的联机咯~