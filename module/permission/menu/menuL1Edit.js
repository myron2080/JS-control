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
		} 
	}
}

function initEvents(){
	$("#chooseMiniIconBtn").bind("click",function(){
		flag="miniIcon";
		popDialog("/projectm/menu","flag=miniIcon");
	});
	 
	
	//清空按钮
	$("#clearMiniIconBtn").bind("click",function(){
		$("#miniIconImg").hide();
		$("#miniIconImg").prev("span").show();
		$("#miniIcon").val("");
	});
}

function beforesave(){
	 
	return true ;
}

//保存编辑数据
function saveEdit(dlg){
	//增加前置函数,用于保存时逻辑检测和赋值
	if(beforesave()){
		$('form').submit();
	}
}