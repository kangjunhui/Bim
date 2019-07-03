/* 
    剖切
*/

function regsectionBtn() {
  var mgr = bimEngine.getClipManager();
  $('#section').draggable();    //窗体可移动
  $('#sectionBtn').click(function (e) {
    e.preventDefault();    //禁止提交，阻止元素发生默认行为
    var flag = $('#section').css("display"); //  display：none 元素不会被显示
    if (flag === "none") {        //控制弹框状态   显示/不显示
      mgr.enableX(true);     //设置x方向是否启用剖切
      mgr.enableY(true);       //设置y方向是否启用剖切
      mgr.enableZ(true);       //设置z方向是否启用剖切
      $("#section").toggle();        //按钮控制显示或隐藏
      mgr.setClipSectionVisible(true);     //显示剖面状态     
    } else if (flag === "block") {
      mgr.enableX(false);
      mgr.enableY(false);
      mgr.enableZ(false);
      $('#section').toggle();
      mgr.setClipSectionVisible(false);
    }
  })
 
  //x轴滚动条配置
  var mgr = bimEngine.getClipManager();
  var x = $('#x_Slider').slider({
    // value: -23.290525,
    // //value:[-1,1],
    // animate: true,   //拖动滑块执行动画效果
    // min: -23.290525,
    // max: 23.290525,
    // step: 1,
    // slide: function (event, ui) {  
    //   var ch = $("#XXX").prop("checked");  //拖动滑块执行动画效果的事件
    //   mgr.enableX(ch);    //x轴方向是否启用剖切
    //   ui.value = ui.value * parseInt($("#x_select").val());
    //   var index = ((ui.value * parseInt($("#x_select").val())) / 23.290525);
    //   mgr.setRangeX(ui.value / 23.290525);
    value: -132,
    //value:[-1,1],
    animate: true,   //拖动滑块执行动画效果
    min: -132,
    max: 132,
    step: 1,
    slide: function (event, ui) {  
      var ch = $("#XXX").prop("checked");  //拖动滑块执行动画效果的事件
      mgr.enableX(ch);    //x轴方向是否启用剖切
      ui.value = ui.value * parseInt($("#x_select").val());
      var index = ((ui.value * parseInt($("#x_select").val())) / 132);
      mgr.setRangeX(ui.value / 132);

    }

  });


  // $('#x_control_id').val($('#x_Slider').slider('value'));
  var mgr = bimEngine.getClipManager();
  //y轴滚动条设置
  var y = $('#y_Slider').slider({
    // value: -26.125,
    // animate: true,   //拖动滑块执行动画效果
    // min: -26.125,
    // max: 26.125,
    // step: 1,
    // slide: function (event, ui) {
    //   var ch = $("#YYY").prop("checked");
    //   mgr.enableY(ch);
    //   ui.value = ui.value * parseInt($("#y_select").val());
    //   var index1 = ((ui.value * parseInt($("#y_select").val())) / 26.125);
    //   mgr.setRangeY(ui.value / 26.125);
    value: -86.5,
    animate: true,   //拖动滑块执行动画效果
    min: -86.5,
    max: 86.5,
    step: 1,
    slide: function (event, ui) {
      var ch = $("#YYY").prop("checked");
      mgr.enableY(ch);
      ui.value = ui.value * parseInt($("#y_select").val());
      var index1 = ((ui.value * parseInt($("#y_select").val())) / 86.5);
      mgr.setRangeY(ui.value / 86.5);
    }

  });

  var mgr = bimEngine.getClipManager();
  //z轴滚动条设置
  $('#z_Slider').slider({
    value: -1,
    //value:select[0].selectedIndex+1,
    //value:[-1,1],
    animate: true,   //拖动滑块执行动画效果
    min: -1,
    max: 1,
    step: 0.01,
    //range:"min",
    slide: function (event, ui) {
      //select[0].selectedIndex = ui.value-1;
      var ch = $("#ZZZ").prop("checked");
      mgr.enableZ(ch);
      mgr.setRangeZ(ui.value);
    }

  });
  //绑定下拉框
  $('#x_selsect').change(function () {
    //alert("已触发");
    //alert($(this).children('option:select').val());
    // var xl = $(this).prop("")
    //    console.log("value的值:"+val());
    //
    //$("#x_Slider").setValue($("#x_selsect").val());
    //var ch = $("#XXX").prop("checked");
    // mgr.enableX(ch);
    //var index = x.slider("value"); //滚动条的值
    // var length = parseInt($('#x_selsect').val());  //下拉框的值
    //  x.slider("value",length + index);   //修改滚动条的值 为当前滚动条的值 + 下拉框的值
    // mgr.setRangeX((length + index)/23.290525);  //剖切为当前滚动条的值 + 下拉框的值
  })
}
//绑定操作的模型的世界
$("#XXX").click(function () {
  var mgr = bimEngine.getClipManager();
  var ch = $(this).prop("checked");
  //slider.slider( "value", this.selectedIndex + 1 );
  console.log(ch);
  mgr.enableX(ch);
});

$("#YYY").click(function () {
  var mgr = bimEngine.getClipManager();
  var ch = $(this).prop("checked");
  console.log(ch);
  mgr.enableY(ch);
});

$("#ZZZ").click(function () {
  var mgr = bimEngine.getClipManager();
  var ch = $(this).prop("checked");
  mgr.enableZ(ch);
});

// 是否打开辅助剖面
function assistChange() {
  var mgr = bimEngine.getClipManager();
  var ch = $('#assist_id').prop("checked");
  mgr.setClipSectionVisible(ch);
}
