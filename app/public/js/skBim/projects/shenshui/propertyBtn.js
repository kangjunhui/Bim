const allPointGids = []
function regPropertyBtn(){
    // 维护一个全部测点的数组 作测点模式用
    bimEngine.searchElementsBySql("(name='测点编号')", function (res, sql) {
        if (!res.success) return
        let eles = res.list
        for (let i = 0; i < eles.length; i++) {
            allPointGids.push(eles[i].Element.GlobalId)
        }
    })
    $('#propertyInfo').draggable()
    // 属性按钮事件
    $('#propertyBtn').on('click', function () {
        $('#propertyInfo').toggle()
        if (selectedEle === null) return
        propertyForm()
    })

}

/**
 * 将单个构件的属性信息填充到表格中
 */
function propertyForm() {
    let container = $('#propertyInfo tbody')
    container.html('')
    let propertySets = []
    let propertySet = {
        Name: '公有属性',
        PropertyList: [{
                Name: 'Name',
                NominalValue: selectedEle.Name,
            },
            {
                Name: 'FileName',
                NominalValue: selectedEle.FileName,
            }
        ]
    }
    propertySets.push(propertySet)
    const needarr = ['Revit', '尺寸标注', '阶段化', '文字']
    selectedEle.PropertySets.forEach(function (currentValue) {
        if (needarr.includes(currentValue.Name)) {
            propertySets.push(currentValue)
        }
    })
    popupList(container, propertySets)
}
/**
 * 
 * @param {*} body 
 * @param {*} sets 
 */
function popupList(body, sets) {
    sets.forEach(function (set) {
        var tr = '<tr class="active"><td colspan=\"2\">' + set.Name + '</td></tr>'
        body.append(tr)
        set.PropertyList.forEach(function (prop) {
            var proptr = `<tr><td>${prop.Name}</td><td ><span>${prop.NominalValue}</span></td></tr>`
            body.append(proptr)
        })
    })
}


