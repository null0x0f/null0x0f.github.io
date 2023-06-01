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
## example
```
$ gdb 调试
(gdb) break 10   //在第十行打断点
Breakpoint 1 at 0x4005f4: file my_program.cpp, line 10.  //第一个断点，在地址 0x4005f4处    file 后面显示的是打在哪个文件  哪一行
(gdb) run      
Starting program: /path/to/my_program 

Breakpoint 1, main () at my_program.cpp:10    //第一个断点打在 main()函数，是在my_program.cpp这个源文件的第十行

10      int x = 0;
(gdb) print x
$1 = 0    //检验x的值是0
(gdb) step  //进函数个体执行
11      x = 1;
(gdb) print x
$2 = 0     
(gdb) next  //不进函数个体执行
12      x = 2;
(gdb) print x
$3 = 1
(gdb) continue
```
