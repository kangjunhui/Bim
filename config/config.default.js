'use strict';

module.exports = appInfo => {
    const config = {};

    config.name = 'BimService'
    //  cookies 安全密钥
    config.keys = appInfo.name + '88qoQXAfzibn8vbu'
    //  配置渲染模板 ejs
    config.view = {
        defaultViewEngine: 'ejs',
        mapping: {
            '.html': 'ejs',
        }
    }
    // 配置mongodb
    config.mongoose = {
        url: 'mongodb://127.0.0.1:27017/bimService',
        options: {}
    }
    // 配置redis
    // config.redis = {
    //     client: {
    //         port: 6379,          // Redis port
    //         host: '127.0.0.1',   // Redis host
    //         password: '',
    //         db: 0
    //       }
    // }
    //  配置passport本地策略
    config.passportLocal = {
        usernameField: 'name',
        passwordField: 'pass',
    }
    // 加载中间件
    config.middleware = ['locals']
    // cookies中的授权标识name
    config.auth_cookie_name = 'Skgeo'
    // 配置socket.io
    config.io = {
        init: {},
        namespace: {
            '/': {
                connectionMiddleware: [],
                packetMiddleware: ['packet']
            },
            '/iframe': {
                connectionMiddleware: [],
                packetMiddleware: []
            }
        }
    } 
    config.security = {
        // domainWhiteList: ['*'],
        xframe: {
            enable: false,
          }
    }
    // config.cors = {
    //     origin: '*',
    //     allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    //   }
    // config.httpclient= {
    //     request: {
    //         timeout: 10000,
    //       }
    // }
    config.cluster = {
        listen: {
            port: 3000,
            hostname: '127.0.0.1',
          }
    }
    return config
}