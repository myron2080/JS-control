$(document).ready(function(){
	
	initEvent();
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '最后访问时间', name: 'vtime', align: 'left', width: 120},
            {display: '昵称', name: 'nickName', align: 'left', width: 80},
            {display: 'QQ号码', name: 'qq', align: 'left', width: 120},
            {display: '访客痕迹', name: 'visitLink', align: 'center', width: 60,render:visitLinkRender},
            {display: '来源地区 ', name: 'adress', align: 'left', width: 150},
            {display: '状态 ', name: 'status.name', align: 'center', width: 80},
            {display: '归属人 ', name: 'owner.name', align: 'center', width: 80},
            {display: '归属时间 ', name: 'ownerTime', align: 'center', width: 120},
            {display: '手机号 ', name: 'phone', align: 'center', width: 100},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        width:($(document).width()-10 )+"px",
	    height:($(document).height()-80 )+"px",
        url: getPath() + "/ebhouse/visitor/listData",
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
	
	eventFun("#iptQQ");
	inputEnterSearch("iptQQ",searchData);
	
	$("#tab_status > li").click(function(){
		$("#tab_status > li").removeClass("hover");
		$(this).addClass("hover");
		var keyStatus = $(this).attr("key");
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
	
	var qq = $("#iptQQ").val();
	if(qq!="" && qq!=null && qq!=$("#iptQQ").attr("defaultValue")){
		$list_dataParam['qq'] = qq;
	}else{
		delete $list_dataParam['qq'];
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
	$("#iptQQ").val($("#iptQQ").attr("defaultValue"));
	MenuManager.menus["vtime"].resetAll();
}

/**
 * 操作
 * @param data
 */
function operateRender(data){
	var status = data.status ;
	var owner = data.owner ;
	var opHtml = '' ;
	if(status.value == 'UN_ALLOT' && (owner == null || owner.id == null )){
		opHtml += "<a href='javascript:void(0);' onclick=contactQQ('"+data.qq+"')>联系</a>" ;
	}else if(status.value == 'UN_ALLOT' && owner != null && owner.id != null){
		opHtml += "<a href='javascript:void(0);' onclick=editQQ('"+data.qq+"')>修改</a>" ;
		opHtml += "   |   " ;
		opHtml += "<a href='javascript:void(0);' onclick=allotVisitor('"+data.phone+"')>分配</a>" ;
	}
	return opHtml ;
}

/**
 * 受访痕迹
 * @param data
 * @returns {String}
 */
function visitLinkRender(data){
	return '<a onclick="visitorTrace({qq:\''+data.qq+'\'});" href="javascript:javascript:void(0);">查看</a>';
}

/**
 * 访客痕迹
 * @param data
 */
function visitorTrace(data){
	var dlg = art.dialog.open(getPath()+'/ebhouse/visitor/trace?qq='+data.qq,{
		 title:data.qq+"-访客痕迹",
		 lock:true,
		 width:'850px',
		 height:'400px',
		 id:data.qq+"DataDialog",
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
	var dlg = art.dialog.open(getPath()+'/ebhouse/visitor/importData',{
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
	});
}

/**
 * 联系QQ
 * @param qq
 */
function contactQQ(qq){
	if(qq == null || qq == ''){
		art.dialog.tips('未获取到号码');
		return ;
	}
	$.post(getPath()+"/ebhouse/visitor/contactQQ",{qq:qq},function(res){
		if(res.STATE == 'SUCC'){
			
		}else{
			art.dialog.tips(res.MSG);
		}
		refresh();
	},'json');
}

/**
 * 修改QQ
 * @param qq
 */
function editQQ(qq){
	art.dialog.data("reloadSearch",searchData);
	var reqUrl = getPath()+"/ebhouse/visitor/editQQ?qq="+qq ;
	var editQQDlg = art.dialog.open(reqUrl,{
		title:"QQ号码-"+qq,
		lock:true,
		width:"500px",
		height:"180px",
		id:"editQQDlg",
		ok:function(){
			if(editQQDlg.iframe.contentWindow && editQQDlg.iframe.contentWindow.saveEditQQ){
				editQQDlg.iframe.contentWindow.saveEditQQ();
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
 * 分配访客
 * @param qq
 */
function allotVisitor(phone){
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