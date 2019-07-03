'use strict';

module.exports = appInfo => {
    const config = {}
    config.cluster = {
        listen: {
            port: 5000,
            hostname: '127.0.0.1:27017',
          }
    }
    config.mongoose = {
        url: 'mongodb://127.0.0.1:27017/bimService',
        options: {}
    }
    return config
}