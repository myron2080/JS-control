$list_editUrl = getPath()+"/cmct/ucsPhoneAgent/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/ucsPhoneAgent/add";//新增url
$list_deleteUrl = getPath()+"/cmct/ucsPhoneAgent/delete";//删除url
$list_editWidth = "570px";
$list_editHeight = "180px";
$list_dataType = "企业用户";//数据名称
var map={0:'管理员',1:'代理',2:'机构',3:'散户',4:'坐席',5:'班长',6:'财务角色',7:'维护员角色',8:'审核员角色'};
$(document).ready(function(){
	
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'开户',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '企业名称', name: 'agentName', align: 'left', width: 120,height:40},
		            {display: '企业id', name: 'agentId', align: 'left', width: 120,height:40},
		            {display: '创建人', name: 'creator.name', align: 'left', width: 120,height:40},
		           // {display: '登录密码', name: 'passwd', align: 'left', width: 80,height:40},
		            {display: '所属上级', name: 'parentAgent', align: 'left', width: 80,height:40},
		            {display: '创建时间', name: 'createTime', align: 'left', width: 120,height:40},
		            {display: '代理类型', name: 'dealerType', align: 'left', width: 100,height:40,render:getName},
		            {display: '联系电话', name: 'telNo', align: 'left', width: 100,height:40},
		            {display: '操作', name: '', align: 'center', width: 160,render:operateRender}
		        ],
        delayLoad:false,
        url:getPath()+'/cmct/ucsPhoneAgent/listData'
    }));
});

function getName(record, rowindex, value, column){
	return map[value];
}

function operateRender(data,filterData){
	var str='';
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|';
	str+='<a href="javascript:deleteAgentRow({id:\''+data.id+'\'});">删除</a>';
	return str;
}

/**
 * 删除企业用户或则经销商
 * @param rowData
 */
function deleteAgentRow(rowData){
		 art.dialog.confirm('确定删除该行数据,同时将删除该企业下的所有坐席?',function(){
			$.post(getPath()+"/cmct/ucsPhoneAgent/delete",{id:rowData.id},function(res){
				art.dialog.tips(res.MSG);
				if(res.STATE=='SUCCESS'){
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}
			},'json');
		});
}