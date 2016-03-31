/**
 * added by taking.wang 
 * 用于弹出选择图片框的js
 */

function popDialog(moduleUrl,param){
	art.dialog.data("selectedValue",null);
	var dlg = art.dialog.open(getPath()+moduleUrl+"/chooseImage"+(param ? "?"+param : ""),{
		title:'图片选择',
		lock:true,
		width:'800px',
		height:'480px',
		id:"personPermission",
		button:[{name:'确定',callback:function(){
			if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
				dlg.iframe.contentWindow.saveEdit();
			}
			return false;
		}},{name:'取消',callback:function(){
			flag = false;
			return true;
		}}],
	 close:function(){
		 var selectedValue = art.dialog.data("selectedValue");
		 if(selectedValue){
			 window["chooseImgFun"].call(null,selectedValue); 
		 }
	 }
	});
}