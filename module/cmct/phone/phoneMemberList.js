$list_editUrl = getPath()+"/cmct/phonemember/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/phonemember/add";//新增url
$list_deleteUrl = getPath()+"/cmct/phonemember/delete";//删除url
$list_editWidth = 570;
$list_editHeight = 230;
$list_dataType = "电话" ;
var map={RADIO:'无线电话',PHONE:'手机',TEL:'固定电话',SHAR:'共享',PERSONAL:'专用'};
var curbindId = '';
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
                    {display: '操作', name: '', align: 'center', width: 170,render:editMethod, isSort:false},
                    {display: '核算渠道', name: 'configName', align: 'center', width: 80, isSort:false},
                    {display: '使用组织', name: 'org.name', align: 'center', width: 100, isSort:false},
	                {display: '注册号码', name: 'loginNumber', align: 'center',  width: 120, isSort:false},
	                {display: '开通日期', name: 'createTime', align: 'center',  width: 100, isSort:false},
	                {display: '分配固定号码', name: 'showPhone', align: 'center', width: 120, isSort:false},
	                {display: '使用模式', name: 'useType', align: 'center', width: 120,render:getName, isSort:false},
		            {display: '默认接听号码', name: 'answerPhone', align: 'center',  width: 150, isSort:false},
		            {display: '别名', name: 'alias', align: 'center', width: 180, isSort:false},
		            {display: '权限', name: 'setType', align: 'center',  width: 70,render:getName, isSort:false},
		            {display: '专用人', name: 'onlyUser.name', align: 'center', width: 80, isSort:false},
		            {display: '绑定电脑', name: 'mac', align: 'left', width: 160}
		            
		            /*{display: '当前使用', name: 'currentUser.name', align: 'right', width: 100,render:currentOprate, isSort:false}*/
	                  ];
    
	//{display: '当前使用', name: 'currentUser.name', align: 'right', width: 100,render:currentOprate, isSort:false}

	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        enabledSort:true,
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/cmct/phonemember/listData',
        onAfterShowData:function(rowData,rowIndex){
        	/*
        	for(var i = 0 ; i < rowData.items.length ; i ++){
        		var trObj = $("tr[id='tableContainer|1|"+rowData.items[i].__id+"']");
            	var delTrFlag = $(trObj).attr("delTr");
            	if(delTrFlag && delTrFlag == 'Y'){
            		var trId = trObj.attr("id").replace("|1|","|2|");
            		$("tr[id='"+trId+"']").css({"background-color":"red"});
            	}
        	}
        	*/
        }
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
		str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'stop'+'\');">停用</a>';
		str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">回收</a>';
		
	}else if(data.enable == 'STOP'){
		str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
		str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'start'+'\');">启用</a>';
		str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">回收</a>';
	}else if(data.enable == 'DELETE'){
		var trObj = $("tr[id='tableContainer|1|"+data.__id+"']");
		trObj.attr("delTr","Y");
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
	if(type == 'stop'){
		art.dialog.confirm("确定要停用该号码吗?",function(){
			stopData2(id,type);
		});
	}else{
		stopData2(id,type);
	}
}
function stopData2(id,type){
	$.post(getPath()+'/cmct/phonemember/stopData',{id:id,type:type},function(data){
		if(data.STATE=='SUCCESS'){
			searchData();
		}
		art.dialog.tips(data.MSG);
	},'json');
}

function dropOne(id){
	art.dialog.confirm("确定下线么?",function(){
		$.post(getPath()+'/cmct/phonemember/dropOne',{id:id},function(data){
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
		var cfDlg = art.dialog.confirm('回收之后去电号码将不能再使用，是否彻底回收该用户的去电号码？',function(){
			$.post($list_deleteUrl,{id:rowData.id,isCallBack:'YES'},function(res){
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
	var queryAccountDlg = art.dialog.open(getPath()+'/cmct/phonemember/toQueryAccount',{
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
	$("#li_balance").hide();
	$("#queryBalance").html("");
	$.post(getPath()+"/cmct/phonemember/queryAccount2",{},function(data){
		if(data.STATE == 'SUCCESS'){
			var configList = data.configList ;
			var text = "" ;
			for(var i = 0 ; i < configList.length ;i ++){
				text += configList[i].configName + "：" +  configList[i].balance + " 元；" ; 
			}
			$("#queryBalance").html(text);
			$("#li_balance").show();
		}else{
			$("#li_balance").show();
		}
	},'json');
}

function bindRight(obj){
	var orgId = obj.orgId;
	curbindId = obj.id;
	art.dialog.open(getPath()+"/framework/dataPicker/list?query=phoneRightQuery&orgId="+orgId,{
		id : "getPhoneRight",
		title : '绑定权限',
		background : '#333',
		width : 450,
		height : 450,
		lock : true	 
		});
	art.dialog.data("returnFunName","updateRight");
}

function updateRight(obj,type){
	var param = {};
	param['rightid'] = obj.id;
	param['memberid'] = curbindId;
	param['callRightId'] = obj.callRightId;
	param['type'] = 'bind';
	$.post(getPath()+"/cmct/phonemember/bindRight",param,function(res){
		
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function unbindRight(obj){
	var param = {};
	param['memberid'] = obj.id;
	param['type'] = 'unbind';
	$.post(getPath()+"/cmct/phonemember/bindRight",param,function(res){
		
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function matchPhone(){
	window.location.href=getPath()+"/cmct/phoneUnmatch/list";
}