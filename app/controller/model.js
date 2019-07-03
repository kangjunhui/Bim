'use strict';

const Controller = require('egg').Controller;

class ModelController extends Controller {
  async model() {
    const {ctx} = this
    const {current_user} = ctx.locals
    current_user ? await ctx.render('model') : await ctx.redirect('/')
  }

  async showmodel() {
    const {ctx} = this
    const monitorPort = ctx.query.userId || ''
    const modeltemp = ctx.query.modeltemp || 'showmodel'
    await ctx.render(modeltemp, {
      projId: ctx.params.projId,
      monitorPort: monitorPort
    })
  }
  async createModel() {
    const {ctx} = this
    await ctx.render('createModel')
  }
}

module.exports = ModelController;