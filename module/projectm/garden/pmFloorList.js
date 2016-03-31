/**
 * 
 */
$(document).ready(function(){
	$("#addFloor").click(function(){
		addFloor();
	});
	$("#batchAddFloor").click(function(){
		batchAddFloor();
	});
	$("#deleteFloors").click(function(){
		deleteFloors();
	});
});

function addFloor (){
	art.dialog({
		title:"添加楼层",
			content: $("#addView").get(0),
			width:300,
			height:100,
			id: 'EF893L',
			ok: function () {
				var floorName = $("#addView").find("#floorName").val();
   				var floorHeight = $("#addView").find("#floorHigh").val();
   				var data={
   						name:floorName,
   						floorHigh:floorHeight,
   						gardenId:gardenId,
   						buildingId:buildingId
   						};
   				
   				$.post(getPath()+"/broker/floor/addFloor",data,function(res){
   					art.dialog.alert("新增成功");
   					window.location.href=getPath()+'/broker/floor/getList?buildingId='+buildingId+'&gardenId='+gardenId;
   				},"json");
			},
			cancelVal: '关闭',
   		    cancel: true 
	});
}

function batchAddFloor(){
	art.dialog({
		title:"添加楼层",
			content: $("#batchAddFloorView").get(0),
			width:300,
			height:100,
			id: 'EF893L',
			ok: function () {
				batchAddFloorSave();
			},
			cancelVal: '关闭',
   		    cancel: true 
	});
} 
function batchAddFloorSave(){
	$("#batchAdd").ajaxSubmit(function(data) {
		if(data){
			if(data.ret=="1"){
				art.dialog.alert(data.msg);
				window.location.href=getPath()+'/broker/floor/getList?buildingId='+buildingId+'&gardenId='+gardenId;
			}else{
				art.dialog.alert(data.msg);
			}
		}
	});
}

function deleteFloors(){
	//得到选中的楼层
	var floorIds="";
	$(".floorId:checked").each(function(){
		floorIds+=$(this).val()+",";
	});
	if(floorIds==""){
		art.dialog.alert("你没有选中任何房间！");
		return;
	}
	art.dialog.confirm("是否确定删除选中楼层?",function(){
		$.post(getPath()+"/broker/floor/deleteFloor",{floorIds:floorIds},function(res){
			if(res!=null){
				if(res.STATE=="1"){
					art.dialog.alert(res.MSG);
					window.location.href=getPath()+'/broker/floor/getList?buildingId='+buildingId+'&gardenId='+gardenId;
				}else{
					art.dialog.alert(res.MSG);
				}
			}
		});
	});
}