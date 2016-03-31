$list_deleteUrl = getPath()+"/ebstorage/inventorywarn/delete";//删除url
$list_addUrl = getPath()+"/ebstorage/inventorywarn/add";//新增url
$list_editUrl = getPath()+"/ebstorage/inventorywarn/edit";//编辑及查看url
$list_editWidth = 600;
$list_editHeight = 320;
$list_dataType = "库存预警列表" ;
$(document).ready(function(){
	eventFun("#keyword");
	$(".graybtn").click(function(){
		resetCommonFun("keyword,status");
	});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: 'name', align: 'center', width: 110,render:operateRender},
//         {display: '预警单号', name: 'number', align: 'left', width: 120,render:numberRender},
         {display: '商品名称', name: 'goods.name', align: 'center', width: 130},
         {display: '所属分店', name: 'storageName', align: 'left',  width: 120},
         {display: '分店负责人', name: 'contactName', align: 'center',  width: 100},
         {display: '联系方式', name: 'contactPhone', align: 'center',  width: 120},
         {display: '库存值', name: 'goods.ableCount', align: 'left',  width: 100},
         {display: '上限预警值', name: 'topLimit', align: 'center',  width: 100},
         {display: '下限预警值', name: 'lowerLimit', align: 'left', width: 100},
         {display: '商品规格', name: 'goods.specifications', align: 'left', width: 90},
         {display: '商品单位', name: 'goods.unit', align: 'left', width: 90},
         {display: '创建日期', name: 'createTime', align: 'left', width: 100},
         {display: '上次预警时间', name: 'lastUpdateTime', align: 'left', width: 160},
         {display: '状态', name: 'status', align: 'left', width: 90,render:statusRender},
         {display: '描述', name: 'description', align: 'left',  width: 246}
		],
        width:"99%",
        url:getPath() + '/ebstorage/inventorywarn/listData'
    }));
	
	//回车操作
	inputEnterSearch("keyword",searchData);
});

function numberRender(data,filterData){
	var str='';
	str+='<a href="javascript:void(0)">' + data.number + '</a>';
	return str;	
}

function statusRender(data,filterData){
	var str='';
	str+= data.status == 1 ? "启用" : "禁用";
	return str;	
}

function operateRender(data,filterData){
	var str='';
	if(data.goods.ableCount >= data.topLimit ){
		str+='<span style="float:left"><img src="' + base + '/default/style/images/toplimit.gif"></span>';
	}else if(data.goods.ableCount <= data.lowerLimit){
		str+='<span style="float:left"><img src="' + base + '/default/style/images/lowerlimit.gif"></span>';
	}else{
		str+='&nbsp;&nbsp;&nbsp;';
	}
	if (ss=='Y') {//增加启用禁用的权限
	str+='<a href="javascript:upStatus({id:\''+data.id+'\',status:\''+data.status+'\'})">' + (data.status == 0 ? "启用" : "禁用") + '</a> ';
	}
	if(data.status == 0){
		if (bj=='Y') {//增加编辑的权限
				if (ss =='Y') {
					str+=' |';
				}else {
					str+='';
				}
		str+='<a href="javascript:editRowData({id:\''+data.id+'\'})">编辑 </a>';
		}
	}
	return str;	
}

function editRowData(data){
	
	//判断是否有编辑权限
	if(bj != 'Y'){
		art.dialog.tips('您无权操作！');
		return ;
	}
	
	editRow(data);
}



/**
 * 查询
 */
function searchData(){
	var keyword=$("#keyword").val();
	if(keyword == '商品名称/所属分店'){
		keyword='';
	}
	var status=$("#status").val();
	putparam('keyword',keyword);
	putparam('status',status);
	resetList();
}


function putparam(key,value){
	if(value.trim() != ''){
		$list_dataParam[key] = value;
	}else{
		delete $list_dataParam[key];
	}
	
}

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function upStatus(data) {
	//判断是否有编辑权限
	if(ss != 'Y'){
		art.dialog.tips('您无权操作！');
		return ;
	}
	var title = data.status == 1 ? '禁用' : '启用';
	art.dialog.confirm('确定' + title + '此记录吗?', function() {
		$.post(getPath() + '/ebstorage/inventorywarn/upStatus', {
			id : data.id,
			status : (data.status == 1 ? 0 : 1)
		}, function(res) {
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				refresh();
			}
		}, 'json');
		return true;
	}, function() {
		return true;
	});
}
