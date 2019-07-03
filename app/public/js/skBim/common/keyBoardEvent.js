function regShiftEvent() {
    const canvasDom = document.getElementById(bimEngine.startSettings.renderDomId)
    canvasDom.addEventListener('keydown', _keydown, false)
    canvasDom.addEventListener('keyup', _keyup, false)
}

/**
 * 
 * @param {*} event 
 */
function _keydown(event) {
    if (event.keyCode == 16) {
        if (!bimEngine.getRectSelectManager().isInProcess()) {
            bimEngine.getRectSelectManager().start()
        }

    }
}
/**
 * 
 * @param {*} event 
 */
function _keyup(event) {
    if (event.keyCode == 16) {
        bimEngine.getRectSelectManager().end()
    }
}

function rectSelectExecuted(evt) {
    let promises = []
    let changedIdList = evt.args.idlist
    const ch = $('#pointOnly').prop("checked")
    if (ch) {
        changedIdList = changedIdList.filter(ele=> {
            return allPointGids.includes(ele)
        })
    }
    let hmgr = bimEngine.getHighlightManager()
    hmgr.clearHighlightElementList()
    setElementHighLight(changedIdList, 1)
    if (changedIdList.length === 0) {
        $('#rectSelectCheck').prop('checked', false)
        $('#rectSelect tbody').html('')
        $('#rectSelect').show()
        return
    }
    changedIdList.forEach(eleId => {
        let promise = new Promise((resolve, reject) => {
            bimEngine.getElementById(eleId, (success, ele) => {
                success ? resolve(ele) : reject(`获取ID为${eleId}的构件详细信息出错!`)
            })
        })
        promises.push(promise)
    })
    Promise.all(promises).then(eles => {
        let arr = []
        let allEles = []
        eles.forEach(ele => {
            let PropertySets = ele.PropertySets
            let eleId = ele.GlobalId
            allEles.push(eleId)
            PropertySets.forEach(set => {
                if (set.Name === 'Revit') {
                    arr.push({
                        name: set.PropertyList[1].NominalValue,
                        eleId
                    })
                }
            })
        })
        let newArr = []
        let names = []
        arr.forEach(ele => {
            if (names.includes(ele.name)) {
                for (let i = 0; i < newArr.length; i++) {
                    const element = newArr[i]
                    if (element.name === ele.name) {
                        element.ids.push(ele.eleId)
                    }
                }
            } else {
                newArr.push({
                    name: ele.name,
                    id: ele.eleId,
                    ids: [ele.eleId]
                })
                names.push(ele.name)
            }
        })
        let html = ''
        for (let i = 0; i < newArr.length; i++) {
            const element = newArr[i]
            html += (`<tr>
        <td class="with-checkbox">
          <div class="checkbox checkbox-css">
            <input type="checkbox" value="" id=${element.id} checked />
            <label for="${element.id}">&nbsp;</label>
          </div>
        </td>
        <td>${element.name}</td>
        <td>${element.ids.length}</td>
      </tr>`)
        }
        $('#rectSelect tbody').html('')
        $('#rectSelect tbody').html(html)
        for (let i = 0; i < newArr.length; i++) {
            const element = newArr[i]
            $(`#${element.id}`).on('change', function () {
                let ch = $(this).prop("checked")
                let judge = []
                let loadPropertyInfoArr = []
                for (let i = 0; i < newArr.length; i++) {
                    const element = newArr[i]
                    let ch = $(`#${element.id}`).prop('checked')
                    if (!judge.includes(ch)) {
                        judge.push(ch)
                    }
                    loadPropertyInfoArr.push(ch)
                }
                if (judge.length === 1) {
                    $('#rectSelectCheck').prop('checked', judge[0])
                }
                loadPropertyInfoArr = loadPropertyInfoArr.filter(ele => ele === true)
                if (loadPropertyInfoArr.length === 1) {
                    let id = $('#rectSelect tbody input:checked').prop('id')
                    for (let i = 0; i < newArr.length; i++) {
                        const element = newArr[i]
                        if (element.id === id && element.ids.length === 1) {
                            bimEngine.getElementById(id, function (success, element) {
                                if (success) selectedEle = element
                                propertyForm()
                            })
                        }
                    }
                }
                ch ? hmgr.highlightElementList(element.ids) : hmgr.unHighlightElementList(element.ids)
            })
        }
        $('#rectSelectCheck').prop('checked', true)
        $('#rectSelectCheck').on('change', function () {
            let ch = $(this).prop("checked")
            for (let i = 0; i < newArr.length; i++) {
                const element = newArr[i]
                $(`#${element.id}`).prop('checked', ch)
            }
            ch ? hmgr.highlightElementList(allEles) : hmgr.unHighlightElementList(allEles)
        })
        $('#rectSelect').show()
        $('#rectSelect').draggable()
    }).catch(err => {
        throw err
    })
}

function regEnterEvent() {
    $('#propertyInfo :input').each(function (index, ele) {
        $(ele).bind('keydown', function (event) {
            if (event.keyCode === 13) {
                const currentTarget = event.currentTarget
                let pros = []
                pros.push({
                    name: currentTarget.dataset.name,
                    value: currentTarget.value,
                    propset: currentTarget.dataset.propset,
                    action: 'update'
                })
                bimEngine.updateElementProperties(selectedEle.GlobalId, pros, function (data) {
                    if (data.success) $(currentTarget).blur()
                })
            }
        })
    })
}