//  读取模型的楼层视角
/**
 */
$(document).ready(function () {
    var w = $("#infoelectricityBtn").width();
    $("#electricity_curve").css({ "width": $("#electricity_curve").width(w - 20)});
    //点击获取楼层
    $(".electricityFloor").on('click', function () {
        var floor = $(this);
        if(floor.hasClass('electricityFloor')){
            floor.removeClass('electricityFloor').addClass('floor_back');
        }else {
            floor.removeClass('floor_back').addClass('electricityFloor');
        }
    });
    //用电量统计
    var myChart = echarts.init(document.getElementById('electricity_curve'));
    myChart.setOption ({
        title : {
            text: '用电情况分析'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['3F','环境工程','2F食堂']
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
        xAxis : [
            {
                type : 'category',
                data : ['2019年01月','2019年02月','2019年03月','2019年04月','2019年05月','2019年06月']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'2F食堂',
                type:'line',
                data:[9040, 5880, 7520, 7800, 6920, 7040],
                barWidth : 20
            },{
                name:'3F',
                type:'line',
                data:[7680, 4760, 4400, 1640, 600, 2160],
                barWidth : 20
            },{
                name:'环境工程',
                type:'line',
                data:[1094, 813, 1176, 1144, 1051, 1141],
                barWidth : 20
            },
            // {
            //     name:'常用用电',
            //     type:'line',
            //     data:[30, 45, 41, 35, 48, 36, 43],
            //     barWidth : 20,
            //     itemStyle: {
            //         normal: {
            //             color: '#dd8080',
            //             barBorderRadius: 5
            //         }
            //     }
            // },
            // {
            //     name:'消防用电',
            //     type:'line',
            //     data:[36, 28, 24, 35, 31, 20, 22],
            //     barWidth : 20,
            //     itemStyle: {
            //         normal: {
            //             color: '#8093dd',
            //             barBorderRadius: 5
            //         }
            //     }
            // }
        ]

    });
});

function regelectricityBtn(){
    $('#infoelectricityBtn').draggable();
    $('#electricityBtn').click(function(e){
    e.preventDefault();
    $('#infoelectricityBtn').toggle();
    });
}