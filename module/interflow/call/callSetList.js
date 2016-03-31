$list_editUrl = getPath()+"/interflow/callSet/edit";//编辑及查看url
$list_addUrl = getPath()+"/interflow/callSet/add";//新增url
$list_deleteUrl = getPath()+"/interflow/callSet/delete";//删除url
$list_editWidth = 570;
$list_editHeight = 230;
var map={RADIO:'无线电话',PHONE:'手机',TEL:'固定电话',SHAR:'共享',PERSONAL:'专用'};
$(document).ready(function(){
	params ={};
	params.width = 260;
	params.inputTitle = "开通日期";
	MenuManager.common.create("DateRangeMenu","openDate",params);
	
	$("#key").focus(function(){
		if($(this).val()=="号码/分配号码/mac地址"){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val("号码/分配号码/mac地址");
		}
	});
	
	//注册控件key的回车查询事件
	inputEnterSearch('key',searchData);
	
	/**
	 * 设置默认值
	 */
	
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'center', width: 120,render:editMethod, isSort:false},
                    {display: '核算渠道', name: 'configName', align: 'center', width: 80, isSort:false},
                    {display: '使用组织', name: 'org.name', align: 'center', width: 100, isSort:false},
	                {display: '注册号码', name: 'loginNumber', align: 'center',  width: 120, isSort:false},
	                {display: '分配固定号码', name: 'showPhone', align: 'center', width: 120, isSort:false},
	                {display: '使用模式', name: 'useType', align: 'center', width: 120,render:getName, isSort:false},
		            {display: '默认接听号码', name: 'answerPhone', align: 'center',  width: 150, isSort:false},
		            {display: '别名', name: 'alias', align: 'center', width: 180, isSort:false},
		            {display: '权限', name: 'setType', align: 'center',  width: 70,render:getName, isSort:false},
		            {display: '专用人', name: 'onlyUser.name', align: 'center', width: 80, isSort:false},
		            {display: '绑定电脑', name: 'mac', align: 'left', width: 180},
		            {display: '当前使用', name: 'currentUser.name', align: 'right', width: 100,render:currentOprate, isSort:false}
	                  ];
	
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/interflow/callSet/listData'
    }));
	
	//查询余额
	queryAccount();
});

/**
 * 开通设置
 */
function btnClick(){
	addRow('');
}

function editMethod(data){
	var str='';
	if(data.enable == 'USE'){
		str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
		str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'stop'+'\');">停用</a>';
	}else if(data.enable == 'STOP'){
		str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
		str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
		str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'start'+'\');">启用</a>';
	}
	return str;
}

/**
 * 当前使用情况
 * @param data
 */
function currentOprate(record, rowindex, value, column){
	var str='';
	if(record.state == 'BUSY'){//线路被使用状态
		str = value;
		str += '&nbsp;<a href="javascript:dropOne(\''+record.id+'\');">下线</a>';
	}
	return str;
}

function stopData(id,type){
		$.post(getPath()+'/interflow/callSet/stopData',{id:id,type:type},function(data){
			if(data.STATE=='SUCCESS'){
				searchData();
			}
			art.dialog.tips(data.MSG);
		},'json');
}

function dropOne(id){
	art.dialog.confirm("确定下线么?",function(){
		$.post(getPath()+'/interflow/callSet/dropOne',{id:id},function(data){
			if(data.STATE=='SUCCESS'){
				searchData();
			}
			art.dialog.tips(data.MSG);
		},'json');
	});
}

function getName(record, rowindex, value, column){
	return map[value];
}

/**
 * 删除行
 * @param rowData
 */
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		var cfDlg = art.dialog.confirm('是否删除此用户呼叫权限',function(){
			art.dialog({
				title:'删除',
				width:200,
				height:80,
				content:'是否彻底回收该用户的去电号码？<br/>（回收之后去电号码将不能再使用，<br/>不回收去电号码可分配给他人使用）',
				button:[{name:'回收号码',callback:function(){
					$.post($list_deleteUrl,{id:rowData.id,isCallBack:'YES'},function(res){
						art.dialog.tips(res.MSG);
						if(res.STATE=='SUCCESS'){
							if(typeof(afterDeleteRow)=='function'){
								afterDeleteRow();
							}
							refresh();
						}
					},'json');
					return true;
				}},{name:'不回收号码',callback:function(){
					$.post($list_deleteUrl,{id:rowData.id,isCallBack:'NO'},function(res){
						art.dialog.tips(res.MSG);
						if(res.STATE=='SUCCESS'){
							if(typeof(afterDeleteRow)=='function'){
								afterDeleteRow();
							}
							refresh();
						}
					},'json');
					return true ;
				}}],
				cancel:true
			});
		});
	}
}

function searchData(){
	var key=$("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	resetList();
}

function queryAccount(){
	/*
	var queryAccountDlg = art.dialog.open(getPath()+'/interflow/callSet/toQueryAccount',{
		title:"查询账户余额",
		lock:true,
		width:"400px",
		height:"100px",
		id:"queryAccountDlg",
		ok:function(){
			
		},
		okVal:'确定'
	});
	*/
	$.post(getPath()+"/interflow/callSet/queryAccount",{},function(data){
		if(data.STATE == 'SUCCESS'){
			var configList = data.configList ;
			var text = "" ;
			if(configList!=null && configList.length == 1){
				text = configList[0].balance +" 元";
			}else{
				for(var i = 0 ; i < configList.length ;i ++){
					text += configList[i].configName + "：" +  configList[i].balance + " 元；" ; 
				}
			}
			$("#queryBalance").text(text);
			$("#li_balance").show();
		}else{
			$("#li_balance").show();
		}
	},'json');
}