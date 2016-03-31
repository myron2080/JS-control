var keyVal='流水号,充值人,充值人身份证,金额';
$(document).ready(function(){
	params1 ={};
	params1.inputTitle = "充值日期";	
	MenuManager.common.create("DateRangeMenu","shiftinDate",params1);
	params2 ={};
	$('#key').parent().attr("title",keyVal);
	$('#key').val(keyVal);
	$("#key").focus(function(){ 
		if($(this).val()==keyVal){
			$(this).val("");
		}
	}); 
	$("#key").blur(function(){
		if($(this).val()==""){
			$(this).val(keyVal);
		}
	});
	//回车键事件
	inputEnterSearch("key",searchData);
	
	var searchType = "down";
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
	        parms:{"searchType":searchType,pattern:"OFFLINE",status:0,sortname:''},
	        url:getPath() + '/p2p/shiftinList/listData',
	        onAfterShowData:function(countData){
	        },
	        onDblClickRow : function (data, rowindex, rowobj) {
//	    		showManager(data);
	        }         
	    }));
	
	initData();
});

function initData(){
	$list_dataGrid.setOptions({
		columns:[ 
				 {display: '流水号', name: 'number', align: 'left', width: 120},
				 {display: '充值人', name: 'user.name', align: 'center', width: 80},
		         {display: '充值人身份证', name: 'user.idcardno', align: 'left', width: 120},
		         {display: '充值日期', name: 'shiftinDateStr', align: 'center', width: 130},
		         {display: '金额', name: 'money', align: 'left', width: 100},
		         {display: '确认', name: 'data', align: 'center', width: 70,render:statusRender},
		         {display: '收款账户', name: 'data', align: 'center', width: 400,render:accountRender}
                 ]
	});
}

function statusRender(data,filterData){
	var str='';

	if(data.status == 0){
		str+='<a href=javascript:toConfirmShiftin("'+data.id+'");>确认收款</a>'
	}else{
		str+='已确认收款';
	}
	return str;
}

function accountRender(data,filterData){
	var str='';
	if(data.status != 0 && data.pattern == 'OFFLINE'){
		str+= data.bankName + ',' + data.branchName + '  ' ;
		if(data.confirmBank){
			str+= data.confirmBank.account; 
		}
		
	}else{
		str+='';
	}
	return str;
}


function toConfirmShiftin(id){
		art.dialog.data("flag",false);
		var dlg = art.dialog.open(base +"/p2p/shiftinList/toConfirmShiftin?id="+id ,{
			id : "toConfirmData",
			title : "确认到账",
			background : '#333',
			width : 480,
			height : 150,
			lock : true	,
			button : [{
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.save){
						dlg.iframe.contentWindow.save(dlg);
						setTimeout(function(){
							searchData();
						},500);	
					}
					return false;
				}
			}, {
				name : '取消',
				callback : function() {
				}   
			}],
			close: function(){
			}
		});	
}

function showManager(data){
	art.dialog.open(base +"/p2p/shiftinList/viewData?id="+data.id,{
		id : "shiftinView",
		title : '查看充值',
		background : '#333',
		width : 950,
		height : $list_editHeight,
		lock : true	
	});	
}

function searchData(){
	var param = {};
	var params = getFilter();
	$('#dataForm').find('input,select').each(function(){
	  var v = $(this).val();
	  if(v){
		  if(!($(this).attr('id')=='key' && v==keyVal)){
			  param[$(this).attr('name')] = $.trim($(this).val());
		  }
	   }
	  });
	$list_dataParam=param;	
	jQuery.extend($list_dataParam,params);
	resetList();
}


function setQueryParam(){
	var param = {};
	var params = getFilter();
	$('#dataForm').find('input,select').each(function(){
	  var v = $(this).val();
	  if(v){
		  if(!($(this).attr('id')=='key' && v==keyVal)){
			  param[$(this).attr('name')] = $(this).val();
		  }
	   }
	  });
	$list_dataParam=param;	
	jQuery.extend($list_dataParam,params);
	return $list_dataParam;
}

function onEmpty(){
	$('#key').val(keyVal);
	$('[clear]').val('');
	$('#shiftinDate').val("shiftinDate");
}

//页签选择修改
function offlineRecharge(type,status){
	$("#pattern").val(type);
	$("#status").val(status);
	searchData();
}

//修改选项卡
function setTab(obj){
	$('.hover').removeClass('hover');
	$(obj).addClass('hover');
}
function getFilter(){
	var params = {};
	var paramsTemp;	
	if(MenuManager.menus["shiftinDate"]){
		paramsTemp = MenuManager.menus["shiftinDate"].getValue();
	}
	jQuery.extend(params,paramsTemp);
	return params;
}
