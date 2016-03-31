$list_editWidth = "700px";
$list_editHeight = "456px";
var keyVal='手机号码/邮箱/姓名';
$(document).ready(function(){
	params ={};
	params.inputTitle = "报名时间";	
	MenuManager.common.create("DateRangeMenu","signUpTime",params);
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '操作', name: 'operate', align: 'center', width: 150,render:operateRender},
      			{display: '会员手机号码', name: 'phone', align: 'left', width:130},
      			{display: '真实姓名', name: 'name', align: 'left', width: 110 },
      			{display: '所在城市', name: 'city.id', align: 'left', width:130,render:function(data){
      				if(data.province){
      				return data.province.name+' '+data.city.name;}else{
      				return "";	
      				}
      			}},
      			{display: '性别', name: 'sex', align: 'left', width: 60},  
      			{display: '证件号码', name: 'cardType', align: 'left', width: 180,render:function(data){
      				if(data.cardNumber){
      				return data.cardType+'：'+data.cardNumber;}else{
      				return "";	
      				}
      			}},  
      			{display: '报名日期', name: 'createTime', align: 'left', width: 90}, 
      			{display: '注册日期', name: 'registerTime', align: 'left', width: 90},  
      			{display: '注册来源', name: 'extraOne', align: 'center', width: 90,render:sourceFrom},  
      			{display: '备注', name: 'cusintentdesc', align: 'left', width: 390,render:descRender}
      			  
        ],
        url:getPath()+'/ebhouse/member/listPotential?distributeStatus=UNDISTRIBUTED'
    }));
	bindEvent();
	
	inputEnterSearch("keyConditions",searchData);
});
function sourceFrom(data,filterData){
	if(data.extraOne=='MOBILE'){
		return "手机";
	}else{
		return "电脑";
	}
}
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}


function operateRender(data,filterData){
	return '<a href="javascript:allotPotential(\''+data.id+'\');">分配</a>';
}

function descRender(data,filterData){
	//return '<span sytle="text-decoration: none;" title="' + data.cusintentdesc + '">' + data.cusintentdesc +'</span>';
	
   var remark ='';
	if(data.intionRegionStr)
	remark+="意向区域："+data.intionRegionStr+";";
	if(data.intentionMoneyStr)
	remark+="意向价格："+data.intentionMoneyStr+";";
	if(data.intentionHouseTypeStr)
	remark+="意向户型："+data.intentionHouseTypeStr+";";
	if(data.intionRegionStr)
	remark+="面积："+data.intentionAreaStr+";";
	if(data.others)
	remark+="其他意向："+data.others+";";;
	if(remark=='')
	remark+=data.cusintentdesc;
	if(remark!='')
	return  '<span sytle="text-decoration: none;" title="' + remark + '">' +remark +'</span>';
}


function showPersonData(data,filterData){
	return data.personName +  data.orgName ;
}


function allotPotential(id){
	var dlg =art.dialog.open(base +"/ebhouse/member/toAllotPotential?userId=" + id,
		{
			id : "allotPotential",
			title : "潜在客户分配",
			background : '#333',
			width : 580,
			height : 200,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}
			}],
			close: function(){
				searchData();
			}
		});			
}


function bindEvent(){
	//查询
	$("#selectData").click(function(){
		selectList();
	});
	eventFun($("#keyConditions"));
}


//修改客户意向 条件
function updateType(type){
	$("#distributeStatus").val(type);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        url:getPath()+'/ebhouse/member/listPotential?distributeStatus=' + type
    }));
	if(type=='UNDISTRIBUTED'){
		$list_dataGrid.setOptions({
	        columns: [ 
	      			{display: '会员手机号码', name: 'phone', align: 'left', width:130},
	      			{display: '会员邮箱', name: 'email', align: 'left', width:130 },
	      			{display: '真实姓名', name: 'name', align: 'left', width: 110 },
	      			{display: '所在城市', name: 'city.id', align: 'left', width:130,render:function(data){
	      				if(data.province){
	      				return data.province.name+' '+data.city.name;}else{
	      				return "";	
	      				}
	      			}},
	      			{display: '性别', name: 'sex', align: 'left', width: 60},  
	      			{display: '证件号码', name: 'cardType', align: 'left', width: 180,render:function(data){
	      				if(data.cardNumber){
	      				return data.cardType+'：'+data.cardNumber;}else{
	      				return "";	
	      				}
	      			}},  
	      			{display: '报名日期', name: 'createTime', align: 'left', width: 90}, 
	      			{display: '注册日期', name: 'registerTime', align: 'left', width: 90},  
	      			{display: '备注', name: 'cusintentdesc', align: 'left', width: 390,render:descRender},
	      			{display: '操作', name: 'operate', align: 'center', width: 150,render:operateRender}  
	        ]
	    });
	}else if(type=='DISTRIBUTED'){
		$list_dataGrid.setOptions({
	        columns: [ 
	      			{display: '会员手机号码', name: 'phone', align: 'left', width:130},
	      			{display: '会员邮箱', name: 'email', align: 'left', width:130 },
	      			{display: '真实姓名', name: 'name', align: 'left', width: 110 },
	      			{display: '所在城市', name: 'city.id', align: 'left', width:130,render:function(data){
	      				if(data.province){
	      				return data.province.name+' '+data.city.name;}else{
	      				return "";	
	      				}
	      			}},
	      			{display: '性别', name: 'sex', align: 'left', width: 60},  
	      			{display: '证件号码', name: 'cardType', align: 'left', width: 180,render:function(data){
	      				if(data.cardNumber){
	      				return data.cardType+'：'+data.cardNumber;}else{
	      				return "";	
	      				}
	      			}},  
	      			{display: '报名日期', name: 'createTime', align: 'left', width: 90}, 
	      			{display: '注册日期', name: 'registerTime', align: 'left', width: 90}, 
	      			{display: '备注', name: 'cusintentdesc', align: 'left', width: 390,render:descRender},
	      			{display: '跟进人信息', name: 'operate', align: 'left', width: 260,render:showPersonData}  
	        ]
		});
	}
	setTimeout(function(){
		searchData();
	},100);
}

function searchData(){
	var param = {};
	var params = {};
	if(isNotNull($.trim($("#keyConditions").val())) && $.trim($("#keyConditions").val()) != $("#keyConditions").attr("defaultValue")){
		param["keyConditions"] =$.trim($("#keyConditions").val());
	}
	param["distributeStatus"] =$("#distributeStatus").val();
	$list_dataParam=param;	
	jQuery.extend($list_dataParam,params);
	selectList();
}


//修改选项卡
function setTab(obj){
	$('.hover').removeClass('hover');
	$(obj).addClass('hover');
}


/************************
 * 根据条件查询数据
 * **********************
 */
function selectList(){
	//注册时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["signUpTime"]){
		queryStartDate = MenuManager.menus["signUpTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["signUpTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['signStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['signStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['signEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['signEndDate'];
	}
	var keyConditions= $("#keyConditions").val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	} else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
