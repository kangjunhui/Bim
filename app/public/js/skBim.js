'use strict'
let bimEngine = null
let selectedEle = null //当前选中的构件详细信息
const skBim = {
    initEngine() {
        bimEngine = new BIMVIZ.RenderEngine({
            projectId: projId,
            renderDomId: 'viewport',
            ip: "180.169.145.53",
            port: 7005,
            key: 'B3056CC9-13DB-4fcc-9FC3-6604D93304F4',
            resizeMode: 'fullpage',
            resourcePath: '../public/sdk/viz/data/',
            selectSettings: {
                cameraMove: false
            }
        })
    },
    loadingMessage() {
        let msgControl = new BIMVIZ.UI.DefaultMessageControl(bimEngine, 'messages')
    },
    regEvent() {
        // 用户单击构件触发的事件 回调拿到所点击构件的信息
        bimEngine.addListener(BIMVIZ.EVENT.OnPickElement, onPickElement)
        // 场景加载完成后触发的事件
        bimEngine.addListener(BIMVIZ.EVENT.OnSceneLoadCompleted, onSceneLoadCompleted)
        // 点中空白地区触发的事件
        bimEngine.addListener(BIMVIZ.SYS_EVENT.OnRaySelectNone, onRaySelectNone)
        // 场景概要信息加载完之后触发的事件 树结构
        bimEngine.addListener(BIMVIZ.EVENT.ProjectOverviewLoaded, projectOverviewLoaded)
        // 框选触发事件
        bimEngine.addListener(BIMVIZ.EVENT.OnRectSelectExecuted, onRectSelectExecuted)
    },
    init() {
        // 初始化引擎
        this.initEngine()
        // 初始化消息控件
        this.loadingMessage()
        // 初始化注册事件
        this.regEvent()

        bimEngine.start()
    }
}
/**
 * 单击构件后的触发事件
 * 目前取消bimviz自定义的单击事件
 * @param {Object} evt 
 */
function onPickElement(evt) {
    let selectEle = evt.args
    selectEle.cancel = true
    const ch = $('#pointOnly').prop("checked")
    if (ch) {
        if (allPointGids.includes(selectEle.elementId)) {
            customAction(selectEle)
        }
    } else {
        customAction(selectEle)
    }
}
/**
 * 场景加载完的回调事件
 * @param {*} evt 
 */
function onSceneLoadCompleted(evt) {
    // loadServerHtmlMarkers()
    $('#toolbarDiv').toggle()
    const model = new Model(bimEngine)
    cloudPicData.forEach(function (value, key) {
        model.changeElementRGBA(key, value)
    })
    // 云图形变
    // cloundTuMap.forEach((value, key) => {
    //     let transform = bimEngine.getElementTransform(key)
    //     transform.position.z = value * 10
    //     bimEngine.transformElement(key, transform)
    // }) 
}
/**
 * 点击空白处的回调事件
 * @param {*} evt 
 */
function onRaySelectNone(evt) {
    selectedEle = null
    $('#propertyInfo tbody').html('')
    $('#rectSelect input:checkbox').prop('checked', false)
}
/**
 * 各项目加载树结构的方法最好一致为loadTree()
 * 如有例外 需照加载loadTree()的方式 加载自定义的方法
 * @param {*} evt 
 */
function projectOverviewLoaded(evt) {
    // 加载通用按钮事件包括shift事件
    regPropertyBtn()
    regShiftEvent()
    regRoamBtn()
    socketInit()
    // 加载独立项目按钮事件
    if (typeof regTreeBtn != 'undefined' && regTreeBtn instanceof Function) regTreeBtn(evt)
    if (typeof regChartBtn != 'undefined' && regChartBtn instanceof Function) regChartBtn(evt)
    if (typeof uploadInit != 'undefined' && uploadInit instanceof Function) uploadInit(evt)
    if (typeof regRiskBtn != 'undefined' && regRiskBtn instanceof Function) regRiskBtn(evt)
    if (typeof regWaterBtn != 'undefined' && regWaterBtn instanceof Function) regWaterBtn(evt)
    if (typeof regStructureBtn != 'undefined' && regStructureBtn instanceof Function) regStructureBtn(evt)
    if (typeof regWaterBtn != 'undefined' && regWaterBtn instanceof Function) regWaterBtn(evt)
    if (typeof regsectionBtn !='undefined' && regsectionBtn instanceof Function) regsectionBtn(evt)
    if (typeof regfloorBtn !='undefined' && regfloorBtn instanceof Function) regfloorBtn(evt)
    if (typeof regvideoBtn !='undefined' && regvideoBtn instanceof Function) regvideoBtn(evt)
    if (typeof regtreeBtn !='undefined' && regtreeBtn instanceof Function) regtreeBtn(evt)
    if (typeof regwaterBtn !='undefined' && regwaterBtn instanceof Function) regwaterBtn(evt)
    if (typeof regelectricityBtn !='undefined' && regelectricityBtn instanceof Function) regelectricityBtn(evt)
    if (typeof regtemperatureBtn !='undefined' && regtemperatureBtn instanceof Function) regtemperatureBtn(evt)
}
/**
 * 框选操作后的回调事件
 * @param {*} evt 
 */
function onRectSelectExecuted(evt) {
    rectSelectExecuted(evt)
}
/**
 * 自定义选中构件后的操作
 * @param {String} selectEle 
 */
function customAction(selectEle) {
    const hlmanager = bimEngine.getHighlightManager()
    hlmanager.toggleHighlightElement(selectEle.elementId)
    bimEngine.getElementById(selectEle.elementId, function (success, element) {
        if (!success) return
        if (typeof modelToTree != 'undefined' && modelToTree instanceof Function) modelToTree(element)
        if (selectedEle === null) {
            selectedEle = element
            propertyForm()
        } else if (selectedEle.GlobalId === element.GlobalId) {
            return
        } else if ($('#propertyInfo').is(':visible')) {
            selectedEle = element
            propertyForm()
        } else {
            selectedEle = element
        }
    })
}