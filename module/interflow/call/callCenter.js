/**
 * 内网平台--呼叫中心
 * 话务中心前期简易版本，用于html页面引入（后期2.0版本后使用callCenter_new.js，用于jsp页面）
 * @version 1.0
 * @author li.biao
 */
var CallCenter = {
		//连线sessionId
		callSessionId:'',
		//单次通话记录ID
		callRecordId:'',
		//定时器对象
		timeUnit:{h:0,m:0,s:0,timeObj:null},
		//去电号码
		showPhone:'',
		//获取URL参数
		getUrlParam:function(){
		    var argsArr = new Object();
		    // 获取URL中的查询字符串参数
		    var query = window.location.search.substring(1); //name=myname&password=1234&sex=male
		    // 这里的pairs是一个字符串数组
		    var pairs = query.split("&");
		    for(var i=0;i<pairs.length;i++){
		        var sign = pairs[i].indexOf("="); 
		        // 如果没有找到=号，那么就跳过，跳到下一个字符串（下一个循环）。
		        if(sign == -1){
		            continue; 
		        }
		        var aKey = pairs[i].substring(0,sign);
		        var aValue = pairs[i].substring(sign+1);       
		        argsArr[aKey] = unescape(aValue);
		    }
		    return argsArr;
		},
		//初始化
		init:function(){
			var params = CallCenter.getUrlParam();
			$("#toPhone").val(params["toPhone"]);
			$("#toName").val(params["toName"]);
			$("#span_toName").text(params["toName"]);
			
			//获取当前连接状态
			HuaBanCall.onGetState();
			var result = HuaBanCall.rtn ;
			if(result >= 1 ){//不是未连接状态
				//已经登录的获取呼叫人信息
				$.post(getPath()+'/interflow/call/getUserInfo',{},function(res){
					if(res && res.STATE == 'SUCCESS'){
						$("#div_callCenter").show();
						$("#div_noCall").hide();
						var callPerson = res.callPerson ;
						//设置呼叫人信息
						CallCenter.setCallUserInfo(callPerson);
						if(result == 1 || result == 2 ){//已连接，未登录状态
							CallCenter.loginCall();
						}else{
							CallCenter.dialPhone();
						}
					}else{
						$("#div_callCenter").hide();
						$("#div_noCall").show();
					}
				},'json');
			}else{
				CallCenter.addLog("reLogin", "重新登录");
				//重新登录
				CallCenter.login();
			}
		},
		//重新登录，获取当前用户信息，校验呼叫权限
		login:function(){
			$.post(getPath()+'/interflow/call/getUserInfo',{},function(res){
				if(res && res.STATE == 'SUCCESS'){
					$("#div_callCenter").show();
					$("#div_noCall").hide();
					var callPerson = res.callPerson ;
					//设置呼叫人信息
					CallCenter.setCallUserInfo(callPerson);
					//登录话伴接口
					CallCenter.loginCall();
				}else if(res && res.STATE == 'FAIL'){
					if(res.NOLOGIN){//未登录系统
						art.dialog.alert(res.NOLOGIN);
						$("#div_noCall").html("");
					}else if(res.isCall == 'NO'){
						//未拥有呼叫权限
					}
					$("#div_callCenter").hide();
					$("#div_noCall").show();
				}else{
					art.dialog.alert("未知错误："+res.MSG);
					CallCenter.setCtrlStatus("forbid",false);
				}
			},'json');
		},
		//设置呼叫人信息{cp:呼叫人}
		setCallUserInfo:function(cp){
			$("#orgId").val(cp.orgInterfaceId);
			$("#callPersonId").val(cp.id);
			$("#userId").val(cp.userId);
			$("#loginNumber").val(cp.loginNumber);
			$("#password").val(cp.password);
			$("#isLogin").val(cp.isLogin);
			//接听话机
			
			var answerPhone = "" ;
			if(cp.defaultAnswerPhone!=null && cp.defaultAnswerPhone!=""){
				answerPhone += cp.defaultAnswerPhone ;
			}else{
				answerPhone = "空" ;
			}
			$("#span_answerPhone").html(answerPhone);
			
			//去电显示
			var showPhone = "" ;
			if(cp.defaultShowPhone!=null && cp.defaultShowPhone!=""){
				showPhone += cp.defaultShowPhone ;
			}else{
				showPhone = "隐藏" ;
			}
			$("#span_showPhone").html(showPhone);
		},
		//登录话伴接口
		loginCall:function(){
			var userId = $("#userId").val();
			var callPersonId = $("#callPersonId").val();
			var loginNumber = $("#loginNumber").val();
   			var password = $("#password").val();
   			var orgId = $("#orgId").val();
   			
   			//登录话伴
   			HuaBanCall.onLogin(userId,password,orgId);
   			if(HuaBanCall.rtn == 0){//操作提交成功
   				
   			}else if (HuaBanCall.rtn == -1){//提交参数不合格
   				CallCenter.setPanelDynamicMsg("请求连接参数不合格");
   				CallCenter.setCtrlStatus("forbid",false);
   			}else{//其他失败
   				CallCenter.setPanelDynamicMsg("请求连接失败")
   				CallCenter.setCtrlStatus("forbid",false);
   			}
		},
		//登出接口
		logoutCall:function(){
			var callPersonId = $("#callPersonId").val();
			if(callPersonId!=null && callPersonId!=''){
				HuaBanCall.onLogout();
			}else{
				setTimeout(function(){art.dialog.close();},100);
			}
		},
		// 监听呼叫事件
		listenCallEvent : function(evCode, evDescrible) {
			
			//添加日志
			CallCenter.addLog(evCode, evDescrible);
			var callRtnObj = eval("("+evDescrible+")");
			if (callRtnObj.cmd == 'Login') {//登录
				if(evCode == 100){
					CallCenter.setPanelDynamicMsg("正在登录...");
				}else if(evCode == 200){//如果登录之后连接成功，检验号码正确，自动拨打
					CallCenter.setPanelDynamicMsg("连接成功");
					if($("#toPhone").val()!=''){
						CallCenter.dialPhone();
					}
				}else if(evCode == 404){
					CallCenter.setPanelDynamicMsg("登录失败...");
				}
			}else if(callRtnObj.cmd == 'DialPhone'){//呼叫
				CallCenter.setPanelDynamicMsg(CallCenter.getCallMsgByEventCode(evCode));
				if(evCode == 100){
					CallCenter.setCostTimeBar("clean");
					CallCenter.callSessionId = callRtnObj.session ;
					//切换图标状态
					CallCenter.setCtrlStatus("hook");
				}else if(evCode == 200){
				}else if(evCode == 132 ){//通话中
					CallCenter.setCostTimeBar("start");
				}else if(evCode == 201){//用户挂机
					CallCenter.setCostTimeBar("stop");
					CallCenter.setCtrlStatus("forbid",true);
					CallCenter.callRecordUpdate(callRtnObj.calldur);//更新呼叫记录
				}else if(evCode == 202){//通话结束
					CallCenter.callRecordId = '';
					CallCenter.callSessionId = '' ;
					CallCenter.setCtrlStatus("call");
					CallCenter.setCostTimeBar("stop");
				}else if(evCode == 500){//
					CallCenter.setCtrlStatus("error");
					CallCenter.setCostTimeBar("stop");
					CallCenter.callSessionId = '' ;
				}
			}else if(callRtnObj.cmd == 'Hook'){//挂断
				if(evCode == 100){
					CallCenter.setPanelDynamicMsg("正在挂断...");
					CallCenter.setCostTimeBar("stop");
					CallCenter.setCtrlStatus("forbid",true);
				}else if(evCode == 200){
					//CallCenter.callSessionId = '' ;
				}
			}else if(callRtnObj.cmd == 'GetAllSeatPhones'){//获取所有话机
				if(evCode == 200){
					$("#span_rd_answerPhone").html("");
					var apHtml = "" ;
					var seatPhoneList = callRtnObj.phonelist.split("|");
					for(var i = 0 ; i < seatPhoneList.length ; i ++ ){
						apHtml += "<input type='radio' name='rd_answerPhone' value='" ;
						apHtml += seatPhoneList[i] +"'" ;
						if(seatPhoneList[i] == callRtnObj.curphone){
							apHtml += " checked/>" ;
						}else{
							apHtml += " />" ;
						}
						apHtml += PhoneConversion(seatPhoneList[i]) ;
						apHtml += "<span style='margin-left:5px;'></span>" ;
					}
					$("#span_rd_answerPhone").html(apHtml);
					$("#p_answerPhone").hide();
					$("#p_answerPhone_edit").show();
				}
			}else if(callRtnObj.cmd == 'SwitchSeatPhone'){//切换话机
				if(evCode == 200){
					
				}else if(evCode == 404){
					CallCenter.setPanelDynamicMsg("操作失败");
				}
			}else if(callRtnObj.cmd == 'GetAllDispPhones'){//获取所有去电显示号码
				if(evCode == 200){
					$("#span_rd_showPhone").html("");
					var apHtml = "" ;
					var showPhoneList = callRtnObj.phonelist.split("|");
					for(var i = 0 ; i < showPhoneList.length ; i ++ ){
						apHtml += "<input type='radio' name='rd_showPhone' value='" ;
						apHtml += showPhoneList[i] +"'" ;
						if(showPhoneList[i] == callRtnObj.curphone){
							apHtml += " checked/>" ;
						}else{
							apHtml += " />" ;
						}
						apHtml += PhoneConversion(showPhoneList[i]) ;
						apHtml += "<span style='margin-left:5px;'></span>" ;
					}
					$("#span_rd_showPhone").html(apHtml);
					$("#p_showPhone").hide();
					$("#p_showPhone_edit").show();
				}
			}else if(callRtnObj.cmd == 'SwitchDispPhone'){//切换去电号码
				if(evCode == 200){
					if(CallCenter.showPhone){
						//保存到本地数据库
						CallCenter.saveShowPhone(PhoneConversion(CallCenter.showPhone));
					}
				}else if(evCode == 404){
					CallCenter.setPanelDynamicMsg("操作失败");
				}
			}else if(callRtnObj.cmd == 'systemreturn'){//系统返回
				CallCenter.setPanelDynamicMsg("系统错误");
			}
		},
		//呼叫
		dialPhone:function(){
			//获取一下当前连接状况
			HuaBanCall.onGetState();
			if(HuaBanCall.rtn == 0){
				CallCenter.setPanelDynamicMsg("呼叫线路未连接");
			}else{
				var toPhone = $("#toPhone").val();
				//去除空格
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
				if(toPhone == null || toPhone ==''){
					art.dialog.tips("请输入用户手机号码");
					return false ;
				}else if(!(CallCenter.checkMobile(toPhone) || CallCenter.checkPhone(toPhone))){
					art.dialog.tips("用户手机号码格式不正确");
					return false ;
				}
				//呼叫
				var converPhoneResult = NumberConversion(toPhone);
				if(converPhoneResult[0] > 0){//转换号码格式是否正确
					CallCenter.setPanelDynamicMsg("号码错误");
				}else{
					//获取一个正确的话单ID
					$.post(getPath()+"/interflow/call/selectCallBillId",{},function(res){
						if(res && res.STATE == 'SUCCESS'){
							HuaBanCall.onCall(converPhoneResult[1],res.CALLBILLID);//拨打号码，话单id
							if(HuaBanCall.rtn >= 0 ){
								CallCenter.callRecord('','',res.CALLBILLID);//记录呼叫记录
							}else{
								CallCenter.setPanelDynamicMsg("呼叫返回错误状态");
								CallCenter.setCtrlStatus("error");
								CallCenter.setCostTimeBar("stop");
							}
						}else{
							art.dialog.alert(res.MSG);
						}
					},'json');
				}
			}
		},
		//挂断
		callHook:function(){
			if(CallCenter.callSessionId!=null && CallCenter.callSessionId!=''){
				//挂断
				HuaBanCall.onHook(CallCenter.callSessionId);
				if(HuaBanCall.rtn == 0 ){
					
				}else{
					CallCenter.setPanelDynamicMsg("挂断失败");
				}
			}else{
				CallCenter.setCtrlStatus("call");
				CallCenter.setCostTimeBar("stop");
			}
		},
		//通话记录
		callRecord:function(toPhone,toName,callBillId){
			if(toPhone == null || toPhone == ''){
				toPhone = $("#toPhone").val();
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
			}
			if(toName == null || toName == ''){
				toName = $("#toName").val();
			}
			CallCenter.callRecordId = '' ;
			$.post(getPath()+'/interflow/call/record',{
				toPhone:toPhone,
				toName:toName,
				callBillId:callBillId
			},function(res){
				if(res && res.STATE == 'SUCCESS'){
					CallCenter.callRecordId = res.ID ;//记录单次通话ID
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		},
		//更新单次通话记录{callDur:通话时长}
		callRecordUpdate:function(callDur){
			if(CallCenter.callRecordId != null && CallCenter.callRecordId != ''){
				$.post(getPath()+'/interflow/call/recordUpdate',{
					recordId:CallCenter.callRecordId,
					callDur:callDur 
				},function(res){
					if(res && res.STATE == 'SUCCESS'){
						
					}else{
						art.dialog.alert(res.MSG);
					}
				},'json');
			}
		},
		//跟进监听码获取信息
		getCallMsgByEventCode:function(evCode){
			var msgHtml = "" ;
			switch(evCode){
				case 100:
					msgHtml = "正在拨号..." ;
					break ;
				case 121 :
					msgHtml = "接听话机振铃中..." ;
					break ;
				case 122 :
					msgHtml = "用户电话回铃..." ;
					break ;
				case 131 :
					msgHtml = "接听话机应答... " ;
					break ;
				case 132 :
					msgHtml = "通话中..." ;
					break ;
				case 201 :
					msgHtml = "用户挂机" ;
					break ;
				case 202 :
					msgHtml = "通话结束" ;
					break ;
				case 500 :
					msgHtml = "呼叫失败" ;
					break ;
				case 200 :
					msgHtml = "连接成功" ;
					break ;
				case 404 :
					msgHtml = "操作失败" ;
					break ;
				default : 
					msgHtml = "通话中..." ;
					break ;
			}
			return msgHtml ;
		},
		//设置呼叫面板的动态信息
		setPanelDynamicMsg:function(msg){
			$("span[id^='span_callStatus']").html(msg);
		},
		//添加日志
		addLog:function(code,rtnDesc){
			$("#div_callLog").html($("#div_callLog").html()+("<br/>"+code+":"+rtnDesc));
			if(code == '404' || code == '500'){//记录日志
				$.post(getPath()+"/interflow/call/addLog",{
					toName:CallCenter.getUrlParam()["toName"],
					toPhone:CallCenter.getUrlParam()["toPhone"],
					code:code,
					rtnDesc:rtnDesc
				},function(data){
					
				},'json');
			}
		},
		//设置控件按钮状态
		setCtrlStatus:function(showType,isReCall){
			$("p[id^='p_bar_']").hide();
			$("#p_bar_"+showType).show();
			if(showType == 'call'){
				HuaBanCall.onGetState();
				if(HuaBanCall.rtn == 0 ){
					CallCenter.setPanelDynamicMsg("呼叫线路未连接");
				}else{
					CallCenter.setPanelDynamicMsg("连接成功");
				}
			}else if(showType == 'forbid'){
				if(isReCall){//禁用，允许自动恢复到呼叫，延迟3秒
					setTimeout(function(){CallCenter.setCtrlStatus('call')},3000);
				}
			}
		},
		//管理呼叫通话计时器
		setCostTimeBar:function(type){
			CallCenter.timeUnit.h = 0 ;
			CallCenter.timeUnit.m = 0 ; 
			CallCenter.timeUnit.s = 0 ; 
			if(type == "start"){//计时开始
				CallCenter.timeCount();
			}else if(type == "stop"){//结束
				clearTimeout(CallCenter.timeUnit.timeObj);
			}else{//清空 clean
				$("#timeBar").html("00：00：00");
			}
		},
		//计时器
		timeCount:function(){
			CallCenter.timeUnit.s += 1 ;
			if(CallCenter.timeUnit.s == 60){
				CallCenter.timeUnit.m += 1;
				CallCenter.timeUnit.s = 0 ;
			}
			if(CallCenter.timeUnit.m == 60){
				CallCenter.timeUnit.h += 1 ;
				CallCenter.timeUnit.m = 0 ;
			}
			var timeStr = "" ;
			timeStr += (CallCenter.timeUnit.h<10) ? ("0"+CallCenter.timeUnit.h+"：") : (CallCenter.timeUnit.h+"：") ;
			timeStr += (CallCenter.timeUnit.m<10) ? ("0"+CallCenter.timeUnit.m+"：") : (CallCenter.timeUnit.m+"：") ;
			timeStr += (CallCenter.timeUnit.s<10) ? ("0"+CallCenter.timeUnit.s) : CallCenter.timeUnit.s ;
			$("#timeBar").html(timeStr);
			CallCenter.timeUnit.timeObj = setTimeout("CallCenter.timeCount()",1000)
		},
		//设置话机
		setSeatPhone:function(){
			//获取所有话机
			HuaBanCall.onGetAllSeatPhones();
			if(HuaBanCall.rtn!=0){
				CallCenter.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换话机
		switchSeatPhone:function(){
			var seatPhoneList = $("input[name='rd_answerPhone']");
			var phoneNo = "" ;
			for(var i = 0 ; i < seatPhoneList.length ; i ++){
				if(seatPhoneList[i].checked){
					phoneNo = seatPhoneList[i].value ;
					break ;
				}
			}
			if(phoneNo!=""){
				HuaBanCall.onSwitchSeatPhone(phoneNo);
				$("#span_answerPhone").html(PhoneConversion(phoneNo));
				if(HuaBanCall.rtn == 0 ){
					//保存到本地数据库
					CallCenter.saveSeatPhone(PhoneConversion(phoneNo));
				}else if(HuaBanCall.rtn = -1){
					art.dialog.tips("该号码不是接听话机");
				}else{
					art.dialog.tips("切换话机调用接口错误");
				}
			}
			$("#p_answerPhone").show();
			$("#p_answerPhone_edit").hide();
		},
		//设置去电号码
		setShowPhone:function(){
			//获取所有话机
			HuaBanCall.onGetAllDispPhones();
			if(HuaBanCall.rtn!=0){
				CallCenter.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换去电显示号码
		switchShowPhone:function(){
			var showPhoneList = $("input[name='rd_showPhone']");
			var phoneNo  ;
			for(var i = 0 ; i < showPhoneList.length ; i ++){
				if(showPhoneList[i].checked){
					phoneNo = showPhoneList[i].value ;
					HuaBanCall.onSwitchDispPhone(showPhoneList[i].value);
					break ;
				}
			}
			CallCenter.showPhone = phoneNo ;
			$("#span_showPhone").html("HIDE" == phoneNo ? "隐藏" : PhoneConversion(phoneNo));
			if(HuaBanCall.rtn == 0 ){
			}else if(HuaBanCall.rtn = -1){
				//art.dialog.tips("该号码不是去电号码");
			}else{
				//art.dialog.tips("切换去电号码调用接口错误");
			}
			$("#p_showPhone").show();
			$("#p_showPhone_edit").hide();
		},
		//更新本地切换话机
		saveSeatPhone:function(phoneNo){
			var callPersonId = $("#callPersonId").val();
			if(callPersonId!=null && callPersonId!=''){
				$.post(getPath()+'/interflow/call/switchSeatPhone',{
					callPersonId:callPersonId,
					phoneNo:phoneNo 
				},function(res){
					if(res && res.STATE == 'SUCCESS'){
						
					}else{
						art.dialog.alert(res.MSG);
					}
				},'json');
			}
		},
		//保存去电显示号码
		saveShowPhone:function(phoneNo){
			var callPersonId = $("#callPersonId").val();
			if(callPersonId!=null && callPersonId!=''){
				$.post(getPath()+'/interflow/call/switchShowPhone',{
					callPersonId:callPersonId,
					phoneNo:phoneNo 
				},function(res){
					if(res && res.STATE == 'SUCCESS'){
						
					}else{
						art.dialog.alert(res.MSG);
					}
				},'json');
			}
		},
		//手机号码匹配格式
		checkMobile:function(phoneNo){
			if (phoneNo)
				phoneNo = phoneNo.replace('\\s', '');
			return /^([+])?([0][8][6]|[8][6]|[0][0][8][6])?([-])?(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/
					.test(phoneNo);
		},
		//座机，固话匹配格式,格式必须为：0755-36510001
		checkPhone:function(phoneNo){
			if (phoneNo)
				 phoneNo = phoneNo.replace('\\s','');
			return /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/.test(phoneNo);
		},
		//插件加载
		pluginLoaded:function(){
			alert('话伴插件下载！');
		},
		//添加呼叫动态事件监听
		addEventListener:function(){
			if (window.addEventListener){
				document.getElementById("huaban").addEventListener("huabanevent", CallCenter.listenCallEvent, false); 
			}else{
				document.getElementById("huaban").attachEvent("on"+"huabanevent", CallCenter.listenCallEvent);
			} 
		}
};