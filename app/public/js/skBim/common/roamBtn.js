let boomModelCh = false
let commonSlider = {
    factor: 0,
    step: 0.5,
    max: 10,
    list: null,
    center: null
}

function regRoamBtn() {
    $('#roam').draggable()
    // 漫游按钮事件
    $('#roamBtn').on('click', function () {
        $('#roam').toggle()
    })
    // 地面阴影按钮事件
    $('#groundShadow').on('change', function () {
        let ch = $(this).prop("checked")
        bimEngine.setShowGroundShadow(ch)
    })
    // 爆炸模式按钮事件
    $('#boomModel').on('change', function () {
        boomModelCh = $(this).prop("checked")
        // 隐藏地面
        bimEngine.showGround(!boomModelCh)
        if (boomModelCh) {
            bimEngine.requestHighSpeed()
            let alllist = bimEngine.getElementNodeList()
            let elist = []
            let box = new THREE.Box3()
            for (let i = 0; i < alllist.length; i++) {
                let node = alllist[i]
                if (node.Visible == true) {
                    let transform = bimEngine.getElementTransform(node.Id)
                    if (transform) {
                        transform.gid = node.Id
                        elist.push(transform)
                        box.union(transform.box)
                    }
                }
            }
            commonSlider = {
                factor: 0,
                step: 1,
                max: 50,
                list: elist,
                center: box.getCenter()
            }

        } else {
            commonSlider.factor = 0
            onExplodeStep(commonSlider.factor)
            bimEngine.removeHighSpeed()
        }
    })
    // 爆炸模式滑动条配置
    $('#boomModelSlider').slider({
        value: commonSlider.factor,
        animate: false,
        min: 0,
        max: commonSlider.max,
        step: commonSlider.step,
        range: "min",
        slide: function (event, ui) {
            if (boomModelCh === false) {
                return
            }
            commonSlider.factor = ui.value
            onExplodeStep(commonSlider.factor)
        }
    })
    // 相机平移滑动条配置
    $('#cameraPanSlider').slider({
        value: bimEngine.getCameraPanSpeed(),
        animate: true,
        min: 0.1,
        max: 10,
        step: 0.1,
        range: "min",
        slide: function (event, ui) {
            $("#cameraPanValue").val(ui.value)
            bimEngine.setCameraPanSpeed(ui.value)
        }
    })
    $("#cameraPanValue").val($("#cameraPanSlider").slider("value"))
    // 相机缩放滑动条配置
    $('#cameraZoomSlider').slider({
        value: bimEngine.getCameraZoomSpeed(),
        animate: true,
        min: 0.1,
        max: 10,
        step: 0.1,
        range: "min",
        slide: function (event, ui) {
            $("#cameraZoomValue").val(ui.value)
            bimEngine.setCameraZoomSpeed(ui.value)
        }
    })
    $("#cameraZoomValue").val($("#cameraZoomSlider").slider("value"))
    // 相机旋转滑动条配置
    $('#cameraRotateSlider').slider({
        value: bimEngine.getCameraRotateSpeed(),
        animate: true,
        min: 0.1,
        max: 10,
        step: 0.1,
        range: "min",
        slide: function (event, ui) {
            $("#cameraRotateValue").val(ui.value);
            bimEngine.setCameraRotateSpeed(ui.value);
        }
    })
    $("#cameraRotateValue").val($("#cameraRotateSlider").slider("value"))
}
/**
 * 移动每一个node节点  移动的方向和距离为  原方向点和坐标乘以系数
 * @param {*} factor 坐标变换系数 也就是移动滑条的时候数值  
 */
function onExplodeStep(factor) {
    let elist = commonSlider.list
    let center = commonSlider.center
    let vec = new THREE.Vector3()
    for (let i = 0; i < elist.length; i++) {
        let transform = elist[i]
        vec.copy(transform.center).sub(center)
        vec.multiplyScalar(factor)
        transform.position.copy(vec)
        bimEngine.transformElement(transform.gid, transform)
    }
}