/**
 * 铁通电话平台 
 * @version 1.0
 * @author li.biao
 * @since 2014-4-17
 */
var TTPlatCall = {
		//声明页面元素
		declare:{
			isShowMsg:false,//是否显示短信，如果显示目前需要自己手动
			isShowPhone:false,//是否显示电话号码
			objectId:'',//$("#customerId").val()
			toName:'',//$("#customerName").val();
			toPhone:'',//$("#customerPhone").val();
			loginSuccContainer:'',//登录成功后号码显示状态
			phoneContainer:'',//电话控件显示容器
			phoneShowContainer:'',//电话状态显示容器
			privateFlag:'',//是否私有
			phoneProtect:'',//是否保护电话号码
			callLogContainer:'',//日志容器
			callLogDo:'',//操作是否显示日志ID
			timeBar:''//计时器容器
		},
		//线路成员信息
		lineUser:{
			orgId:'',//$("#orgId")
			callPersonId:'',//$("#callPersonId")
			userId:'',//$("#userId")
			password:'',//$("#password")
			loginNumber:''//$("#loginNumber")
		},
		//连线sessionId
		callSessionId:'',
		//单次通话记录ID
		callRecordId:'',
		//单次通话话单ID
		callBillId:'',
		//呼叫关联对象ID
		callLinkObjectId:'',
		//定时器对象
		timeUnit:{h:0,m:0,s:0,timeObj:null},
		//去电号码
		showPhone:'',
		//当前去电号码
		currShowPhone:'',
		//隐藏号码
		hidePhone:'',
		//是否允许呼叫
		isAllowCall:true,
		//是否选择线路
		isSelectLine:false,
		//是否要挂断坐席
		isHookSelf:true,
		//线路类型
		lineType:'',
		//呼叫发起时间
		callSendTime:0,
		//是否已经登录
		isLogin:false,
		isEnd:false,
		recallTimeObj:null,
		//呼叫索引
		dialIndex:0,
		//挂断索引
		hookIndex:0,
		//获取呼叫参数
		getCallParam:function(){
		    var argsArr = new Object();
		    argsArr["objectId"] = $("#"+TTPlatCall.declare.objectId).val();
		    argsArr["toName"] = $("#"+TTPlatCall.declare.toName).val();
		    argsArr["toPhone"] = $("#"+TTPlatCall.declare.toPhone).val();
		    return argsArr;
		},
		//注册
		register:function(){
			TTPlatCall.addEventListener();
			TTPlatCall.setPhoneUlHTML();
			TTPlatCall.setPhoneShowStatusHtml();
			TTPlatCall.login();
		},
		//初始化
		init:function(){
			TTPlatCall.callLinkObjectId = TTPlatCall.getCallParam()["objectId"];
			//设置电话信息的显示内容
			//TTPlatCall.setPhoneLiShow();
			if(TTPlatCall.isLogin){
				TTPlatCall.setCtrlStatus("call");
			}else{
				TTPlatCall.setCtrlStatus("selectLine");
			}
		},
		//设置呼叫线路信息{cp:呼叫线路信息}
		setCallUserInfo:function(cp){
			TTPlatCall.lineUser.orgId = cp.orgInterfaceId ;
			TTPlatCall.lineUser.callPersonId = cp.id ;
			TTPlatCall.lineUser.userId = cp.userId ;
			TTPlatCall.lineUser.password = cp.password ;
			TTPlatCall.lineUser.loginNumber = cp.loginNumber ;
			if(cp.setType!=null && cp.setType!=''){
				TTPlatCall.lineType = cp.setType ;
			}
		},
		//登录话伴接口
		login:function(){
			//已经登录的获取呼叫人是否已经有选择过的空闲线路
			$.post(getPath()+'/cmct/phonenew/getUserInfo',{},function(res){
				if(res && res.STATE == 'SUCCESS'){
					var callSet = res.callSet ;
					//设置呼叫人信息
					TTPlatCall.setCallUserInfo(callSet);
					var userId = callSet.userId ;
		   			var password = callSet.password ;
		   			var orgId = callSet.orgInterfaceId ;
		   			
		   			//登录话伴
		   			TTAsk.onLogin(userId,password,orgId);
		   			if(TTAsk.rtn == 0){//操作提交成功
		   				TTPlatCall.setPanelDynamicMsg("正在登录...");
		   				TTPlatCall.setCtrlStatus("call");
		   			}else if (TTAsk.rtn == -1){//提交参数不合格
		   				TTPlatCall.setPanelDynamicMsg("请求连接参数不合格");
		   				TTPlatCall.setCtrlStatus("forbid",false);
		   				TTPlatCall.isAllowCall = false ;
		   			}else{//其他失败
		   				TTPlatCall.setPanelDynamicMsg("请求连接失败")
		   				TTPlatCall.setCtrlStatus("forbid",false);
		   				TTPlatCall.isAllowCall = false ;
		   			}
				}else if(res && res.STATE == 'FAIL'){
					//未找到空闲线路，自己选择
					TTPlatCall.setCtrlStatus("selectLine",false);
					TTPlatCall.setPanelDynamicMsg("未连接");
				}else{
					//未登录系统
					TTPlatCall.setCtrlStatus("forbid",false);
					TTPlatCall.isAllowCall = false ;
				}
			},'json');
		},
		//登录话伴接口
		loginCall:function(){
			var userId = TTPlatCall.lineUser.userId;
   			var password = TTPlatCall.lineUser.password;
   			var orgId = TTPlatCall.lineUser.orgId;
   			//登录话伴
   			TTAsk.onLogin(userId,password,orgId);
   			if(TTAsk.rtn == 0){//操作提交成功
   				TTPlatCall.setPanelDynamicMsg("正在登录...");
   				TTPlatCall.setCtrlStatus("call");
   			}else if (TTAsk.rtn == -1){//提交参数不合格
   				TTPlatCall.setPanelDynamicMsg("请求连接参数不合格");
   				TTPlatCall.setCtrlStatus("forbid",false);
   				TTPlatCall.isAllowCall = false ;
   			}else{//其他失败
   				TTPlatCall.setPanelDynamicMsg("请求连接失败")
   				TTPlatCall.setCtrlStatus("forbid",false);
   				TTPlatCall.isAllowCall = false ;
   			}
		},
		//登出接口
		logoutCall:function(){
			var callPersonId = TTPlatCall.lineUser.callPersonId;
			if(callPersonId!=null && callPersonId!=''){
				TTAsk.onLogout();
			}else{
				setTimeout(function(){art.dialog.close();},100);
			}
		},
		// 监听呼叫事件
		listenCallEvent : function(evCode, evDescrible) {
			//添加日志
			TTPlatCall.addLog(evCode, evDescrible);
			var callRtnObj = eval("("+evDescrible+")");
			if (callRtnObj.cmd == 'Login') {//登录
				if(evCode == 100){
					TTPlatCall.setPanelDynamicMsg("正在登录...");
				}else if(evCode == 200){//如果登录之后连接成功，检验号码正确，自动拨打
					TTPlatCall.setLoginSuccPanel();
					$("#"+TTPlatCall.declare.loginSuccContainer).show();
					TTPlatCall.isLogin = true ;
					TTPlatCall.setPanelDynamicMsg("连接成功");
					//记录呼叫线路
					//if(TTPlatCall.isSelectLine){
						TTPlatCall.remarkLine();
					//}
					//获取所有去电号码
					TTPlatCall.setShowPhone();
					//获取所有接听话机
					TTPlatCall.setSeatPhone() ;
					
				}else if(evCode == 404){
					TTPlatCall.setPanelDynamicMsg("登录失败...");
				}
			}else if(callRtnObj.cmd == 'DialPhone'){//呼叫
				TTPlatCall.setPanelDynamicMsg(TTPlatCall.getCallMsgByEventCode(evCode));
				if(evCode == 100){
					TTPlatCall.setCostTimeBar("clean");
					//切换图标状态
					TTPlatCall.setCtrlStatus("hook",false,TTPlatCall.dialIndex);
					var responseTime = (new Date()).getTime();
					//记录呼叫记录（服务器响应成功）
					TTPlatCall.callRecord('','',TTPlatCall.callBillId,(responseTime - TTPlatCall.callSendTime));
				}else if(evCode == 200){
				}else if(evCode == 132 ){//通话中
					TTPlatCall.isHookSelf = false ;//建立通话的时候，比较不用手动挂断坐席，交由接口系统挂断
					TTPlatCall.setCostTimeBar("start");
					TTPlatCall.setCallResultPanelShow(1);
				}else if(evCode == 201){//用户挂机
					TTPlatCall.setCostTimeBar("stop");
					TTPlatCall.setCtrlStatus("forbid",true,TTPlatCall.dialIndex);
					TTPlatCall.callRecordUpdate(callRtnObj.calldur,'C_128');//更新呼叫记录（呼叫成功）
				}else if(evCode == 202){//通话结束
					TTPlatCall.callSessionId = '' ;
					TTPlatCall.setCtrlStatus("call",false,TTPlatCall.dialIndex);
					TTPlatCall.isEnd = true ;
					TTPlatCall.setCostTimeBar("stop");
					//匿名呼出则切换到显示呼出
					if(TTPlatCall.currShowPhone == TTPlatCall.hidePhone){
						TTPlatCall.switchShowPhone();
					}
				}else if(evCode == 404){//
					TTPlatCall.setCtrlStatus("error",false,TTPlatCall.dialIndex);
					TTPlatCall.setCostTimeBar("stop");
					TTPlatCall.callRecordUpdate('','C_127','404_操作失败');//更新呼叫记录（404操作失败）
				}else if(evCode == 500){//
					TTPlatCall.setCtrlStatus("error",false,TTPlatCall.dialIndex);
					TTPlatCall.setCostTimeBar("stop");
				}
			}else if(callRtnObj.cmd == 'Hook'){//挂断
				if(evCode == 100){
					var time = TTPlatCall.getCallCostTime() ;
					TTPlatCall.setPanelDynamicMsg("正在挂断...");
					TTPlatCall.setCostTimeBar("stop");
					TTPlatCall.setCtrlStatus("forbid",true,TTPlatCall.hookIndex);
					if(TTPlatCall.callRecordId!=null && TTPlatCall.callRecordId!=''){
						TTPlatCall.callRecordUpdate(time, 'C_125', '坐席挂机...');
					}
				}else if(evCode == 200){
					//没有200
				}
			}else if(callRtnObj.cmd == 'GetAllSeatPhones'){//获取所有话机
				if(evCode == 200){
					
				}
			}else if(callRtnObj.cmd == 'SwitchSeatPhone'){//切换话机
				
			}else if(callRtnObj.cmd == 'GetAllDispPhones'){//获取所有去电显示号码
				if(evCode == 200){
					var seatPhoneList = callRtnObj.phonelist.split("|");
					TTPlatCall.currShowPhone = callRtnObj.curphone ;
					for(var i = 0 ; i < seatPhoneList.length ; i ++ ){
						if("HIDE" == seatPhoneList[i]){
							TTPlatCall.hidePhone = seatPhoneList[i] ;
						}else{
							TTPlatCall.showPhone = seatPhoneList[i];
						}
					}
					if(TTPlatCall.currShowPhone == TTPlatCall.hidePhone){
						$("#font_currShowPhone").text("匿名呼出");
						$("#a_changeDispPhone").text("换成显示呼出");
						$("#a_changeDispPhone").parents("b").removeClass("graybtn");
						$("#a_changeDispPhone").parents("b").addClass("orangebtn");
						//匿名呼叫自动切换成显示呼出
						TTPlatCall.switchShowPhone();
					}else{
						$("#font_currShowPhone").text(PhoneConversion(TTPlatCall.showPhone));
						$("#a_changeDispPhone").parents("b").removeClass("orangebtn");
						$("#a_changeDispPhone").parents("b").addClass("graybtn");
						$("#a_changeDispPhone").text("换成匿名呼出");
					}
					if(TTPlatCall.showPhone == ""){
						$("#b_btnChange").hide();
					}else{
						$("#b_btnChange").show();
					}
					//暂时隐藏 since 2013-10-15 by li.biao
					$("#b_btnChange").hide();
				}
			}else if(callRtnObj.cmd == 'SwitchDispPhone'){//切换去电号码
				if(evCode == 200){
					if(TTPlatCall.currShowPhone){
						//保存到本地数据库
						TTPlatCall.saveShowPhone(PhoneConversion(TTPlatCall.currShowPhone));
					}
					var dispText = $("#a_changeDispPhone").text() ;
					if(dispText == "换成匿名呼出"){
						$("#font_currShowPhone").text("匿名呼出");
						$("#a_changeDispPhone").text("换成显示呼出");
						$("#a_changeDispPhone").parents("b").removeClass("graybtn");
						$("#a_changeDispPhone").parents("b").addClass("orangebtn");
						TTPlatCall.currShowPhone  = TTPlatCall.hidePhone ;
					}else{
						$("#font_currShowPhone").text(PhoneConversion(TTPlatCall.showPhone));
						$("#a_changeDispPhone").parents("b").removeClass("orangebtn");
						$("#a_changeDispPhone").parents("b").addClass("graybtn");
						$("#a_changeDispPhone").text("换成匿名呼出");
						TTPlatCall.currShowPhone  = TTPlatCall.showPhone ;
					}
				}else if(evCode == 404){
					TTPlatCall.setPanelDynamicMsg("操作失败");
				}
			}else if(callRtnObj.cmd == 'Logout'){//登出
				if(evCode == 200){
					TTPlatCall.setPanelDynamicMsg("未连接");
					TTPlatCall.setCtrlStatus("selectLine");
					$("#"+TTPlatCall.declare.loginSuccContainer).hide();
				}else if(evCode == 404){
					TTPlatCall.setPanelDynamicMsg("登出失败...");
				}
			}else if(callRtnObj.cmd == 'systemreturn'){//系统返回
				if(callRtnObj.state == "ForceOffLine"){
					TTPlatCall.setPanelDynamicMsg("您的账号在另一地点登陆，您被迫下线");
				}else{
					TTPlatCall.setPanelDynamicMsg("系统错误");
				}
			}
			
			//500详细提醒
			var errorMsg = "" ;
			if(evCode == 500){
				var failres = callRtnObj.failres ;
				if(failres!=null && failres!=''){
					//500错误详细原因
					errorMsg = TTPlatCall.get500MsgByEventCode(failres) ;
					TTPlatCall.setPanelDynamicMsg(errorMsg);
				}
				var callres = callRtnObj.callres ;
				if(callres!=null && callres!=''){
					errorMsg = TTPlatCall.get500MsgByEventCode(callres) ;
					TTPlatCall.setPanelDynamicMsg(errorMsg);
				}
				var noRes = callRtnObj.nResult ;
				if(noRes!=null && noRes!=''){
					errorMsg = TTPlatCall.get500MsgByEventCode(noRes) ;
					TTPlatCall.setPanelDynamicMsg(errorMsg);
				}
			}
			//呼叫失败
			if(callRtnObj.cmd == 'DialPhone' && evCode == 500){
				TTPlatCall.callRecordUpdate(callRtnObj.calldur,'C_127',errorMsg);//更新呼叫记录（呼叫失败）
			}
			if(callRtnObj.cmd == 'DialPhone' && (evCode == 500 || evCode == 404)){
				TTPlatCall.setCallResultPanelShow(0);
			}
		},
		//获取呼叫时间{单位：秒}
		getCallCostTime:function(){
			var h = TTPlatCall.timeUnit.h;
			var m = TTPlatCall.timeUnit.m; 
			var s = TTPlatCall.timeUnit.s; 
			var time = h*60*60 + m*60 + s ;
			if(time == null || isNaN(parseInt(time))){
				time = '' ;
			}
			return time ;
		},
		//呼叫
		dialPhone:function(index,realPhone){
			//获取一下当前连接状况
			TTAsk.onGetState();
			if(TTAsk.rtn == 0){
				TTPlatCall.setPanelDynamicMsg("未连接");
			}else{
				//判断电话线路
				if(TTPlatCall.callSessionId!=null && TTPlatCall.callSessionId!=''){
					TTAsk.onGetCallLineState(TTPlatCall.callSessionId);
					//会话已释放||空闲||对方挂机||本地挂机可以进行下一次拨号
					if(TTAsk.rtn == -1 || TTAsk.rtn == 0 
							|| TTAsk.rtn == 8 || TTAsk.rtn == 9 ){
						
					}else{
						TTPlatCall.setPanelDynamicMsg("上通呼叫还在处理中，请稍后...");
						TTPlatCall.addLog("404", "上通呼叫还在处理中...");
						return false ;
					}
				}
				if(!TTPlatCall.isAllowCall){
					return false ;
				}
				var toPhone = realPhone || $("#span_customerPhone_"+index).text() ;
				//去除空格
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
				if(toPhone == null || toPhone ==''){
					art.dialog.tips("请输入用户手机号码");
					return false ;
				}else if(!(TTPlatCall.checkMobile(toPhone) || TTPlatCall.checkPhone(toPhone))){
					art.dialog.tips("用户手机号码格式不正确");
					return false ;
				}
				if(TTPlatCall.currShowPhone == TTPlatCall.hidePhone){
					art.dialog.confirm("确定要匿名呼叫吗？",function(){
						TTPlatCall.callPhone(toPhone,index,"HIDE");
					});
				}else{
					TTPlatCall.callPhone(toPhone,index);
				}
			}
		},
		//呼叫号码
		callPhone:function(toPhone,index,showPhone){
			//呼叫
			var converPhoneResult = NumberConversion(toPhone);
			if(converPhoneResult[0] > 0){//转换号码格式是否正确
				TTPlatCall.setPanelDynamicMsg("号码错误");
			}else{
				if(TTPlatCall.recallTimeObj){
					clearTimeout(TTPlatCall.recallTimeObj);
				}
				TTPlatCall.isEnd = false ;
				TTPlatCall.dialIndex = index ;
				//呼叫处理中...禁止操作
				TTPlatCall.setCtrlStatus("forbid",false,index);
				var btime = (new Date()).getTime();
				//获取一个正确的话单ID
				var billId = TTAsk.getCallBillId(TTPlatCall.lineUser.orgId);
				if(billId){
					TTPlatCall.callBillId = billId ;
					TTPlatCall.isHookSelf = true ;//如果通话连接未建立之前挂断，标记需要挂断坐席
					TTAsk.onCall(converPhoneResult[1],billId,showPhone);//拨打号码，话单id
					if(TTAsk.rtn >= 0 ){
						TTPlatCall.callSessionId = TTAsk.rtn ;//记录用户线路session
						var etime = (new Date()).getTime();
						TTPlatCall.callSendTime = etime ;
					}else{
						TTPlatCall.setPanelDynamicMsg("呼叫返回错误状态");
						TTPlatCall.setCtrlStatus("error",false,index);
						TTPlatCall.setCostTimeBar("stop");
					}
				}
			}
		},
		//呼叫线路是否已经完成
		callLineIsComplete:function(){
			//判断电话线路
			if(TTPlatCall.callSessionId!=null && TTPlatCall.callSessionId!=''){
				TTAsk.onGetCallLineState(TTPlatCall.callSessionId);
				//会话已释放||空闲||对方挂机||本地挂机可以进行下一次拨号
				if(TTAsk.rtn == -1 || TTAsk.rtn == 0 
						|| TTAsk.rtn == 8 || TTAsk.rtn == 9 ){
					return true ;
				}else{
					return false ;
				}
			}
			return true ;
		},
		//挂断
		callHook:function(index){
			if(TTPlatCall.callSessionId!=null && TTPlatCall.callSessionId!=''){
				TTPlatCall.hookIndex = index ;
				//挂断处理中...禁止操作
				TTPlatCall.setCtrlStatus("forbid",false,index);
				//挂断被叫
				TTAsk.onHook(TTPlatCall.callSessionId);
				if(TTAsk.rtn == 0 ){
					//是否要挂断坐席
					if(TTPlatCall.isHookSelf){
						var selfSessionId = 0 ;
						TTAsk.onHook(selfSessionId);
					}
				}else{
					TTPlatCall.setPanelDynamicMsg("挂断失败");
				}
			}else{
				TTPlatCall.setCtrlStatus("call",false,index);
				TTPlatCall.setCostTimeBar("stop");
			}
		},
		//通话记录
		callRecord:function(toPhone,toName,callBillId,time){
			if(toPhone == null || toPhone == ''){
				toPhone = $("#"+TTPlatCall.declare.toPhone).val();
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
			}
			if(toName == null || toName == ''){
				toName = $("#"+TTPlatCall.declare.toName).val();
			}
			TTPlatCall.callRecordId = '' ;
			$.post(getPath()+'/cmct/phonenew/record',{
				toPhone:toPhone,
				toName:toName,
				currShowPhone:TTPlatCall.currShowPhone,
				callBillId:callBillId,
				objectId:TTPlatCall.callLinkObjectId,
				time:time,
				callLineId:TTPlatCall.lineUser.callPersonId 
			},function(res){
				if(res && res.STATE == 'SUCCESS'){
					TTPlatCall.callRecordId = res.ID ;//记录单次通话ID
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		},
		//更新单次通话记录{callDur:通话时长,callResult:状态,remark:备注，time:耗时}
		callRecordUpdate:function(callDur,callResult,remark,time){
			if(TTPlatCall.callRecordId != null && TTPlatCall.callRecordId != ''){
				$.post(getPath()+'/cmct/phonenew/recordUpdate',{
					recordId:TTPlatCall.callRecordId,
					callDur:callDur,
					callResult:callResult,
					time:time,
					remark:remark 
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
		//获取监听码为500的错误信息
		get500MsgByEventCode:function(key){
			var msgHtml = "" ;
			if(key && key.indexOf("networks exception")!=-1){
				//networks exception(1)
				var sIndex = key.indexOf("(");
				var eIndex = key.indexOf(")");
				var exKey = key.substring(sIndex+1,eIndex);
				if(exKey == 1){
					msgHtml = "错误的操作，请稍后几秒再操作" ;
				}else if(exKey == 2){
					msgHtml = "参数错误" ;
				}else if(exKey == 200){
					msgHtml = "IVR在线，不能进行呼叫" ;
				}else if(exKey == 6){
					msgHtml = "处理超时，请手动刷新页面" ;
				}else{
					msgHtml = "网络异常，请手动刷新" ;
				}
				return msgHtml ;
			}
			switch(key){
				case "out of consume limit":
					msgHtml = "超出消费限额" ;
					break ;
				case "not sufficient funds" :
					msgHtml = "余额不足" ;
					break ;
				case "no accounting strategy" :
					msgHtml = "找不到计费策略" ;
					break ;
				case "suspended number" :
					msgHtml = "号码已经停用" ;
					break ;
				case "query duration error" :
					msgHtml = "查询通话时长错误" ;
					break ;
				case "out of max callline" :
					msgHtml = "超出最大呼叫线路" ;
					break ;
				case "ABusy":
					msgHtml = "接听话机占线" ;
					break ;
				case "ANoAnswer" : 
					msgHtml = "接听话机无应答" ;
					break ;
				case "APlaceCallFailure" : 
					msgHtml = "接听话机拨号失败" ;
					break ;
				case "BlackList" : 
					msgHtml = "被叫在黑名单中" ;
					break ;
				case "InexistentAccount":
					msgHtml = "帐号不存在" ;
					break ;
				case "InvalidAccount":
					msgHtml = "帐号的状态错误" ;
					break ;
				case "InvalidCall":
					msgHtml = "呼叫受限" ;
					break ;
				case "InvalidPhone":
					msgHtml = "号码错误" ;
					break ;
				case "IsReject" : 
					msgHtml = "未接通" ;
					break ;
				case "NoCarrier" :
					msgHtml = "无法接通" ;
					break ;
				case "NoLine":
					msgHtml = "线路忙" ;
					break ;
				case "NoMoney":
					msgHtml = "余额不足";
					break ;
				case "SQLError":
					msgHtml = "线路忙" ;
					break ;
				case "StoppedAccount":
					msgHtml = "帐号停用";
					break ;
				case "StoppedPhone":
					msgHtml = "号码停用";
					break ;
				case "SysHook":
					msgHtml = "线路忙";
					break ;
				case "UBusy":
					msgHtml = "用户忙" ;
					break ;
				case "UNoAnswer":
					msgHtml = "用户无应答";
					break ;
				case "UPlaceCallFailure":
					msgHtml = "用户未呼通" ;
					break ;
				default : 
					msgHtml = key ;
					break ;
			}
			return msgHtml ;
		},
		//解析需要记录的返回信息
		parseNeedRtnDesc:function(rtnDesc){
			var needMsg = "" ;
			if(rtnDesc.indexOf("UPlaceCallFailure")!=-1){
				needMsg = TTPlatCall.get500MsgByEventCode("UPlaceCallFailure");
			}else if(rtnDesc.indexOf("APlaceCallFailure")!=-1){
				needMsg = TTPlatCall.get500MsgByEventCode("APlaceCallFailure");
			}else if(rtnDesc.indexOf("InvalidCall")!=-1){
				needMsg = TTPlatCall.get500MsgByEventCode("InvalidCall");
			}else if(rtnDesc.indexOf("out of consume limit")!=-1){
				needMsg = TTPlatCall.get500MsgByEventCode("out of consume limit");
			}else if(rtnDesc.indexOf("networks exception")!=-1){
				needMsg = TTPlatCall.get500MsgByEventCode("networks exception");
			}else if(rtnDesc.indexOf("not sufficient funds")!=-1){
				needMsg = TTPlatCall.get500MsgByEventCode("not sufficient funds");
			}
			return needMsg ;
		},
		//设置呼叫结果面板DIV显示{0：失败;1：成功}
		setCallResultPanelShow:function(type){
			if(type == 0){
				//$("#div_followFail").show();
				//$("#div_followSuccess").hide();
			}else{
				//$("#div_followFail").hide();
				//$("#div_followSuccess").show();
			}
		},
		//设置呼叫面板的动态信息
		setPanelDynamicMsg:function(msg){
			$("font[id^='font_callText']").html(msg);
		},
		//添加日志
		addLog:function(code,rtnDesc){
			if(TTPlatCall.declare.callLogContainer){
				$("#"+TTPlatCall.declare.callLogContainer).html($("#"+TTPlatCall.declare.callLogContainer).html()+("<br/>"+code+":"+rtnDesc));
			}
			if(code == '404' || code == '500'){//记录日志
				var rtnmsg = TTPlatCall.parseNeedRtnDesc(rtnDesc);
				if(rtnmsg.length == 0){//不是需要解析的状态不记录日志
					return ;
				}
				rtnDesc += "备注："+rtnmsg;
				$.post(getPath()+"/cmct/phonenew/addLog",{
					toName:TTPlatCall.getCallParam()["toName"],
					toPhone:TTPlatCall.getCallParam()["toPhone"]||$("#"+TTPlatCall.declare.toPhone).val(),
					code:code,
					rtnDesc:rtnDesc,
					showPhone:TTPlatCall.currShowPhone
				},function(data){
					
				},'json');
			}
		},
		//设置控件按钮状态{showType:显示界面;isReCall:是否自动切换到呼叫界面;index:指定索引}
		setCtrlStatus:function(showType,isReCall,index){
			$("span[id^='span_bar_']").hide();
			$("p[id^='p_bar_']").hide();
			$("p[id^='p_bar_"+showType+"']").show();
			if(index == null){
				index = 0 ;
			}
			$("span[id^='span_bar_"+showType+"_"+index+"']").show();
			
			if(showType == 'call'){
				$("span[id^='span_bar_call']").show();
				TTAsk.onGetState();
				if(TTAsk.rtn == 0 ){
					TTPlatCall.setPanelDynamicMsg("未连接");
				}else{
					TTPlatCall.setPanelDynamicMsg("连接成功");
				}
			}else if(showType == 'error'){
				$("span[id^='span_bar_error']").show();
			}else if(showType == 'forbid'){
				if(isReCall){//禁用，8秒后服务器未返回，自动跳转可呼叫
					if(index == null){
						TTPlatCall.recallTimeObj = setTimeout(function(){
							if(!TTPlatCall.isEnd){
								TTPlatCall.setCtrlStatus('call')
							}
						},8000);
					}else{
						TTPlatCall.recallTimeObj = setTimeout(function(){
							if(!TTPlatCall.isEnd){
								TTPlatCall.setCtrlStatus('call',false,index)
							}
						},8000);
					}
				}
			}
		},
		//管理呼叫通话计时器
		setCostTimeBar:function(type){
			if(!TTPlatCall.declare.timeBar){
				return ;
			}
			if(type == "start"){//计时开始
				TTPlatCall.timeUnit.h = 0 ;
				TTPlatCall.timeUnit.m = 0 ; 
				TTPlatCall.timeUnit.s = 0 ; 
				TTPlatCall.timeCount();
			}else if(type == "stop"){//结束
				clearTimeout(TTPlatCall.timeUnit.timeObj);
			}else{//清空 clean
				TTPlatCall.timeUnit.h = 0 ;
				TTPlatCall.timeUnit.m = 0 ; 
				TTPlatCall.timeUnit.s = 0 ; 
				//变更，只显示分、秒
				$("#"+TTPlatCall.declare.timeBar).html("00：00");
			}
		},
		//计时器
		timeCount:function(){
			TTPlatCall.timeUnit.s += 1 ;
			if(TTPlatCall.timeUnit.s == 60){
				TTPlatCall.timeUnit.m += 1;
				TTPlatCall.timeUnit.s = 0 ;
			}
			if(TTPlatCall.timeUnit.m == 60){
				TTPlatCall.timeUnit.h += 1 ;
				TTPlatCall.timeUnit.m = 0 ;
			}
			var timeStr = "" ;
			//变更，UI只显示分、秒
			//timeStr += (TTPlatCall.timeUnit.h<10) ? ("0"+TTPlatCall.timeUnit.h+"：") : (TTPlatCall.timeUnit.h+"：") ;
			timeStr += (TTPlatCall.timeUnit.m<10) ? ("0"+TTPlatCall.timeUnit.m+"：") : (TTPlatCall.timeUnit.m+"：") ;
			timeStr += (TTPlatCall.timeUnit.s<10) ? ("0"+TTPlatCall.timeUnit.s) : TTPlatCall.timeUnit.s ;
			$("#"+TTPlatCall.declare.timeBar).html(timeStr);
			TTPlatCall.timeUnit.timeObj = setTimeout("TTPlatCall.timeCount()",1000)
		},
		//设置话机
		setSeatPhone:function(){
			//获取所有话机
			TTAsk.onGetAllSeatPhones();
			if(TTAsk.rtn!=0){
				TTPlatCall.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换话机
		switchSeatPhone:function(){
			var phoneNo = $("#mySeatPhoneList").val() ;
			if(phoneNo!=""){
				TTAsk.onSwitchSeatPhone(phoneNo);
				if(TTAsk.rtn == 0 ){
					//保存到本地数据库
					TTPlatCall.saveSeatPhone(PhoneConversion(phoneNo));
				}else if(TTAsk.rtn = -1){
					art.dialog.tips("该号码不是接听话机");
				}else{
					art.dialog.tips("切换话机调用接口错误");
				}
			}
		},
		//设置去电号码
		setShowPhone:function(){
			//获取所有话机
			TTAsk.onGetAllDispPhones();
			if(TTAsk.rtn!=0){
				TTPlatCall.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换去电显示号码
		switchShowPhone:function(){
			var font_currShowPhone = $("#font_currShowPhone").text();
			var phoneParam = "" ;
			if(font_currShowPhone == "匿名呼出"){
				phoneParam = TTPlatCall.showPhone ;
			}else{
				phoneParam = TTPlatCall.hidePhone ;
			}
			TTAsk.onSwitchDispPhone(phoneParam);
			if(TTAsk.rtn == 0 ){
				
			}else if(TTAsk.rtn = -1){
				//art.dialog.tips("该号码不是去电号码");
			}else{
				//art.dialog.tips("切换去电号码调用接口错误");
			}
		},
		//保存去电显示号码
		saveShowPhone:function(phoneNo){
			var callPersonId = $("#"+TTPlatCall.lineUser.callPersonId).val();
			if(callPersonId!=null && callPersonId!=''){
				$.post(getPath()+'/cmct/phonenew/switchShowPhone',{
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
			if (phoneNo){
				phoneNo = phoneNo.replace('\\s','');
			}
			var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/ ;
			var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{3}$/ ;
			return var1.test(phoneNo) || var2.test(phoneNo);
		},
		//添加呼叫动态事件监听
		addEventListener:function(){
			if (window.addEventListener){
				document.getElementById("huaban").addEventListener("huabanevent", TTPlatCall.listenCallEvent, false); 
			}else{
				document.getElementById("huaban").attachEvent("on"+"huabanevent", TTPlatCall.listenCallEvent);
			} 
		},
		//选择线路
		selectLine:function(){
			var openUrl = getPath()+'/cmct/phonenew/selectLine' ;
			var newWindow = window.open(openUrl,'_blank','toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no,status=no');
			newWindow.moveTo(350,180);
			newWindow.resizeTo(800,550);
			newWindow.focus();
		},
		//标记呼叫线路
		remarkLine:function(){
			var callPersonId = TTPlatCall.lineUser.callPersonId ;
   			if(callPersonId){
   				$.post(getPath()+"/cmct/phonenew/remarkLine",{
   					callPersonId:callPersonId
   				},function(data){
   					
   				},'json');
   			}
		},
		//标记呼叫线路下线
		outLine:function(){
			var callPersonId = TTPlatCall.lineUser.callPersonId ;
   			if(callPersonId){
   				$.post(getPath()+"/cmct/phonenew/outLine",{
   					callPersonId:callPersonId
   				},function(data){
   					if(data && data.STATE == 'SUCCESS'){
   						//话伴登出
   						TTPlatCall.logoutCall();
   						TTPlatCall.isLogin = false ;
   					}
   				},'json');
   			}
		},
		//显示日志
		showLog:function(openFlag){
			if(openFlag == null){
				openFlag = $("#"+TTPlatCall.declare.callLogContainer).attr("openFlag");
			}
			if(openFlag == null || openFlag == ''){
				$("#"+TTPlatCall.declare.callLogContainer).show();
				$("#"+TTPlatCall.declare.callLogContainer).attr("openFlag","Y");
				$("#"+TTPlatCall.declare.callLogDo).text("隐藏日志");
			}else{
				$("#"+TTPlatCall.declare.callLogContainer).hide();
				$("#"+TTPlatCall.declare.callLogContainer).attr("openFlag","");
				$("#"+TTPlatCall.declare.callLogDo).text("显示日志");
			}
		},
		//清除日志
		cleanLog:function(){
			TTPlatCall.showLog('Y');
			$("#"+TTPlatCall.declare.callLogContainer).html('');
		},
		//设置电话列的HTML内容
		setPhoneUlHTML:function(){
			var phone = $("#"+TTPlatCall.declare.toPhone).val();
			var liHtml = "" ;
			if(phone == null || phone == ''){
				liHtml += "<li style='line-height:26px;'>" ;
				liHtml += "<span style='font-weight:bold; font-size:14px;'>没有电话号码</span>" ;
				liHtml += "</li>" ;
			}else{
				var index1 = phone.indexOf(",");
				var index2 = phone.indexOf("，");
				var phoneList = [] ;
				if(index1 <= 0 && index2 <= 0){
					phoneList[0] = phone ;
				}else if(index1 >0 && index2 <= 0){
					phoneList = phone.split(",");
				}else if(index1 <= 0 && index2 >0){
					phoneList = phone.split("，");
				}
				for(var i = 0 ; i < phoneList.length ; i ++){
					liHtml += TTPlatCall.getPhoneLiHtml(i,phoneList[i]);
				}
				$("#"+TTPlatCall.declare.phoneContainer+" li").remove();
				$("#"+TTPlatCall.declare.phoneContainer).append(liHtml);
			}
		},
		//设置每个电话的呼叫HTML内容
		getPhoneLiHtml:function(index,phone){
			var privateFlag = $("#"+TTPlatCall.declare.privateFlag).val();
			//洗客是否保护号码
			var phoneProtect = $("#"+TTPlatCall.declare.phoneProtect).val();
			var realPhone = "" ;
			if(phoneProtect == "Y"){
				realPhone = phone ;
				var tempPhone = "" ;
				for(var k = 0 ; k < phone.length ; k ++){
					if(k < 3){
						tempPhone += phone.substring(k,k+1)
					}else {
						tempPhone += "*" ;
					}
				}
				phone = tempPhone ;
			}
			
			var customerId = $("#"+TTPlatCall.declare.objectId).val();
			if(privateFlag!=null && privateFlag == 'Y'){//私客
				phone = "1*********" ;
			}
			var html = "" ;
			html += "<li id='li_phoneShow_"+index+"' >" ;
			
				html += "<span id='span_customerPhone_"+index+"' class='phone-number' onmouseover=TTPlatCall.setPhoneEditPanel("+(phoneProtect == "Y" ? "'hide'" : "'show'" )+","+index
				+"); style='"+(TTPlatCall.declare.isShowPhone ? "display:block;" : "display:none;")+"'>"+phone+"</span>" ;
				html += "<span id='span_editPhone_"+index+"' style='display:none;'>" ;
				html += "<input id='ipt_editPhone_"+index+"' value='"+phone+"' class='ws-phone-input'   type='text' onblur=TTPlatCall.setPhoneEditPanel('hide',"+index+"); onmouseout=TTPlatCall.setPhoneEditPanel('hide',"+index+"); />" ;
				html += "</span>" ;
				if(privateFlag == null || privateFlag != 'Y'){//非私客
					if(TTPlatCall.declare.isShowMsg){
						html += "<a id='btnSendMessage' href='javascript:void(0)' class='btnSendMessage ml10' onclick=sendMessage('"+customerId+"','')>" ;
						html += "</a>" ;
					}
				}
				html += "<span id='span_bar_call_"+index+"' class='ml10' style='display:none;'>" ;
				html += "<a id='btnCallPhone' class='span_bar_call' href='javascript:void(0);' onclick=TTPlatCall.dialPhone('"+index+"','"+realPhone+"'); >" ;
				html += "</a>" ;
				html += "</span>" ;
		
				html += "<span id='span_bar_hook_"+index+"' class='ml10' style='display:none;'>" ;
				html += "<a href='javascript:void(0)' class='span_bar_hook' onclick=TTPlatCall.callHook('"+index+"');>" ;
				html += "</a>" ;
				html += "</span>" ;
				
				html += "<span id='span_bar_error_"+index+"' class='ml10' style='display:none;'>" ;
				html += "<a href='javascript:void(0);' class='span_bar_call' onclick=TTPlatCall.dialPhone('"+index+"'); >" ;
				html += "</a>" ;
				html += "</span>" ;
				
				html += "<span id='span_bar_forbid_"+index+"' class='span_bar_forbid ml10' style='display:none;'>" ;
				html += "</span>" ;
				
				html += "<span id='span_bar_selectLine_"+index+"' class='merger ml10'>" ;
				html += "<a href='javascript:TTPlatCall.selectLine();' >选择线路</a>" ;
				html += "</span>" ;
			
			html += "</li>" ;
			return html ;
		},
		//设置每个电话状态显示HTML内容
		setPhoneShowStatusHtml:function(){
			var html = "" ;
			html += '<p id="p_bar_call" style="color: #47991f;display: block;"><font id="font_callText1"></font></p>';
			html += '<p id="p_bar_hook" style="color: #e67300;display: none;"><font id="font_callText2"></font></p>';
			html += '<p id="p_bar_error" style="color: #ed1818;display: none;"><font id="font_callText3"></font></p>';
			html += '<p id="p_bar_forbid" style="color: #666666;display: none;"><font id="font_callText4"></font></p>';
			html += '<p id="p_bar_selectLine" style="color: #47991f;display: none;">未连接</p>';
			
			$("#"+TTPlatCall.declare.phoneShowContainer).html("");
			$("#"+TTPlatCall.declare.phoneShowContainer).append(html);
		},
		//设置电话修改面板{type:hide/show隐藏/显示;index:行索引}
		setPhoneEditPanel:function(type,index){
			if(type == 'hide'){
				var newVal = $("#ipt_editPhone_"+index).val();
				$("#span_customerPhone_"+index).text(newVal);
				$("#span_customerPhone_"+index).show();
				$("#span_editPhone_"+index).hide();
			}else{
				$("#ipt_editPhone_"+index).focus();
				$("#span_editPhone_"+index).show();
				$("#span_customerPhone_"+index).hide();
			}
		},
		//设置登录成功面板
		setLoginSuccPanel:function(){
			var html = "";
			html += '<span style="padding-right:10px;">';
			html += '呼出：<font id="font_currShowPhone" ></font>';
			html += '</span>';
			html += '<b class="btn graybtn" style="margin-left:5px;display: none;" id="b_btnChange">';
			html += '<a id="a_changeDispPhone" href="javascript:void(0)" onclick="TTPlatCall.switchShowPhone();" >换成匿名呼叫</a>';
			html += '</b>';
			html += '<b class="btn greenbtn">';
			html += '<a href="javascript:void(0)" onclick="TTPlatCall.outLine();" >下线</a>';
			html += '</b>';
			$("#"+TTPlatCall.declare.loginSuccContainer).html("");
			$("#"+TTPlatCall.declare.loginSuccContainer).append(html);
		}
};
/**
 * 选择使用线路之后
 */
function selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType){
	TTPlatCall.isSelectLine = true ;
	TTPlatCall.lineType = setType ;
	var lineUser = {} ;
	lineUser.orgInterfaceId = orgId ;
	lineUser.id = lineId ;
	lineUser.userId = userId ;
	lineUser.loginNumber = loginNumber ;
	lineUser.password = password ;
	lineUser.alias = alias ;
	lineUser.showPhone = showPhone ;
	lineUser.defaultShowPhone = defaultShowPhone ;
	lineUser.setType = setType ;
	TTPlatCall.setCallUserInfo(lineUser);
	//判断话伴插件的登录状态
	TTAsk.onGetState();
	var result = TTAsk.rtn ;
	if(result <= 2 ){//已连接，未登录状态
		TTPlatCall.setCtrlStatus("call");
		TTPlatCall.loginCall();
	}else{
		//已登录，自动呼叫
		//TTPlatCall.dialPhone();
		TTPlatCall.setCtrlStatus("call");
	}
}