/**
 * 查盘使用的菜单项
 * create by:zhouwangzong 
 */
 
//选择框的构建JS
MenuManager = {};
MenuManager.menus = {};
MenuManager.common = {
	hideAll:function(event){
		for(var menu in MenuManager.menus){
			MenuManager.menus[menu].confirm();
		}
	},
	getSrc:function(event){
		if(event.srcElement){
			return event.srcElement;
		}else{
			return event.target;
		}
	},
	stopBubble:function(event) {
		
		if (window.event)
			window.event.cancelBubble = true;
		else if(event&&event.stopPropagation)
			event.stopPropagation();		
	},
	resetAll:function(event) {
		$.each(MenuManager.menus ,function(index,item){
			item.resetAll();
		}); 
	},
	create:function(menuType,objId,params){
		try{
			var menu = eval("extend("+menuType+")");
			if(menuType == "CheckBoxMenu"||menuType == "DropDownMenu"){
				if(!params.data){
					alert("无法获取传入显示数据!");
				}
				menu.init(objId,params);
			}else{
				menu.init(objId,params); 
			}
			menu.config.panel.find("a[key='thickbox_btn01']").click(function(event){ 
				menu.hidePanel();
			});
			 
			menu.config.panel.find("a[key='thickbox_btn']").click(function(event){ 
				menu.confirm();
			});
			$("#"+objId).click(function(event){ 
				menu.show();
			}); 
			//弹出的层不处发关闭层的事件
			menu.config.panel.click(function(event){
				MenuManager.common.stopBubble(event);
			});
			$(menu.config.panel).appendTo("Body");
			$(menu.config.panel).hide();
			MenuManager.menus[objId]=menu;
			return menu;
		}catch(e){
			alert("未知菜单类型！")
			return;
		}
		
	}
};
var extend = function(obj){
	if(typeof obj !== 'object'){
		throw new Error('fatal error: "Object.prototype.extend" expects a object'); 
	}                  
	var F = function(){}; // 创建一个中间函数对象
	F.prototype = obj; //设置其原型对象指向obj
	return new F();//返回实例化的F      
}

var Menus = {
	context:"<div id='menuPanel' class='thickboxin01' style=z-index:9999;></div>",
	dfValue:"",
	init:function(inputId){
		cfg.objId = inputId
	},
	absPos:function(node){
	    var x=y=0;
	    do{
	        x+=node.offsetLeft;
	        y+=node.offsetTop;
	    }while(node=node.offsetParent);   
		    return{   
		        'x':x,   
		        'y':y   
		    }
	}, 
	showSelVal : function(showName,resethidden){
		var meMenu = this;
		if($("#"+this.config.objId)[0].tagName != "INPUT"&&$("#"+this.config.objId)[0].tagName != "SELECT"){
			showName="<div style='float:left;'>"+showName+"</div>"
			+(resethidden?"":"<a id='resetMenu' style='display:inline;cursor:pointer;float:right;'>清</a>")
			+"<div class='k01_right01'></div>";
			$("#"+this.config.objId).html(showName);
			$("#"+this.config.objId).find("#resetMenu").click(function(){
				meMenu.resetAll();
				$(document).unbind("click");
				MenuManager.common.stopBubble(event);
			});
			//$("#"+this.config.objId).css('background' , 'url('+getPath()+'/default/style/images/public_btn03.png) left no-repeat');
		}else{
			$("#"+this.config.objId).val(showName);
		}
	}, 
	resetInput : function(){
		var meMenu = this;
		if($("#"+this.config.objId)[0].tagName != "INPUT"&&$("#"+this.config.objId)[0].tagName != "SELECT"){
			$("#"+this.config.objId).html(meMenu.config.inputTitle+"<div class='k01_right'></div>"); 
		}else{
			$("#"+this.config.objId).val(meMenu.config.inputTitle);
		}
		this.hidePanel();
	},  
	hidePanel : function(){
		this.config.showFlag = false;
		this.config.panel.hide();
	}, 
	remove : function(){
		this.config.showFlag = false; 
		$("#"+this.config.objId).unbind("click");
		this.config.panel.hide(); 
	},
	showPanel:function(o,event){ 
		jQuery.extend(this.config,o);
		MenuManager.common.hideAll();
		var meMenu = this;
		if(!this.config.showFlag){
			var point = this.absPos($("#"+this.config.objId)[0])
			$(this.config.panel).css("left",point.x);
			$(this.config.panel).css("top",point.y + $("#"+this.config.objId)[0].offsetHeight);
			$(this.config.panel).css("position","absolute");
			$(this.config.panel).css("background","#FFFFFF");
			if(this.config.height){
				$(this.config.panel).height(this.config.height);
			}else{
				$(this.config.panel).height("auto");
			}
			if(this.config.width){
				$(this.config.panel).width(this.config.width);
			}
			
			$(this.config.panel).show();
			MenuManager.common.stopBubble(event); 
			$(document).bind("click",function(){ 
				meMenu.confirm();
			});
			this.config.showFlag = true;
		}else{ 
			$(document).unbind("click");
		}
	}
}

//面积继承菜单类
var AreaMenu = extend(Menus);
//区域继承菜单类
var RegionMenu = extend(Menus);
//用途菜单类
var PropertyTypeMenu = extend(Menus);
//价格继承菜单类
var PriceMenu = extend(Menus);
//位置继承菜单类
var PositionMenu = extend(Menus);
//楼层继承菜单类
var FloorMenu = extend(Menus);
//数字区域菜单
var NumberRangeMenu = extend(Menus);
//日期区域菜单
var DateRangeMenu = extend(Menus); 
//下拉菜单
var DropDownMenu = extend(Menus);
//多选菜单
var CheckBoxMenu = extend(Menus);


/********************************   AreaMenu  Start*********************************************/
//重写方法
AreaMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			inputTitle:null,
			height:null,
			showFlag:false
	};
	this.config.objId = inputId;
	jQuery.extend(this.config,params); 
	this.config.panel = $(this.context).append("<table class='py_search'><tr id='areaTypeTr'>" +
				"<td><input  type='radio' value='buildArea' checked='checked' name='areaType'/><strong>建筑面积</strong></td>"+
				"<td><input  type='radio' value='roomArea' name='areaType'/><strong>套内面积</strong></td>"+
			"</tr>"+
			"<tr>" +
				"<td id='roptions'></td>"+
				"<td id='boptions'></td> " +
			"</tr>" +
			"<tr><td colspan='2'>" +
				"<input id='startValue' style='width:50px;' name='' type='text' />" +
				" 至 " +
				"<input id='endValue' style='width:50px;' name='' type='text' />" +
			"</td></tr>" +
			"<tr><td style='text-align:center;padding-top:5px;' colspan='2'>" +
			"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
			"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	var meMenu = this;
	//默认数据 
	var rareaOptions = [{end:'50'},{start:'50',end:'80'},{start:'80',end:'120'},{start:'120'}];
	var bareaOptions = [{end:'50'},{start:'50',end:'80'},{start:'80',end:'120'},{start:'120'}];
	//城市加载选择框
	var tempHtmlStr = "";
	$.each(rareaOptions,function(index,item){
		if(!item.start&&item.end){
			tempHtmlStr += "<p><a endVal ='"+item.end+"' style='cursor:pointer;'>"+item.end+"㎡以内</a></p>";
		}else if(item.start&&!item.end){
			tempHtmlStr += "<p ><a  startVal ='"+item.start+"' style='cursor:pointer;'>"+item.start+"㎡以上</a></p>";
		}else{
			tempHtmlStr += "<p><a endVal ='"+item.end+"' startVal ='"+item.start+"' style='cursor:pointer;'>"+item.start+"㎡-"+item.end+"㎡</a></p>"; 
		}
	});
	this.config.panel.find("#roptions").append(tempHtmlStr);
	
	this.config.panel.find("#roptions").find("A").click(function(){
		meMenu.config.panel.find("#startValue").val($(this).attr("startVal"));
		meMenu.config.panel.find("#endValue").val($(this).attr("endVal"));
		meMenu.confirm();
	});
	//加载区域选择框
	tempHtmlStr = "";
	$.each(bareaOptions,function(index,item){
		if(!item.start&&item.end){
			tempHtmlStr += "<p><a endVal ='"+item.end+"' style='cursor:pointer;'>"+item.end+"㎡以内</a></p>";
		}else if(item.start&&!item.end){
			tempHtmlStr += "<p><a startVal ='"+item.start+"' style='cursor:pointer;'>"+item.start+"㎡以上</a></p>";
		}else{
			tempHtmlStr += "<p><a endVal ='"+item.end+"' startVal ='"+item.start+"' style='cursor:pointer;'>"+item.start+"㎡-"+item.end+"㎡</a></p>"; 
		}
	});
	this.config.panel.find("#boptions").append(tempHtmlStr);
	this.config.panel.find("#boptions").find("A").click(function(){
		meMenu.config.panel.find("#startValue").val($(this).attr("startVal"));
		meMenu.config.panel.find("#endValue").val($(this).attr("endVal"));
		meMenu.confirm();
	});
} 
AreaMenu.show = function(){
	var params = {panel:this.config.panel,width:160};
	this.showPanel(params) 
}

AreaMenu.resetAll = function(){
	this.config.panel.find("#startValue").val("");
	this.config.panel.find("#endValue").val("");
	
}

AreaMenu.confirm = function(){
	var meMenu = this;
	meMenu.config.showFlag = false;
	meMenu.config.panel.hide();
	var startVal = meMenu.config.panel.find("#startValue").val(); 
	var endVal = meMenu.config.panel.find("#endValue").val();
	var tempHtmlStr ="";
	if(!startVal&&endVal){
		tempHtmlStr += endVal+"㎡以内";
	}else if(startVal&&!endVal){
		tempHtmlStr += startVal+"㎡以上";
	}else if(startVal&&endVal){
		tempHtmlStr += startVal+"㎡-"+endVal+"㎡";
	}else{
		tempHtmlStr = meMenu.config.inputTitle;
		meMenu.showSelVal(tempHtmlStr,true);
		return false;
	}
	if(tempHtmlStr){
		tempHtmlStr=meMenu.config.panel.find("#areaTypeTr").find("input:checked").parent().text()+":"+tempHtmlStr;
		meMenu.showSelVal(tempHtmlStr);
	}
	
}
AreaMenu.resetAll = function(){
	var seletedType = this.config.panel.find("#areaTypeTr").find("input:checked");
	$(selectedType).attr("checked",false);
	this.config.panel.find("#startValue").val("");
	this.config.panel.find("#endValue").val("");
	this.resetInput();
}
AreaMenu.getValue = function(){
	if(!this.config.panel){
		return null;
	}else{ 
		var seletedType = this.config.panel.find("#areaTypeTr").find("input:checked");
			var resultValue = {};
			if(seletedType&&seletedType.length>0){
				if(this.config.panel.find("#startValue").val()||this.config.panel.find("#endValue").val()){
					resultValue.areaType = seletedType.val();
					resultValue.areaStartValue = this.config.panel.find("#startValue").val();
					resultValue.areaEndValue = this.config.panel.find("#endValue").val();
					 
				}else{
					return null;
				}
			}else{
				return null;
			}
			return resultValue;
		 
	}
}
/********************************   AreaMenu  End *********************************************/


/********************************   RegionMenus  Start*********************************************/
RegionMenu.cityData=null;
//重写方法
RegionMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			dfValue:null,
			inputTitle:null,
			showFlag:false
	};
	this.config.objId = inputId;
	jQuery.extend(this.config,params);
	if($("#"+this.config.objId)[0].tagName!="INPUT"
		&&$("#"+this.config.objId)[0].tagName!="SELETE"){
		this.dfValue = $("#"+this.config.objId).html();
	}else{
		this.dfValue = $("#"+this.config.objId).val();
	}
	this.config.panel = $(this.context).append("<table class='py_search'><tr >" +
			"<td ><select id='citySel' style='width:60px;height:20px;'></select></td>"+
			"<td><select id='regionSel' style='width:60px;height:20px;'></select></td>" +
            "<tr><td><label><input type='radio' checked='checked' value='1' name = 'regionType'>&nbsp;片区</label></td>" +
			"<td><strong><input type='radio' value='2' name = 'regionType'>&nbsp;商圈</strong></td></tr>"+
			"<tr><td id='areaBox'  colspan='2'><div id='options1' style='width:50%;float:left;'></div><div id='options2' style='width:50%;float:right;'></div></td> " +
            "</tr><tr><td style='text-align:center;' colspan='2'>" +
			"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
			"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	var curPanel = this;
	this.cityData =null; 
	if(!RegionMenu.cityData){
		$.post(getPath()+"/broker/area/getNode",{},function( cityData ) {
			RegionMenu.cityData=eval(cityData.treeData);
			curPanel.getCityData(params.dfValue.cityValue);
		},'json');
	}
} 
RegionMenu.show = function(){
	var params = {panel:this.config.panel,width:160};
	this.showPanel(params) 
}
RegionMenu.confirm = function(){
	this.config.showFlag = false;
	this.config.panel.hide();
	var areaType = this.config.panel.find("input[name='regionType']:checked");
	var disValue = "";
	if(areaType){
		var disTitle = "";
		if(areaType.val() == 1){ 
			disTitle+="<B>片区</B>:";
		}else{
			disTitle+="<B>商圈</B>:";
		}
		 var selArea = this.config.panel.find("#areaBox DIV input:checked");
			$.each(selArea,function(index,item){
				if((disValue+$(item).parent().text()).length>6){
					disValue+="...";
					return false;
				}
				if(index>0){
					disValue+=',';
				} 
				disValue+=$(item).parent().text()
			});
		
		
		if(disValue){
			this.showSelVal(disTitle+disValue);
			return;
		}
	}
	 
	var selRegion=  this.config.panel.find("#regionSel option:selected");
	if(selRegion.val()){
		this.showSelVal("<B>区域</B>："+$(selRegion).text());
		return;
	}
	var selCity=  this.config.panel.find("#citySel option:selected");
	if(selCity.val()){
		this.showSelVal("<B>城市</B>："+$(selCity).text());
		return;
	}
}

RegionMenu.getCityData =function(selCityId){ 
		var cityHtml="<option value=''>城市</option>";
		var regionData;
		var meMenu = this;
		var dfcityValue = this.config.dfValue.cityValue;
		$.each(RegionMenu.cityData,function(index,item){
			cityHtml+="<option value='"+item.id+"' ";
			if(dfcityValue == item.id){
				cityHtml+=" selected";
			}
			cityHtml+=">"+item.name+"</option>"
		});
		$(cityHtml).appendTo(this.config.panel.find("#citySel"));
		this.config.panel.find("#citySel").change(function(){
			var selValue = $(this).val();
			var regionData;
			$.each(RegionMenu.cityData,function(index,item){
				 if(item.id == selValue){
					 regionData = item.children;
				 }
			});
			meMenu.getRegionData(regionData);
		});
		if(!selCityId){
			selCityId = this.config.panel.find("#citySel").val();
		}
		$.each(RegionMenu.cityData,function(index,item){
			 if(item.id == selCityId){
				 regionData = item.children;
			 }
		});
		this.getRegionData(regionData);
}
RegionMenu.getRegionData =function(Object){ 
	var meMenu = this;
	var dfRegionValue = this.config.dfValue.regionValue;
	var regionHtml="<option value=''>区域</option>";
	$.each(Object,function(index,item){
		regionHtml+="<option value='"+item.id+"'";
		if(item.id == dfRegionValue){
			regionHtml+=" selected"
		}
		regionHtml+=">"+item.name+"</option>"
	});
	$(regionHtml).appendTo(this.config.panel.find("#regionSel"));
	this.config.panel.find("#regionSel").change(function(){
		meMenu.resetAreaBox();
	});
	this.config.panel.find("input[name='regionType']").click(function(){
		if($(this).val() == "1"){
			meMenu.getAreaData('3',meMenu.config.panel.find("#regionSel").val());
		}else{
			meMenu.getAreaData('4',meMenu.config.panel.find("#regionSel").val());
		}
	});
}
 
RegionMenu.getAreaData =function(type,regionId){
	var target = this.config.panel.find("#areaBox");
	var areaHtmlStr1=""; 
	var areaHtmlStr2=""; 
	var dfbusinessArea = this.config.dfValue.businessAreaValue;
	$.post(getPath()+"/basedata/area/getListData",{parentId:regionId,areaType:type},function(data){
		data = jQuery.parseJSON(data);
		if(data&&data.items){
			data.items = eval(data.items);
			$.each(data.items,function(index,item){
				if(index%2==1){
					areaHtmlStr2+="<p style='cursor:pointer;'><input type='checkbox' value='"+item.id+"' ";
					if(dfbusinessArea){
						for(var i=0;i<dfbusinessArea.length;i++){
							if(dfbusinessArea[i] == item.id){
								areaHtmlStr2+="checked='checked'";
								break;
							}
						}
					}
					areaHtmlStr2+="/>"+item.name+"</p>";
				}else{
					areaHtmlStr1+="<p style='cursor:pointer;'><input type='checkbox' value='"+item.id+"' ";
					if(dfbusinessArea){
						for(var i=0;i<dfbusinessArea.length;i++){
							if(dfbusinessArea[i] == item.id){
								areaHtmlStr1+="checked='checked'";
								break;
							}
						}
					}
					areaHtmlStr1+="/>"+item.name+"</p>";
				}
			}); 
			target.find("#options1").html(areaHtmlStr1);
			target.find("#options2").html(areaHtmlStr2);
		}else{
			target.html("");
		}
	});
}

RegionMenu.resetAll = function(){
	this.resetAreaBox();
	this.config.panel.find("#regionSel").val("");
	this.config.panel.find("#citySel").val("");
	this.resetInput();
}

RegionMenu.resetAreaBox = function(){
	this.config.panel.find("#areaBox #options1").html("");
	this.config.panel.find("#areaBox #options2").html("");
	var areaType = this.config.panel.find("input[name='regionType']:checked");
	areaType.attr("checked",false);
}


RegionMenu.getValue = function(){
	if(!this.config.panel||this.config.panel==null){
		return null;
	}else{
		var areaType = this.config.panel.find("input[name='regionType']:checked");
		var seletedArea = this.config.panel.find("#areaBox").find("DIV input:checked");
		var selGarea = "";
		var selBarea = "";
		if(seletedArea&&seletedArea.length>0){
			var areaIds = "";
			$.each(seletedArea,function(index,item){
				if(index>0){
					areaIds+=",";
				}
				areaIds+="'"+item.value+"'";
			});
			if(areaType){
				if($(areaType).val() == 1){
					selGarea = areaIds;
				}else if($(areaType).val() == 2){
					selBarea = areaIds;
				}
			}
		}
		var seletedBusiness = this.config.panel.find("#areaBox").find("#options  input:checked");
		var businessIds = "";
		$.each(seletedBusiness,function(index,item){
			if(index>0){
				businessIds+=",";
			}
			businessIds+="'"+item.value+"'";
		});
		var result = {};
		if(this.config.panel.find("#citySel").val()){
			result.cityId = this.config.panel.find("#citySel").val();
			if(this.config.panel.find("#regionSel").val()){
				result.regionId = this.config.panel.find("#regionSel").val();
				if(selGarea){
					result.areaIds =selGarea;
				}
				if(selBarea){
					result.businessIds =selBarea;
				}
			}
			return result;
		}else{
			return null;
		}
		
	}
}
/********************************   RegionMenus  end*********************************************/

/********************************   PropertyTypeMenu  Start*********************************************/
//重写方法
PropertyTypeMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			maxLength:6,
			inputTitle:null,
			showFlag:false
	}; 
	jQuery.extend(this.config,params);
	this.config.objId = inputId;
	this.config.panel = $(this.context).append("<table class='py_search'><tr >" +
				"<td  width='46%' valign='top'>" +
				"<div class='thickbox_list'><input type='hidden' id = 'selectedType'><ul id='propertyList'></ul></div>" +
				"</td><td id='parttenTd' width='54%' valign='top'></td>"+
				"</tr>" + 
			"<tr><td style='text-align:center;' colspan='2'>" +
			"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
			//"<input class='thickbox_btn' type='submit' value='确定'>&nbsp;" +
			"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	var meMenu = this;
	//城市加载选择框
	var tempHtmlStr = "";
	$.each(params.data,function(index,item){
		 tempHtmlStr += "<LI typeValue='"+item.id+"' style='cursor:pointer;'>"+item.name+"</LI>";
	});
	this.config.panel.find("#propertyList").append(tempHtmlStr);
	this.config.panel.find("#propertyList").find("LI").click(function(){
		meMenu.config.panel.find(".selLi").removeClass("selLi");
		$(this).addClass("selLi");
		meMenu.config.panel.find("#selectedType").val($(this).attr("typeValue")); 
		var typeOptions;
		$.each(params.data,function(index,item){
			if(item.id ==$("#selectedType").val()){
				typeOptions = item.menus;
				return false;
			}
		});
		if(typeOptions){
			var tempHtmlStr = "";
			$.each(typeOptions,function(index,item){
				 tempHtmlStr += "<p><label><input name='' type='checkbox' value='"+item.id+"' />"+item.name+"</label></p>";
			});
			tempHtmlStr+="<p><label><input name='' type='checkbox' value='all' onclick='PropertyTypeMenu.selectAll(this);'/>全部</label></p>";
			meMenu.config.panel.find("#parttenTd").html(tempHtmlStr);
		}
	}); 
}
PropertyTypeMenu.selectAll = function(obj){
	if($(obj).attr("checked") == "checked"){
		$(obj).parent().parent().parent().find("input").attr("checked","checked");
	}else{
		$(obj).parent().parent().parent().find("input").attr("checked",false);
	}
}
PropertyTypeMenu.show = function(){
	var params = {panel:this.config.panel,width:160};
	this.showPanel(params) 
}
PropertyTypeMenu.confirm = function(){
	var meMenu = this;
	this.config.showFlag = false;
	this.config.panel.hide();
	var selLi = this.config.panel.find(".selLi");
	var selPatterns = this.config.panel.find("#parttenTd input:checked");
	var displayName = "";
	$.each(selPatterns,function(index,item){ 
		if((displayName+$(item).parent().text()).length>meMenu.config.maxLength){
			displayName+="...";
			return false;
		}
		if(index>0){
			displayName+=",";
		}
		
		displayName+=$(item).parent().text();
	});
	if(selLi.text()&&!displayName){
		displayName+="全部";
	}
	if(selLi.text()&&displayName){
		this.showSelVal(selLi.text()+":"+displayName);
	}
}
PropertyTypeMenu.resetAll = function(){
	var selLi = this.config.panel.find(".selLi");
	selLi.removeClass("selLi");
	$("#selectedType").val("")
	var parttenTd = this.config.panel.find("#parttenTd");
	parttenTd.html("");
	this.resetInput();
} 
PropertyTypeMenu.getValue = function(){
	var resultValue = {};
	if(!this.config.panel){
		return null;
	}else{ 
		if($("#selectedType").val()){
			resultValue.propertyType = $("#selectedType").val();
			resultValue.patterns = "";
			var seletedOption = this.config.panel.find("#parttenTd").find("input:checked");
			$.each(seletedOption,function(index,item){
				if(item.value!='all'){ 
					if(index>0){
						resultValue.patterns +=",";
					}
					resultValue.patterns +=("'"+item.value+"'");
				} 
			});
			return resultValue;
		}else{
			return null;
		}
		
	}
}
/********************************   PropertyTypeMenu  End *********************************************/



/********************************   PriceMenu  Start*********************************************/
PriceMenu.priceType = [{id:'SALE',name:'售价(万元/套)'},{id:'RENT',name:'租价(元/月)'},{id:'SALEAVERAGE',name:'售单价(元/㎡)'},{id:'RENTAVERAGE',name:'租单价(元/月*㎡)'}];
PriceMenu.options = {
		'SALE':['50','50-80','80-120','120-150','150-200','200-300','300-500','500'],
		'RENT':['500','500-1000','1000-2000','2000-3000','3000-4000','5000-8000','8000-10000','10000'],
		'SALEAVERAGE':['2000','2000-5000','5000-10000','10000-15000','15000-20000','20000-25000','25000-30000','300000'],
		'RENTAVERAGE':['50','50-80','80-120','120-160','160-200','200']
		};
//重写方法
PriceMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			inputTitle:null,
			showFlag:false
	}; 
	jQuery.extend(this.config,params);
	this.config.objId = inputId;
	this.config.panel = $(this.context).append("<table class='py_search'><tr >" +
				"<td  width='54%' valign='top'>" +
				"<div class='thickbox_list'><input type='hidden' id = 'selectedType'><ul id='priceType'></ul></div>" +
				"</td><td id='priceTd' width='46%' valign='top'></td>"+
				"</tr>" +  
				"<tr><td colspan='2'>" +
					"<input id='startValue' style='width:70px;' name='' type='text' />" +
					" 至 " +
					"<input id='endValue' style='width:70px;' name='' type='text' />" +
				"</td></tr>" +
			"<tr><td style='text-align:center;' colspan='2'>" +
			"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
			"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	var meMenu = this;
	//城市加载选择框
	var tempHtmlStr = "";
	$.each(PriceMenu.priceType,function(index,item){
		 tempHtmlStr += "<LI typeValue='"+item.id+"'>"+item.name+"</LI>";
	});
	this.config.panel.find("#priceType").append(tempHtmlStr);
	
	this.config.panel.find("#priceType").find("LI").click(function(){
		meMenu.config.panel.find("#startValue").val("");
		meMenu.config.panel.find("#endValue").val("");
		meMenu.config.panel.find(".selLi").removeClass("selLi");
		$(this).addClass("selLi");
		meMenu.config.panel.find("#selectedType").val($(this).attr("typeValue")); 
		var options = PriceMenu.options[$(this).attr("typeValue")];
		var optionHtml = "";
		var unitName = "";
		if($(this).attr("typeValue")=="SALE" ){
			unitName = "万";
		}else{
			unitName = "元";
		}
		$.each(options,function(index,item){
			var sv='',ev='';
			var suf="";
			var sary = item.split("-");
			if(sary.length==1) {
				if(index==0) {sv = sary[0];suf='以下';}
				else {ev = sary[0];suf='以上';}
			}else if(sary.length==2){
				sv = sary[0];
				ev = sary[1];
			}
			
			optionHtml += "<LI startVal = '"+sv+"' endVal = '"+ev+"' style='cursor:pointer;' >"+item+unitName+suf+"</LI>";
			
		});
		
		meMenu.config.panel.find("#priceTd").html(optionHtml);
		meMenu.config.panel.find("#priceTd").find("LI").click( function(){
			meMenu.config.panel.find("#startValue").val($(this).attr("startVal"));
			meMenu.config.panel.find("#endValue").val($(this).attr("endVal"));
			
		});
	});
	  
} 
PriceMenu.show = function(){
	var params = {panel:this.config.panel,width:200};
	this.showPanel(params) 
}

PriceMenu.confirm = function(){
	this.config.showFlag = false;
	this.config.panel.hide();
	var selLi = this.config.panel.find(".selLi");
	var displayName = "";
	var unitName = "";
	if( this.config.panel.find("#selectedType").val()=="SALE"){
		unitName = "万";
	}else{
		unitName = "元";
	}
	if(!this.config.panel.find("#startValue").val()&&this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#endValue").val()+unitName+"以下";
	}else if(this.config.panel.find("#startValue").val()&&!this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#startValue").val()+unitName+"以上";
	}else if(this.config.panel.find("#startValue").val()&&this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#startValue").val()+"-"+this.config.panel.find("#endValue").val()+unitName;
	}else{
		displayName = this.config.inputTitle;
		this.showSelVal(displayName,true);
		return;
	}
	this.showSelVal(selLi.text().replace(/\(.*\)/g,'')+":"+displayName);
}
PriceMenu.resetAll = function(){
	this.config.panel.find("#selectedType").val("");
	this.config.panel.find("#startValue").val("");
	this.config.panel.find("#endValue").val("");
	this.resetInput();
} 
PriceMenu.getValue = function(){
	var resultValue = {};
	if(!this.config.panel){
		return null;
	}else{ 
		resultValue.priceType = this.config.panel.find("#selectedType").val();
		resultValue.priceStartValue = this.config.panel.find("#startValue").val();
		resultValue.priceEndValue = this.config.panel.find("#endValue").val();
	}
	return resultValue;
} 
/********************************   PriceMenu  End *********************************************/

/********************************   PositionMenu  Start*********************************************/
//重写方法
PositionMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			inputTitle:null,
			maxLength:10,
			showFlag:false
	};
	jQuery.extend(this.config,params);
	this.config.objId = inputId;
	this.config.panel = $(this.context).append("<table style='border-collapse:separate;' class='py_search'>" +
				"<tr><td height='24'><span style='float:left;'>地铁：</span>" +
				
				"<div style='float:left;' onchange='selposition' class='f7' id='line' " +
					"dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=stationQuery&type=SUBWAY&areaId="+curCityValue+"'" +
					"width='500px' height='300px' title='地铁'> " +
					"<input dataPicker='value' name='line' label='地铁' " +
					" id='lineId' type='hidden' " +
					"readOnly='readOnly' /> <input dataPicker='name' " +
					"ondblclick='openDataPicker(\"line\")' value='' " +
					"name='lineName' id='lineName' type='text' /> <strong " +
					"onclick='clearDataPicker(\"line\")'></strong> <span " +
					"class='p_hov' onclick='openDataPicker(\"line\")'></span> " +
				"</div>"+
				
				"<tr><td height='24'><span style='float:left;'>公交：</span>" +
				
				"<div style='float:left;' onchange='selposition' class='f7' id='station' " +
					"dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=stationQuery&type=BUS&areaId="+curCityValue+"'"+
					"width='500px' height='300px' title='人员'> " +
					"<input dataPicker='value' name='stationId' label='公交' " +
					"id='stationId' type='hidden' " +
					"readOnly='readOnly' /> <input dataPicker='name' " +
					"ondblclick='openDataPicker(\"name\")' value='' " +
					"name='stationName' id='stationName' type='text' /> <strong " +
					"onclick='clearDataPicker(\"station\")'></strong> <span " +
					"class='p_hov' onclick='openDataPicker(\"station\")'></span> " +
				"</div>" +
				
				"</td></tr>"+
				"<tr><td height='24'><span style='float:left;'>学校：</span>" +
				
				"<div style='float:left;' onchange='selposition' class='f7' id='school' " +
					"dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=stationQuery&type=SCHOOL&areaId="+curCityValue+"'"+
					"width='500px' height='300px' title='人员'> " +
					"<input dataPicker='value' name='schoolId' label='人员' " +
					" id='schoolId' type='hidden' " +
					"readOnly='readOnly' /> <input dataPicker='name' " +
					"ondblclick='openDataPicker(\"school\")' value='' " +
					"name='schoolName' id='schoolName' type='text' /> <strong " +
					"onclick='clearDataPicker(\"school\")'></strong> <span " +
					"class='p_hov' onclick='openDataPicker(\"school\")'></span> " +
				"</div>" +
				
				"</td></tr>"+ 
			 
			"<tr><td style='text-align:center;' colspan='2'>" +
			"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
			"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	
} 
PositionMenu.show = function(){
	var params = {panel:this.config.panel,width:190};
	this.showPanel(params) 
}

PositionMenu.confirm = function(){
	var meMenu = this;
	this.config.showFlag = false;
	this.config.panel.hide();
	var displayName="";
	if(this.config.panel.find("#lineName").val()){
		displayName+="地铁："+this.config.panel.find("#lineName").val();
	}
	if(this.config.panel.find("#stationName").val()){
		//if((displayName+"站点："+this.config.panel.find("#stationName").val()).length>this.config.maxLength){
		//	displayName+="...";
		//}else{
			displayName+="站点："+this.config.panel.find("#stationName").val();
		//}
	}
	if(this.config.panel.find("#schoolName").val()){
		//if((displayName+"学校："+this.config.panel.find("#schoolName").val()).length>this.config.maxLength){
		//	displayName+="...";
		//}else{
			displayName+="学校："+this.config.panel.find("#schoolName").val();
		//}
	}
	if(displayName){
		
		this.showSelVal(displayName);
		
	}else{
		displayName = this.config.inputTitle;
		this.showSelVal(displayName,true);
				
	}
	//函数写在盘源查询页面
	confirmPosition();
}
PositionMenu.resetAll = function(){
	this.config.panel.find("#schoolId").val("");
	this.config.panel.find("#schoolName").val("");
	this.config.panel.find("#stationName").val("");
	this.config.panel.find("#stationId").val("");
	this.config.panel.find("#lineId").val("");
	this.config.panel.find("#lineName").val("");
	this.resetInput();
	
	resetPosition();
}  
PositionMenu.getValue = function(){
	if(!this.config.panel){
		return null;
	}else{ 
		var resultValue = {};
		if(this.config.panel.find("#schoolId").val()){
			resultValue.school = this.config.panel.find("#schoolId").val();
		}
		if(this.config.panel.find("#stationId").val()){
			resultValue.station = this.config.panel.find("#stationId").val();
		}
		if(this.config.panel.find("#lineId").val()){
			resultValue.line = this.config.panel.find("#lineId").val()
		}
		return resultValue;
	}
}


/********************************   PositionMenu  End *********************************************/

/********************************   NumberRangeMenu  Start*********************************************/
//重写方法
NumberRangeMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			unitName:null,
			inputTitle:null,
			showFlag:false
	};
	this.config.objId = inputId;
	if(params.unitName){
		this.config.unitName = params.unitName;
	}
	if(params.inputTitle){
		this.config.inputTitle = params.inputTitle;
	}
	
	this.config.panel = $(this.context).append("<table class='py_search'> <tr><td>" +
									"<input id='startValue' style='width:50px;' name='' type='text' />" +
									" 至 " +
									"<input id='endValue' style='width:50px;' name='' type='text' />" +
								"</td></tr>" +
								"<tr><td style='text-align:center;'> " +
								"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
								"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	var meMenu = this;
	 
	MenuManager.menus[this.config.objId]=this;
	this.config.panel.find("#startValue").keypress(function(event) {  
		if (!$.browser.mozilla) {
			if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57)) {  
				event.preventDefault();  
			}  
		} else {  
			if (event.charCode && (event.charCode < 48 || event.charCode > 57)) { 
			 event.preventDefault();  
			}  
		}  
	 });
	this.config.panel.find("#endValue").keypress(function(event) {  
		if (!$.browser.mozilla) {
			if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57)) {  
				event.preventDefault();  
			}  
		} else {  
			if (event.charCode && (event.charCode < 48 || event.charCode > 57)) { 
			 event.preventDefault();  
			}  
		}   
	 });
} 

NumberRangeMenu.confirm = function(){
	this.config.showFlag = false;
	this.config.panel.hide(); 
	var displayName = "";
	var t = false;
	if(!this.config.panel.find("#startValue").val()&&this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#endValue").val()+this.config.unitName+"以内";
	}else if(this.config.panel.find("#startValue").val()&&!this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#startValue").val()+this.config.unitName+"以上";
	}else if(this.config.panel.find("#startValue").val()&&this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#startValue").val()+"-"+this.config.panel.find("#endValue").val()+this.config.unitName;
	}else{
		t= true;
		displayName="不限";
	}
	if(this.config.inputTitle!=null&&this.config.inputTitle!="")
	{
		this.showSelVal(this.config.inputTitle+":"+displayName,t);
	}else{
		this.showSelVal(displayName,t);
	}
	
}

NumberRangeMenu.show = function(){
	var params = {panel:this.config.panel,width:160};
	this.showPanel(params) 
}

NumberRangeMenu.resetAll = function(){
	this.config.panel.find("#startValue").val("");
	this.config.panel.find("#endValue").val("");
	this.resetInput();
} 
NumberRangeMenu.getValue = function(){
	var resultValue = {};
	if(!this.config.panel){
		return null;
	}else{  
		resultValue.startValue = this.config.panel.find("#startValue").val();
		resultValue.endValue = this.config.panel.find("#endValue").val();
	}
	return resultValue;
}
/********************************   NumberRangeMenu  End *********************************************/


/********************************   DateRangeMenu  Start*********************************************/
//重写方法
DateRangeMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			unitName:null,
			inputTitle:null,
			showFlag:false
	};
	this.config.objId = inputId;
	if(params.unitName){
		this.config.unitName = params.unitName;
	}
	if(params.inputTitle){
		this.config.inputTitle = params.inputTitle;
	}
	this.config.panel = $(this.context).append("<table class='py_search'>" + 
									"<tr><td colspan='2' style='text-align:center;'>"
									
									+'<table width="100%" border="0" cellspacing="0" cellpadding="0">'
									+'  <tr>'
									+'   <td align="center"><a href="javascript:void(0)" name="timeshort" key="yest">昨天</a></td>'
									+'   <td align="center"><a href="javascript:void(0)" name="timeshort" key="today">今天</a></td>'
									+'    <td align="center"><a href="javascript:void(0)" name="timeshort" key="thisweek">本周</a></td>'
									+'    <td align="center"><a href="javascript:void(0)" name="timeshort" key="lastmonth">上月</a></td>'
									+'    <td align="center"><a href="javascript:void(0)" name="timeshort" key="thismonth">本月</a></td>'
									+'  </tr>'
									+'</table>'
									
									+"</td></tr>"+
									"<tr><td colspan='2'>" +
									"<input id='startValue' style='width:100px;' value=''  type='text' />" +
									" 至 " +
									"<input id='endValue' style='width:100px;' value=''  type='text' />" +
								"</td></tr>" +
								"<tr><td style='text-align:center;' colspan='2'>" +
								"<b class='btn orangebtn'><a key='thickbox_btn' href='javascript:void(0)'>确定</a></b>&nbsp;" +
								"<b class='btn graybtn'><a key='thickbox_btn01' href='javascript:void(0)'>关闭</a></b></td></tr></table>");
	var meMenu = this;

	this.config.panel.find("#startValue").click(function(event) {  
		WdatePicker({isShowOthers:false,dateFmt:'yyyy/MM/dd'});
	 });

	this.config.panel.find("#endValue").click(function(event) {  
		WdatePicker({isShowOthers:false,dateFmt:'yyyy/MM/dd',minDate:'#F{$dp.$D(\'startValue\')}'});
	 });
	
	this.config.panel.find("a[name='timeshort']").click(function(){
		var key = $(this).attr("key");
		var startinput = $(meMenu.config.panel.find("#startValue"));
		var endinput = $(meMenu.config.panel.find("#endValue"));
		var curdate = new Date();
		if(key=='yest'){
			var yest = getYestoday(curdate,"yyyy/MM/dd");
			startinput.val(yest);
			endinput.val(yest);
		}else if(key=='today'){
			
			startinput.val(formatDate(curdate,"yyyy/MM/dd"));
			endinput.val(formatDate(curdate,"yyyy/MM/dd"));
			
		}else if(key=='thisweek'){
			
			startinput.val(getDateByDays(curdate,"yyyy/MM/dd",1-curdate.getDay()));		
			endinput.val(formatDate(curdate,"yyyy/MM/dd"));
			
		}else if(key=='lastmonth'){
			
			startinput.val(getLastMonthFirst("/"));		
			endinput.val(getLastMonthLast("yyyy/MM/dd","/"));
			
		}else if(key=='thismonth'){
			
			startinput.val(getThisMonthFirst('/'));		
			endinput.val(formatDate(curdate,"yyyy/MM/dd"));
			
		}
	});
} 
DateRangeMenu.show = function(){
	var params = {panel:this.config.panel,width:280};
	this.showPanel(params) 
}

DateRangeMenu.confirm = function(){
	this.config.showFlag = false;
	this.config.panel.hide(); 
	var displayName = "";
	if(!this.config.panel.find("#startValue").val()&&this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#endValue").val()+"以前";
	}else if(this.config.panel.find("#startValue").val()&&!this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#startValue").val()+"以后";
	}else if(this.config.panel.find("#startValue").val()&&this.config.panel.find("#endValue").val()){
		displayName=displayName+this.config.panel.find("#startValue").val()+"-"+this.config.panel.find("#endValue").val();
	}else{
		displayName = this.config.inputTitle+":"+"不限";
		this.showSelVal(displayName);
		return;
	}
	if(this.config.inputTitle!=null&&this.config.inputTitle!="")
	{
		this.showSelVal(this.config.inputTitle+":"+displayName);
	}else{
		this.showSelVal(displayName);
	}
}

DateRangeMenu.resetAll = function(){
	this.config.panel.find("#startValue").val("");
	this.config.panel.find("#endValue").val("");
	this.resetInput();
} 
DateRangeMenu.getValue = function(){
	var resultValue = {};
	if(!this.config.panel){
		return null;
	}else{  
			resultValue.timeStartValue = this.config.panel.find("#startValue").val();
			resultValue.timeEndValue = this.config.panel.find("#endValue").val();
	}
	return resultValue;
} 
/********************************   DateRangeMenu  End *********************************************/


/********************************   DateRangeMenu  Start*********************************************/
//重写方法
DropDownMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:null,
			height:null,
			inputTitle:null,
			unitName:null,
			showFlag:false
	};
	if(params.unitName){
		this.config.unitName = params.unitName;
	}
	if(params.inputTitle){
		this.config.inputTitle = params.inputTitle;
	}
	this.config.objId = inputId;
	this.config.panel = $(this.context).append("<table class='py_search'><tr><TD><input id='selValue' type='hidden'><ul id='optionList'  targetObj = '"+this.config.objId+"'></ul > </td></tr></table>");
	var meMenu = this;
	var tempHtmlStr = "";
	$.each(params.data,function(index,item){
		tempHtmlStr += "<li optionValue='"+item.id+"' style='cursor:pointer;'>"+item.name+"</li>";
	});
	this.config.panel.find("#optionList").html(tempHtmlStr);
	this.config.panel.find("#optionList").find("li").click(function(event){
		$(this).parents("tr").find("input").val($(this).attr("optionValue"));
		$("#"+$(this).parent().attr("targetObj")).val($(this).html());
		meMenu.confirm();
	});
} 
DropDownMenu.show = function(){
	var params = {panel:this.config.panel};
	this.showPanel(params) 
}

DropDownMenu.confirm = function(){
	this.config.showFlag = false;
	this.config.panel.hide(); 
	var displayName = "";
	var selOption = this.config.panel.find("#optionList").find(".selLi");
	if(selOption&&selOption.length>0){
		if(this.config.inputTitle){
			displayName = this.config.inputTitle+":"+selOption.text();
		} 
		this.showSelVal(displayName);
	}
}

DropDownMenu.resetAll = function(){
	this.resetInput();
} 
DropDownMenu.optionClick = null;
DropDownMenu.getValue = function(){
	CheckBoxMenu.getValue = function(){
		var resultValue = {};
		if(!this.config.panel){
			return null;
		}else{  
			return $(this.config.panel).find("#selValue").val();
		}
	} 
} 
/********************************   DropDownMenu  End *********************************************/


/********************************   CheckBoxMenu Start*********************************************/
//重写方法
CheckBoxMenu.init=function(inputId,params){
	this.config = { 
			objId:"",
			panel:null, 
			width:150,
			height:null,
			inputTitle:null,
			unitName:null,
			select:null,
			maxLength:6,
			formatData:null,
			showFlag:false
	};
	jQuery.extend(this.config,params);
	this.config.objId = inputId;
	this.config.panel = $(this.context).append("<table class='py_search'><tr><TD><input id='selValues' type='hidden'><ul id='dataList' ></ul > </td></tr></table>");
	if(this.config.formatData){
		params.data = this.config.formatData(params.data);
	}
	var tempHtmlStr = "";
	//由于楼盘显示特殊,所以增加参数type来加判断
	$.each(params.data,function(index,item){
		tempHtmlStr += "<Li style='cursor:pointer;'><label><input type='checkBox' value='"+item.id+"'>"
		+((typeof(params.type)=="undefined")?item.name:(item.name + (item.registerName ? ", " + item.registerName : "") + " (" + (item.geographyArea ? item.geographyArea.name : "")+")"))
				+"</label></Li>";
	});
	this.config.panel.find("#dataList").html(tempHtmlStr);
} 
CheckBoxMenu.show = function(){ 
	var params = {panel:this.config.panel};
	this.showPanel(params);
}



CheckBoxMenu.confirm = function(){
	if(this.config.showFlag == true){
		this.config.showFlag = false;
		this.config.panel.hide(); 
		var displayName = "";
		var meMenu = this;
		var selOptions = this.config.panel.find("#dataList").find("input:checked");
		if(selOptions&&selOptions.length>0){
			$.each(selOptions,function(index,item){ 
				if(index>0){
					if(meMenu.config.maxLength&&meMenu.config.maxLength!=-1){
						if((displayName+$(item).parent().text()).length>meMenu.config.maxLength){
							displayName+="...";
							return false;
						}
					} 
					displayName+=",";
				}
				displayName += $(item).parent().text();
			})
			if(this.config.inputTitle){
				displayName = this.config.inputTitle+":"+displayName;
			} 
			this.showSelVal(displayName);
			if(this.config.select){
				this.config.select();
			}
		}else{
			displayName = this.config.inputTitle+":不限";
			this.showSelVal(displayName,true);
		}
	} 
}
CheckBoxMenu.resetAll = function(){
	var selOptions = this.config.panel.find("#dataList").find("input:checked");
	$(selOptions).attr("checked",false);
	this.resetInput();
} 
CheckBoxMenu.getValue = function(){
	var resultValue = {};
	if(!this.config.panel){
		return null;
	}else{  
		var selOptions = this.config.panel.find("#dataList").find("input:checked");
		var values = "";
		if(selOptions&&selOptions.length>0){
			$.each(selOptions,function(index,item){ 
				if(index>0){
					values+=",";
				}
				values +="'"+ $(item).val()+"'";
			}) ;
		} 
		return values;
	}
} 
/********************************   CheckBoxMenu  End *********************************************/
 
