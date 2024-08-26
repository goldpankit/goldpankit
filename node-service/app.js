#!/usr/bin/env node
// 禁用 DeprecationWarning
process.noDeprecation = true
const network = require('./core/utils/network')
const colors = require('colors-console')
// 获取参数
const yargs = require('yargs');
const jsonArgs = yargs.argv;
// 获取命令
const command = yargs.argv._[0];
// 组装参数
const args = {
  // 启动端口
  port: jsonArgs.p || jsonArgs.port || 8130,
  // 是否为debug模式 --debug
  debugMode: jsonArgs.debug || false,
  // 跟踪文件名称 --trace-file Test.java
  traceFile: jsonArgs.traceFile,
  // 本地地址
  localAddress: 'localhost',
  // 局域网地址
  networkAddress: network.getNetworkAddress()
}

const pkg = require('./package.json')
const env = require('./env').getConfig()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const autoopen = require('./core/utils/autoopen')
const routers = require('./routes/index');
const log = require('./core/utils/log')
const client = require('./core/client')
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// 写入debug模式到缓存中
log.setConfig({
  debugMode: args.debugMode,
  traceFile: args.traceFile
})

// 开启远程接口代理
app.use(env.remoteApiPrefix, createProxyMiddleware({
  target: env.remoteApi,
  changeOrigin: true,
  logLevel: 'silent',
  pathRewrite: {
    [`^${env.remoteApiPrefix}`]: '',
  }
}));

// 开启远程接口代理
app.use('/resource', createProxyMiddleware({
  target: env.remoteApi + '/resource',
  changeOrigin: true,
  logLevel: 'silent',
  pathRewrite: {
    ['^/resource']: '',
  }
}));

// 设置请求参数大小
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath));
for (const key in routers) {
  app.use(env.localApiPrefix, routers[key]);
}

// 处理刷新
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404处理
app.use(function(req, res, next) {
  res.send({
    code: 404,
    message: '找不到接口'
  })
});

// 错误处理
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.send('error');
  throw err
});

// 开发模式直接启动
if (env.env === 'develop') {
  autoopen.findAvailablePort(args.port, (port) => {
    // 开启应用监听
    app.listen(port, () => {
      console.log( colors('green', `  KIT v${pkg.version} started.`))
      console.log( colors('green', `  ➜   `), `Local: http://${args.localAddress}:${port}/`)
      console.log( colors('green', `  ➜   `), `Network: http://${args.networkAddress}:${port}/`)
      autoopen.open(port)
    })
  })
}else {
  // 生产环境自动升级
  client.autoUpgrade()
    .then(upgraded => {
      // 如果升级了，用户需重新运行kit命令
      if (upgraded) {
        return
      }
      // 升级完成后，找到可用的端口号，默认80
      autoopen.findAvailablePort(args.port, (port) => {
        // 开启应用监听
        app.listen(port, () => {
          console.log( colors('green', `  KIT v${pkg.version} started.`))
          console.log( colors('green', `  ➜   `), `Local: http://${args.localAddress}:${port}/`)
          console.log( colors('green', `  ➜   `), `Network: http://${args.networkAddress}:${port}/`)
          autoopen.open(port)
        })
      })
    })
    .catch(e => {
      log.error(e)
    })
}

