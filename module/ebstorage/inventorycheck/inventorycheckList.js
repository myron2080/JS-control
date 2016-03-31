$list_editUrl = getPath()+"/ebstorage/inventorycheck/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebstorage/inventorycheck/add";//新增url
$list_deleteUrl = getPath()+"/ebstorage/inventorycheck/delete";//删除url
$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "库存盘点" ;
var approveEnum={UNAPPROVE:'未审批',APPROVED:'已审批',REJECT:'已驳回',UNSEND:'未发货',SENT:'已发货',GOT:'已收货'};
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
    $(".orangebtn a").click(function(){
    	editInventoryCheck();
    });	
	$(".graybtn").click(function(){
		MenuManager.menus["checkDate"].setValue("","");
		resetCommonFun("numberStorage");
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: '', align: 'center', width: 120, isSort:false ,render:renderOperate},        
         {display: '编码', name: 'number', align: 'center', width: 160, isSort:false,render:numberLink},
         {display: '仓库名称', name: 'storage.name', align: 'center',  width: 120, isSort:false},
         {display: '盘点日期', name: 'checkDate', align: 'center',  width: 120, isSort:false},
         {display: '盘点人', name: 'person.name', align: 'center', width: 120, isSort:false},
         {display: '账面数', name: 'totalBookCount', align: 'center', width: 150, isSort:false
        	 , totalSummary: {
	    		 render: function (suminf, column, cell)
	    			                        {
	    			                            return '<div>账面数合计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
	    			                        },
	    			align: 'left'
           }
         },
         {display: '实有数', name: 'totalActCount', align: 'center', width: 150, isSort:false
        	 , totalSummary: {
	    		 render: function (suminf, column, cell)
	    			                        {
	    			                            return '<div>实有数合计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
	    			                        },
	    			align: 'left'
           }
         },
         {display: '盈', name: 'totalProfit', align: 'center', width: 150, isSort:false
        	 , totalSummary: {
	    		 render: function (suminf, column, cell)
	    			                        {
	    			                            return '<div>盈利合计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
	    			                        },
	    			align: 'left'
           }
         },
         {display: '亏', name: 'totalLoss', align: 'center', width: 150, isSort:false
        	 , totalSummary: {
	    		 render: function (suminf, column, cell)
	    			                        {
	    			                            return '<div>亏损合计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
	    			                        },
	    			align: 'left'
           }
         },
         {display: '盘点类目数', name: 'categoryCount', align: 'center', width: 150, isSort:false
        	 , totalSummary: {
	    		 render: function (suminf, column, cell)
	    			                        {
	    			                            return '<div>类目数合计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
	    			                        },
	    			align: 'left'
           }
         },
         {display: '盘点总价', name: 'totalAmount', align: 'center',  width: 150, isSort:false
        	 , totalSummary: {
	    		 render: function (suminf, column, cell)
	    			                        {
	    			                            return '<div>总价合计：' + parseFloat(suminf.sum).toFixed(2) + '</div>';
	    			                        },
	    			align: 'left'
              }
         },
         {display: '备注', name: 'remark', align: 'center',  width: 120, isSort:false}
		],
		isTotalSummary: true,
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebstorage/inventorycheck/listData'
    }));
	var params ={};
	params.width = 210;
	params.inputTitle = "盘点日期";	
	MenuManager.common.create("DateRangeMenu","checkDate",params);
});

function renderOperate(data){
	var varLink='';
	if (bj_permission=='Y') {
		varLink+='<a href="javascript:void(0);" onclick="editInventoryCheck(\''+data.id+'\')">编辑</a>';
	}
	if (sc_permission=='Y') {
		varLink+= '|<a href="javascript:void(0);" onclick="deleteInventoryCheck(\''+data.id+'\')">删除</a>';
	} 
	return  varLink;
}
/**
 * 查询
 */
function searchData(){
	//盘点时间
	var checkTime_begin = "";
	var checkTime_end = "";
	if(MenuManager.menus["checkDate"]){
		checkTime_begin = MenuManager.menus["checkDate"].getValue().timeStartValue;
		checkTime_end = MenuManager.menus["checkDate"].getValue().timeEndValue;
	}
	if(checkTime_begin != ""){
		$list_dataParam['checkTime_begin'] = checkTime_begin;
	} else {
		delete $list_dataParam['checkTime_begin'];
	}
	if(checkTime_end != ""){
		$list_dataParam['checkTime_end'] = checkTime_end;
	} else {
		delete $list_dataParam['checkTime_end'];
	}
	var keyWord = $("#numberStorage").val();
	if (keyWord && ($('#numberStorage').attr("defaultValue") != keyWord)) {
		$list_dataParam['numberStorage'] = keyWord;
	} else {
		delete $list_dataParam['numberStorage'];
	}
	resetList();
}

//导出的方法
function importList(){
	var param = "";

	var numberStorage=$("#numberStorage").val();
	//盘点时间
	var checkTime_begin = "";
	var checkTime_end = "";
	if(MenuManager.menus["checkDate"]){
		checkTime_begin = MenuManager.menus["checkDate"].getValue().timeStartValue;
		checkTime_end = MenuManager.menus["checkDate"].getValue().timeEndValue;
	}
	
	param+="numberStorage="+numberStorage;
	param+="&checkTime_begin="+checkTime_begin;
	param+="&checkTime_end="+checkTime_end;
	
	window.location.href=base+"/ebstorage/inventorycheck/exportExcel?"+param;
}

function numberLink(data){
	return '<a href="javascript:void(0);" onclick="viewDataDetail(\''+data.id+'\')">'+data.number+'</a>';
}

function viewDataDetail(id){
	var data={id:id};
	viewRow(data);
}

/**
 * 新增/修改弹出页面
 */
function editInventoryCheck(id){
	var url = base + "/ebstorage/inventorycheck/add";
	var title="新增";
	if(null != id){
		title="编辑";
		url = base + "/ebstorage/inventorycheck/edit?id="+id;
	}
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:"库存盘点-"+title,
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"editInventoryCheck",
		 button:[{name:'保存',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit(dlg);
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

function deleteInventoryCheck(id){
	art.dialog.confirm("确定要删除这条盘点单?",function(){
		$.post(base+'/ebstorage/inventorycheck/delete',{id:id},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				refresh();
			}
		},'json');
	});
}

//回车查询事件
document.onkeydown=function(e){
	var keyCode= ($.browser.msie) ? e.keyCode : e.which ;  
	if(keyCode == 13){ 
		if(isAllfocus("numberStorage")){
			searchData();
		}
    }
}

//清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	MenuManager.common.resetAll();
	searchData();
}


