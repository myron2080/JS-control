$list_addUrl = getPath()+'/lunch/exceptionadvice/add';
$list_editUrl = getPath()+'/lunch/exceptionadvice/edit';
$list_deleteUrl = getPath()+'/lunch/exceptionadvice/delete';
$list_editWidth = "560px";
$list_editHeight = "300px";
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: '130',render:operateRender},
        	{display: '反馈用户', name: 'adviseUser.nickName', align: 'center', width:'100'},
			{display: '反馈时间', name: 'adviseDate', align: 'center', width:'100'},
			{display: '反馈时间', name: 'exception.name', align: 'center', width:'80'},
			{display: '反馈内容', name: 'adviseContent', align: 'center', width:'220'},
			{display: '状态', name: 'dealState.name', align: 'center', width:'80'},
			{display: '售柜', name: 'saleofark.id', align: 'center', width:'100'},
			{display: '受理人', name: 'acceptUser.name', align: 'center', width: '80'},
			{display: '受理时间', name: 'acceptDate', align: 'center', width: '100'},
			{display: '处理人', name: 'dealUser.name', align: 'center', width: '80'},
			{display: '处理时间', name: 'dealDate', align: 'center', width: '100'}
		  ],	
        url:getPath()+"/lunch/exceptionadvice/listData"
    }));

	$("#serchBtn").click(function(){
		selectList();
	});
	getCountByState();
	//清除
	$("#clearData").click(function(){
		delete $list_dataParam['adviseUserId'];
		delete $list_dataParam['exceptionType'];	
		$("#adviseUserId").val("");
		$("#adviseUserName").val("反馈用户");
		$("#excetionType").val("");
	});

	
});
function getCountByState(){
	$.post(getPath()+"/lunch/exceptionadvice/getCountByState",{},function(res){
    var obj =  res[0];
    var TATAL =parseInt(obj.NOTACCEPT_COUNT)+parseInt(obj.HASACCEPT_COUNT)+parseInt(obj.HASDEAL_COUNT);
	$("#ALL_COUNT").html("("+TATAL+")");
	$("#NOTACCEPT_COUNT").html("("+obj.NOTACCEPT_COUNT+")");
	$("#HASACCEPT_COUNT").html("("+obj.HASACCEPT_COUNT+")");
	$("#HASDEAL_COUNT").html("("+obj.HASDEAL_COUNT+")");
	},"json");
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
	//处理状态
	var dealState = $(".hover").attr("key");
	if(dealState!="ALL"){
	$list_dataParam['dealState'] = dealState;
	}else{
	delete $list_dataParam['dealState'];
	}
	//异常类型
	if($("#excetionType").val()!=""){
	$list_dataParam['exceptionType'] = $("#excetionType").val();
	}else{
		delete $list_dataParam['exceptionType'];
	}
	//反馈拥护
	if($("#adviseUserId").val()!=""){
		$list_dataParam['adviseUserId'] = $("#adviseUserId").val();
		}else{
			delete $list_dataParam['adviseUserId'];
		}
	getCountByState();
	resetList();
}

/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var returnStr = "";
	
	if(data.dealState.value=='NOTACCEPT'){//未受理
		 returnStr+='<a href="javascript:updateDealState(\''+data.id+'\',\'HASACCEPT\');">受理</a>';
	}
	if(data.dealState.value=='HASACCEPT'){
		 returnStr+='<a href="javascript:updateDealState(\''+data.id+'\',\'HASDEAL\');">处理</a>';
	}
	
	return returnStr;
}
function updateDealState(id,type){
	var flag = false;
	var url= base+"/lunch/exceptionadvice/dealView"
	var param= "?dataId="+id+"&type="+type;
	var dlg = art.dialog.open(url+param,
			{title:"设置帐号",
			 lock:true,
			 width:'430px',
			 height:'100px',
			 id:"DEAL",
			 button:[{name:type=="HASACCEPT"?"受理":"处理",callback:function(){
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

function updateProject(pid){
	var flag = false;
	var dlg = art.dialog.open(getPath()+"/p2p/investmentProject/add?id="+pid, {
		id : 'deal',
		width : 880,
		title:"",
		height : 420,
		lock:true,
		button : [ {
			className : 'aui_state_highlight',
			name : '保存',
			 callback: function () {
				 flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.addProject){
			 		dlg.iframe.contentWindow.addProject(dlg);
				}
				return false;
			 }
		} ],
		close:function(){
			if(flag)
				selectList();
		}
	
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
