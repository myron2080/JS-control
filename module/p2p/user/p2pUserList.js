$list_addUrl = getPath()+"/p2p/user/add";
$list_editUrl = getPath()+"/p2p/user/edit";
$list_deleteUrl = getPath()+"/p2p/user/delete";
$list_dataType = "客户";
$list_editWidth = 1000;
$list_editHeight = 500;
$(document).ready(function(){
	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		 rownumbers:true,
         delayLoad:true,
         height:'100%',
         paging:true,
         pageSize:30,
         url:getPath()+'/p2p/user/listData', 
         columns:[
                  {display: '姓名', name: 'name', align: 'center', width: 80,render:nameRender},
                  {display: '账户名', name: 'userName', align: 'center', width: 60},
                  {display: '手机号', name: 'mobileno', align: 'center', width: 80},
                  {display: '身份证号', name: 'idcardno', align: 'center', width: 140},
                  {display: '实名认证', name: 'realNameAuth', align: 'center', width: 80,render:realnameRender},
                  {display: '手机认证', name: 'mobileAuth', align: 'center', width: 80,render:mobileRender},
                  {display: '邮箱认证', name: 'emailAuth', align: 'center', width: 80,render:emailRender},
                  {display: '累计充值', name: 'lc', align: 'center', width: 80},
                  {display: '累计盈利', name: 'aa', align: 'center', width: 80,render:lyRender},
                  {display: '累计提现', name: 'lt', align: 'center', width: 80},
                  {display: '冻结金额', name: 'dj', align: 'center', width: 80},
                  {display: '可用余额', name: 'leftmoney', align: 'right', width: 80},
                  {display: '加入类型', name: 'registertypedesc', align: 'center', width: 60},
                  {display: '注册时间', name: 'createTime', align: 'center', width: 100},
                  {display: '注册ip', name: 'ipAddress', align: 'center', width: 100},
                  {display: '操作', name: '', align: 'left', width: 200,render:operateRender}
         ],
         onDblClickRow : function (data, rowindex, rowobj){
        	 userview(data.id);
         }
	}));
	resetList();
	
	$(document).keydown(function(e){
		var charCode= ($.browser.msie)?e.keyCode:e.which;  
		if(charCode==13){  
			searchuser();
	    }});
	
});
function lyRender(row,filterData){
	return row.leftmoney+row.dj-row.lc+row.yt;
}
function nameRender(row,filterData){
	if(row.vip=='YES'){
		return row.name+" <span style='color:red;float:right;'><img src='"+getPath()+"/default/style/images/p2p/smallvip.png"+"'></span>";
	}else{
		return row.name;
	}
}

function emailRender(row,filterData){
	if(row.emailAuth==1){
		return '已认证';
	}else{
		return '未认证&nbsp;&nbsp;<a href="javascript:toAuth(\''+row.id+'\',\'emailAuth\')">认证</a>';
	}
}

function realnameRender(row,filterData){
	if(row.realNameAuth==1){
		return '已认证';
	}else{
		return '未认证&nbsp;&nbsp;<a href="javascript:toAuth(\''+row.id+'\',\'realNameAuth\')">认证</a>';
	}
}

function mobileRender(row,filterData){
	if(row.mobileAuth==1){
		return '已认证';
	}else{
		return '未认证&nbsp;&nbsp;<a href="javascript:toAuth(\''+row.id+'\',\'mobileAuth\')">认证</a>';
	}
}
function toAuth(id,s){
	$.post(getPath()+"/p2p/user/toAuth?"+s+"=1",{id:id},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();
		}
	},'json');
}
function operateRender(row,filterData){
	var html = '';
	if(row.vip=='YES'){
		html += '<a href="javascript:operateVip(\''+row.id+'\',\'NO\');"> 取消vip </a>';
	}else{
		html += '<a href="javascript:operateVip(\''+row.id+'\',\'YES\');"> 升级vip </a>';
	}
	if(row.realNameAuth == 1){
		html += '<a href="javascript:recharge(\''+row.id+'\');"> 充值 </a>';
		html += '<a href="javascript:outputmoney(\''+row.id+'\');"> 提现 </a>';
	}
	html += '<a href="javascript:editUser(\''+row.id+'\');"> 修改 </a>';
	if(row.registertype=='BACKGROUND'){
		html += '<a href="javascript:delUser(\''+row.id+'\');"> 删除 </a>';
	}
	return html;
}

function searchuser(){
	 var keyword = $("#keyword").val();
	 if(keyword=='账号/身份证/手机号/姓名') keyword = '';
	 var param = {};
	 param.keyword = keyword;
	 if($("#realNameAuth").val()) param.realNameAuth = $("#realNameAuth").val();
	 if($("#mobileAuth").val()) param.mobileAuth = $("#mobileAuth").val();
	 if($("#emailAuth").val()) param.realNameAuth = $("#emailAuth").val();
	 $list_dataParam = param;	
	 resetList();
}

function editUser(id){
	editRow({'id':id});
}

function delUser(id){
	deleteRow({'id':id});
}

function operateVip(id,s){
	$.post(getPath()+"/p2p/user/updateSelective",{id:id,vip:s},function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips(data.MSG);
			resetList();
			
		}
	},'json');
}

function userview(id){
	art.dialog.open(getPath() +"/p2p/user/userview?id="+id,
			{
				id : "userDetailPage",
				title : '会员查看',
				background : '#333',
				width : 830,
				height : 550,
				lock : true	 
				});
}

function recharge(id){
	 
	var dlg = art.dialog.open(getPath() +"/p2p/shiftinList/add?userid="+id,
			{
				id : "recharge",
				title : '充值',
				background : '#333',
				width : 830,
				height : 150,
				lock : true,
				button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
				});
}

function outputmoney(id){
	var dlg = art.dialog.open(getPath() +"/p2p/withdrawList/add?userid="+id,
			{
				id : "withdraw",
				title : '提现',
				background : '#333',
				width : 830,
				height : 150,
				lock : true,
				button:[{name:'确定',callback:function(){
					if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.saveAdd){
						dlg.iframe.contentWindow.saveAdd(this);
					}
					return false;
				}},{name:'取消',callback:function(){
					
					return true;
				}}]
				});
}