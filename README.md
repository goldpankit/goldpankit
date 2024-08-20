<div align="center">
  <img src="https://foruda.gitee.com/images/1692956820292184320/b882ad5d_1173697.png" width="50px"/>
  <h1>GoldPanKit - 一分钟构建框架</h1>
</div>

## 介绍
GoldPanKit是一个全新的研发套件，由清华海峡研究院和CodeRd原班人马研发，实现包括：
1. 一键构建框架
2. 支持为框架编写插件
3. 支持框架的一键升级
4. 支持单表、多表的代码生成
5. 支持直连数据库，自动初始化数据库脚本
6. 支持直连文件系统，免除下载解压复制粘贴的步骤

## 线上体验
前往[官网](http://www.goldpankit.com)体验一分钟搭建主流框架。

## 体验NPM上强大的客户端
在终端依次执行以下命令
```
npm install goldpankit -g --registry https://registry.npmmirror.com
kit
```

执行成功后将自动打开Kit站点。之后每次使用Kit只需要运行kit命令即可。


 **注意事项** 

- 1. 由于windows系统中可能存在多个盘，执行命令时，需要切换到您项目所在的盘下执行，否则无法选中您的项目目录。
- 2. 连接MySQL数据库时出现：ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client错误，这是数据库认证协议未支持导致的，通过以下命令修改一下数据库密码即可。
alter user 'root'@'localhost' identified with mysql_native_password by 'your password';



 **版本更新**

在终端重新执行kit命令后，kit会自动检查并更新，更新成功后再次执行kit命令即可。如果更新失败，大概率是没有权限导致，请尝试使用超级管理员打开终端并重新执行kit命令。

## 启动项目

#### 项目目录

- node-service：本地服务工程
- node-page：页面工程

#### 启动node-service
```shell
npm install --registry https://registry.npmmirror.com
npm link
kit
```

#### 启动node-page 
```shell
npm install --registry https://registry.npmmirror.com
npm run serve
```

## 效果预览
项目启动成功后，访问`http://localhost:5173/`即可打开首页。
![index.png](lib/index.png)
![index.png](lib/services.png)
![index.png](lib/service_detail.png)
![index.png](lib/service_install.png)
![index.png](lib/workbench.png)
![index.png](lib/query_model.png)
