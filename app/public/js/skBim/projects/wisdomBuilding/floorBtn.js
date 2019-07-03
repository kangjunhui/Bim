//  读取模型的楼层视角
/**
 */

function regfloorBtn(){
    $('#infoLC').draggable();
        $('#floorBtn').click(function(e){
        e.preventDefault();
        $('#infoLC').toggle();
        loadJG();   
    });
    function loadLC(stroeys) {
    $('#lcContainer').empty();
   var bodyObj = $("#lcContainer");
   stroeys.forEach(function(stroey){
       var tr = '<tr styele="width:200px;height:30px">\
       <td data-id="'+stroey.Id+'">'+stroey.Name+'</td>\
       <td><button type="button" class="btn btn-success m-r-5 m-b-5">切换</button></td>\
                </tr>';
       bodyObj.append(tr);
   });
   var openLC = '<tr>\
   <td><button id="openAllLC" type="button" class="btn btn-primary m-r-5 m-b-5">还原楼层</button></td>\
                </tr>';
   bodyObj.append(openLC);
//    给id="lcContainer"下的除了最后一个button添加click
   $("#lcContainer button:not(':last')").click(function(e){
    //  找到需要隐藏的id
        var id = $(this).parent().prev().attr("data-id");
        bimEngine.showBuildingStorey(id, true);
        bimEngine.watchBuildingStorey(id, function () {
            // 隐藏其他的楼层
            stroeys.forEach(function (other) {
                if (other.Id != id) {
                    bimEngine.showBuildingStorey(other.Id, false);
                }
            });
        });
   }); 

   $("#openAllLC").click(function(){
    stroeys.forEach(function (stroey) {
        bimEngine.showBuildingStorey(stroey.Id, true);
    });
   });

}


}