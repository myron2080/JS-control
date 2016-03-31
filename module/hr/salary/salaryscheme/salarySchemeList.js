//$list_editUrl = getPath()+"/basedata/org/edit";//编辑及查看url
//$list_addUrl = getPath()+"/basedata/org/add";//新增url
//$list_deleteUrl = getPath()+"/basedata/org/delete";//删除url
$list_editWidth = "500px";
$list_editHeight = "200px";
$list_dataType = "组织";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:250,allowLeftCollapse:true,allowLeftResize:true});
	$list_defaultGridParam.pageSize=15;
	var items = [
			       {id:'add',text:'新增',click:addRow,icon:'add'}
				];
	$("#toolBar").ligerToolBar({
		items:items
		});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [
            {display: '名称', name: 'name', align: 'left',width: "15%"},
            {display: '状态', name: 'state', align: 'left',width: "5%",render:function(data){
            	return data.state==1?"启用":"禁用";
            }},
            {display: '所属组织', name: 'orgName', align: 'left',width: "20%"},
            {display: '包含岗位', name: 'positionName', align: 'left',width: "20%"},
            {display: '描述', name: 'description', align: 'left',width: "25%"},
            {display: '操作', name: 'operate', align: 'center',width: "10%",render:operateRender}
        ],
        checkbox:false,
        fixedCellHeight:true,
        url:base+"/hr/salaryScheme/listData",
        pageSize:15,
        pageSizeOptions:[10,15,20,30],
        onAfterShowData:function (data){
        	
        }
    }));
	$('#includeContainer').bind('click',searchData);
});

function operateRender(data,filterData){
	
		return '<a href="javascript:void(0);" onclick="editRow(\''+data.id+'\')">修改</a>&nbsp;&nbsp;<a href="javascript:void(0);" onclick="update(\''+data.id+'\','+(data.state==1?0:1)+')">'+(data.state==1?'禁用':'启用')+'</a>';
			
}

function update(id,state){
	$.post(base+"/hr/salaryScheme/updateState",{id:id,state:state},function(res){
		if(res.STATE=="SUCCESS"){
			searchData();
		}else{
			art.dialog.tips("操作失败");
		}
	},'json');
}

function searchData(){
	
	$list_dataParam["searchKey"] = $("#searchKey").val()=="名称"?'':$("#searchKey").val();
	resetList();
}


function editRow(id){
	var $list_editUrl =  base+"/hr/salaryScheme/edit?id="+id;
	var flag = true;
	var dlg = art.dialog.open($list_editUrl,
			{title:"编辑薪酬方案",
			 lock:true,
			 width:800||'auto',
			 height:520||'auto',
			 id:"薪酬方案-EDIT",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}],
			 close:function(){
				 searchData();
			 }
			});
}

function addRow(){
	var $list_addUrl =  base+"/hr/salaryScheme/add";
	var flag = true;
	var dlg = art.dialog.open($list_addUrl,
			{title:"新增薪酬方案",
			 lock:true,
			 width:800||'auto',
			 height:520||'auto',
			 id:"薪酬方案-ADD",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					return true;
				}}],
			 close:function(){
				 searchData(); 
			 }
			});
}
