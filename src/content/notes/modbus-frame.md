---
title: Modbus RTU 帧结构
description: Modbus RTU 请求、响应与 CRC 的快速参考。
section: Fieldbus
order: 1
updatedAt: 2026-08-28
status: evergreen
---

Modbus RTU 帧由设备地址、PDU 和 CRC 组成。帧边界依赖总线静默时间，而不是特殊分隔字节。

## 基本结构

设备地址占一个字节，随后是功能码和数据，最后两个字节为低字节在前的 CRC16。

## 异常响应

从站将正常功能码最高位置一，并在数据区返回异常码。
