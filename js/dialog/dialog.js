//新弹出层JS插件 creatby lengyg 2011-4-27
/*
 关闭按钮id设为closeUi（不可变）

 用法1（推荐用法）：传显示内容的ID，会自动记录显示内容并删除该ID内容防重ID
 openNewDiv('contentId',440,196,"loginWin");
 参数依次为：contentId:要显示的内容的id 、打开层的宽度、高度 、打开层的id

 新增参数：y_tar  iframe方式引用时，以此为dom参考坐标。如 点击按钮（id为btn）弹出层，则以此按钮PT.$("btn")为y_tar
 y_tar为noScroll时，不再监听scroll事件，弹出层不再随滚动条拖动而调整居中。


 用法2（兼容旧使用方式）:传HTML片断
 把这段放在弹出窗口容器结束处。弹出窗口id为loginWin，与下面应用Id相对应。 
 dialogContent=getById("loginWin").innerHTML;
 getById("loginWin").parentNode.removeChild(getById("loginWin"));
 openNewDiv(dialogContent,440,196,"loginWin");
 */

function getById(objId) {
    return document.getElementById(objId)
}
var arr_openDiv = {};// 用对象哈希表方式缓存要显示div的内容
function openNewDiv(contentId, dialogWidth, dialogHeight, _id, y_tar) {
    if (!arr_openDiv[contentId]) {
        if (getById(contentId)) {
            arr_openDiv[contentId] = getById(contentId).innerHTML;
            getById(contentId).parentNode.removeChild(getById(contentId));
        } else
            arr_openDiv[contentId] = contentId;
    }
    var m = "mask";
    if (getById(_id))
        getById(_id).parentNode.removeChild(getById(_id));
    if (getById(m))
        getById(m).parentNode.removeChild(getById(m));

    // mask遮罩层
    var newMask = document.createElement("div");
    newMask.id = m;
    newMask.style.position = "absolute";
    newMask.style.zIndex = "100";
    var _scrollWidth = document.documentElement.scrollWidth;
    var _scrollHeight = (/webkit/i.test(navigator.userAgent) ? document.body : document.documentElement).scrollHeight;

    // 如果小于一屏时，取一屏的高度
    if (_scrollHeight < document.documentElement.clientHeight)
        _scrollHeight = document.documentElement.clientHeight;

    var _clientHeight = document.documentElement.clientHeight;
    var _clientWidth = document.documentElement.clientWidth;
    // 兼容webkit，webkit下document.documentElement.scrollTop始终为0;
    var _scrollTop = (/webkit/i.test(navigator.userAgent) ? document.body : document.documentElement).scrollTop;
    var _scrollLeft = document.documentElement.scrollLeft;
    newMask.style.width = _clientWidth + "px";
    newMask.style.height = _scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "#33393C";
    newMask.style.filter = "alpha(opacity=60)";
    newMask.style.opacity = "0.60";
    document.body.appendChild(newMask);

    if (window.XMLHttpRequest) {
        // Mozilla, Safari,IE7
    } else {
        // IE6
        var iframeForIE6 = document.createElement("iframe");
        iframeForIE6.style.zIndex = "2";
        iframeForIE6.style.width = _clientWidth + "px";
        iframeForIE6.style.height = _clientHeight + "px";
        iframeForIE6.style.top = "0px";
        iframeForIE6.style.left = "0px";
        iframeForIE6.style.filter = "alpha(opacity=0)";
        newMask.appendChild(iframeForIE6);
    }

    // 新弹出层

    var newDiv = document.createElement("div");
    newDiv.id = _id;
    newDiv.style.position = "absolute";
    newDiv.style.zIndex = "9998";
    var newDivWidth = dialogWidth;
    var newDivHeight = dialogHeight;
    newDiv.style.width = newDivWidth + "px";
    newDiv.style.height = newDivHeight + "px";

    // instanceof
    if (y_tar && y_tar != "noScroll") {// 判断iframe上下边界，修正坐标
        var pos_top = PT.getAbsPoint(y_tar).y - newDivHeight / 2;
        var temp = _scrollHeight - newDivHeight - 40;
        if (pos_top > temp)
            pos_top = temp;
        newDiv.style.top = (pos_top > 0 ? pos_top : 40) + "px";
    } else
        newDiv.style.top = (_scrollTop + _clientHeight / 2 - newDivHeight / 2) + "px";

    newDiv.style.left = (_scrollLeft + _clientWidth / 2 - newDivWidth / 2) + "px";
    newDiv.innerHTML = arr_openDiv[contentId];
    document.body.appendChild(newDiv);

    // 弹出层滚动居中

    function newDivCenter() {
        if (y_tar && y_tar != "noScroll") {
            newDiv.style.top = (pos_top > 0 ? pos_top : 0) + "px";
        } else if (y_tar == "noScroll") {
            return;
        } else {
            _scrollTop = (/webkit/i.test(navigator.userAgent) ? document.body : document.documentElement).scrollTop;
            newDiv.style.top = (_scrollTop + _clientHeight / 2 - newDivHeight / 2) + "px";
            newDiv.style.left = (_scrollLeft + _clientWidth / 2 - newDivWidth / 2) + "px";
        }
    }
    if (document.all) {
        window.attachEvent("onscroll", newDivCenter);
    } else {
        window.addEventListener('scroll', newDivCenter, false);
    }

    // 关闭新图层和mask遮罩层

    if (getById("closeUi") != null) {
        var closeUi = getById("closeUi");
    }

    var closewin = function() {
        if (document.all) {
            window.detachEvent("onscroll", newDivCenter);
        } else {
            window.removeEventListener('scroll', newDivCenter, false);
        }
        if (getById(_id)) {
            document.body.removeChild(getById(_id));
            document.body.removeChild(getById(m));
        }
        //点击关闭登陆窗口回调事件
        if(typeof(closewinBackFun) != "undefined"){
        	closewinBackFun();
		}
        return false;
    }

    arr_openDiv.closeDiv = closewin;

    var imgs = document.getElementById(_id).getElementsByTagName("img");
    for ( var i = 0, lenImg = imgs.length; i < lenImg; i++) {
        if (imgs[i].id == "closeUi") {
            closeUi = imgs[i];
            break;
        }
    }

    if (closeUi) {
        PT.attachEvent(closeUi, "click", closewin);
    }
    // closeUi.onclick = function(){closewin();} 废弃掉：由于此写法closeUi
    // click事件会被覆盖，所以采用上边的写法
    // alert(closeUi.parentNode.parentNode.innerHTML);
}

// 兼容以前的关闭方法
openNewDiv.closewin = function() {
    if (arr_openDiv.closeDiv)
        arr_openDiv.closeDiv();
}
function closeWin() {
    openNewDiv.closewin();
}