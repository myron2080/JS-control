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
		       {id:'add',text:'新增',click:addShortcut,icon:'add'}
			]
		});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend({},$list_defaultGridParam,{
        columns: [ 
            {display: '快捷名称', name: 'name', align: 'left', width: 120},
            {display: '快捷类型', name: 'typeLabel', align: 'left', width: 120},
            {display: '打开方式', name: 'openTypeLabel', align: 'left', width: 120},
            {display: '快捷描述', name: 'remark', align: 'left', width: 120},
            {display: 'url', name: 'url', align: 'left', width: 180},
            {display: '图标', name: 'ioc', align: 'center', width: 90,render:iocRender},
            {display: '操作', name: 'operate', align: 'center', width: 160,render:operateRender},
            {display: '授权', name: 'accredit', align: 'center', width: 100,render:accreditRender}
        ],
        delayLoad:true,
        url:getPath()+'/basedata/shortcut/listData',
        height:($("#main").height()-60)
    }));
	initSimpleDataTree_job();
	$("#systemicon").bind("click",function(){
		flag="largeIcon";
		popDialog("/permission/menu","flag=miniIcon");
	});
	
	initajaxupload("uploadImage","framework/images/upload?direct=shortcuticon",afterupload,submitupload);
	
	$("#type").bind("change",function(){
		$(this).bind("click",function(){
			if($(this).val()=="MENU"){
				$("#urlUl").hide();
				$("#menuUl").show();
			}else{
				$("#urlUl").show();
				$("#menuUl").hide();
				$("#url").val("");
			}
		});
	});
	
	$("#menu").bind("change",function(){
		setSubMenu($(this).val(),true,'');
	});
	
	$("#openType").bind("change",function(){
		if($(this).val()=="WINDOW"){
			$("#windowRemark").show();
		}else{
			$("#windowRemark").hide();
		}
	});
	$("#windowRemark").hide();
	
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

function searchData(){
}

//删除快捷
function deleteRow(data){
	$.post(getPath()+"/basedata/shortcut/delete",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

function setSubMenu(longNumber,isDefault,subMenuId){
//	$.ajax({async: true});    dj浏览器导致卡机，取消使用
	$.post(getPath()+"/basedata/shortcut/getMenuByLongNumber",{longNumber:longNumber},function(data){
		var subMenuList = data.subMenuList;
		var html = "";
		for(var i=0;i<subMenuList.length;i++){
				if(subMenuList[i].id == subMenuId){
					html +="<option selected='selected' value='"+subMenuList[i].id+"'>"+subMenuList[i].name+"</option>";
				}else{
					html +="<option value='"+subMenuList[i].id+"'>"+subMenuList[i].name+"</option>";
				}
		}
		$("#subMenu").html(html);
		if(isDefault){
			$("#subMenu").val(subMenuList[0].id);
		}
	},"json");
//	$.ajax({async: false});
}

//修改快捷
function updateRow(data){
	$.post(getPath()+"/basedata/shortcut/getShortcutById",{id:data.id},function(res){
		if(res.STATE == 'SUCCESS'){
			$("[name=typeOption]").each(function(){
				if($(this).val()==res.shortcut.type){
					$(this).attr("selected","selected");
				}
			});
			$("#shortcutId").val(res.shortcut.id);
			$("#name").val(res.shortcut.name);
			$("#remark").val(res.shortcut.remark);
			$("#openType").val(res.shortcut.openType);
			if(res.shortcut.ioc!=""){
				$("#ioc").attr("src",getPath()+'/images/'+res.shortcut.ioc);
			}else{
				$("#ioc").hide();
			}
			if(res.shortcut.ioc!=''){
				$("#iocUrl").val(res.shortcut.ioc);
				$("#ioc").show();
			}
			if(res.shortcut.openType="WINDOW"){
				$("#windowRemark").show();
			}
			if(res.shortcut.type=="MENU"){
				setSubMenu(res.parentLongNumber,false,res.shortcut.menu.id);
				$("#menu").val(res.parentLongNumber);
				$("#menuUl").show();
				$("#urlUl").hide();
			}else{
				$("#url").val(res.shortcut.url);
				$("#menuUl").hide();
				$("#urlUl").show();
			}
			art.dialog({
				content:$("#baseBank_edit")[0],
				title:'修改快捷方式',
				id:'shortcutWindow',
				button:[{name:'确定',callback:function(){
					saveShortcut();
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
	$.post(getPath()+"/basedata/shortcut/setAccreditRow",{shortcutId:data.id,personId:selectNodes[0].id},function(res){
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
	$.post(getPath()+"/basedata/shortcut/delAccreditRow",{shortcutId:data.id,personId:selectNodes[0].id},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}

function iocRender(data,filterData){
	if(data.ioc == ''){
		return '暂无';
	}
	return '<img width="20" height="20" src="'+getPath()+'/images/'+data.ioc+'"/>';
}

//添加快捷
function addShortcut(){
	$("[name=typeOption]").eq(0).attr("selected","true");
	$("[name=menuOption]").eq(0).attr("selected","true");
	setSubMenu($("#menu").val(),true,'');
	$("#name").val("");
	$("#url").val("");
	$("#remark").val("");
	$("#shortcutId").val("");
	$("#openType").val("");
	$("#windowRemark").hide();
	$("#ioc").hide();
	$("#iocUrl").val("");
	$("#menuUl").show();
	$("#urlUl").hide();
	art.dialog({
		content:$("#baseBank_edit")[0],
		title:'新建快捷方式',
		id:'shortcutWindow',
		button:[{name:'确定',callback:function(){
			saveShortcut();
			return false;
		}},{name:'取消',callback:function(){
			resetList();
			return true;
		}}]
	});
}

//保存编辑
function saveShortcut(){
	var url = $("#url").val();
	var type = $("#type").val();
	var name = $("#name").val();
	var remark = $("#remark").val();
	if(name==""){
		art.dialog.tips("快捷名称不能为空！");
		return;
	}
	if(name.length>5){
		art.dialog.tips("快捷名称最多5字！");
		return;
	}
	if(remark.length>200){
		art.dialog.tips("描述最多输入200字！");
		return;
	}
	if(type!="MENU" && url==""){
		art.dialog.tips("连接url不能为空！");
		return;
	}
	if(url.length>100){
		art.dialog.tips("连接字符最多输入100！");
		return;
	}
	$.post(getPath()+"/basedata/shortcut/save?menu.id="+$("#subMenu").val(),{id:$("#shortcutId").val(),name:name,type:type,url:url,ioc:$("#iocUrl").val(),openType:$("#openType").val(),remark:remark},function(res){
		if(res.STATE == 'SUCCESS'){
			art.dialog.tips(res.MSG);
			art.dialog.list["shortcutWindow"].close();
			resetList();
		}else{
			art.dialog.tips(res.MSG);
		}
	},"json");
}
