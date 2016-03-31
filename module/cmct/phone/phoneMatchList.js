$list_editUrl = getPath()+"/cmct/phonemember/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/phonemember/add";//新增url
$list_deleteUrl = getPath()+"/cmct/phonemember/delete";//删除url
$list_editWidth = 540;
$list_editHeight = 220;
$list_dataType = "电话" ;
var map={RADIO:'无线电话',PHONE:'手机',TEL:'固定电话',SHAR:'共享',PERSONAL:'专用',UNUSE:'未分配',USE:'已分配',DELETE:'已回收',STOP:'停用',FREE:'空闲',BUSY:'忙碌'};
var phoneIndex=0;
$(document).ready(function(){
	
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
	
	$("#voiceUpload").bind("click",function(){
		voiceUpload();
	});
	
//	$('#callerNbrAdd').bind('click',function(){
//		var callerNbrAddUrl = getPath()+'/cmct/phoneUnmatch/list';
//		art.dialog.data("flag",false);
//		art.dialog.open(callerNbrAddUrl, {
//			id : 'callerNbrAdd',
//			width : 710,
//			title:"主叫分配",
//			height : 500,
//			lock:true,
//			cancelVal: '关闭',
//		    cancel: true ,
//		    close:function(){
//		    	if(art.dialog.data("flag")){	    		
//		    		resetList();
//		    	}
//		    }
//		});		
//	});
	
	$list_defaultGridParam.pageSize=100;
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'center', width: 100,render:editMethod, isSort:false},
                    {display: '去电号码', name: 'showPhone', align: 'center', width:100, isSort:false},
                    {display: '使用状态', name: 'state', align: 'center', width: 80, render:getName,isSort:false},
                    {display: '号码状态', name: 'enable', align: 'center', width: 80, render:loadEnable,isSort:false},
	                {display: '别名', name: 'alias', align: 'center',  width: 100, isSort:false},
	                {display: '使用组织', name: 'org.name', align: 'center',  width: 80, isSort:false},
	                {display: '使用模式', name: 'useType', align: 'center', width: 80,render:getName, isSort:false},
		            {display: '权限', name: 'setType', align: 'center',  width: 80,render:getName, isSort:false},
		            {display: '专用人', name: 'onlyUser.name', align: 'center', width: 80, isSort:false},
		            {display: '绑定电脑', name: 'mac', align: 'left', width: 120},
		            {display: '备注', name: 'description', align: 'left', width: 140}
		            ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        width:"99%",
        height:"97%",
        parms:{orgId:$("#orgId").val()},
        url:getPath() + '/cmct/phonemember/listData',
        onAfterShowData:function(gridData){	
	    	loadPhoneEnable(gridData);
	    },
	    onToFirst:function(){
	    	phoneIndex=0;
	    },
	    onToPrev:function(){
	    	phoneIndex=0;
	    },
	    onToNext:function(){
	    	phoneIndex=0;
	    },
	    onToLast:function(){
	    	phoneIndex=0;
	    }
    }));
	//查询余额
	queryAccount();
});


function loadEnable(){
	return "正在读取...";
}
/**
 * 页面数据加载完之后,再去读取状态
 */

var dingjianRes=null;
function loadPhoneEnable(gridData){	
	if(gridData){
		if(dingjianRes){
			phoneMenthond(gridData,dingjianRes);
		}else{			
			$.post(getPath() + '/cmct/phonemember/getDingJianPhone',{},function(res){
				if(res && res.length>0){
					dingjianRes=res;
					phoneMenthond(gridData,res);
				}
			},'json');
		}
	}
}

function phoneMenthond(gridData,res){
	var phoneArr = [];			
	for(var i = 0 ; i < gridData.items.length ; i ++){
		var tdId = "";
		if((i+1)>=10 && (i+1)<=100){
			tdId = "tableContainer|2|r10"+(i+1)+"|c105"
		}else{
			tdId = "tableContainer|2|r100"+(i+1)+"|c105"
		}
		if((i+1)>=100){
			tdId = "tableContainer|2|r1"+(i+1)+"|c105"
		}
		
		var rowObj = gridData.items[i];
		var existsFlag = false;
		var tempNumber = null;
		var tempPhone = {};	
		for(var k = 0 ; k < res.length ; k ++){
			var numPkg = res[k];
			if($.trim(rowObj.id) == $.trim(numPkg.id)){//匹配上了
				tempNumber=numPkg;
				if($.trim(rowObj.enable) == $.trim(numPkg.state)){//判断鼎尖平台的当前号码的状态是否和本地的号码状态相同,如果相同,不做操作,不同,记录鼎尖平台号码状态很本地当前数据的id
					var existsFlag = true;//能匹配上
				}					
				break;
			}
		}
		var stateFlag="";
		if(!existsFlag){//当前本地号码和服务器没匹配上
			tempPhone.id=rowObj.id;
			if(tempNumber){
				tempPhone.state=tempNumber.state;//在鼎尖平台能找到对应的数据,但是状态不同,更新为鼎尖状态
				stateFlag=tempNumber.state;
			}else{//在鼎尖平台没找到此数据的.状态变为回收的
				tempPhone.state='DELETE';
				stateFlag='DELETE';
			}
		}else{
			stateFlag=tempNumber.state;
		}
		if(stateFlag=='DELETE'){
			$("td[id='"+tdId+"'] div").html("<font color='red'>"+map[stateFlag]+"</font>");
		}else{
			$("td[id='"+tdId+"'] div").html(map[stateFlag]);
		}
		if(tempPhone.id){
			phoneArr.push(tempPhone);
		}				
	}
	if(phoneArr.length>0){
		changePhoneEnable(phoneArr);
	}
}

function changePhoneEnable(phoneArr){
	phoneIndex+=1;	
	if(phoneIndex!=1){//只刷新一次
		return false;
	}
	$.post(getPath() + '/cmct/phonemember/changePhoneEnable',{phoneArr:JSON.stringify(phoneArr)},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.tips(res.MSG);
			refresh();//重新刷新一次.把操作按钮恢复出来
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}
function editMethod(data){
	var str='';
	if(data.enable && data.enable!='DELETE'){
		str += '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>||';
		//str += '<a class="" href="javascript:dailByFjCtRow({id:\''+data.id+'\'});">拨打||</a>';
	}
	str += '<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\',enable:\''+data.enable+'\'});">删除</a>';
	return str;
}


function getName(record, rowindex, value, column){
	return map[value];
}

/**
 * 删除行
 * @param rowData
 */
function deleteRow(rowData){
	var $list_deleteMatchUrl=getPath()+"/cmct/phonemember/deleteMatch";
	if($list_deleteUrl && $list_deleteUrl!=''){
		var cfDlg = art.dialog.confirm('删除之后号码将不能使用，是否删除该号码？',function(){
			$.post($list_deleteMatchUrl,{id:rowData.id,isCallBack:'YES',enable:rowData.enable},function(res){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips(res.MSG);
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		});
	}
}

function searchData(){
	phoneIndex=0;
	var key=$("#key").val();
	if(key == '号码/分配号码/mac地址'){
		key='';
	}
	$list_dataParam['key'] = key;
	$list_dataParam['state'] = $("#state").val();
	$list_dataParam['orgId'] = $("#orgId").val();
	$list_dataParam['enableStr'] = $("#enableStr").val();
	resetList();
}

function queryAccount(){
	$("#queryBalance").text("");
	$("#li_balance").hide();
	$.post(getPath()+"/cmct/phonemember/queryAccount2",{},function(data){
		if(data){
			var text = "" ;
			if(data!=null && data.length == 1){
				text += data[0].configName + "：" +data[0].balance +" 元";
			}else{
				for(var i = 0 ; i < data.length ;i ++){
					text += data[i].configName + "：" +  data[i].balance + " 元；" ; 
				}
			}
			$("#queryBalance").text(text);
			$("#li_balance").show();
		}else{
			$("#li_balance").show();
		}
	},'json');
}

/**
 * 电话测试
 */
function dailByFjCtRow(data){
	var $list_dailByFjCtUrl=getPath()+"/cmct/phonemember/dailByFjCt?memberId="+data.id;
	art.dialog.open($list_dailByFjCtUrl,
			{title:"电话测试",
			lock:true,
			width:'380px',
			height:'180px',
			id:'dailByFjCt',
			button:[{name:'关闭'}]})
}

function voiceUpload(){
	var $list_voiceUploadUrl=getPath()+"/cmct/phonemember/voiceUpload";
	art.dialog.open($list_voiceUploadUrl,
			{title:"语音管理",
			lock:true,
			width:'800px',
			height:'350px',
			id:'voiceManger',
			button:[{name:'关闭'}]}
	);
}
