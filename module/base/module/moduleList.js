$tree_container = "leftTree";
$tree_async_url = getPath()+"/base/module/simpleTreeData";
$(document).ready(function(){
	var pcallowsize = $("#pcallowsize").val();
	var mobileallowsize = $("#mobileallowsize").val();
	var customerno = $("#customerno").val();
	var customername = $("#customername").val();
	var modulenum = $("#modulenum").val();
	var mobileonlineSize = $("#mobileonlineSize").val();
	var pconlinesize = $("#pconlinesize").val();
	var processId =  $("#processId").val(); 
	
	var toolbarary = [];
	/*toolbarary.push({id:'signature',text:('机器特征码:'+processId)});
	toolbarary.push({id:'add',text:'刷新许可信息',click:function(){
		$.post(getPath() + "/base/module/refreshLicense",{},function(res){
			if(res.STATE="SUCCESS"){
				art.dialog.tips("刷新成功");
				window.location.reload();
			}else{
				art.dialog.tips(res.MSG);
			}
		});
	},icon:'database'});*/
	$("#mobileonlineSize1").text(processId);
	$("#customerno1").text(customerno+' '+customername);
	if(modulenum>'0'){
		/*	toolbarary.push({id:'customerno',text:('客户号:'+customerno+' '+customername)});
			toolbarary.push({id:'modulelicense',text:('模块许可:'+modulenum+'模块')});
			toolbarary.push({id:'pcAddress',text:('台式终端许可:'+(pcallowsize=='9999'?'无限制':pcallowsize)+'(当前'+pconlinesize+')'),click:function(){
				//toPcAddressList();
			},icon:'attibutes'});
			toolbarary.push({id:'pcAddress',text:('手机终端许可:'+(mobileallowsize=='9999'?'无限制':mobileallowsize)+'(当前'+mobileonlineSize+')'),click:function(){
				//toPcAddressList();
			},icon:'attibutes'});*/
			
			$("#pcAddress").text((pcallowsize=='9999'?'无限制':pcallowsize)+'(当前'+pconlinesize+')');
			$("#pcAddress2").text((mobileallowsize=='9999'?'无限制':mobileallowsize)+'(当前'+mobileonlineSize+')');
			$("#modulelicense").text(modulenum+'模块');
			$("#license").show();
			$("#nolicense").hide();

			}else{
			//toolbarary.push({id:'nolicense',text:('没有找到当前服务器的使用许可,请联系鼎尖软件公司申请许可')});
				$("#license").hide();
				$("#nolicense").show();
		}
	$("#main").ligerLayout({leftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	/*$("#toolBar").ligerToolBar({
		items: toolbarary
	});*/
	initSimpleDataTree();
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
              {display: '操作', name: 'operate', align: 'center', width: 80,render:function(data){
              	if(data['status']!='FORBID'){
  	            	if(data['enable']==1){
  	            		return '<a href="javascript:void(0);" onclick="enableModula(\''+data['id']+'\',0);">关闭</a>';
  	            	}else{
  	            		return '<a href="javascript:void(0);" onclick="enableModula(\''+data['id']+'\',1);">启用</a>';
  	            	}
              	}
              }},      
            {display: '代号', name: 'number', align: 'left', width: 80},
            {display: '编码', name: 'type.number', align: 'left', width: 80},
            {display: '模块', name: 'type.name', align: 'left', width: 120},
            {display: '状态', name: '', align: 'left', width: 80,render:function(data){
            	var name = data['type.name'];
            	if(data['status']=='FORBID'){
            		
            		return '未购买 <img title="模块未获许可,请尽快购买此模块许可" src="'+getPath()+'/default/style/images/basedata/base/delete.gif"></img>';
            	}else if(data['status']=='ALLOW'||data['status']=='PERMANENT'||data['status']=='WARNING'){
            		return '已购买 <img title="模块己获许可,感谢您的使用" src="'+getPath()+'/default/style/images/basedata/base/right.gif"></img>';
            	}
            }},
            {display: '授权日期', name: 'end', align: 'right', width: 160,render:function(data){
            	if(data['status']=='PERMANENT') return '永久';
            	if(data['status']=='WARNING') return '<span style="color:red">'+data['start']+'到'+data['end']+'</span>';
            	else if(data['status']=='ALLOW') return data['start']+'到'+data['end'];
            	}
            },
            {display: '开启状态', name: 'enable', align: 'center', width: 60,render:function(data){
            	if(data['status']!='FORBID'){
            	if(data['enable']==1){
        			return '<span style="color:green">已开启</span>';
        		}else{
        			return '<span style="color:red">已关闭</span>';
        		}
            	}
            	
            }},         
            {display: '备注说明', name: 'remark', align: 'left', width: 300},
        ],
        url:getPath()+'/base/module/listData'
    }));
	
	$("#refreshbtn").click(function(){
		var curdata = $("#dataCenter").val();
		if(!curdata) return;
		$.post(getPath()+"/manager/refreshBaseConfig",{dataCenter:curdata},function(json){
			if(json.STATE=='FAIL'){
				art.dialog.tips(json.MSG);
        	}else{
        		art.dialog.tips("刷新成功");
				window.location.reload();
        		return;
        	}
		},'json');
	});
});

function enableModula(id,enable){
	art.dialog.confirm("确定"+(enable?"启用":"禁用"),function(){
		$.post(getPath()+"/base/module/enableModule",{id:id,enable:enable},function(res){
			if(res.STATE=='SUCCESS'){
				refresh();
			}else{
				art.dialog.tips(res.MSG);
			}
		},'json');
	});
}

function onTreeNodeClick(event, treeId, treeNode){
	searchData();
}

function searchData(){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	if(selectNodes.length>0){
		$list_dataParam['moduleType'] = selectNodes[0].id;
	}else{
		delete $list_dataParam['moduleType'];
	}
	resetList();
}

/**
 * 导入数据
 */
function toPcAddressList(){
	var dlg = art.dialog.open(getPath()+'/basedata/access/address/list',{
		 title:"终端许可",
		 lock:true,
		 width:'960px',
		 height:'550px',
		 id:"dgPcAddress",
		 ok:function(){
			 
		 },
		 okVal:'关闭'
	});
}
