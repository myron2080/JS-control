$tree_async_url = getPath()+"/permission/jobPermission/simpleTreeData";
$tree_container_job = "leftTree_job";
$tree_async_url_job = getPath()+"/permission/jobPermission/simpleTreeData_job";
var leftGrid;
var jobId;
$(document).ready(function(){
	
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRemind,icon:'add'}
			]
		});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '提醒项目', name: 'name', align: 'left', width: 120},
            {display: '提醒描述', name: 'remark', align: 'left', width: 120},
            {display: '提醒项方法', name: 'url', align: 'left', width: 120},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        delayLoad:true,
        url:getPath()+'/basedata/remind/listData'
    }));
	resetList();
});

//删除提醒
function deleteRow(data){
	$.post(getPath()+"/basedata/remind/delete",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

function operateRender(data,filterData){
		return '<a href="javascript:updateRow({id:\''+data.id+'\'});">修改</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function updateRow(data){
	$.post(getPath()+"/basedata/remind/getRemindById",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			$("#remindId").val(res.remind.id);
			$("#name").val(res.remind.name);
			$("#url").val(res.remind.url);
			$("#remark").val(res.remind.remark);
			art.dialog({
				content:$("#baseBank_edit")[0],
				title:'修改提醒',
				id:'remindWindow',
				button:[{name:'确定',callback:function(){
					saveRemind();
					return false;
				}},{name:'取消',callback:function(){
					resetList();
					return true;
				}}]
			});
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
	
}

//添加提醒
function addRemind(){
	$("#name").val("");
	$("#url").val("");
	$("#remark").val("");
	$("#remindId").val("");
	art.dialog({
		content:$("#baseBank_edit")[0],
		title:'新建提醒',
		id:'remindWindow',
		button:[{name:'确定',callback:function(){
			saveRemind();
			return false;
		}},{name:'取消',callback:function(){
			resetList();
			return true;
		}}]
	});
}

//保存编辑
function saveRemind(){
	var name = $("#name").val();
	var url = $("#url").val();
	var remark = $("#remark").val();
	if(name=="" || url=="" || remark ==""){
		art.dialog.tips("请将信息填写完整！");
		return;
	}
	$.post(getPath()+"/basedata/remind/save",{id:$("#remindId").val(),name:name,url:url,remark:remark},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			art.dialog.list["remindWindow"].close();
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}
