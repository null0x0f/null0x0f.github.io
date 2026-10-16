---
title: Embedded Log Console
description: 为资源受限设备设计的二进制日志协议与桌面分析客户端。
year: 2024
role: 协议 / 客户端开发
stack: [C, C++, Qt, ARM Cortex-M]
platform: Cross-platform
status: experiment
order: 4
---

## 项目概览

设备以紧凑事件格式输出日志，桌面端结合固件符号表还原结构化信息，并支持时间线筛选与上下文导出。

## 设计重点

协议版本、事件编号和参数类型都显式编码，确保不同固件版本的历史日志仍然可以被正确解释。
