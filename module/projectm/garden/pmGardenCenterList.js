/**
 * 楼盘列表
 */
$list_viewUrl = getPath()+'/broker/garden/showView';
$list_editUrl = getPath()+'/broker/garden/updateView';
$list_addUrl = '/shihua-surety/scheme/initEdit';
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:700,allowLeftCollapse:false,allowLeftResize:false,allowRightResize:false});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
			{ display: '客户', columns:[
				            {display: '修改', name: 'operate', align: 'center', width: 80,render:renderEdit},
				            {display: '楼盘编码', name: 'GDNB', align: 'center', width:120},
							{display: '楼盘名称', name: 'GDNAME', align: 'center', width:120},
							{display: '片区', name: 'AREANAME', align: 'center', width: 120 },
							{display: '楼栋单元数', name: 'BUILDNUM', align: 'center', width:80},
							{display: '房间总数', name: 'ROOMNUM', align: 'center', width: 80}
						]
			},
			{display: '操作', name: '', align: 'center', width: 80,render:renderDiff},
			{ display: '云端', columns:[
							{display: '楼盘编码', name: 'GDNBYUN', align: 'center', width:120},
							{display: '楼盘名称', name: 'GDNAMEYUN', align: 'center', width:120},
							{display: '片区', name: 'AREANAMEYUN', align: 'center', width: 120 },
							{display: '楼栋单元数', name: 'BUILDNUMYUN', align: 'center', width:80},
							{display: '房间总数', name: 'ROOMNUMYUN', align: 'center', width: 80}
						]
			}
        ],
        delayLoad:true,
        url:getPath()+"/broker/gardenDiff/getListData",
        onDblClickRow : ViewGarden,
        root:'Rows',
	    record:'Total',
        onAfterShowData:function(gridData,rowIndex,rowDomElement){
        	Loading.close();
	    	getData(gridData);
	    }
    }));
	selectList();
	//绑定事件
	$("#searchBtn").click(function(){
		selectList();
	});
	
	$("#City").bind("change",function(){
		$.post(getPath()+"/basedata/area//getListData",{parentId:$(this).val(),areaType:"2"},function(data){
			addOption(data.items,"area","区域");
		},"json");
		$("#geographyArea option").remove();
		$("#geographyArea").append("<option value=''>片区</option>");
	});
	
	$("#area").bind("change",function(){
		$.post(getPath()+"/basedata/area/getListData",{parentId:$(this).val(),areaType:"3"},function(data){
			addOption(data.items,"geographyArea","片区");
		},"json");
	});
	
	$('.system_tab li').click(function(){
		$(this).addClass("hover").siblings().removeClass("hover");
		selectList();
	});
	
});

function getData(gridData){
	if(gridData.exceptionMsg){
		art.dialog.alert(gridData.exceptionMsg);
	}
	$('#matchGarden').html("<font color='red'>(&nbsp;"+gridData.matchGarden+"&nbsp;)</font>");
	$('#diffGarden').html("<font color='red'>(&nbsp;"+gridData.diffGarden+"&nbsp;)</font>");
	$('#missGarden').html("<font color='red'>(&nbsp;"+gridData.missGarden+"&nbsp;)</font>");
	$('#moreGarden').html("<font color='red'>(&nbsp;"+gridData.moreGarden+"&nbsp;)</font>");
}

function readIng(){
	return "正在读取..."
}
function renderEdit(data){
	var type=$(".system_tab li[class='hover']").attr("key");
	if(type=="matchGarden" || type=='diffGarden'){
		if(data.ID){			
			return '<a href="javascript:updateGarden({id:\''+data.ID+'\'});">修改</a>';
		}
	}
}

function renderDiff(data){
	var str="";
	var type=$(".system_tab li[class='hover']").attr("key");
	if((type=="diffGarden" || type=='matchGarden') && data.ID){
		str='<a href="javascript:operateDiff({id:\''+data.ID+'\',idyun:\''+data.IDYUN+'\'});">比较</a>';
	}
	if(type=="missGarden" && data.IDYUN){
		str='<a href="javascript:downGarden({id:\''+data.IDYUN+'\'});">下载</a>';
	}
	if(type=="moreGarden" && data.ID){
//		str='<a href="javascript:uploadGarden({id:\''+data.ID+'\'});">上传</a>';
	}
	return str;
}

var localId = "";
var yunId = "";

function operateDiff(data){
	localId = data.id;
	yunId = data.idyun;
	var dlg =art.dialog.open(getPath() +"/broker/gardenDiff/operateDiffList",
			{
				id : "operateDiff",
				title : '楼盘比较',
				background : '#333',
				width : 830,
				height : 380,
				lock : true,
				button : [{
							name : '取消',
							callback : function() {}
						}]	
			});			
}

function downGarden(data){
	Loading.init(null,'正在下载......');
	$.post(getPath()+"/broker/gardenDiff/downGarden",{gardenId:data.id},function(res){
		Loading.close();
		if(res.STATE=='SUCCESS'){	
			$("li[class='hover']").click();
			art.dialog.tips("下载成功");
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function uploadGarden(data){
	art.dialog.tips('还未开放...');
}

function addOption(areaList,parentdiv,headesc){
	var optionStr = '<option value=\'\'>'+headesc+'</option>';
	$("#"+parentdiv+" option").remove();
	for(var i=0;i<areaList.length;i++){
		optionStr+="<option value='"+areaList[i].id+"'>"+areaList[i].name+"</option>";
	}
	$("#"+parentdiv).append(optionStr);
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	$list_dataParam['areaId'] = $("#area").val();
	$list_dataParam['cityId'] = $("#City").val();
	$list_dataParam['geographyAreaId'] = $("#geographyArea").val();
	var type=$(".system_tab li[class='hover']").attr("key");
	$list_dataParam['type'] = type;
	$list_dataParam['gardenName'] = '';
	if($("#gardenName").val()!='名称/宣传名'){
		$list_dataParam['gardenName'] = $("#gardenName").val();	
	}
	
	if(!$('#customerId').val()){
		art.dialog.tips('请选择客户');
		return false;
	}
//	if(!$list_dataParam['areaId'] && !$list_dataParam['cityId'] && !$list_dataParam['gardenName'] && !$list_dataParam['geographyAreaId']){
//		art.dialog.tips('至少选择一个条件');
//		return false;
//	}
	
	Loading.init(null,'正在查询......');
	resetList();
}

function ViewGarden(data,index){	
	var id=data.ID;
	if(!id){
		return false;
	}
	art.dialog.open($list_viewUrl+"?gardenId="+id, {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 800,
		title:"查看楼盘",
		height : 500,
		lock:true,
		cancelVal: '关闭',
	    cancel: true 
	});			
}

/**
 * *************************************
 * 修改
 * *************************************
 * */
function updateGarden(data){
	var flag = false;
	var dlg = art.dialog.open($list_editUrl+"?gardenId="+data.id
			, {
		init : function() {
		},
		id : 'addGardenWindow',
		width : 800,
		title:"修改楼盘",
		height : 500,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.updateGarden){
						dlg.iframe.contentWindow.updateGarden(dlg);
						flag = true;
					}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	});
}

/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

