$list_editUrl = getPath()+"/website/apply/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/website/apply/delete";//删除url
$list_editWidth = "652px";
$list_editHeight = "280px";
$list_dataType = "报名列表";//数据名称
$list_hr_approve = false;//是审批界面
var true_count=0;
$(function(){
	//清空按钮
	$("#resetBtn").bind("click",function(){
		$("#key").val($("#key").attr("defaultValue"));
		searchData();
	});
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: '', align: 'center', width: 100,render:function(data){
            	return "<a style=\"color:red\" href=\"javascript:deleteRow({id:'"+(data.id)+"'})\">删除 </a>";
            }},
            {display: '项目名字', name: 'projectName', align: 'center', width: 200},
            {display: '联系人名字', name: 'name', align: 'center', width: 85},
            {display: '手机号码', name: 'phone', align: 'center', width: 120},
            {display: '邮箱', name: 'email', align: 'center', width: 120},
            {display: 'QQ', name: 'qq', align: 'center', width: 120},
            {display: '备注信息', name: 'remark', align: 'center', width: 320},
            {display: '报名时间', name: 'createTime', align: 'center', width: 120},
            {display: '状态', name: 'applyStatus', align: 'center', width: 120,render:function (data){
				if (data.applyStatus == 'NO') {
					return "未受理";
				} else if (data.applyStatus == 'YES') {
					return "已受理";
				} 
			}}
        ],
        checkbox:false,
        delayLoad:true,
        url:getPath()+'/website/apply/listData'
       
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
	resetList();
}
