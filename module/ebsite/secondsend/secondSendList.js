$list_viewUrl = getPath()+'/secondSend/list';
$list_editUrl = getPath()+'/ebsite/secondSend/edit';
$list_deleteUrl =getPath()+'/secondSend/delete';
$list_editWidth="1050px";
$list_editHeight="550px";
$list_dataType = "补寄单";//数据名称
$(document).ready(function() {
	if(($(document.body).height() * 0.8) < 550){
		$list_editHeight=($(document.body).height() * 0.8)+"px";
	}
	
	if(($(document.body).width() * 0.8) < 1050){
		$list_editWidth=($(document.body).width()*0.8)+"px";
	}
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid(
			$.extend($list_defaultGridParam, {
				
				columns : [ {
					display : '业务操作',
					name : 'operate',
					align : 'center',
					width : 120,
					render : operateRender
					}, {
					display : '编码',
					name : 'number',
					align : 'center',
					width : 120
				},{
					display : '状态',
					name : 'statusName',
					align : 'center',
					width : 80
				},
				{
					display : '订单编码',
					name : 'order.orderNo',
					align : 'center',
					width : 120, 
					isSort:false,
				    render : orderNoRender
				},
				{
					display : '配送分店',
					name : 'storage.name',
					align : 'center',
					width : 100
				}, {
					display : '配送时间',
					name : 'sendTime',
					align : 'center',
					width : 100,
					
				}, {
					display : '备注',
					name : 'notes',
					align : 'center',
					width : 180,
					
					} ],
			
				url : getPath() + '/ebsite/secondSend/listData',
				 onDblClickRow:function(rowData,rowIndex,rowDomElement){
			        	viewInstorageDetail(rowData);
				 }
			}));
			params ={};
			params.inputTitle = "补寄时间";	
			MenuManager.common.create("DateRangeMenu","effectTime",params);
			$("#serchBtn").click(function(){
				  selectList();
				});  

			// 回车事件
			$('#keyWord').on('keyup', function(event) {
				if (event.keyCode == "13") {
					  selectList();
				}
			});

		});

/**
 * 操作  审批通过？已审批：驳回
 * 
 * @param data
 * @returns {String}
 */

function operateRender(data) {
	var str='';
	if(bjsh_permission=='Y' && bjsh_permission!='undifined'){
		if (data.status == "NOAPPROVAL") {  //未审批
		/*	str+='<a href="javascript:editRow(\'' + data.id + '\');">编辑| </a>';*/
			str+='<a href="javascript:approve({id:\''+data.id+'\',status:\'INAPPROVAL\'});">审批</a>';
	    } if(data.status == 'APPROVALED'){
		    // return '';
		     
		   str+='';
		} if(data.status == 'REJECTED'){
			//return '';
			str+='';
		}
	}
	return str;	
}
  //补寄单查看
function viewInstorageDetail(data){
	var url = getPath() + "/ebsite/secondSend/secondSendView?id=" + data.id;
	var dlg = art.dialog.open(url,{
		 title:"补寄单查看",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"secondSendView",
		 button:[{name:'关闭',callback:function(){
				return true;
		}}]
	});
}

//显示订单详情
function orderNoRender(data){
	if(data.order && data.order.id){
		//return '<a href="javascript:void(0);" onclick="viewInstorageDetail(\''+data.inStorage.id+'\');">'+data.inStorage.number+'</a>';
		return '<a href="javascript:void(0);" onclick="showDetail(\'' + data.order.id + '\');">'+data.order.orderNo+'</a>';
	}else{
		return "";
	}
}

function showDetail(id){
	var url = getPath() + "/ebsite/order/showDetail/" + id;
	var dlg = art.dialog.open(url,
			{title:'订单细节',
			 lock:true,
			 width:(window.screen.width * 49 /100)+"px",
			 height:(window.screen.width * 30 /100)+"px",
			 id:'showDetail',
			 button:[{name:'关闭',callback:function(){
					return true;
				}}]
			});
}

function approve(data) {
	var title = "审批";
	if(data.status == 'REJECTED'){
		title = "驳回";
	}
	var url = getPath()+"/ebsite/secondSend/toApproval?id=" + data.id + "&status=" + data.status;   //
	
	var flag = true;
	var dlg = art.dialog.open(url,{
		 title:"补寄单审批",
		 lock:true,
		 width:$list_editWidth,
		 height:$list_editHeight,
		 id:"secondSendApproval",
		 button:[{name:'同意',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.agree){
					dlg.iframe.contentWindow.agree(dlg);
				}
				return false;
			}},{name:'不同意',callback:function(){
				if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.disagree){
					dlg.iframe.contentWindow.disagree(dlg);
				}
				return false;
			}},{name:'取消',callback:function(){
				flag = false;
				return true;
			}}],
			 close:function(){
			 if(flag){
				 refresh();
			 }
		 }
	});
}




//查询
function selectList() {
	var keyWord = $("#keyWord").val().trim();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var storageList = $("#storageList").val();
	if(storageList){
		$list_dataParam['storageList'] = storageList;
	} else{
		delete $list_dataParam['storageList'];
	}
	
	// 提醒时间
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	if(queryStartDate == queryEndDate && queryEndDate != ""){
		$list_dataParam['queryDate'] = queryStartDate;
	}else{
		// 查询开始时间
		if(queryStartDate != ""){
			$list_dataParam['queryStartDate'] = queryStartDate;
		} else {
			delete $list_dataParam['queryStartDate'];
		}
		// 查询结束时间
		if(queryEndDate != ""){
			$list_dataParam['queryEndDate'] = queryEndDate;
		} else {
			delete $list_dataParam['queryEndDate'];
		}
		delete $list_dataParam['queryDate'];
	}
	resetList();
}
// 清空
function onEmpty() {
	delete $list_dataParam['keyWord'];
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	$("#storageList").val("");
	MenuManager.menus["effectTime"].resetAll();
	selectList();
}


function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}


