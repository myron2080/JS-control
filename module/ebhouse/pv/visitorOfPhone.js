$(document).ready(function(){
	
	initEvent();
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '最后访问时间', name: 'vtime', align: 'left', width: 120},
            {display: '昵称', name: 'nickName', align: 'left', width: 80},
            {display: '手机号码', name: 'phone', align: 'left', width: 120},
            {display: '访客痕迹', name: 'visitLink', align: 'center', width: 60,render:visitLinkRender},
            {display: '来源地区 ', name: 'adress', align: 'left', width: 150},
            {display: '状态 ', name: 'status.name', align: 'center', width: 80},
            {display: '归属人 ', name: 'owner.name', align: 'center', width: 80},
            {display: '归属时间 ', name: 'ownerTime', align: 'center', width: 120},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        checkbox:true,
        width:($(document).width()-10 )+"px",
	    height:($(document).height()-80 )+"px",
        url: getPath() + "/ebhouse/visitorOfPhone/listData",
        delayLoad:true,
        enabledSort:false,
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	
	    }
    }));
	
	searchData();
});

/**
 * 初始注册事件
 */
function initEvent(){
	
	var params ={};
	params.inputTitle = "访问时间";	
	MenuManager.common.create("DateRangeMenu","vtime",params);
	
	eventFun("#iptPhone");
	inputEnterSearch("iptPhone",searchData);
	
	$("#tab_status > li").click(function(){
		$("#tab_status > li").removeClass("hover");
		$(this).addClass("hover");
		var keyStatus = $(this).attr("key");
		if(keyStatus!='UN_ALLOT'){
			$('#btnBatch').hide();
		}else{
			$('#btnBatch').show();
		}
		$("#status").val(keyStatus);
		searchData();
	});
}

/**
 * 查询
 */
function searchData(){
	
	//访问时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["vtime"]){
		queryStartDate = MenuManager.menus["vtime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["vtime"].getValue().timeEndValue;
	}
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	
	var phone = $("#iptPhone").val();
	if(phone!="" && phone!=null && phone!=$("#iptPhone").attr("defaultValue")){
		$list_dataParam['phone'] = phone;
	}else{
		delete $list_dataParam['phone'];
	}
	
	var status = $("#status").val();
	if(status!=null && status!="" ){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	
	resetList();
}

/**
 * 清空
 */
function cleanSearch(){
	$("#iptPhone").val($("#iptPhone").attr("defaultValue"));
	MenuManager.menus["vtime"].resetAll();
}

/**
 * 操作
 * @param data
 */
function operateRender(data){
	var status = data.status ;
	var opHtml = '' ;
	if(status.value == 'UN_ALLOT'){
		opHtml += "<a href='javascript:void(0);' onclick=allotPhone('"+data.phone+"')>分配</a>" ;//更新改号码的所有记录
	}
	/*else{
		opHtml += "<a href='javascript:void(0);' onclick=editPhone('"+data.phone+"')>修改</a>" ;//修改该号码的所有记录
	}*/
	return opHtml ;
}

/**
 * 受访痕迹
 * @param data
 * @returns {String}
 */
function visitLinkRender(data){
	return '<a onclick="showHistory({phone:\''+data.phone+'\'});" href="javascript:javascript:void(0);">查看</a>';
}

function showHistory(data){
	/*alert(data.phone);*/
	//打开窗口查询历史记录
	var dlg = art.dialog.open(getPath()+'/ebhouse/visitorOfPhone/showHistory?phone='+data.phone,{
		 title:data.phone+"-历史访问数据",
		 lock:true,
		 width:'850px',
		 height:'400px',
		 id:data.phone+"DataDialog",
		 button:[{name:'关闭',callback:function(){
				flag = false;
				return true;
			}}]
	});
}

/**
 * 导入数据
 */
function importData(){
	art.dialog.data("searchData",searchData);
	art.dialog.data("loadClose",Loading.close);
	var flag = true;
	var dlg = art.dialog.open(getPath()+'/ebhouse/visitorOfPhone/importData',{
		 title:"导入数据",
		 lock:true,
		 width:'380px',
		 height:'120px',
		 id:"importDataDialog",
		 ok:function(){
			 Loading.init();
			 if(dlg.iframe.contentWindow){
				 art.dialog.data("saveImportData")();
			 }
			 return false ;
		 },
		 okVal:'确定'
		 /*button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveImportData){
					dlg.iframe.contentWindow.saveImportData(this);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 if(typeof(afterAddRow)=='function'){
					 afterAddRow();
				 }
				 resetList();
			 }
		 }*/
	});
}


/**
 * 分配Phone
 * @param qq
 */
function allotPhone(phone){
	if(phone == null || phone == ''){
		art.dialog.tips('分配之前手机号不能为空');
		return ;
	}
	art.dialog.data("reloadSearch",searchData);
	var reqUrl = getPath()+"/ebhouse/visitor/allot?phone="+phone ;
	var allotVisitorDlg = art.dialog.open(reqUrl,{
		title:"分配访客-"+phone,
		lock:true,
		width:"520px",
		height:"200px",
		id:"allotVisitorDlg",
		ok:function(){
			if(allotVisitorDlg.iframe.contentWindow && allotVisitorDlg.iframe.contentWindow.saveAllot){
				allotVisitorDlg.iframe.contentWindow.saveAllot();
			}
			return false ;
		},
		okVal:'确定',
		cancel:function(){
			return true ;
		},
		cancelVal:'取消'
	});
}

/**
 * 修改
 * @param phone
 */
function editPhone(phone){
	art.dialog.tips('马上开放');
}
/**
 * 批量分配
 */
function batchAllot(){
	//得到选中的行，批量执行
	var rows = $list_dataGrid.getSelectedRows();
	if(rows.length==0){
		art.dialog.tips('请选择记录');
		return ;
	}
	var allPhone=[];
	var rowCheck={isCheck:false,index:0};
	for(var i=0;i<rows.length;i++){
		if(rows[i].phone == null || rows[i].phone == ''){
			rowCheck['isCheck']=true;
			rowCheck['index']=i+1;
			break;
		}
		allPhone.push(rows[i].phone);
	}
	if(rowCheck.isCheck){
		art.dialog.tips('第'+rowCheck.index+'行分配之前手机号不能为空');
		return ;
	}
	var allPhoneStr=allPhone.join(',');
	/*alert(allPhoneStr);*/
	var reqUrl = getPath()+"/ebhouse/visitorOfPhone/allotBatch?allPhone="+allPhoneStr;
	art.dialog.data("reloadSearch",searchData);
	var allotVisitorDlg = art.dialog.open(reqUrl,{
		title:"批量分配访客",
		lock:true,
		width:"520px",
		height:"200px",
		id:"allotVisitorDlg",
		ok:function(){
			if(allotVisitorDlg.iframe.contentWindow && allotVisitorDlg.iframe.contentWindow.saveBatchAllot){
				allotVisitorDlg.iframe.contentWindow.saveBatchAllot();
			}
			return false ;
		},
		okVal:'确定',
		cancel:function(){
			return true ;
		},
		cancelVal:'取消'
	});
}