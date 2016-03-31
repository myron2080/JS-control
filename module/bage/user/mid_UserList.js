/**
 * 项目列表
 */
$list_viewUrl = getPath()+'/bage/user/list';
$list_editUrl = getPath()+'/bage/user/edit';
$list_addUrl = getPath()+'/bage/user/add';
$list_deleteUrl = getPath()+'bage/user/delete';
$list_editWidth = "870px";
$list_editHeight = "160px";
$list_dataType = "用户";//数据名称
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
        columns: [ 
            {display: '操作', name: 'operate', align: 'center', width: 220,render:operateRender},
            {display: '级别', name: 'memberLevel.name', align: 'left', width:80},
			{display: '姓名', name: 'name', align: 'left', width:80},
			{display: '用户名', name: 'userName', align: 'left', width:80,render:function(data){
				if(data.userName)return data.userName; else data.phone;
			}},
			{display: '昵称', name: 'nickName', align: 'left', width:80},
			{display: '电话', name: 'phone', align: 'left', width:80},
			{display: '电话线路ID', name: 'lineUserId', align: 'left', width:80},
			{display: '推荐人/电话', name: 'refereeId', align: 'left', width:150,render:function(data){
      				if(data.referee){
      				if(data.referee.name){
      				return data.referee.name+"/"+data.referee.phone;
      				}else{
      				return data.referee.phone;
      				}
      				}else{
      				return "";	
      				}
      			}},
			{display: '公司', name: 'company.name', align: 'left', width:150},
			{display: '身份证', name: 'idCard', align: 'left', width:120},
			{display: '性别', name: 'sex.name', align: 'left', width:60},
			{display: '注册日期', name: 'registerDate', align: 'left', width:100},
			{display: '未登录天数', name: 'noLoginDays', align: 'left', width:60,render:function(data){
				if(data.lastLoginTime){
				var now =new Date();  //开始时间
				var lastLoginTime=new Date(data.lastLoginTime);    //结束时间
				var date=now.getTime()-lastLoginTime.getTime();  //时间差的毫秒数
				//计算出相差天数
				var days=Math.floor(date/(24*3600*1000));
				return days;
				}else{
				return '';
				}
			}},
			{display: '好友数', name: 'friendCount', align: 'center', width:60,render:function(data){
      				if(data.friendCount>0){
      					var userName = data.phone;
      					if(data.name)userName = data.name;
      					return '<a href="javascript:friendListView({id:\''+data.id+'\',userName:\''+userName+'\'});">'+data.friendCount+'</a>'
      				}else{
      					return "0";	
      				}
      			}}
        ],
        url:getPath()+"/bage/user/listData",
        delayLoad:true
    }));
	selectList();
	//绑定事件
	$("#selectData").click(function(){
		selectList();
	});
	var params ={};
	params.width = 260;
	params.inputTitle = "注册日期";	
	MenuManager.common.create("DateRangeMenu","registerDate",params);


	$("#serchBtn").click(function(){
		selectList();
	});
	//清除
	$("#clearData").click(function(){
		MenuManager.menus["registerDate"].resetAll();
		delete $list_dataParam['sex'];
		delete $list_dataParam['noLoginDays'];
		delete $list_dataParam['cityId'];
		delete $list_dataParam['keyWord'];	
		$("#sex").val("");
		$("#noLoginDays").val("");
		$("#keyWord").attr("value", "姓名/昵称/电话/公司/身份证");
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
	$list_dataParam['userTypeStatus'] =$(".hover").attr("id");
	//注册时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["registerDate"]){
		queryStartDate = MenuManager.menus["registerDate"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["registerDate"].getValue().timeEndValue;
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
	var sex =   $("#sex").val();
		if(sex){
			$list_dataParam['sex'] = sex;
		} else{
			delete $list_dataParam['sex'];
		}
		var noLoginDays =   $("#sex").val();
		if(noLoginDays){
			$list_dataParam['sex'] = sex;
		} else{
			delete $list_dataParam['sex'];
		}
	var noLoginDays =  $("#noLoginDays").val();
	if(noLoginDays){
		noLoginDays = parseInt(noLoginDays);
		if(!isNaN(noLoginDays)){
			var time = getLastLoginDate(noLoginDays);
			$list_dataParam['lastLoginTime'] = new Date(time).format("yyyy-MM-dd");
		}
	}else{
		delete $list_dataParam['lastLoginTime'];
	}
		
	resetList();
}
function getLastLoginDate(n){
	var now=new Date();
	return now.setTime(now.getTime()-n*24*3600*1000);
}
/**
 * **************************************
 * 渲染操作项
 * **************************************
 * */
function operateRender(data,filterData){
	var e = (data.userTypeStatus=='NORMAL'?'BLACK':'NORMAL');
	var t = (data.userTypeStatus=='NORMAL'?'拉黑':'恢复');
	var str='';
	str+='<a href="javascript:setAccount({id:\''+data.id+'\'});">设置帐号| </a>';
	if(data.memberLevel.value=='REGULAR'){
	str+='<a href="javascript:updateToVip({id:\''+data.id+'\',memberLevel:\'VIP\'});">升级VIP| </a>';
	}else if(data.memberLevel.value=='VIP'){
		str+='<a href="javascript:updateToVip({id:\''+data.id+'\',memberLevel:\'REGULAR\'});">降为普通用户| </a>';	
	}
	str+='<a href="javascript:editRow({id:\''+data.id+'\'});">修改</a>| ';
	//str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">删除</a>|';
	//str+='<a href="javascript:deleteRow({id:\''+data.id+'\'});">拉黑</a>|';
	str+='<a href="javascript:updateUserType({id:\''+data.id+'\',userTypeStatus:\''+e+'\'});">'+t+'</a>';
	return str;	
}

function updateUserType(config){
	art.dialog.confirm('确定要进行该操作吗?',function(){
	$.post(getPath()+'/bage/user/updateUserType',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}

function updateToVip(config){
	art.dialog.confirm('确定要进行该操作吗?',function(){
	$.post(getPath()+'/bage/user/updateToVip',config,function(res){
		art.dialog.tips(res.MSG);
		if(res.STATE=='SUCCESS'){
			refresh();
		}
	},'json');
	});
}

function setAccount(data){
	var u = getPath()+"/bage/user/setAccountView";
	var paramStr = '?id='+data.id;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"设置帐号",
		 lock:true,
		 width:'430px',
		 height:'100px',
		 id:"USER-EDIT",
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
function friendListView(data){
	var u = getPath()+"/bage/user/user_FriendList";
	var paramStr = '?id='+data.id;
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:data.userName+"的好友",
		 lock:true,
		 width:'430px',
		 height:'500px',
		 id:"USER-FRIEND-LIST",
		 button:[{name:'关闭',callback:function(){
				flag = false;
				return true;
			}}],
		 close:function(){
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

