<div align="center">
  <img src="https://foruda.gitee.com/images/1692956820292184320/b882ad5d_1173697.png" width="50px"/>
  <h1>GoldPanKit</h1>
</div>

## 介绍
GoldPanKit是一个全新的研发套件，由清华海峡研究院和CodeRd原班人马研发。将代码编写成服务，通过一键安装&卸载服务的方式来快速完成项目工程、项目功能模块、技术栈、接口和页面的研发和对接。旨在突破传统的研发效率，让项目从0到1小时级上线不是梦。

## 立即体验
在终端依次执行以下命令

1. - npm install goldpankit -g
2. - kit

执行成功后将自动打开Kit站点。之后每次使用Kit只需要运行kit命令即可。


 **注意事项** 

- 1. 由于windows系统中可能存在多个盘，执行命令时，需要切换到您项目所在的盘下执行，否则无法选中您的项目目录。
- 2. 连接MySQL数据库时出现：ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client错误，这是数据库认证协议未支持导致的，通过以下命令修改一下数据库密码即可。
alter user 'root'@'localhost' identified with mysql_native_password by 'your password';



 **版本更新**

在终端重新执行kit命令后，kit会自动检查并更新，更新成功后再次执行kit命令即可。如果更新失败，大概率是没有权限导致，请尝试使用超级管理员打开终端并重新执行kit命令。

## 项目架构
注意该仓库仅包含node客户端部分，但你仍然可以启动并直接使用线上服务来获取服务数据（后台部分不开源）。代码中的工程目录如下

- node-service：本地服务工程
- node-page：页面工程

#### 本地启动步骤
 **启动node-service** 

1. npm install
2. npm link
3. kit

 **启动node-page** 
1. npm install
2. npm run serve



## 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

