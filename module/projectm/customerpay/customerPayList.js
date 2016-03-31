$list_editUrl = getPath()+"/projectm/customerpay/edit?pageType=list";//编辑及查看url
$list_addUrl = getPath()+"/projectm/customerpay/add?pageType=list";//新增收款url
$list_deleteUrl = getPath()+"/projectm/customerpay/delete";//删除url
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/customer/simpleTreeData";
$list_editWidth = 580;
$list_editHeight = 260;
$list_dataType = "客户收付管理";
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "280px";//界面高度
$tree_dataType = "客户类型";//数据名称

$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	initSimpleDataTree();
	var columnsParam=[ 
                    {display: '收付日期', name: 'payDate', align: 'center', width: 90, isSort:false},
                    {display: '客户名称', name: 'customer.name', align: 'left', width: 100, isSort:false},
	                {display: '收支备注', name: 'payDesc', align: 'left',  width: 360, isSort:false},
	                {display: '收款金额', name: 'balance', align: 'right',  width: 80, isSort:false,
	                	render: function (item)
	                     {
	                         if (item.type == 'RECEIVE') return item.balance;
	                         return "";
	                     }
	                },
	                {display: '消费', name: 'balance', align: 'right',  width: 80, isSort:false, 
	                		render: function (item)
        	                     {
        	                         if (item.type == 'PAY') return "<font color='red'>" + item.balance + "</font>";
        	                         return "";
        	                     }
	                },
	                {display: '余额', name: 'currentBalance', align: 'right',  width: 80, isSort:false},
	                {display: '操作', align: 'center',  width: 40, isSort:false,render: function (item){
	                        if(item.allowDelete == 1){
	                        	return "<a  style='cursor:pointer;' onclick=\"javascript:deleteRow({id:'"+item.id+"'});\">删除</a>";
	                        }
	                	}
	                }
	               ];
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        enabledSort:true,
        delayLoad:true,
        url:getPath() + '/projectm/customerpay/listData',
    }));
	
	//新增收款链接处理
	$("#customerPay_receive").click(function() {
		addDlg('RECEIVE');
	});
	
	//新增消费链接处理
	$("#customerPay_pay").click(function() {
		addDlg('PAY');
	});
	/************区间查询参数******************/
	params ={};
	params.inputTitle = "收付时间";	
	MenuManager.common.create("DateRangeMenu","createTime",params);
});

function addDlg(type){
	var tree = $.fn.zTree.getZTreeObj("leftTree");
	var selectNodes = tree.getSelectedNodes();
	var selectNodeName = selectNodes[0].name;
	var selectNodeId = selectNodes[0].id;
	
	var dlg = art.dialog.open(getPath()+"/projectm/customerpay/add?VIEWSTATE=ADD&type="+type+"&selectNodeName=" + selectNodeName + "&selectNodeId=" + selectNodeId,{
		title:(type == 'PAY'?'新增消费':'新增收款'),
		lock:true,
		width:'480px',
		height:'200px',
		id:"addCustomerPay",
		button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
					dlg.iframe.contentWindow.saveAdd(this);
				}
				return false;
			}},{name:'取消',callback:function(){
				return true;
			}}
		],
		close:function(){
			searchData();
		 }
	});
}


//单击左边树节点的响应事件
function onTreeNodeClick(event, treeId, treeNode){
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(treeNode.id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
		}else{
			$list_dataParam['customerId'] = treeNode.id; 
		}
	}
	searchData();
}

function searchData(){
	
	//录入时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["createTime"]){
		queryStartDate = MenuManager.menus["createTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["createTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
	
	//根据状态查询
	var state = $("#state").val();
	if (state != "") {
		$list_dataParam['state'] = state;
	} else {
		delete $list_dataParam['state'];
	}
	
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var nodes = tree.getSelectedNodes();
	if(nodes!=null && nodes.length>0){
		if(nodes[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
		}else{
			$list_dataParam['customerId'] = nodes[0].id;
		}
	}
	
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['payDesc'];
	}else{
		$list_dataParam['payDesc'] = kw;
	}
	resetList();
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
     }
}); 


