$tree_async_url = getPath()+"/permission/jobPermission/simpleTreeData";
$tree_container_job = "leftTree_job";
$tree_async_url_job = getPath()+"/permission/jobPermission/simpleTreeData_job";
var leftGrid;
var jobId;
$(document).ready(function(){
	var w = $(window).width();
	//var rw = w-400;
	$("#main").ligerLayout({leftWidth:220,allowLeftResize:true,allowLeftCollapse:true});
	$("#leftTree_job").height($("#main").height()-20);
	$("#leftToolBar_job").ligerToolBar({
		items:[{id:'locate',text:'定位',click:function(){
			var name = $('#treeSearch').val();
			treeLocate('leftTree_job','name',name);
			},icon:'search'}
		]
	});
	
	$("#toolBar").ligerToolBar({
		items:[
		       {id:'add',text:'新增',click:addWorkload,icon:'add'}
			]
		});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 120},
            {display: '类型', name: 'typeLabel', align: 'left', width: 120},
            {display: '序号', name: 'seq', align: 'left', width: 120},
            {display: '图标', name: 'ioc', align: 'left', width: 90,render:iocRender},
            {display: '点击连接', name: 'url', align: 'left', width: 180},
            {display: '方法连接', name: 'remark', align: 'left', width: 120},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender},
            {display: '授权', name: 'accredit', align: 'center', width: 100,render:accreditRender}
        ],
        delayLoad:true,
        url:getPath()+'/basedata/workload/listData',
        height:($("#main").height()-60)
    }));
	initSimpleDataTree_job();
	
	$("#systemicon").bind("click",function(){
		flag="largeIcon";
		popDialog("/permission/menu","flag=miniIcon");
	});
	
	initajaxupload("uploadImage","framework/images/upload?direct=shortcuticon",afterupload,submitupload);

});

submitupload = function(){
	showload();
}
afterupload = function(json){
	hideload();
	if(json.STATE=='FAIL'){
		art.dialog.alert(json.MSG);
		return;
	}else{
	 var url=json.PATH;
     var name = json.FILENAME;
     $("#iocUrl").val(url);
     $("#ioc").attr("src",getPath()+"/images/"+url);
     $("#ioc").show();
     art.dialog.tips(json.MSG);
	}
}

function popDialog(moduleUrl,param){
	art.dialog.data("selectedValue",null);
	var dlg = art.dialog.open(getPath()+moduleUrl+"/chooseImage"+(param ? "?"+param : ""),{
		title:'图片选择',
		lock:true,
		width:'800px',
		height:'480px',
		id:"personPermission",
		button:[{name:'确定',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
				dlg.iframe.contentWindow.saveEdit();
			}
			return false;
		}},{name:'取消',callback:function(){
			flag = false;
			return true;
		}}],
	 close:function(){
		 var selectedValue = art.dialog.data("selectedValue");
		 if(selectedValue){
			 $("#ioc").attr("src",getPath()+"/images/"+selectedValue);
			 $("#iocUrl").val(selectedValue);
			 $("#ioc").show();
		 }
	 }
	});
}


function initSimpleDataTree_job(){
	$.post($tree_async_url_job,{},function(treeData){
		var tree = $.fn.zTree.init($("#"+$tree_container_job), {
			async: {
				enable: false
			},
			callback:{
				onClick:function(event, treeId, treeNode){
					onTreeNodeClick_job(event, treeId, treeNode);
				}
			},
			data:{
				simpleData:{
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: null
				}
			}
		},treeData);
		var nodes = tree.getNodes();
		if(nodes && nodes.length > 0){
			tree.expandNode(nodes[0], true, false, true);
			if(nodes[0].children!=undefined){
				var children=nodes[0].children;
				tree.selectNode(children[0]);
			}else{
				tree.selectNode(nodes[0]);
			}
			onTreeNodeClick_job(null,null,null);
		}
		if(searchData){
			searchData();
		}
	},'json');
}

function onTreeNodeClick_job(event, treeId, treeNode){
	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes[0].children==undefined){
	  $list_dataParam['job']= selectNodes[0].id;
	  var tree = $.fn.zTree.getZTreeObj("leftTree");
	  initSimpleDataTree();
	  resetList();
	}
}

//function setSort(){//跳出设置序号窗口
//	art.dialog({
//		content:$("#sort_edit")[0],
//		title:'新建',
//		witdh:300,
//		id:'sort_edit',
//		button:[{name:'确定',callback:function(){
//			saveSort();
//			return false;
//		}},{name:'取消',callback:function(){
//			resetList();
//			return true;
//		}}]
//	});
//}

//function saveSort(){
//	var paramStr = "";
//	$("[name=num_s]").each(function (){
//		if($(this).val()==""){
//			$(this).val(0);
//		}
//		paramStr += $(this).attr("id")+":"+$(this).val()+":"+$(this).attr("nameValue")+";";
//	});
//	$.post(getPath()+"/basedata/workload/saveSort",{paramStr:paramStr},function(res){
//		if(res.STATE == 'SUCCESS'){
//			art.dialog.tips(res.MSG);
//			art.dialog.list["sort_edit"].close();
//			resetList();
//		}else{
//			art.dialog.tips(res.MSG);
//		}
//	},"json");
//}

//删除快捷
function deleteRow(data){
	$.post(getPath()+"/basedata/workload/delete",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

//修改快捷
function updateRow(data){
	$.post(getPath()+"/basedata/workload/getWorkloadById",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			$("#workloadId").val(res.workload.id);
			$("#name").val(res.workload.name);
			$("#url").val(res.workload.url);
			$("#workladType").val(res.workload.type);
			$("#remark").val(res.workload.remark);
			$("#workladSeq").val(res.workload.seq);
			
			if(res.workload.ioc!=""){
				$("#ioc").attr("src",getPath()+'/images/'+res.workload.ioc);
			}else{
				$("#ioc").hide();
			}
			if(res.workload.ioc!=''){
				$("#iocUrl").val(res.workload.ioc);
				$("#ioc").show();
			}
			
			art.dialog({
				content:$("#workload_edit")[0],
				title:'修改',
				id:'workloadWindow',
				button:[{name:'确定',callback:function(){
					saveWrokload();
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

function operateRender(data,filterData){
		return '<a href="javascript:updateRow({id:\''+data.id+'\'});">修改</a>|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
}

function iocRender(data,filterData){
	if(data.ioc == ''){
		return '暂无';
	}
	return '<img width="20" height="20" src="'+getPath()+'/images/'+data.ioc+'"/>';
}

function accreditRender(data,filterData){
	if(data.isAccredit ==""){
		return '<a href="javascript:setAccreditRow({id:\''+data.id+'\'});">授权</a>';
	}else{
		return '<a href="javascript:delAccreditRow({id:\''+data.id+'\'});">取消授权</a>';
	}
}

function setAccreditRow(data){
	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
	var selectNodes = tree.getSelectedNodes();
	$.post(getPath()+"/basedata/workload/setAccreditRow",{workloadId:data.id,jobId:selectNodes[0].id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

function delAccreditRow(data){
	var tree = $.fn.zTree.getZTreeObj("leftTree_job");
	var selectNodes = tree.getSelectedNodes();
	$.post(getPath()+"/basedata/workload/delAccreditRow",{workloadId:data.id,jobId:selectNodes[0].id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

//添加快捷
function addWorkload(){
	$("#name").val("");
	$("#url").val("");
	$("#remark").val("");
	$("#workloadId").val("");
	$("#workladType").val("");
	art.dialog({
		content:$("#workload_edit")[0],
		title:'新建',
		id:'workloadWindow',
		button:[{name:'确定',callback:function(){
			saveWrokload();
			return false;
		}},{name:'取消',callback:function(){
			resetList();
			return true;
		}}]
	});
}

//保存编辑
function saveWrokload(){
	var url = $("#url").val();
	var name = $("#name").val();
	var remark = $("#remark").val();
	if(name==""){
		art.dialog.tips("名称不能为空！");
		return;
	}
	if(remark==""){
		art.dialog.tips("方法连接不能为空！");
		return;
	}
	$.post(getPath()+"/basedata/workload/save",{id:$("#workloadId").val(),name:name,url:url,remark:remark,ioc:$("#iocUrl").val(),seq:$("#workladSeq").val(),type:$("#workladType").val()},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			art.dialog.list["workloadWindow"].close();
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}
