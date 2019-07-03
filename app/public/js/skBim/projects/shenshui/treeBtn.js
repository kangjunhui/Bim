const treeMap = new Map()
const treeMapReverse = new Map()
let drawedPoints = []
let selectNode = null
let chartType = 1
// 累计变化数据
let sumData = []
// 本次变化数据
let onceData = []
// 变化速率数据
let rateData = []

function regTreeBtn(evt) {
    $('#chart_select').on('change', function (evt) {
        const selecedOption = evt.currentTarget
        chartType = parseInt(selecedOption.value)
        commonPointChart.config.data.datasets.length = 0
        switch (chartType) {
            case 1:
                sumData.forEach(ele => {
                    commonPointChart.config.data.datasets.push(ele)
                })
                commonPointChart.config.options.scales.yAxes[0] = {
                    ticks: {
                        callback: function (value, index, values) {
                            return value + ' mm'
                        }
                    }
                }
                break
            case 2:
                onceData.forEach(ele => {
                    commonPointChart.config.data.datasets.push(ele)
                })
                commonPointChart.config.options.scales.yAxes[0] = {
                    ticks: {
                        callback: function (value, index, values) {
                            return value + ' mm'
                        }
                    }
                }
                break
            case 3:
                rateData.forEach(ele => {
                    commonPointChart.config.data.datasets.push(ele)
                })
                commonPointChart.config.options.scales.yAxes[0] = {
                    ticks: {
                        callback: function (value, index, values) {
                            return value + ' mm/d'
                        }
                    }
                }
                break
        }
        commonPointChart.update()
    })
    // 监测指标
    bimEngine.searchElementsBySql("(name='测点编号')", function (res, sql) {
        if (!res.success) return
        let typeTreeName = []
        let typeTreeData = []
        let eles = res.list
        for (let i = 0; i < eles.length; i++) {
            let eleId = eles[i].Element.GlobalId
            let eleName = eles[i].Element.Name.split(':')[1]
            let no = eles[i].HitMessage.split(':')[1]
            treeMap.set(eleId, no)
            treeMapReverse.set(no, eleId)
            if (typeTreeName.includes(eleName)) {
                for (let i = 0; i < typeTreeData.length; i++) {
                    if (typeTreeData[i].text === eleName) {
                        typeTreeData[i].children.push({
                            id: eleId,
                            text: no
                        })
                    }
                }
            } else {
                typeTreeName.push(eleName)
                typeTreeData.push({
                    text: eleName,
                    children: [{
                        id: eleId,
                        text: no
                    }]
                })
            }
        }
        for (let i = 0; i < typeTreeData.length; i++) {
            const nodes = typeTreeData[i].children
            let strArr = [...nodes[0].text]
            let rule
            for (let j = 0; j < strArr.length; j++) {
                if (parseInt(strArr[j])) {
                    rule = j
                    break
                }
            }
            nodes.sort((a, b) => {
                a = a.text.slice(rule)
                b = b.text.slice(rule)
                return a - b
            })
        }
        initObjTree()
        let typeTree = $('#typeTree').jstree({
            plugins: ["wholerow", "checkbox", "types"],
            core: {
                data: typeTreeData
            },
            types: {
                "default": {
                    icon: "fa fa-map-marker text-green fa-lg"
                }
            }
        })

        typeTree.on('changed.jstree', function (e, data) {
            selectNode = data.node
            let selectedId = selectNode.parent === '#' ? (_.remove(data.selected, n => {
                return n === data.node.id
            }), data.selected[data.selected.length - 1]) : selectNode.id
            switch (data.action) {
                case "select_node":
                    selectNode.parent === '#' ? (updateChart(data.selected), setElementHighLight(data.selected, 1), flyToEleBox(selectedId, 60)) : (updateChart(selectedId), setElementHighLight(selectedId, 1), flyToEleBox(selectedId, 30))
                    break
                case "deselect_node":
                    selectNode.parent === '#' ? (data.selected.length === 0 ? (updateChart(data.selected), resetModel()) : (updateChart(data.selected), setElementHighLight(selectNode.children, 0), flyToEleBox(data.selected[data.selected.length - 1], 60))) : (data.selected.length === 0 ? (updateChart(selectedId), resetModel()) : (updateChart(selectedId), setElementHighLight(selectedId, 0), flyToEleBox(data.selected[data.selected.length - 1], 30)))
                    break
            }
        })
    })

    function initObjTree() {
        bimEngine.searchElementsBySql("(name='被测对象')", function (res, sql) {
            if (!res.success) return
            let objTreeName = []
            let objTreeData = []
            let eles = res.list
            for (let i = 0; i < eles.length; i++) {
                let eleId = eles[i].Element.GlobalId
                let no = eles[i].HitMessage.split(':')[1]
                if (objTreeName.includes(no)) {
                    for (let i = 0; i < objTreeData.length; i++) {
                        if (objTreeData[i].text === no) {
                            objTreeData[i].children.push({
                                id: eleId,
                                text: treeMap.get(eleId)
                            })
                        }
                    }
                } else {
                    objTreeName.push(no)
                    objTreeData.push({
                        text: no,
                        children: [{
                            id: eleId,
                            text: treeMap.get(eleId)
                        }]
                    })
                }
            }
            for (let i = 0; i < objTreeData.length; i++) {
                const nodes = objTreeData[i].children
                let strArr = [...nodes[0].text]
                let rule
                for (let j = 0; j < strArr.length; j++) {
                    if (parseInt(strArr[j])) {
                        rule = j
                        break
                    }
                }
                nodes.sort((a, b) => {
                    a = a.text.slice(rule)
                    b = b.text.slice(rule)
                    return a - b
                })
            }
            let objTree = $('#objTree').jstree({
                plugins: ["wholerow", "checkbox", "types"],
                core: {
                    data: objTreeData
                },
                types: {
                    "default": {
                        icon: "fa fa-map-marker text-green fa-lg"
                    }
                }
            })

            objTree.on('changed.jstree', function (e, data) {
                selectNode = data.node
                let selectedId = selectNode.parent === '#' ? (_.remove(data.selected, n => {
                    return n === data.node.id
                }), data.selected[data.selected.length - 1]) : selectNode.id
                switch (data.action) {
                    case "select_node":
                        selectNode.parent === '#' ? (updateChart(data.selected), setElementHighLight(data.selected, 1), flyToEleBox(selectedId, 60)) : (updateChart(selectedId), setElementHighLight(selectedId, 1), flyToEleBox(selectedId, 30))
                        break
                    case "deselect_node":
                        selectNode.parent === '#' ? (data.selected.length === 0 ? (updateChart(data.selected), resetModel()) : (updateChart(data.selected), setElementHighLight(selectNode.children, 0), flyToEleBox(data.selected[data.selected.length - 1], 60))) : (data.selected.length === 0 ? (updateChart(selectedId), resetModel()) : (updateChart(selectedId), setElementHighLight(selectedId, 0), flyToEleBox(data.selected[data.selected.length - 1], 30)))
                        break
                }
            })
            const ajaxPointStatusConfig = {
                url: '/getProjectPointStatus',
                data: {
                    pitID: 6
                },
                success: function (data, textStatus, jqXHR) {
                    if (textStatus !== 'success' || jqXHR.status !== 200) return

                    const objTree = $('#objTree').jstree(true)
                    const typeTree = $('#typeTree').jstree(true)
                    // 三种报警颜色 红 橙 黄
                    const HongRGBA = [1, 0, 0, 1]
                    const chengRGBA = [1, 0.647059, 0, 1]
                    const HuangRGBA = [1, 1, 0, 1]
                    const model = new Model(bimEngine)
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i]
                        const id = treeMapReverse.get(element.PntCode)
                        if (!id) continue
                        const objNode = objTree.get_node(id)
                        const typeNode = typeTree.get_node(id)
                        switch (element.AlarmState) {
                            case '黄色报警':
                                if (objNode) {
                                    const parent = objTree.get_parent(objNode)
                                    objTree.set_icon({
                                        id: parent
                                    }, 'fa fa-map-marker text-yellow fa-lg')
                                    objTree.set_icon({
                                        id
                                    }, 'fa fa-map-marker text-yellow fa-lg')
                                }
                                if (typeNode) {
                                    const parent = typeTree.get_parent(typeNode)
                                    typeTree.set_icon({
                                        id: parent
                                    }, 'fa fa-map-marker text-yellow fa-lg')
                                    typeTree.set_icon({
                                        id
                                    }, 'fa fa-map-marker text-yellow fa-lg')
                                    model.changeElementRGBA(id, HuangRGBA)
                                }
                                break
                            case '橙色报警':
                                if (objNode) {
                                    const parent = objTree.get_parent(objNode)
                                    objTree.set_icon({
                                        id: parent
                                    }, 'fa fa-map-marker text-warning fa-lg')
                                    objTree.set_icon({
                                        id
                                    }, 'fa fa-map-marker text-warning fa-lg')
                                }
                                if (typeNode) {
                                    const parent = typeTree.get_parent(typeNode)
                                    typeTree.set_icon({
                                        id: parent
                                    }, 'fa fa-map-marker text-warning fa-lg')
                                    typeTree.set_icon({
                                        id
                                    }, 'fa fa-map-marker text-warning fa-lg')
                                    model.changeElementRGBA(id, chengRGBA)
                                }
                                break
                            case '红色报警':
                                if (objNode) {
                                    const parent = objTree.get_parent(objNode)
                                    objTree.set_icon({
                                        id: parent
                                    }, 'fa fa-map-marker text-danger fa-lg')
                                    objTree.set_icon({
                                        id
                                    }, 'fa fa-map-marker text-danger fa-lg')
                                }
                                if (typeNode) {
                                    const parent = typeTree.get_parent(typeNode)
                                    typeTree.set_icon({
                                        id: parent
                                    }, 'fa fa-map-marker text-danger fa-lg')
                                    typeTree.set_icon({
                                        id
                                    }, 'fa fa-map-marker text-danger fa-lg')
                                    model.changeElementRGBA(id, HongRGBA)
                                }
                                break
                        }
                    }

                },
                dataType: 'json'
            }
            $.get(ajaxPointStatusConfig)
        })
    }

    $('#tree').draggable()
    $('#treeBtn').on('click', function () {
        $('#tree').toggle()
        closeTree()
    })
    $('a[data-toggle="tab"]').on('hide.bs.tab', function (e) {
        const preTree = $(`${e.target.hash}`).jstree(true)
        const model = new Model(bimEngine)
        if (e.target.innerText === '地层信息') {
            preTree.select_all(true)
            preTree.close_all()
            model.setElementVisible(needShowEleList.flat(), !0)
            return
        } 
        preTree.deselect_all(true)
        preTree.close_all()
        closeChart()
        resetModel()
    })
}

function closeTree() {
    selectNode = null
    let modelTree = $('#modelTree').jstree(true)
    if (modelTree) modelTree.deselect_all(true)
    let typeTree = $('#typeTree').jstree(true)
    if (typeTree) typeTree.deselect_all(true), typeTree.close_all()
    let objTree = $('#objTree').jstree(true)
    if (objTree) objTree.deselect_all(true), objTree.close_all()
    closeChart()
    resetModel()
}

function updateChart(selectedId) {
    if (Array.isArray(selectedId)) {
        const needDrawPoints = selectedId.filter(ele => {
            return !drawedPoints.includes(ele)
        })
        if (needDrawPoints.length !== 0) {
            for (let i = 0; i < needDrawPoints.length; i++) {
                updateChartAjax(needDrawPoints[i])
            }
        } else {
            const needRePoints = drawedPoints.filter(ele => {
                return !selectedId.includes(ele)
            })
            for (let i = 0; i < needRePoints.length; i++) {
                const index = drawedPoints.indexOf(needRePoints[i])
                drawedPoints.splice(index, 1)
                commonPointChart.config.data.datasets.splice(index, 1)
                sumData.splice(index, 1)
                onceData.splice(index, 1)
                rateData.splice(index, 1)
            }
            commonPointChart.update()
        }
    } else {
        if (drawedPoints.includes(selectedId)) {
            const index = drawedPoints.indexOf(selectedId)
            drawedPoints.splice(index, 1)
            sumData.splice(index, 1)
            onceData.splice(index, 1)
            rateData.splice(index, 1)
            commonPointChart.config.data.datasets.splice(index, 1)
            commonPointChart.update()
        } else {
            updateChartAjax(selectedId)
        }
    }
}

function updateChartAjax(id) {
    const pointName = treeMap.get(id)
    let chartUrl = '/getCommonPoint'
    const firstDate = $('.input-daterange input:first-child').datepicker('getDate') ? $('.input-daterange input:first-child').datepicker('getDate').toLocaleDateString() : '2018-1-1'
    const lastDate = $('.input-daterange input:last-child').datepicker('getDate') ? $('.input-daterange input:last-child').datepicker('getDate').toLocaleDateString() : (new Date()).toLocaleDateString()
    const ajaxConfig = {
        url: chartUrl,
        data: {
            pid: 6,
            pointName: pointName,
            startDT: firstDate,
            endDT: lastDate
        },
        success: function (data, textStatus, jqXHR) {
            if (textStatus !== 'success' || jqXHR.status !== 200) return

            ($('#treeTab [href="#typeTree"]').hasClass('active') || $('#treeTab [href="#objTree"]').hasClass('active')) ? drawedPoints.push(id): drawedPoints.push(selectedEle.GlobalId)
            // 对应三种不同的曲线
            let chartData1 = []
            let chartData2 = []
            let chartData3 = []
            for (let i = 0; i < data[0].MonitorPointDataList.length; i++) {
                chartData1.push({
                    x: data[0].MonitorPointDataList[i].MonitorDate,
                    y: data[0].MonitorPointDataList[i].TotalVariance
                })
                chartData2.push({
                    x: data[0].MonitorPointDataList[i].MonitorDate,
                    y: data[0].MonitorPointDataList[i].CurrentVariance
                })
                chartData3.push({
                    x: data[0].MonitorPointDataList[i].MonitorDate,
                    y: data[0].MonitorPointDataList[i].DailyVariance
                })
            }
            const color = chartColorNames[commonPointChart.config.data.datasets.length % chartColorNames.length]
            const bcolor = chartBackgroudColorNames[commonPointChart.config.data.datasets.length % chartColorNames.length]
            let newDataset1 = {
                label: pointName,
                borderColor: color,
                pointRadius: 2,
                fill: false,
                backgroundColor: bcolor,
                data: chartData1
            }
            sumData.push(newDataset1)

            let newDataset2 = {
                label: pointName,
                borderColor: color,
                pointRadius: 2,
                fill: false,
                backgroundColor: bcolor,
                data: chartData2
            }
            onceData.push(newDataset2)
            let newDataset3 = {
                label: pointName,
                borderColor: color,
                pointRadius: 2,
                fill: false,
                backgroundColor: bcolor,
                data: chartData3
            }
            rateData.push(newDataset3)
            switch (chartType) {
                case 1:
                    commonPointChart.config.data.datasets.push(newDataset1)
                    commonPointChart.config.options.scales.yAxes[0] = {
                        ticks: {
                            callback: function (value, index, values) {
                                return value + ' mm'
                            }
                        }
                    }
                    break
                case 2:
                    commonPointChart.config.data.datasets.push(newDataset2)
                    commonPointChart.config.options.scales.yAxes[0] = {
                        ticks: {
                            callback: function (value, index, values) {
                                return value + ' mm'
                            }
                        }
                    }
                    break
                case 3:
                    commonPointChart.config.data.datasets.push(newDataset3)
                    commonPointChart.config.options.scales.yAxes[0] = {
                        ticks: {
                            callback: function (value, index, values) {
                                return value + ' mm/d'
                            }
                        }
                    }
                    break
            }
            commonPointChart.update()
        },
        dataType: 'json'
    }
    $.get(ajaxConfig)
}