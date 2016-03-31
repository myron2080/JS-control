$list_editUrl = getPath()+"/permission/menu/edit";//编辑及查看url
$list_addUrl = getPath()+"/permission/menu/add";//新增url
$list_deleteUrl = getPath()+"/permission/menu/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "320px";
$list_dataType = "菜单";//数据名称
var sqlid = '';
var selmodule = '';
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	initMenuData(1);
	$("#toolBar").ligerToolBar({
		items:[{id:'add',text:'批量静态化',click:staticbatch,icon:'config'},{id:'static',text:'静态化首页',click:statichome,icon:'config'}
		]
		});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '名称', name: 'name', align: 'left', width: 80},
            {display: '创建时间', name: 'createTime', align: 'left', width: 80},
            {display: '是否静态化', name: 'id', align: 'left', width: 80,render:viewRender},
            {display: '静态化时间', name: 'staticTime', align: 'left', width: 80},
            {display: '静态化路径', name: 'staticUrl', align: 'left', width: 300},
            {display: '操作', name: 'operate', align: 'center', width: 140,render:operateRender}
        ],
        url:getPath()+'/ebhouse/staticManage/listRecordData',
        delayLoad:true,
        checkbox:true
    }));
	
});

function viewRender(data,filterData){
	if(data.id){
		return "已静态化";
	}else{
		return "未静态化";
	}
}

function operateRender(data,filterData){
	var opeStr =  '<a href="javascript:staticRow({id:\''+data.id+'\',module:\''+data.module+'\',recordid:\''+data.recordId+'\'});">静态化</a> ';
	
	return opeStr;
}

function statichome(){
	Loading.init();
	$.post(base+"/ebhouse/staticManage/staticindex",{},function(data){		
		Loading.close();
		if(data.STATE=='FAIL'){
			art.dialog.alert(data.MSG);
		}else{
			art.dialog.tips("操作成功");
		}
		
	},'json');
}

function staticbatch(){
	
	var selary = $list_dataGrid.getSelectedRows();
	if(selary.length<=0) {art.dialog.tips("请选择数据");return;}
	Loading.init();
	var ids = '';
	for(var i=0;i<selary.length;i++){
		ids += selary[i].recordId + ',';
	}
	var obj = {};
	obj.recordid = ids;
	obj.module = selmodule;
	$.post(base+"/ebhouse/staticManage/staticRecordData",obj,function(data){		
		Loading.close();
		if(data.STATE=='FAIL'){
			art.dialog.alert(data.MSG);
		}else{
			art.dialog.tips("操作成功");
			resetList();
		}
		
	},'json');
}

function staticRow(obj){
	Loading.init();
	$.post(base+"/ebhouse/staticManage/staticRecordData",obj,function(data){		
		Loading.close();
		if(data.STATE=='FAIL'){
			art.dialog.alert(data.MSG);
		}else{
			art.dialog.tips("操作成功");
			resetList();
		}
		
	},'json');
}
 
function searchData(){
	$list_dataParam['sqlid'] = sqlid; 
	resetList();
}


function pagGetMenuData(id){
	var page = parseInt($("#pagediv").attr("currPage"));//当前页
	var count = parseInt($("#pagediv").attr("total"));//总页数
	if(id=="prev"){
		 
		initMenuData(page-1);
		$("#next").show();
		if(page==2){
			 $("#prev").hide();
		}else{
			$("#prev").show();
		}
		
	}else{
		
		initMenuData(page+1);
		$("#prev").show();
		if(page==(count-1)){
			 $("#next").hide();
		}else{
			$("#next").show();
		}
	}
}

function selectMenu(obj){
	
	sqlid = $(obj).attr("sqlid");
	selmodule = $(obj).attr("module");
	$(obj).addClass("selectedTr").siblings("tr").removeClass("selectedTr");
	searchData();
}


function initMenuData(page){
	if(!page) page = 1;
	 
	var param = {};
	param.currentPage = page;
	var screenHeight = $(window).height();
	param.pageSize = Math.ceil((screenHeight-120)/25);
	$.post(getPath()+"/ebhouse/staticManage/listData",param,function(data){ 
		 
		$("#menuL1ListDiv").html('');
		if(data && data.items){
			var menuHtml = '<table style="border:sold 0;line-height: 25px;width:98%;">';
			for(var i=0;i<data.items.length;i++){
				var menu = data.items[i];

				menuHtml += ('<tr onclick="selectMenu(this)" style="cursor:pointer;" module="'+menu.module+'" sqlid="'+menu.sqlid+'" id="'+menu.id+'"><td>'+menu.name+'('+menu.module+') </td></tr>');
			}
			menuHtml += '</table>';
			var total = Math.floor(data.count%data.pageSize==0?data.count/data.pageSize:data.count/data.pageSize+1);
			$("#pagediv").attr("currPage",page);//当前页
			$("#pagediv").attr("total",total);//总页数
			if(total && total>1){
				$("#pagediv").show();
			}else{
				$("#pagediv").hide();
			}
			$("#menuL1ListDiv").html(menuHtml);
			
			$("#menuL1ListDiv").find("table tr")[0].click();
		}
		
	},'json');
}



 