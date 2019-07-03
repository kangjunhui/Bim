  class Model {
    constructor(bimEngine) {
        this.bimEngine = bimEngine
    }
    /**
     * 设置构件的显示和隐藏
     * @param {String|String[]} gid  
     * @param {Boolean} flag 
     */
    setElementVisible(gid, flag) {
        if (!gid) return
        Array.isArray(gid) ? this.bimEngine.setElementListVisible(gid, flag) : this.bimEngine.setElementVisible(gid, flag)
    }
    /**
     * 设置构件的高亮与否
     * @param {String} gid 
     * @param {Boolean} flag 
     */
    setElementHighLight(gid, flag) {
        if (!gid) return
        const hlmanager = this.bimEngine.getHighlightManager()
        flag ? (Array.isArray(gid) ? hlmanager.highlightElementList(gid) : hlmanager.highlightElement(gid)) : (Array.isArray(gid) ? hlmanager.unHighlightElementList(gid) : hlmanager.unHighlightElement(gid))
    }
    /**
     * 飞向某个构件的包围盒中心
     * 距离为包围盒大小的倍数 
     * @param {String} gid 
     * @param {Number} times 
     * @param {Function} cb 
     */
    flyToEleBox(gid, times, cb) {
        if (!gid) return
        this.bimEngine.flyToElementByBox(gid, times, cb)
    }
    /**
     * 清除所有高亮构件 恢复初始视角
     */
    resetModel() {
        const hlmanager = this.bimEngine.getHighlightManager()
        hlmanager.clearHighlightElementList()
        this.bimEngine.resetCameraLook(true)
    }
    /**
     * 改变构件的透明度
     * @param {String} gid 
     * @param {Number} alpha 
     */
    changeElementAlpha(gid, alpha) {
        if (!gid) return
        this.bimEngine.changeElementAlpha(gid, alpha)
    }
    /**
     * 改变构件的颜色和透明度
     * @param {String} gid 
     * @param {Array} rgba 
     */
    changeElementRGBA(gid, rgba) {
        if (!gid) return
        this.bimEngine.changeElementRGBA(gid, rgba)
    }
    /**
     * 重置构件的rgba
     * @param {String} gid 
     */
    resetElementRGBA(gid) {
        this.bimEngine.resetElementRGBA(gid)
    } 
}