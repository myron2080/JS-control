$list_addUrl = getPath()+"/basedata/application/address/add";//新增url
$list_editWidth = "560px";
$list_editHeight = "250px";
$list_dataType = "终端申请";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$("#toolBar").ligerToolBar();
	$("#toolBar").append(
			'<div style="float:left;padding-left:5px;display:inline;">'	
	    	+'  <select name="select2" id="select2" style="width:185px;" onchange="selectList(this)">'
			 +'   <option value="ALL">全部</option>'
			 +'   <option value="SAVE" selected="selected">已提交</option>'
			 +'   <option value="APPROVED">已审批</option>'
			 +'   <option value="REJECT">已驳回</option>'
			 +'	 </select>'
			 +'</div>'
			+'<div style="float:left;padding-left:5px;display:inline;">'
	    	+'	<form onsubmit="searchData();return false;">'	
		    +'		<input type="text" name="searchKeyWord" style="width:185px;" onfocus="if(this.value==this.defaultValue){this.value=\'\';}" onblur="if(this.value==\'\'){this.value=this.defaultValue;}" title="----------识别码--------" defaultValue="----------识别码--------" value="----------识别码--------" id="searchKeyWord" class="input"/>'
		    +'		<li class="bluebtn btn"><a href="javascript:void(0)"><span onclick="searchData();return false;"><img src='+getPath()+'/default/style/images/common/common_search.png />查询</span></a></li>'
	    	+'	</form>'
	    	+'</div>'
		);
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '识别码', name: 'mac', align: 'left', width: 120},
            {display: '提交时间', name: 'aplTime', align: 'left', width: 120},
            {display: '审批状态', name: 'status.label', align: 'left', width: 120,render:status},
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender}
        ],
        url:getPath()+'/basedata/application/address/listData',
        delayLoad:true    //让列表第一次不加载 
    }));     
	
	selectList($('#select2')[0]);
	
});
function status(data,fiterData){
	switch(data.status){
		case 'SAVE':return '已提交';
		case 'APPROVED':return '已审批';
		case 'REJECT':return '已驳回';
		default:return null;
	}
}
function operateRender(data,filterData){
	if(data.status=="SAVE"){
		return '<a href="javascript:addMac(\''+data.id+'\');">同意</a>|'
		+'<a href="javascript:reject(\''+data.id+'\');">拒绝</a>';
	}else{
		return null;
	}
}
/**
 *	审批同意,添加MacAddress对象
 * @param id
 */
function addMac(id){
	/*art.dialog.prompt('输入随机码:',function(val){
			$.post($list_addUrl,{id:id,val:val},function(res){
				if(res.STATE=="SUCCESS"){
					art.dialog.tips(res.MSG,null,"succeed");
					refresh();
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
			return true;
	});*/

		var flag = true;
		var dlg = art.dialog.open($list_addUrl+"?id="+id,
				{title:'审批',
				 lock:true,
				 width:$list_editWidth||'auto',
				 height:$list_editHeight||'auto',
				 id:$list_dataType+"-ADD",
				 button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
							dlg.iframe.contentWindow.saveAdd(this);
						}
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				 close:function(){
					 if(flag){
						 resetList();
					 }
				 }
				}); 
	
}
/**
 * 拒绝的请求
 * @param id
 */
function reject(id){
	art.dialog.confirm('确定拒绝该请求吗?',function(){
		$.post(getPath() + '/basedata/application/address/reject',{id:id},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				refresh();
			}
		},'json');
	});
}
/************************
 * 根据审批状态查询数据
 * **********************
 */
function selectList(choose){
	var status = choose.options[choose.selectedIndex].value;
	if(status=="ALL"){
		$list_dataParam['status'] = '';
	}else{
		$list_dataParam['status'] = status;
	}
	delete $list_dataParam['key'];
	resetList();
}