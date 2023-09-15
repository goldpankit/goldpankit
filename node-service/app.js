#!/usr/bin/env node
// 禁用 DeprecationWarning
process.noDeprecation = true
const env = require('./env').getConfig()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const autoopen = require('./core/utils/autoopen')
const routers = require('./routes/index');
const log = require('./core/utils/log')
const client = require('./core/client')
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
// 开启日志
if (env.debug) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  })
  app.use(logger('dev'));
}
// 开启远程接口代理
const logLevel = env.debug ? 'info' : 'silent'
app.use(env.remoteApiPrefix, createProxyMiddleware({
  target: env.remoteApi,
  changeOrigin: true,
  logLevel,
  pathRewrite: {
    [`^${env.remoteApiPrefix}`]: '',
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
  res.send('404')
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
  autoopen.findAvailablePort(80, (port) => {
    // 开启应用监听
    app.listen(port, () => {
      log.success(`Server is listening on port ${port}`)
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
      autoopen.findAvailablePort(80, (port) => {
        // 开启应用监听
        app.listen(port, () => {
          log.success(`Server is listening on port ${port}`)
          autoopen.open(port)
        })
      })
    })
    .catch(e => {
      log.error(e)
    })
}

