'use strict';

const Controller = require('egg').Controller;

class RiskController extends Controller {
  async getRiskInfo() {
    const {ctx, service} = this
    const query = ctx.query
    const risks = await service.risk.getRiskInfo(query)
    ctx.body = risks
  }
}

module.exports = RiskController;

