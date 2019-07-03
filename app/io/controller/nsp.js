const Controller = require('egg').Controller
const XLSX = require('xlsx')

class NspController extends Controller {
  async exchange() {
    const {
      ctx,
      app
    } = this
    const message = ctx.args[0] || {}
    const socket = ctx.socket
    const client = socket.id

    try {
      const {
        target,
        payload
      } = message
      if (!target) return
      const msg = ctx.helper.parseMsg(payload, {
        client,
        target
      })
      socket.emit(target, msg)
    } catch (error) {
      app.logger.error(error)
    }
  }

  async receiveFile() {
    const {ctx, app, service} = this
    const message = ctx.args[0] || {}
    const {socket} = ctx
    const {target, payload} = message
    const {modelId} = payload
    if (!target || !payload) return

    try {
      const workbook = XLSX.read(payload.file, {type: 'buffer'})
      const sheetName = workbook.SheetNames[0]
      const wkJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {defval: ''})
      const risks = []
      for (let i = 0, length = wkJson.length; i < length; i++) {
        risks.push({
          solum: wkJson[i]['分布土层'].split(','),
          prjObj: wkJson[i]['工程对象'],
          strategy: wkJson[i]['应对策略'],
          riskFeature: wkJson[i]['风险特征'],
          riskLevel: wkJson[i]['风险等级'],
          modelId: modelId
        })
      }
      const risksNum = await service.risk.getRisksCount(modelId)
      if (risksNum) {
        const {ok} = await service.risk.deleteRisks(modelId)
        if(!ok) throw new Error('删除旧风险数据出错!')
      }
      const flag = await service.risk.insertRisks(risks)
      const msg = flag? '数据解析成功!': '数据解析失败!'
        socket.emit(target, {
          msg: msg,
          success: 1
        })
    } catch (error) {
      app.logger.error(error)
      socket.emit(target, {
        msg: error,
        success: 1
      })
    }
  }
}

module.exports = NspController