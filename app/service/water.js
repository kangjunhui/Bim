'use strict';

const Service = require('egg').Service;

class WaterService extends Service {
    /**
     * 查询某底层是否已有地下水信息
     * 如果有那就更新 如果没有那就新建
     * @param {Object} query 
     */
    createOrUpdateWater(query) {
        if (!query) return
        return this.ctx.model.Water.findOneAndUpdate({
            modelId: query.modelId,
            stratumId: query.stratumId
        }, query, {
            new: true,
            upsert: true
        }).exec()
    }
    /**
     * 查询某个模型现有承压水的情况
     * @param {String} id 
     */
    getWaterColor(id) {
        if(!id) return
        return this.ctx.model.Water.find({modelId: id}).exec()
    }
}

module.exports = WaterService;