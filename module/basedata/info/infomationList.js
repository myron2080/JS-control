$(function(){
	updateInfoStatus();//弹窗后 修改状态为  已提醒
});

function operateRender(data, filterData) {
	var str = '';
	if (data.moduleType == "BROKER_CUSTOMER") {
		str = '<a href="javascript:showCsm({id:\'' + data.moduleId
				+ '\'});">查看</a>|' + '<a href="javascript:updateStatus({id:\''
				+ data.id + '\'});">已查阅</a>';
	}
	return str;
}

/**
 * 更新状态
 * @param rowdata
 */
function updateStatus(rowdata,obj){
	$.post(getPath()+"/basedata/info/updateStatus",{id:rowdata.id,status:'YES_CHECK'},function(res){
		if (res.STATE == 'SUCCESS') {
			art.dialog({
				icon : 'succeed',
				time : 1.5,
				content : res.MSG
			});
			$("#"+obj).remove();
		} else {
			art.dialog.tips(res.MSG);
		}
	},'json');
}

/**
 * 修改消息的状态
 */
function updateInfoStatus() {
	 
	$.post(getPath()+"/basedata/info/updateNoWarnInfoStatus",{},function(res){
		 
	},'json');
}


/**
 * 显示客户信息
 */
//function showCsm(rowdata) {
//	var dlg = art.dialog.open(base + "/broker/customerManager/manager?id="+ rowdata.id + "&nextpage=false", {
//		id : 'add',
//		title : '客户信息',
//		background : '#333',
//		width : 820,
//		height : 495,
//		lock : true,
//		cancelVal : '关闭',
//		cancel : true
//	});
//}



function showCsm(rowdata) {
	/*var newUrl =base + "/broker/customerManager/manager?id="+ rowdata.id + "&nextpage=false";
	var newWindow = window.open(newUrl,'_blank','toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
	newWindow.moveTo(-3,-3);
	newWindow.resizeTo(820,495);
	newWindow.focus();*/
	parent.$.ligerDialog.open({ url: (getPath() + "/broker/customerManager/manager?id="+ rowdata.id + "&nextpage=false") ,title:"客户信息",width:820,height:495 });
}


function openCusWin(id,type){
	if("BROKER_CUSTOMER"==type){
		/*var newUrl =base + "/broker/customerManager/manager?id="+ id + "&nextpage=false";
		var newWindow = window.open(newUrl,'_blank','toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
		newWindow.moveTo(-3,-3);
		newWindow.resizeTo(820,495);
		newWindow.focus();*/ 
		parent.$.ligerDialog.open({ url: (getPath() + "/broker/customerManager/manager?id="+ id + "&nextpage=false") ,title:"客户信息",width:820,height:560});
	}
}