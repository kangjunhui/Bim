/**
 * 设置构件的显示和隐藏
 * @param {String} ele 构件id或者[id,id,id...]
 * @param {Boolean} flag true: 显示; false: 隐藏
 */
function setElementVisible(ele, flag) {
    if (!ele) return
    Array.isArray(ele) ? bimEngine.setElementListVisible(ele, flag) : bimEngine.setElementVisible(ele, flag)
}
/**
 * 设置构件的高亮与否
 * @param {String} ele 构件id或者[id,id,id...]
 * @param {Boolean} flag true: 高亮; false: 取消高亮
 */
function setElementHighLight(ele, flag) {
    if (!ele) return
    const hlmanager = bimEngine.getHighlightManager()
    flag ? (Array.isArray(ele) ? hlmanager.highlightElementList(ele) : hlmanager.highlightElement(ele)) : (Array.isArray(ele) ? hlmanager.unHighlightElementList(ele) : hlmanager.unHighlightElement(ele))
}
/**
 * 飞向某个构件的包围盒中心
 * 距离为包围盒大小的倍数 
 * @param {String} gid 构件id
 * @param {Number} times 倍数
 * @param {Function} cb 回调函数
 */
function flyToEleBox(gid, times, cb) {
    if (!gid) return
    bimEngine.flyToElementByBox(gid, times, cb)
}
/**
 * 飞向某个构件的包围盒中心
 * @param {String} gid 构件id
 * @param {Number} dis 飞的距离(mm)
 */
// function flyToEleDis(gid, dis) {
//     if (!gid) return
//     bimEngine.flyToElementByDistance(gid, dis, function() {})
// }
/**
 * 清除高亮构件 恢复初始视角
 */
function resetModel() {
    const hlmanager = bimEngine.getHighlightManager()
    hlmanager.clearHighlightElementList()
    // bimEngine.resetCameraLook(true)
}