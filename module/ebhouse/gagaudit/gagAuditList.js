$list_editWidth = "540px";
$list_editHeight = "auto";
$(document).ready(function(){
	$("#main").ligerLayout({});
	params1 ={};
	params1.inputTitle = "建议时间";	
	MenuManager.common.create("DateRangeMenu","dealDate",params1);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '建议标题', name: 'titleText', align: 'left', width: 300},
            {display: '昵称', name: 'nickname', align: 'left', width: 160},
            {display: '建议人', name: 'userName', align: 'left', width: 100},
            {display: '所属公司', name: 'companyName', align: 'left', width: 320},
            {display: '建议时间', name: 'createTime', align: 'center', width: 150},
            {display: '状态', name: 'isCollection', align: 'center', width: 80,render:stateRender},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
//        parms:{webSite:$('#webSites').val()},
        url:getPath()+'/ebhouse/gagaudit/listData'
    }));
});
function stateRender(data,filterData){
	if(data.isCollection=="1"){
		return '已收藏';
	}else{
		return '未收藏';
	}
	
}
function operateRender(data,filterData){
	//根据收藏情况传递参数
	if(data.isCollection=="1"){
		return '<a href="javascript:setCollection(\''+data.id+'\',0);">取消收藏</a>';
	}else{
		return '<a href="javascript:setCollection(\''+data.id+'\',1);">收藏</a>';
	}
		
}
//搜索方法
function searchData(){
	var isCollection = $('#isCollection').val();
	var userAndTitle = $('#userAndTitle').val();
	$list_dataParam['isCollection'] = isCollection;
	if(userAndTitle!='建议人/建议标题'){
		$list_dataParam['userAndTitle'] = userAndTitle;
	}else{
		$list_dataParam['userAndTitle'] = '';
	}
	if(MenuManager.menus["dealDate"]){
		$list_dataParam['startdate'] = MenuManager.menus["dealDate"].getValue().timeStartValue;
		$list_dataParam['enddate'] = MenuManager.menus["dealDate"].getValue().timeEndValue;
	}
	resetList();
}
//修改收藏状态
function setCollection(id,isCollection){
	var param ={};
	param.id = id;
	param.isCollection = isCollection;
	$.post(getPath()+"/ebhouse/gagaudit/update",param,function(res){
		resetList();
	},"json");
}

function clearSearch(){
	$("#isCollection option:first").prop("selected", 'selected');
	$("#userAndTitle").val($("#userAndTitle").attr("defaultValue"));
}
