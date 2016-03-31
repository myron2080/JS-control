$tree_container = "leftTree";
$tree_async_url = getPath()+"/basedata/param/simpleTreeData";
var $list_deleteUrl = getPath()+"/permission/jobPermission/delete";
var moduleId = '';
var ismoduleType = '';
$(document).ready(function(){
	
	$("#main").ligerLayout({leftWidth:300,allowLeftCollapse:true,allowLeftResize:true});

	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [               
            {display: '岗位编码', name: 'job.number', align: 'left', width: 80},
            {display: '岗位分类', name: 'job.jobCategory.name', align: 'left', width: 80},
            {display: '岗位名称', name: 'job.name', align: 'left', width: 120},       
            {display: '是否授权', name: 'job.id', align: 'left', width: 100,render:function(data){
            	if(data.id)return '<span style="color:red;">已授权</span>';
            	else return '未授权';
            	
            }},
            {display: '操作', name: 'operate', align: 'center', width: 80,render:function(data){
            	if(data.id) return '<a href="javascript:void(0)" onclick="deleteRow({id:\''+data.id+'\'})">删除</a>';
            	else return '<a href="javascript:void(0)" onclick="addPmRow({jobid:\''+data.job.id+'\',pmid:\''+data.permissionItem.id+'\'})">授权</a>';
              }
            }
        ],
        url:getPath()+'/permission/assgin/listData',
        delayLoad:true
    }));
	$("#toolBar").append(
			'<div style="padding:5px 5px 5px 5px;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'	<font style="float:left;padding-top:3px;">岗位：</font>	<input type="text" name="searchKeyWord" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="名称/编码" defaultValue="名称/编码" value="名称/编码" id="searchKeyWord" class="input"/>'
		    +'是否授权：<select id="isAccredit"><option value="">全部</option><option value="1">已授权</option><option value="0">未授权</option></select>'
		    +'		<li class="bluebtn btn"><a onclick="searchData();return false;" href="javascript:void(0)"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</a></li>'
	    	+'	</form>'
	    	+'</div>'
		);
	
});


function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		if(selectNodes[0].children==undefined){
			ismoduleType = 'FALSE';
		}else{
			ismoduleType = 'TRUE';
		}
		moduleId = selectNodes[0].id;
		initpermlist(1);
	}
}

function initpermlist(page){
	if(!page) page = 1;
	 
	var param = {};
	param.currentPage = page;
	var screenHeight = $(window).height();
	param.pageSize = Math.ceil((screenHeight-120)/25);
	param.moduleId = moduleId;
	param.ismoduleType = ismoduleType;
	if($("#pmsearchKeyWord").val()!=$("#pmsearchKeyWord").attr("defaultValue")){
	param.key = $("#pmsearchKeyWord").val();
	}
	$.post(getPath()+"/permission/assgin/listPmData",param,function(data){
		$("#permlistdiv").find("table").remove();
		if(data && data.items){
			var menuHtml = '<table style="border:sold 0;line-height: 25px;width:98%;">';
			
			for(var i=0;i<data.items.length;i++){
				var pi = data.items[i];
				menuHtml += ('<tr onclick="selectPerm(this)" style="cursor:pointer;border:1px solid #EFEFEF;" id="'+pi.id+'"><td>'+pi.name+'('+pi.number+') </td></tr>');
			}
			menuHtml += '</table>';
			$("#permlistdiv").append(menuHtml);
			
			selectPerm($("#permlistdiv").find("tr:eq(0)"));
			
			var total = Math.floor(data.count%data.pageSize==0?data.count/data.pageSize:data.count/data.pageSize+1);
			$("#pagediv").attr("currPage",page);//当前页
			$("#pagediv").attr("total",total);//总页数
			if(total && total>1){
				$("#pagediv").show();
			}else{
				$("#pagediv").hide();
			}
			
		}
	},'json');
}

function selectPerm(obj){
	$(".selectedTr").removeClass("selectedTr");
	$(obj).addClass("selectedTr");
	var objid = $(obj).attr("id");
	if(objid){
		$list_dataParam['permId'] = objid;
	}else{
		delete $list_dataParam['permId'];	
	}
	var searchKeyWord=$("#searchKeyWord").val();
	if(searchKeyWord && searchKeyWord!='名称/编码'){
		$list_dataParam['searchKeyWord'] = searchKeyWord;
	}else{
		delete $list_dataParam['searchKeyWord'];	
	}
	
	var isAccredit=$("#isAccredit").val();
	if(isAccredit){
		$list_dataParam['isAccredit'] = isAccredit;
	}else{
		delete $list_dataParam['isAccredit'];	
	}
	
	
	resetList();
	
}

function pagGetMenuData(id){
	var page = parseInt($("#pagediv").attr("currPage"));//当前页
	var count = parseInt($("#pagediv").attr("total"));//总页数
	if(id=="prev"){
		 
		initpermlist(page-1);
		$("#next").show();
		if(page==2){
			 $("#prev").hide();
		}else{
			$("#prev").show();
		}
		
	}else{
		
		initpermlist(page+1);
		$("#prev").show();
		if(page==(count-1)){
			 $("#next").hide();
		}else{
			$("#next").show();
		}
	}
}


function addPmRow(obj){
	$.post(getPath()+"/permission/jobPermission/saveJobPermission",{permissions:obj.pmid,job:obj.jobid},function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}