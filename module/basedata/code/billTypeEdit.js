var flag;		//标识，用于存放
$(document).ready(function() {
	initEvents(); 
});

function saveAdd(dlg) {
    saveEdit(dlg);
}
function saveEdit(dlg){
	$("form").submit();
	dlg.button({
        name : "确定", disabled : true
    },{
        name : "取消", disabled : true
    });
	return false;
}
//选择默认头像的回调函数,名字必须为这个
function chooseImgFun(selectedValue){
	if(selectedValue){
		if(flag == "defalutIcon"){
			$("#defalutIconImg").attr("src",getPath() + '/images/'+selectedValue);
			$("#defalutIconImg").show();
			$("#defalutIconImg").prev("span").hide();
			$("#defalutIcon").val(selectedValue);
		} else if(flag == "disabledIcon") {
			$("#disabledIconImg").attr("src",getPath() + '/images/'+selectedValue);
			$("#disabledIconImg").show();
			$("#disabledIconImg").prev("span").hide();
			$("#disabledIcon").val(selectedValue);
		}else{
			$("#checkedIconImg").attr("src",getPath() + '/images/'+selectedValue);
			$("#checkedIconImg").show();
			$("#checkedIconImg").prev("span").hide();
			$("#checkedIcon").val(selectedValue);
		}
	}
}

function initEvents(){
	$("#chooseDefalutIconBtn").bind("click",function(){
		flag="defalutIcon";
		popDialog("/basedata/billType","flag=defalutIcon");
	});
	
	$("#chooseCheckedIconBtn").bind("click",function(){
		flag="checkedIcon";
		popDialog("/basedata/billType","flag=checkedIcon");
	});
	
	$("#chooseDisabledIconBtn").bind("click",function(){
		flag="disabledIcon";
		popDialog("/basedata/billType","flag=disabledIcon");
	});
	
	//清空按钮
	$("#clearDefalutIconBtn").bind("click",function(){
		$("#defalutIconImg").hide();
		$("#defalutIconImg").prev("span").show();
		$("#defalutIcon").val("");
	});
	$("#clearCheckedIconBtn").bind("click",function(){
		$("#checkedIconImg").hide();
		$("#checkedIconImg").prev("span").show();
		$("#checkedIcon").val("");
	});
	$("#clearDisabledIconBtn").bind("click",function(){
		$("#disabledIconImg").hide();
		$("#disabledIconImg").prev("span").show();
		$("#disabledIcon").val("");
	});
	
}