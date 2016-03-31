/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/p2p/investmentProject/listDate';
$list_editUrl = getPath()+'/broker/garden/updateView';
$list_addUrl = '/shihua-surety/scheme/initEdit';
$list_deleteUrl = getPath()+'/broker/garden/deleteGarden';
$list_buildingUrl = getPath()+'/broker/building/getList';
$list_buildlistUrl =base+'/broker/building/buildList' //旧版：getPath()+'/broker/building/getList';
$list_imageUrl = getPath()+'/broker/garden/deleteGarden';
$list_modelUrl = getPath()+'/broker/room/modelManager';
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '标书号', name: 'number', align: 'left', width:'5%'},
			{display: '标题', name: 'title', align: 'left', width:'10%'},
			{display: '用途', name: 'purposeName', align: 'center', width:'5%' },
			{display: '还款方式', name: 'paymentOptionsName', align: 'center', width:'10%' },
			{display: '年化收益率(%)', name: 'rate', align: 'center', width: '8%'},
			{display: '金额(元)', name: 'amount', align: 'center', width: '5%'},
			{display: '期限', name: 'deadline', align: 'center', width: '5%'},
			{display: '进度', name: '', align: 'center', width: '6%',hide:true},
			{display: '还差金额', name: '', align: 'center', width: '6%',hide:true},
			{display: '来源', name: 'sourceFromName', align: 'center', width: '6%'},
			{display: '借款人', name: 'borroweName', align: 'center', width:'6%'},
			{display: '申请时间', name: 'createDate', align: 'center', width: '8%'},
			{display: '一级审批', name: 'oneAppperson.name', align: 'center', width: '5%',render:app1},
			{display: '二级审批', name: 'twoAppperson.name', align: 'center', width: '5%',render:app2},
			{display: '三级审批', name: 'threeAppperson.name', align: 'center', width: '5%',render:app3}
		  ],	/*,
			{display: '操作', name: 'operate', align: 'center', width: '12%',render:operateRender}*/
      
        url:getPath()+"/p2p/investmentProject/listDate?sourf=1",
        onDblClickRow : ViewProject
    }));
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	var params ={};
	params.width = 260;
	params.inputTitle = "申请时间";	
	MenuManager.common.create("DateRangeMenu","effectdate",params);
	//新增项目
	$("#addProject").click(function(){
		var flag = false;
		var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/add", {
			id : 'addGardenWindow',
			width : 880,
			title:"新增项目",
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
	});
	function addProject(dlg){
		$('form').attr('action',getPath()+"/p2p/investmentProject/save");
		saveAdd(dlg);
	}
	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
		delete $list_dataParam['geographyAreaId'];
		delete $list_dataParam['areaId'];
		delete $list_dataParam['cityId'];
		delete $list_dataParam['gardenName'];	
		$("#City").val("");
		$("#area").val("");
		$("#geographyArea").val("");
		$("#gardenId").attr("value", "");
		$("#gardenName").attr("value", "名称/推广名/责任人");
		$("#sumSelect").attr("value", "智能查询（楼盘编码等）");
	});

	
});
function ViewProject (obj){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/view?id="+obj.id+"&sourceFrom=SP", {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 980,
		title:"项目查看",
		height : 480,
		lock:true,
		cancelVal: '关闭',
	    cancel: true ,
	    close:function(){
			if(flag)
				selectList();
		}
	});		
}
function app1(data,filterData){
	if(permission1){
		if(!data.oneAppStatus){
			return "<a href='javascript:projectView(\""+data.id+"\",0);'>审批</a> ";
		}else{
			return "<a href='javascript:projectView1(\""+data.id+"\",1);'>查看</a> ";
		}
		
	}else{
		if(!data.oneAppStatus){
			return "待审批";
		}else{
			return "已审批";
		}
	}
}
function app2(data,filterData){
	if(permission2){
		if(!data.twoAppStatus){
			if(!data.oneAppStatus){
				return "待一级审批";
			}
			return "<a href='javascript:projectView(\""+data.id+"\",0);'>审批</a> ";
		}else{
			return "<a href='javascript:projectView1(\""+data.id+"\",1);'>查看</a> ";
		}
	}else{
		if(!data.twoAppStatus){
			return "待审批";
		}else{
			return "已审批";
		}
	}
}
function app3(data,filterData){
	if(permission3){
		if(!data.threeAppStatus){
			if(!data.oneAppStatus){
				return "待二级审批";
			}
			return "<a href='javascript:projectView(\""+data.id+"\",0);'>审批</a> ";
		}else{
			return "<a href='javascript:projectView1(\""+data.id+"\",1);'>查看</a> ";
		}
	}else{
		if(!data.threeAppStatus){
			return "待审批";
		}else{
			return "已审批";
		}
	}
}
function projectView(pid){	
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/view?id="+pid+"&sourceFrom=SP", {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 980,
		title:"项目审批",
		height : 480,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '确定',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.toApp){
			 		dlg.iframe.contentWindow.toApp(dlg);
				}
				return false;
			 }
		} ],
		cancelVal: '关闭',
	    cancel: true ,
	    close:function(){
			if(flag)
				selectList();
		}
	});			
}
function projectView1(pid){	
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/view?id="+pid+"&sourceFrom=SP", {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 980,
		title:"项目查看",
		height : 480,
		lock:true,
		cancelVal: '关闭',
	    cancel: true ,
	    close:function(){
			if(flag)
				selectList();
		}
	});			
}
function toApp(fid){
	$.post(getPath()+"/p2p/investmentProject/toApp",{fid:fid},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips("审批成功！",null,"succeed");
		}else{
			art.dialog.alert("审批失败！错误信息："+data.MSG);
		}
	},"json");
}

function setTab(name,aa){
	$(".hover").removeClass("hover");
	$(aa).addClass("hover");
	if($(aa).attr("id")=='UNPUBLISHED' || $(aa).attr("id")=='FULLSCALE' || $(aa).attr("id")=='FLOWSTANDARD'){
		$list_dataGrid.toggleCol(8,false);
		$list_dataGrid.toggleCol(9,false);
		$list_dataGrid.toggleCol(13,false);
		$list_dataGrid.toggleCol(14,false);
		$list_dataGrid.toggleCol(15,false);
		$list_dataGrid.toggleCol(16,false);
		$list_dataGrid.toggleCol(17,false);
		if($(aa).attr("id")=='FLOWSTANDARD'){
			$list_dataGrid.toggleCol(18,true);
			$list_dataGrid.toggleCol(19,false);
		}else{
			$list_dataGrid.toggleCol(18,false);
			$list_dataGrid.toggleCol(19,true);
		}
		
	}
	
	if($(aa).attr("id")=='RECRUITMENT'){
		$list_dataGrid.toggleCol(8,true);
		$list_dataGrid.toggleCol(9,true);
		$list_dataGrid.toggleCol(13,false);
		$list_dataGrid.toggleCol(14,false);
		$list_dataGrid.toggleCol(15,false);
		$list_dataGrid.toggleCol(16,false);
		$list_dataGrid.toggleCol(17,false);
		$list_dataGrid.toggleCol(18,false);
	}
	if($(aa).attr("id")=='REPAYMENT'){
		$list_dataGrid.toggleCol(13,true);
		$list_dataGrid.toggleCol(14,true);
		$list_dataGrid.toggleCol(15,true);
		$list_dataGrid.toggleCol(16,true);
		$list_dataGrid.toggleCol(8,false);
		$list_dataGrid.toggleCol(9,false);
		$list_dataGrid.toggleCol(17,false);
		$list_dataGrid.toggleCol(18,false);
	}
	if($(aa).attr("id")=='OVER'){
		$list_dataGrid.toggleCol(15,true);
		$list_dataGrid.toggleCol(16,true);
		$list_dataGrid.toggleCol(8,false);
		$list_dataGrid.toggleCol(9,false);
		$list_dataGrid.toggleCol(13,false);
		$list_dataGrid.toggleCol(14,false);
		$list_dataGrid.toggleCol(17,true);
		$list_dataGrid.toggleCol(18,false);
	}
	selectList();
}
/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	$list_dataParam['appstatus'] =$(".hover").attr("id");
	//录入时间
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["effectdate"]){
		startDate = MenuManager.menus["effectdate"].getValue().timeStartValue;
		endDate = MenuManager.menus["effectdate"].getValue().timeEndValue;
	}
	//查询开始时间
	if(startDate != ""){
		$list_dataParam['startDate'] = startDate;
	} else {
		delete $list_dataParam['startDate'];
	}
	//查询结束时间
	if(endDate != ""){
		$list_dataParam['endDate'] = endDate;
	} else {
		delete $list_dataParam['endDate'];
	}
	$list_dataParam['paymentOptions'] =$("#paymentOptions").val();
	if($("#borroweName").val()!='手机号,身份证,姓名'){
		$list_dataParam['borroweName'] =$("#borroweName").val();
	}else{
		delete $list_dataParam['borroweName']
	}
	if($("#title").val()!='标书号,标题'){
		$list_dataParam['title'] =$("#title").val();
	}else{
		delete $list_dataParam['title']
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
	
	if(data.status=='UNPUBLISHED'){
		 returnStr+='<a href="javascript:projectView(\''+data.id+'\');">预览</a> |  <a href="javascript:updateProject(\''+data.id+'\');">修改</a> | <a href="javascript:publishProject(\''+data.id+'\',\'RECRUITMENT\');">发布</a>';
	}
	if(data.status=='RECRUITMENT'){
		returnStr+='<a href="javascript:projectView(\''+data.id+'\');">查看</a> | <a href="javascript:publishProject(\''+data.id+'\',\'UNPUBLISHED\');">取消发布</a> | <a href="javascript:okflow(\''+data.id+'\',\'FLOWSTANDARD\');">确定流标</a>';
	}
	if(data.status=='FULLSCALE'){
		returnStr+='<a href="javascript:projectView(\''+data.id+'\');">查看</a> |<a href="javascript:publishProject(\''+data.id+'\',\'REPAYMENT\');">确定借款</a>';
	}
	if(data.status=='REPAYMENT'){
		returnStr+='<a href="javascript:projectView(\''+data.id+'\');">查看</a>';
	}
	return returnStr;
}

function createtimeRender(data,index,cdata){	
	var d=new Date(data.createTime);
	return  d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}
function publishProject(pid,status){
	$.post(getPath()+"/p2p/investmentProject/publishProject",{id:pid,status:status},function(data){
		if(data.SUCESS){
			art.dialog.tips(data.SUCESS,null,"succeed");
			resetList();
		}else{
			art.dialog.alert(data.FAIL);
		}
	},"json");
}

function updateProject(pid){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/add?id="+pid, {
		id : 'addGardenWindow',
		width : 880,
		title:"新增项目",
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
	art.dialog.confirm("你确定要删除此记录？",function(){
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

