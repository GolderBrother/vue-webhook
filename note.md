
张老师：
持续集成和部署

一整套 cicd + docker + nginx + node + pm2 部署的。

技术栈
前端：Vue，后端：Node.js
服务器：
前端：Nginx()
后端：Node.js

CI:持續集成
CD:持续构建(deploy)

webhook+docker

初始化:
npm init -y
-y：所有选项默认，不然你要一个一个去确认

服务端
vue-back
server.js
很简单的node服务
let http = require('http');

前端：
vue-front
vue create vue-front

yarn add axios -S
axios.get()

node服务端解决跨域
CORS allowed-origin



服务端构建：
vue-webhook
npm init -y

node发邮件的库
npm i nodemailer -S

github上新创建个项目
vue-back
vue-front

将上面的代码上传过去

用的ssh，不用输入密码，前提是需要配置ssh key

上传完毕

settings -> Webhooks
特定事件发生后(push event),会给你配置的url服务器发请求通知

需要买个阿里云服务器

CentOS 7.4版本

按需付费

分配公网IPV4地址

自定义密码

配置主机名

买完后

用Xsheel连接服务器
配置utf8

到github上配置 URL
http://47.105.129.109:4000/webhook
更新系统
yum是centos专门用来安装linux软件的工具

yum update

yum install git 

配置公钥

一个账号或者一个项目都可以配置公钥，最好直接给账号配置，这样一个账号里面的所有项目都能用了
配置完就每次提交代码，不用输入密码了

安装nvm:
yum install nvm

执行脚本
. 

安装node
nvm install stable

安装nrm(切换安装源)
npm install nrm -g
nrm use taobao

yum install -y 

安装docker
ce是社区版（免费）
ee是企业版（收费）

docker仓库里存放着各种各样的镜像
centos
ubuntu

阿里云加速

安装前端和后端依赖

启动前端和后端服务

访问成功

本实例安全组
需要配置开放端口：
3000、4000、80、8080
安全组规则 -> 创建规则

端口范围:3000/3000
/表示的是端口的段
* 授权对象:0.0.0.0/0
其他默认

端口段
22/25:22-25 

配置允许哪些端口访问

Docker
打包成一个文件，这个文件程序在虚拟容器中运行

镜像
镜像是个文件，相当于操作系统盘

RUN
容器
相当于装好的系统
里面就启动服务,打包运行软件

一个镜像可以run出很多个容器，容器之间是互相隔离的

Docker性能更好，更轻量级，资源占用少

配置Secert
判断是否为github发来的请求

vue-webhook
webhook.js服务
port:'4000'
url: '/webhook'

代码写完

github上新建个项目 webhook

然后提交到webhook项目

服务器上clone下来
然后安装依赖，启动项目

github上面
vue-back和vue-front都需要配置Webhooks

配置命令别名（短命令）
git a 
git c
git p

在gitconfig文件中配置

pm2守护进程
npm i pm2 -g

"scripts": {
    "start": "pm2 start ./webhook.js --name webhook --watch"
}

每次需要在本地更改代码重新提交
然后服务端重新pull code

git a && git c && git p
一键提交代码

更改完重新提交

服务器重新pull代码

github event
传递github事件类型
req.header['x-github-event']  event=push

需要验证签名对不对
服务端需要根据特定的算法，加上在github上配置的secret,生成一个签名，然后跟github提交过来的进行比对,一样的才能通过，不一样的返回不允许

重新拉代码、重新构建、重新部署启动

写个sheel脚本

#!/bin/bash
vue-back.sh

先清除老代码

回退到暂存区
清空暂存区

拉取最新代码

开始执行构建
docker build -t vue-back:1.0 . ？？
-t 同时制定标签和名字
. 是找当前目录
不加版本号默认是latest

基于老的镜像构建新的镜像
停止旧容器并删除旧容器
docker

启动旧容器

docker容器端口映射

宿主机的端口映射到docker容器的3000端口，前提是docker容易要暴露端口出来

-d:后台运行，不堵塞程序

前端脚本
vue-front.sh

多了个
npm run build

Dockerfile

安装nginx

nginx默认的静态文件目录
COPY ./dist /usr/share/nginx/html

nginx配置
try_files 尝试寻找的路径

静态文件走这个
location /

动态服务走这个
location /api {
    proxy
}

Dockerfile
继承node镜像
FROM node

标识名字
LABEL name="vue-back"
LABEL vertison="1.0"

当前所有文件拷贝到/app中
COPY . /app

进入工作目录
WORKDIR /app

RUN npm install


暴露端口
EXPOSE 3000

执行命令
CMD npm start

拷贝时候忽略文件的配置
dockerignore
.gitinore

注意：
.gitignore不能忽略docker配置文件

spawn 生成子进程

查看容器
docker container ps

删除容器
docker container rm name

配合钩子，自动拉代码

nginx代理
nginx proxy

发邮件
npm i nodemailer -S

版本回滚，避免代码冲突
git reset --head origin/master
git clean -f

跟着步骤，多操作几遍就行了

微信通知：
云之讯 wechaty

课程地址：
https://ke.qq.com/webcourse/index.html#cid=429677&term_id=100513022&taid=3711599068483181&type=1024&vid=5285890792876809419

linux常用命令：

```bash
# 查看当前所有tcp端口：
netstat -ntlp 
# 杀死进程：
kill：kill -9 PID
```

docker相关命令：
```bash
# 重启docker服务后再启动容器
systemctl restart docker
docker start foo

# 查看所有的镜像信息
docker ps -a

# 停止容器
docker stop [容器ID]

# 删除容器
docker rmi [容器ID]
```

问题：
TODO:后端使用sheel脚本启动容器启动不起来：
容器有启动起来，但是node服务没起来

```
sh vue-back.sh 
sh vue-front.sh
```