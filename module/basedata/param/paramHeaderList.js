$list_addUrl = getPath()+"/basedata/param/add";//新增url
$list_editUrl = getPath()+"/basedata/param/edit";//查看/编辑
$list_deleteUrl = getPath()+"/basedata/param/deleteLinesRow";//删除url
$list_editWidth = "565px";
$list_editHeight = "400px";
$list_dataType = "参数设置";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	
	/*$("#toolBar").append(
		'<div style="float:left;padding-left:5px;display:inline;">'
    	+'	<form onsubmit="searchData();return false;">'	
	    +'		<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="参数编码/参数名称" defaultValue="参数编码/参数名称" value="参数编码/参数名称" id="searchKeyWord" class="input"/>'
	    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
    	+'	</form>'
    	+'</div>'
	);$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});*/
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'oprater', align: 'right', width: 120,render:operateRender},
            {display: '参数编码', name: 'paramHeader.number', align: 'left', width: 80},
            {display: '参数名称', name: 'paramHeader.name', align: 'left', width: 70},
            {display: '参数类型', name: 'dataTypeLabel', align: 'left', width: 70},
            {display: '参数值', name: 'paramValue', align: 'left', width: 70},
            {display: '所属组织', name: 'org.name', align: 'left', width: 100},
            {display: '参数状态', name: 'enable', align: 'center', width: 60,render:function(data){
            	if(data['status']==1){
            		return "启用";
            	}else{
            		return "未启用";
            	}
            }},
            {display: '参数描述', name: 'paramHeader.description', align: 'left', width: 350},
            {display: '数据来源', name: 'syncType', align: 'left', width: 80,render:resourceRender}
        ],
        url:getPath()+'/basedata/param/lines/listData?isModuleType='+isModuleType+'&moduleType='+moduleType
    }));
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			$("#searchBtn").click();
	    }});
});

function resourceRender(data,filterData){
	var imgDis =   '';
	if(data.paramHeader.syncType=='CLOUD'){
		imgDis = '云端';
	}else{
		imgDis = '本地';
	}
	return imgDis;
}
function getAddRowParam(){
	if(moduleType==""|| moduleType==null){
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {parent:null};
	}
	var   moduleEmun= $("#moduleEmunDiv").html().split(",");
	var isGoOn=0;
	for ( var i = 0; i < moduleEmun.length; i++) {
		if($.trim(moduleEmun[i])==moduleType){
			isGoOn++;
		}
	}
	if(isGoOn>0){
		return {parent:moduleType};
	}else{
		artDialog.alert("请选择最小节点数。",function(){})
		return 'notValidate';
		return {parent:null};
	}
}


//查看行
function viewRow(rowData){
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.paramHeader.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.paramHeader.id;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}

function operateRender(data,filterData){
	var e = (data.status=='1'?'0':'1');
	var t = (data.status=='0'?'启用':'禁用');
	var operateStr ="";
	operateStr +='<a href="javascript:updateRow({id:\''+data.paramHeader.id+'\',status:\''+e+'\'});">'+t+'</a>|';
	operateStr +='<a href="javascript:editRow({id:\''+data.paramHeader.id+'\'});">编辑</a>|';
	operateStr +='<a href="javascript:deleteRow({id:\''+data.paramHeader.id+'\'});">删除</a>';
	
	return operateStr;
}


//删除行
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		art.dialog.confirm('确定删除该行数据?',function(){
			$.post($list_deleteUrl,{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}
			},'json');
			return true;
		},function(){
			return true;
		});
	}
}

function updateRow(rowData){
	$.post(getPath() + '/basedata/param/updateStatus',rowData,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}
