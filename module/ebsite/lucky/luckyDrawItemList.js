$list_editUrl = getPath() + "/ebsite/luckDrawItem/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/luckDrawItem/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/luckDrawItem/delete";// 删除url
$list_editWidth = "450px";
$list_editHeight = "300px";
$list_dataType = "奖品设置";//数据名称
$(document).ready(function() {
			$("#main").ligerLayout({});
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns: [ 
						            {display: '操作', name: 'operate', align: 'center', width: 100,render:operateRender},
						            {display: '奖品名称', name: 'name', align: 'center', width:200},
									{display: '奖品数量', name: 'pCount', align: 'center', width:80},
									{display: '中奖率',name: 'luckyRate', align: 'center', width:130},
									{display: '是否谢谢参与', name: 'status', align: 'center', width:100,render:renderStatus}
						        ],
						url : getPath() + '/ebsite/luckDrawItem/listData?actId='+$("#luckyDrawId").val(),						
					}));
		});
//操作
function operateRender(data, filterData) {
	var str ="";
	str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a> | ';
	str +='<a href="javascript:deleteRow({id:\''+ data.id + '\'});">删除</a>';
	return str;
}
//状态
function renderStatus(data){
	if(data.status == "0"){
		return "否";
	} else if(data.status == "1"){
		return "<span style='color:red'>是</span>";
	}
}


