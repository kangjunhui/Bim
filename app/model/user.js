'use strict'

module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema

    const userSchema = new Schema({
        name: { type: String },
        pass: { type: String },
        accessToken: { type: String }
    })

    userSchema.index({accessToken: 1})

    return mongoose.model('users', userSchema)
}