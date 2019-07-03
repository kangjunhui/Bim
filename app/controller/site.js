'use strict';

const Controller = require('egg').Controller;

class SiteController extends Controller {
  async index() {
    const {ctx} = this
    const {current_user} = ctx.locals
    current_user? await ctx.render('index'): await ctx.redirect('/')
  }
}

module.exports = SiteController;
