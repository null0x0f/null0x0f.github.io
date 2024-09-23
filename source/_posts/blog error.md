---
title: Blog error log
abbrlink: a0dbd9e1
date:
---
# Build And Deploy
## first error
YAML formation
```
deploy:
  - type: git
    repository:
      # github: git@github.com:anzhiyu-c/anzhiyu-c.github.io.git  #用户名@服务器Ip:git仓库位置
      github: git@github.com：******/******.github.io.git
    branch: master
  - type: baidu_url_submitter # 这是新加的百度主动推送
abbrlink:
  alg: crc32
  rep: hex     
  search:
  path: search.xml
  field: all
  content: true
```
在YAML file中不能出现TAB 类制表符（改了好久，之前没注意。。。。

## second error
本该部署到hexo服务器上的，部署到了jekyll（不知道是不是很久没用了，GitHub犯病。。。

问了GPT才给出的解决方案：
```
创建 .nojekyll 文件
在 Hexo 项目根目录中创建一个 .nojekyll 文件，以禁用 Jekyll 处理，防止其干扰 Hexo。
```
这边在hexo 目录文件下
```
touch .nojekyll
```
用这个命令就行
# deploy
## first error
```
检查 GitHub Pages 设置
在 GitHub 仓库的 Settings > Pages 中，确认 Source 设置为正确的分支和目录（通常是 / (root) 或 /docs）。
等待 GitHub Pages 更新
```
一定要确保所有的config文件中都是你要部署发布的那个分支！

# 总结
多看log报错，gpt在配置问题上比Gemini好用

