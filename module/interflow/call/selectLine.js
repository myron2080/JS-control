
$(document).ready(function(){
	init();
});
$list_dataType = "线路";//数据名称

function init(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '注册号码', name: 'loginNumber', align: 'left', width: 80},
            {display: '固定号码', name: 'showPhone', align: 'left', width: 120},
            {display: '别名', name: 'alias', align: 'left', width: 120},
            {display: '权限', name: 'setType.name', align: 'left', width: 80},
            {display: '专用人', name: 'onlyUser.name', align: 'left', width: 100},
            {display: '当前使用人 ', name: 'currentUser.name', align: 'left', width: 100},
            {display: '操作', name: 'operate', align: 'left', width: 60,render:operateRender}
        ],
        width:($(document).width()-10 )+"px",
	    height:($(document).height()-50 )+"px",
        url: getPath() + "/interflow/callNew/selectLineData",
        delayLoad:true,
        enabledSort:false,
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	var currUser = rowData.currentUser ;
        	if(currUser == null || currUser.id == null){
        		var onlyUser = rowData.onlyUser ;//专用人
        		if(rowData.setType.value == 'SHAR' || (onlyUser!=null && onlyUser.id == $("#personId").val())){
        			//分享类型或者专用人为自己的可以使用
        			saveSelect(rowData.id,rowData.userId,rowData.password,rowData.orgInterfaceId,
        	    			rowData.loginNumber,rowData.alias,rowData.showPhone,rowData.defaultShowPhone,rowData.setType.value);
        		}
        	}
	    }
    }));
	//查询
	searchData();
}

/**
 * 查询
 */
function searchData(){
	//权限类型
	var setType = $("#setTypeSel").val();
	if(setType!="" && setType!=null){
		$list_dataParam['setType'] = setType;
	}else{
		delete $list_dataParam['setType'];
	}
	//固定号码
	var showPhone = $("#showPhone").val();
	if(showPhone!="" && showPhone!=null && showPhone!=$("#showPhone").attr("dValue")){
		$list_dataParam['showPhone'] = showPhone;
	}else{
		delete $list_dataParam['showPhone'];
	}
	//别名
	var alias = $("#alias").val();
	if(alias!="" && alias!=null && alias!=$("#alias").attr("dValue")){
		$list_dataParam['alias'] = alias;
	}else{
		delete $list_dataParam['alias'];
	}
	//组织
	var orgId = $("#orgId").val();
	if(orgId!=null && orgId!=""){
		$list_dataParam['orgId'] = orgId;
	}else{
		delete $list_dataParam['orgId'];
	}
	resetList();
}
/**
 * 清空
 */
function clearAll(){
	$("#showPhone").val($("#showPhone").attr("dValue"));
	$("#alias").val($("#alias").attr("dValue"));
	$("#setTypeSel").val('');
	$("#orgId").val("");
	$("#orgName").val("组织");
}
/**
 * 操作
 * @param data
 * @returns {String}
 */
function operateRender(data,filterData){
	var currUser = data.currentUser ;
	if(currUser == null || currUser.id == null){
		var onlyUser = data.onlyUser ;//专用人
		if(data.setType.value == 'SHAR' || (onlyUser!=null && onlyUser.id == $("#personId").val())){
			//分享类型或者专用人为自己的可以使用
			return "<a onclick=saveSelect('"+data.id+"','"+data.userId+"','"+data.password+"','"+
			data.orgInterfaceId+"','"+data.loginNumber+"','"+data.alias+"','"+data.showPhone+"','"+data.defaultShowPhone+
			"','"+data.setType.value+"'); href='javascript:void(0);'>使用</a>" ;
		}
	}
	return "" ;
}

/**
 * 选择一个线路使用
 * @param lineId
 * @param userId
 * @param password
 * @param orgId
 * @param loginNumber
 * @param alias
 * @param showPhone
 * @param defaultShowPhone
 * @param setType
 */
function saveSelect(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType){
	opener.selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType);
	window.close();
}