var flag;		//标识，用于存放

$(function(){
	initEvents();
});

//选择默认头像的回调函数,名字必须为这个
function chooseImgFun(selectedValue){
	if(selectedValue){
		if(flag == "miniIcon"){
			$("#miniIconImg").attr("src",getPath() + '/images/'+selectedValue);
			$("#miniIconImg").show();
			$("#miniIconImg").prev("span").hide();
			$("#miniIcon").val(selectedValue);
		} else {
			$("#largeIconImg").attr("src",getPath() + '/images/'+selectedValue);
			$("#largeIconImg").show();
			$("#largeIconImg").prev("span").hide();
			$("#largeIcon").val(selectedValue);
		}
	}
}

function initEvents(){
	$("#chooseMiniIconBtn").bind("click",function(){
		flag="miniIcon";
		popDialog("/permission/menu","flag=miniIcon");
	});
	$("#chooseLargeIconBtn").bind("click",function(){
		flag="largeIcon";
		popDialog("/permission/menu","flag=largeIcon");
	});
	
	//清空按钮
	$("#clearLargeIconBtn").bind("click",function(){
		$("#largeIconImg").hide();
		$("#largeIconImg").prev("span").show();
		$("#largeIcon").val("");
	});
	
	$("#clearMiniIconBtn").bind("click",function(){
		$("#miniIconImg").hide();
		$("#miniIconImg").prev("span").show();
		$("#miniIcon").val("");
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
		$('form').submit();
	}
}