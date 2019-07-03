'use strict'
/**
 * 将csrf token存入 ctx.locals
 * 渲染ejs时会自动将ctx.locals并到 app.locals中
 */
module.exports = app => {
    // 验证用户是否登录
    return async function (ctx, next) {
        ctx.locals.config = app.config
        ctx.locals.csrf = ctx.csrf
        // 定义一个当前用户
        ctx.locals.current_user = null

        const {user} = ctx

        if (!user) {
            return await next();
        }
        ctx.locals.current_user = user
        await next()
    }
}