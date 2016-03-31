/**
 * 新增
 * */
$(document).ready(function(){
	getProjectFastType();
	art.dialog.data("addProject",addProject);
	$("#projectId").bind("change",function(){
		getProjectFastType();
	});
	
	$("#imageInfoList li").each(function(){
		$(this).hide();
	});
	$("[name=SITTINGROOM]").each(function(){
		$(this).show();
	});
	
	$(".system_tab_title .system_tab ul li").click(function(){	
		$(this).addClass("hover").siblings("li").removeClass("hover");
		window.top.projectIdStr="";
		var imgType=$(this).attr("id");
		$("#imgType").val(imgType);
		uploadArr[0].addPostParam("imgType",imgType);
		$("#imageInfoList li").each(function(){
			$(this).hide();
		});
		$("[name="+imgType+"]").each(function(){
			$(this).show();
		});
	});
	
	
});
function addProject(dlg){
	var content=$.trim(contentEditor.getContentTxt());
	$("#remarkText").val(content);
	$('form').attr('action',getPath()+"/ebhouse/decorating/save");
	saveAdd(dlg);
}

function editRePay(dlg){
	$('form').attr('action',getPath()+"/p2p/repaymentDetail/save");
	saveAdd(dlg);
	
}
function getProjectFastType() {
	var projectId=$("#projectId").val();
	$.post(getPath()+"/ebhouse/decorating/getProjectFastType",{projectId:projectId},function(data){
		if(data.MSG){
			art.dialog.tips(data.MSG);
		}else{
//			var fasthousetypeid = $("").val();
			$("#fasthousetype").find("option").remove();
			$("#fasthousetype").append("<option value=''>--请选择--</option>");
			$(data.items).each(function(inx){
				if(fasthousetypeid==""){
					if(inx==0){
						$("#fasthousetype").append("<option selected='selected' value='"+this.id+"'>"+this.name+"</option>");
					}else{
						$("#fasthousetype").append("<option value='"+this.id+"'>"+this.name+"</option>");
					}
				}else{
					if(this.id==fasthousetypeid){
						$("#fasthousetype").append("<option selected='selected' value='"+this.id+"'>"+this.name+"</option>");
					}else{
						$("#fasthousetype").append("<option value='"+this.id+"'>"+this.name+"</option>");
					}
				}
			});
			
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