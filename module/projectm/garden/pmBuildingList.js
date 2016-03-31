/**
 * 楼栋
 */

$(document).ready(function(){
	art.dialog.data("roomBatchSave",roomBatchSave);
  $("#addBtn").bind("click",function(){
	  art.dialog({
			lock: true,
			id:"buildingTemplate",
			title:"新增",
 			content: $("#buildingTemplate").get(0),
 			width:680,
 			height:154,
 			ok: function(){
 				addBuilding();
 				return false;
 			}
	  });
  });
  $("#batchBtn").bind("click",function(){
	  art.dialog({
			lock: true,
			id:"buildingTemplate",
			title:"批量新增",
			content: $("#batchView").get(0),
			width:720,
			height:154,
			ok: function(){
				batchAddBuilding();
				return false;
			}
	  });
  });
  
  $(".unitName").each(function(){
	  if($(this).val()==null || $(this).val()==""){
		  $(this).closest("#set_up").find(".buildingV").attr("checked","checked");
	  }
  });
  $(".buildingV").bind("change",function(){
	  if($(this).attr("checked")=="checked"){
		  if($(this).closest("#set_up").find("#buildingId").length>0){
			  art.dialog.alert("楼栋下有多个单元，请删除后操作！");
			  $(this).attr("checked","");
		  }
	  }
  });
});

function addBuilding(){
	
	if($("#buildingAdd #registerName").val()==''){
		$("#buildingAdd #registerName").focus();
		art.dialog.tips("登记名不能为空！");
		return;
	}
	if($("#buildingAdd #name").val()==''){
		$("#buildingAdd #name").focus();
		art.dialog.tips("推广名不能为空！");
		return;
	}
	if($("#buildingAdd #propertyFee").val()!=''){
		if(isNaN($("#buildingAdd #propertyFee").val())){
			art.dialog.tips("物业费只能是数字！");
			return;
		}
	}
	if($("#buildingAdd #airConditionFee").val()!=''){
		if(isNaN($("#buildingAdd #airConditionFee").val())){
			art.dialog.tips("空调费物只能是数字！");
			return;
		}
	}
	$("#buildingAdd").attr("action",getPath()+"/broker/building/addBuilding");
	$("#buildingAdd").ajaxSubmit(function(res) {
			art.dialog.alert("新增成功！");
			window.location.href=getPath()+'/broker/building/getList?gardenId='+gardenId;
			return false;
	});
}
function batchAddBuilding(){
	if($("#buildCount").val()==''){
		art.dialog.tips("楼栋数量不能为空！");
		$("#buildCount").focus();
		return;
	}
	if($("#unitCount").val()==''){
		art.dialog.tips("单元数量不能为空！");
		$("#unitCount").focus();
		return;
	}
	$("#batchForm").attr("action",getPath()+"/broker/building/batchAddBuilding");
	$("#batchForm").ajaxSubmit(function(res) {
			art.dialog.alert("新增成功！");
			window.location.href=getPath()+'/broker/building/getList?gardenId='+gardenId;
			return false;
	});
}

function deleteBuilding(obj){
	  var buildingIds="";
	  $(obj).closest("#set_up").find(".buildingId").each(function(){
		  if($(this).val()==""){
			  $(this).closest("tr").remove();
		  }
		  buildingIds+=$(this).val()+",";
	  });
	  art.dialog.confirm("你确定要删除该楼栋？",function(){
		  deletePost(buildingIds);
	  });
}
function deleteUnit(obj){
	  var buildingIds="";
	  buildingIds = $(obj).closest("tr").find(".buildingId").val();
	  if(buildingIds==""){
		  $(obj).closest("tr").remove();
	  }else{
		  art.dialog.confirm("你确定要删除该单元？",function(){
			  deletePost(buildingIds);
		  });
	  }
}

function deletePost(buildingIds){
	$.post(getPath()+"/broker/building/deleteBuilding",{buildingIds:buildingIds},function(res){
		if(res!=null){
			if(res.STATE=="1"){
				art.dialog.alert(res.MSG);
				window.location.href=getPath()+'/broker/building/getList?gardenId='+gardenId;
			}else{
				art.dialog.alert(res.MSG);
			}
		}
	});
}
/**
 * ×××××××××××××××××××××××××××××××××××××××
 * 添加单元
 * ××××××××××××××××××××××××××××××××××××××
 * */
function addUnit(obj){
	if($(obj).closest("#set_up").find(".buildingV").attr("checked")=="checked"){
		art.dialog.alert("楼型为单栋！去除‘无单元’勾选才能添加单元！");
		return;
	}
	var tr = $("#buildingTemplate").find("#unitTemplate").clone();
	tr.find(".addU").css("display","block");
	var table = $(obj).closest("#set_up").find("#buildingTem");
	table.append(tr);
}
function copyUnit(obj){
	if($(obj).closest("#set_up").find(".buildingV").attr("checked")=="checked"){
		art.dialog.alert("楼型为单栋！去除‘无单元’勾选才能复制单元！");
		return;
	}
	var tr = $(obj).closest("tr").clone();
	var table = $(obj).closest("#set_up").find("#buildingTem");
	tr.find(".buildingId").val("");
	table.append(tr);
}
function roomBatchSave(){	
	var c = 0;
	$("form").each(function(){
		if($(this).is(":visible")) 
		{ 	
			var a=this;
			var registerName=$(this).closest('#set_up').find("#registerName").val();
			var name=$(this).closest('#set_up').find("#name").val();
			var completeDate=$(this).closest('#set_up').find("#completeDate").val();
			//修改action
			$(this).append("<input type='hidden' name='registerName' value='"+registerName+"'/>");
			$(this).append("<input type='hidden' name='name' value='"+name+"'/>");
			$(this).append("<input type='hidden' name='completeDate' value='"+completeDate+"'/>");
			$(this).attr("action",getPath()+"/broker/building/batchUpdate?gardenId="+gardenId);
			$(this).ajaxSubmit(function(message) {
				c++;
				if($("form:visible").length==c){
					art.dialog.data("result","success");
					art.dialog.close();
				}
	  		 });
		} 
	});
}
/**
 * 隐藏单元
 * */
function hiddenUnit(obj){
	$(obj).closest("#set_up").find(".unit").css("display","none");
	
	if($(obj).hasClass(".show")){
		$(obj).removeClass(".show");
		$(obj).addClass(".hidden");
		$(obj).text("隐藏单元");
		$(obj).closest("#set_up").find(".unit").css("display","");
		
	}else{
		$(obj).removeClass(".hidden");
		$(obj).addClass(".show");
		$(obj).text("显示单元");
		$(obj).closest("#set_up").find(".unit").css("display","none");
	}
}
function showUnit(obj){
	$(obj).closest("#set_up").find(".unit").css("display","block");
	//$(obj).css("display","none");
	$(obj).closest("#set_up").find(".hiddenUnit").css("display","");
}
function clearNoNum(obj)
{
	//先把非数字的都替换掉，除了数字和.
	obj.value = obj.value.replace(/[^\d.]/g,"");
	//必须保证第一个为数字而不是.
	obj.value = obj.value.replace(/^\./g,"");
	//保证只有出现一个.而没有多个.
	obj.value = obj.value.replace(/\.{2,}/g,".");
	//保证.只出现一次，而不能出现两次以上
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
}
