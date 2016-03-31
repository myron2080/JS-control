$list_editUrl = getPath()+"/djWorkflow/signDefi/edit";//编辑及查看url
$list_addUrl = getPath()+"/djWorkflow/signDefi/add";//新增url
$list_configureUrl= getPath()+"/djWorkflow/signDefi/proDefin";//流程配置
$list_noteSetUrl= getPath()+"/djworkflow/nodeDefi/list";//节点设置
$list_editWidth = "550px";
$list_editHeight = "240px";
$list_dataType = "会签流程";//数据名称
$(document).ready(function(){
	
	$("#toolBar").ligerToolBar({
		  items:[{id:'add',text:'添加分类',click:addRow,icon:'add'}]
	});
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '操作', name: '', width: 100,height:40,render:operate},
		            {display: '编码', name: 'number', align: 'left', width: 100,height:40},
		            {display: '会签分类', name: 'name', align: 'left', width: 120,height:40},
		            {display: '允许发起部门', name: 'orgNames', align: 'left', width: 120,height:40,render:function(data){
		            	return "<font title='"+data.orgNames+"'>"+data.orgNames+"</font>";
		            }},
		            {display: '允许发起岗位', name: 'jobNames', align: 'left', width: 120,height:40,render:function(data){
		            	return "<font title='"+data.jobNames+"'>"+data.jobNames+"</font>";
		            }},
		            {display: '分类描述', name: 'description', align: 'left', width: 180,height:40},
		           /* {display: '版本号', name: 'version', align: 'right', width: 50},
		            {display: '流程资源', name: 'resourceName', align: 'left', width: 150,render:function(data){
		            	return '<a href="javascript:void(0)" onclick="viewResource(\''+data.deploymentId+'\',\'xml\')">'+data['resourceName']+'</a>';
		            }},
		            {display: '流程图', name: 'diagramResourceName', align: 'left', width: 150,render:function(data){
		            	return '<a href="javascript:void(0)" onclick="viewResource(\''+data.deploymentId+'\',\'image\')">'+data['diagramResourceName']+'</a>';
		            }},*/
		            {display: '使用流程', name: 'djProcessDefinition.name', width: 100,height:40,render:getProcessName},
		            {display: '流程配置', name: '', width: 150,height:40,render:operateConfig}
		        ],
        delayLoad:false,
        url:getPath()+'/djWorkflow/signDefi/listData'
    }));
});

function operateConfig(data){
	var str='<a href="javascript:configure({id:\''+data.id+'\'});">配置</a>';
	if(data.processModel!=null && data.processModel=='DINGJIAN' && data.djProcessDefinition.isDIY!=1){
		  str +='|<a href="javascript:noteSet({id:\''+data.djProcessDefinition.id+'\'});">节点设置</a>';
		  str +='|<a href="javascript:nodeCopy({id:\''+data.djProcessDefinition.id+'\'});">节点复制</a>';
	}
  return str;
}
function viewResource(id,type){
	if(type == 'image'){
		art.dialog.open(getPath()+"/workflow/repository/resource?id="+id+"&type="+type,{
			title:'流程资源',
			lock:true,
			width:"800px",
			height:"560px",
			id:"definitionResource",
			button:[
			        {
			        	name:'关闭'
			        }
			]
		});
	}else{
		window.open('','_self'); 
		var newWin = window.open(getPath()+"/workflow/repository/resource?id="+id+"&type="+type,'流程资源','top=0,left=0,scrollbars=no,resizable=no,toolbar=no,location=no');
		var width = '800px';
		var height = '600px';
		newWin.resizeTo(width,height);
		newWin.focus();
	}
}

function getProcessName(data){
	if(data.processModel=='DINGJIAN'){
		return '鼎尖流程';
	}else if(data.processModel=='ACTIVITY'){
		return 'Activity流程';
	}
	return "无流程";
}

function operate(data){
	var str='<a href="javascript:editRow({id:\''+data.id+'\'});">编辑</a>'; 
    str+='|<a href="javascript:deleteProcess({id:\''+data.id+'\'});">删除</a>';
	return str;
}

function deleteProcess(data){
	artDialog.confirm("确定删除该流程配置吗？",function(){ 
		$.post(getPath()+'/djWorkflow/signDefi/delete',data,function(data){
			if(data && data.STATE == 'SUCCESS'){
				art.dialog.tips(data.MSG);
				refresh();
			}else {
				art.dialog.tips(data.MSG);
			}
		},'json');
	});
}

function nodeCopy(data){
	 
	art.dialog({
	    content: $("#nodeCopy")[0], 
	    ok: function () {
	    	var targetProcess=$("#targetProcess").val();
	    	if(targetProcess==null || targetProcess==''){
	    		art.dialog.tips("请选择目标流程！");
	    		return false;
	    	}else if(data.id==targetProcess){
	    		art.dialog.tips("不能拷贝到原流程！");
	    		return false;
	    	}else{
    			$.post(getPath()+'/djworkflow/nodeDefi/nodeCopy',{resProcessId:data.id,targetProcessId:targetProcess},function(data){
    				if(data && data.STATE == 'SUCCESS'){
    					art.dialog.alert(data.MSG);
    					refresh();
    				}else {
    					art.dialog.alert(data.MSG);
    				}
    				 
    			},'json');
	    	}
	    },
	    cancelVal: '关闭',
	    cancel: true //为true等价于function(){}
	});
}

function configure(data){
	var flag=true;
	var dlg = art.dialog.open($list_configureUrl+"?id="+data.id,
			{title:"流程配置",
			 lock:true,
			 width:"500px",
			 height:"250px",
			 id:'processConfigure',
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
					 if(typeof(afterAddRow)=='function'){
						 afterAddRow();
					 }
					 resetList();
				 }
			 }
			});
}

function noteSet(data){
	var flag=true;
	var dlg = art.dialog.open($list_noteSetUrl+"?processId="+data.id+"&processType=SIGN",
			{title:"节点设置",
			 lock:true,
			 width:"800px",
			 height:"400px",
			 id:'processNoteSet',
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
					 if(typeof(afterAddRow)=='function'){
						 afterAddRow();
					 }
					 resetList();
				 }
			 }
			});
}
