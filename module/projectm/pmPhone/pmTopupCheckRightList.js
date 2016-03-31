$list_editUrl = getPath()+"/projectm/pmTopupCheck/edit";//编辑及查看url
$list_deleteUrl = getPath()+"/projectm/pmTopupCheck/delete";//删除url
$list_editWidth = 500;
$list_editHeight = 350;
$list_dataType = "核算渠道" ;
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "250px";//界面高度
$tree_dataType = "客户类型";//数据名称
var map={TTEN:'铁通',HW:'电信',ZX:'泽讯',CAAS:'CAAS',GL:'国领'};

var curbindId = '';
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'left', width: 250,render:editMethod, isSort:false},
                    {display: '渠道名称', name: 'configName', align: 'center', width: 150, isSort:false},
                    /*{display: '使用组织', name: 'org.name', align: 'center', width: 100, isSort:false},*/
	                {display: '所属客户', name: 'customer.name', align: 'center', width: 100, isSort:false}, 
		            {display: '合作商', name: '', align: 'center',width:100,isSort:false,render:getParents},
		            {display: '套餐', name: 'pmDefinePackage.name', align: 'center',width:100,isSort:false},
		            {display: '合作费率', name: 'userCalcRate', align: 'center',width:100,isSort:false},
		            {display: '用户结算费率', name: 'configCalxRate', align: 'center',width:100,isSort:false},
		            {display: '备注', name: 'remark', align: 'center', width: 200, isSort:false}
		            ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        delayLoad:false,
        parms:{},
        url:getPath() + '/projectm/pmTopupCheck/listRightData'
    }));
	
});

function getParents(data){
	return map[data.partners];
}
function editMethod(data){
	var str='';
	
	str='<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>'
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">||修改</a>'
	if(data.partners=='HW'){
		str+='<a href="javascript:voiceUpload({id:\''+data.id+'\'});">||语音上传</a>'
		str+='<a href="javascript:setCombo({id:\''+data.id+'\'});">||设置套餐</a>'
	}
	str+='<a href="javascript:copyAdd({id:\''+data.id+'\'});">||复制新增</a>'
	return str;
}

var configId;
function setCombo(data){
	configId=data.id;
	var $list_setComboUrl=getPath()+"/projectm/pmDefinePackage/list";
	art.dialog.open($list_setComboUrl,
				{title:"自定义套餐管理",
				lock:true,
				width:'900px',
				height:'400px',
				id:'setCombo',
				button:[{name:'关闭'}]}
	);
	art.dialog.data("returnFunName","setComboAfter");
}


function setComboAfter(obj){
	var bindComboUrl=getPath()+"/projectm/pmPhoneConfig/bindCombo?configId="+configId+"&comboId="+obj.id;
	$.post(bindComboUrl,{},function(res){
		if("SUCCESS"==res.STATE){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json')
}

function copyAdd(data){
	$list_addUrl = getPath()+"/projectm/pmTopupCheck/add?id="+data.id;
	addRow();
}

function voiceUpload(data){
	var $list_voiceUploadUrl=getPath()+"/projectm/pmPhoneVoice/list";
	art.dialog.open($list_voiceUploadUrl+"?configId="+data.id,
			{title:"语音管理",
			lock:true,
			width:'800px',
			height:'350px',
			id:'voiceManger',
			button:[{name:'关闭'}]}
);
}


function searchData(){
	
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
		}else{
			$list_dataParam['customerId'] = node[0].id;
		}
	}
	
	resetList();
}

//查詢客戶
function qdsearch(){
	$list_dataParam['customerId'] = $("#customers").val();
	$list_dataParam['partnersValue'] = $("#partners").val();
	//重新load表格
	resetList();
}
//添加客户
function beforeAddRow(){
	$list_addUrl = getPath()+"/projectm/pmTopupCheck/add";//新增url
	addRow({});
}
