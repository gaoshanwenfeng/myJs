/**
 * 	new JqSuggest({
		  targetId:'pName',
		  hideId:'pCode',
		  dataArray:jsonArray
	 });
 */
var JqSuggest = function(o){
	var _this = this;
	_this.targetId = o.targetId;
	_this.hideId = o.hideId;
	_this.dataArray = o.dataArray;
	
	//Save
	JqSuggest.putTarget(o);
	
	

	showSuggestDiv = function(o){
		  var msg='';
		  $("#JqSuggest").empty();
		  var tar = $("#" + o.targetId)[0];
		  if (!tar) {
			  return ;
		  }
		  var pos = JqSuggest.getAbsPoint(tar);
			$("#JqSuggest").show().css({left:pos.x + "px", top:pos.y + tar.clientHeight + 2 + "px"});
			if (o.dataArray && o.dataArray.length > 0) {
				var len = o.dataArray.length;
				var itemNumber = 0;
				for(var i = 0; i < len; i++){
					var ele = o.dataArray[i];
					msg = '<li>';
					msg += '<span class="pCode">' + ele.code + '</span>';
					msg += '<span class="pText">' + ele.text + '</span>';
					if (ele.spell) {
						msg += '<span class="pSpell">' + ele.spell + '</span>';
					}
					msg += '</li>';
					$("#JqSuggest").append(msg);
					
					itemNumber ++;
					if (itemNumber > JqSuggest.showMaxItemSize) {
						 break;
					}
			     }
			}

			if ($("#JqSuggest li").length > 15 ){
				$("#JqSuggest").css({height:"250px",overflow:"auto"});
			} else {
				$("#JqSuggest").css({height:"auto",overflow:"hidden"});
			}
			$("#JqSuggest li").hover(function(){$(this).addClass("hover");},function(){$(this).removeClass("hover");});
			
			$("#JqSuggest li").click(function() {
				// 给隐藏域传code
				$("#"+ o.targetId).val($(this).find(".pText").text());
				$("#"+ o.hideId).val($(this).find(".pCode").text());
				$("#JqSuggest").hide();
			});			
				
			if( msg == '') {
				$("#JqSuggest").append('<li class="msg">对不起，没有找到&nbsp;'+val+'&nbsp;</li>');
			}
	 };

	getByTagertVal = function(o) {
		var val = $("#"+o.targetId).val();
		val = $.trim(val).toLowerCase()
		if(val==""){
			$("#JqSuggest li.msg").html("");
			$("#"+o.hideId).val(""); 
			showSuggestDiv({targetId:o.targetId,hideId:o.hideId,dataArray:o.dataArray}); 
			return false;
	    }
		$("#JqSuggest").empty();

		if (o.dataArray && o.dataArray.length > 0) {
		    var dataArray = o.dataArray;
		    var itemNumber = 0;
			if (val) {
				var msg = '';
				var tar = $("#"+o.targetId)[0];
				var pos = JqSuggest.getAbsPoint(tar);
				$("#JqSuggest").show().css({left:pos.x+"px",top:(pos.y + tar.clientHeight + 2)+"px"});
				var len = o.dataArray.length;
				for(var i = 0; i < len; i++) {
					var ele =  o.dataArray[i];
					var text = ele.text;
					var flag = text.indexOf(val);
					if(flag > -1){
						msg = '<li>';
						msg += '<span class="pCode">' + ele.code + '</span>';
						msg += '<span class="pText">' + text.substring(0,flag) + '<i>' + text.substring(flag, flag + val.length) + "</i>" + text.substring(flag+val.length, text.length) + '</span>';
						if (ele.spell) {
							msg += '<span class="pSpell">' + ele.spell + '</span>';
						}
						msg += '</li>';
						itemNumber++;
						$("#JqSuggest").append(msg);
					} else if(ele.spell && ele.spell.indexOf(val)> -1){
						
						msg = '<li>';
						msg += '<span class="pCode">' + ele.code + '</span>';
						msg += '<span class="pText">'+ text + '</span>';
						if (ele.spell) {
							msg += '<span class="pSpell">' + ele.spell + '</span>';
						}
						msg += '</li>';
						itemNumber++;
						$("#JqSuggest").append(msg);
					}
							
					if (itemNumber > JqSuggest.showMaxItemSize) {
					  	// 如果记录太多，只显示前15条
						break;
					}
				}
			  		
				if ($("#JqSuggest li").length > 15 ){
					$("#JqSuggest").css({height:"250px",overflow:"auto"});
			    } else {
			    	$("#JqSuggest").css({height:"auto",overflow:"hidden"});
		   	    }
			    $("#JqSuggest li").hover(function(){$(this).addClass("hover");},function(){$(this).removeClass("hover");});
				
				$("#JqSuggest li").click(function() {
					// 给隐藏域传code
					$("#"+o.targetId).val($(this).find(".pText").text());
					$("#"+o.hideId).val($(this).find(".pCode").text());
					$("#JqSuggest").hide();
				});	
			    if( msg == '') {
					$("#JqSuggest").append('<li class="msg">对不起，没有找到&nbsp;'+val+'&nbsp;</li>');
		       }
		  } 
		}

	 	if($("#JqSuggest li").length < 1 ){ 
	 		$("#JqSuggest").append('<li class="clearfix msg">对不起,没找到 "' + val + '" </li>');
	 	} else {
	 		$("#JqSuggest li").eq(1).addClass("hover");
	 	}
		$("#JqSuggest li:not(:first)").hover(function(){$(this).addClass("hover")},function(){$(this).removeClass("hover")});
	} 
	
	 $("#"+o.targetId).click(function(evt){
		var targetObjet = JqSuggest.getTarget(this);
		if (targetObjet) {
			$("#"+o.targetObjet).val('');
			$("#"+o.targetObjet).val('');	
		}
	});
		
	 $("#" + o.targetId).focusin(function(evt){
		 var targetObjet = JqSuggest.getTarget(this);
		 if (targetObjet) {
			 showSuggestDiv(targetObjet);
		 }
	});
		 
	$("#" + o.targetId).blur(function(evt){
		JqSuggest.hide();
	});
		 
    $("#" + o.targetId).keyup(function(evt){
    	var targetObjet = JqSuggest.getTarget(this);
    	if (!targetObjet) {
    		return ;
    	}
        var keycode;
        if(!evt){
        	var evt = window.event;
        }
        if(evt.keyCode){
        	keycode = evt.keyCode;
        } else if(evt.which){
        	keycode = evt.which;
        }
        switch (evt.keyCode) {
       		 case 38: // 向上方向键
						return;
            break;
      	  case 40: // 向下方向键
   					return;
            break;
          case 39: // 向右方向键
            return;
            break;
          case 37: // 向左方向键
            return;
            break;    
          case 13: // 对应回车键
						return;
          	break;
          case 27: // 对应Esc键
            return;
            break;
          default:
			getByTagertVal(targetObjet);				   
		  	break;
        }
	});
}

JqSuggest.showMaxItemSize = 15;
// 输入关键字匹配
JqSuggest.arrInputTarget = {};
JqSuggest.putTarget = function(object) {
	if (object) {
		JqSuggest.arrInputTarget[object.targetId] = object;
	}
}
JqSuggest.getTarget = function(object) {
	var target = null;
	var targetId = $(object).attr('id');
	if (targetId) {
		target = JqSuggest.arrInputTarget[targetId];
	}
	return target;
}
JqSuggest.hide = function(o) {
	setTimeout(function(){$("#JqSuggest").hide();},300);
}
JqSuggest.getAbsPoint = function(o) { 
	// 获取DOM对象的绝对位置
	var x = o.offsetLeft;   
	var y = o.offsetTop;   
	while(o = o.offsetParent) {   
		x += o.offsetLeft;   
		y += o.offsetTop;   
	}   
	return {x:x,y:y};
}

JqSuggest.creatUi=function(){
	var css_str='<style>'
	+'#JqSuggest{width:200px; margin:0; padding:0; font-size:12px; border:1px solid #FC0; position:absolute; background:#fff; z-index:9999;}'
	+'#JqSuggest li{list-style:none; line-height:25px; height:25px; text-indent:0.5em; width:100%; cursor:pointer;}'
	+'#JqSuggest li.hover{background:#FF9;}'
	+'#JqSuggest .pText{float:left;}'
	+'#JqSuggest .pText i{color:#f00; font-style:normal;}'
	+'#JqSuggest .pSpell{float:right; margin-right:0.5em;}'
	+'#JqSuggest .pCode{display:none;}'
	+'</style>';
	document.write(css_str+'<ul id="JqSuggest" style="display:none;"></ul>');	
}
JqSuggest.creatUi();	