$list_editUrl = getPath()+"/projectm/customer/edit";//编辑及查看url
$list_addUrl = getPath()+"/projectm/customer/add";//新增url
$list_deleteUrl = getPath()+"/projectm/customer/delete";//删除url
$list_editWidth = "700px";
$list_editHeight = "480px";
$list_dataType = "客户管理";//数据名称
$(document).ready(function(){
	$list_dataParam['type']=type;
	/*$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
	});	*/
	params ={};
	params.inputTitle = "合作日期:不限";	
	MenuManager.common.create("DateRangeMenu","operatedate",params);
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '客户编号', name: 'number', align: 'left', width:130},
      			{display: '客户简称', name: 'simpleName', align: 'left', width:120 },
      			{display: '客户全称', name: 'fullName', align: 'left', width:150 },
      			{display: '合作日期', name: 'cooperativeDate', align: 'left', width:150 },
      			{display: '客户地址', name: 'cusAddress', align: 'left', width:200 },
      			{display: '客户描述', name: 'remark', align: 'left', width:200 },
      			{display: '使用电话', name: 'isPhone', align: 'left', width:60,render:isPhoneRender },
      			{display: '使用系统', name: 'isErp', align: 'left', width:60,render:isErpRender },
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender}
        ],        
        url:getPath()+'/projectm/customer/listData?type='+type,
        delayLoad:false,
        onDblClickRow:function(data){
        	showDetailCustomer(data.id);
        }
    }));
	$("#searchBtn").click(function(){
		selectList();
	});
	//新增
	$("#addCustomer").click(function(){
		beforeAddRow();
	});
	//清除
	$("#clearBtn").click(function(){	
		clearAll();
	});
});

function isPhoneRender(data){
	if(data.isPhone==1){
		return "使用";
	}else{
		return "未使用";
	}
}

function isErpRender(data){
	if(data.isErp==1){
		return "使用";
	}else{
		return "未使用";
	}
}

/**
 * 清空
 */
function clearAll(){
	$("#key").val($("#key").attr("dValue"));
	MenuManager.menus["operatedate"].resetAll();
}

function showDetailCustomer(id){
	var showDetailCustomerUrl = getPath()+"/projectm/customer/showDetailCustomer";//新增url
	art.dialog.open(showDetailCustomerUrl+"?id="+id,
			{title:'客户查看',
			lock:true,
			width:"815px",
			height:"570px",
			id:'showDetailCustomer',
			button:[{name:'关闭'}]}
	);
}

function operateRender(data,filterData){
		var str= '<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>'
				 +'|<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		if(type=='INTENTIONCUSTOMER'){
			str+='|<a href="javascript:updateCustomerStatus({id:\''+data.id+'\'});">转成交</a>';
		}
		return str;
}

function updateCustomerStatus(data){
	var updateCustomerStatusUrl=getPath()+"/projectm/customer/updateCustomerStatus?id="+data.id;
	$.post(updateCustomerStatusUrl,{},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.tips('修改成功');
			selectList();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	$list_addUrl = getPath()+"/projectm/customer/add?type="+type;//新增url
	addRow({});
}


/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){	
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["operatedate"]){
		queryStartDate = MenuManager.menus["operatedate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["operatedate"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['startDay'] = queryStartDate
	} else {
		delete $list_dataParam['startDay'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['endDay'] = queryEndDate
	} else {
		delete $list_dataParam['endDay'];
	}
	
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 
