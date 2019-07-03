let stratumList = null
function regWaterBtn(evt) {
    bimEngine.searchElementsBySql("(name='族' and txtvalue like 'SK%')", function (res, sql) {
        if (!res.success) return
        stratumList = res.list
    })
    $('#waterMode').draggable()
    let flag = !1
    $('#waterBtn').on('click', function () {
        const model = new Model(bimEngine)
        if (flag) {
            resetWaterTable()
            flag = !1
            return
        }
        const RGBA = [0.741, 0.741, 0.741, 0.3]
        if (!stratumList) return 
        for (let i = 0; i < stratumList.length; i++) {
            const element = stratumList[i]
            model.changeElementRGBA(element.Element.GlobalId, RGBA)
        }
        flag = 1
        const waterConditionAjaxConfig = {
            url: '/getWaterColor',
            data: {
                modelId: projId
            },
            success: function (data, textStatus, jqXHR) {
                if (textStatus !== 'success' || jqXHR.status !== 200) return
                const model = new Model(bimEngine)
                for (let i = 0; i < data.length; i++) {
                    const element = data[i]
                    if(element.stratumLevel === 7) continue
                    model.changeElementRGBA(element.stratumId, element.stratumColor)
                }
            },
            dataType: 'json'
        }
        $.get(waterConditionAjaxConfig)
    })
}

function resetWaterTable() {
    const model = new Model(bimEngine)
    for (let i = 0; i < stratumList.length; i++) {
        const element = stratumList[i]
        model.resetElementRGBA(element.Element.GlobalId)
    }
    $('#waterMode').hide()
}