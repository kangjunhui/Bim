let commonPointChart = null

function regChartBtn() {
    commonPointChart = new Chart($('#chartId'), {
        type: "line",
        data: {},
        options: {
            legend: {
                labels: {
                    fontColor: 'black',
                    boxWidth: 20
                },
                position: 'right'
            },
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            'minute': 'MM-DD',
                            'day': 'MM-DD',
                            'month': 'YYYY.MM',
                            'year': 'YYYY',
                        },
                        tooltipFormat: 'LL'
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return value + ' mm'
                        }
                    },
                    offset: true
                }]
            },
            layout: {
                padding: {
                    top: 30
                }
            },
            plugins: {}
        }
    })
    $('.input-daterange input').datepicker({
        language: 'zh-CN',
        autoclose: 1
    })
    $('.input-daterange input:first-child').datepicker('setDate', new Date('2018-1-1'))
    $('.input-daterange input:last-child').datepicker('setDate', new Date())
    $('.input-daterange input').each(function() {
        $(this).datepicker().on('changeDate', function (evt) {
        // 清空已有的三条数据
        sumData = []
        onceData = []
        rateData = []
        commonPointChart.config.data.datasets.length = 0
        const [...cacheDrawedPoints] = drawedPoints
        drawedPoints = []
        for (let i = 0; i < cacheDrawedPoints.length; i++) {
            const element = cacheDrawedPoints[i]
            updateChartAjax(element)
        }
        })
    })
    $('#chartBtn').on('click', function () {
        if ($('#toolbarDiv').height() > 240) {
            $('#toolbarDiv').height(58)
        } else {
            $('#toolbarDiv').height(242)
        }
        $('#chart').toggle()
        $('.chart_select').toggle()
    })
}

function closeChart() {
    drawedPoints = []
    commonPointChart.config.data.datasets.length = 0
    commonPointChart.update()
}