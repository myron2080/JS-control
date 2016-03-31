$list_editUrl = getPath() + "/lunch/comment/edit";// 编辑及查看url
$list_addUrl = getPath() + "/lunch/comment/add";// 新增url
$list_deleteUrl = getPath() + "/lunch/comment/delete";// 删除url
$list_editWidth = "530px";
$list_editHeight = "280px";
$list_dataType = "评论列表";// 数据名称
var statusComboBox = null;

$(document).ready(
		function() {
			params={};
			params.width = 260;
			params.inputTitle = "创建日期";	
			MenuManager.common.create("DateRangeMenu","createTime",params);
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [
                        {
	                     display: '操作', 
	                     name: 'operate', 
	                     align: 'center',
	                     width: 120,
	                     render:operateRender},           
						{
							display : '菜品名称',
							name : 'dishesName',
							align : 'center',
							width : 120
						},{         
							display : '状态',
							name : 'isOpen',
							align : 'center',
							width : 60,
							render:function(data){
								return data.isOpen==1?"评价公开":"本人可见"
							}
						},{
							display : '用户名',
							name : 'creator.nickName',
							align : 'center',
							width : 150
						}, {
							display : '电话号码',
							name : 'creator.phoneNumber',
							align : 'center',
							width : 100
						},{
							display : '创建时间',
							name : 'createTime',
							align : 'center',
							width : 100
						},{
							display : '是否处理',
							name : 'hadDeal',
							align : 'center',
							width : 100,
							render:function(data){
								return data.hadDeal==1?"已处理":"未处理"
							}
						}
						],
						delayLoad : true,
						url : getPath() + '/lunch/comment/listData'
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
function detailView(id){
	var flag = false;
	var url= base+"/lunch/comment/detailView"
	var param= "?dataId="+id;
	var dlg = art.dialog.open(url+param,
			{title:"订单详情",
			 lock:true,
			 width:'680px',
			 height:'580px',
			 id:"DEAL",
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


function updateStatus(id,status){
	var flag = false;
	var url= base+"/lunch/comment/dealView"
	var param= "?dataId="+id+"&status="+status;
	var dlg = art.dialog.open(url+param,
			{title:status=="ALREADYPAYMENT"?"完成":"退单",
			 lock:true,
			 width:'430px',
			 height:'100px',
			 id:"DEAL",
			 button:[{name:status=="ALREADYPAYMENT"?"完成":"退单",callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit();
					}
					return false;
				}},{name:'取消',callback:function(){
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
 * 清空按钮
 */
function initClearBtn(){
	$("#resetBtn").bind("click",function(){
		MenuManager.menus["createTime"].resetAll();
		$("#searchKeyWord").val($("#searchKeyWord").attr("defaultValue"));
		$("#dishesName").val($("#dishesName").attr("defaultValue"));
		$("#dishesId").val("");
		
	});
}


function innitCount(){
	$("#tab em").html('(0)');
	delete $list_dataParam['orderStatusEnum'];
	$.post(base+'/lunch/comment/getCountByStatus',$list_dataParam,function(res){
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
		/*if(data.orderStatusEnum.value=='ALREADYPAYMENT'){//已付款
			str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'ALREADYFINISH\');">完成</a>';
			str +='|<a href="javascript:singelrefundApply(\''+ data.id +'\');">退款</a>';;
		}else if(data.orderStatusEnum.value=='APPLYCHARGEBACK'){//申请退单
			//str +='<a href="javascript:updateStatus(\''+ data.id + '\',\'ALREADYCHARGEBACK\');">退单</a>';
			str +='<a href="javascript:singelrefundApply(\''+ data.id +'\');">退款</a>';;
		}else if(data.orderStatusEnum.value=='PRESENTATION'){//赠送状态
		}*/
		str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">处理</a>';
		
    return str;
}


function searchData() {
	//订单状态
	if($("#tab").find("li.hover").attr("key") !=""){
		$list_dataParam['hadDeal']= $("#tab").find("li.hover").attr("key");
	}else{
		delete $list_dataParam['hadDeal'];
	}	
	// 下单日期
	var queryStartDate = "";
	var queryEndDate = "";
	if (MenuManager.menus["createTime"]) {
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	if (queryStartDate) {
		$list_dataParam['queryStartDate'] = queryStartDate.replace(/\//g,"-");;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	if (queryEndDate) {
		$list_dataParam['queryEndDate'] = queryEndDate.replace(/\//g,"-");;
	} else {
		delete $list_dataParam['queryEndDate'];
	}

	// 关键字
	var keyWord = $("#searchKeyWord").val();
	if (keyWord != ""&& keyWord != $("#searchKeyWord").attr("defaultValue")) {
	$list_dataParam['keyWord'] = keyWord;
	} else {
	delete $list_dataParam['keyWord'];
	}
	// 公开状态
	var dishesId = $("#dishesId").val();
	if (dishesId!="") {
	$list_dataParam['objectId'] = dishesId;
	} else {
	delete $list_dataParam['objectId'];
	}
	
	// 公开状态
	var isOpen = $("#isOpen").val();
	if (isOpen!="") {
	$list_dataParam['isOpen'] = isOpen;
	} else {
	delete $list_dataParam['isOpen'];
	}
	
	$list_dataParam['type'] = 'dishes'
	resetList();
	innitCount();
}

function enterSearch(e) {

	var charCode = ($.browser.msie) ? e.keyCode : e.which;
	if (charCode == 13) {
		searchData();
	}
}
