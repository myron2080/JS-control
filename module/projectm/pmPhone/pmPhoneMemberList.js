$list_editUrl = getPath()+"/projectm/pmPhonemember/edit";//编辑及查看url
$list_addUrl = "";//新增url
$list_deleteUrl = getPath()+"/projectm/pmPhonemember/delete";//删除url
$tree_container = "leftTree";
$tree_async_url = getPath()+"/projectm/customer/simpleTreeData";
$tree_addUrl = getPath()+"/projectm/customer/add";//新增
$tree_editUrl = getPath()+"/projectm/customer/edit";//编辑及查看url
$tree_deleteUrl = getPath()+"/projectm/customer/delete";//删除url
$list_editWidth = 580;
$list_editHeight = 260;
$list_dataType = "电话" ;
$tree_editWidth = "580px";//界面宽度
$tree_editHeight = "280px";//界面高度
$tree_dataType = "客户类型";//数据名称

$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:150,allowLeftCollapse:true,allowLeftResize:true});
	
	$("div[toolbarid='add'] span","#toolBar").addClass("greenbtn btn");
	$("div[toolbarid='add']","#toolBar").hover(function(){
		$(this).removeClass("l-panel-btn-over");
	});
	
	$("div[toolbarid='clearSearch'] span","#toolBar").addClass("graybtn btn");
	$("div[toolbarid='clearSearch']","#toolBar").hover(function(){
		$(this).removeClass("l-panel-btn-over");
	});
	$("div[toolbarid='state']","#toolBar").hover(function(){
		$(this).removeClass("l-panel-btn-over");
	});
	$("div[toolbarid='partners']","#toolBar").hover(function(){
		$(this).removeClass("l-panel-btn-over");
	});
	/*$("div[toolbarid='search']","#toolBar").hover(function(){
		$(this).removeClass("l-panel-btn-over");
	});*/
	/*$("#leftToolBar").ligerToolBar({
		items:[
		       {id:'addNode',text:'新增',click:addNode,icon:'add'},
		       {id:'updateNode',text:'编辑',click:updateNode,icon:'modify'},
		       {id:'deleteNode',text:'删除',click:deleteNode,icon:'delete'}
		       ]
	});*/
	
	$('#cbCostNumber').bind('click',function(){		
		
		$('#isCostNumber').val(this.checked ? "YES" : "NO");
		if(this.checked){
			clearDataPicker('costNumberF7');//清空值
			$('#bindFjct tr :eq(1)').hide();
		}else{
			$('#bindFjct tr :eq(1)').show();
		}
	});
	
	$("#exportExcel").bind("click",function(){
		exportSearch();
	});
	
	initSimpleDataTree();
	 
	var columnsParam=[ 
                    {display: '操作', name: '', align: 'left', width: 165,render:editMethod, isSort:false},
                    {display: '客户简称', name: 'customer.simpleName', align: 'center', width: 80, isSort:false},
	                {display: '使用号码', name: 'showNumber', align: 'center',  width: 160, isSort:false,render:operateDispNum},
	                {display: '核算渠道', name: 'config.configName', align: 'center',  width: 100, isSort:false},
	                {display: '状态', name: 'state.name', align: 'center',  width: 100, isSort:false},
	                {display: '计费模式', name: 'comboName', align: 'center',  width: 140, isSort:false,render:comboNameRender},
	                {display: '套餐模式', name: 'pmDefinePackage.name', align: 'center',  width: 140, isSort:false},
//	                {display: '开通模式', name: 'createType.name', align: 'center',  width: 80, isSort:false},
	                {display: '开通日期', name: 'createTime', align: 'center',  width: 120, isSort:false},
	                {display: '回收日期', name: 'stopDate', align: 'center',  width: 120, isSort:false},
	                {display: '运营商', name: 'operator.name', align: 'center',  width: 80, isSort:false},
	                {display: '合作商', name: 'partners.name', align: 'center',  width: 80, isSort:false}
//	                {display: '下月套餐', name: 'nextMonthPackage.name', align: 'center',  width: 120, isSort:false}
	                  ];
    
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: columnsParam,
        enabledSort:true,
        delayLoad:true,
        parms:{orgId:$("#orgId").val(),state:$('#state').val()},
        url:getPath() + '/projectm/pmPhonemember/listData',
	    onAfterShowData:function(gridData){
	    	var customerId = $list_dataParam['customerId'];
	    	getAllNumberPackageListByData(gridData);
	    //	getAllNumberPackageList(gridData,customerId);
	    }
    }));
});

/**
 * 主显申请
 * @param rowData
 */
var configId="";
function operateDispNum(data){
	if(data.phoneWay=='AutoBill' && data.partners && data.partners.value=='HW'){
		return data.showNumber+"&nbsp;<a href='javascript:void(0);' onclick=setDispNum(\""+data.id+"\",\""+data.showNumber+"\",\""+data.displayNbr+"\",\""+data.config.id+"\")>主显申请</a>";
	}
	return data.showNumber;
}

var dataJson={}
function setDispNum(id,showNumber,disPlayNum,configId){
	dataJson.configId=configId;
	$('[dispIndex]').eq(0).text(showNumber);
	if(disPlayNum){		
		var disPlayArr=disPlayNum.split(",");
		$.each(disPlayArr,function(i,obj){
			$('<li disPlay='+obj+'>'+obj+'</li>').appendTo('#disPlayUl');
		});
	}
	var setDisPlyDlg = art.dialog({
		content:$("#setDispNumDiv")[0],
		title:'',
		id:'setDispNum',
		button:[{name:'确定',callback:function(){
			var disPlayId=getAllDisPlayNum("ADD");
			if(!disPlayId){
				art.dialog.tips('请选择主显号码...');
				return false;
			}
			$.post(getPath() + '/projectm/pmPhoneFjctmember/bindDisplayNum',{disPlayId:disPlayId,costNumId:id},function(res){
				if(res.STATE=='SUCCESS'){
					setDisPlyDlg.close();
					dataJson.configId="";
					$('[dispIndex]').eq(0).text('');
					$('#disPlayUl li').remove();
					resetList();
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
			return false;
		}},{name:'取消',callback:function(){
			dataJson.configId="";
			$('[dispIndex]').eq(0).text('');
			$('#disPlayUl li').remove();
			return true;
		}}]
	});
}

function setConfigId(){
	if(!dataJson.configId){
		dataJson.configId="-1";
	}
	return {configId:dataJson.configId,phoneWay:'DisplayNbr',stateEq:'NOTAUDIT'};
}

function deleteDisLi(obj){
	$(obj).parent().remove();
}

function getDisPlayLi(oldObj,newObj,doc){
	if(newObj){
		if(getAllDisPlayNum().indexOf(newObj.showNumber)==-1){	
			$('[indexDis=YES]').remove();
			$('<li indexDis=YES disPlayId='+newObj.id+' disPlay='+newObj.showNumber+'>'+newObj.showNumber+'<a href="javascript:void(0);" onclick="deleteDisLi(this)"><img src='+getPath()+'/default/style/images/fastsale/send_message.gif></a></li>').appendTo('#disPlayUl');
		}
		$('#disPlayNum').val('');
	}
}

function getAllDisPlayNum(type){
	var disPlayNums="";
	$('#disPlayUl li').each(function(){
		if(type=="ADD" && $(this).attr("indexDis")=='YES'){
			disPlayNums+=$(this).attr("disPlayId")+",";
		}
		if(!type){			
			disPlayNums+=$(this).attr("disPlay")+",";
		}
	});
	if(disPlayNums.indexOf(",") != -1){
		disPlayNums=disPlayNums.substring(0,disPlayNums.length-1);
	}
	return disPlayNums;
}

function comboNameRender(rowData){
	var customerId = $list_dataParam['customerId'];
	//if(!rowData.comboName && customerId && customerId!='65a19487-c95e-44b1-859a-7cfa41aaa04a'){return '正在读取...'}
	if(rowData.partners.value=='TTEN'){
		return '正在读取...'
	}else{
		if(rowData.state &&　rowData.state.value!='DELETE'){
			if(rowData.costNumber && rowData.isCostNumber!='YES'){//属于绑定计费
				if(rowData.phoneWay=='BindBill'){
					return "副号绑定("+rowData.answerPhone+")"/*+' <a href="javascript:unBindFjct({id:\''+rowData.id+'\'});">取消绑定</a>'*/;
				}else{
					return "主叫关联("+rowData.costNumber+")"/*+' <a href="javascript:unBindFjct({id:\''+rowData.id+'\'});">取消绑定</a>'*/;
				}
			}else{//自助计费.默认开通都是自助计费
				if(rowData.phoneWay=="AutoBill" && rowData.isCostNumber=='YES'){
					return "计费号码"
				}
				return "主显号码 "/*+' <a href="javascript:bindFjct({id:\''+rowData.id+'\',configId:\''+rowData.config.id+'\'});">绑定</a>'*/;
			}
		}
	}
}

var currentDialog;
function bindFjct(data){
	$('#dataId').val(data.id);
	$('#costNumberF7').attr('datapickerurl','');
	clearDataPicker('costNumberF7');//清空值
	$('#costNumberF7').attr('datapickerurl',$('#costNumberF7').attr('deflultF7Url')+"&configId="+data.configId+"&isCostNumber=YES");
	currentDialog=art.dialog({
		content:$("#bindFjct")[0],
		title:'绑定计费号码',
		id:'bindCostNumber',
		button:[{name:'确定',callback:function(){
			bindCostNumber(data.id,data.configId);
			return false;
		}},{name:'取消',callback:function(){
			//window.location.reload(); 
			return true;
		}}]
	});
}

function bindCostNumber(id,configId){
	if(!$('#cbCostNumber').attr('checked') && ($('#costNumber').val()==''||$('#costNumber').val()==null)){
		art.dialog.tips('请选择计费号码或则选择主显号码');
		return false;
	}
	
	$.post(getPath()+'/projectm/pmPhoneFjctmember/bindCostNumber',{memberId:id,type:$('#isCostNumber').val(),costMemberId:$('#costMemberId').val()},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.alert(res.MSG,function(){
				window.location.reload(); 
			});
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}


function getAllNumberPackageListByData(gridData){
	var configArr = [];
	var orgIdstr = "";
	if(gridData){
		for(var i=0;i<gridData.items.length;i++){
			var rowObj = gridData.items[i];	
			if(rowObj.partners.value=='TTEN'){
				configArr.push(rowObj.config.orgId);
			}
		}
		var configArrOrgId=jsArrayRepeat(configArr);
		for(var i=0;i<configArrOrgId.length;i++){
			orgIdstr += configArrOrgId[i] + ","
		}
	}
	if(!orgIdstr){
		return false;
	}
	$.post(getPath()+'/projectm/pmPhonenumber/getAllNumberPackageListByorgIdArray',{orgIdstr:orgIdstr,numberStatus:4},function(data){
		if(!data || data.length<1){
//			$("td[id^='tableContainer|2|r10'][id$='|c107'] div").html("<font color='red'>无此号码</font>");
			$("td[id^='tableContainer|2|r10'][id$='|c107'] div").each(function(){
				if($(this).html()=='正在读取...'){
					$(this).html("<font color='red'>无此号码</font>");
				}
			});
			return ;
		}
		for(var i = 0 ; i < gridData.items.length ; i ++){
			var rowObj = gridData.items[i];
			if(rowObj.partners.value=='TTEN'){
				var existsFlag = false;
				var tdId = "";
				if((i+1)>=10 && (i+1)<=100){
					tdId = "tableContainer|2|r10"+(i+1)+"|c107"
				}else{
					tdId = "tableContainer|2|r100"+(i+1)+"|c107"
				}
				if((i+1)>=100){
					tdId = "tableContainer|2|r1"+(i+1)+"|c107"
				}
				
				for(var k = 0 ; k < data.length ; k ++){
					var numPkg = data[k];
					 
					if($.trim(rowObj.showNumber) == $.trim(numPkg.phoneNo)){
						
						$("td[id='"+tdId+"'] div").text(numPkg.currentPackName);
						existsFlag = true;
						break;
					}
				}
				if(!existsFlag){
					$("td[id='"+tdId+"'] div").html("<font color='red'>无此号码</font>");
				}
			}
			
		}
		 
	},'json');
}

/**
 * js数组元素去重
 * @param gridData
 * @param customerId
 */
function jsArrayRepeat(array){
	var map={};
	var re=[];
	for(var i=0,l=array.length;i<l;i++) {
		if(typeof map[array[i]] == "undefined"){
			map[array[i]]=1;
			re.push(array[i]);
		}
	}
	return re;
}


/*function comboNameRender2(rowData){
	if(rowData.partners && rowData.partners.value=='TTEN'){
		if(rowData.comboName){
			return rowData.comboName;
		}else{
			if($list_dataParam['customerId']){
				return "<font color='red'>无此号码</font>";
			}
			return "";
		}
	}else{
		return rowData.comboName;
	}
}*/

function getAllNumberPackageList(gridData,customerId){
	if(!customerId){
		return ;
	}
	$.post(getPath()+'/projectm/pmPhonenumber/getAllNumberPackageList',{customerId:customerId,numberStatus:4},function(data){
		if(!data || data.length<1){
			$("td[id^='tableContainer|2|r10'][id$='|c106'] div").html("<font color='red'>无此号码</font>");
			return ;
		}
		for(var i = 0 ; i < gridData.items.length ; i ++){
			var rowObj = gridData.items[i];
			var existsFlag = false;
			var tdId = "";
			if((i+1)>=10){
				tdId = "tableContainer|2|r10"+(i+1)+"|c106"
			}else{
				tdId = "tableContainer|2|r100"+(i+1)+"|c106"
			}
			
			for(var k = 0 ; k < data.length ; k ++){
				var numPkg = data[k];
				 
				if($.trim(rowObj.showNumber) == $.trim(numPkg.phoneNo)){
					
					$("td[id='"+tdId+"'] div").text(numPkg.currentPackName);
					existsFlag = true;
					break;
				}
			}
			if(!existsFlag){
				$("td[id='"+tdId+"'] div").html("<font color='red'>无此号码</font>");
			}
		}
		 
	},'json');
}


//增加行
function addPhoneMember(){
	$list_addUrl=getPath()+"/projectm/pmPhonemember/add";
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node==null || node.length==0 || node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){
		art.dialog.tips('请先在左边选择客户类型');
		return false;
	}
	$list_addUrl += "?customerId="+node[0].id+"&customerName="+node[0].name;
	addRow();
}

function refreshTree(){
	initSimpleDataTree();
}
function afterAddNode(){
	$('#'+$tree_container).empty();
	refreshTree();
}

function afterUpdateNode(){
	$('#'+$tree_container).empty();
	refreshTree();
}

function afterDeleteNode(){
	$('#'+$tree_container).empty();
	refreshTree();
}


function editMethod(data){
	var str='';
	if(data.partners && data.partners.value=='TTEN'){
		if(data.state.value == 'STOP'){
			str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
			str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'start'+'\');">启用</a>';
			str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">回收</a>';
			
		}else if(data.state.value == 'USE'){
			str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
			str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'stop'+'\');">停用</a>';
			str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">回收</a>';
		}else if(data.state.value == 'UNUSE'){
			str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
			str += '||<a class="delete_font" href="javascript:stopData(\''+data.id+'\',\''+'stop'+'\');">停用</a>';
			str += '||<a class="delete_font" href="javascript:deleteRow({id:\''+data.id+'\'});">回收</a>';
		}else if(data.state.value == 'DELETE'){
			var trObj = $("tr[id='tableContainer|1|"+data.__id+"']");
			trObj.attr("delTr","Y");
		}
	}else if(data.partners && data.partners.value=='HW'){
		if(data.state){			
			if(data.state.value == 'DELETE'){
				//str += '<a class="" href="javascript:pointsByFjCtRow({id:\''+data.id+'\'});">购买套餐</a>';
			}else if((data.state.value == 'USE' || data.state.value == 'UNUSE')){
				//	str = '<a href="javascript:editRow({id:\''+data.id+'\'});">修改||</a>';
				
				str += '<a class="delete_font" href="javascript:deleteByFjCtRow({id:\''+data.id+'\',httpUrl:\''+data.id+'\'});">删除||</a>';
				
				
				if(data.pmDefinePackage){
					str += '<a class="" href="javascript:setCombo({id:\''+data.id+'\',type:\'update\'});">修改套餐</a>';
				}else{
					str += '<a class="" href="javascript:setCombo({id:\''+data.id+'\',type:\'set\'});">设置套餐</a>';
				}
				
				if(data.isCostNumber=='YES' && data.phoneWay=="AutoBill"){//自助计费
					str += '<a class="" href="javascript:pointsByFjCtRow({id:\''+data.id+'\'});">||充值</a>';
					str += '<a class="" href="javascript:putCostMember({id:\''+data.id+'\'});">||存入内存</a>';
				}else{
					if(data.phoneWay=='BindBill'){//属于副号绑定
						str += '<a class="" href="javascript:pointsByFjCtRow({id:\''+data.id+'\'});">||充值</a>';//副号绑定 的也可以充值
						str += '<a class="" href="javascript:bindBill({id:\''+data.id+'\',showNumber:\''+data.showNumber+'\',configId:\''+data.config.id+'\'});">||副号绑定</a>';
					}
					/**
					 * 主叫关联和副号绑定的都可以修改
					 */
					str += '<a class="" href="javascript:editRow({id:\''+data.id+'\'});">||修改</a>';
				}
			}
		}
	}else if(data.partners && data.partners.value=='CAAS'){
		str += '<a class="delete_font" href="javascript:deleteByCaasRow({id:\''+data.id+'\',httpUrl:\''+data.id+'\'});">删除</a>';
		if(data.isCostNumber=='YES'){//自助计费			
			str += '<a class="" href="javascript:putCostMember({id:\''+data.id+'\'});">||存入内存</a>';
		}
	}else{
		
	}
	return str;
}

function putCostMember(data){
	$.post(getPath()+"/projectm/pmPhonemember/putCostMember",{id:data.id},function(res){
		if(res.STATE=='SUCCESS'){
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

function editData(data){
	var $list_editDataUrl=getPath()+"/projectm/pmPhonemember/editData?id="+data.id;
	var dlg = art.dialog.open($list_editDataUrl,
			{title:"修改",
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:$list_editHeight||'auto',
			 id:"editData",
			 button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					return true;
				}}],
			 close:function(){
				 refresh();
			 }
	});
}

var dmemberId;
function setCombo(data){
	dmemberId=data.id;
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
	var bindComboUrl=getPath()+"/projectm/pmPhonemember/bindCombo?memberId="+dmemberId+"&comboId="+obj.id;
	$.post(bindComboUrl,{},function(res){
		if("SUCCESS"==res.STATE){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json')
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
	$.post(getPath()+'/projectm/pmPhonemember/stopData',{id:id,type:type},function(data){
		if(data.STATE=='SUCCESS'){
			searchData();
		}
		art.dialog.tips(data.MSG);
	},'json');
}

/**
 * 删除福建电信号码或者天翼固话
 */
function deleteByFjCtRow(data){
	var $list_deleteByFjCtUrl=getPath()+"/projectm/pmPhoneFjctmember/deleteByFjCt";
	art.dialog.confirm('删除之后号码将不能再使用，确定删除?',function(){
		$.post($list_deleteByFjCtUrl,{id:data.id},function(res){
			if(res.STATE=='SUCCESS'){
				art.dialog.tips(res.MSG);
				if(typeof(afterDeleteRow)=='function'){
					afterDeleteRow();
				}
				refresh();
			}else{
				if(res.MSG.indexOf("被注销!") > 0){
					var $deleteLocalUrl=getPath()+"/projectm/pmPhoneFjctmember/deleteLocal";
					 art.dialog.confirm('该号码已经回收,是否本地回收？',function(){
						 $.post($deleteLocalUrl,{id:data.id,isBack:'YES'},function(res){
							 art.dialog.tips(res.MSG);
							 refresh();
						 },'json');
					 });
				}else{
					art.dialog.alert(res.MSG);
				}
				
			}
		},'json');
		return true;
	});
}

function deleteByCaasRow(data){
	$list_deleteByCaasUrl=getPath()+"/projectm/pmPhoneCaas/deleteByCaas";
	art.dialog.confirm('删除之后号码将不能再使用，确定删除?',function(){
		$.post($list_deleteByCaasUrl,{id:data.id},function(res){
			if(res.STATE=='SUCCESS'){
				art.dialog.tips(res.MSG);
				refresh();
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json')
	});
}

/**
 * 福建电信固话套餐管理
 */
var memberId;
function pointsByFjCtRow(data){
	memberId=data.id;
	var $list_pointsByFjCtUrl=getPath()+"/projectm/pmPhoneCombo/pointsByFjCtList?id="+data.id;
	art.dialog.open($list_pointsByFjCtUrl,
				{title:"套餐管理",
				lock:true,
				width:'680px',
				height:'300px',
				id:'pointsByFjCt',
				button:[{name:'关闭'}]}
	);
	art.dialog.data("returnFunName","selectCombo");
}

/**
 * 
 */
function selectCombo(obj){
	var bindComboUrl=getPath()+"/projectm/pmPhoneCombo/bindCombo?memberId="+memberId+"&comboId="+obj.id;
	$.post(bindComboUrl,{},function(res){
		if("SUCCESS"==res.STATE){
			art.dialog.tips(res.MSG);
			refresh();
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json')
}

/**
 * 电话测试
 */
function dailByFjCtRow(data){
	var $list_dailByFjCtUrl=getPath()+"/projectm/pmPhonemember/dailByFjCt?memberId="+data.id;
	art.dialog.open($list_dailByFjCtUrl,
			{title:"电话测试",
			lock:true,
			width:'380px',
			height:'100px',
			id:'dailByFjCt',
			button:[{name:'关闭'}]})
}

/**
 * 删除行
 * @param rowData
 */
function deleteRow(rowData){
	if($list_deleteUrl && $list_deleteUrl!=''){
		var cfDlg = art.dialog.confirm('停机之后去电号码将不能再使用，是否彻底回收该用户的去电号码？',function(){
			$.post($list_deleteUrl,{id:rowData.id,isBack:'YES'},function(res){
				if(res.STATE=='SUCCESS'){
					art.dialog.tips(res.MSG);
					if(typeof(afterDeleteRow)=='function'){
						afterDeleteRow();
					}
					refresh();
				}else{
					if(res.MSG.indexOf("[04]") > 0){
						var $deleteLocalUrl=getPath()+"/projectm/pmPhonemember/deleteLocal";
						 art.dialog.confirm('该号码已经回收,是否本地回收？',function(){
							 $.post($deleteLocalUrl,{id:rowData.id,isBack:'YES'},function(res){
								 art.dialog.tips(res.MSG);
								 refresh();
							 },'json');
						 });
					}else{
						art.dialog.alert(res.MSG);
					}
				}
			},'json');
		});
	}
}

function onTreeNodeClick(event, treeId, treeNode){
	//$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	//$('#state').val('');
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
	getListDataParam();
	resetList();
//	queryAccount();
}

function queryAccount(){
	$.post(getPath()+"/projectm/pmPhonemember/queryAccount",$list_dataParam,function(data){
		
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
			/*$("div[toolbarid='balance']").remove();
			$("#toolBar").ligerToolBar({
				items:[{id:'balance',text:'余额:'+text}]
			});*/
		}
	},'json');
}

function clearSearch(){
	$('#searchKeyWord').val($('#searchKeyWord').attr('defaultValue'));
	$('#state').val('');
	$('#parten').val('');
	$('#phoneWay').val('');
}

function bindBill(data){
	$('#pmPhoneMemberId').val(data.id);
	$('#showNumber').val(data.showNumber);
	$.post(getPath()+'/projectm/pmPhoneFjctmember/selectBindBill',{memberId:data.id},function(res){
		if(res.STATE=='SUCCESS'){
			$('#dataIdBill').val(res.MSG.id);
			$('#accessNumber').val(res.MSG.accessNumber);
			$('#deputyNumber').val(res.MSG.deputyNumber);
			$('#pmPhoneVoiceId').val(res.MSG.pmPhoneVoice.id);
			$('#pmPhoneVoiceIdName').val(res.MSG.pmPhoneVoice.name);
			if(res.MSG.recordFlag=='YES'){
				$('#recordFlag').attr("checked",true);
			}else{
				$('#recordFlag').attr("checked",false);
			}
		}
	},'json')
		
	var f7Url=$('#ringtone').attr("deflultF7Url");
	$('#ringtone').attr('datapickerurl',f7Url+"&configId="+data.configId);
	art.dialog({
		content:$("#bindBillFjct")[0],
		title:'副号绑定',
		id:'bindBill',
		button:[{name:'确定',callback:function(){
			bindBillData(data.id);
			return false;
		}},{name:'取消',callback:function(){
			clearValue();
			return true;
		}}]
	});
}

function clearValue(){
	$('#accessNumber').val('');
	$('#deputyNumber').val('');
	$('#pmPhoneVoiceId').val('');
	$('#pmPhoneVoiceIdName').val('');
}

function bindBillData(id){	
	var accessNumber=$('#accessNumber').val();
	var deputyNumber=$('#deputyNumber').val();
	
	var mobileRefg = /^1[3|5|8]\d{9}$/ , phoneReg = /^0\d{2,3}-?\d{7,8}$/;
	/*if(!(mobileRefg.test(accessNumber) || phoneReg.test(accessNumber))){
		art.dialog.tips("请填写正确的接入号!");
		return false;
	}*/
	if(!(mobileRefg.test(deputyNumber) || phoneReg.test(deputyNumber))){
		art.dialog.tips("请填写正确的副号!");
		return false;
	}
	$.post(getPath()+'/projectm/pmPhoneFjctmember/bindBillData',{memberId:id,accessNumber:accessNumber,deputyNumber:deputyNumber,recordFlag:$('#recordFlag').attr("checked")? "YES" : "NO",voiceId:$('#pmPhoneVoiceId').val(),dataIdBill:$('#dataIdBill').val()},function(res){
		if(res.STATE=='SUCCESS'){
			art.dialog.alert(res.MSG,function(){
				window.location.reload(); 
			});
		}else{
			art.dialog.alert(res.MSG);
		}
	},'json');
}

//回车查询
$(document).keydown(function(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		searchData();
     }
}); 

function getListDataParam(){
	var kw = $('#searchKeyWord').val();
	kw = kw.replace(/^\s+|\s+$/g,'');
	$('#searchKeyWord').val(kw);
	if(kw==$('#searchKeyWord').attr('defaultValue')){
		kw='';
	}
	if(kw==null || kw == ''){
		delete $list_dataParam['showNumber'];
	}else{
		$list_dataParam['showNumber'] = kw;
	}
	
	var state=$('#state').val();
	if(state==null || state == ''){
		delete $list_dataParam['state'];
	}else{
		$list_dataParam['state'] = state;
	}
	var phoneWay=$('#phoneWay').val();
	if(phoneWay==null || phoneWay == ''){
		delete $list_dataParam['phoneWay'];
	}else{
		$list_dataParam['phoneWay'] = phoneWay;
	}
	var partners=$('#parten').val();
	
	if(partners==null || partners == ''){
		delete $list_dataParam['partners'];
	}else{
		$list_dataParam['partners'] = partners;
	}
	
	var tree = $.fn.zTree.getZTreeObj($tree_container);
	var node = tree.getSelectedNodes();
	if(node!=null && node.length>0){
		if(node[0].id=='65a19487-c95e-44b1-859a-7cfa41aaa04a'){//全部客户
			delete $list_dataParam['customerId'];
			//getCurrentCustomerNumberPackageList();
		}else{
			$list_dataParam['customerId'] = node[0].id;
		}
	}
}

//导出
function exportSearch(){
	 getListDataParam();
	 if(!$list_dataParam['customerId']){
		 art.dialog.tips('请选择客户...');
		 return false;
	 }
	 var params=JSON.stringify($list_dataParam);
	 params=params.replace(/\{"/g,"");
	 params=params.replace(/\"}/g,"");
	 params=params.replace(/\":"/g,"=");
	 params=params.replace(/\","/g,"&");
	 var LoadFile=$("#downLoadFile");
	 LoadFile.attr("src",base+"/projectm/pmPhonemember/export?"+params);
}

