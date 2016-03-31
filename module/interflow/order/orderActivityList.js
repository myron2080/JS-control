$(document).ready(function(){
	initDateSelCtrl();
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
	        {display: '点餐名称', name: 'name', align: 'center', width: 100,render:showDetail},
            {display: '点餐日期', name: 'orderTime', align: 'center', width: 80},
            {display: '类型', name: 'type.name', align: 'left', width: 80},
            {display: '餐厅', name: 'restaurant.name', align: 'left', width: 100},
            {display: '餐厅联系电话', name: 'telephone', align: 'left', width: 300,render:showTel},
            {display: '参与人数', name: 'personCount', align: 'left', width: 50},
            {display: '参与部门', name: 'participateOrg', align: 'left', width: 250},
            {display: '发起人', name: 'creator.name', align: 'left', width: 50},
            {display: '发起日期', name: 'createTime', align: 'center', width: 80},
            {display: '状态', name: 'status', align: 'left', width: 50,render:showSta},
            {display: '操作', name: 'operate', align: 'center', width: 100,render:operateRender}
        ],
        height:'99%',
        fixedCellHeight:false,
        url:getPath()+'/interflow/order/listData'
    }));
	
});
function showTel(data,filterData){
		return data.restaurant.telephoneOne+" "+data.restaurant.telephoneTwo+" "+data.restaurant.telephoneThree;
		
}
function operateRender(data,filterData){
	var str="";
	if(data.status=='0'&&curId==data.creator.id){
	 str='<a href="javascript:changeStatus({id:\''+data.id+'\'});" >开启</a>';
	}else if(data.status=='1'){
		str+='<a href="javascript:joinOrder({id:\''+data.id+'\'});">参与点餐</a>';
		if(curId==data.creator.id){
			str+='|<a href="javascript:changeStatus({id:\''+data.id+'\'});">结束</a>';
		}
	}
		return str;
		
}
function showSta(data,filterData){
	if(data.status=='1'){
		return '已开启';
	}else{
		return '已结束';
	}
}
function showDetail(data,filterData){
	return '<a href="javascript:showOrder(\''+data.id+'\''+',\''+data.creator.id+'\');" >'+data.name+'</a>'; 
}
function searchData(){
	var contents=$('#searchContent').val();
	var startDate = "";
	var endDate = "";
	if(MenuManager.menus["dateSelCtrl"]){
		startDate = MenuManager.menus["dateSelCtrl"].getValue().timeStartValue;
		endDate = MenuManager.menus["dateSelCtrl"].getValue().timeEndValue;
	}
	//查询开始时间
	if(startDate!=null && startDate != ""){
			startDate = startDate.replace(/\//g,"-");
			$list_dataParam['startDate'] = startDate;
	}else{
		delete $list_dataParam['startDate'];
	}
	//查询结束时间
	if(endDate!=null && endDate != ""){
		endDate = endDate.replace(/\//g,"-");
			$list_dataParam['endDate'] = endDate;
	} else {
			delete $list_dataParam['endDate'];
	}
	
	if(contents!=null || contents!=''){
		$list_dataParam['contents']=contents;
	}else{
		delete $list_dataParam['contents'];
	}
	
	resetList();
}
function changeStatus(data){
	$.post(getPath()+'/interflow/order/changeStatus',{id:data.id},function(data){
		if(data.STATE=='SUCCESS'){
		art.dialog.tips(data.MSG);
		refresh();
		}
	},"JSON");
	
}
function showOrder(id,cid){
	art.dialog.data("oid",id);
	art.dialog.data("cid",cid);
	 art.dialog.open(getPath()+'/interflow/orderDetail/list?oid='+id,{
		 title:'点餐查看',
		 lock:true,
		 width:'880px',
		 height:'480px',
		 id:"showOrder",
		 button:[{name:'关闭'}]
		});
}
function launchOrder(){
	var dlg=art.dialog.open(getPath()+'/interflow/order/launchOrder',{
		 title:'发起点餐',
		 lock:true,
		 width:'500px',
		 height:'200px',
		 id:"launchOrder",
		 ok:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveOrder){
					dlg.iframe.contentWindow.saveOrder(dlg);
					refresh();
				}
				
				return false ;
			},
			cancel:function(){
				
			}
		});
}
function joinOrder(data){
	var dlg = art.dialog.open(getPath()+'/interflow/order/joinOrder?id='+data.id,{
		 title:'参与点餐',
		 lock:true,
		 width:'500px',
		 height:'280px',
		 id:"joinOrder",
		 ok:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveOrderDetail){
					dlg.iframe.contentWindow.saveOrderDetail(dlg);
					
				}
				return false ;
			},
			cancel:function(){
				
			}
		});
}
function initDateSelCtrl(){
	params ={};
	params.inputTitle = "点餐日期";	
	MenuManager.common.create("DateRangeMenu","dateSelCtrl",params);
	}