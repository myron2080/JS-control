$list_editUrl = getPath()+"/ebhouse/member/edit";//编辑及查看url
$list_addUrl = getPath()+"/ebhouse/member/add";//新增url
$list_deleteUrl = getPath()+"/ebhouse/member/delete";//删除url
$list_editWidth = "700px";
$list_editHeight = "456px";
$list_dataType = "会员新增";//数据名称
$(document).ready(function(){
	params ={};
	params.inputTitle = "注册时间";	
	MenuManager.common.create("DateRangeMenu","registerTime",params);
	$("#main").ligerLayout({leftWidth:200,minLeftWidth:200,allowLeftCollapse:true,allowLeftResize:true});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
      			{display: '会员手机号码', name: 'phone', align: 'left', width:130},
      			{display: '会员邮箱', name: 'email', align: 'left', width:130 },
      			{display: '真实姓名', name: 'name', align: 'left', width: 110 },
      			{display: '所在城市', name: 'city.id', align: 'left', width:130,render:function(data){
      				if(data.province){
      				return data.province.name+' '+data.city.name;}else{
      				return "";	
      				}
      			}},
      			{display: '性别', name: 'sex', align: 'left', width: 60},  
      			{display: '证件号码', name: 'cardType', align: 'left', width: 180,render:function(data){
      				if(data.cardNumber){
      				return data.cardType+'：'+data.cardNumber;}else{
      				return "";	
      				}
      			}}, 
      			{display: '注册时间', name: 'registerTime', align: 'left', width: 80}, 
      			{display: '注册来源', name: 'extraOne', align: 'center', width: 90,render:sourceFrom}, 
      			{display: '操作', name: 'operate', align: 'center', width: 150,render:operateRender}  
        ],
        url:getPath()+'/ebhouse/member/listData?memberList=memberList',
        delayLoad:false
    }));
	bindEvent();
});
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
function sourceFrom(data,filterData){
	if(data.extraOne=='MOBILE'){
		return "手机";
	}else{
		return "电脑";
	}
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
	//注册时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["registerTime"]){
		queryStartDate = MenuManager.menus["registerTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["registerTime"].getValue().timeEndValue;
	}
	
	//查询开始时间
	if(queryStartDate != ""){
		queryStartDate = queryStartDate.replace(/\//g,"-");
		$list_dataParam['queryStartDate'] = queryStartDate;
	} else {
		delete $list_dataParam['queryStartDate'];
	}
	//查询结束时间
	if(queryEndDate != ""){
		queryEndDate = queryEndDate.replace(/\//g,"-");
		$list_dataParam['queryEndDate'] = queryEndDate;
	} else {
		delete $list_dataParam['queryEndDate'];
	}
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
