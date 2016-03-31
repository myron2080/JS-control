
/**
 * 内网平台--呼叫中心 外部调用
 */
var CallOut = {
	//弹出呼叫Dialog
	callDlg:{},
	//呼叫对象
	callObject:{},
	//调用话务中心，平台内调用{name:呼叫名字,phone:呼叫电话,objectId:关联对象ID}
	show:function(name,phone,objectId){
		//var openUrl = ctx + "/callCenter.html" ;//话务中心简易版（第一版）
		var openUrl = ctx + "/cmct/phonenew/index" ;//话务中心后期版
		openUrl += "?toName="+escape(name);
		openUrl += "&toPhone="+escape(phone);
		if(objectId!=null && objectId!=''){
			openUrl += "&objectId="+objectId;
		}
		openUrl += "&t="+(new Date()).getTime() ;
		callCenter=$.ligerDialog.open({
			width:425,
			height:240,
			url: openUrl,
			title:"话务中心",
			isResize:true,
			allowClose:false,
			modal:false,
			isDrag:true,
			buttons:[
		        {text:'关闭',onclick: function (item, dialog){ 
		        	if(dialog.jiframe && dialog.jiframe[0].contentWindow && dialog.jiframe[0].contentWindow.MerageCallCenter.winClose){
		        		dialog.jiframe[0].contentWindow.MerageCallCenter.winClose(dialog);
					}
		        }}
			]});
	},
	//调用话务中心，内网平台首页调用
	showInter:function(){
		//var openUrl = getPath()+"/callCenter.html" ;//话务中心简易版（第一版）
		var openUrl = getPath()+"/cmct/phonenew/index" ;//话务中心后期版
		openUrl += "?t="+(new Date()).getTime(); ;
		callCenter=$.ligerDialog.open({
			width:425,
			height:240,
			url: openUrl,
			title:"话务中心",
			isResize:true,
			modal:false,
			allowClose:false,
			isDrag:true,
			buttons:[
		        {text:'关闭',onclick: function (item, dialog){ 
		        	if(dialog.jiframe && dialog.jiframe[0].contentWindow && dialog.jiframe[0].contentWindow.MerageCallCenter.winClose){
		        		dialog.jiframe[0].contentWindow.MerageCallCenter.winClose(dialog);
					}
		        }}
			]});
		
	}
};