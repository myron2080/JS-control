$list_dataType = "装修公司列表";//数据名称
var keyVal='公司名称/联系人/电话/地址';
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
            {display: '公司名称', name: 'name', align: 'left', width: 200},
            {display: '联系人', name: 'contectName', align: 'center', width: 120},
            {display: '联系电话', name: 'phone', align: 'center', width: 120},
            {display: '公司类型', name: 'dataTypeStr', align: 'center', width: 120},
            {display: '公司地址', name: 'address', align: 'center', width: 350},
            {display: '操作', name: 'operate', align: 'center', width: 300,render:operateRender}
            ],
        parms:{},
        url:getPath() + '/ebhouse/decorateCompany/listData',
        onDblClickRow : function (data, rowindex, rowobj) {
        	editData(data.id);
        } 
    }));
	inputEnterSearch("key",searchData);
	
	//新增方案
	$("#addCompany").click(function(){
		editData();
	});
});


function deleteRow(id){
	art.dialog.confirm("确认删除此装修公司？",function(){
		$.post(getPath() + '/ebhouse/decorateCompany/delete',{id:id},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				refresh();
			}
		},'json');
	});
}

function enableRow(id,status){
	if(status == 'ENABLE'){
		status = "DISABLED";
	}else{
		status = "ENABLE";
	}
	$.post(getPath() + '/ebhouse/decorateCompany/enableRow',{id:id,status: status},function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}

function editData(id){
	var title="";
	if(!id){
		title="装修公司-新增";
	}else{
		title="装修公司-编辑";
	}
	var dlg =art.dialog.open(base +"/ebhouse/decorateCompany/toEditData?id="+id,
		{
			id : "editData",
			title :title,
			background : '#333',
			width : 830,
			height : 400,
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
				name : '关闭',
				callback : function() {
				}   
			}],
			close:function(){			
				searchData();
			 }
		});			
}



function operateRender(data,filterData){
	var str='';
	str+='<a href="javascript:enableRow(\''+data.id+'\',\''+data.status+'\');">' + (data.status == 'ENABLE' ? '禁用' : '启用') + '</a>';
	str+='<a href="javascript:editData(\''+data.id+'\');"> |修改</a>';
	str+='<a href="javascript:deleteRow(\''+data.id+'\');"> |删除</a>';
	return str;
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

