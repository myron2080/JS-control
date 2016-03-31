/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/ebhouse/decorating/listData';
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{display: '装修方案名称', name: 'name', align: 'left', width:'10%'},
			{display: '户型', name: 'fasthousetype.name', align: 'center', width:'5%' },
			{display: '项目名称', name: 'houseproject.spreadName', align: 'center', width:'10%' },
			{display: '创建时间', name: 'createTime', align: 'center', width: '8%'},
			{display: '创建人', name: 'creator.name', align: 'center', width: '5%'},
			{display: '操作', name: 'operate', align: 'center', width: '20%',render:operateRender}
        ],
        url:getPath()+"/ebhouse/decorating/listData",
        onDblClickRow : editR
    }));
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	//新增方案
	$("#addProject").click(function(){
		add();
	});
	function addProject(dlg){
		$('form').attr('action',getPath()+"/p2p/investmentProject/save");
		saveAdd(dlg);
	}
	$("#serchBtn").click(function(){
		selectList();
	});
	//清除

	inputEnterSearch("keyword",selectList);
});
function add(){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/ebhouse/decorating/add", {
		id : 'addGardenWindow',
		width : 880,
		title:"新增方案",
		height : 420,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addProject){
			 		dlg.iframe.contentWindow.addProject(dlg);
				}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	
	});
}
function app1(){
	if(permission1){
		return "<a>审批</a>";
	}
}
function app2(){
	if(permission2){
		return "<a>审批</a>";
	}
}
function app3(){
	if(permission3){
		return "<a>审批</a>";
	}
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	
	if($("#keyword").val()!='户型/方案名称'){
		$list_dataParam['keyword'] =$("#keyword").val();
	}else{
		delete $list_dataParam['keyword']
	}
	if($("#projectId").val()!=''){
		$list_dataParam['projectId'] =$("#projectId").val();
	}else{
		delete $list_dataParam['projectId']
	}
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var returnStr = "";
	if(data.isIndexView==1){
		returnStr='<a href="javascript:updateIndexView(\''+data.id+'\',\'0\');">取消首页显示</a> | ';
	}else{
		returnStr='<a href="javascript:updateIndexView(\''+data.id+'\',\'1\');">设置首页显示</a> | ';
	}
	returnStr += ' <a href="javascript:image360Set(\''+data.id+'\',\''+data.name+'\');">设置360度</a> | <a href="javascript:deleteDC(\''+data.id+'\');">删除</a>| <a href="javascript:updateDC(\''+data.id+'\');">修改</a> '
	return returnStr;
}
function deleteDC(id){
	art.dialog.confirm("确认删除此装修方案？",function(){
		$.post(getPath()+"/ebhouse/decorating/deletedc",{id:id},function(data){
			if(data.MSG){
				art.dialog.tips(data.MSG);
			}else{
				art.dialog.tips("删除成功!");
				selectList();
			}
		});
	});
	
}
function updateIndexView(id,view){
	$.post(getPath()+"/ebhouse/decorating/updateIndexView",{fid:id,isView:view},function(data){
		if(data.MSG){
			art.dialog.tips(data.MSG);
		}else{
			art.dialog.tips("设置成功!");
			selectList();
		}
	},"json");
}
function createtimeRender(data,index,cdata){	
	var d=new Date(data.createTime);
	return  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}
function image360Set(id,name){
	window.top.addTabItem(id,getPath()+"/ebhouse/decorating/image360Set?decId="+id,name+'设置');
}
function editR(data){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/ebhouse/decorating/edit?id="+data.id, {
		id : 'edit',
		width : 880,
		title:"编辑方案",
		height : 420,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addProject){
			 		dlg.iframe.contentWindow.addProject(dlg);
				}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	
	});
}
function updateDC(pid){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/ebhouse/decorating/edit?id="+pid, {
		id : 'edit',
		width : 880,
		title:"编辑方案",
		height : 420,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addProject){
			 		dlg.iframe.contentWindow.addProject(dlg);
				}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	
	});
}

function deleteGarden(id){
	art.dialog.confirm("你确定要此记录？",function(){
		$.post($list_deleteUrl,{gardenId:id},function(res){ 
			if(res!=null){
				if(res.STATE=="1"){
					art.dialog.tips(res.MSG,null,"succeed");
					selectList();
				}else{
					art.dialog.alert(res.MSG);
				}
			}
		},'json');
	});
}

function showMenuArea() {
	$.post(getPath()+"/basedata/area/getListDataByKey",{term:$("#areaName").val()},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#areaName");
			var cityOffset = $("#areaName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function showMenuCity() {
	$.post(getPath()+"/basedata/area/getListDataByKey",{term:$("#cityName").val(),type:"1"},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#cityName");
			var cityOffset = $("#cityName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function showMenu() {
	$.post(getPath()+"/broker/garden/getGardensByKey",{term:$("#gardenName").val()},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#gardenName");
			var cityOffset = $("#gardenName").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "gardenName" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
function beforeClick(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.checkNode(treeNode, !treeNode.checked, null, true);
	return false;
}

function onCheck(e, treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	nodes = zTree.getCheckedNodes(true),
	v = "";
	id= "";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
		id += nodes[i].id + ",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	var gardenObj = $("#gardenName");
	gardenObj.attr("value", v);
	var gardenId = $("#gardenId");
	gardenId.attr("value",id);
	
	$("#cityName").val("");
	$("#cityName").val("");
}

var setting = {
		check: {
			enable: true,
			chkboxType: {"Y":"", "N":""}
		},
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onCheck: onCheck
		}
	};
var zNodes;

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

