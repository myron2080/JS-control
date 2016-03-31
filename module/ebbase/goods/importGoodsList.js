$list_editUrl = getPath() + "/ebbase/goods/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebbase/goods/add";// 新增url
$list_deleteUrl = getPath() + "/ebbase/goods/delete";// 删除url
$list_editWidth = "1010px";
$list_editHeight = "500px";
$list_dataType = "商品列表";// 数据名称
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
							display : '商品编号',
							name : 'number',
							align : 'center',
							width : 130
						},{         
							display : '名称',
							name : 'name',
							align : 'center',
							width : 60
						},{
							display : '标题1',
							name : 'promoteDesc1',
							align : 'center',
							width : 100
						},{
							display : '标题2',
							name : 'promoteDesc2',
							align : 'center',
							width : 100
						},{
							display : '商品类目',
							name : 'goodsCategory.name',
							align : 'center',
							width : 100
						},{
							display : '状态',
							name : 'status.name',
							align : 'center',
							width : 60
						},{
							display : '条形码',
							name : 'barCode',
							align : 'center',
							width : 130
						},{
							display : '计量单位',
							name : 'unit',
							align : 'center',
							width : 150
						}, {
							display : '规格',
							name : 'specifications',
							align : 'center',
							width : 100
						},{
							display : '有效期/天',
							name : 'shelfLife',
							align : 'center',
							width : 100
						},{
							display : '库存',
							name : 'shelfLife',
							align : 'center',
							width : 100
						},{
							display : '库存上限',
							name : 'topLimit',
							align : 'center',
							width : 100
						},{
							display : '库存下限',
							name : 'lowerLimit',
							align : 'center',
							width : 150
						},{
							display : '导入号',
							name : 'importRecord.number',
							align : 'center',
							width : 150
						},{
							display : '入库价',
							name : 'factoryPrice',
							align : 'center',
							width : 150
						},{
							display : '库存',
							name : 'shelfLife',
							align : 'center',
							width : 100,
							render:function(data){
                            return 	parseInt(data.ableCount)+parseInt(data.occupyCount);
							}
						},{
							display : '零售价',
							name : 'salePrice',
							align : 'center',
							width : 100
						},{
							display : '优惠价',
							name : 'favorablePrice',
							align : 'center',
							width : 100
						},{
							display : '录入人',
							name : 'creator.name',
							align : 'center',
							width : 100
						},{
							display : '录入时间',
							name : 'createTime',
							align : 'center',
							width : 150
						},{
							display : '上架人',
							name : 'shelvesPerson.name',
							align : 'center',
							width : 100
						},{
							display : '上架时间',
							name : 'offShelvesTime',
							align : 'center',
							width : 150
						},{
							display : '下架人',
							name : 'offShelvesPerson.name',
							align : 'center',
							width : 100
						},{
							display : '下架时间',
							name : 'offShelvesTime',
							align : 'center',
							width : 150
						}
						],
					    pageSize:100,
						delayLoad : true,
						url : getPath() + '/ebbase/goods/listData',
						onDblClickRow:function(rowData,rowIndex,rowDomElement){
					    }
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

		});



/**
 * 清空按钮
 */
function initClearBtn(){
	
	$("#addBtn").bind("click",function(){
		addRow({});
	});
	$("#resetBtn").bind("click",function(){
		$("#goodsCategoryId").val("");
		$("#goodsCategoryName").val("商品类目");
		$("#provideId").val("");
		$("#provideName").val("供应商");
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
	});
}


function innitCount(){
	var param = {};
	param.importId = importId;
	$.post(base+'/ebbase/goods/getCountByStatus',param,function(res){
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
		if(data.status.value=='INPUT'){//已录入
			str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'SHELVES\');">上架</a>';
			str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
		}else if(data.status.value=='SHELVES'){//已上架
			str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'OFFSHELVES\');">下架</a>';
		}else {//已下架if(data.status.value=='OFFSHELVES')
			str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>|';
			str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'SHELVES\');">重新上架</a>';
		}
    return str;
}


//上架，下架
function updateStatus(id,status){
	var param ={};
	param.id = id;
	param.status = status;
	var desc = "确定上架?";
	if(status="SHELVES"){
		desc = "确定下架?";
	}else if(status="OFFSHELVES"){
		desc = "确定重新下架?";
	}
		art.dialog.confirm(desc, function() {
			$.post(getPath()+"/ebbase/goods/upStatus",param,function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
					innitCount();
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
	$list_dataParam['importId']=importId;
	resetList();
	innitCount();
}

function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
