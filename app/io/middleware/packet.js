module.exports = app => {
    return async (ctx, next) => {
      // const {socket} = ctx
      // const {id} = socket
      // socket.emit(id, {
      //   msg: 'excel数据已收到,正在解析!',
      //   success: !1
      // })
      await next()
    }
  }