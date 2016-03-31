$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/org/simpleTreeData";
var $list_editUrl=getPath()+"/cmct/mobileMember/edit";
var $list_addUrl=getPath()+"/cmct/mobileMember/add";
var $list_editWidth="355px";
var $list_editHeight="102px";
var $list_deleteUrl=getPath()+"/cmct/mobileMember/delete";
$list_dataType="手机线路";
var parentWechatId="";
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:215,allowLeftCollapse:true,allowLeftResize:true});
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	$('#resetBtn').bind('click',function(){
		$('#status').val('');
		$('#key').val($('#key').attr("dValue"));
	});
	
//	$("#toolBar").ligerToolBar({
//		items:[{id:'add',text:'新增',click:addRow,icon:'add'}]
//	 });
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '部门', name: 'org.name', align: 'center', width: 120},
            {display: '工号', name: 'person.number', align: 'left', width: 80},
            {display: '姓名', name: 'person.name', align: 'center', width: 100},
            {display: '手机号', name: 'phoneNum', align: 'center', width:100},
            {display: '创建时间', name: 'createTime', align: 'center', width:120},
            {display: '开通状态', name: 'status.name', align: 'center',width:100},
            {display: '操作', name: '', align: 'center', width: 80,render:renderOprate}
        ],
        delayLoad:true,
        checkbox:true,
        url:getPath()+'/cmct/mobileMember/listData',
    }));
	searchData();
});

function batchOpen(){
	var recordes = $list_dataGrid.getSelectedRows();	
	var personIds = "";
	for(var i in recordes){
		if(recordes[i].status){
			if(recordes[i].status.value!="OPEN"){
				if(!personIds){
					personIds = recordes[i].person.id;
				}else{
					personIds += (","+ recordes[i].person.id);
				}
			}
		}else{
			if(!personIds){
				personIds = recordes[i].person.id;
			}else{
				personIds += (","+ recordes[i].person.id);
			}
		}
		
	};
	if(!personIds){
		art.dialog.tips("请勾选有效数据！",2);
		return ;
	}
	 art.dialog.confirm("确定批量开通吗?",function(){
			$.post(getPath()+'/cmct/mobileMember/batchOpen',{personIds:personIds},function(data){
				if(data.STATE=='SUCCESS'){
					art.dialog.tips(data.MSG);
					resetList();
				}else{
					art.dialog.alert(data.MSG);
				}
			},'json');
		});
}

function renderOprate(data){
	var str="";
//	str += '<a href=javascript:editRow({id:\''+data.id+'\'});>修改&nbsp;</a>'; 
//	str += '<a href=javascript:deleteRow({id:\''+data.id+'\'});>删除&nbsp;</a>';
	str +='<a href="javascript:status({dataId:\''+data.id+'\',personId:\''+data.person.id+'\'});">'+(data.status && data.status.value=="OPEN"?'关闭':'开通')+'</a>' 
	return str;
}

function status(data){
	$.post(getPath()+"/cmct/mobileMember/updateStatus",data,function(res){
		if(res.STATE=="SUCCESS"){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		$("#searchBtn").click();
     }
}); 

function searchData(){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	if(tree){
		var node = tree.getSelectedNodes();
		if(node!=null && node.length>0){
			$list_dataParam['longNumber'] = node[0].longNumber;
		}else{
			delete $list_dataParam['longNumber'];
		}
	}
	$list_dataParam['status']=$('#status').val();
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
//	$list_dataParam['orgId']=$('#orgId').val();
	resetList();
}

function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}
