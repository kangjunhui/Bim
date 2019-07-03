//  读取模型的楼层视角
/**
 */
$(document).ready(function () {
    var w = $("#infotemperatureBtn").width();
    $("#temperature_curve").css({ "width": $("#temperature_curve").width(w - 20)});
    //机房温度统计
    var myChart = echarts.init(document.getElementById('temperature_curve'));
    myChart.setOption ({
        title : {
            text: '机房温度分析'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['机房温度']
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        calculable : true,
        // dataZoom : {
        //     show : true,
        //     realtime: true,
        //     start : 0,
        //     end : 100
        // },
        xAxis : [
            {
                type : 'category',
                data : [
                    '201-06-15', '201-06-16', '201-06-17', '201-06-18', '201-06-19',
                    '201-06-20', '201-06-21', '201-06-22', '201-06-23', '201-06-24',
                    '201-06-25', '201-06-26', '201-06-27', '201-06-28', '201-07-01'
                ]
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'机房温度',
                type:'line',
                data:[55, 60, 57, 66, 50, 65, 55, 60, 57, 66, 50, 65, 55, 60, 55],
                barWidth : 20,
                itemStyle: {
                    normal: {
                        color: '#80ddd5'
                    }
                }
            }
        ]
    });
});


function regtemperatureBtn(){
    $('#infotemperatureBtn').draggable();
    $('#temperatureBtn').click(function(e){
    e.preventDefault();
    $('#infotemperatureBtn').toggle();
    });
}