// module.exports = () => {
//   return async (ctx, next) => {
//     const { app, socket} = ctx
//     const id = socket.id;
//     const nsp = app.io.of('/')
//     const query = socket.handshake.query

//     // 用户信息
//     const { room, userId } = query
//     const rooms = [ room ]

//     await next()
//   }
// }