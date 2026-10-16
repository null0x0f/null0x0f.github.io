---
title: CAN Trace Viewer
description: 面向车辆与工业控制场景的高性能 CAN 报文记录与分析工具。
year: 2025
role: 架构 / 开发
stack: [C++, Qt Quick, CAN, SocketCAN]
platform: Linux
status: completed
order: 2
---

## 项目概览

持续记录并检索高频 CAN 帧，支持 DBC 解码、时间窗口对比与触发式抓包。

## 设计重点

数据采集、索引和显示刷新采用不同节奏，避免界面帧率反向限制采集吞吐量。
