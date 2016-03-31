$list_editUrl = getPath() + "/ebsite/startup/getStartupById";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/startup/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/startup/delete";// 删除url
$list_editWidth = "900px";
$list_editHeight = "500px";
$list_dataType = "启动页列表";// 数据名称
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [{
							display : '操作',
							name : '',
							align : 'center',
							width : 150,
							render : operateRender
						} ,{
							display : '图片预览',
							name : 'picUrl',
							align : 'center',
							width : 200, 
							height:300,
							render : operateImage
						}, {
							display : '使用版本',
							name : 'param.deviceVision',
							align : 'center',
							width :120
						}, {
							display : '状态',
							name : 'status',
							align : 'center',
							width : 130,
							render:function(data){if(data.status == 0){return '未启用';}else if(data.status ==1){return '使用中';}else if(data.status == 2){return '已过期';}}
						}, {
							display : '开始时间',
							name : 'useStartTimeStr',
							align : 'center',
							width : 180
						},{
							display : '结束时间',
							name : 'useEndTimeStr',
							align : 'center',
							width : 180
						},{
							display : '描述',
							name : 'desc',
							align : 'center',
							width : 400
						}, {
							display : '上传者',
							name : 'createman',
							align : 'center',
							width : 130
						}, {
							display : '上传时间',
							name : 'createtimeStr',
							align : 'center',
							width : 180
						}],
						height:'95%',
				        fixedCellHeight:false,
					    //checkbox:true,
						url : getPath() + '/ebsite/startup/listData'
				}));
			
			
			var params ={};
			params.width = 310;
			params.inputTitle = "生效时间范围";	
			params.dateFmt = 'yyyy/MM/dd HH:mm:00';
			params.fmtEndDate = true;
			MenuManager.common.create("DateRangeMenu","useTime",params);
			
			$("#searchBtn").click(function() {
				searchData();
			});
			searchData();
			initClearBtn();
			
			
		});

function operateImage(data){
	var image="<div style='width:100%;height:100%;'><img  src='"+data.picUrl+"' width='125px' height='120'></div>";
	return image;
}


//禁用启用  效果
function operateRender(data) {
	var str="";
		if(data.status == 1){
			str += '<a href="javascript:void(0);" style="color:#cccccc">编辑</a> | ';
			str+='<a href="javascript:void(0);" style="color:#cccccc" >删除</a> ';
		} else if(data.status == 0){
			str += '<a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a> | ';
			str+='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a> ';
		}else if(data.status == 2){
			str += '<a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a> | ';
			str+='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a> ';
		}
	 return str;
}


$(function(){
	$("#tab").find("li").click(function() {
		$(this).addClass("hover");
		$(this).siblings("li").removeClass("hover");
		$("#deviceType").val($(this).attr("key"));
		var deviceType = $("#deviceType").val();
		if(deviceType != ""){
			$list_dataParam["deviceType"] = deviceType;
		} else {
			$list_dataParam["deviceType"] = deviceType;
		}
		resetList();
	});
	
	// 回车 事件
	$('#keyWord,#storageKey,#addressInfo').on('keyup', function(event) {
		if (event.keyCode == "13") {
			searchData();
		}
	});
});
		
/**
 * 清空按钮    
 */
function initClearBtn(){
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	$("#resetBtn").bind("click",function(){
		$("#status").find("option[value='']").attr("selected",true);
		MenuManager.menus["useTime"].resetAll();
		searchData();
	});
	document.onkeydown =function(event){ enterSearch(event)};
}


function searchData() {
	//创建时间
	var starttime ="";
	var endtime = "";
	if(MenuManager.menus["useTime"]){
		starttime = MenuManager.menus["useTime"].getValue().timeStartValue;
		endtime = MenuManager.menus["useTime"].getValue().timeEndValue;
	}
	if(starttime != ""){
		$list_dataParam['starttime'] = starttime;
	} else {
		delete $list_dataParam['starttime'];
	}
	if(endtime != ""){
		$list_dataParam['endtime'] = endtime;
	} else {
		delete $list_dataParam['endtime'];
	}
	var status=$("#status").val();
	if(status!=""){
		$list_dataParam['status'] = status;
	}else{
		delete $list_dataParam['status'];
	}
	resetList();
}
/**
 * 点击上传设置所调用的方法
 */
function startupparamlist(){
	var flag = false;
	var url= base+"/ebsite/startupparam/list";
	var dlg = art.dialog.open(url,
			{title:"启动页配置列表",
			 lock:true,
			 width:(window.screen.width  * 34.5 /100) +"px",
			 height:(window.screen.height * 40 /100)+"px",
			 id:"goodsMannager",
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}}],
			 close:function(){
				 if(flag){
					 if(typeof(afterEditRow)=='function'){
						 afterEditRow();
					 }
					 refresh();
				 }
			 }
			});
}

function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
		
