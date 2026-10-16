---
title: 服务器修复记录
description: GRUB修复
publishedAt: 2026-04-29
tags: [Linux]
---
## [](#Ubuntu-服务器-GRUB-引导故障修复与排查记录 "Ubuntu 服务器 GRUB 引导故障修复与排查记录")Ubuntu 服务器 GRUB 引导故障修复与排查记录

**日期**: 2026-02-03  
**设备**: Dell PowerEdge 服务器  
**系统**: Ubuntu  
**事件**: 系统断电/重启后无法进入系统，报错 `Boot Failed`。

## [](#1-故障现象 "1.故障现象")1.故障现象

1.  开机无法自动进入 Ubuntu，显示 Dell Logo 后可能黑屏或花屏。
2.  尝试使用 Live USB 修复时，报错 `EFI variables are not supported`。
3.  修复后重启，进入 `GNU GRUB` 黑色命令行界面，提示符为 `grub>`，GRUB 菜单未生成。

## [](#2-根本原因分析 "2. 根本原因分析")2\. 根本原因分析
* 直接原因: Ubuntu的驱动文件系统找不到，boot failed：Ubuntu
* 深层原因: GRUB 引导文件 丢失了.
## [](#3-解决方案 "3.解决方案")3.解决方案
* 制作Ubuntu 启动盘
1.  官网下载ubuntu的iso镜像
2.  用烧录软件rufus把Ubuntu镜像放入硬盘中
* 使用办法
1.  插入服务器 USB 口。
2.  重启按 **F11**。
3.  再选择USB启动之前一定要把bootmode改为EFI这个类似的模式,**启动项选择**: 必须选 `UEFI: <U盘名>`
4.  选择 **USB 启动，bootmanage 里面找oneshotxxx,进入系统**。
5.  一定要选择try or install Ubuntu
* 进入系统后的修复步骤
```BASH
# 1. 确保已是 root
sudo -i

# 2. 挂载基础分区
mount /dev/sdb4 /mnt
mount /dev/sdb1 /mnt/boot     # Boot 分区 (千万不能漏！)
mount /dev/sdb2 /mnt/boot/efi

# 3. 挂载系统接口 (标准)
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys

# 4. 【关键新增】强行挂载 EFI 变量接口 (解决 not supported 报错)
modprobe efivarfs
mount -t efivarfs efivarfs /mnt/sys/firmware/efi/efivars

# 5. 再次尝试修复
chroot /mnt
efibootmgr -b 0003 -B   <-- 这次应该就不会报错了
grub-install /dev/sdb
update-grub

# 6.重启系统
exit
reboot
```
## [](#重启系统后未进入系统进入了进入-GNU-GRUB-黑色命令行界面 "重启系统后未进入系统进入了进入 GNU GRUB 黑色命令行界面")重启系统后未进入系统进入了进入 `GNU GRUB` 黑色命令行界面

解决方案：GRUB 命令行手动引导 (最稳妥方案)

当自动菜单失效时，在 `grub>` 界面手动指定内核启动。

### [](#步骤-1：确认分区位置 "步骤 1：确认分区位置")步骤 1：确认分区位置
```BASH
ls
# 输出如 (hd1,gpt1) (hd1,gpt2)...
# 使用 ls (hd1,gpt1)/ 确认是否包含 vmlinuz 文件
```
### [](#步骤-2：手动引导命令-依次输入 "步骤 2：手动引导命令 (依次输入)")步骤 2：手动引导命令 (依次输入)

**注意**：分区号 `(hd1,gpt1)` 之间必须使用**逗号**，不能用点号。文件名建议使用 `Tab` 键自动补全以防输错版本号。
```BASH
# 1. 指定启动分区
set root=(hd1,gpt1)

# 2. 加载 Linux 内核
# root=/dev/sdb4 指向系统根目录分区，ro 表示只读挂载(启动后会自动变读写)
linux /vmlinuz-6.8.0-90-generic root=/dev/sdb4 ro

# 3. 加载初始内存盘
initrd /initrd.img-6.8.0-90-generic

# 4. 启动系统
boot
```