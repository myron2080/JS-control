/**
 * 推荐统计报表
 */
var keyValue = "姓名/手机号";
var districtValue="";
var queryStartDate = "";
var queryEndDate = "";
$(document).ready(function() {
	
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名字', name: 'name', align: 'center', width: 170}, 
           /* {display: '手机号', name: 'phoneNumber', align: 'center', width: 170},*/
            {display: '乡镇', name: 'townShip', align: 'center', width: 170},
            {display: '地址', name: 'address', align: 'center', width: 170},
            {display: '区域', name: 'district', align: 'center', width: 170},
            {display: '当日推荐量', name: 'dayRecommend', align: 'center', width: 170},
            {display: '当日有效推荐量', name: 'dayEffectiveRecommend', align: 'center', width: 170},
            {display: '累计推荐量', name: 'cumulativeRecommend', align: 'center', width: 170}, 
            {display: '累计有效推荐量', name: 'cumulativeEffectiveRecommend', align: 'center', width: 170},
            {display: '推荐日期', name: 'recommendTime', align: 'center', width: 170},
        ],
        delayLoad : true,
        url: getPath()+"/bi/storageRpt/queryRecommendRpt",
//        onDblClickRow:function(rowData,rowIndex,rowDomElement){
//        	showdataDetail(rowData.id,rowData.storageName,queryStartDate,queryEndDate,rowData.goodsId);
//        }
    }));
	
	$("#district").change(function(){
		MenuManager.menus["createTime"].resetAll();
		$("#keyWord").attr("value", keyValue);  
		districtValue=$("#district").val();
		searchData();
	});
		
	$("#serchBtn").click(function(){
		searchData();
	});
	
	var params ={};
	params.width = 260;
	params.inputTitle = "推荐时间";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	MenuManager.menus["createTime"].setValue(startTime,endTime);
	MenuManager.menus["createTime"].confirm();
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	searchData();
        }
    });
	searchData();
});

//查询
function  searchData(){
	//提醒时间
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['startTime'] = queryStartDate;
	} else {
		delete $list_dataParam['startTime'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['endTime'] = queryEndDate;
	} else {
		delete $list_dataParam['endTime'];
	}
	
	var keyWord=$("#keyWord").val();
	if(keyWord != "" && keyWord != '姓名/手机号'){
		$list_dataParam['keyWord'] = keyWord;
	}else{
		delete $list_dataParam['keyWord'];
	}
	if(districtValue !=""){
	   $list_dataParam['districtValue'] = districtValue;
	}else{
	   delete $list_dataParam['districtValue'];	
	}
	resetList();
}
//清空
function onEmpty(){
	MenuManager.menus["createTime"].resetAll();
	$("#keyWord").attr("value", keyValue);
	$("#district").attr("value","");
	districtValue="";
	searchData();
}
//导出
function importList(){
	var param = "";
	var keyWord = $("#keyWord").val();   //姓名或手机号
	var startTime = MenuManager.menus["createTime"].getValue().timeStartValue;  
	var endTime = MenuManager.menus["createTime"].getValue().timeEndValue;
	//查询开始时间
	if(startTime != ""){
		startTime = startTime.replace(/\//g,"-");
	}
	//查询结束时间
	if(endTime != ""){
		endTime = endTime.replace(/\//g,"-");
	}
	if("姓名/手机号"==keyWord){
		keyWord="";
	}	
	param += "startTime=" + startTime;
	param += "&endTime=" + endTime;
	param += "&keyWord=" + keyWord;
	param += "&districtValue="+districtValue;
	window.location.href = base+"/bi/storageRpt/exportRecommendExcel?"+param;
}
//导入
function exportRecommend(){
	var flag = false;
	var url= base+"/bi/storageRpt/exportRecommend"
	var dlg = art.dialog.open(url,
			{title:"推荐导入",
			 lock:true,
			 width:'635px',
			 height:'130px',
			 id:"importInventoryDialog",
			 button:[{name:"导入",callback:function(){
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
					 refresh();
				 }
			 }
	 });
}
//批量删除
function batchDelete(){
	var param = "";
	param += "&districtValue="+districtValue;
	if(districtValue=="" || districtValue==null){
		alert("请选择区域进行批量删除！");
		return;
	}
	if (confirm("您确定批量删除   "+districtValue+"  所有的数据吗？")){
	  /*  window.location.href = base+"/bi/storageRpt/batchRecommendDelete?"+param;*/
	    $.post(getPath() + '/bi/storageRpt/batchRecommendDelete', {
	    	districtValue : districtValue
		}, function(res) {
			onEmpty();
		}, 'json');
	 }
}
