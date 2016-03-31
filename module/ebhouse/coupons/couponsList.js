$list_editUrl = getPath()+"/ebhouse/coupons/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebhouse/coupons/add";//新增url
$list_deleteUrl = getPath()+"/ebhouse/coupons/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "256px";
$list_dataType = "置业券列表";//数据名称
var manager;
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
                {display: '序号', name: 'number', align: 'left', width: 110 },
      			{display: '名称', name: 'name', align: 'left', width:180},
      			{display: '所属项目', name: 'houseProject.registerName', align: 'left', width:130 },
      			{display: '密码', name: 'secretCode', align: 'left', width:130 },
      			{display: '有效期', name: 'startTime', align: 'left', width:180,render:function(data){
      				return data.startTime+'-'+data.endTime;
      			}},
      			{display: '发布人', name: 'creator.name', align: 'left', width:100 },
      			{display: '金额', name: 'price', align: 'left', width:100 ,render:function(data){
      				return '￥'+data.price;
      			}},
      			{display: '持有人', name: 'holder.name', align: 'left', width:100 },
      			{display: '购买日期', name: 'buyTime', align: 'left', width:100 },
      			{display: '状态', name: 'status.name', align: 'left', width: 160},
      			{display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender} 
        ],
        url:getPath()+'/ebhouse/coupons/listData',
        delayLoad:false,
        checkbox:true,
        onDblClickRow:null
    }));
	$("#selectData").click(function(){
		selectList();
	});
	$("#keyConditions").keydown(function(e){
    	enterSearch(e);
	});
});
function operateRender(data,filterData){
	var str ='';
	
	if(data.status.value=='NOTBUY'||(data.status.value=='OVERDUE'&&data.holder==null))
	str+= '<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	return str;	
}
function onChange(e){
	enterSearch(e);
}
function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}
//清除
$("#clearData").click(function(){	
	
	MenuManager.menus["createTime"].resetAll();
	$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
	$("#houseProjectId").val("");
	$("#status").val("");
	selectList();
});
//新增
$("#addBatch").click(function(){
	addBatch();
});
$("#deleteBatch").click(function(){
	deleteBatch();
});
/**
 * 批量删除
 * @param ids
 */
function deleteBatch(){
	var rows = manager.getSelectedRows();
	if(rows.length>0){
		art.dialog.confirm('确定删除这些数据吗?',function(){
			var ids = '';
			for(var i = 0; i < rows.length; i++){
				if(rows[i].status.value=='NOTBUY'||(rows[i].status.value=='OVERDUE'&&rows[i].holder==null)){
				ids += rows[i].id;
				if(i < rows.length - 1){
					ids += ',';
				}}else{
					art.dialog.tips("选中数据中有不可删除的数据项！");
					return ;
				}
			}
			$.post(getPath()+'/ebhouse/coupons/deleteByIds',{ids:ids},function(res){
				art.dialog.tips(res.MSG);
				refresh();
			},'json');
		});
	}else{
		art.dialog.tips('请先选择需要删除的行');
	}
}
function addBatch(){
	var u = getPath()+"/ebhouse/coupons/addBatchView";
	var flag = true;
	var dlg = art.dialog.open(u,
		{title:"批量新增",
		 lock:true,
		 width:'480px',
		 height:'130px',
		 id:"coupons-EDIT",
		 button:[{name:'确定',callback:function(){
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
				 if(typeof(afterEditRow)=='function'){
					 afterEditRow();
				 }
				 refresh();
			 }
		 }
		});
}

/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	//关键字
	var key=$("#keyConditions").val();
	
	//日期
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	//项目
	if($("#houseProjectId").val()!= ""){
		$list_dataParam['houseProjectId'] = $("#houseProjectId").val();
	} else {
		delete $list_dataParam['houseProjectId'];
	}
	//状态
	
	if($("#status").val()!= ""){
		$list_dataParam['status'] = $("#status").val();
	} else {
		delete $list_dataParam['status'];
	}
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	
	//关键字
	if(key && ($('#keyConditions').attr("defaultValue") != key) && key!=$("#keyConditions").attr("defaultValue")){
		$list_dataParam['keyConditions'] = key;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
