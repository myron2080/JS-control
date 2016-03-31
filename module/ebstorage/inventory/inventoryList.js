$list_deleteUrl = getPath()+"/ebstorage/inventory/delete";//删除url
$list_editWidth = 1005;
$list_editHeight = 750;
$list_dataType = "库存列表" ;
$(document).ready(function(){
	eventFun("#goodsKey");
	eventFun("#storageKey");
	eventFun("#storageSpaceKey");
	$(".graybtn").click(function(){
		resetCommonFun("goodsKey,storageKey,storageSpaceKey");
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '商品编码', name: 'goods.number', align: 'left', width: 140, isSort:false},        
         {display: '商品名称', name: 'goods.name', align: 'center', width: 120, isSort:false},
         {display: '仓库编码', name: 'storageNumber', align: 'left',  width: 140, isSort:false},
         {display: '仓库名称', name: 'storageName', align: 'center',  width: 120, isSort:false},
         {display: '仓位编码', name: 'storageSpaceNumber', align: 'left',  width: 140, isSort:false},
         {display: '仓位名称', name: 'storageSpaceName', align: 'center',  width: 120, isSort:false},
         {display: '可用数量', name: 'ableCount', align: 'left', width: 120, isSort:false},
         {display: '占用数量', name: 'occupyCount', align: 'left', width: 140, isSort:false},
         {display: '总库存', name: 'allCount', align: 'left',  width: 60, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebstorage/inventory/listData'
    }));
});

/**
 * 查询
 */
function searchData(){
	var goodsKey=$("#goodsKey").val();
	if(goodsKey == '商品编码/名称'){
		goodsKey='';
	}
	var storageKey=$("#storageKey").val();
	if(storageKey == '仓库编码/名称'){
		storageKey='';
	}
	var storageSpaceKey=$("#storageSpaceKey").val();
	if(storageSpaceKey == '仓位编码/名称'){
		storageSpaceKey='';
	}
	putparam('goodsKey',goodsKey);
	putparam('storageKey',storageKey);
	putparam('storageSpaceKey',storageSpaceKey);
	resetList();
}


function putparam(key,value){
	if(value.trim() != ''){
		$list_dataParam[key] = value;
	}else{
		delete $list_dataParam[key];
	}
	
}


//回车查询事件
document.onkeydown=function(e){
	var keyCode= ($.browser.msie) ? e.keyCode : e.which ;  
	if(keyCode == 13){ 
		if(isAllfocus("goodsKey,storageKey,storageSpaceKey")){
			searchData();
		}
  }
}


