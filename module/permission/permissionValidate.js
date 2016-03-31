$(document).ready(function(){
	 $("#number").bind("blur",function(){
		 var _snum=$("#number").val();
		 checkNumber(_snum);
	 });
	 
	//名字输入完之后自动带出简写
	 setSimplePinyinValue($("#name"),$("#simplePinyin"));
	 
	 
	 if($("#dataId").val()!="" && $("#dataId").val()!=null){
		 //$("#number").attr("disabled","disabled");
	 }
	 
});


function checkNumber(_snum){
	var pt = $("#permissionType").val();
	if(pt=='EFFECT') return;
	var _items; 
	if(isNotNull(_snum)){
		 $.post(getPath()+"/permission/permissionItem/validateNumber",{number:_snum},function(data){
			 var eMsg=$("#errorMsg");
			 if(data.count>0){
				$("#number").val("");
				eMsg.html(_snum + " 已被占用");
				eMsg.show();
			 }else{
				 eMsg.html("");
				 eMsg.hide();
			 }
		 	});
		 }
}

function changept(obj){
	if($(obj).val()=='MENU'){
		clearDataPicker('menuPerm');
		$("#pp").hide();
		$("#ppf7").hide();
	}else{
		$("#pp").show();
		$("#ppf7").show();
	}
}