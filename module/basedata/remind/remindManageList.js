$tree_async_url = getPath()+"/permission/jobPermission/simpleTreeData";
$tree_container_job = "leftTree_job";
$tree_async_url_job = getPath()+"/permission/jobPermission/simpleTreeData_job";
var leftGrid;
var jobId;
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addRemindWindow,icon:'add'},
		       {id:'addreminditem',text:'新增提醒项',click:addreminditem,icon:'config'}
			]
		});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '岗位', name: 'job.name', align: 'left', width: 120},
            {display: '提醒项目', name: 'remind.name', align: 'left', width: 120,render:nameRender},
            {display: '备注', name: 'remind.remark', align: 'left', width: 120,render:remarkRender},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender}
        ],
        delayLoad:true,
        url:getPath()+'/basedata/remindManage/listData'
    }));
	
	
	resetList();
});

function addreminditem(){
	openWindow(getPath()+'/basedata/remind/list');
}

//删除提醒
function deleteRow(data){
	$.post(getPath()+"/basedata/remindManage/deleteById",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

function openWindow(url){
	art.dialog.open(url,{
		id:'remind',
		title:'新增提醒',
		lock:true,
		width:'600px',
		height:'300px',
		button:[{
			name:'关闭'
		}]
	});
}

function operateRender(data,filterData){
		return '<a href="javascript:updateRow({id:\''+data.job.id+'\'});">修改</a>|<a href="javascript:deleteRow({id:\''+data.job.id+'\'});">删除</a>';
}
function nameRender(data,filterData){
	var str = '';
	for(var i=0;i<data.remindList.length;i++){
		str += data.remindList[i].name;
		if(i!=data.remindList.length-1){
			str+=',';
		}
	}
	return str;
}
function remarkRender(data,filterData){
	var str = '';
	for(var i=0;i<data.remindList.length;i++){
		str += data.remindList[i].remark;
		if(i!=data.remindList.length-1){
			str+=',';
		}
	}
	return str;
}

function setJobLevel(id){
	//$.ajax({async: true});
	$.post(getPath()+"/basedata/remindManage/jobLevel",{job:id},function(res){
		var jobLevelList = res.jobLevelList;
		var html = "";
		for(var i=0;i<jobLevelList.length;i++){
				html +="<option value='"+jobLevelList[i].id+"'>"+jobLevelList[i].name+"</option>";
		}
		$("#jobLevel").html(html);
	},"json");
	//$.ajax({async: false});
}
//修改
function updateRow(data){
	$.post(getPath()+"/basedata/remindManage/getRemindManageById",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			
			//$("#jobLevelId").val(res.remindManage.jobLevel.id);
			$("#job").val(res.remindManage.job.id);
			//setJobLevel(res.remindManage.job.id);
			//$("#jobLevel").val(res.remindManage.jobLevel.id);
			var remindArr = res.remindManage.remindList;
			$("[name=remind]").attr("checked",false);
			for(var i=0;i<remindArr.length;i++){
				$("[name=remind]").each(function(){				
					if($(this)[0].value==remindArr[i].id){
						$(this)[0].checked = true;
					};
				});
			}
			art.dialog({
				content:$("#baseBank_edit")[0],
				title:'修改提醒',
				id:'remindManageWindow',
				button:[{name:'确定',callback:function(){
					var remindIdStr = '';
					$("[name=remind]").each(function(){
						if($(this)[0].checked==true){
							remindIdStr += $(this)[0].id+',';
						};
					});
					if(remindIdStr==""){
						art.dialog.tips("请至少选择一项提醒！");
						return false;
					}
					$.post(getPath()+"/basedata/remindManage/update",{id:$("#job").val(),jobId:$("#job").val(),remindIdStr:remindIdStr},function(res){
						if(res.STATE == 'SUCCESS'){
							art.dialog.list["remindManageWindow"].close();
							art.dialog.tips(res.MSG);
							resetList();
						}else{
							art.dialog.list["remindManageWindow"].close();
							art.dialog.tips(res.MSG);
						}
					},"json");
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
function addRemindWindow(){
	$("#job").val("");
	$("[name=remind]").each(function(){
		$(this)[0].checked=false;
	});
	//setJobLevel($(this)[0].value);
	//$("#jobLevel").val("");
	$("#remindManageId").val("");
	art.dialog({
		content:$("#baseBank_edit")[0],
		title:'新建提醒',
		id:'remindManageWindow',
		button:[{name:'确定',callback:function(){
			saveRemindManage();
			return false;
		}},{name:'取消',callback:function(){
			resetList();
			return true;
		}}]
	});
}

//保存编辑
function saveRemindManage(){
	var remindIdStr = '';
	$("[name=remind]").each(function(){
		if($(this)[0].checked==true){
			remindIdStr += $(this)[0].id+',';
		};
	});
	if(remindIdStr==""){
		art.dialog.tips("请至少选择一项提醒！");
		return;
	}
	$.post(getPath()+"/basedata/remindManage/save",{jobId:$("#job").val(),remindIdStr:remindIdStr},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.list["remindManageWindow"].close();
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.list["remindManageWindow"].close();
			art.dialog.tips(res.MSG);
		}
	},"json");
}
