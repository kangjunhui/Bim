'use strict';

const Controller = require('egg').Controller;

class WaterController extends Controller {
  async saveWaterColor () {
    const {ctx, service} = this
    const reqBoj = ctx.request.body
    const waterCondition = await service.water.createOrUpdateWater(reqBoj)
    ctx.body = waterCondition
  }

  async getWaterColor () {
    const {ctx, service} = this
    const modelId = ctx.query.modelId
    const waterInfo = await service.water.getWaterColor(modelId)
    ctx.body = waterInfo
  }
}

module.exports = WaterController;
