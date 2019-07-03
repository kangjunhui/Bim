var screen_width; //屏幕宽度
var screen_height; //屏幕高度
var system_minwidth = 1700; //系统最小宽度
var system_minheight; //系统最小高度
var system_width; //系统宽度
var system_height; //系统高度
var system_scale; //系统缩放比

$(document).ready(function () {
    onResize();
    window.onresize = onResize;
});

function onResize() {

    screen_width = (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth;
    screen_height = (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight;

    system_scale = screen_width / system_minwidth;
    system_scale = system_scale < 1 ? system_scale : 1;
    system_minheight = system_minwidth * screen_height / screen_width;
    if (screen_width < system_minwidth) {
        system_width = system_minwidth;
        system_height = system_minheight;
    } else {
        system_width = screen_width;
        system_height = screen_height;
    }

    $("body").css({ width: system_width + "px", height: system_height + "px", transform: "scale(" + system_scale + ")", transformOrigin: "0 0" }); //系统界面过小，等比例缩放系统

    // $("#infowaterBtn").height(system_height - 75);
    // $(".infowaterBtn_body").height(system_height - 120)
}