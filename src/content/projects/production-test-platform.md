---
title: 设备生产测试平台
description: 可配置测试流程、设备烧录、校准与报告生成的一体化平台。
year: 2025
role: 开发
stack: [Qt, Python, SQLite, Serial, TCP]
platform: Windows
status: completed
order: 3
---

## 项目概览

将固件烧录、硬件检测、参数校准和结果归档组织为可追踪的生产流程。

## 设计重点

测试步骤采用声明式配置，设备能力通过适配器暴露，使产线配置能够在不重新编译客户端的情况下调整。
