$list_editUrl = getPath() + "/ebsite/snappingitem/edit?snappingId="+snappingId;// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/snappingitem/add?snappingId="+snappingId;// 新增url
$list_deleteUrl = getPath() + "/ebsite/snappingitem/delete";// 删除url
$list_editHeight = (window.screen.height * 51 /100)+"px";
$list_editWidth = "600px";
$list_dataType = "抢购商品管理";// 数据名称
$(document).ready(
		function() {
			$list_editUrl = getPath() + "/ebsite/snappingitem/edit?snappingId="+snappingId;// 编辑及查看url
			$list_addUrl = getPath() + "/ebsite/snappingitem/add?snappingId="+snappingId;// 新增url
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
                        {
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 140,
	                     render:operateRender
                        },{
								display : '排序号',
								name : 'sortNum',
								align : 'center',
								width : 130
						},{
							display : '抢购商品编号',
							name : 'number',
							align : 'center',
							width : 130
						},{
							display : '标题',
							name : 'title',
							align : 'center',
							width : 130
						},
						{
							display : '商品名称',
							name : 'goods.name',
							align : 'center',
							width : 130
						},{
							display : '优惠价格',
							name : 'favorablePrice',
							align : 'center',
							width : 130
						},{
							display : '预定数量',
							name : 'preSaleCount',
							align : 'center',
							width : 130
						},{
							display : '关注数量',
							name : 'preSaleCount',
							align : 'center',
							width : 130
						},{
							display : '状态',
							name : 'status.name',
							align : 'center',
							width : 60
						},{
							display : '开售时间',
							name : 'startSaleTime',
							align : 'center',
							width : 130
						},{
							display : '结束时间',
							name : 'endSaleTime',
							align : 'center',
							width : 130
						}
						],
						delayLoad : true,
						url : getPath() + '/ebsite/snappingitem/listData?snappingId='+snappingId
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
			
			
			initClearBtn();
			innitCount({});

		});



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
		
		searchData();
	});
	/*inputEnterSearch("searchKeyWord",searchData);
	inputEnterSearch("importNumber",searchData);*/
	document.onkeydown =function(event){ enterSearch(event)};
}

function afterAddRow(){
	innitCount({});
}
function afterDeleteRow(){
	innitCount({});
}
function innitCount(params){
	params.snappingId = snappingId;
	$.post(base+'/ebsite/snappingitem/getCountByStatus',params,function(res){
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
		if(data.status.value=='WAIT'){//已录入
			str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
			str +='|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
		}	
    return str;
}


function operateRender(data, filterData) {
	var str ="";
	if(data.status.value=='WAIT'){//已录入
		if(qgspztxg_permission == 'Y'){
			str +='<a href="javascript:upStatus(\''+ data.id + '\',\'WHILLSTART\',\'即将开始\');">即将开始</a>';
		}
		if(qgspbj_permission == 'Y'){
			str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
		}
		if(qgspsc_permission == 'Y'){
			str +='|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
		}
	}else if(data.status.value=='WHILLSTART'){
		if(qgspztxg_permission == 'Y'){
			str +='<a href="javascript:upStatus(\''+ data.id + '\',\'WAIT\',\'等待发布\');">等待发布</a>';
		}
		if(qgspztxg_permission == 'Y'){
			str +='|<a href="javascript:upStatus(\''+ data.id + '\',\'ONGOING\',\'进行中\');">进行中</a>';
		}
		if(qgspsztg_permission == "Y"){
			str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
		}
	}else if(data.status.value=='ONGOING'){
		if(qgspztxg_permission == 'Y'){
			str +='<a href="javascript:upStatus(\''+ data.id + '\',\'FINISH\',\'结束\');">结束</a>';
		}
		if(qgspsztg_permission == "Y"){
			str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
		}
	}else if(data.status.value=='FINISH'){
		if(qgspztxg_permission == 'Y'){
			str +='<a href="javascript:upStatus(\''+ data.id + '\',\'WHILLSTART\',\'即将开始\');">发布</a>';
		}
		if(qgspsztg_permission == "Y"){
			str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
		}
	}
	
return str;
}
//状态操作
function upStatus(id,status,statusName){
	var param ={};
	param.id = id;
	param.status = status;
	var desc = "确定修改为【"+statusName+"】?";
		art.dialog.confirm(desc, function() {
			$.post(getPath()+"/ebsite/snappingitem/upStatus",param,function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					innitCount({});
				}
			},'json');
			return true;
		}, function() {
			return true;
		});	
}

function searchData() {
	$list_dataParam['snappingId']=snappingId;
	//订单状态
	if($("#tab").find("li.hover").attr("key") !=""){
		$list_dataParam['status']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['status'];
	}	
	// 商品类目
	var goodsCategoryId = $("#goodsCategoryId").val();
	if (goodsCategoryId != "") {
		$list_dataParam['goodsCategoryId'] = goodsCategoryId;
	} else {
		delete $list_dataParam['goodsCategoryId'];
	}
	//供应商
	var provideId = $("#provideId").val();
	if (provideId != "") {
		$list_dataParam['provideExtId'] = provideId;
	} else {
		delete $list_dataParam['provideExtId'];
	}
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
	$list_dataParam['key'] = keyWord;
	} else {
	delete $list_dataParam['key'];
	}
	var importNumber = $("#importNumber").val();
	if (importNumber != ""&& importNumber != $("#importNumber").attr("defaultValue")) {
	$list_dataParam['importNumber'] = importNumber;
	} else {
	delete $list_dataParam['importNumber'];
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


