'use strict';

const Service = require('egg').Service;

class RiskService extends Service {
    /**
     * 批量插入风险信息
     * @param {Array} risks 
     */
    insertRisks(risks) {
        if (!Array.isArray(risks)) {
            return null
        }
        return this.ctx.model.Risk.insertMany(risks)

    }
    /**
     * 根据modelId查看已存在的风险数量
     * @param {String} modelId 
     */
    getRisksCount(modelId) {
        if (!modelId) {
            return null
        }
        const query = {modelId}
        return this.ctx.model.Risk.countDocuments(query).exec()
    }
    /**
     * 删除已知model的全部风险信息
     * @param {String} modelId 
     */
    deleteRisks(modelId) {
        if (!modelId) {
            return null
        }
        const query = {modelId}
        return this.ctx.model.Risk.deleteMany(query).exec()
    }

    getRiskInfo (query) {
        if (!query) return null

        return this.ctx.model.Risk.find(query).exec()
    }
}

module.exports = RiskService;