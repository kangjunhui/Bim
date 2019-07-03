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
        if ($('#waterMode').is(':visible')) {
            resetWaterTable()
            return
        }
        $('#waterMode').toggle()
        const RGBA = [0.741, 0.741, 0.741, 0.3]
        if (!stratumList) return
        for (let i = 0; i < stratumList.length; i++) {
            const element = stratumList[i]
            model.changeElementRGBA(element.Element.GlobalId, RGBA)
        }
        $('#waterMode tbody').html('')

        const colorRGBA = [
            [127, 255, 212],
            [0, 255, 0],
            [64, 244, 208],
            [0, 255, 255],
            [0, 153, 255],
            [0, 0, 255],
            [0, 51, 153],
            [255, 255, 255]
        ]
        const colorRGB = [
            'rgb(127, 255, 212)',
            'rgb(0, 255, 0)',
            'rgb(64, 244, 208)',
            'rgb(0, 255, 255)',
            'rgb(0, 153, 255)',
            'rgb(0, 0, 255)',
            'rgb(0, 51, 153)',
            'rgb(255, 255, 255)'
        ]
        flag = 1
        let html = ''
        const waterConditionAjaxConfig = {
            url: '/getWaterColor',
            data: {
                modelId: projId
            },
            success: function (data, textStatus, jqXHR) {
                if (textStatus !== 'success' || jqXHR.status !== 200) return
                for (let i = 0; i < stratumList.length; i++) {
                    const element = stratumList[i]
                    const guid = element.Element.GlobalId
                    html += `<tr>
                    <td >${element.HitMessage.split('_')[1]}</td>
                    <td class="with-form-control">
                        <select id=${'a'+guid} class="form-control">
                            <option value='7'>--请选择水层--</option>
                            <option value='0'>潜水含水层</option>
                            <option value='1'>微承压含水层</option>
                            <option value='2'>第Ⅰ承压含水层</option>
                            <option value='3'>第Ⅱ承压含水层</option>
                            <option value='4'>第Ⅲ承压含水层</option>
                            <option value='5'>第Ⅳ承压含水层</option>
                            <option value='6'>第Ⅴ承压含水层</option>
                          </select>
                      </td>
                  </tr>`
                }
                $('#waterMode tbody').html(html)
                const model = new Model(bimEngine)
                for (let i = 0; i < data.length; i++) {
                    const element = data[i]
                    if(element.stratumLevel === 7) continue
                    $(`#a${element.stratumId}`).val(element.stratumLevel)
                    model.changeElementRGBA(element.stratumId, element.stratumColor)
                    $(`#a${element.stratumId}`).css('background-color', colorRGB[element.stratumLevel])
                    if(element.stratumLevel > 3) {
                        $(`#a${element.stratumId}`).css('color', 'white')
                    }
                }

                $('#waterMode select').on('change', function (evt) {
                    const selecedOption = evt.currentTarget
                    const color = colorRGB[selecedOption.value]
                    const rgb = colorRGBA[selecedOption.value].map(c => {
                        return c / 255
                    })
                    rgb.push(0.8)
                    const model = new Model(bimEngine)
                    $(`#${selecedOption.id}`).css('background-color', color)
                    model.changeElementRGBA(`${selecedOption.id.slice(1)}`, rgb)
                    if (selecedOption.value > 3 && selecedOption.value < 7) {
                            $(`#${selecedOption.id}`).css('color', 'rgb(255, 255, 255)')
                    }
                    if (selecedOption.value === '7') {
                        $(`#${selecedOption.id}`).css('color', 'rgb(73, 80, 87)')
                    }
                    const csrftoken = Cookies.get('csrfToken')
                    const waterAjaxConfig = {
                        url: '/saveWaterColor',
                        headers: {
                            'x-csrf-token': csrftoken
                        },
                        data: {
                            modelId: projId,
                            stratumId: `${selecedOption.id.slice(1)}`,
                            stratumColor: rgb,
                            stratumLevel: selecedOption.value
                        },
                        success: function (data, textStatus, jqXHR) {
                            if (textStatus !== 'success' || jqXHR.status !== 200) return
                        },
                        dataType: 'json'
                    }
                    $.post(waterAjaxConfig)
                })
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