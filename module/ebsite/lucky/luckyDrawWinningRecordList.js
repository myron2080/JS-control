//$list_editUrl = getPath() + "/ebsite/luckyrecord/edit";// 编辑及查看url
//$list_addUrl = getPath() + "/ebsite/luckyrecord/add";// 新增url
//$list_deleteUrl = getPath() + "/ebsite/luckyrecord/delete";// 删除url
$list_editWidth = "640px";
$list_editHeight = "200px";
$list_dataType = "抽奖";//数据名称
$(document).ready(function() {
			$("#main").ligerLayout({});
			$list_dataParam['status'] = status;
			resetList();
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [ {
							display : '账号',
							name : 'member.userName',
							align : 'center',
							width : 200,
							render:userName
						}, {
							display : '抽奖结果',
							name : 'luckyStatus',
							align : 'center',
							width : 200,
							render:luckyStatus
						}, {
							display : '抽奖时间',
							name : 'luckyDrawTime',
							align : 'center',
							width : 200,
						}, {
							display : '是否已领奖',
							name : 'status',
							align : 'center',
							width : 200,
							render:status
						}],					
						url : getPath() + '/ebsite/luckywinningrecord/listData',						
					}));
			
		});
function userName(data)
{
	
   return data.member.userName;

}

//根据状态界面上显示奖品以及数量
function luckyStatus(data)
{
	if(data.luckyStatus=="1")
	{	
	    return "奖品"+data.luckyDrawItem.name+"1个";	
	}
	else if(data.luckyStatus=="0")
	{
		return "谢谢参与";
	}
}

//在界面显示是否已经领奖
function status(data)
{
	if(data.status=="1")
	{
		return "已领奖"+data.receiveTime;	
	}
	else if(data.status=="0")
	{		
		return "未领奖";		
	}
}

