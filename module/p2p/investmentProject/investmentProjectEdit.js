/**
 * 新增
 * */
$(document).ready(function(){
	art.dialog.data("addProject",addProject);
});
function addProject(dlg){
	if(!checkValidate()){
		return;
	}else{
		$('form').attr('action',getPath()+"/p2p/investmentProject/save");
		saveAdd(dlg);
	}
}

function editRePay(dlg){
	$('form').attr('action',getPath()+"/p2p/repaymentDetail/save");
	saveAdd(dlg);
	
}

function checkValidate(){
	var amount = $("input[name='amount']").val();
	var minAmount = $("input[name='minAmount']").val();
	
	if(amount <= 0){
		art.dialog.tips("借款金额必须大于0.");
		$("input[name='amount']").select();
		return false;
	}
	
	if(minAmount <= 0){
		art.dialog.tips("最小投资金额必须大于0.");
		$("input[name='minAmount']").select();
		return false;
	}
	
	if(amount % minAmount != 0){
		art.dialog.tips("最小投资金额必须是借款金额的倍数.");
		$("input[name='minAmount']").select();
		return false;
	}
	
	if($("input[name='deadline']").val() <= 0){
		art.dialog.tips("借款期限必须大于0.");
		$("input[name='deadline']").select();
		return false;
	}
	
	if($("input[name='rate']").val() <= 0){
		art.dialog.tips("年利率必须大于0.");
		$("input[name='rate']").select();
		return false;
	}
	
	return true;
}
function getGuarantee() {
	var term=$("#guarantee").val();
	$.post(getPath()+"/p2p/investmentProject/getGuaranteeInfo",{term:term,type:'DBGS'},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#guarantee");
			var cityOffset = $("#guarantee").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
			$("body").bind("mousedown", onBodyDown);
		}
	},"json");
}
function getBorroweInfo() {
	var term=$("#borroweName").val();
	$.post(getPath()+"/p2p/investmentProject/getGuaranteeInfo",{term:term,type:'JKR'},function(data){
		if(data){
			var result=data.treeData;
			var zNodes =eval(result);
			$.fn.zTree.init($("#treeDemo"), setting, zNodes);
			var cityObj = $("#borroweName");
			var cityOffset = $("#borroweName").offset();
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
	if (!(event.target.id == "menuBtn" || event.target.id == "guarantee" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
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
	var tp="";
	for (var i=0, l=nodes.length; i<l; i++) {
		v += nodes[i].name + ",";
		id += nodes[i].id + ",";
		tp +=nodes[i].tsta+",";
	}
	if (v.length > 0 ) v = v.substring(0, v.length-1);
	if (id.length > 0 ) id = id.substring(0, id.length-1);
	if (tp.length > 0 ) tp = tp.substring(0, tp.length-1);
	if(tp=='DBGS'){
		var gardenObj = $("#guarantee");
		gardenObj.attr("value", v);
		var gardenId = $("#guaranteeId");
		gardenId.attr("value",id);
	}else{
		var c = $("#borroweName");
		c.attr("value",v);
		var d=$("#borroweId");
		d.attr("value",id);
		hideMenu();
	}
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