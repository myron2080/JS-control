$list_editUrl = getPath() + "/ebsite/snapping/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/snapping/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/snapping/delete";// 删除url
$list_editWidth = "720px";
$list_editHeight = "300px";;
$list_dataType = "抢购管理";// 数据名称
$(document).ready(
		function() {
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
                        {
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 140,
	                     render:operateRender},           
						{
							display : '抢购编号',
							name : 'number',
							align : 'center',
							width : 130
						},{
							display : '名称',
							name : 'name',
							align : 'center',
							width : 130
						},{
							display : '状态',
							name : 'isLaunch',
							align : 'center',
							width : 60,
							render:function(data){
								return data.isLaunch=='1'?"已发布":"未发布";
							}
						},{
							display : '开始时间',
							name : 'startTime',
							align : 'center',
							width : 130
						},{
							display : '结束时间',
							name : 'endTime',
							align : 'center',
							width : 130
						}
						],
						delayLoad : true,
						url : getPath() + '/ebsite/snapping/listData'
					}));
			searchData();

			$("#searchBtn").click(function() {
				searchData();
			});
			
			$("#tab").find("li").click(function(){
				$(this).addClass("hover");
				$(this).siblings("li").removeClass("hover");
				searchData();
			});
			var params ={};
			params.width = 260;
			params.inputTitle = "日期";	
			MenuManager.common.create("DateRangeMenu","activitydate",params);
			
			initClearBtn();

		});

function goodsMannager(id){
	var flag = false;
	var url= base+"/ebsite/snappingitem/list?snappingId="+id
	var dlg = art.dialog.open(url,
			{title:"抢购商品管理",
			 lock:true,
			 width:(window.screen.width  * 57 /100) +"px",
			 height:(window.screen.height * 51 /100)+"px",
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
function afterAddRow(){
	innitCount();
}
function afterDeleteRow(){
	innitCount();
}
/**
 * 清空按钮
 */
function initClearBtn(){
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	$("#importMannager").bind("click",function(){
		importMannager();
	});
	
	$("#resetBtn").bind("click",function(){
		$("#goodsCategoryId").val("");
		$("#goodsCategoryName").val("商品类目");
		$("#provideId").val("");
		$("#provideName").val("供应啥");
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#importNumber").val($("#importNumber").val());
		MenuManager.menus["activitydate"].resetAll();
		$("#queryTimeType")[0].selectedIndex=0; 
		searchData();
	});
	document.onkeydown =function(event){ enterSearch(event)};
}


function innitCount(param){
	console.log(JSON.stringify(param));
	$.post(base+'/ebsite/snapping/getCountByStatus',param,function(res){
	var obj =  res[0];
	var total = 0;
	for(var i in obj){
		$("#"+i).html("("+obj[i]+")");
		total+=parseInt(obj[i]);
	}
	$("#ALL").html("("+total+")");
	},'json');
}

function operateRender(data, filterData) {
		var str ="";
		if(data.isLaunch=='0'){//已录入
			if(qgfbcx_permission == 'Y'){
				str +='<a href="javascript:upIsLaunch(\''+ data.id + '\',\'1\');">发布</a>';
			}
			if(qgbj_permission == 'Y'){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
			}
		}else {//已上架
			if(qgfbcx_permission == 'Y'){
				str +='<a href="javascript:upIsLaunch(\''+ data.id + '\',\'0\');">撤销</a>';
			}
			if(qgtg_permission == 'Y'){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
			}
		}
		if(qgfbcx_permission == 'Y'){
			str +='|<a href="javascript:goodsMannager(\''+ data.id + '\');">商品设置</a>';
		}
		
    return str;
}

//状态操作
function upIsLaunch(id,isLaunch){
	
	var param ={};
	param.id = id;
	param.isLaunch = isLaunch;
	var desc = "确定发布?";
	if(isLaunch=="0")
		desc = "确定撤销?";
		art.dialog.confirm(desc, function() {
			$.post(getPath()+"/ebsite/snapping/upIsLaunch",param,function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					innitCount();
				}else{
					art.dialog.tips(data.MSG);
				}
			},'json');
			return true;
		}, function() {
			return true;
		});	
}
function searchData() {
	//订单状态
	if($("#tab").find("li.hover").attr("key") !=""){
		$list_dataParam['isLanuch']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['isLanuch'];
	}	
	// 关键字
	var keyWord = $("#searchKeyWord").val().trim();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
	$list_dataParam['key'] = keyWord;
	} else {
	delete $list_dataParam['key'];
	}
	//活动时间
	/*var beginTime = "";
	var endTime = "";
	if(MenuManager.menus["activitydate"]){
		beginTime = MenuManager.menus["activitydate"].getValue().timeStartValue;
		endTime = MenuManager.menus["activitydate"].getValue().timeEndValue;
	}
	if(beginTime != ""){
		$list_dataParam['beginTime'] = beginTime;
	} else {
		delete $list_dataParam['beginTime'];
	}
	if(endTime != ""){
		$list_dataParam['endTime'] = endTime;
	} else {
		delete $list_dataParam['endTime'];
	}*/
	// 下单日期
	var queryStartDate = "";
	var queryEndDate = "";
	if (MenuManager.menus["activitydate"]) {
		queryStartDate = MenuManager.menus["activitydate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["activitydate"].getValue().timeEndValue;
	}
	delete $list_dataParam['startTime_begin'];
	delete $list_dataParam['startTime_end'];
	delete $list_dataParam['endTime_begin'];
	delete $list_dataParam['endTime_end'];
    var queryTimeType = $("#queryTimeType").val();
	if (queryStartDate) {
		$list_dataParam[queryTimeType+'_begin'] = queryStartDate.replace(/\//g,"-");
	} 
	if (queryEndDate) {
		$list_dataParam[queryTimeType+'_end'] = queryEndDate.replace(/\//g,"-");
	}
	resetList();
	innitCount($list_dataParam);
}

function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}


