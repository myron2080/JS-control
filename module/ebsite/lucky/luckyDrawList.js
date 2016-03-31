$list_editUrl = getPath() + "/ebsite/luckDraw/edit";// 编辑及查看url
$list_addUrl = getPath() + "/ebsite/luckDraw/add";// 新增url
$list_deleteUrl = getPath() + "/ebsite/luckDraw/delete";// 删除url
$list_editWidth = "760px";
$list_editHeight = "560px";
$list_dataType = "抽奖";//数据名称
$(document).ready(function() {
			$("#main").ligerLayout({});
			$list_dataGrid = $("#tableContainer").ligerGrid(
					$.extend($list_defaultGridParam, {
						columns : [ {
							display : '操作',
							name : 'operate',
							align : 'center',
							width : 226,
							render:operateRender
						}, {
							display : '活动名称',
							name : 'name',
							align : 'center',
							width : 126
						}, {
							display : '状态',
							/*name : 'status',*/
							align : 'center',
							width : 100,
							render: isUse
						}, {
							display : '开始时间',
							name : 'startTime',
							align : 'center',
							width : 126
						},  {
							display : '结束时间',
							name : 'endTime',
							align : 'center',
							width : 126
						},{
							display : '活动链接',
							/*name : 'activityUrl',*/
							align : 'center',
							width : 126,
							render:activeLink
						}, {
							display : '中奖名单',
							/*name : 'name',*/
							align : 'center',
							width : 126,
							render:winningList
						}, {
							display : '查看抽奖日志',
							/*name : 'name',*/
							align : 'center',
							width : 126,
							render:lotteryLog
						}],					
						url : getPath() + '/ebsite/luckDraw/listData',						
					}));
});

/**
 * 状态显示方法
 * 
 * @param data
 * @returns {String}
 */
function isUse(data) {
	if (data.status == 1) {
		return '启用';
	} else{
		return '<span style="color:red">禁用</span';
	}
}

//操作
function operateRender(data, filterData) {
	var str ="";
	str +='<a href="javascript:editRow({id:\''+ data.id + '\'});">编辑</a>|';	
	// 标记：启用；禁用可以删除
	if (data.status == 1) {
		str +='<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>|';
	} else {
		str +='<a href="javascript:deleteRow({id:\'' + data.id + '\'});">删除</a>|<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>|';
	} 
	str +='<a href="javascript:awardSettingRow({id:\''+ data.id + '\'});">奖项设置</a>';
	return str;
}

/**
 * 启用禁用；status：1表示启用；status:0表示禁用
 * 
 * @param data
 * @returns
 */
function onOff(data) {
	if (data.status == 1) {
		art.dialog.confirm('确定启用操作吗?', function() {
			$.post(getPath() + '/ebsite/luckDraw/onOff', { 
				id : data.id,
				eanble : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (data.status == 0) {
		art.dialog.confirm('确定禁用操作吗?', function() {
			$.post(getPath() + '/ebsite/luckDraw/onOff', {
				id : data.id,
				eanble : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					refresh();
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else {
		art.dialog.tips('参数有误，请联系管理员');
		var obj = {
			fileName : 'teamList.js',
			lineNumber : '131',
			msg : '程序开发参数传入异常，请联系ljw'
		};
		sysout(obj);
	}
}

//复制活动链接
function activeLink(data){
	var str="";
	var activityUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+$("#appId").val()+"&redirect_uri="+base+"/weixinapi/luckyplatform?url=/luckydrawapi/luckyIndex?actId="+data.id+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect ";
	 str +='<span style="color:#0000ff;cursor:pointer;" onclick="copyLink(this)" >复制链接</span><input value="'+ activityUrl +'" />';   //注：obj.select()不支持<a>标签，不支持<input>元素中的type="hidden"属性.
	return str;	
}

function copyLink(data){
	var inputObj=$(data).next();
	console.log(inputObj.val());
	inputObj.select();
	document.execCommand("Copy");
	/*alert("活动链接已复制到剪贴板!");*/
	art.dialog.tips("活动链接已复制到剪贴板!"); 
}

//奖项设置
function awardSettingRow(data)
{
	var dlg = art.dialog.open(getPath() + '/ebsite/luckDrawItem/list?luckyDrawId='+data.id,
			{title:'奖项设置',
			 lock:true,
			 width:'800px',
			 height:'600px',
			 id:data.id
			});
}

//查看中奖名单
function winningList(data) {
	var str="";
	str +='<a href="javascript:winningRecord({id:\''+ data.id + '\'});">查看中奖名单</a>';
	return str;	
}

//跳转中奖记录页面
function winningRecord()
{
	var dlg = art.dialog.open(getPath() + '/ebsite/luckywinningrecord/list',    
			{title:'中奖记录页面',
			 lock:true,
			 width:'800px',
			 height:'600px',
			 id:'winningRecord',
			 button:[{name:'关闭',callback:function(){
					flag = false;
					return true;
				}},{name:'导出',callback:function(){
/*					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveEdit){
						dlg.iframe.contentWindow.saveEdit(this);
					}*/
                    exportWinRecordExcel();					
					return false;
				}}],
			 close:function(){
				 searchData();
			 }
			});
}

//查看抽奖日志
function lotteryLog(data) {
	var str="";
	str +='<a href="javascript:LogRecord();">查看抽奖日志</a>';
	return str;	
}


//跳转抽奖记录页面
function LogRecord()
{
	var dlg = art.dialog.open(getPath() + '/ebsite/luckyrecord/list',
			{title:'抽奖记录页面',
			 lock:true,
			 width:'800px',
			 height:'600px',
			 id:'LogRecord'
			});
}

//导出中奖记录到Excel
function exportWinRecordExcel()
{
	window.location.href=base+"/ebsite/luckywinningrecord/exportExcel?";
}




