var keyVal='流水号,借款人,借款人身份证,金额';
$(document).ready(function(){
	params1 ={};
	params1.inputTitle = "借款日期";	
	MenuManager.common.create("DateRangeMenu","borrowDate",params1);
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
	        parms:{"searchType":searchType,sortname:''},
	        url:getPath() + '/p2p/borrowList/listData',
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
				 {display: '流水号', name: 'number', align: 'center', width: 120},
				 {display: '借款人', name: 'user.name', align: 'center', width: 80},
		         {display: '借款人身份证', name: 'user.idcardno', align: 'left', width: 180},
		         {display: '借款日期', name: 'borrowDate', align: 'center', width: 100},
		         {display: '金额', name: 'money', align: 'right', width: 100},
		         {display: '确认', name: 'data', align: 'center', width: 100,render:statusRender},
		         {display: '付款账户', name: 'data', align: 'left', width: 300,render:accountRender},
		         {display: '收款账号', name: 'daa', align: 'left', width: 300,render:useraccRender}
                 ],enabledSort :true
	});
}

function statusRender(data,filterData){
	var str='';

	if(data.status == 0){
		str+='<a href=javascript:toConfirmBorrow("'+data.id+'");>确认收款</a>'
	}else{
		str+='已确认';
	}
	return str;
}
function useraccRender(data){
	var str='';
	if(data.status != 0 && data.userCard!=null){
		if(data.userCard.bank != null){
			str+= data.userCard.bank.bankName + ',';
		}
		if(data.userCard.branch != null){
			str+= data.userCard.bank.bankName + '  ';
		}
		str+= data.userCard.cardNo; 
	}else{
		str+='';
	}
	return str;
}
function accountRender(data,filterData){
	var str='';
	if(data.status != 0){
		str+= data.bankName + ',' + data.branchName + '  ' + data.confirmBank.account; 
	}else{
		str+='';
	}
	return str;
}

function toConfirmBorrow(id){
		art.dialog.data("flag",false);
		var dlg = art.dialog.open(base +"/p2p/borrowList/toConfirmBorrow?id="+id ,{
			id : "toConfirmData",
			title : "确认到账",
			background : '#333',
			width : 520,
			height : 200,
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
	art.dialog.open(base +"/p2p/borrowList/viewData?id="+data.id,{
		id : "borrowView",
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
	$('#borrowDate').val("borrowDate");
}

//页签选择修改
function updateType(type){
	$("#searchType").val(type);
	if(type=='INTENTION'){
		initData();
	}else if(type=='WITHDRAWALS'){
		initData();
	}
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
	if(MenuManager.menus["borrowDate"]){
		paramsTemp = MenuManager.menus["borrowDate"].getValue();
	}
	jQuery.extend(params,paramsTemp);
	return params;
}
