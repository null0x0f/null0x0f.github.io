---
title: GDB调试
abbrlink: 46594b90
date: 2023-04-15 11:31:20
tags:
---
# GDB调试
## 编译c程序
gcc test.c -o test.out
## 生成debug info文件
gcc -g test.c -o test.out
## 打断点
b main
b path :行数
r 
n 不进函数体单个执行
s  进函数单个执行

## 看断点
info b 看断点
d 行数  删除断点
c continue

bt 看函数调用栈

## 监视
watch 变量

info r 看寄存器的值

## 查看代码或汇编
layout src  查看代码
layout asm 查看汇编 

