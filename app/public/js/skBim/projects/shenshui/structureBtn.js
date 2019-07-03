let needShowEleList = []

function regStructureBtn(evt) {
    $('#structureTree').draggable()
    $('#structureBtn').on('click', function () {
        $('#structureTree').toggle()
    })
    // 模型树
    let modelTree = $('#modelTree').jstree({
        plugins: ["wholerow", "checkbox", "types"],
        core: {
            data: modelTreeData
        },
        types: {
            "default": {
                icon: "fa fa-building text-primary fa-lg"
            }
        }
    })

    modelTree.on('changed.jstree', function (e, data) {
        const model = new Model(bimEngine)
        let selectNode = data.node
        switch (data.action) {
            case "select_node":
                model.setElementHighLight(modelTreeDic[selectNode.id - 1], 1)
                break
            case "deselect_node":
                model.setElementHighLight(modelTreeDic[selectNode.id - 1], 0)
                break
        }
    })

    const riskTreeList = ['地层对象', '透镜体对象', '勘探孔']
    const stratumPromise = new Promise((resolve, reject) => {
        bimEngine.searchElementsBySql("(name='族' and txtvalue like 'SK%')", function (res, sql) {
            if (!res.success) reject(`查询${riskTreeList[0]}信息出错!`)

            resolve(res.list)
        })
    })
    const TJTTPromise = new Promise((resolve, reject) => {
        bimEngine.searchElementsBySql("(name='族' and txtvalue like 'FZGZ%')", function (res, sql) {
            if (!res.success) reject(`查询${riskTreeList[1]}信息出错!`)

            resolve(res.list)
        })
    })
    const holeNoPromise = new Promise((resolve, reject) => {
        bimEngine.searchElementsBySql("(name='HoleNo')", function (res, sql) {
            if (!res.success) reject('查询孔号出错!')

            resolve(res.list)
        })
    })

    const holePromise = new Promise((resolve, reject) => {
        bimEngine.searchElementsBySql(" (name='注释' and txtvalue like '%孔')", function (res, sql) {
            if (!res.success) reject('查询孔号出错!')

            resolve(res.list)
        })
    })

    Promise.all([stratumPromise, TJTTPromise, holeNoPromise, holePromise]).then(data => {
            const treeData = []
            // 生成地层树 元数据
            const stratumData = data[0]
            const stratumTreeData = {
                id: 1,
                text: riskTreeList[0],
                children: [],
                state: {
                    opened: false
                }
            }
            for (let i = 0; i < stratumData.length; i++) {
                const ele = stratumData[i].Element
                stratumTreeData.children.push({
                    id: ele.GlobalId,
                    text: ele.Name.split(':')[1].split('_')[1],
                    icon: 'fa fa-cube text-primary fa-lg',
                    state: {
                        selected: !0
                    }
                })
            }
            const lastChild = stratumTreeData.children.pop()
            stratumTreeData.children.splice(11, 0, lastChild)
            treeData.push(stratumTreeData)

            // 生成透镜体树 元数据
            const TJTData = data[1]
            const TJTTreeData = {
                id: 2,
                text: riskTreeList[1],
                children: [],
                state: {
                    selected: !0
                }
            }
            for (let i = 0; i < TJTData.length; i++) {
                const ele = TJTData[i].Element
                TJTTreeData.children.push({
                    id: ele.GlobalId,
                    text: TJTData[i].HitMessage.split('_')[1],
                    icon: 'fa fa-cube text-primary fa-lg',
                    state: {
                        selected: !0
                    }
                })
            }
            treeData.push(TJTTreeData)

            // 生成钻孔树 元数据
            const holeNoData = data[2]
            const holeData = data[3]
            const holeMap = new Map()
            const holeTreeData = {
                id: 3,
                text: riskTreeList[2],
                children: [],
                state: {
                    selected: !0
                }
            }
            for (let i = 0; i < holeNoData.length; i++) {
                const ele = holeNoData[i].Element
                const text = holeNoData[i].HitMessage.split(':')[1]
                holeTreeData.children.push({
                    id: ele.GlobalId,
                    text: text,
                    icon: 'fa fa-cube text-primary fa-lg',
                    state: {
                        selected: !0
                    }
                })
                const arr = []
                for (let j = 0; j < holeData.length; j++) {
                    if (holeData[j].HitMessage.includes(text)) {
                        arr.push(holeData[j].Element.GlobalId)
                    }
                }
                arr.push(ele.GlobalId)
                holeMap.set(ele.GlobalId, arr)
            }
            treeData.push(holeTreeData)
            // 监测对象树
            $('#riskObjTree').jstree({
                plugins: ["wholerow", "checkbox", "types"],
                core: {
                    data: treeData,
                },
                types: {
                    "default": {
                        icon: "fa fa-cubes text-primary fa-lg"
                    }
                }
            })

            $('#riskObjTree').on('select_node.jstree', function (e, data) {
                const model = new Model(bimEngine)
                selectNode = data.node
                let selectednodeIds = null
                if (selectNode.parent === '#') {
                    selectednodeIds = selectNode.children.map(ele => getSelectedEle(ele)).flat()
                } else {
                    selectednodeIds = getSelectedEle(selectNode.id)
                }
                model.setElementVisible(selectednodeIds, 1)
            })

            $('#riskObjTree').on('deselect_node.jstree', function (e, data) {
                const model = new Model(bimEngine)
                selectNode = data.node
                let selectednodeIds = null
                if (selectNode.parent === '#') {
                    selectednodeIds = selectNode.children.map(ele => getSelectedEle(ele)).flat()
                } else {
                    selectednodeIds = getSelectedEle(selectNode.id)
                }
                needShowEleList.push(selectednodeIds)
                model.setElementVisible(selectednodeIds, !1)
            })

            function getSelectedEle(id) {
                const selectedId = holeMap.get(id) || id
                return selectedId
            }
        })
        .catch(err => {
            console.log(err)
        })
}