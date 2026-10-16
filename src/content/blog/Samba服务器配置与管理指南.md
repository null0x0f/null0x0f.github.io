---
title: Samba服务器配置与管理指南
description: Samba服务器配置与管理指南
publishedAt: 2026-04-01
tags: [Linux]
---
# Samba服务器配置与管理指南

本文档总结了在 Ubuntu 服务器上搭建一个多用户、多层级权限的 Samba 文件共享服务的完整流程和日常管理方法。

* * *

## 一、初始搭建流程

初始搭建主要通过一个自动化脚本、手动设置密码和修改 Samba 配置文件来完成。

### 1.1 自动化脚本 `setup_samba.sh`

此脚本负责创建用户组、所有 Linux 系统用户、完整的目录结构，并为这些目录设置正确的初始文件系统权限。

```bash
#!/bin/bash

# 如果任何命令失败，脚本将立即退出
set -e

# --- 定义变量 ---
USERS="hr fin sys admi sto pur mark res"
GROUP="sambashare_users"
SHARE_BASE_DIR="/samba/user_shares"

echo "### Applying new, corrected permissions for all users... ###"

for user in $USERS; do
    echo "Processing permissions for user: $user"

    # 1. 用户的主目录: /samba/user_shares/hr/
    # 所有者是用户自己，用户组是 sambashare_users。权限为 755。
    sudo chown -R "${user}:${GROUP}" "${SHARE_BASE_DIR}/${user}"
    sudo chmod 755 "${SHARE_BASE_DIR}/${user}"

    # 2. private 文件夹
    # 权限设置为 700，意味着只有所有者 (rwx) 能访问，
    # 其他人 (---) 完全不能访问
    sudo chmod 700 "${SHARE_BASE_DIR}/${user}/private"

    # 3. public 文件夹
    # 所有者是用户自己，用户组是 sambashare_users
    # 权限设置为 2775，意味着所有者和组内成员都能读写
    sudo chown "${user}:${GROUP}" "${SHARE_BASE_DIR}/${user}/public"
    sudo chmod 2775 "${SHARE_BASE_DIR}/${user}/public"
done

echo "### Corrected permissions applied successfully! ###"
echo "Next step: Edit your smb.conf file."
```

### 1.2 设置用户密码

这是一个手动的交互式步骤，需要为每个用户设置 Samba 专用的访问密码。

```bash
sudo smbpasswd -a <username>
```

例如：

```bash
sudo smbpasswd -a hr
```

### 1.3 配置 `smb.conf`

打开 Samba 配置文件：

```bash
sudo nano /etc/samba/smb.conf
```

在文件末尾添加各个用户的共享定义。

```ini
# ================== Main User Shares ==================

[hr]
    comment = Share for HR
    path = /samba/user_shares/hr
    browseable = yes
    read only = no
    valid users = @sambashare_users

[fin]
    comment = Share for FIN
    path = /samba/user_shares/fin
    browseable = yes
    read only = no
    valid users = @sambashare_users

# ... 其他用户的配置块 ...

[res]
    comment = Share for RES
    path = /samba/user_shares/res
    browseable = yes
    read only = no
    valid users = @sambashare_users
```

其中：

- `comment`：共享目录的说明。
    
- `path`：实际共享的 Linux 文件系统路径。
    
- `browseable`：是否在 Samba 共享列表中显示。
    
- `read only`：是否只读。`no` 表示允许写入。
    
- `valid users`：允许访问该共享的用户或用户组。
    

### 1.4 重启服务

所有配置完成后，重启 Samba 使配置生效：

```bash
sudo systemctl restart smbd nmbd
```

* * *

## 二、从 Windows 访问

### 2.1 获取服务器 IP

在 Ubuntu 服务器上执行：

```bash
ip addr show
```

找到服务器当前使用的 IP 地址。

### 2.2 快速访问

在 Windows 文件资源管理器地址栏输入：

```text
\\<服务器IP地址>
```

例如：

```text
\\192.168.80.129
```

### 2.3 映射网络驱动器

在 Windows 中：

1.  打开「此电脑」。
    
2.  右键选择「映射网络驱动器」。
    
3.  文件夹地址填写：
    

```text
\\<服务器IP地址>\<共享名>
```

例如：

```text
\\192.168.80.129\hr
```

4.  勾选「使用其他凭据连接」。
    
5.  输入对应的 Samba 用户名和密码。
    

### 2.4 常见连接问题

#### 找不到网络路径

检查：

- IP 地址是否正确。
    
- 两台电脑是否处于同一网络。
    
- Ubuntu 服务器防火墙是否允许 Samba。
    
- Windows 客户端网络是否正常。
    

#### 多重连接错误

Windows 可能缓存了旧的登录凭据。

可以在 CMD 中执行：

```cmd
net use * /delete
```

清除已有的网络连接缓存，然后重新连接。

#### Windows 无法访问 `\\...\文件夹`

可能错误地使用了服务器上的 Linux 文件系统路径。

例如服务器实际目录：

```text
/samba/user_shares/hr
```

不能直接写成：

```text
\\192.168.80.129\samba\user_shares\hr
```

应该通过 Samba 定义的共享名访问：

```text
\\192.168.80.129\hr
```

也可以直接访问：

```text
\\192.168.80.129
```

然后从列出的共享列表中选择对应的共享目录。

* * *

## 三、日常权限管理

权限管理分为两个层面：

1.  Samba 共享权限：`smb.conf`
    
2.  Linux 文件系统权限：`chmod`、`chown`
    

最终生效的权限取两者中**更严格的限制**。

### 场景 A：控制谁能连接到 `[hr]` 共享

修改：

```text
/etc/samba/smb.conf
```

中的 `[hr]` 配置块。

例如：

```ini
[hr]
    comment = Share for HR
    path = /samba/user_shares/hr
    browseable = yes
    read only = no
    valid users = hr, sys
```

这样只有 `hr` 和 `sys` 用户可以访问该共享。

### 场景 B：让 `hr` 的 `public` 文件夹对组内只读

可以直接修改 Linux 文件系统权限：

```bash
sudo chmod 755 /samba/user_shares/hr/public
```

这种情况下不需要修改 Samba 配置。

### 场景 C：将 `hr` 的一个文件所有权交给 `fin`

使用：

```bash
sudo chown fin:fin /path/to/file.txt
```

* * *

## 四、添加新用户流程

假设现在需要添加一个名为 `newuser` 的新用户。

### 4.1 创建用户并设置 Samba 密码

创建 Linux 用户：

```bash
sudo useradd -m -s /bin/false -g sambashare_users newuser
```

设置 Samba 密码：

```bash
sudo smbpasswd -a newuser
```

### 4.2 创建目录并设置权限

创建用户的 `private` 和 `public` 目录：

```bash
sudo mkdir -p /samba/user_shares/newuser/{private,public}
```

修改目录所有者：

```bash
sudo chown -R newuser:sambashare_users /samba/user_shares/newuser
```

设置用户主目录权限：

```bash
sudo chmod 755 /samba/user_shares/newuser
```

设置 `private` 目录：

```bash
sudo chmod 700 /samba/user_shares/newuser/private
```

设置 `public` 目录：

```bash
sudo chmod 2775 /samba/user_shares/newuser/public
```

最终目录结构：

```text
/samba/user_shares/
└── newuser/
    ├── private/
    └── public/
```

### 4.3 在 `smb.conf` 中添加共享

编辑：

```bash
sudo nano /etc/samba/smb.conf
```

添加：

```ini
[newuser]
    comment = Share for newuser
    path = /samba/user_shares/newuser
    browseable = yes
    read only = no
    valid users = @sambashare_users
```

### 4.4 重启 Samba

配置完成后：

```bash
sudo systemctl restart smbd nmbd
```

之后即可通过 Windows 访问：

```text
\\<服务器IP地址>\newuser
```

* * *

## 总结

整个 Samba 用户共享体系可以简单理解为：

```text
Linux 用户
    ↓
sambashare_users 用户组
    ↓
/samba/user_shares/<username>/
    ├── private/
    │   └── chmod 700
    │
    └── public/
        └── chmod 2775
    ↓
Samba smb.conf
    ↓
Windows
    ↓
\\服务器IP\共享名
```

Samba 的实际访问权限需要同时考虑 **Samba 配置权限** 和 **Linux 文件系统权限**。在排查访问问题时，建议分别检查 `smb.conf`、用户组、`chmod/chown` 权限以及 Windows 的缓存凭据。