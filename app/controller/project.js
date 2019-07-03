'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async project() {
    const {ctx} = this
    const {current_user} = ctx.locals
    current_user? await ctx.render('project'): await ctx.redirect('/')
  }
}

module.exports = ProjectController;
