---
title: "为「一键安装」的 UOS 扩容分区"
pubDate: '2022-03-26'
---

在使用统信官方安装器「**一键安装**」UOS 后，会在指定的安装分区根目录下生成 `UOS` 文件夹，其中包含了安装好的 UOS。但这样安装的系统磁盘空间只有 20GB，显然不太够用，所以需要扩容。

我找到了 [这篇文章](https://www.cnblogs.com/xu360/articles/15835603.html)，其中是这样讲的：

> 扩容操作需要激活开发者模式。控制中心 => 通用 => 开发者模式 => 进入开发者模式

1. 确保当前 `disks` 目录所在分区有足够的空间，如果当前分区没有空间，可以将 `disks` 目录移到其它大的分区内。
2. 启动 UOS，Ctrl+Alt+T 打开终端，输入下面的命令，这里以扩容 50G 为例。
```
cd /host/UOS
dd if=/dev/zero bs=1G count=50 >> ./root.disk
```
3. 检查磁盘错误，`sudo e2fsck -f -y /host/UOS/root.disk`
4. 扩容使用新增加的空间 `sudo resize2fs /host/UOS/root.disk 70G`
5. 重启。数据空间就会显示空间增加了 50G。

我完全参照上面说的去做，到第四步时提示扩容失败。尝试重启，结果 UOS LOGO 出来后就黑屏了，进不了系统。然后我回到了 Windows，用 7-Zip 打开 `root.disk` 文件，里面的数据完好。我怀疑是 UOS 的锅，于是我用 Arch Linux 的安装盘启动，并进行了以下步骤：

1. 挂载 UOS 所在分区，我这里是 `nvme1n1p1`，如果是 SATA 硬盘就是 `sda1` 这种，应根据实际情况确定，最好 `fdisk -l` 确认下。
```
mkdir /host
mount /dev/nvme1n1p1 /host
```
2. 进行前面的第 3-4 步（若之前未扩容则为第 2-4 步）。
3. 重启。

经过如上操作，成功进入 UOS 系统，打开终端输入 `df -h`，显示扩容成功。
