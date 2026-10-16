---
title: QSerialPort 错误处理
description: QSerialPort 常见错误的分类与恢复策略。
section: Qt / I/O
order: 1
updatedAt: 2026-09-22
status: growing
---

`QSerialPort::errorOccurred` 会同时报告短暂错误与致命错误。正确处理的关键不是记住所有枚举值，而是根据当前生命周期判断下一步动作。

## 错误分类

- `ResourceError`：设备被移除或底层资源不可用，通常需要关闭并重新枚举。
- `PermissionError`：权限或端口被占用，不应自动无限重试。
- `ReadError` / `WriteError`：记录上下文后中止当前请求。
- `TimeoutError`：需要结合请求层超时策略处理。

## 推荐模式

错误回调只负责采集事实和触发状态转换，不在回调内部直接反复执行 `open()`。恢复动作交给状态机和退避定时器。

```cpp
connect(&port, &QSerialPort::errorOccurred,
        this, [this](auto error) {
    if (error == QSerialPort::NoError)
        return;

    report(toDiagnostic(error, port.errorString()));
    transition(classify(error));
});
```

## 检查清单

- 日志中包含端口名、波特率和系统错误字符串；
- 关闭端口前取消所有等待中的请求；
- 端口重新出现后重新读取设备配置；
- UI 展示用户可以执行的下一步，而不只是错误码。
