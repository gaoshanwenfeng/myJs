/**
 * 城市输入匹配插件
 *
 * 输入区域可自动匹配城市、省、国家；输入城市可自动匹配省、国家
 *
 * @inputId {string} 输入input ID
* @clickEvt {function} 选择城市后执行的接口函数，参数为当前输入城市或区域的map对象(key值为：areaName、cityName、provinceName、countryName、lev);
* lev值说明：1为地区、2为城市、3为省或直辖市、4为国家
* 
 * @data {obj} 数据源，格式如下：
var oCityList={
		countryList:[
		{code:"CN", name:"中国", spell:"zhongguo"},
		{code:"US", name:"美国", spell:"meiguo"},
		],
		provinceList:[
		{code:"1", name:"北京市", spell:"beijingshi",pCode:"CN"},
		{code:"2", name:"上海市", spell:"shanghaishi",pCode:"CN"},
		{code:"3", name:"洛杉矶", spell:"luoshanji",pCode:"US"}
		],
		
		cityList:[
		{code:"1", name:"北京", spell:"beijing",  pCode:"1" , gCode:"CN",lev:"3"},
		{code:"2", name:"上海", spell:"shanghai", pCode:"2" , gCode:"CN",lev:"3"},
		{code:"3", name:"洛杉", spell:"luoshanji", pCode:"3" , gCode:"US",lev:"3"}
		],
		areaList:[
		{code:"2121",name:"海淀区",spell:"haidianqu", pCode:"1",gCode:"1",lev:"4"},
		{code:"2122",name:"朝阳区",spell:"chaoyangqu", pCode:"1",gCode:"1",lev:"4"},
		{code:"2124",name:"黄浦区",spell:"huangpuqu", pCode:"2",gCode:"2",lev:"4"},
		{code:"2125",name:"洛杉区",spell:"luoshanji", pCode:"3",gCode:"3",lev:"4"}
		]
	};
 *
 * @date 2016-01-29
 * @author superleng
 * 
 * 用法：
 * var oCitySuggest1=new CitySuggest({inputId:"input_area",data:oCityList,clickEvt:function(o){console.log("自定义函数1");console.log(o);}});
 * 
*/


//关联类：关联区域、城市、省份、国家
var CitySuggest=function(oIds){
	var _this=this;
	_this.dataMap={};
	
	_this.obj=new NameSuggest({tar:oIds.inputId,json:oIds.data,oCitySuggest:_this});
	_this.inputId=$("#"+oIds.inputId);
	
	//重置数据
	function resetData(){
		_this.dataMap={};
		_this.inputId.val("");
	}
	
	//点击input框时，重置所有数据
	_this.inputId.click(function(){
		resetData();
	});
	
	
	//区域关联
	_this.inputId.focus(function(){
		if(_this.obj.dataList){
			//console.log(_this.obj.dataList.code);
			
			if(_this.obj.dataList.lev=="4"){
				//console.log("区域查找"); 
				
				for(var i=0,len=oCityList.cityList.length;i<len;i++){
					//console.log(_this.obj.dataList.pode+"-----"+oCityList.cityList[i].pCode);
					if(_this.obj.dataList.pCode && _this.obj.dataList.pCode==oCityList.cityList[i].pCode){
						
						_this.dataMap.cityName=oCityList.cityList[i].name;
						_this.obj.dataList={name:oCityList.cityList[i].name,spell:oCityList.cityList[i].spell,code:oCityList.cityList[i].code,pCode:oCityList.cityList[i].pCode};
						//console.log(_this.obj2.dataList);
						
						searchProvinceList();
						
						
					}
				}
				
			}else if(_this.obj.dataList.lev=="3"){
				//console.log("城市查找");
				searchProvinceList();
				_this.dataMap.areaName=null;
			}
			
		}
		
		if(oIds.clickEvt){oIds.clickEvt(_this.dataMap);}
		
		//console.log(_this.dataMap);
		
	});
	
	
	//从省开始往上匹配
	function searchProvinceList(){
		for(var j=0,lenP=oCityList.provinceList.length;j<lenP;j++){
			//console.log(_this.obj.dataList.pCode+"-----"+oCityList.provinceList[j].code);
			if(_this.obj.dataList.pCode && _this.obj.dataList.pCode==oCityList.provinceList[j].code){
				_this.dataMap.provinceName=oCityList.provinceList[j].name;
				//_this.tarId3.val(oCityList.provinceList[j].name);
				_this.obj.pDateList={name:oCityList.provinceList[j].name,spell:oCityList.provinceList[j].spell,code:oCityList.provinceList[j].code,pCode:oCityList.provinceList[j].pCode};
				
				for(var k=0,lenC=oCityList.countryList.length;k<lenC;k++){
					if(_this.obj.pDateList.pCode && _this.obj.pDateList.pCode==oCityList.countryList[k].code){
						
						_this.dataMap.countryName=oCityList.countryList[k].name;
					}
				}
				
			}
		}
	}
	
};



/*
 * 输入匹配类
 * */
function NameSuggest(data){
	var _this=this;
	
	var tar=$("#"+data.tar).get(0);
	
	_this.searchCity=function(parm){
			var msg='';
			$("#namesSuggest").empty();
			var val=parm.tar.value.toLocaleLowerCase().Trim();//转换为小写，并忽略空格
			//如果输入的值不为空，则进行匹配
			if(val!=""){
				var pos=PT.getAbsPoint(parm.tar);
				$("#namesSuggest").show().css({left:pos.x+"px",top:pos.y+parm.tar.clientHeight+2+"px"});
				
				var arrAllCity=parm.data.cityList.concat(parm.data.areaList);
				
				//console.log(arrAllCity);
				
				for(var i=0,len=arrAllCity.length;i<len;i++){
						var name=arrAllCity[i].name;
						var spell=arrAllCity[i].spell;
						var flag=name.indexOf(val);
						var pCode=arrAllCity[i].pCode?arrAllCity[i].pCode:null;
						var code=arrAllCity[i].pCode?arrAllCity[i].code:null;
						var lev=arrAllCity[i].lev?arrAllCity[i].lev:null;
						
						if(flag==0){
							msg='<li><span class="pName">'+name.substring(0,flag)+'<i>'+name.substring(flag,flag+val.length)+"</i>"+name.substring(flag+val.length,name.length)+'</span><span class="pUser">'+spell+'</span><span class="pCode">'+pCode+'</span><span class="code">'+code+'</span><span class="lev">'+lev+'</span></li>'
							$("#namesSuggest").append(msg);
						}
						else if(arrAllCity[i].spell.indexOf(val)==0){
							
							flag=spell.indexOf(val);
							
							msg='<li><span class="pName">'+name+'</span><span class="pUser">'+spell.substring(0,flag)+'<i>'+spell.substring(flag,flag+val.length)+"</i>"+spell.substring(flag+val.length,spell.length)+'</span><span class="pCode">'+pCode+'</span><span class="code">'+code+'</span><span class="lev">'+lev+'</span></li>'
							//msg='<li><span class="pName">'+name+'</span><span class="pUser">'+parm.data[i].spell+'</span></li>'
							$("#namesSuggest").append(msg);
						}
					}
				
				
				
				if($("#namesSuggest li").length>10){$("#namesSuggest").css({height:"250px",overflow:"auto"});}
				else{$("#namesSuggest").css({height:"auto",overflow:"hidden"});}
				$("#namesSuggest li").hover(function(){$(this).addClass("hover");},function(){$(this).removeClass("hover");});
				
				$("#namesSuggest li").click(function(){
						parm.tar.value=$(this).find(".pName").text();
						data.oCitySuggest.dataMap.areaName=parm.tar.value;
						data.oCitySuggest.dataMap.lev=$(this).find(".lev").text();
						
						//console.log(data.oCitySuggest.dataMap);
						
						/*
						parm.tar.setAttribute("spell",$(this).find(".pUser").text());
						parm.tar.setAttribute("code",$(this).find(".code").text());
						parm.tar.setAttribute("pCode",$(this).find(".pCode").text());
						parm.tar.setAttribute("lev",$(this).find(".lev").text());
						*/
						
						//保存当前data
						_this.dataList={name:$(this).find(".pName").text(),spell:$(this).find(".pUser").text(),code:$(this).find(".code").text(),pCode:$(this).find(".pCode").text(),lev:$(this).find(".lev").text()};
						$("#"+data.tar).focus();
						
						$("#namesSuggest").hide();
				});				
				if(msg==''){
					$("#namesSuggest").append('<li class="msg">对不起，没有找到&nbsp;'+val+'&nbsp;</li>');
					}
			}
			else{//如果输入的值为空，则隐藏提示框
				$("#namesSuggest").hide()
				}
		
	}
	
	
	$("#"+data.tar).keyup(function(){
		_this.searchCity({tar:this,data:data.json});
	});
	
}
NameSuggest.hide=function(){
	setTimeout(function(){$("#namesSuggest").hide();},300);
	}
	
NameSuggest.creatUi=function(){
	var css_str='<style>'
	+'#namesSuggest{width:200px; margin:0; padding:0; font-size:12px; border:1px solid #FC0; position:absolute; background:#fff; z-index:9999;}'
	+'#namesSuggest li{list-style:none; line-height:25px; height:25px; text-indent:0.5em; width:100%; cursor:pointer;}'
	+'#namesSuggest li.hover{background:#FF9;}'
	+'#namesSuggest .pName{float:left;}'
	+'#namesSuggest .pName i{color:#f00; font-style:normal;}'
	+'#namesSuggest .pUser i{color:#f00; font-style:normal;}'
	+'#namesSuggest .pUser{float:right; margin-right:0.5em;}'
	+'#namesSuggest .code,#namesSuggest .pCode,#namesSuggest .lev{display:none;}'
	+'</style>';
	document.write(css_str+'<ul id="namesSuggest" style="display:none;"></ul>');	
	}
NameSuggest.creatUi();
