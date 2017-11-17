/*-------公用JS方法----------*/
//导航条Tab切换
function headerCtrl(index){
	$("#indexNav li").eq(index).addClass("on").prev().css("background","none");
 }
 //去除所有空格
String.prototype.Trim = function(){return this.replace(/\s+/g,"");}
var PT={
	$:function(id) {
		return !id ? null : document.getElementById(id);
	},
	isUndefined:function(variable) {
	return typeof variable == 'undefined' ? true : false;
	},
	getAbsPoint:function(o) { //获取DOM对象的绝对位置  
	    var x = o.offsetLeft;   
	    var y = o.offsetTop;   
	    while(o = o.offsetParent) {   
	        x += o.offsetLeft;   
	        y += o.offsetTop;   
	    }   
	    return {x:x,y:y};
	},
	btnDisabled:function(btn){//支持ID和原生JS对象
		if(typeof(btn)!="object"){
			//保存style原始值
			if($(this.$(btn)).data("tempCssText")==null) $(this.$(btn)).data("tempCssText",this.$(btn).style.cssText);
			//alert($(this.$(btn)).data("tempCssText")+"----");
			this.$(btn).setAttribute("disabled","disabled");
			this.$(btn).style.cssText+=";filter:alpha(opacity=60); -moz-opacity:0.6; -khtml-opacity:0.6; opacity:0.6; cursor:default;";
			//alert(this.$(btn).style.cssText);
		}
		else{
			$(btn).data("tempCssText",btn.style.cssText);
			btn.setAttribute("disabled","disabled");
			btn.style.cssText+=";filter:alpha(opacity=60); -moz-opacity:0.6; -khtml-opacity:0.6; opacity:0.6; cursor:default;";
		}
	},
	btnEnabled:function(btn){//支持ID和原生JS对象
		if(typeof(btn)!="object"){
			if($(this.$(btn)).data("tempCssText")==null) $(this.$(btn)).data("tempCssText",this.$(btn).style.cssText);
			//alert($(this.$(btn)).data("tempCssText")+"====");
			//还原style原始值
			this.$(btn).style.cssText=$(this.$(btn)).data("tempCssText");
			this.$(btn).removeAttribute("disabled");
			//alert(this.$(btn).style.cssText+"===");
		}
		else{
			if($(btn).data("tempCssText")==null) $(btn).data("tempCssText",btn.style.cssText);
			btn.style.cssText=$(btn).data("tempCssText");
			btn.removeAttribute("disabled");
		}
	},
	attachEvent:function(obj, evt, func, eventobj) {
		eventobj = !eventobj ? obj : eventobj;
		if(obj.addEventListener) {
			obj.addEventListener(evt, func, false);
		} else if(eventobj.attachEvent) {
			obj.attachEvent('on' + evt, func);
		}
	},
	detachEvent:function(obj, evt, func, eventobj) {
		eventobj = !eventobj ? obj : eventobj;
		if(obj.removeEventListener) {
			obj.removeEventListener(evt, func, false);
		} else if(eventobj.detachEvent) {
			obj.detachEvent('on' + evt, func);
		}
	},
	getEvent:function(){
		if(document.all) return window.event;
		func = getEvent.caller;
		while(func != null) {
			var arg0 = func.arguments[0];
			if (arg0) {
				if((arg0.constructor  == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
					return arg0;
				}
			}
			func=func.caller;
		}
		return null;
	},
	setCookie:function(cookieName, cookieValue, seconds, path, domain, secure) {
		var expires = new Date();
		if(cookieValue == '' || seconds < 0) {
			cookieValue = '';
			seconds = -2592000;
		}
		expires.setTime(expires.getTime() + seconds * 1000);
		document.cookie = escape(cookiepre + cookieName) + '=' + escape(cookieValue)
			+ (expires ? '; expires=' + expires.toGMTString() : '')
			+ (path ? '; path=' + path : '/')
			+ (domain ? '; domain=' + domain : '')
			+ (secure ? '; secure' : '');
	},
	getCookie:function(name, nounescape) {
		name = cookiepre + name;
		var cookie_start = document.cookie.indexOf(name);
		var cookie_end = document.cookie.indexOf(";", cookie_start);
		if(cookie_start == -1) {
			return '';
		} else {
			var v = document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length));
			return !nounescape ? unescape(v) : v;
		}
	},
	pregReplace:function(search, replace, str, regswitch) {
		var regswitch = !regswitch ? 'ig' : regswitch;
		var len = search.length;
		for(var i = 0; i < len; i++) {
			re = new RegExp(search[i], regswitch);
			str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
		}
		return str;
	},
	htmlSpecialChars:function(str) {
		return this.pregReplace(['&', '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], str);
	},
	getURL:function(url){
		window.location.href=url;
	},
	/*
	input提示输入函数，用法：input添加onclick="PT.inputCue(this,'请输入证件号码')"
	必选参数：tar为目标input,defaultVal为提示输入文字
	可选参数：defaultColor提示文字颜色（缺省为#a0a0a0）,valColor为输入文字颜色（缺省为#666）
	*/
	inputCue:function(tar,defaultVal,defaultColor,valColor){
		$(tar).focusin(function(){
			var val=tar.value;
			if(val.indexOf(defaultVal)>=0){
				if(defaultColor)tar.style.color="#"+defaultColor;
				else tar.style.color="#a0a0a0";
				tar.value="";
			}
			else{
				if(valColor)tar.style.color="#"+valColor;
				else tar.style.color="#666";
			}
		});
		
		$(tar).focusin();
		
		$(tar).focusout(function(){
			if(tar.value==""){
				if(defaultColor)tar.style.color="#"+defaultColor;
				else tar.style.color="#a0a0a0";
				tar.value=defaultVal;
			}
		});
		
	},
	/*-----tab切换控制，用法如下---- groupList为内容区父容器ID，active为选中样式。
	<ul class="groupNav">
		<li onclick="PT.tab(this,'groupList','active')" data-type="0" class="active">今日团购</li>
		<li onclick="PT.tab(this,'groupList','active')" data-type="1">酒店团购</li>
		<li onclick="PT.tab(this,'groupList','active')" data-type="2">旅游团购</li>
	</ul>
	*/
	tab:function(tar,tar_contentId,classN){
		var index=$(tar).index();
		$("#"+tar_contentId).children().eq(index).show().siblings().hide();
		$(tar).addClass(classN).siblings().removeClass(classN);
	},
	//日期格式化函数
	transDate:function(date){
		var m=date.getMonth()+1,d=date.getDate();
		m=m<10?"0"+m:m;
		d=d<10?"0"+d:d;
		return date.getFullYear() + '-' + m + '-' + d;
	}
}