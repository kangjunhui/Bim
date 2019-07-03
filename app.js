'use strict'
/**
 * passportLocal策略验证
 * 将user信息 加入app.local 可以将user信息渲染页面
 */
module.exports = app => {

    const localHandler = async (ctx, { username, password }) => {
      
    const existUser = await ctx.service.user.getUserByLoginName(username)
  
      // 用户不存在
      if (!existUser) {
        return null
      }
  
      const equal = password === existUser.pass
      // 密码不匹配
      if (!equal) {
        return null
      }

      // 验证通过
      return existUser
    }

    app.passport.verify(async (ctx, user) => {
        const existUser = await localHandler(ctx, user)
        if (existUser) {
          // id存入Cookie, 用于验证过期.
          const auth_token = existUser._id + '$$$$' // 以后可能会存储更多信息，用 $$$$ 来分隔
          const opts = {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            signed: true,
            httpOnly: true,
          }
          ctx.cookies.set(app.config.auth_cookie_name, auth_token, opts) // cookie 有效期30天
        }
    
        return existUser
      });
    // 序列化用户信息到session 推荐精简信息 减小cookies体积
      app.passport.serializeUser(async (ctx, user) => {
        return {
          name: user.name
        }
      })
    // 反序列化req中的cookies 拿到用户信息
    // 每次请求都会检验cookies信息
      app.passport.deserializeUser(async (ctx, user) => {
         if (user) {
          const auth_token = ctx.cookies.get(ctx.app.config.auth_cookie_name, {
            signed: true
          })
    
          if (!auth_token) {
            return user
          }
    
          const auth = auth_token.split('$$$$')
          const user_id = auth[0]
          user = await ctx.service.user.getUserById(user_id)
    
          if (!user) {
            return user
          }
        }
    
        return user
      })
}

