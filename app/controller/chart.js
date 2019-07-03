'use strict'

const Controller = require('egg').Controller

class ChartController extends Controller {
    async getCommonPoint() {
        const {
            ctx
        } = this
        const {
            pid,
            pointName,
            startDT,
            endDT
        } = ctx.query
        const result = await ctx.curl(`http://47.97.46.65:8825/api/MonitorData/GetPointHistoryCurveByPointName`, {
            method: 'GET',
            contentType: 'json',
            headers: {
                Authorization: 'Auth C3BmM9VeKtALBmJ0hflG0w0pRe92VZW2oIoYpjHMoikokvXpGh'
            },
            data: {
                pid: pid,
                pointName: pointName,
                startDT: startDT,
                endDT: endDT
            },
            dataType: 'json',
            timeout: [3000, 30000]
        })
        ctx.status = result.status
        ctx.set(result.headers)
        ctx.body = result.data
    }

    async getProjectPointStatus () {
        const {ctx} = this
        const {pitID} = ctx.query
        const result = await ctx.curl(`http://47.97.46.65:8825/api/SecurityWarning/GetProjectPointStatus`, {
            method: 'GET',
            contentType: 'json',
            headers: {
                Authorization: 'Auth C3BmM9VeKtALBmJ0hflG0w0pRe92VZW2oIoYpjHMoikokvXpGh'
            },
            data: {
                pitID: pitID
            },
            dataType: 'json',
            timeout: [3000, 30000]
        })
        ctx.status = result.status
        ctx.set(result.headers)
        ctx.body = result.data
    }
}

module.exports = ChartController