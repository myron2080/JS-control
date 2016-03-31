var flag;		//标识，用于存放

$(function(){
	initEvents();
});

//选择默认头像的回调函数,名字必须为这个
function chooseImgFun(selectedValue){
	if(selectedValue){
		 
		$("#largeIconImg").attr("src",getPath() + '/images/'+selectedValue);
		$("#largeIconImg").show();
		$("#largeIconImg").prev("span").hide();
		$("#largeIcon").val(selectedValue);
		
	}
}

function initEvents(){
	 
	$("#chooseLargeIconBtn").bind("click",function(){
		flag="largeIcon";
		var mtype = $("#menuType").val();
		if(mtype=='PC'){
			flag="largeIcon";
		}else if(mtype=='MOBILE'){
			flag="mobileIcon";
		}
		popDialog("/permission/menu","flag="+flag);
	});
	
	//清空按钮
	$("#clearLargeIconBtn").bind("click",function(){
		$("#largeIconImg").hide();
		$("#largeIconImg").prev("span").show();
		$("#largeIcon").val("");
	});
	 
}

function beforesave(){
	var remark=$('#description').val();
	if(remark.length>500){
		art.dialog.tips("字符数量不能超过500个!");
		return false ;
	}
	return true ;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$("#module").val($("input[name='parent.id']").val());
		$('form').submit();
	}
}