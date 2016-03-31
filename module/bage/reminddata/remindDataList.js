/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/bage/reminData/list';
$list_editUrl = getPath()+'/bage/reminData/edit';
$list_addUrl = getPath()+'/bage/reminData/add';
$list_deleteUrl = getPath()+'bage/user/delete';
$list_editWidth = "550px";
$list_editHeight = "200px";
$list_dataType = "用户";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 120,render:operateRender},
            {display: '客户姓名', name: 'customer.name', align: 'left', width:80},
			{display: '状态', name: 'remindStatus.name', align: 'left', width:80},
			{display: '电话1', name: 'customer.phone', align: 'left', width:100,render:function(data){
				if(data.customer&&data.customer.phone){return phoneFormart(data.customer.phone);}else{return '';}
			}},
			{display: '电话2', name: 'customer.phon2', align: 'left', width:100,render:function(data){
				if(data.customer&&data.customer.phone2){return phoneFormart(data.customer.phone2);}else{return '';}
			}},
			{display: '提醒内容', name: 'remindContent', align: 'left', width:150},
			{display: '提醒时间', name: 'remindDate', align: 'left', width:100},
			{display: '登记人', name: 'registrant.name', align: 'left', width:100,render:function(data){
			if(data.registrant)if(data.registrant.name)return data.registrant.name; else return data.registrant.nickName;	
			}},
			{display: '登记日期', name: 'createTime', align: 'left', width:100},
        ],
        url:getPath()+"/bage/reminData/listData",
    }));
	//绑定事件
	var params ={};
	params.width = 260;
	params.inputTitle = "提醒时间";	
	MenuManager.common.create("DateRangeMenu","remindDate",params);


	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
		MenuManager.menus["remindDate"].resetAll();
		delete $list_dataParam['keyWord'];	
		$("#keyWord").attr("value", "客户姓名/持有人/电话");
	});
	
	//回车操作
	inputEnterSearch("keyWord",selectList);

	
	//新增
	$("#add").click(function(){
		beforeAddRow();
	});
});

function beforeAddRow(){
	addRow({});
}

function setTab(name,aa){
	$(".hover").removeClass("hover");
	$(aa).addClass("hover");
	selectList();
}
/************************
 * 根据条件查询数据
 * **********************
 */

function selectList(){
	if($(".hover").attr("id")!="ALL"){
	$list_dataParam['status'] =$(".hover").attr("id");
	}else{
	delete $list_dataParam['status'];
	}
	
	//提醒时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["remindDate"]){
		queryStartDate = MenuManager.menus["remindDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["remindDate"].getValue().timeEndValue;
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
	var keyWord= $("#keyWord").val();
	if(keyWord && ($('#keyWord').attr("defaultValue") != keyWord)){
		$list_dataParam['keyWord'] = keyWord;
	} else{
		delete $list_dataParam['keyWord'];
	}
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var str='';
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>';
	//str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>';
	if(data.remindStatus.value!="DELETE")
	str+='<a href="javascript:updateRemindStatus({id:\''+data.id+'\',remindStatus:\'DELETE\'});">| 删除 </a>';
	return str;	
}

function updateRemindStatus(config){
	art.dialog.confirm('确定要进行该操作吗?',function(){
	$.post(getPath()+'/bage/reminData/updateStatus',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
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

