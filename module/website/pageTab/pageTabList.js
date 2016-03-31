$list_addUrl = getPath()+"/website/pageTab/add";//新增url
$list_editUrl = getPath()+"/website/pageTab/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/website/pageTab/delete";//删除url
$list_editWidth = "652px";
$list_editHeight = "280px";
$list_dataType = "页签列表";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(function(){
	//新增按钮
	$("#toAddBtn").bind("click",function(){
		addRow();
	});
	//清空按钮
	$("#resetBtn").bind("click",function(){
		$("#key").val($("#key").attr("defaultValue"));
		$('#pageTabType').val("");
		searchData();
	});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'left', width: 180,render:function(data){
            	var result = 
            		"<a style=\"color:blue\" href=\"javascript:editRow({id:'"+(data.id)+"'})\">编辑</a>"
            	   +" | <a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除 </a>"
            	   +" | <a style=\"color:red\" href=\"javascript:void(0)\">静态化 </a>";
            	return result;
            }},
            {display: '编码', name: 'number', align: 'center', width: 200},
            {display: '中文名称', name: 'name', align: 'center', width: 85},
            {display: '英文名称', name: 'simplePinyin', align: 'center', width: 120},
            {display: '页面类型', name: 'pageTabTypeName', align: 'center', width: 120},
            {display: '序号', name: 'sort', align: 'center', width: 150},
            {display: '关键字', name: 'key', align: 'center', width: 260},
            {display: '描述', name: 'description', align: 'center', width: 260}
        ],
        checkbox:false,
        delayLoad:true,
        url:getPath()+'/website/pageTab/listData'
       
    }));
	
	$("#key").bind('keyup', function(event) {
		if (event.keyCode == 13){
			searchData();
		}
	});
	
	$('#tab li').bind('click',function(){
		$(this).addClass("hover").siblings().removeClass("hover");
		searchData();
	});
	searchData();
});


function searchData(){
	var kw = $('#key').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#key').val(kw);
	if(kw==$('#key').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['key'];
	}else{
		$list_dataParam['key'] = kw;
	}
	var type = $('#pageTabType').val().trim();
	if(type==null || type==''){
		delete $list_dataParam['type'];
	}else{
		$list_dataParam['type'] = type;
	}
	resetList();
}
