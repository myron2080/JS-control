$list_addUrl = getPath()+'/ebsite/hotWord/add';
$list_editUrl = getPath()+'/ebsite/hotWord/edit';
$list_deleteUrl = getPath()+'/ebsite/hotWord/delete';

$list_editWidth = "500px";
$list_editHeight = "350px";
$(document).ready(function() {
	//数据列表
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 130,render:operateRender},
            {display: '名称', name: 'wordName', align: 'left', width:'200'},
			{display: '状态', name: 'statusName', align: 'center', width:80},
			{display: '创建人',name: 'creator.name', align: 'center', width:130},
			{display: '创建日期', name: 'createTime', align: 'center', width:150},
			{display: '备注', name: 'notes', align: 'center', width:150},
			
        ],
        url: getPath()+"/ebsite/hotWord/listData"
    }));
	
	
	$("#serchBtn").click(function(){
		  selectList();
		});
	
	var params ={};
	params.width = 260;
	params.inputTitle = "创建日期";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
	
	//回车事件
	$('#keyWord').on('keyup', function(event) {
        if (event.keyCode == "13") {
        	 selectList();
        }
    });
});


//操作
function operateRender(data){
	var resLink='';
// 标记：启用； 禁用可以编辑,删除
	if (data.status == "ENABLE") 
		 {
		resLink+= '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'DISABLE\'});">禁用</a>';
	} else if (data.status == "DISABLE") {
		resLink+= '<a href="javascript:onOff({id:\'' + data.id + '\',status:\'ENABLE\'});">启用</a>';
		if(edit == "Y"){
			resLink+= '| <a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a> ';
		}
		if(del == "Y"){
			resLink+= '|<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
		}
    }
	return resLink;
	
}
	/**
	 * 启用禁用；status
	 * 
	 * @param data
	 * @returns
	 */
	function onOff(data) {
		if (data.status == "ENABLE") {
			art.dialog.confirm('确定启用操作吗?', function() {
				$.post(getPath() + '/ebsite/hotWord/onOff', {
					id : data.id,
					status :"ENABLE"
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
		} else if (data.status == "DISABLE") {
			art.dialog.confirm('确定禁用操作吗?', function() {
				$.post(getPath() + '/ebsite/hotWord/onOff', {
					id : data.id,
        			status :"DISABLE"
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
	}
	/**
	 * 状态显示方法
	 * 
	 * @param data
	 * @returns {String}
	 */
function status(data) {
		if (data.status == "ENABLE") {
			return '启用';
		} else if (data.status == "DISABLE") {
			return '<span style="color:red">禁用</span';
		} 
	}
	
	function editRow(data){
		var u = getPath()+"/ebsite/hotWord/edit";
	    var paramStr = '?id='+data.id;
		var flag = true;
		var dlg = art.dialog.open(u+paramStr,
			{title:"热词编辑",
			 lock:true,
			 width:'700px',
			 height:'300px',
			 id:"HOTWORD-EDIT",
			 button:[{name:'确定',callback:function(){
				    
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
					 selectList();
				 }
			 }
			});
	}

	

//查询
function  selectList(){
	//提醒时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
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
	var status = $("#status").val();
	if(status){
		$list_dataParam['status'] = status;
	} else{
		delete $list_dataParam['status'];
	}
	var keyWord= $("#keyWord").val().trim();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}
//清空
function onEmpty(){
	MenuManager.menus["createTime"].resetAll();
	delete $list_dataParam['keyWord'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	selectList();
	
}