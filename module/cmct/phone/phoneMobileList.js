$list_editUrl = getPath()+"/cmct/phoneMobile/edit";//编辑及查看url
$list_addUrl = getPath()+"/cmct/phoneMobile/add";//新增url
$list_deleteUrl = getPath()+"/cmct/phoneMobile/delete";//删除url
$list_takeCostUrl = getPath()+"/cmct/phoneMobile/takeCost";
$list_setShowUrl = getPath()+"/cmct/phoneMobile/setShow";
$list_toBindUrl = getPath()+"/cmct/phoneMobile/toBind";
$list_billUrl = getPath()+"/cmct/phoneMobileBill/list";
$list_demoUrl = getPath()+"/cmct/phoneMobile/demo";
$list_deleteDataUrl = getPath()+"/cmct/phoneMobile/deleteData";
$list_editWidth = "530px";
$list_editHeight = "220px";
$list_dataType = "线路";//数据名称
$(document).ready(function(){
	
	 $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 columns: [ 
		            {display: '操作', name: '', align: 'center', width: 240,render:operateRender},
		            {display: '用户ID', name: 'userId', align: 'left', width: 100,height:40},
		            {display: '手机号码', name: 'showPhone', align: 'left', width: 100,height:40},
		            {display: '姓名', name: 'objectName', align: 'left', width: 100,height:40},
		            {display: '剩余分钟数', name: '', align: 'center', width: 100,height:40},
		            {display: '累计充值金额', name: '', align: 'left', width: 100,height:40},
		            {display: '累计充值分钟', name: '', align: 'left', width: 100,height:40},
		            {display: '累计赠送分钟', name: '', align: 'left', width: 100,height:40},
		            {display: '扣除分钟', name: '', align: 'center', width: 100,height:40}
		        ],
        delayLoad:true,
        url:getPath()+'/cmct/phoneMobile/listData',
        onAfterShowData:function(gridData){	
	    	loadCumulative(gridData);
	    },
	    onDblClickRow:function(rowData,rowIndex,rowDomElement){
	    	showRecord(rowData);
	    }
    }));
	searchData();
	
	$('#searchBtn').bind('click',function(){
		searchData();
	});
	
	
});

function showRecord(rowData){
	art.dialog.open(getPath()+'/cmct/phoneMobile/showRecord?userId='+rowData.userId+"&memberId="+rowData.id,
			{title:'线路查看',
			lock:true,
			width:'730px',
			height:'520px',
			id:'showRecord',
			button:[{name:'关闭'}]}
	);
}

function loadCumulative(gridData){	
	var userIds="";
	if(gridData && gridData.items){	
		var dataItems = gridData.items;
		for(var i = 0 ; i < dataItems.length ; i ++){
			userIds+=dataItems[i].userId+",";
		}
		if(userIds){
			userIds=userIds.substring(0,userIds.length-1);
		}
		$.post(getPath() + '/cmct/phoneMobile/getCumulative',{userIds:userIds},function(res){
			if(res.details){
				var details=res.details;
				for(var i = 0 ; i < dataItems.length ; i ++){
					var tdId1 = "";
					var tdId2 = "";
					var tdId3 = "";
					var tdId4 = "";
					var tdId5 = "";
					
					if(i+1<10){
						tdId1 = "tableContainer|2|r100"+(i+1)+"|c106"
						tdId2 = "tableContainer|2|r100"+(i+1)+"|c107"
						tdId3 = "tableContainer|2|r100"+(i+1)+"|c108"
						tdId4 = "tableContainer|2|r100"+(i+1)+"|c109"
						tdId5 = "tableContainer|2|r100"+(i+1)+"|c110"
					}else if((i+1)<=100){
						tdId1 = "tableContainer|2|r10"+(i+1)+"|c106"
						tdId2 = "tableContainer|2|r10"+(i+1)+"|c107"
						tdId3 = "tableContainer|2|r10"+(i+1)+"|c108"
						tdId4 = "tableContainer|2|r10"+(i+1)+"|c109"
						tdId5 = "tableContainer|2|r10"+(i+1)+"|c110"
					}else{
						tdId1 = "tableContainer|2|r"+(i+1)+"|c106"
						tdId2 = "tableContainer|2|r"+(i+1)+"|c107"
						tdId3 = "tableContainer|2|r"+(i+1)+"|c108"
						tdId4 = "tableContainer|2|r"+(i+1)+"|c109"
						tdId5 = "tableContainer|2|r"+(i+1)+"|c110"
					}
					var rowObj = dataItems[i];
					for(var k = 0 ; k < details.length ; k ++){
						if($.trim(rowObj.userId) == $.trim(details[k].USERID)){
							$("td[id='"+tdId1+"'] div").html(details[k].REMAIN_MIN);
							$("td[id='"+tdId2+"'] div").html(details[k].CUMULATIVE_TAKEAMOUNT?details[k].CUMULATIVE_TAKEAMOUNT.toFixed(2):"");
							$("td[id='"+tdId3+"'] div").html(details[k].CUMULATIVE_TAKEMIN);
							$("td[id='"+tdId4+"'] div").html(details[k].CUMULATIVE_GIVEMIN);
							$("td[id='"+tdId5+"'] div").html(details[k].CUMULATIVE_DEDUCTMIN);
							break;
						}
					}
				}
			}
		},'json');
	}
}

function operateRender(data){
	var str='';
	str+='<a href="javascript:takeCost({id:\''+data.id+'\'});">充值</a>|';
	str+='<a href="javascript:setShow({id:\''+data.id+'\'});">设置来电显示</a>|';
	str+='<a href="javascript:toBind({id:\''+data.id+'\'});">改绑</a>';
//	str+='<a href="javascript:toBill({userId:\''+data.userId+'\'});">|详单</a>';
	str+='<a href="javascript:demo({id:\''+data.id+'\'});">|拨打测试</a>';
	str+='<a href="javascript:deleteData({id:\''+data.id+'\',userId:\''+data.userId+'\'});">|注销</a>';
	return str;
}


function deleteData(data){
	art.dialog.confirm('确定注销?',function(){
		$.post($list_deleteDataUrl,{id:data.id,userId:data.userId},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				if(typeof(afterDeleteRow)=='function'){
					afterDeleteRow();
				}
				refresh();
			}
		},'json');
		return true;
	},function(){
		return true;
	});
}
/**
 * 测试电话
 * @param data
 */
function demo(data){
	art.dialog.open($list_demoUrl+"?id="+data.id,
			{title:'详单',
			 lock:true,
			 width:'400px',
			 height:'120px',
			 id:'demo',
			 button:[{name:'关闭',callback:function(){
					return true;
				}}]
			});
}


function takeCost(data){
	var flag = true;
	var dlg = art.dialog.open($list_takeCostUrl+"?id="+data.id,
			{title:'充值',
			 lock:true,
			 width:$list_editWidth||'auto',
			 height:$list_editHeight||'auto',
			 id:'takeCost',
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

function toBill(data){
	art.dialog.open($list_billUrl+"?userId="+data.userId,
			{title:'详单',
			 lock:true,
			 width:'750px',
			 height:'500px',
			 id:'toBill',
			 button:[{name:'关闭',callback:function(){
					return true;
				}}]
			});
}

function setShow(data){
	var flag = true;
	var dlg = art.dialog.open($list_setShowUrl+"?id="+data.id,
			{title:'设置来电显示',
			 lock:true,
			 width:"400px",
			 height:"120px",
			 id:'takeCost',
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

function toBind(data){
	var flag = true;
	var dlg = art.dialog.open($list_toBindUrl+"?id="+data.id,
			{title:'改绑',
			 lock:true,
			 width:"400px",
			 height:"120px",
			 id:'takeCost',
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

function searchData(){
	var key = $("#key").val();
	if(key!="" && key!=null && key!=$("#key").attr("dValue")){
		$list_dataParam['key'] = key;
	}else{
		delete $list_dataParam['key'];
	}
	$list_dataParam['phoneType'] = 'GL';
	resetList();
}
