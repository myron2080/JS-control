$list_editUrl = getPath()+"/ebhouse/member/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebhouse/member/add";//新增url
$list_deleteUrl = getPath()+"/ebhouse/member/delete";//删除url
$list_editWidth = "700px";
$list_editHeight = "456px";
$list_dataType = "会员新增";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '会员手机号码', name: 'phone', align: 'center', width:130},
      			{display: '真实姓名', name: 'name', align: 'center', width: 110 },
      			{display: '性别', name: 'sex', align: 'center', width: 60},  
      			{display: '证件号码', name: 'cardType', align: 'center', width: 180,render:function(data){
      				if(data.cardNumber){
      				return data.cardType+'：'+data.cardNumber;}else{
      				return "";	
      				}
      			}}, 
      			{display: '购房启动金', name: 'startGold', align: 'center', width: 80,columns:[{display: '启动金额', name: 'startGold', align: 'center', width: 80,render:startGold},
      			                                                              			{display: '是否认证', name: 'isRel', align: 'center', width: 80},
      			                                                            			{display: '使用金额', name: 'useStartGold', align: 'center', width: 80},
      			                                                            			{display: '购房日期', name: 'startGoldUseDate', align: 'center', width: 80},
      			                                                            			{display: '使用项目', name: 'houseProject.name', align: 'center', width: 80}]},
      			{display: '装修启动金', name: 'decStartGold', align: 'center', width: 80,columns:[{display: '装修启动金', name: 'decStartGold', align: 'center', width: 80,render:decStartGold},
      			                                                                 			{display: '装修日期', name: 'decStartGoldUseDate', align: 'center', width: 80},
      			                                                                			{display: '专修公司', name: 'decorateCompany.name', align: 'center', width: 80},
      			                                                                			{display: '装修余额', name: 'useDecStartGold', align: 'center', width: 80}]},
      			
      			{display: '搬家启动金', name: 'moveStartGold', align: 'center', width: 80,columns:[{display: '搬家启动金', name: 'moveStartGold', align: 'center', width: 80,render:moveStartGold},
      			                                                                  			{display: '搬家日期', name: 'moveStartGoldUseDate', align: 'center', width: 80},
      			                                                                			{display: '搬家公司', name: 'moveCompany.name', align: 'center', width: 80},
      			                                                                			{display: '搬家余额', name: 'useMoveStartGold', align: 'center', width: 80}]}
      			
        ],
        url:getPath()+'/ebhouse/member/startGoldData',
        delayLoad:false
    }));
	bindEvent();
});
function startGold(data){
	$("#useStartGold1").text(data.startGold);
	if(data.startGoldUseDate){
		return data.startGold+"|　已使用";
	}else{
		return data.startGold+"|  <a style='cursor: pointer;' href='javascript:void(0)' onclick='userStartGold(\""+data.id+"\")'>使用</a>";
	}
}
var dialogs ;
function userStartGold(uid){
	dialogs = art.dialog({
		title:'使用购房启动金',
		width:360,
		height:200,
		content:$("#userStartGold").get(0),
		 button:[{name:'确定',callback:function(){
				saveOption(uid,1);
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}]
	});
}
function userDecStartGold(uid){
	dialogs=art.dialog({
		title:'使用装修启动金',
		width:360,
		height:200,
		content:$("#userDecStartGold").get(0),
		 button:[{name:'确定',callback:function(){
				saveOption(uid,2);
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}]
	});
}
function userMoveStartGold(uid){
	dialogs =art.dialog({
		title:'使用搬家启动金',
		width:360,
		height:200,
		content:$("#userMoveStartGold").get(0),
		 button:[{name:'确定',callback:function(){
				saveOption(uid,3);
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}]
	});
}
function saveOption(userID,type){
	var json = {};
	json.uid=userID;
	json.type=type;
	if(type==1){
		json.startGoldUseDate=$("#startGoldUseDate").val();
		json.houseProject=$("#houseProject").val();
	}
	if(type==2){
		json.decorateCompany=$("#decorateCompany").val();
		json.decStartGoldUseDate = $("#decStartGoldUseDate").val();
		json.useDecStartGold = $("#useDecStartGold").val();
	}
	if(type==3){
		json.moveStartGoldUseDate = $("#moveStartGoldUseDate").val();
		json.useMoveStartGold = $("#useMoveStartGold").val();
		json.moveCompany = $("#moveCompany").val();
	}
	$.post(getPath()+'/ebhouse/member/saveOption',json,function(data){
		art.dialog({content:data.MSG,time:1});
		dialogs.close();
		selectList();
	},"json");
}

function userStart(data){
	if(data.decStartGoldUseDate){
		return data.decStartGold;
	}
}
function decStartGold(data){
	$("#useStartGold2").text(data.decStartGold);
	if(data.decStartGoldUseDate){
		return data.decStartGold+" | 已使用";
	}else{
		return data.decStartGold+" |   <a style='cursor: pointer;' href='javascript:void(0)' onclick='userDecStartGold(\""+data.id+"\")'>使用</a>";
	}
	
}
function moveStartGold(data){
	$("#useStartGold3").text(data.moveStartGold);
	if(data.moveStartGoldUseDate){
		return data.moveStartGold+"| 已使用";
	}else{
		return data.moveStartGold+"|   <a style='cursor: pointer;' href='javascript:void(0)' onclick='userMoveStartGold(\""+data.id+"\")'>使用</a>";
	}
	
}
function eventFun(obj){
	$(obj).blur(function(){
		if(!$(obj).val() || ($(obj).val() == "")){
			$(obj).val($(obj).attr("defaultValue"));
		}
	}).focus(function(){
		if($(obj).val() && ($(obj).val() == $(obj).attr("defaultValue"))){
			$(obj).val("");
		}else {
			$(obj).select();
		}
	});
}
function operateRender(data,filterData){
	var e = (data.status=='ENABLE'?'DISABLED':'ENABLE');
	var t = (data.status=='ENABLE'?'禁用':'启用');
		return '<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>|'
		+'<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>|'
		+'<a href="javascript:enableRow({id:\''+data.id+'\',status:\''+e+'\'});">'+t+'</a>|'
		+'<a href="javascript:restPwd({id:\''+data.id+'\'});">重置密码</a>';
		
}

function bindEvent(){
	//查询
	$("#selectData").click(function(){
		selectList();
	});
	eventFun($("#keyConditions"));
    //新增
    $("#add").click(function(){
	 beforeAddRow();
     });
    $("#keyConditions").keydown(function(e){
    	enterSearch(e);
	});
    }
function enableRow(config){
	$.post(getPath()+'/ebhouse/member/enable',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
}

function getAddRowParam(){

	var row = $list_dataGrid.getSelectedRow();
	if(row){
		return {parent:row.id};
	}
	return null;
}

function beforeAddRow(){
	addRow({});
}
function restPwd(member){
	var u = getPath()+"/ebhouse/member/resPwdView";
	var paramStr = '?id='+member.id;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"密码重置",
		 lock:true,
		 width:'270px',
		 height:'180px',
		 id:"MEMBER-EDIT",
		 button:[{name:'确定',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
					dlg.iframe.contentWindow.saveEdit();
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
			 if(flag){
				 if(typeof(afterEditRow)=='function'){
					 afterEditRow();
				 }
				 refresh();
			 }
		 }
		});
}
/************************
 * 根据条件查询数据
 * **********************
 */
function selectList(){
	var keyConditions= $("#keyConditions").val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	} else{
		delete $list_dataParam['keyConditions'];
	}
	var querySort = $("#querySort").val();
	$list_dataParam['querySort'] = querySort;
	resetList();
}
/**
 ***************************
 ** 回车查询
 ***************************
 */
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}
