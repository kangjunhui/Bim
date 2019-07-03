'use strict'

module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    const ridkSchema = new Schema({
        // 土层
        solum: [String],
        prjObj: String,
        strategy: String,
        riskFeature: String,
        riskLevel: String,
        modelId: String
        
    })

    ridkSchema.index({modelId: 1})

    return mongoose.model('risks', ridkSchema)
}