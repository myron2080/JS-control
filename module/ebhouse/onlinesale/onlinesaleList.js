$list_editWidth = "830px";
$list_editHeight = ($(window).height()-150);
$list_dataType = "在线售楼处";//数据名称
var keyVal='项目名称';
$(document).ready(function(){
	params ={};
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
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '项目名称', name: 'houseProject.registerName', align: 'left', width: 300},
//            {display: '背景数', name: 'backCount', align: 'right', width: 40},
            {display: '讲解员', name: 'gardenName', align: 'center', width: 200,render:showNarrator},
//            {display: '客服QQ', name: 'QQ', align: 'center', width: 200},
            {display: '创建时间', name: 'houseProject.createTime', align: 'center', width: 130},
            {display: '创建人', name: 'houseProject.createName', align: 'center', width: 125},
            {display: '操作', name: 'operate', align: 'center', width: 250,render:operateRender}
            ],
        parms:{},
        url:getPath() + '/ebhouse/onlinesale/listData',
        onDblClickRow : function (data, rowindex, rowobj) {
        } 
    }));
	inputEnterSearch("key",searchData);
});

function toSetOnlineSale(onlineSaleId,houseProjectId){
	var dlg =art.dialog.open(base +"/ebhouse/onlinesale/toSetOnlineSale?onlineSaleId="+onlineSaleId + "&houseProjectId=" + houseProjectId,
		{
			id : "SetOnlineSale",
			title : "在线售楼处设置",
			background : '#333',
			width : 950,
			height : $list_editHeight,
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
			close:function(){			
				searchData();
			 }
		});			
}

function toSetGard(onlineSaleId,houseProjectId){
	var dlg =art.dialog.open(base +"/ebhouse/onlinesale/toSetGarde?onlineSaleId="+onlineSaleId + "&houseProjectId=" + houseProjectId,
		{
			id : "setGard",
			title : "在线售楼处评分",
			background : '#333',
			width : 950,
			height : $list_editHeight,
			lock : true,
			button : [ {
				className : 'aui_state_highlight',
				name : '保存',
				callback : function() {
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveSetGarde){
						dlg.iframe.contentWindow.saveSetGarde(dlg);
					}
					return false;
				}
			} , {
				name : '取消',
				callback : function() {
				}   
			}],
			close:function(){			
				searchData();
			 }
		});			
}


function showNarrator(data,filterData){
//	if( data.narratorPic != null &&  data.narratorPic != ""){
//		return data.name + '&nbsp;<img src="' + base+ '/images/' + data.narratorPic.replace("size","150X100") + '" />';
//	}else{
		return data.name;
//	}
}


function operateRender(data,filterData){
	var searchType = $("#searchType").val();
	var str='';
	
	str+='<a href="javascript:toSetOnlineSale(\''+data.id+'\',\''+data.houseProject.id+'\');">模板设置</a>';
	if(isNotNull(data.id)){
		str+='| <a href="javascript:tobaseSet(\''+data.id+'\',\''+data.houseProject.id+'\');">基础设置</a> |';
		str+='<a href="javascript:toSetGard(\''+data.id+'\',\''+data.houseProject.id+'\');">评分</a>';
	}
	return str;
}
function tobaseSet(onlineSaleId){
	var flag = false;
	var dlg = art.dialog.open(base +"/ebhouse/onlinesale/tobaseSet?onlineSaleId="+onlineSaleId, {
		id : 'addGardenWindow',
		width :780,
		title:"基础设置",
		height : 380,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.updateBase){
			 		dlg.iframe.contentWindow.updateBase(dlg);
				}
				return false;
			 }
		} ],
		close:function(){}
	
	});
}
function searchData(){
	var param = {};
	var key = $.trim($("#key").val());
	if(key != keyVal){
		param["key"] =$.trim($("#key").val());
	}
	$list_dataParam=param;	
	jQuery.extend($list_dataParam,params);
	resetList();
}

