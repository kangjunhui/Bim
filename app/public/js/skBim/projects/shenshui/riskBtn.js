const stratumDateMap = new Map()
function regRiskBtn(evts) {
    bimEngine.searchElementsBySql("(name='族' and txtvalue like 'SK%')", function (res, sql) {
        if (!res.success) return
        const stratumTreeData = []
        for (let i = 0; i < res.list.length; i++) {
            const element = res.list[i]
            const id = element.Element.GlobalId
            const text = element.Element.Name.split(':')[1].split('_')[1]
            stratumTreeData.push({
                id: id,
                text: text
            })
            stratumDateMap.set(text, id)
        }
        const lastChild = stratumTreeData.pop()
        stratumTreeData.splice(11, 0, lastChild)

        const projectTreeAjaxConfig = {
            url: '/getRiskInfo',
            data: {
                modelId: projId
            },
            success: function (data, textStatus, jqXHR) {
                if (textStatus !== 'success' || jqXHR.status !== 200) return
                const projNames = []
                const projData = []
                for (let i = 0; i < data.length; i++) {
                    const element = data[i]
                    if (projNames.includes(element.prjObj)) {
                        for (let j = 0; j < projData.length; j++) {
                            let ele = projData[j]
                            if (ele.text === element.prjObj) {
                                projData[j].children = [...new Set(projData[j].children.concat(element.solum))]
                            }
                        }
                    } else {
                        projNames.push(element.prjObj)
                        projData.push({
                            text: element.prjObj,
                            children: element.solum
                        })
                    }
                }
                const projTreeData = []
                for (let i = 0; i < projData.length; i++) {
                    const element = projData[i]
                    projTreeData.push({
                        text: element.text,
                        children: []
                    })
                    for (let j = 0; j < element.children.length; j++) {
                        const ele = element.children[j]
                        projTreeData[i].children.push({
                            text: ele
                        })
                    }
                }
                const projectTree = $("#projectTree").jstree({
                    plugins: ["wholerow", "types"],
                    core: {
                        data: projTreeData,
                        multiple: false
                    },
                    types: {
                        "default": {
                            icon: "fa fa-cubes text-primary fa-lg"
                        }
                    }
                })
                let preSelectedNode = null
                projectTree.on('changed.jstree', function (e, data) {
                    const selectNode = data.node
                    if (selectNode.parent === '#') return
                    const model = new Model(bimEngine)
                    let projectTreeIns = $('#projectTree').jstree(true)
                    const parent = projectTreeIns.get_node({
                        id: selectNode.parent
                    })
                    switch (data.action) {
                        case "select_node":
                            $('#riskInfo').show()
                            if (preSelectedNode) model.setElementHighLight(stratumDateMap.get(preSelectedNode.text), !1)
                            model.setElementHighLight(stratumDateMap.get(selectNode.text), 1)
                            preSelectedNode = selectNode
                            updateRisk(selectNode.text, parent.text)
                            break
                        case "deselect_node":
                            $('#riskInfo').hide()
                            break
                    }
                })
            },
            dataType: 'json'
        }
        $.get(projectTreeAjaxConfig)

        const stratumTree = $("#stratumTree").jstree({
            plugins: ["wholerow", "checkbox", "types"],
            core: {
                data: stratumTreeData,
                multiple: false
            },
            types: {
                "default": {
                    icon: "fa fa-cubes text-primary fa-lg"
                }
            }
        })
        let preSelectedNode = null
        stratumTree.on('changed.jstree', function (e, data) {
            const selectNode = data.node
            const model = new Model(bimEngine)
            switch (data.action) {
                case "select_node":
                    $('#riskInfo').show()
                    if (preSelectedNode) model.setElementHighLight(preSelectedNode.id, !1)
                    model.setElementHighLight(selectNode.id, 1)
                    preSelectedNode = selectNode
                    updateRisk(selectNode.text)
                    break
                case "deselect_node":
                    $('#riskInfo').hide()
                    model.setElementHighLight(preSelectedNode.id, !1)
                    break
            }
        })

        /**
         * 根据土层和模型名 查风险相关数据
         * @param {String} solum 
         */
        function updateRisk(...args) {
            let data = null
            if (args.length === 1) {
                data = {
                    modelId: projId,
                    solum: args[0]
                }
            } else {
                data = {
                    modelId: projId,
                    solum: args[0],
                    prjObj: args[1]
                }
            }
            const config = {
                url: '/getRiskInfo',
                data: data,
                success: function (data, textStatus, jqXHR) {
                    if (textStatus !== 'success' || jqXHR.status !== 200) return

                    $('#riskInfo').html('')
                    if (data.length === 0) {
                        swal({
                            title: '该地层暂无地质风险!',
                            icon: 'success',
                            buttons: {
                                confirm: {
                                    text: "确定",
                                    className: "btn btn-success"
                                }
                            }
                        })
                        return
                    }
                    let html = ''
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i]
                        html += `  <div class="card">
                        <div class="card-header bg-success text-white pointer-cursor collapsed" data-toggle="collapse"
                          data-target=${'#a'+element._id} aria-expanded="false">
                          ${i+1}.${element.riskFeature} 
                        </div>
                        <div id=${'a'+element._id} class="collapse" data-parent="#riskInfo" style="">
                          <div class="card-body">
                            <img src="../public/img/risk/44.jpg" class="img-fluid" alt="">
                            <p style="font-size: 18px;padding-top:10px;">应对策略:</p> 
                            <p style="font-size: 14px;">${element.strategy}</p> 
                          </div>
                        </div>
                      </div>`
                    }
                    $('#riskInfo').html(html)
                },
                dataType: 'json'
            }
            jQuery.get(config)
        }
    })

    $('#riskInfo').draggable()
    $('#risk').draggable()
    $('#riskBtn').on('click', function () {
        $('#risk').toggle()
    })
}