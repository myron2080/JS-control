$list_editUrl = getPath()+"/ebstorage/outorderline/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebstorage/outorderline/add";//新增url
$list_deleteUrl = getPath()+"/ebstorage/outorderline/delete";//删除url
$list_editWidth="620px";
$list_editHeight="350px";
$list_dataType = "调拨线路" ;
$(document).ready(function(){
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
         columns:[
         {display: '操作',name: '', align: 'center', width: 80, isSort:false, render:operateRender},
         {display: '线路名称',name: 'name', align: 'center', width: 120, isSort:false},
         {display: '司机',name: 'driver.name', align: 'center', width: 120, isSort:false},
         {display: '司机电话',name: 'driver.phone', align: 'center', width: 120, isSort:false},
         {display: '车牌号',name: 'carNo', align: 'center', width: 120, isSort:false},
         {display: '线路编号',name: 'number', align: 'center', width: 120, isSort:false},
         {display: '所属镇分仓',name: 'fcStorage.name', align: 'center', width: 120, isSort:false},
         {display: '是否启用',name: 'flag', align: 'center', width: 120, isSort:false},
         {display: '创建人',name: 'creator.name', align: 'center', width: 120, isSort:false},
         {display: '创建时间',name: 'createDateStr', align: 'center', width: 160, isSort:false},
		],
        width:"99%",
        url:getPath() + '/ebstorage/outorderline/listData'
    }));
});

function operateRender(data){
	var resLink='';
	resLink+='<a href="javascript:void(0);" onclick="editRow({id:\''+data.id+'\'})";>编辑</a>||';
	resLink+='<a href="javascript:void(0);" onclick="deleteRow({id:\''+data.id+'\'})";>删除</a>';
	return resLink;
}