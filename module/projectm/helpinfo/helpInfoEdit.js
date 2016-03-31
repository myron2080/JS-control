$(document).ready(function(){
	changeMenu($("#orgType").val());
	$("#orgType").bind("change",function(){
		changeMenu($(this).val());
	});
	
});

function changeMenu(id){
	$.post(base+"/projectm/helpInfo/getMenuByParent",{id:id},function(res){
		$("[name=menuOption]").remove();
		var menuList = res.menuList;
		if(menuList!="" && menuList!=undefined){
			for(var i=0;i<menuList.length;i++){
				if(menuId==menuList[i].id){
					$("#menuSelect").append("<option name='menuOption' selected='selected' value='"+menuList[i].id+"'>"+menuList[i].name+"</option>"); 
				}else{
					$("#menuSelect").append("<option name='menuOption' value='"+menuList[i].id+"'>"+menuList[i].name+"</option>"); 
				}
			}
		}
	},"json");
}

function saveEdit(){
	submitData();
}

/**
 * 用于验证
 * @returns
 */
function submitData(){
	
	var remarkFlag=true;
//	 var remark=$("textarea[name='description']").val();
//
//	 if(remark.length>500){
//			art.dialog.tips("字符数量不能超过500个!");
//			remarkFlag=false;
//	 }else{
//		 remarkFlag = true;
//	 }
	 $("#menuId").val($("#menuSelect").val());
	 if(remarkFlag){
		 $("form").submit();
	 }
	 
}





