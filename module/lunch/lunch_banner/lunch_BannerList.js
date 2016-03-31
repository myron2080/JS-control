/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/lunch/banner/list';
$list_editUrl = getPath()+'/lunch/banner/edit';
$list_addUrl = getPath()+'/lunch/banner/add';
$list_deleteUrl = getPath()+'/lunch/banner/delete';
$list_saveUrl = getPath()+'/lunch/banner/save';
$list_editWidth = "500px";
$list_editHeight = "320px";
$list_dataType = "banner";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
            {display: '操作', name: 'operate', align: 'center', width: 150,render:operateRender},
            {display: '标题', name: 'title', align: 'center', width:100},
			{display: '路径', name: 'picPath', align: 'center', width:100},
			{display: '顺序', name: 'sortNum', align: 'center', width:100},
			{display: '状态', name: 'eanble', align: 'center', width:60},
			{display: '跳转链接', name: 'url', align: 'center', width:200}
      			
        ],
        url:getPath()+"/lunch/banner/listData"
    }));
	inputEnterSearch("keyWord",selectList);


	$("#serchBtn").click(function(){
		selectList();
	});
	
	//新增
	$("#add").click(function(){
		beforeAddRow();
	});
});

function beforeAddRow(){
	addRow({});
}
function clearInput(){
	$("#keyWord").val($("#keyWord").attr("defaultValue"));
	selectList();
}
/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var enable = data.eanable;
	var str='';
	if(data.eanble =="1"){
		str+='<a href="javascript:changeStatus({id:\''+data.id+'\',eanble:\'0\'});">禁用</a>';
	}else{
		str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
		str+=' | <a href="javascript:changeStatus({id:\''+data.id+'\',eanble:\'1\'});">启用</a>';
		str+=' | <a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	}
	return str;	
}


function changeStatus(data){
	//alert(data.enable);
	art.dialog.confirm('确定操作吗?', function() {
		$.post(getPath()+"/lunch/banner/enable",data,function(res){
			if(res.STATE=="SUCCESS"){
				 art.dialog.tips(res.MSG);
			}else{
				 art.dialog.tips(res.MSG);
			}
			selectList();
		});
		return true;
	}, function() {
		return true;
	});
	
	
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



