'use strict';

const Controller = require('egg').Controller

class SignController extends Controller {
  async showLogin() {
    const { ctx }= this
    const {current_user} = ctx.locals
    current_user? await ctx.render('index'): await ctx.render('login')
  }

  async signout() {
    const { ctx } = this
    ctx.session = null
    ctx.logout()
    ctx.redirect('/')
  }
}

module.exports = SignController

