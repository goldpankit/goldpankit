#!/usr/bin/env node
// 禁用 DeprecationWarning
process.noDeprecation = true

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
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// })
// app.use(logger('dev'));
// 开启远程接口代理
app.use('/remote-api', createProxyMiddleware({
  target: 'http://localhost:10088',  // 目标服务器的地址
  changeOrigin: true,  // 修改请求头中的origin为目标服务器地址
  pathRewrite: {
    '^/remote-api': '',  // 将路径前缀/remote-api替换为空
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath));
for (const key in routers) {
  app.use('/api', routers[key]);
}
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 404处理
app.use(function(req, res, next) {
  res.send('404')
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error');
});

// 自动升级
client.autoUpgrade()
  .then(() => {
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

