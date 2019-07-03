'use strict'

module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    const waterSchema = new Schema({
       modelId: {type: String},
       stratumId: {type: String},
       stratumColor: {type: Array},
       stratumLevel: {type: Number}
    })

    waterSchema.index({modelId: 1})
    waterSchema.index({stratumId: 1})
    
    return mongoose.model('water', waterSchema)
}