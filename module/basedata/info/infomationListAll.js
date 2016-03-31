$(document).ready(
		function() {
			$("#main").ligerLayout({});
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [ 
//						            {
//							display : '消息模块',
//							name : 'moduleTypeName',
//							align : 'left',
//							width : 120
//						}, 
						{
							display : '提醒内容',
							name : 'content',
							align : 'left',
							width : 420
						}, {
							display : '提醒时间',
							name : 'createDate',
							align : 'left',
							width : 120
						}, {
							display : '操作',
							name : 'operate',
							align : 'center',
							width : 120,
							render : operateRender
						} ],
						delayLoad : true,
						url : getPath() + '/basedata/info/listData'
					}));

			$("div[class=system_tab_title] li").click(function() {
				$(this).addClass("hover").siblings("li").removeClass("hover");
				var key = $(this).attr("key");
				searchData();
			});

			$("div[class=system_tab_title] li[class='hover']").click();

		});

function searchData() {
	var key = $("div[class=system_tab_title] li[class='hover']").attr("key");
	if (key != "") {
		$list_dataParam['status'] = key;
	} else {
		delete $list_dataParam['status'];
	}
	resetList();
}
function operateRender(data, filterData) {
	var str = '';
	if(data.moduleType == "BROKER_CUSTOMER") {
		str = '<a href="#" onclick="showCsm({id:\'' + data.moduleId+ '\'})">查看</a>';
	}
	
	if(data.moduleType == "FASTSALE") {
		str = '<a href="#" onclick="viewCustomer({id:\'' + data.moduleId+ '\'},{id:\'' + data.id+ '\'},this)">查看</a>';
	}
	if(data.moduleType == "SCHEDULE") {//查看日程
		str = '<a href="#" onclick="viewSchedule({id:\'' + data.moduleId+ '\'},{id:\'' + data.id+ '\'},this)">查看</a>';
	}
	
	if(data.status != "YES_CHECK") {
		if(str){
			str += '|';
		}
		str += '<a href="#" onclick="updateStatus({id:\'' + data.id+ '\'},this);" >查阅</a>'
	}
	
	return str;
}
/**
 * 显示日程信息
 * @param id
 */
function viewSchedule(rowdata,sid,obj){
	var test=obj.parentNode.lastChild;
	var dlg = art.dialog.open(getPath()+"/interflow/schedule/edit?id="+rowdata.id+"&VIEWSTATE=VIEW",{
		title:'我的日程',
		 lock:true,
		 width:'800px',
		 height:'510px',
		 id:"viewCustomer",
		close:function(){
			if(test != "查看"){
				resetList();
			}
		}
	});
	if(test.innerText != "查看"){
		updateStatus(sid,test);//更新查阅
	}
}

/**
 * 更新状态
 * 
 * @param rowdata
 */
function updateStatus(rowdata) {
		$.post(getPath() + "/basedata/info/updateStatus", {
			id : rowdata.id,
			status : 'YES_CHECK'
		}, function(res) {
			if (res.STATE == 'SUCCESS') {
				resetList();
			} else {
				art.dialog.tips("出现异常:可能网络问题，请稍后再试！");
			}
		}, 'json');
}

/**
 * 显示客户信息
 */
function showCsm(rowdata) {
	$.post(base+"/broker/customerManager/isPrivate",{id:rowdata.id},function(res){
		if(res.status=="PUBLIC"){
			var dlg = art.dialog.open(base + "/broker/customerManager/manager?id="
					+ rowdata.id + "&nextpage=false", {
				id : 'add',
				title : '客户信息',
				background : '#333',
				width : 820,
				height : 550,
				lock : true,
				cancelVal : '关闭',
				cancel : true
			});
		}else{
			art.dialog.tips("该客户已被设置为私客，无法查看！");
		}
	},"json");
}
/**
 * 显示新房客户信息
 * @param id
 */
function viewCustomer(rowdata,sid,obj){
	var test=obj.parentNode.lastChild;
	var dlg = art.dialog.open(getPath()+"/fastsale/intention/intentionView?id="+rowdata.id+"&type=",{
		title:'客户查看',
		 lock:true,
		 width:'800px',
		 height:'510px',
		 id:"viewCustomer",
		close:function(){
			if(test != "查看"){
				resetList();
			}
			//searchData();
		}
	});
	if(test.innerText != "查看"){
		updateStatus(sid,test);//更新查阅
	}
}