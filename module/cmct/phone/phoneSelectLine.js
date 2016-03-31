
$(document).ready(function(){
	init();
});
$list_dataType = "线路";//数据名称

function init(){
	$("#main").ligerLayout({top:100});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '分配部门', name: 'org.name', align: 'left', width: 80},
            {display: '对外号码', name: 'showPhone', align: 'left', width: 120},
            {display: '别名', name: 'alias', align: 'left', width: 120},
            {display: '权限', name: 'setType.name', align: 'left', width: 80,render:setTypeRender},
            {display: '当前使用人 ', name: 'currentUser.name', align: 'left', width: 100},
            {display: '上线时间 ', name: 'onlineTime', align: 'left', width: 130},
            {display: '操作', name: 'operate', align: 'left', width: 60,render:operateRender}
        ],
        //width:($(document).width()-10 )+"px",
	    //height:($(document).height()-85 )+"px",
        url: getPath() + "/cmct/phonenew/selectLineData",
        delayLoad:true,
        enabledSort:false,
        onDblClickRow:function(rowData,rowIndex,rowDomElement){
        	var currUser = rowData.currentUser ;
        	if(currUser == null || currUser.id == null){
        		var onlyUser = rowData.onlyUser ;//专用人
        		if(rowData.setType.value == 'SHAR' || (onlyUser!=null && onlyUser.id == $("#personId").val())){
        			//分享类型或者专用人为自己的可以使用
        			saveSelect(rowData.id,rowData.userId,rowData.password,rowData.orgInterfaceId,
        	    			rowData.loginNumber,rowData.alias,rowData.showPhone,rowData.defaultShowPhone,
        	    			rowData.setType.value,rowData.org.longNumber,rowData.mac,rowData.phoneType,rowData.httpUrl,rowData.spid,rowData.passWd);
        		}else{
        			art.dialog.tips("当前线路为["+onlyUser.name+"]专用线路");
        		}
        	}else{
        		art.dialog.tips("当前线路已被["+currUser.name+"]使用");
        	}
	    },
	    onAfterShowData:function(rowData,rowIndex,rowDomElement){
	    	if(rowData!=null){
	    		var currOrgLongNumber = $("#currOrgLongNumber").val();
	    		for(var i = 0 ; i < rowData.items.length ; i ++){
	    			rowObj = rowData.items[i];
	    			if(currOrgLongNumber.indexOf(rowObj.org.longNumber) == -1){
	    				$("tr[id='tableContainer|2|"+rowObj.__id+"']").addClass("grayRow");
	    				$("tr[id='tableContainer|2|"+rowObj.__id+"'] td").removeClass("l-grid-row-cell");
	    			}
	    		}
	    	}
	    }
    }));
	//查询
	
	searchData();
	loadRecentlyData();
}

function loadRecentlyData(){
	var loadRecentlyDataUrl=getPath() + "/cmct/phonenew/selectLineDataByLastThree";
	$.post(loadRecentlyDataUrl,{},function(res){
		if(res.STATE=="SUCCESS"){
			var data=res.members;
			var li="";
			li+="<li><span style='line-height:24px;'>最近使用线路:</span></li>";
			for(var i=0;i<data.length;i++){
				var currUser = data[i].currentUser ;
				if(currUser == null || currUser.id == null){
					var onlyUser = data[i].onlyUser ;//专用人
					if(data[i].setType && data[i].setType.value == 'SHAR' || (onlyUser!=null && onlyUser.id == $("#personId").val())){
						li+="<li onclick=saveSelect('"+data[i].id+"','"+data[i].userId+"','"+data[i].password+"','"+data[i].orgInterfaceId+"','" +
						  data[i].loginNumber+"','"+data[i].alias+"','"+data[i].showPhone+"','"+data[i].defaultShowPhone+"','"+
					      data[i].setType.value+"','"+data[i].org.longNumber+"','"+data[i].mac+"','"+data[i].phoneType+"','"+
						  data[i].httpUrl+"','"+data[i].spid+"','"+data[i].passWd+"')>" +
						 "<span class='telborder'>"+data[i].showPhone+"</span>" +
						 "</li>"
					}
				}else{
					li+="<li onclick=selectTips('"+currUser.name+"')>" +
							"<span class='telborder'>"+data[i].showPhone+"</span>" +
					    "</li>"
				}
			}
			$('[lastdata]').append(li);
		}else{			
			$('[lastdata] li').remove();
		}
	},'json');
	
}

function selectTips(personName){
	art.dialog.tips('当前线路已被'+personName+'选择');
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

function setTypeRender(data){
	var onlyUser = data.onlyUser ;
	if(data.setType && data.setType.value == 'SHAR' || onlyUser == null ){
		return data.setType.name ;
	}else if(data.setType.value == 'PERSONAL'){
		return ( data.onlyUser.name + "-" + data.setType.name) ;
	}
	return "" ;
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
			"','"+data.setType.value+"','"+data.org.longNumber+"','"+data.mac+"','"+data.phoneType+"','"+data.httpUrl+"','"+data.spid+"','"+data.passWd+"'); href='javascript:void(0);'>使用</a>" ;
		}
	}else{
		if(loginUserId==currUser.id){//当前登录人和当前号码占用人一样,重新使用
			return "<a onclick=saveSelect('"+data.id+"','"+data.userId+"','"+data.password+"','"+
			data.orgInterfaceId+"','"+data.loginNumber+"','"+data.alias+"','"+data.showPhone+"','"+data.defaultShowPhone+
			"','"+data.setType.value+"','"+data.org.longNumber+"','"+data.mac+"','"+data.phoneType+"','"+data.httpUrl+"','"+data.spid+"','"+data.passWd+"'); href='javascript:void(0);'>重新使用</a>" ;
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
function saveSelect(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd){
	var currOrgLongNumber = $("#currOrgLongNumber").val();
	var currMac = $("#currMac").val();
	if(currOrgLongNumber.indexOf(currUserOrgId)==-1){
		art.dialog.confirm("是否选择非本部门线路？",function(){
			/*opener.selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
			window.close();*/
			if(art.dialog.data("selectLineAfter")){
				art.dialog.data("selectLineAfter")(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
				art.dialog.close();
			}else{
				opener.selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
				window.close();
			}
		});
	}else if(currMac!=null && currMac!="" && mac!=null && mac!="" &&  currMac!=mac){
		art.dialog.confirm("该线路绑定的不是当前登录系统的电脑，是否使用？",function(){
			/*opener.selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
			window.close();*/
			if(art.dialog.data("selectLineAfter")){
				art.dialog.data("selectLineAfter")(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
				art.dialog.close();
			}else{
				opener.selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
				window.close();
			}
		});
	}else{
		if(art.dialog.data("selectLineAfter")){
			art.dialog.data("selectLineAfter")(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
			art.dialog.close();
		}else{
			opener.selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd);
			window.close();
		}
	}
}