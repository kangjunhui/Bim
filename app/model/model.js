'use strict'

module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    const modelSchema = new Schema({
        pname: { type: String },
        pguid: { type: String },
        img_url: { type: String }
    })

    modelSchema.index({pguid: 1})

    return mongoose.model('models', modelSchema)
}