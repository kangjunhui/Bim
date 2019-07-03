//  读取模型的楼层视角
/**
 */
$(document).ready(function () {
    var w = $("#infowaterBtn").width();
    $("#water_curve").css({ "width": $("#water_curve").width(w - 20)});
    //点击获取楼层
    $(".waterFloor").on('click', function () {
        var floor = $(this);
        if(floor.hasClass('waterFloor')){
            floor.removeClass('waterFloor').addClass('floor_back');
        }else {
            floor.removeClass('floor_back').addClass('waterFloor');
        }
    });
    //用水量统计
    var myChart = echarts.init(document.getElementById('water_curve'));
    myChart.setOption ({
        tooltip : {
            trigger: 'axis'
        },
        title : {
            text: '用水情况分析'
        },
        legend: {
            data:['2F','3F','4F','5F','6F','2F食堂']
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
            right: '5%',
            bottom: '1%',
            containLabel: true
        },
        // calculable : true,
        // dataZoom : {
        //     show : true,
        //     realtime: true,
        //     start : 0,
        //     end : 100
        // },
        xAxis : [{
            type : 'category',
            boundaryGap : false,
            data : ['2019年01月','2019年02月','2019年03月','2019年04月','2019年05月','2019年06月']
        }],
        yAxis : [{
            type: 'value',
            // boundaryGap: [-0.1, -0.1],
            axisLabel : {
                formatter: '{value}',
                lineStyle: {
                    color: '#dc143c'
                }
            }
        }],
        series : [
        //     {
        //     name: '整栋大楼',
        //     type: 'line',
        //     data: [712, 430, 578, 646, 561, 847]
        // },
            {
            name: '2F',
            type: 'line',
            data: [19, 12, 18, 18, 17 , 16]
        },{
            name: '3F',
            type: 'line',
            data: [51, 25, 36, 38, 38, 40]
        },{
            name: '4F',
            type: 'line',
            data: [31, 20, 27, 34, 38, 217]
        },{
            name: '5F',
            type: 'line',
            data: [20, 15, 20, 21, 18, 20]
        },{
            name: '6F',
            type: 'line',
            data: [33, 18, 26, 29, 25, 29]
        },{
            name: '2F食堂',
            type: 'line',
            data: [382,  231, 291, 326, 264, 338]
        }],

    });
});

function regwaterBtn(){
    //窗口可移动
    $('#infowaterBtn').draggable();
    $('#waterBtn').click(function(){
    // e.preventDefault();
    $('#infowaterBtn').toggle(); 
    });
}