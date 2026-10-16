---
title: RAII 清理策略
description: 在资源所有权边界上选择合适的 RAII 类型。
section: C++
order: 1
updatedAt: 2026-07-11
status: growing
---

RAII 的核心不是智能指针，而是让资源生命周期与一个明确对象的生命周期绑定。

## 所有权优先

先确定资源是独占、共享还是借用，再选择 `unique_ptr`、值类型或非拥有引用。不要默认使用 `shared_ptr` 来逃避所有权判断。

## 非内存资源

文件句柄、锁、事务和临时配置都可以用相同方式表达。析构函数必须保持不可抛异常。
