---
title: "OPERATING SYSTEM"
description: "操作系统学习笔记：计算机系统结构、进程与线程、调度、同步、死锁和内存管理。"
publishedAt: 2025-10-16T07:22:52.702Z
updatedAt: 2026-05-22T06:12:43.052Z
tags: ["操作系统","OS","CS"]
---

<!-- 原文：https://null0x0f.github.io/posts/1db60101.html；正文、示例和原始日期按旧站保留。 -->

<p data-migration-note>本文已从旧博客迁移。部分原图所在图床目前无法访问，缺失位置保留了图片说明和原链接，正文与代码保持原文。</p>

<div id="Computer-Operating-System" style="scroll-margin-top:92px" aria-hidden="true"></div>

# Computer Operating System

## 导论

cs ->  hardware(io cpu…)   software(application)   data<br />
![计算机系统层次结构](/images/blog/operating-system/image1.png)

<div id="interface-接口" style="scroll-margin-top:92px" aria-hidden="true"></div>

### interface(接口)

hard - hard       example： USB<br />
soft - hard    操作系统通过instructions(指令集)      example: printf() API接口

<div id="Virtual-Machine" style="scroll-margin-top:92px" aria-hidden="true"></div>

### Virtual Machine

操作系统向用户提供一个容易理解和使用的计算机（虚拟的），用户对这个计算机操作将被操作系统转换成对计算机硬件的操作<br />
![虚拟机](/images/blog/operating-system/image2.png)

## 计算机系统组成

CPU RAM DISK  IOdevice …..

### 中断

当所有事情发生时，CPU收到一个中断信号<br />
CPU停下来正在做的事，转而执行中断处理程序，执行完毕会回到之前被中断的地方继续执行<br />
操作系统是一个以中断驱动的系统

### 存储系统

cpu负责将指令从内存读入，所以程序必须在内存中才能运行<br />
内存以字节为存储单位，每个字节都有一个地址与之对应，通过load/store指令可以访问指定地址的内存数据<br />
load：将内存数据装入寄存器(Register)<br />
store:将寄存器数据写入内存<br />
![memory](/images/blog/operating-system/image3.png)

<div id="I-O结构" style="scroll-margin-top:92px" aria-hidden="true"></div>

### I/O结构

![IO](/images/blog/operating-system/image4.png)

## 系统体系结构

### 单处理器系统

![单处理](/images/blog/operating-system/image5.png)

### 多处理系统

两个或多个CPU<br />
非对称处理<br />
对称处理

<div id="集群系统-gt-cloud-computing-云计算" style="scroll-margin-top:92px" aria-hidden="true"></div>

### 集群系统    ->cloud computing  云计算

若干节点，多台计算机通过网络连接在一起,节点之间是松耦合关系<br />
高可用<br />
高性能计算

## 操作系统结构

### 单用户单道模式

### 多道程序设计

让CPU总有一个执行任务

<div id="分时系统-多任务系统" style="scroll-margin-top:92px" aria-hidden="true"></div>

### 分时系统(多任务系统)

多个用户共享一天计算机<br />
分时系统为每个用户轮流分配等量的CPU时间<br />
发出指令到即时结果的时间为响应时间

### 提供服务

![操作系统提供服务](/images/blog/operating-system/image6.png)<br />
user interface 面向user<br />
CLI   GUI   Batch<br />
system calls 面向开发者<br />
![标准c程序](/images/blog/operating-system/image7.png)<br />
usermode:执行用户代码<br />
kernelmode:执行os代码<br />
目的：确保os正确运行<br />
实现方式：0表示kernel模式 1表示user模式<br />
![trap](/images/blog/operating-system/image8.png)

<div id="process-Concept" style="scroll-margin-top:92px" aria-hidden="true"></div>

## process Concept

### definition

#### process in memory

![process in memory](/images/blog/operating-system/image9.png)

#### concurrency

![并发进程共享cpu](/images/blog/operating-system/image10.png)

进程是一个程序的一次执行过程<br />
进程是资源分配，保护和调度的基本单位

<div id="PROCESS-STATE" style="scroll-margin-top:92px" aria-hidden="true"></div>

### PROCESS STATE

Running:此时进程的代码在cpu上运行<br />
Ready:进程具备运行条件，等待分配cpu<br />
Waiting:进程在等待某些时间的发生<br />
![进程状态转换](/images/blog/operating-system/image11.png)

## process scheduling

### 进程切换

切换时机：<br />
进入等待状态<br />
进程被抢占CPU而进入就绪状态

切换过程：<br />
保存被中断进程的上下文信息<br />
修改被中断进程的控制信息<br />
将被中断的进程加入相应的状态队列<br />
调度一个新的进程并恢复他的上下文信息

#### 中断技术

当发生某个异常事件，中止cpu上现行程序的运行<br />
引出该事件的处理程序执行<br />
执行完毕返回中断点继续执行

##### 外中断

来自cpu外部<br />
异步中断（随机）

##### 内中断

硬件，程序异常，系统调用

##### 中断处理过程

context:save the context of the excuting process<br />
![中断处理过程](/images/blog/operating-system/image12.png)

#### 特权指令和非特权指令

privileged instructions: only in kernel mode process switch<br />
non - privileged instructions: only in usermode

#### 进程控制块

<span data-missing-image="https://picss.sunbangyan.cn/2023/10/25/1f4a76b270a570a1fafde25e28d23c5d.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/25/1f4a76b270a570a1fafde25e28d23c5d.png">进程控制块</a></span>

### 进程队列

<span data-missing-image="https://picss.sunbangyan.cn/2023/10/25/154eafa4d3eeb9a76df7acf0ddfd5cce.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/25/154eafa4d3eeb9a76df7acf0ddfd5cce.png">进程队列</a></span>

### 进程调度

<span data-missing-image="https://picdl.sunbangyan.cn/2023/10/25/2536def0751a685f04a0040a661c875b.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/25/2536def0751a685f04a0040a661c875b.png">进程调度</a></span>

<div id="实验（创建子进程）" style="scroll-margin-top:92px" aria-hidden="true"></div>

### 实验（创建子进程）

getpid:返回当前进程的id<br />
wait(NULL)<br />
Wait(NULL)：父进程做完，等待子进程，不加wait（NULL）子进程会变成孤儿进程，孤儿进程会继续运行，但是会把它托管给系统进程（pid=1）

<div id="THREAD" style="scroll-margin-top:92px" aria-hidden="true"></div>

## THREAD

### motivation

实现并行，把所有执行流封装到一个进程里<br />
执行流（线程）

### merit

响应性<br />
资源共享<br />
经济<br />
可伸缩性

<div id="DEFINITION" style="scroll-margin-top:92px" aria-hidden="true"></div>

### DEFINITION

<div id="Multithreading-Model" style="scroll-margin-top:92px" aria-hidden="true"></div>

### Multithreading Model

#### 用户线程

ULT在user mode下运行

#### 内核线程

KLT在kernel mode下运行，由操作系统支持和管理

<div id="M：1模型" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### M：1模型

<span data-missing-image="https://picdl.sunbangyan.cn/2023/10/25/53f7356a09e0b12b31f9f21217b3fe81.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/25/53f7356a09e0b12b31f9f21217b3fe81.png">M1</a></span><br />
优：逻辑上提供了多个执行流<br />
缺：实际上并不是并行，只占用了一个KLT

<div id="1：1模型" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### 1：1模型

优：并发加并行<br />
缺：空间和时间内核开销

<div id="M-M模型" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### M:M模型

优：开销减小<br />
缺：实现复杂

### 多核编程

<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/25/3f91e5b7d4c752888775f9d41a9d8e09.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/25/3f91e5b7d4c752888775f9d41a9d8e09.png">多核编程</a></span>

### 多线程实验

```text
#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>
#include <pthread.h>
int value = 100;//共享数据部分属于进程
void* hello(void* arg)
{
   for(int i = 0;i<3;i++)
   {
      printf("hello(%d)",value);
      sleep(1);
   }
}
void* world(void* arg)
{
for(int i = 0;i<3;i++)
   {
      printf("world(%d)",value);
      sleep(3);
   }
}
int main()
{
   thread_t tid1,tid2;
   //线程创建函数
   //1.第一个参数传线程id地址
   //2.第二个参数传线程分配地址
   //3.第三个参数传线程函数地址
   //4.第四个参数传线程参数地址
   pthread_create(&tid1,NULL,hello,NULL);
   pthread_create(&tid2,NULL,hello,NULL);
   //等待指定线程结束
   pthread_join(tid1,NULL);
   pthread_join(tid2,NULL);
   printf("in main thread(%d)",value);
}
```

所有线程共享数据段<br />
线程中局部变量是没用办法在另外一个线程中访问的,局部变量属于线程中自己的栈<br />
线程是并发执行的

等待线程结束的原因（thread\_join）：<br /> <span data-missing-image="https://picdl.sunbangyan.cn/2023/10/25/63a34230ec710dbfa6e5e6d9e255e2f5.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/25/63a34230ec710dbfa6e5e6d9e255e2f5.png">多线程实验1</a></span>

实验中Linux命令：<br />
编译多线程文件<br />
gcc   ****.c  -o &#x20;**** -pthread<br />
time 命令获取程序在cpu，用户，实际运行时所需要的时间&#x20;

<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/25/64200993c7f3f8794c3082b79d5ac03a.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/25/64200993c7f3f8794c3082b79d5ac03a.png">多线程实验2</a></span><br />


```c
#include <sys/types.h>
#include <unistd.h>
#include <stdio.h>
#include <pthread.h>
#include<time.h>
#include<stdlib.h>
void* Caculate(void* arg)
{ 
  unsigned seed = time(NULL);
   int circle_point = 0;
   int square_point = 0;
   int value = *((int*)arg);
   for(int i = 0;i<value*value;i++)
   {
      double rand_x = (double)rand_r(&seed)/RAND_MAX;
      double rand_y = (double)rand_r(&seed)/RAND_MAX;
      if(rand_x*rand_x+rand_y*rand_y<=1)
      {
        circle_point++;
      }
      square_point++;
   }
   double PI = (4.0*circle_point)/square_point;
   printf("PI=%lf in %d times \n",PI,value*value); 
   
}
int main()
{
   int args[10];
   clock_t delta;
   clock_t start = clock();
   pthread_t calculate_pi_thread[10];
   for(int i = 0;i<10;i++)
   {
     args[i] = 100+i;
     pthread_create(calculate_pi_thread+i,NULL,Caculate,args+i);
   }
   for(int i = 0;i<10;i++)
   {
      pthread_join(calculate_pi_thread[i],NULL);
   }
   delta = clock()-start;
   printf("total time is %lf\n",(double)delta/CLOCKS_PER_SEC);
   return 0;
}
```



<div id="LECTURE-6-CPU-SCHEDULING" style="scroll-margin-top:92px" aria-hidden="true"></div>

## LECTURE 6 CPU SCHEDULING

<div id="CPU调度程序-基于单处理器" style="scroll-margin-top:92px" aria-hidden="true"></div>

### CPU调度程序   基于单处理器

长进程：占用cpu时间长<br />
短进程：占用cpu时间短<br />
CPU bonding ： cpu占用密集<br />
IO  …..     :<br />
非抢占调度：一个进程占用cpu直到进程中断或结束<br />
抢占调度(Preemptive scheduling):<br />
调度算法性能的衡量：<br /> <span data-missing-image="https://picst.sunbangyan.cn/2023/10/25/31b6cbf816e5b0b67b366229c15c4c02.png">原图暂不可用：<a href="https://picst.sunbangyan.cn/2023/10/25/31b6cbf816e5b0b67b366229c15c4c02.png">调度算法</a></span>

### 调度性能指标

ti = tf - ts;（进程提交给系统的时刻是ts，完成时刻是tf）

### 调度算法

<div id="FCFS-队列" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### FCFS(队列)

[FCFS](https://picss.sunbangyan.cn/2023/10/25/c55d687b0b29a532649ed3f24fcf4671.png)

<div id="时间片轮转（TIME-SHARING）" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### 时间片轮转（TIME SHARING）

<span data-missing-image="https://picst.sunbangyan.cn/2023/10/25/e535d5bb063979e8e9fba19535c9bc08.png">原图暂不可用：<a href="https://picst.sunbangyan.cn/2023/10/25/e535d5bb063979e8e9fba19535c9bc08.png">时间片轮转</a></span><br /> <span data-missing-image="https://picst.sunbangyan.cn/2023/10/25/604752a7e9fb369d89b8666efe0779ac.png">原图暂不可用：<a href="https://picst.sunbangyan.cn/2023/10/25/604752a7e9fb369d89b8666efe0779ac.png">RR</a></span><br />
算法分析：<br />
时间片选取：<br />
取值太小： 进程切换开销太大<br />
取值太大：响应速度下降<br />
选区范围：10ms-100ms

对长作业切换开销太大

<div id="最短作业优先（SJF）" style="scroll-margin-top:92px" aria-hidden="true"></div>

### 最短作业优先（SJF）

下一次调度选择所需要的CPU时间最短的那个进程<br /> <span data-missing-image="https://picss.sunbangyan.cn/2023/10/25/3e3665cb41aab8e72a2131fcc3c81218.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/25/3e3665cb41aab8e72a2131fcc3c81218.png">SRTF</a></span><br />
长进程可能长时间无法获取CPU<br />
很难实现：该算法需要事先知道进程所需CPU时间

### 优先级调度

调度策略：下次调度总是选择优先级最高的进程

#### 优先级定义

在Linux中，线程调度优先级由一个整数值表示，范围从0到最高优先级（通常是99）。较高的优先级值表示线程具有更高的优先级。

静态优先级：优先级保持不变，但会出现不公平现象<br />
动态优先级：根据proess占用CPU时间：当进程占用CPU时间越长，慢慢降低优先级<br />
&#x20;  根据进程等待：进程在就绪队列中等待时间越长，就慢慢提升优先级

### 调度

<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/25/703ba641dcf7aa8c83344cc844549b2d.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/25/703ba641dcf7aa8c83344cc844549b2d.png">调度</a></span>

<div id="Linux-线程调度" style="scroll-margin-top:92px" aria-hidden="true"></div>

## Linux 线程调度

```text
pthread_attr_t attr  //初始化线程属性为默认

```

<div id="1-Scope" style="scroll-margin-top:92px" aria-hidden="true"></div>

### 1.Scope:

PTHREAD\_SCOPE\_SYSTEM 系统 scs  Linux 一对一模型<br />
PTHREAD\_SCOPE\_PROCESS 进程 pcs&#x20;

<div id="2-调度策略，调度优先级" style="scroll-margin-top:92px" aria-hidden="true"></div>

### 2.调度策略，调度优先级

Scheduling policy :<br />
NORMAL :    SHED\_OTHER  ,SCHEO\_IDLE ,   SCHED\_BATCH,<br />
REAL TIME:   SCHED\_FIFO  ,   SCHED\_RR<br />
实时的线程总是比普通线程优先级更高

SCHED\_OTHER:  time -sharing   NICE:友好值\[-20,19]   PR = 20+NICE\[0,39]   PR值越高，优先级越低

REAL TIME :PR = -1 - proirity\_value

PR:  rt —>  PR = -100

‘chrt - p pid’->观察进程调度策略以及他的priority\_value<br />
‘sudo chrt -f -p || pid’ => 将皮带进程切换为rt并且设置其 priority\_value和policy

## 调度策略的过程

<span data-missing-image="https://picdl.sunbangyan.cn/2023/10/25/da5eba22e056122021481d5ca09b0012.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/25/da5eba22e056122021481d5ca09b0012.png">调度策略</a></span>

<div id="LECTURE-7-进程同步" style="scroll-margin-top:92px" aria-hidden="true"></div>

## LECTURE 7 进程同步

### 并发

在内存中存在若干进程或线程，由操作系统的调度程序采用适当策略将他们调度到CPU上运行，同时维护他们的状态队列

并发是交替执行<br />
宏观上是同时运行<br />
微观上是走走停停的

并发进程关系：<br />
独立<br />
交互：竞争和协作

### 异步

1.random<br />
2.<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/25/90027f68c07a7b470442a8ce0b301c0c.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/25/90027f68c07a7b470442a8ce0b301c0c.png">异步</a></span><br />
3.<span data-missing-image="https://picss.sunbangyan.cn/2023/10/25/655a3b6e19710bcc25798854cd686511.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/25/655a3b6e19710bcc25798854cd686511.png">异步2</a></span>

可能是图中情况，也可能是先执行完t1再执行t2

### 同步

维护数据的一致性  数据（协作或交互的进程）

Mutex lock （互斥锁）解决竞争问题<br />
semaphore（信号量）解决协作问题

## 互斥锁

### 进程进出临界区协议

进入临界区前在entry section要请求许可<br />
离开临界区后在exit section要归还许可

管理准则：<br />
Mutual exclusion:互斥<br />
Progress:前进<br />
Bounded waiting：有限等待

1.section中有位置就必须进去一个<br />
2.多个进程只能进去一个，其他进程等待<br />
3.等待时间不能无限<br />
4.在临界区里进程不能无限在临界区

测试：y->获得锁   n-> waiting

上锁和测试不能被打断

### 原子操作

test\_and\_set()<br />
compare \_and\_swap()

<div id="busy-waiting（自旋锁）" style="scroll-margin-top:92px" aria-hidden="true"></div>

### busy waiting（自旋锁）

占用CPU执行空循环进行等待<br />
浪费CPU时间<br />
进程在等待时没有上下文切换<br />


```text
//锁初始化
pthread_mutex_t lock = PTHREAD_MUTEX_INTIALIZER
//获取锁
pthread_mutex _lock(&lock)
//释放锁
pthread_mutex_unlock(&lock)
```



<div id="SIGNAL-（信号量）" style="scroll-margin-top:92px" aria-hidden="true"></div>

## SIGNAL （信号量）

PV操作<br />
P:  wait()<br />
V:  signal()

### 信号量的实现

```text
P(s)
{
 while(s<=0)
 do noing;
 s--;
}

V(s)
{
 s++;
}
```

s<=0  P(s) :busy waiting   V(s) :s++<br />
s=1    P(s)  :s=0    V(s): s = 2

### 信号量的使用

BINARY SEMAPHORE<br />
二值信号量只能是0或1，通常将其初始化为1<br />


```text
semaphore mutex = 1;
process p
{
P(mutex);
   critical section

V(mutex)
}
```

COUNTING SEMAPHORE<br />
一般信号量的取值可以是任意数值

```text
semaphore road = 2;
process Car
{
  p(road);
   pass the fork
   in the road
  V(road);
}
```

s=1->竞争<br />
s>1->可用资源数量



<div id="Lab" style="scroll-margin-top:92px" aria-hidden="true"></div>

### Lab

<span data-missing-image="https://picss.sunbangyan.cn/2023/10/25/9874e6d4ae9feb20ee8c6c4e593618d5.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/25/9874e6d4ae9feb20ee8c6c4e593618d5.png">信号量lab</a></span><br />
sem\_wait()——>P()<br />
sem\_post()———->V()

### 同步问题

找到并发进程交互点<br />
P操作来调节进程执行速度<br />
初始值为0的信号量可以让进程直接进行等待状态<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/F8UmYWzZ.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/F8UmYWzZ.png">PC.png</a></span><br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/PIJrUqaY.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/PIJrUqaY.png">PC2.png</a></span>

```c
Semaphore empty = 1;
Semaphore full = 0;
Producer
{
  P（empty）;
  put
  V(full);
}
Consumer
{
   P(full);
    get
   V(empty);
}
```

有界缓冲区<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/ci5VNhyp.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/ci5VNhyp.png">有界缓冲区.png</a></span><br />


```text
P(mutex);
B[i] = product
in = (in+1)%k;
V(mutex);
```

```text
P(mutex);
product = B[out];
out = (out+1)%k
```

对进程共享变量实施临界区管理（上锁）<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/flxp00c2.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/flxp00c2.png">死锁.png</a></span><br />
1.不要随意扩大临界区<br />
2.empty和full的p，v操作不在同一进程（同步信号量）<br />
3.mutex和p，v操作在同一进程（互斥信号量)



<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/27/5cb8a1ac6825ff43a5f1ffb925ab3b89.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/27/5cb8a1ac6825ff43a5f1ffb925ab3b89.png">pgjz</a></span>

### 同步问题案例

读者写者问题<br />


```text
semaphore rw = 1,mutex=1;
int reader = 0;
Reader
{
p(mutex)
if(reader==0)
{
reader++;
 p(rw);
}
v(mutex)
 read;
 p(mutex)
 reader--;
 if(reader==0)
 {
 v(rw);
 }
 v(mutex)
}

Writer
{
  p(rw);
  writ  e;
  v(rw);
}
```

barber问题<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/aEb5zmTq.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/aEb5zmTq.png">barber.png</a></span>

```text
#define Max 3
semphore b = 1,c = 0,mutex = 1;
int waiting = 0;
Barber
{
  p(c);
  p(mutex);
  waiting--;
  v(mutex);
  cut hair
  v(b);
}
Customer
{
   p(mutex);
   if(waiting<Max)
   {
      waiting++;
      v(mutex);
       p(b);
       v(c);
   }
   else
   {
     leaving
   }
   cut hair
}
```



<div id="DEAD-LOCK" style="scroll-margin-top:92px" aria-hidden="true"></div>

## DEAD LOCK

在多并发进程下，一些进程会去竞争有限的资源，当资源不可用，进程会进入等待状态，在有些时候，等待状态无法被改变（他等待的资源被另外一个进程占有并等待）。<br />
饥饿：进程长时间等待<br />
死锁：循环等待资源

产生死锁必要条件:<br />
1.互斥使用<br />
2.不可剥夺<br />
3.占有和等待<br />
4.循环等待

### 解决方案

<div id="1-死锁的防止-Prevention" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### 1.死锁的防止(Prevention)

破坏四个必要条件<br />
只能破坏循环等待

<div id="2-死锁避免（Avoidance）" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### 2.死锁避免（Avoidance）

在并发进程中做出妥善安排避免死锁发生

SAFE STATE<br />
按照顺序分配资源给每个进程，避免死锁

Banker’s algorithm<br />
已知系统中所有资源的种类和数量<br />
已知进程所需要的各类资源最大需求量<br />
该算法可以计算出当前系统状态是否安全<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/iqYtBTjm.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/iqYtBTjm.png">安全算法.png</a></span>

<div id="3-死锁的检测和恢复" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### 3.死锁的检测和恢复

<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/27/4932acc5f82b254c5d794d934b827f08.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/27/4932acc5f82b254c5d794d934b827f08.png">死锁定理</a></span><br /> <span data-missing-image="https://picdl.sunbangyan.cn/2023/10/27/0e4cb28af4a49c6052560ac038e4211a.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/27/0e4cb28af4a49c6052560ac038e4211a.png">死锁的解除</a></span>

## 进程内存空间

### 逻辑地址和物理地址

16进制下，<br />
9+1=A, A+1=B, B+1=C,C+1＝D, D+1＝E, E+1=F, F+1=10,10+1=11…<br />


```text
sample.o:     file format elf64-x86-64


Disassembly of section .text:

0000000000000000 <sum>:
   0:	f3 0f 1e fa          	endbr64 
   4:	55                   	push   %rbp
   5:	48 89 e5             	mov    %rsp,%rbp
   8:	89 7d fc             	mov    %edi,-0x4(%rbp)
   b:	89 75 f8             	mov    %esi,-0x8(%rbp)
   e:	8b 55 fc             	mov    -0x4(%rbp),%edx
  11:	8b 45 f8             	mov    -0x8(%rbp),%eax
  14:	01 d0                	add    %edx,%eax
  16:	5d                   	pop    %rbp
  17:	c3                   	ret    
//逻辑地址：0，4，5.....

0000000000000018 <main>:
  18:	f3 0f 1e fa          	endbr64 
  1c:	55                   	push   %rbp
  1d:	48 89 e5             	mov    %rsp,%rbp
  20:	be 05 00 00 00       	mov    $0x5,%esi//参数传入调用函数
  25:	bf 04 00 00 00       	mov    $0x4,%edi//参数传入调用函数
  2a:	e8 00 00 00 00       	call   2f <main+0x17>//调用函数
  2f:	89 c6                	mov    %eax,%esi
  31:	48 8d 05 00 00 00 00 	lea    0x0(%rip),%rax        # 38 <main+0x20>
  38:	48 89 c7             	mov    %rax,%rdi
  3b:	b8 00 00 00 00       	mov    $0x0,%eax
  40:	e8 00 00 00 00       	call   45 <main+0x2d>
  45:	b8 00 00 00 00       	mov    $0x0,%eax
  4a:	5d                   	pop    %rbp
  4b:	c3                   	ret    

```

逻辑地址：给每一条指令提供编号<br />
物理地址:内存单元看到的地址



物理地址=基址+逻辑地址

### 进程的内存映像

<span data-missing-image="https://picst.sunbangyan.cn/2023/10/27/03cc6e0b92401362e0bed796f2999354.png">原图暂不可用：<a href="https://picst.sunbangyan.cn/2023/10/27/03cc6e0b92401362e0bed796f2999354.png">内存映射</a></span><br />


```text
#include<stdlib.h>
#include<unistd.h>
#include<stdio.h>
int global_ar = 5;
int main()
{
   static int static_var = 6;
   int local_var=7;
   int *p= (int*)malloc(100);
   //use %lx to show a 64bits address
   printf("the global_var address is %lx\n",&global_var);
   printf("the static_var address is %lx\n",&static_var);
   printf("the local_var address is %lx\n",&local_var);
   printf("the address which the p points to is%lx\n",&p);
   free(p);
   sleep(1000);
   return 0;
}
```

```text
$gcc sample2.c -o sample2
$./sample2
#输出结果
the global_var address is 561b0368e010
the static_var address is 561b0368e014
the local_var address is 7ffe6aa505ec
the address which the p points to is7ffe6aa505f0
```

```text
ps -el

把sample2的pid记录下来
356275 pts/3    00:00:00 sample2
```



```text
$cat /proc/356275/maps
## 输出结果如下
561b0368a000-561b0368b000 r--p 00000000 08:03 1051278             /home/null/Documents/expeiment/sample2
561b0368b000-561b0368c000 r-xp 00001000 08:03 1051278  ##代码段                  /home/null/Documents/expeiment/sample2
561b0368c000-561b0368d000 r--p 00002000 08:03 1051278                    /home/null/Documents/expeiment/sample2
561b0368d000-561b0368e000 r--p 00002000 08:03 1051278                    /home/null/Documents/expeiment/sample2
561b0368e000-561b0368f000 rw-p 00003000 08:03 1051278  ## 数据段           /home/null/Documents/expeiment/sample2
561b04a41000-561b04a62000 rw-p 00000000 00:00 0                          [heap]
7f1499a00000-7f1499a28000 r--p 00000000 08:03 919877                     /usr/lib/x86_64-linux-gnu/libc.so.6
7f1499a28000-7f1499bbd000 r-xp 00028000 08:03 919877                     /usr/lib/x86_64-linux-gnu/libc.so.6
7f1499bbd000-7f1499c15000 r--p 001bd000 08:03 919877                     /usr/lib/x86_64-linux-gnu/libc.so.6
7f1499c15000-7f1499c19000 r--p 00214000 08:03 919877                     /usr/lib/x86_64-linux-gnu/libc.so.6
7f1499c19000-7f1499c1b000 rw-p 00218000 08:03 919877                     /usr/lib/x86_64-linux-gnu/libc.so.6
7f1499c1b000-7f1499c28000 rw-p 00000000 00:00 0 
7f1499c7d000-7f1499c80000 rw-p 00000000 00:00 0 
7f1499c8e000-7f1499c90000 rw-p 00000000 00:00 0 
7f1499c90000-7f1499c92000 r--p 00000000 08:03 919871                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2
7f1499c92000-7f1499cbc000 r-xp 00002000 08:03 919871                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2
7f1499cbc000-7f1499cc7000 r--p 0002c000 08:03 919871                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2
7f1499cc8000-7f1499cca000 r--p 00037000 08:03 919871                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2
7f1499cca000-7f1499ccc000 rw-p 00039000 08:03 919871                     /usr/lib/x86_64-linux-gnu/ld-linux-x86-64.so.2
7ffe6aa32000-7ffe6aa53000 rw-p 00000000 00:00 0                          [stack]
7ffe6aba4000-7ffe6aba8000 r--p 00000000 00:00 0                          [vvar]
7ffe6aba8000-7ffe6abaa000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 --xp 00000000 00:00 0                  [vsyscall]

```

## 内存管理

### 目标

高速缓存<br /> <span data-missing-image="https://picss.sunbangyan.cn/2023/10/27/e56d6d27aeea32635a1e9bf0ce94e7fd.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/27/e56d6d27aeea32635a1e9bf0ce94e7fd.png">高速缓存</a></span>

保护os:   防止用户进程去读写os的内存空间

保护用户进程：用户进程之间不能随意存取对方内存空间

操作正确：地址转换。分配回收

### 逻辑地址和物理地址

地址转换时机<br />
编译时：提前知道这个程序要加载的物理内存的起始地址<br />
加载时：加载的时候知道基址R<br />
这两个转换时机都是不可移动的<br />
运行时：MMU（内存管理单元）将逻辑地址转换为物理地址<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/b8jdC7LY.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/b8jdC7LY.png">MMU.png</a></span>

<div id="CONTIGUOUS-MEMORY-ALLOCATION" style="scroll-margin-top:92px" aria-hidden="true"></div>

### CONTIGUOUS MEMORY ALLOCATION

<div id="FIXED-SIZED-PARTITION" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### FIXED\_SIZED PARTITION

将内存划分成不同一些固定容量的分区，每个分区都可能包含一个进程

<div id="VARIABLE-PARTITION-可变分区" style="scroll-margin-top:92px" aria-hidden="true"></div>

#### VARIABLE\_PARTITION  可变分区

<span data-missing-image="https://img1.imgtp.com/2023/10/16/GplotZod.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/GplotZod.png">可变分区.png</a></span><br /> <span data-missing-image="https://picdl.sunbangyan.cn/2023/10/27/20f62e58fb00656860f2edd4b8986e87.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/27/20f62e58fb00656860f2edd4b8986e87.png">holes</a></span><br />
动态存储分配方案:<br />
首次适应<br />
发呢配首个足够大的hole，效率最高<br />
最佳适应<br />
分配最小的足够大的hole，浪费最小<br />
最坏适应，发配的孔，产生的剩余孔更可能再利用

地址转换与保护:<br /> <span data-missing-image="https://picss.sunbangyan.cn/2023/10/27/620d3edfeb22dba3ecb576aeb36aafff.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/27/620d3edfeb22dba3ecb576aeb36aafff.png">地址转换与保护</a></span>

碎片问题:<br />
compaction<br />
static relocation<br />
cost

## 分段和分页

### 动机

针对碎片的解决方案<br />
内部：固定分区<br />
外部：可变分区

### 分段

<span data-missing-image="https://img1.imgtp.com/2023/10/16/uAMieSEY.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/uAMieSEY.png">划分段.png</a></span>

#### 分段硬件

<span data-missing-image="https://picdm.sunbangyan.cn/2023/10/27/f477668f395297e54dbd1eaa762f2ee5.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/27/f477668f395297e54dbd1eaa762f2ee5.png">分段硬件</a></span>

##### 16为位段式地址转换实例:

pc寄存器存放的值是cpu下一条要执行的指令的地址

假设逻辑地址段号占2bits  ，  段内位移占14bits    pc寄存器的值为0x240<br />
逻辑地址:0000 0010 0100 0000<br />
段号是0x0<br />
段内位移是0x240<br /> <span data-missing-image="https://img1.imgtp.com/2023/10/16/O2GsYxgr.png">原图暂不可用：<a href="https://img1.imgtp.com/2023/10/16/O2GsYxgr.png">16段转换实例.png</a></span>

### 分页

frame：页框<br />
page：页面<br />
页表：page table<br /> <span data-missing-image="https://picdm.sunbangyan.cn/2023/10/27/b352d2f1bc6276e8436abd6893c75b16.png">原图暂不可用：<a href="https://picdm.sunbangyan.cn/2023/10/27/b352d2f1bc6276e8436abd6893c75b16.png">分页基本方法</a></span>

#### 页号和页内位移

<span data-missing-image="https://picdl.sunbangyan.cn/2023/10/16/1efe7c7e346cdbb27028c7cf00cc15bc.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/16/1efe7c7e346cdbb27028c7cf00cc15bc.png">页号与页内位移</a></span>

#### 分页硬件

<span data-missing-image="https://picdl.sunbangyan.cn/2023/10/16/c42ddbbac1f8dcee8e4c674568be2063.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/16/c42ddbbac1f8dcee8e4c674568be2063.png">分页硬件</a></span>

#### 分页计算物理地址

<span data-missing-image="https://picss.sunbangyan.cn/2023/10/16/3a44019437cc1341553a17da9b430d21.jpg">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/16/3a44019437cc1341553a17da9b430d21.jpg">分页计算物理地址</a></span>

## 页表

页面大小<br />
逻辑地址长度为mbits，页面大小 2的n次方 bytes<br />
页内位移占 n bits<br />
页号占m-n bits

### 快表

TLB（Translation Look-aside Buffer）<br /> <span data-missing-image="https://picdl.sunbangyan.cn/2023/10/16/0dae982211442b42f25741652dcaadb9.jpg">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/16/0dae982211442b42f25741652dcaadb9.jpg">TLB.pmg</a></span>

### 页的保护和共享

<span data-missing-image="https://picdl.sunbangyan.cn/2023/10/16/ec6d3ce0d142fea6301bbca78ca4a517.png">原图暂不可用：<a href="https://picdl.sunbangyan.cn/2023/10/16/ec6d3ce0d142fea6301bbca78ca4a517.png">保护</a></span><br /> <span data-missing-image="https://picss.sunbangyan.cn/2023/10/16/5fb113e261b6da2b05ca9733d75991e5.png">原图暂不可用：<a href="https://picss.sunbangyan.cn/2023/10/16/5fb113e261b6da2b05ca9733d75991e5.png">共享</a></span>

### 多级页表
