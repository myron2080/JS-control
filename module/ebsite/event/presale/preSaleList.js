$list_editUrl = getPath() + "/ebsite/presale/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/presale/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/presale/delete";// 删除url
$list_editWidth = "720px";
$list_editHeight = "300px";;
$list_dataType = "预售管理";// 数据名称
$(document).ready(
		function(){
			params={};
			params.width = 260;
			params.inputTitle = "日期";	
			MenuManager.common.create("DateRangeMenu","createTime",params);
			
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
							display : '预售编号',
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
						url : getPath() + '/ebsite/presale/listData'
					}));
			searchData();

			$("#searchBtn").click(function() {
				searchData();
			});
			
			//切换页签
			$("#tab").find("li").click(function(){
				$(this).addClass("hover");
				$(this).siblings("li").removeClass("hover");
				searchData();
			});
			
//			var params ={};
//			params.width = 260;
//			params.inputTitle = "活动时间";	
//			MenuManager.common.create("DateRangeMenu","activitydate",params);
			
			//jsp页面上的点击按钮事件，包括新增，清空
			initClearBtn();
		});

/**
 * 点击商品设置所调用的方法
 */
function goodsMannager(id){
	var flag = false;
	var url= base+"/ebsite/presaleitem/list?preSaleId="+id
	var dlg = art.dialog.open(url,
			{title:"预售商品管理",
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

/**
 * 新增，清空
 */
function initClearBtn(){

	//如果点击的是添加按钮
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	
	//点击清空按钮
	$("#resetBtn").bind("click",function(){
		//MenuManager.menus["activitydate"].resetAll();
		//清空按预售编号/名称查询
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		//清空开始时间
		MenuManager.menus["createTime"].resetAll();
		$("#queryTimeType")[0].selectedIndex=0; 
		searchData();
	});
	 
	document.onkeydown =function(event){ enterSearch(event)};
}

/**
 * 添加数据之后改变选项卡所对应统计的数量
 */
function afterAddRow(){
	innitCount();
}

/**
 * 删除数据之后改变选项卡所对应统计的数量
 */
function afterDeleteRow(){
	innitCount();
}


/**
 * 查询不同条件下未发布和已发布的数量
 */
function innitCount(param){
//	var para = {};
//	// 关键字
//	var keyWord = $("#searchKeyWord").val();
//	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
//		para.key = keyWord;
//	}
//	var queryStartDate = "";
//	var queryEndDate = "";
//	if (MenuManager.menus["createTime"]) {
//		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
//		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
//	}
//    var queryTimeType = $("#queryTimeType").val();
//	if (queryStartDate) {
//		if(queryTimeType == "startTime"){
//			para.startTime_begin =  queryStartDate.replace(/\//g,"-");
//		}else if(queryTimeType == "endTime"){
//			para.endTime_begin =  queryStartDate.replace(/\//g,"-");
//		}
//	}
//	if (queryEndDate) {
//		if(queryTimeType == "startTime"){
//			para.startTime_end =  queryStartDate.replace(/\//g,"-");
//		}else if(queryTimeType == "endTime"){
//			para.endTime_end =  queryStartDate.replace(/\//g,"-");
//		}
//	}
	console.log(JSON.stringify(param));
	$.post(base+'/ebsite/presale/getCountByStatus',param,function(res){
	var obj =  res[0];
	var total = 0;
	for(var i in obj){
		$("#"+i).html("("+obj[i]+")");
		total+=parseInt(obj[i]);
	}
	$("#ALL").html("("+total+")");
	},'json');
}

/**
 * 操作
 * @param data
 * @param filterData
 * @returns {String}
 */
function operateRender(data, filterData) {
		var str ="";
		if(data.isLaunch=='0'){//已录入
			if(ysfbcx_permission == 'Y'){
				str +='<a href="javascript:upIsLaunch(\''+ data.id + '\',\'1\');">发布</a>';
			}
			if(ysbj_permission == 'Y'){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
			}
			//str +='|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
		}else {//已上架
			if(ysfbcx_permission == 'Y'){
				str +='<a href="javascript:upIsLaunch(\''+ data.id + '\',\'0\');">撤销</a>';
			}
			if(ysgltg_permission == "Y"){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
			}
		}
		if(ysspsz_permission == 'Y'){
			str +='|<a href="javascript:goodsMannager(\''+ data.id + '\');">商品设置</a>';
		}
	
    return str;
}

/**
 * 发布和撤销
 * @param id
 * @param isLaunch
 */
function upIsLaunch(id,isLaunch){
	var param ={};
	param.id = id;
	param.isLaunch = isLaunch;
	var desc = "确定发布?";
	if(isLaunch==0)
		desc = "确定撤销?";
	
		art.dialog.confirm(desc, function() {
			$.post(getPath()+"/ebsite/presale/upIsLaunch",param,function(data){
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
	
/**
 * 按条件查询数据
 */
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
	
	// 下单日期
	var queryStartDate = "";
	var queryEndDate = "";
	if (MenuManager.menus["createTime"]) {
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	delete $list_dataParam['startTime_begin'];
	delete $list_dataParam['startTime_end'];
	delete $list_dataParam['endTime_begin'];
	delete $list_dataParam['endTime_end'];
	
	//判断是按开始时间还是结束时间查询
    var queryTimeType = $("#queryTimeType").val();
    if (queryStartDate) {
		$list_dataParam[queryTimeType+'_begin'] = queryStartDate.replace(/\//g,"-");
	} 
	if (queryEndDate) {
		$list_dataParam[queryTimeType+'_end'] = queryEndDate.replace(/\//g,"-");
	}

/*	//活动时间
	var beginTime = "";
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
	resetList();
	innitCount($list_dataParam);
}

/**
 * 按回车键进行查询
 * @param e
 */
function enterSearch(e) {
	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}


