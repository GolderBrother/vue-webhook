#!/bin/bash
# 进入到服务端工作目录
WORK_PATH='/usr/projects/vue-back'
cd $WORK_PATH
echo '清除老代码'
# 回退版本，历史区回退到暂存区
git reset --hard origin/master
# 清除暂存区
git clean -f
echo "拉取最新代码"
git pull origin master
echo "开始进行构建"
# . 是当前目录下找Dockerfile文件进行构建
# 注意：这边要加个版本号，不然默认就是latest,会有问题,下面的也要同步加
docker build -t vue-back:1.0 .
echo "停止旧容器并删除新容器"
docker stop vue-back-container
docker rm vue-back-container
echo "启动新容器"
# docker容器端口映射
# 宿主机的端口映射到docker容器的3000端口，前提是docker容器要暴露端口出来
# -d:后台运行，不堵塞当前命令行窗口
# vue-back: 镜像名字（基于vue-back镜像启动服务，后台运行）
docker container run -p 3000:3000 --name vue-back-container -d vue-back:1.0
