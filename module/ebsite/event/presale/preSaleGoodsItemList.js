$list_editUrl = getPath() + "/ebsite/presaleitem/edit?preSaleId="+preSaleId;// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/presaleitem/add?preSaleId="+preSaleId;// 新增url
$list_deleteUrl = getPath() + "/ebsite/presaleitem/delete";// 删除url
$list_editHeight = (window.screen.height * 51 /100)+"px";
$list_editWidth = "600px";
$list_dataType = "预售商品管理";// 数据名称
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
	                     render:operateRender
                        },{
								display : '排序号',
								name : 'sortNum',
								align : 'center',
								width : 130
						},{
							display : '预售商品编号',
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
						url : getPath() + '/ebsite/presaleitem/listData?preSaleId='+preSaleId
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

function afterAddRow(){
	innitCount({});
}
function afterDeleteRow(){
	innitCount({});
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
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		searchData();
	});
	document.onkeydown =function(event){ enterSearch(event)};
}



function innitCount(param){
	param.preSaleId = preSaleId;
	$.post(base+'/ebsite/presaleitem/getCountByStatus',param,function(res){
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
			if(ysspztxg_permission == 'Y'){
				str +='<a href="javascript:upStatus(\''+ data.id + '\',\'WHILLSTART\',\'即将开始\');">即将开始</a>';
			}
			if(ysspbj_permission == 'Y'){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>';
			}
			if(ysspsc_permission == 'Y'){
				str +='|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
			}
		}else if(data.status.value=='WHILLSTART'){
			if(ysspztxg_permission == 'Y'){
				str +='<a href="javascript:upStatus(\''+ data.id + '\',\'WAIT\',\'等待发布\');">等待发布</a>';
			}
			if(ysspztxg_permission == 'Y'){
				str +='|<a href="javascript:upStatus(\''+ data.id + '\',\'ONGOING\',\'进行中\');">进行中</a>';
			}
			if(spsztg_permission == "Y"){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
			}
		}else if(data.status.value=='ONGOING'){
			if(ysspztxg_permission == 'Y'){
				str +='<a href="javascript:upStatus(\''+ data.id + '\',\'FINISH\',\'结束\');">结束</a>';
			}
			if(spsztg_permission == "Y"){
				str +='|<a href="javascript:editRow({id:\''+ data.id + '\'});">特改</a>';
			}
		}else if(data.status.value=='FINISH'){
			if(ysspztxg_permission == 'Y'){
				str +='<a href="javascript:upStatus(\''+ data.id + '\',\'WHILLSTART\',\'即将开始\');">发布</a>';
			}
			if(spsztg_permission == "Y"){
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
			$.post(getPath()+"/ebsite/presaleitem/upStatus",param,function(data){
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
	$list_dataParam['preSaleId']=preSaleId;
	//订单状态
	if($("#tab").find("li.hover").attr("key") !=""){
		$list_dataParam['status']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['status'];
	}	
	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
	$list_dataParam['key'] = keyWord;
	} else {
	delete $list_dataParam['key'];
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

