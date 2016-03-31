$list_addUrl = getPath()+"/interflow/homeset/add";
$list_editUrl = getPath()+"/interflow/homeset/edit";
$list_deleteUrl = getPath()+"/interflow/homeset/delete";
$list_editWidth = 650;
$list_editHeight = 400;
$list_dataType="首页版本";
$(document).ready(function(){
	$("#main").ligerLayout({});
	/*$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRow,icon:'add'},
		       {id:'edit',text:'个性首页设置',click:editperm,icon:'modify'}
		       ,
		       {id:'list',text:'portlet配置',click:listportlet,icon:'config'},
		       {id:'countDown',text:'倒计时配置',click:addCountDown,icon:'settings'}
			]
		});*/
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '首页名称', name: 'name', align: 'center', width: 150},
            {display: '首页版本', name: 'layoutStr', align: 'center', width: 120},
            {display: '首页描述', name: 'description', align: 'center', width: 240},
            {display: '是否默认', name: 'isdefault', align: 'center', width: 100,render:defaRender},
            {display: '状态', name: 'statusStr', align: 'center', width: 100},
            {display: '操作', name: 'operate', align: 'center', width: 250,render:operateRender}
            ],
            delayLoad:true,
            paging:true,
        url:getPath() + '/interflow/homeset/listData'
    }));  
	resetList();
});


function operateRender(row,filterData){
	return (row.status=='ENABLE'?
			('<a href="javascript:void(0)" onclick="updateStatus(\''+row.id+'\',\'DISABLED\');">禁用</a> | ')
			:
			('<a href="javascript:void(0)" onclick="updateStatus(\''+row.id+'\',\'ENABLE\');">启用</a> | ')) 
			+
			(row.isdefault=='1'?'<a href=="javascript:void(0)" style="color:#D4D4D4;">设为默认</a> | ':('<a href="javascript:void(0)" onclick="updateDefault(\''+row.id+'\');">设为默认</a> | ')) 	
			+'<a href="javascript:void(0)" onclick="editRow({id:\''+row.id+'\'});">修改</a>'+
			' | <a href="javascript:void(0)" onclick="deleteRow({id:\''+row.id+'\'});">删除</a>'+
			' | <a href="javascript:void(0)" onclick="preview({id:\''+row.id+'\',name:\''+row.name+'\'});">预览</a>';
}

function defaRender(row,filterData){
	return (row.isdefault==1)?'是':'否';
}

function updateDefault(id){
	$.post(getPath()+"/interflow/homeset/updateDefault",{id:id,isdefault:'1'},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.tips('操作成功');
			}
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function updateStatus(id,status){
	$.post(getPath()+"/interflow/homeset/updateStatus",{id:id,status:status},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.tips('操作成功');
			}
			refresh();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function editperm(){
	art.dialog.open(getPath()+"/interflow/positionPortlet/list",{
		id:'positionPortlet',
		title:'授权',
		height:500,
		width:800
	});
}

function listportlet(){
	art.dialog.open(getPath()+"/interflow/portlet/list",{
		id:'portletlist',
		title:'portlet列表',
		height:600,
		width:800
	});
}
function preview(data){
	top.addTabItem(data.id,getPath()+"/interflow/portal/preview?id="+data.id,data.name+"预览");
	 
}

function addCountDown(){
		var dlg = art.dialog.open(getPath()+"/interflow/countDown/add",
				{title:'倒计时 设置',
				 lock:true,
				 width:670||'auto',
				 height:480||'auto',
				 id:"CountDown-ADD",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}]
				});
}