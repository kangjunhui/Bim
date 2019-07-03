module.exports = {
    // 封装数据格式
    parseMsg(payload = {}, metadata = {}) {
        const meta = Object.assign({}, {
            timestamp: Date.now(),
        }, metadata)
        return {
            meta,
            data: {
                payload
            }
        }
    }
}