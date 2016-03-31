$list_editUrl = getPath()+"/ebsite/shoppingCart/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebsite/shoppingCart/add";//新增url
$list_deleteUrl = getPath()+"/ebsite/shoppingCart/delete";//删除url
$list_editWidth = 1005;
$list_editHeight = 750;
$list_dataType = "购物车" ;
$(document).ready(function(){
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns:[
         {display: '操作', name: '', align: 'center', width: 120,render:operateRender, isSort:false},
         {display: '会员用户名', name: 'member.userName', align: 'center',  width: 100, isSort:false},
         {display: '会员昵称', name: 'member.nickName', align: 'center',  width: 100, isSort:false},
         {display: '会员姓名', name: 'member.realName', align: 'center',  width: 100, isSort:false},
         {display: '商品', name: 'goods.name', align: 'center',  width: 120, isSort:false},
         {display: '商品原价', name: 'price', align: 'center', width: 100, isSort:false},
         {display: '商品优惠价', name: 'favPrice', align: 'center', width: 100, isSort:false},
         {display: '商品数量', name: 'count', align: 'center',  width: 100, isSort:false},
         {display: '总价', name: 'totalAmount', align: 'center',  width: 120, isSort:false}
		],
        width:"99%",
        enabledSort:true,
        url:getPath() + '/ebsite/shoppingCart/listData'
    }));
});
/**
 * 查询
 */
function searchData(){
	
	resetList();
}


/**
 * 操作
 */
function operateRender(data){
	return '<a>编辑</a>';
}

