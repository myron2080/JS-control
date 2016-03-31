/***
 * added by taking.wang
 * 选择图片的js
 */

$(function(){
	initEvents();
});

function initEvents(){
	$(".list").bind("click",function(){
		$(this).find("input[type='radio']").attr("checked","checked");
	});
	
	$(".list").bind("dblclick",function(){
		saveEdit();
	});
}

//单击确定的时候调用的函数
function saveEdit(){
	var checkedValue = $("input[type='radio']:checked").val();
	if(!checkedValue){
		art.dialog.tips("您没有选择图片！！");
		return;
	}
	art.dialog.data("selectedValue",$("input[type='radio']:checked").val());
	art.dialog.close();
}