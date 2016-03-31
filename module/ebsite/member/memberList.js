$list_editUrl = getPath()+'/ebsite/member/edit';
$list_editWidth="1320px";
$list_editHeight="450px";
$list_dataType = "会员";//数据名称
var isClick = false;//是否点击查询
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
					display : '操作',
					name : 'operate',
					align : 'center',
					width : 200,
					render : operateRender						
				}, {
					display : '姓名',
					name : 'realName',
					align : 'center',
					width : 120
				}, {
					display : '性别',
					name : 'sexName',
					align : 'center',
					width : 60
				}, {
					display : '昵称',
					name : 'nickName',
					align : 'center',
					width : 80
				}, {
					display : '账户',
					name : 'userName',
					align : 'center',
					width : 80							
				}, {
					display : '手机',
					name : 'mobilePhone',
					align : 'center',
					width : 80
					//render : mobileRender
				}, {
					display : '身份证',
					name : 'idcardno',
					align : 'center',
					width : 140		
					//render : emailRender
				}, {
					display : '出生日期',
					name : 'birthday',
					align : 'center',
					width : 120
				}, {
					display : 'email',
					name : 'email',
					align : 'center',
					width : 100							
				},  {
					display : '家庭地址',
					name : 'address',
					align : 'center',
					width : 80			
				}, {
					display : '注册时间',
					name : 'createTime',
					align : 'center',
					dateFormat:"yyyy-MM-dd HH:mm",formatters:"date",
					width : 150						
				}, {
					display : '注册IP',
					name : 'ipAddress',
					align : 'center',
					width : 100
				}, {
					display : '推荐人',
					name : 'recommended',
					align : 'center',
					width : 100
				} ],
				url : getPath() + '/ebsite/member/listData',
			}));
			params ={};
			params.inputTitle = "注册时间";	
			MenuManager.common.create("DateRangeMenu","effectTime",params);
			$("#serchBtn").click(function(){
				  selectList();
				  isClick = true;
				});  

			// 回车事件
			$('#keyWord').on('keyup', function(event) {
				if (event.keyCode == "13") {
					  selectList();
				}
			});

		});

/**
 * 操作
 * 
 * @param data
 * @returns {String}
 */
function operateRender(data) {
	// 标记：启用；禁用可以编辑
	var linkPa='';
	
	if (data.status == 1) {
		 if (hybj_permission == 'Y') {
			 linkPa+='<a href="javascript:onOff({id:\'' + data.id + '\',status:\'0\'});">禁用</a>';
		}
		 if ('Y'==xxsz_permission) {
			 linkPa+='|<a href="javascript:messageSetRemind({id:\'' + data.id + '\'});">消息设置</a>';
		}
	} else if (data.status == 0) {
		 if (hybj_permission == 'Y') {
			 linkPa+='<a href="javascript:onOff({id:\'' + data.id + '\',status:\'1\'});">启用</a>';
		}
	} else {
		// 不显示操作
		var obj = {
			fileName : 'memberList.js',
			lineNumber : '84',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
	linkPa+='|<a href="javascript:recommended({id:\'' + data.id + '\'});">我的推荐</a>';
	if (xxsz_permission== 'Y') {
		 linkPa+='|<a href="javascript:editRow({id:\'' + data.id + '\'});">编辑</a>';
	}
	return linkPa;
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
			$.post(getPath() + '/ebsite/member/onOff', {
				id : data.id,
				status : 1
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
			$.post(getPath() + '/ebsite/member/onOff', {
				id : data.id,
				status :0
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
			fileName : 'memberList.js',
			lineNumber : '131',
			msg : '程序开发参数传入异常'
		};
		sysout(obj);
	}
}
/**
 * 状态显示方法
 * 
 * @param data
 * @returns {String}
 */
function status(data) {
	if (data.status == 1) {
		return '启用';
	} else if (data.status == 0) {
		return '<span style="color:red">禁用</span';
	} else {
		// 不显示状态
		var obj = {
			fileName : 'memberList.js',
			lineNumber : '91',
			msg : '是否启用数据库对应的值不正确，请检查。'
		};
		sysout(obj);
	}
}

function editRow(data){
	var u = getPath()+"/ebsite/member/edit";	
	var paramStr = '?id='+data.id;
	$("#id").val(data.id);
	var flag = true;
	var dlg = art.dialog.open(u+paramStr,
		{title:"会员修改",
		 lock:true,
		 width:$list_editWidth||'auto',
		 height:$list_editHeight||'auto',
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
				 selectList();
			 }
		 }
		});
}
//查看行
function viewRow(rowData){
	$("#id").val(rowData.id);
	//可个性化实现
	if($list_editUrl && $list_editUrl!=''){
		var paramStr;
		if($list_editUrl.indexOf('?')>0){
			paramStr = '&VIEWSTATE=VIEW&id='+rowData.id;
		}else{
			paramStr = '?VIEWSTATE=VIEW&id='+rowData.id;
		}
		art.dialog.open($list_editUrl+paramStr,
				{title:getTitle('VIEW'),
				lock:true,
				width:$list_editWidth||'auto',
				height:$list_editHeight||'auto',
				id:$list_dataType+'-VIEW',
				button:[{name:'关闭'}]}
		);
	}
}
//我的推荐
function recommended(data){
	art.dialog.open(base + "/ebsite/member/recommended?id=" + data.id ,{
			title:"我的推荐",
			lock:true,
			width:"800px",
			height:"300px",
			id:"recommended",
			button:[{name:'关闭'}]
		}
	);
}
//查询
function selectList() {
	var keyWord = $("#keyWord").val().trim();
	if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
		$list_dataParam['keyWord'] = keyWord;
	} else {
		delete $list_dataParam['keyWord'];
	}
	var status = $("#status").val();
	if (status) {
		$list_dataParam['status'] = status;
	} else {
		delete $list_dataParam['status'];
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
	delete $list_dataParam['status'];
	$("#status").val('');
	$("#keyWord").attr("value", $("#keyWord").attr("defaultValue"));
	MenuManager.menus["effectTime"].resetAll();
	selectList();
}

function sendsmsPage(){
	art.dialog.data("sendsms",sendsms);//保存回调
	var dlg = art.dialog.open(getPath() + "/ebsite/member/oneClickSendPage", {
	    id : "sendsmsPage",
		title : '一键发送短信',
		background : '#333',
		width : 400,
		height : 220,
		lock : true,
		button:[{
			name:"确定",callback:function(){
				var smsBody = this.iframe.contentWindow.$("#smsBody").val();
				var select = this.iframe.contentWindow.$("#select").val();
				var mobilePhone = this.iframe.contentWindow.$("#mobilePhone").val();
				
				/**
				 * 手机验证
				 */
				var pattern = "^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$";
				var enterText = this.iframe.contentWindow.$("#enterText").val();
				var s = enterText.split("\n");
				if(smsBody == ""){
					art.dialog.tips("请输入消息内容");
					return false;
				} else if(smsBody.length > 200){
					art.dialog.tips("消息内容字符数不能大于200");
					return false;
				} else if(select == "1"){
					if(enterText == ""){
						art.dialog.tips("接收人不能为空");
						return false;
					} else if(!s[s.length-1].match(pattern) && s[s.length-1] != ""){
						art.dialog.tips("输入的手机号码格式错误");
						var current = s[s.length - 1];
						this.iframe.contentWindow.$("#enterText").val(enterText.replace(current,""));
						return false;
					} else{
						jQuery("body").append("<div class='fullbg'></div>");
					    jQuery(".fullbg").css("display","block");
					}
				} else if(select == "2"){
					if(mobilePhone == ""){
						art.dialog.tips("接收人不能为空");
						return false;
					}  else{
						jQuery("body").append("<div class='fullbg'></div>");
					    jQuery(".fullbg").css("display","block");
					}
				}
				$.post(getPath()+"/ebsite/member/oneClickSend",{
					id:this.iframe.contentWindow.$("#id").val(),
					smsBody:this.iframe.contentWindow.$("#smsBody").val(),
					select:this.iframe.contentWindow.$("#select").val(),
					enterText:enterText
				},function(data){
					jQuery(".fullbg").css("display","none");
					art.dialog.data(data.flag);
					art.dialog.tips(data.MSG, null, "succeed");
				},"json");
			}
		},{
			name:"关闭",callback:function(){
				flag = false;
			}
		}]
	});
}

function sendsms() {
	if(isClick){
		isClick = false;
		var realName = $("#realName").val();
		if (realName) {
			$list_dataParam['realName'] = realName;
		} else {
			delete $list_dataParam['realName'];
		}
		var mobilePhone = $("#mobilePhone").val();
		if (mobilePhone) {
			$list_dataParam['mobilePhone'] = mobilePhone;
		} else {
			delete $list_dataParam['mobilePhone'];
		}
	
		var idcardno = $("#idcardno").val();
		if (idcardno) {
			$list_dataParam['idcardnoh'] = idcardno;
		} else {
			delete $list_dataParam['idcardno'];
		}
	
		var keyWord = $("#keyWord").val();
		if (keyWord && ($('#keyWord').attr("defaultValue") != keyWord)) {
			$list_dataParam['keyWord'] = keyWord;
		} else {
			delete $list_dataParam['keyWord'];
		}
	
		var smsBody=art.dialog.data("smsBody");
		if(smsBody){
			$list_dataParam['smsBody'] = smsBody;
		}else{
			delete $list_dataParam['smsBody'];
		}
	}
		$.post(getPath() + "/ebsite/member/oneClickSend", $list_dataParam,
				function(data) {
					if (data.STATE == 'SUCCESS') {
						
						art.dialog.tips(data.MSG);
						setTimeout(function(){
							art.dialog.list['sendsmsPage'].close();
						},1000);
					} else {
						art.dialog.tips('发送失败');
					}
				}, 'json');
}
function enterSearch(e){
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		selectList();
    }  
}

/**
 * js输出日志
 * 
 * @param obj
 */
function sysout(obj) {
	console.info('file:' + obj.fileName + '--->line:' + obj.lineNumber + '---->msg:' + obj.msg);
}

/**
 * *************************************
 * 消息提醒设置
 * *************************************
 * */
function messageSetRemind(data){
	art.dialog.data("flag",false);
	var dlg = art.dialog.open(getPath()+'/ebsite/member/toMemberMessage?memberId='+data.id+'&fid=' + encodeURIComponent(data.id),
	{
		lock : true,
		id : "toMemberMessage",
		title : "消息提醒设置",
		width:550,
		height:200,
		button:[{
			name:"保存",callback:function(){
				$.post(getPath()+"/ebsite/membermessage/saveMessageSet",{memberId:this.iframe.contentWindow.$("#memberId").val(),newId:this.iframe.contentWindow.$("#newId").val()},function(data){
					art.dialog.data(data.flag);
					art.dialog.tips("保存成功", null, "succeed");
				});
			}
		},{
			name:"关闭",callback:function(){
				flag = false;
			}
		}]
	});
}

/**
 * 导出
 */
function importList(){
	var param = "";
	var keyWord = $("#keyWord").val().trim();
	if(keyWord == "姓名/身份证/手机"){
		keyWord = "";
	}
	var status = $("#status").val();
	var queryStartDate = "";
	var queryEndDate = "";
	var queryDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	if(queryStartDate == queryEndDate && queryEndDate != ""){
		queryDate = queryStartDate;
	}
	param += "keyWord=" + keyWord;
	param += "&status=" + status;
	param += "&queryStartDate=" + queryStartDate;
	param += "&queryEndDate=" + queryEndDate;
	param += "&queryDate=" + queryDate;
	
	window.location.href=base+"/ebsite/member/exportExcel?"+param;
}