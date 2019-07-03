/**
 *   监控 
 **/
function regvideoBtn() {
    $('#infoVideoPanel').draggable();
    $('#videoBtn').click(function (e) {
    e.preventDefault();
    $('#infoVideoPanel').toggle();


    });
}