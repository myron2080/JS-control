/**
 * 铁通电信合并电话平台
 * @version 1.0
 * @author li.biao
 * @since 2013-4-18
 */
var oldMsg = "";
var MeragePlatCall = {
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
		
		//---------by lxl 14.3.31
		//号码运营商
		phoneType:'',
		//福建电信号码的成员电话号码
		userId:'',
		//密码
		passWord:'',
		//相当于铁通的组织id
		appId:'',
		
		//电信环境的url
		httpUrl:'',
		//spId
		spid:'',
		//passWd
		passWd:'',
		//-----------------------
		
		//获取呼叫参数
		getCallParam:function(){
		    var argsArr = new Object();
		    argsArr["objectId"] = $("#"+MeragePlatCall.declare.objectId).val();
		    argsArr["toName"] = $("#"+MeragePlatCall.declare.toName).val();
		    argsArr["toPhone"] = $("#"+MeragePlatCall.declare.toPhone).val();
		    return argsArr;
		},
		//注册
		register:function(genType){
			MeragePlatCall.setPhoneUlHTML(genType);
			MeragePlatCall.setPhoneShowStatusHtml(genType);
			MeragePlatCall.login();
		},
		//初始化
		init:function(){
			MeragePlatCall.callLinkObjectId = MeragePlatCall.getCallParam()["objectId"];
			//设置电话信息的显示内容
			//MeragePlatCall.setPhoneLiShow();
			if(MeragePlatCall.isLogin){
				MeragePlatCall.setCtrlStatus("call",false,null,MeragePlatCall.phoneType);
			}else{
				MeragePlatCall.setCtrlStatus("selectLine");
			}
		},
		//设置呼叫线路信息{cp:呼叫线路信息}
		setCallUserInfo:function(cp){
			MeragePlatCall.lineUser.orgId = cp.orgInterfaceId ;
			MeragePlatCall.lineUser.callPersonId = cp.id ;
			MeragePlatCall.lineUser.userId = cp.userId ;
			MeragePlatCall.lineUser.password = cp.password ;
			MeragePlatCall.lineUser.loginNumber = cp.loginNumber ;
			if(cp.setType!=null && cp.setType!=''){
				MeragePlatCall.lineType = cp.setType ;
			}
		},
		//登录话伴接口
		login:function(){
			//已经登录的获取呼叫人是否已经有选择过的空闲线路
			$.post(getPath()+'/cmct/phonenew/getUserInfo',{},function(res){
				if(res && res.STATE == 'SUCCESS'){
					var callSet = res.callSet ;
					//设置呼叫人信息
					MeragePlatCall.setCallUserInfo(callSet);
					var userId = callSet.userId ;
		   			var password = callSet.password ;
		   			var orgId = callSet.orgInterfaceId ;
		   			
		   			//判断号码的合作商;
		   			var phoneType=callSet.phoneType;
		   			MeragePlatCall.phoneType=phoneType;
		   			if(phoneType=='TTEN'){//33e9
		   				//监听
		   				MeragePlatCall.addEventListener();
		   				//登录话伴
			   			TTAsk.onLogin(userId,password,orgId);
			   			if(TTAsk.rtn == 0){//操作提交成功
			   				MeragePlatCall.setPanelDynamicMsg("正在登录...");
			   				MeragePlatCall.setCtrlStatus("call",false,null,phoneType);
			   			}else if (TTAsk.rtn == -1){//提交参数不合格
			   				MeragePlatCall.setPanelDynamicMsg("请求连接参数不合格");
			   				MeragePlatCall.setCtrlStatus("forbid",false);
			   				MeragePlatCall.isAllowCall = false ;
			   			}else{//其他失败
			   				MeragePlatCall.setPanelDynamicMsg("请求连接失败")
			   				MeragePlatCall.setCtrlStatus("forbid",false);
			   				MeragePlatCall.isAllowCall = false ;
			   			}
		   			}else if(phoneType=='HW'){//华为
		   				MeragePlatCall.isLogin=true;
		   				MeragePlatCall.showPhone=callSet.showPhone;
		   				MeragePlatCall.userId=userId;
		   				MeragePlatCall.passWord=password;
		   				MeragePlatCall.appId=orgId;
		   				MeragePlatCall.setCtrlStatus("call",false,null,phoneType);
		   				MeragePlatCall.currShowPhone=callSet.showPhone;
		   				MeragePlatCall.spid=callSet.spid;
		   				MeragePlatCall.passWd=callSet.passWd;
		   				MeragePlatCall.httpUrl=callSet.httpUrl;
		   				MeragePlatCall.remarkLine();
		   				$("#"+MeragePlatCall.declare.loginSuccContainer).show();
						$("#font_currShowPhone").text(PhoneConversion(MeragePlatCall.showPhone));
						$("#a_changeDispPhone").parents("b").removeClass("orangebtn");
						$("#a_changeDispPhone").parents("b").addClass("graybtn");
						
		   			}else{//泽讯
		   				
		   			}
		   			
				}else if(res && res.STATE == 'FAIL'){
					//未找到空闲线路，自己选择
					MeragePlatCall.setCtrlStatus("selectLine",false);
					MeragePlatCall.setPanelDynamicMsg("未选择话务线路");
					MeragePlatCall.isAllowCall =false;
				}else{
					//未登录系统
					MeragePlatCall.setCtrlStatus("forbid",false);
					MeragePlatCall.isAllowCall = false ;
				}
			},'json');
		},
		//登录话伴接口
		loginCall:function(){
			var userId = MeragePlatCall.lineUser.userId ;
   			var password = MeragePlatCall.lineUser.password ;
   			var orgId = MeragePlatCall.lineUser.orgId ;
   			//监听
			MeragePlatCall.addEventListener();
   			//登录话伴
   			TTAsk.onLogin(userId,password,orgId);
   			if(TTAsk.rtn == 0){//操作提交成功
   				MeragePlatCall.setPanelDynamicMsg("正在登录...");
   				MeragePlatCall.setCtrlStatus("call",false,null,MeragePlatCall.phoneType);
   			}else if (TTAsk.rtn == -1){//提交参数不合格
   				MeragePlatCall.setPanelDynamicMsg("请求连接参数不合格");
   				MeragePlatCall.setCtrlStatus("forbid",false);
   				MeragePlatCall.isAllowCall = false ;
   			}else{//其他失败
   				MeragePlatCall.setPanelDynamicMsg("请求连接失败")
   				MeragePlatCall.setCtrlStatus("forbid",false);
   				MeragePlatCall.isAllowCall = false ;
   			}
		},
		//登出接口
		logoutCall:function(){
			var callPersonId = MeragePlatCall.lineUser.callPersonId;
			if(callPersonId!=null && callPersonId!=''){
				TTAsk.onLogout();
			}else{
				setTimeout(function(){art.dialog.close();},100);
			}
		},
		// 监听呼叫事件
		listenCallEvent : function(evCode, evDescrible) {
			if(MeragePlatCall.phoneType!='HW'){
				//添加日志
				MeragePlatCall.addLog(evCode, evDescrible);
				var callRtnObj = eval("("+evDescrible+")");
				if (callRtnObj.cmd == 'Login') {//登录
					if(evCode == 100){
						MeragePlatCall.setPanelDynamicMsg("正在登录...");
					}else if(evCode == 200){//如果登录之后连接成功，检验号码正确，自动拨打
						$("#"+MeragePlatCall.declare.loginSuccContainer).show();
						MeragePlatCall.isLogin = true ;
						MeragePlatCall.setPanelDynamicMsg("连接成功");
						//记录呼叫线路
						//if(MeragePlatCall.isSelectLine){
							MeragePlatCall.remarkLine();
						//}
						//获取所有去电号码
						MeragePlatCall.setShowPhone();
						//获取所有接听话机
						MeragePlatCall.setSeatPhone() ;
						
					}else if(evCode == 404){
						MeragePlatCall.setPanelDynamicMsg("登录失败...");
					}
				}else if(callRtnObj.cmd == 'DialPhone'){//呼叫
					MeragePlatCall.setPanelDynamicMsg(MeragePlatCall.getCallMsgByEventCode(evCode));
					if(evCode == 100){
						MeragePlatCall.setCostTimeBar("clean");
						//切换图标状态
						MeragePlatCall.setCtrlStatus("hook",false,MeragePlatCall.dialIndex);
						var responseTime = (new Date()).getTime();
						//记录呼叫记录（服务器响应成功）
						MeragePlatCall.callRecord('','',MeragePlatCall.callBillId,(responseTime - MeragePlatCall.callSendTime));
					}else if(evCode == 200){
					}else if(evCode == 132 ){//通话中
						MeragePlatCall.isHookSelf = false ;//建立通话的时候，比较不用手动挂断坐席，交由接口系统挂断
						MeragePlatCall.setCostTimeBar("start");
						MeragePlatCall.setCallResultPanelShow(1);
					}else if(evCode == 201){//用户挂机
						MeragePlatCall.setCostTimeBar("stop");
						MeragePlatCall.setCtrlStatus("forbid",true,MeragePlatCall.dialIndex);
						MeragePlatCall.callRecordUpdate(callRtnObj.calldur,'C_128');//更新呼叫记录（呼叫成功）
					}else if(evCode == 202){//通话结束
						MeragePlatCall.callSessionId = '' ;
						MeragePlatCall.setCtrlStatus("call",false,MeragePlatCall.dialIndex,MeragePlatCall.phoneType);
						MeragePlatCall.isEnd = true ;
						MeragePlatCall.setCostTimeBar("stop");
						//匿名呼出则切换到显示呼出
						if(MeragePlatCall.currShowPhone == MeragePlatCall.hidePhone){
							MeragePlatCall.switchShowPhone();
						}
					}else if(evCode == 404){//
						MeragePlatCall.setCtrlStatus("error",false,MeragePlatCall.dialIndex);
						MeragePlatCall.setCostTimeBar("stop");
						//MeragePlatCall.callSessionId = '' ;//不要清除
						MeragePlatCall.callRecordUpdate('','C_127','404_操作失败');//更新呼叫记录（404操作失败）
					}else if(evCode == 500){//
						MeragePlatCall.setCtrlStatus("error",false,MeragePlatCall.dialIndex);
						MeragePlatCall.setCostTimeBar("stop");
						//MeragePlatCall.callSessionId = '' ;//不要清除
					}
				}else if(callRtnObj.cmd == 'Hook'){//挂断
					if(evCode == 100){
						var time = MeragePlatCall.getCallCostTime() ;
						MeragePlatCall.setPanelDynamicMsg("正在挂断...");
						MeragePlatCall.setCostTimeBar("stop");
						MeragePlatCall.setCtrlStatus("forbid",true,MeragePlatCall.hookIndex);
						if(MeragePlatCall.callRecordId!=null && MeragePlatCall.callRecordId!=''){
							MeragePlatCall.callRecordUpdate(time, 'C_125', '坐席挂机...');
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
						MeragePlatCall.currShowPhone = callRtnObj.curphone ;
						for(var i = 0 ; i < seatPhoneList.length ; i ++ ){
							if("HIDE" == seatPhoneList[i]){
								MeragePlatCall.hidePhone = seatPhoneList[i] ;
							}else{
								MeragePlatCall.showPhone = seatPhoneList[i];
							}
						}
						if(MeragePlatCall.currShowPhone == MeragePlatCall.hidePhone){
							$("#font_currShowPhone").text("匿名呼出");
							$("#a_changeDispPhone").text("换成显示呼出");
							$("#a_changeDispPhone").parents("b").removeClass("graybtn");
							$("#a_changeDispPhone").parents("b").addClass("orangebtn");
							//匿名呼叫自动切换成显示呼出
							MeragePlatCall.switchShowPhone();
						}else{
							$("#font_currShowPhone").text(PhoneConversion(MeragePlatCall.showPhone));
							$("#a_changeDispPhone").parents("b").removeClass("orangebtn");
							$("#a_changeDispPhone").parents("b").addClass("graybtn");
							$("#a_changeDispPhone").text("换成匿名呼出");
						}
						if(MeragePlatCall.showPhone == ""){
							$("#b_btnChange").hide();
						}else{
							$("#b_btnChange").show();
						}
						//暂时隐藏 since 2013-10-15 by li.biao
						$("#b_btnChange").hide();
					}
				}else if(callRtnObj.cmd == 'SwitchDispPhone'){//切换去电号码
					if(evCode == 200){
						if(MeragePlatCall.currShowPhone){
							//保存到本地数据库
							MeragePlatCall.saveShowPhone(PhoneConversion(MeragePlatCall.currShowPhone));
						}
						var dispText = $("#a_changeDispPhone").text() ;
						if(dispText == "换成匿名呼出"){
							$("#font_currShowPhone").text("匿名呼出");
							$("#a_changeDispPhone").text("换成显示呼出");
							$("#a_changeDispPhone").parents("b").removeClass("graybtn");
							$("#a_changeDispPhone").parents("b").addClass("orangebtn");
							MeragePlatCall.currShowPhone  = MeragePlatCall.hidePhone ;
						}else{
							$("#font_currShowPhone").text(PhoneConversion(MeragePlatCall.showPhone));
							$("#a_changeDispPhone").parents("b").removeClass("orangebtn");
							$("#a_changeDispPhone").parents("b").addClass("graybtn");
							$("#a_changeDispPhone").text("换成匿名呼出");
							MeragePlatCall.currShowPhone  = MeragePlatCall.showPhone ;
						}
					}else if(evCode == 404){
						MeragePlatCall.setPanelDynamicMsg("操作失败");
					}
				}else if(callRtnObj.cmd == 'Logout'){//登出
					if(evCode == 200){
						MeragePlatCall.setPanelDynamicMsg("呼叫线路未连接");
						MeragePlatCall.setCtrlStatus("selectLine");
						$("#"+MeragePlatCall.declare.loginSuccContainer).hide();
					}else if(evCode == 404){
						MeragePlatCall.setPanelDynamicMsg("登出失败...");
					}
				}else if(callRtnObj.cmd == 'systemreturn'){//系统返回
					if(callRtnObj.state == "ForceOffLine"){
						MeragePlatCall.setPanelDynamicMsg("您的账号在另一地点登陆，您被迫下线");
					}else{
						MeragePlatCall.setPanelDynamicMsg("系统错误");
					}
				}
				
				//500详细提醒
				var errorMsg = "" ;
				if(evCode == 500){
					var failres = callRtnObj.failres ;
					if(failres!=null && failres!=''){
						//500错误详细原因
						errorMsg = MeragePlatCall.get500MsgByEventCode(failres) ;
						MeragePlatCall.setPanelDynamicMsg(errorMsg);
					}
					var callres = callRtnObj.callres ;
					if(callres!=null && callres!=''){
						errorMsg = MeragePlatCall.get500MsgByEventCode(callres) ;
						MeragePlatCall.setPanelDynamicMsg(errorMsg);
					}
					var noRes = callRtnObj.nResult ;
					if(noRes!=null && noRes!=''){
						errorMsg = MeragePlatCall.get500MsgByEventCode(noRes) ;
						MeragePlatCall.setPanelDynamicMsg(errorMsg);
					}
				}
				//呼叫失败
				if(callRtnObj.cmd == 'DialPhone' && evCode == 500){
					MeragePlatCall.callRecordUpdate(callRtnObj.calldur,'C_127',errorMsg);//更新呼叫记录（呼叫失败）
				}
				if(callRtnObj.cmd == 'DialPhone' && (evCode == 500 || evCode == 404)){
					MeragePlatCall.setCallResultPanelShow(0);
				}
			}	
		},
		//获取呼叫时间{单位：秒}
		getCallCostTime:function(){
			var h = MeragePlatCall.timeUnit.h;
			var m = MeragePlatCall.timeUnit.m; 
			var s = MeragePlatCall.timeUnit.s; 
			var time = h*60*60 + m*60 + s ;
			if(time == null || isNaN(parseInt(time))){
				time = '' ;
			}
			return time ;
		},
		//呼叫
		dialPhone:function(index,realPhone){
			var phoneType=MeragePlatCall.phoneType;
			if(phoneType=='HW'){
				var toPhone = realPhone || $("#span_customerPhone_"+index).text() ;
				//去除空格
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
				if(toPhone == null || toPhone ==''){
					//art.dialog.tips("请输入用户手机号码");
					commonTipShow("请输入用户手机号码",1000);
					return false ;
				}else if(!(MeragePlatCall.checkMobile(toPhone) || MeragePlatCall.checkPhone(toPhone))){
					//art.dialog.tips("用户手机号码格式不正确");
					commonTipShow("用户手机号码格式不正确",1000);
					return false ;
				}
				MeragePlatCall.dialIndex = index ;
				CTAsk.dialPhone(index,MeragePlatCall.userId,MeragePlatCall.passWord,MeragePlatCall.showPhone,toPhone,MeragePlatCall.appId,MeragePlatCall.httpUrl,MeragePlatCall.spid,MeragePlatCall.passWd);
			}else if(phoneType=='TTEN'){
				//获取一下当前连接状况
				TTAsk.onGetState();
				if(TTAsk.rtn == 0){
					MeragePlatCall.setPanelDynamicMsg("呼叫线路未连接");
				}else{
					//判断电话线路
					if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
						TTAsk.onGetCallLineState(MeragePlatCall.callSessionId);
						//会话已释放||空闲||对方挂机||本地挂机可以进行下一次拨号
						if(TTAsk.rtn == -1 || TTAsk.rtn == 0 
								|| TTAsk.rtn == 8 || TTAsk.rtn == 9 ){
							
						}else{
							MeragePlatCall.setPanelDynamicMsg("上通呼叫还在处理中，请稍后...");
							MeragePlatCall.addLog("404", "上通呼叫还在处理中...");
							return false ;
						}
					}
					if(!MeragePlatCall.isAllowCall){
						return false ;
					}
					var toPhone = realPhone || $("#span_customerPhone_"+index).text() ;
					//去除空格
					toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
					if(toPhone == null || toPhone ==''){
						//art.dialog.tips("请输入用户手机号码");
						commonTipShow("请输入用户手机号码",1000);
						return false ;
					}else if(!(MeragePlatCall.checkMobile(toPhone) || MeragePlatCall.checkPhone(toPhone))){
						//art.dialog.tips("用户手机号码格式不正确");
						commonTipShow("用户手机号码格式不正确",1000);
						return false ;
					}
					if(MeragePlatCall.currShowPhone == MeragePlatCall.hidePhone){
						art.dialog.confirm("确定要匿名呼叫吗？",function(){
							MeragePlatCall.callPhone(toPhone,index);
						});
					}else{
						MeragePlatCall.callPhone(toPhone,index);
					}
				}
			}else{
				
			}
			
		},
		//呼叫号码
		callPhone:function(toPhone,index){
			//呼叫
			var converPhoneResult = NumberConversion(toPhone);
			if(converPhoneResult[0] > 0){//转换号码格式是否正确
				MeragePlatCall.setPanelDynamicMsg("号码错误");
			}else{
				if(MeragePlatCall.recallTimeObj){
					clearTimeout(MeragePlatCall.recallTimeObj);
				}
				MeragePlatCall.isEnd = false ;
				MeragePlatCall.dialIndex = index ;
				//呼叫处理中...禁止操作
				MeragePlatCall.setCtrlStatus("forbid",false,index);
				var btime = (new Date()).getTime();
				//获取一个正确的话单ID
				var billId = TTAsk.getCallBillId(MeragePlatCall.lineUser.orgId);
				if(billId){
					MeragePlatCall.callBillId = billId ;
					MeragePlatCall.isHookSelf = true ;//如果通话连接未建立之前挂断，标记需要挂断坐席
					TTAsk.onCall(converPhoneResult[1],billId);//拨打号码，话单id
					if(TTAsk.rtn >= 0 ){
						MeragePlatCall.callSessionId = TTAsk.rtn ;//记录用户线路session
						var etime = (new Date()).getTime();
						MeragePlatCall.callSendTime = etime ;
					}else{
						MeragePlatCall.setPanelDynamicMsg("呼叫返回错误状态");
						MeragePlatCall.setCtrlStatus("error",false,index);
						MeragePlatCall.setCostTimeBar("stop");
					}
				}
			}
		},
		
		//呼叫线路是否已经完成
		callLineIsComplete:function(){
			
			var phoneType=MeragePlatCall.phoneType;
			if(phoneType=='HW'){
				if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
					if(CTAsk.callDie){
						return true; 
					}
					return false;
				}
				return true ;
			}else if(phoneType == null || phoneType=='TTEN'){
				//判断电话线路
				if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
					TTAsk.onGetCallLineState(MeragePlatCall.callSessionId);
					//会话已释放||空闲||对方挂机||本地挂机可以进行下一次拨号
					if(TTAsk.rtn == -1 || TTAsk.rtn == 0 
							|| TTAsk.rtn == 8 || TTAsk.rtn == 9 ){
						return true ;
					}else{
						return false ;
					}
				}
				return true ;
			}
			return true ;
		},
		//挂断
		callHook:function(index){
			var phoneType=MeragePlatCall.phoneType;
			
			if(phoneType=='HW'){
				CTAsk.hookPhone(index,MeragePlatCall.appId,MeragePlatCall.httpUrl,MeragePlatCall.spid,MeragePlatCall.passWd);
			}else{
				if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
					MeragePlatCall.hookIndex = index ;
					//挂断处理中...禁止操作
					MeragePlatCall.setCtrlStatus("forbid",false,index);
					//挂断被叫
					TTAsk.onHook(MeragePlatCall.callSessionId);
					if(TTAsk.rtn == 0 ){
						//是否要挂断坐席
						if(MeragePlatCall.isHookSelf){
							var selfSessionId = 0 ;
							TTAsk.onHook(selfSessionId);
						}
					}else{
						MeragePlatCall.setPanelDynamicMsg("挂断失败");
					}
				}else{
					MeragePlatCall.setCtrlStatus("call",false,index,MeragePlatCall.phoneType);
					MeragePlatCall.setCostTimeBar("stop");
				}
			}
		},
		//通话记录
		callRecord:function(toPhone,toName,callBillId,time){
			if(toPhone == null || toPhone == ''){
				toPhone = $("#"+MeragePlatCall.declare.toPhone).val();
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
			}
			if(toName == null || toName == ''){
				toName = $("#"+MeragePlatCall.declare.toName).val();
			}
			MeragePlatCall.callRecordId = '' ;
			$.post(getPath()+'/cmct/phonenew/record',{
				toPhone:toPhone,
				toName:toName,
				currShowPhone:MeragePlatCall.currShowPhone,
				callBillId:callBillId,
				objectId:MeragePlatCall.callLinkObjectId,
				time:time,
				callLineId:MeragePlatCall.lineUser.callPersonId,
				sessionId:MeragePlatCall.callSessionId
			},function(res){
				if(res && res.STATE == 'SUCCESS'){
					MeragePlatCall.callRecordId = res.ID ;//记录单次通话ID
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		},
		//更新单次通话记录{callDur:通话时长,callResult:状态,remark:备注，time:耗时}
		callRecordUpdate:function(callDur,callResult,remark,time){
			if(MeragePlatCall.callRecordId != null && MeragePlatCall.callRecordId != ''){
				$.post(getPath()+'/cmct/phonenew/recordUpdate',{
					recordId:MeragePlatCall.callRecordId,
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
				needMsg = MeragePlatCall.get500MsgByEventCode("UPlaceCallFailure");
			}else if(rtnDesc.indexOf("APlaceCallFailure")!=-1){
				needMsg = MeragePlatCall.get500MsgByEventCode("APlaceCallFailure");
			}else if(rtnDesc.indexOf("InvalidCall")!=-1){
				needMsg = MeragePlatCall.get500MsgByEventCode("InvalidCall");
			}else if(rtnDesc.indexOf("out of consume limit")!=-1){
				needMsg = MeragePlatCall.get500MsgByEventCode("out of consume limit");
			}else if(rtnDesc.indexOf("networks exception")!=-1){
				needMsg = MeragePlatCall.get500MsgByEventCode("networks exception");
			}else if(rtnDesc.indexOf("not sufficient funds")!=-1){
				needMsg = MeragePlatCall.get500MsgByEventCode("not sufficient funds");
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
			//commonTipShow(msg,1000);
			/*if(oldMsg!=msg){
				oldMsg=msg;
				commonTipShow(msg,1000);
			}*/
			//$("font[id^='font_callText']").html(msg);
		},
		//添加日志
		addLog:function(code,rtnDesc){
			if(MeragePlatCall.declare.callLogContainer){
				$("#"+MeragePlatCall.declare.callLogContainer).html($("#"+MeragePlatCall.declare.callLogContainer).html()+("<br/>"+code+":"+rtnDesc));
			}
			if(code == '404' || code == '500'){//记录日志
				var rtnmsg = MeragePlatCall.parseNeedRtnDesc(rtnDesc);
				if(rtnmsg.length == 0){//不是需要解析的状态不记录日志
					return ;
				}
				rtnDesc += "备注："+rtnmsg;
				$.post(getPath()+"/cmct/phonenew/addLog",{
					toName:MeragePlatCall.getCallParam()["toName"],
					toPhone:MeragePlatCall.getCallParam()["toPhone"]||$("#"+MeragePlatCall.declare.toPhone).val(),
					code:code,
					rtnDesc:rtnDesc
				},function(data){
					
				},'json');
			}
		},
		//设置控件按钮状态{showType:显示界面;isReCall:是否自动切换到呼叫界面;index:指定索引}
		setCtrlStatus:function(showType,isReCall,index,phoneType){
			$("a[id^='span_bar_']").hide();
			$("p[id^='p_bar_']").hide();
			$("p[id^='p_bar_"+showType+"']").show();
			if(index == null){
				index = 0 ;
			}
			$("a[id^='span_bar_"+showType+"_"+index+"']").show();
			
			if(showType == 'call'){
				$("a[id^='span_bar_call']").show();
				if(phoneType=='TTEN'){
					TTAsk.onGetState();
					if(TTAsk.rtn == 0 ){
						MeragePlatCall.setPanelDynamicMsg("呼叫线路未连接");
					}else{
						MeragePlatCall.setPanelDynamicMsg("连接成功");
					}
				}else if(phoneType == 'HW'){
					MeragePlatCall.setPanelDynamicMsg("连接成功");
				}
				
			}else if(showType == 'error'){
				$("a[id^='span_bar_error']").show();
			}else if(showType == 'forbid'){
				if(isReCall){//禁用，8秒后服务器未返回，自动跳转可呼叫
					if(phoneType=='HW'){
						setTimeout(function(){MeragePlatCall.setCtrlStatus('call',false,index,MeragePlatCall.phoneType)},3000);
					}else{
						if(index == null){
							MeragePlatCall.recallTimeObj = setTimeout(function(){
								if(!MeragePlatCall.isEnd){
									MeragePlatCall.setCtrlStatus('call',false,index,MeragePlatCall.phoneType)
								}
							},8000);
						}else{
							MeragePlatCall.recallTimeObj = setTimeout(function(){
								if(!MeragePlatCall.isEnd){
									MeragePlatCall.setCtrlStatus('call',false,index,MeragePlatCall.phoneType)
								}
							},8000);
						}
					}
				}
			}else if(showType == "selectLine"){
				$("a[id^='span_bar_selectLine']").show();
			}
		},
		//管理呼叫通话计时器
		setCostTimeBar:function(type){
			if(!MeragePlatCall.declare.timeBar){
				return ;
			}
			if(type == "start"){//计时开始
				MeragePlatCall.timeUnit.h = 0 ;
				MeragePlatCall.timeUnit.m = 0 ; 
				MeragePlatCall.timeUnit.s = 0 ; 
				MeragePlatCall.timeCount();
			}else if(type == "stop"){//结束
				clearTimeout(MeragePlatCall.timeUnit.timeObj);
			}else{//清空 clean
				MeragePlatCall.timeUnit.h = 0 ;
				MeragePlatCall.timeUnit.m = 0 ; 
				MeragePlatCall.timeUnit.s = 0 ; 
				//变更，只显示分、秒
				$("#timeBar").html("00：00");
			}
		},
		//计时器
		timeCount:function(){
			MeragePlatCall.timeUnit.s += 1 ;
			if(MeragePlatCall.timeUnit.s == 60){
				MeragePlatCall.timeUnit.m += 1;
				MeragePlatCall.timeUnit.s = 0 ;
			}
			if(MeragePlatCall.timeUnit.m == 60){
				MeragePlatCall.timeUnit.h += 1 ;
				MeragePlatCall.timeUnit.m = 0 ;
			}
			var timeStr = "" ;
			//变更，UI只显示分、秒
			//timeStr += (MeragePlatCall.timeUnit.h<10) ? ("0"+MeragePlatCall.timeUnit.h+"：") : (MeragePlatCall.timeUnit.h+"：") ;
			timeStr += (MeragePlatCall.timeUnit.m<10) ? ("0"+MeragePlatCall.timeUnit.m+"：") : (MeragePlatCall.timeUnit.m+"：") ;
			timeStr += (MeragePlatCall.timeUnit.s<10) ? ("0"+MeragePlatCall.timeUnit.s) : MeragePlatCall.timeUnit.s ;
			$("#"+MeragePlatCall.declare.timeBar).html(timeStr);
			MeragePlatCall.timeUnit.timeObj = setTimeout("MeragePlatCall.timeCount()",1000)
		},
		//设置话机
		setSeatPhone:function(){
			//获取所有话机
			TTAsk.onGetAllSeatPhones();
			if(TTAsk.rtn!=0){
				MeragePlatCall.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换话机
		switchSeatPhone:function(){
			var phoneNo = $("#mySeatPhoneList").val() ;
			if(phoneNo!=""){
				TTAsk.onSwitchSeatPhone(phoneNo);
				if(TTAsk.rtn == 0 ){
					//保存到本地数据库
					MeragePlatCall.saveSeatPhone(PhoneConversion(phoneNo));
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
				MeragePlatCall.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换去电显示号码
		switchShowPhone:function(){
			var font_currShowPhone = $("#font_currShowPhone").text();
			var phoneParam = "" ;
			if(font_currShowPhone == "匿名呼出"){
				phoneParam = MeragePlatCall.showPhone ;
			}else{
				phoneParam = MeragePlatCall.hidePhone ;
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
			var callPersonId = MeragePlatCall.lineUser.callPersonId;
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
				document.getElementById("huaban").addEventListener("huabanevent", MeragePlatCall.listenCallEvent, false); 
			}else{
				document.getElementById("huaban").attachEvent("on"+"huabanevent", MeragePlatCall.listenCallEvent);
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
			var callPersonId = MeragePlatCall.lineUser.callPersonId;
   			if(callPersonId){
   				$.post(getPath()+"/cmct/phonenew/remarkLine",{
   					callPersonId:callPersonId
   				},function(data){
   					
   				},'json');
   			}
		},
		//标记呼叫线路下线
		outLine:function(){
			if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
				art.dialog.tips('通话还没结束不能下线....');
				return false;
			}
			var callPersonId = MeragePlatCall.lineUser.callPersonId;
			var phoneType=MeragePlatCall.phoneType;
			if(phoneType=='HW'){
				CTAsk.outLine(callPersonId);
			}else if(phoneType=='TTEN'){
				if(callPersonId){
	   				$.post(getPath()+"/cmct/phonenew/outLine",{
	   					callPersonId:callPersonId
	   				},function(data){
	   					if(data && data.STATE == 'SUCCESS'){
	   						//话伴登出
	   						MeragePlatCall.logoutCall();
	   						MeragePlatCall.isLogin = false ;
	   					}
	   				},'json');
	   			}
			}else{
				
			}
		},
		//显示日志
		showLog:function(openFlag){
			if(openFlag == null){
				openFlag = $("#"+MeragePlatCall.declare.callLogContainer).attr("openFlag");
			}
			if(openFlag == null || openFlag == ''){
				$("#"+MeragePlatCall.declare.callLogContainer).show();
				$("#"+MeragePlatCall.declare.callLogContainer).attr("openFlag","Y");
				$("#"+MeragePlatCall.declare.callLogDo).text("隐藏日志");
			}else{
				$("#"+MeragePlatCall.declare.callLogContainer).hide();
				$("#"+MeragePlatCall.declare.callLogContainer).attr("openFlag","");
				$("#"+MeragePlatCall.declare.callLogDo).text("显示日志");
			}
		},
		//清除日志
		cleanLog:function(){
			MeragePlatCall.showLog('Y');
			$("#"+MeragePlatCall.declare.callLogContainer).html('');
		},
		//设置电话列的HTML内容
		setPhoneUlHTML:function(genType){
			var phone = $("#"+MeragePlatCall.declare.toPhone).val();
			var liHtml = "" ;
			if(phone == null || phone == ''){
				/*liHtml += "<li style='line-height:26px;'>" ;
				liHtml += "<span style='font-weight:bold; font-size:14px;'>没有电话号码</span>" ;
				liHtml += "</li>" ;*/
				MeragePlatCall.setPanelDynamicMsg("未选择话务线路");
			}else{
				var phoneList = [] ;
				var index1 = phone.indexOf(",");
				var index2 = phone.indexOf("，");
				if(index1 <= 0 && index2 <= 0){
					phoneList[0] = phone ;
				}else if(index1 >0 && index2 <= 0){
					phoneList = phone.split(",");
				}else if(index1 <= 0 && index2 >0){
					phoneList = phone.split("，");
				}
				if(genType == 'line'){
					$("div[id^='"+MeragePlatCall.declare.phoneContainer+"']").each(function(n,ulPhoneObj){
						//var liHtml = MeragePlatCall.getPhoneLiHtml(n,phoneList[n]);
						var liHtml = MeragePlatCall.getPhoneLiHtml(n,phoneList[n]);
						//$(ulPhoneObj).find("li").remove();
						$(ulPhoneObj).find("a[key='tel']").remove();
						
						$(ulPhoneObj).append(liHtml);
					});
				}else{
					for(var i = 0 ; i < phoneList.length ; i ++){
						liHtml += MeragePlatCall.getPhoneLiHtml(i,phoneList[i]);
					}
					//$(ulPhoneObj).find("a .icon-svg3 .colorgreen").remove();
					$("#"+MeragePlatCall.declare.phoneContainer+" a[key='tel']").remove();
					$("#"+MeragePlatCall.declare.phoneContainer).append(liHtml);
				}
			}
		},
		//设置每个电话的呼叫HTML内容
		getPhoneLiHtml:function(index,phone){
			var privateFlag = $("#"+MeragePlatCall.declare.privateFlag).val();
			//洗客是否保护号码
			var phoneProtect = $("#"+MeragePlatCall.declare.phoneProtect).val();
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
			
			var customerId = $("#"+MeragePlatCall.declare.objectId).val();
			if(privateFlag!=null && privateFlag == 'Y'){//私客
				phone = "1*********" ;
			}
			var html = "" ;
			html += "<li id='li_phoneShow_"+index+"' style='display:none;'>" ;
			
				html += "<span id='span_customerPhone_"+index+"' class='phone-number' onmouseover=MeragePlatCall.setPhoneEditPanel("+(phoneProtect == "Y" ? "'hide'" : "'show'" )+","+index
				+"); style='"+(MeragePlatCall.declare.isShowPhone ? "display:block;" : "display:none;")+"'>"+phone+"</span>" ;
				html += "<span id='span_editPhone_"+index+"' style='display:none;'>" ;
				html += "<input id='ipt_editPhone_"+index+"' value='"+phone+"' class='ws-phone-input'   type='text' onblur=MeragePlatCall.setPhoneEditPanel('hide',"+index+"); onmouseout=MeragePlatCall.setPhoneEditPanel('hide',"+index+"); />" ;
				html += "</span>" ;
				if(privateFlag == null || privateFlag != 'Y'){//非私客
					if(MeragePlatCall.declare.isShowMsg){
						html += "<a id='btnSendMessage' href='javascript:void(0)' class='btnSendMessage ml10' onclick=sendMessage('"+customerId+"','')>" ;
						html += "</a>" ;
					}
				}
				html += "</li>" ;
				// 短信
				//html += "<a class='cktop-r02 font28 icon-svg2 colororange ui-link' href='sms:"+realPhone+"'>&nbsp;</a>" ;
				// 呼叫
				html += "<a class='cktop-r01 font28 icon-svg3 colorgreen ui-link' id='span_bar_call_"+index+"' key='tel' onclick=MeragePlatCall.dialPhone('"+index+"','"+realPhone+"');  style='display:none;' href='javascript:void(0)'>&nbsp;</a>";
				//挂断
				html += "<a class='cktop-r01 font28 icon-svg3 colorgreen ui-link' id='span_bar_hook_"+index+"'  key='tel' onclick=MeragePlatCall.callHook('"+index+"');  style='display:none;' href='javascript:void(0)'>&nbsp;</a>";
				// 错误
				html += "<a class='cktop-r01 font28 icon-svg3 colorgreen ui-link' id='span_bar_error_"+index+"'  key='tel' style='display:none;' href='tel:"+phone+"'>&nbsp;</a>";
				html += "<a class='cktop-r01 font28 icon-svg3 colorgreen ui-link' id='span_bar_forbid_"+index+"'  key='tel' style='display:none;' href='tel:"+phone+"'>&nbsp;</a>";
				//选择线路
				html += "<a class='cktop-r01 font28 icon-svg3 colorgreen ui-link' id='span_bar_selectLine_"+index+"'  key='tel' style='display:none;' href='tel:"+phone+"'>&nbsp;</a>";
			
			return html ;
		},
		//设置每个电话状态显示HTML内容
		setPhoneShowStatusHtml:function(genType){
			var html = "" ;
			html += '<p id="p_bar_call" style="color: #47991f;display: block;"><font id="font_callText1"></font></p>';
			html += '<p id="p_bar_hook" style="color: #e67300;display: none;"><font id="font_callText2"></font></p>';
			html += '<p id="p_bar_error" style="color: #ed1818;display: none;"><font id="font_callText3"></font></p>';
			html += '<p id="p_bar_forbid" style="color: #666666;display: none;"><font id="font_callText4"></font></p>';
			//html += '<p id="p_bar_selectLine" style="color: #47991f;display: none;">未连接</p>';
			
			if(genType == 'line'){
				$("[id^='"+MeragePlatCall.declare.phoneShowContainer+"']").html("");
				$("[id^='"+MeragePlatCall.declare.phoneShowContainer+"']").append(html);
			}else{
				$("#"+MeragePlatCall.declare.phoneShowContainer).html("");
				$("#"+MeragePlatCall.declare.phoneShowContainer).append(html);
			}
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
			html += '<a id="a_changeDispPhone" href="javascript:void(0)" onclick="MeragePlatCall.switchShowPhone();" >换成匿名呼叫</a>';
			html += '</b>';
			html += '<b class="btn greenbtn">';
			html += '<a href="javascript:void(0)" onclick="MeragePlatCall.outLine();" >下线</a>';
			html += '</b>';
			$("#"+MeragePlatCall.declare.loginSuccContainer).html("");
			$("#"+MeragePlatCall.declare.loginSuccContainer).append(html);
		}
};
/**
 * 选择使用线路之后
 */
function selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd){
	MeragePlatCall.isSelectLine = true ;
	MeragePlatCall.lineType = setType ;
	MeragePlatCall.phoneType = phoneType;
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
	MeragePlatCall.setCallUserInfo(lineUser);
	MeragePlatCall.showPhone = showPhone;
	if(phoneType=='TTEN'){
		//判断话伴插件的登录状态
		TTAsk.onGetState();
		var result = TTAsk.rtn ;
		if(result <= 2 ){//已连接，未登录状态
			MeragePlatCall.setCtrlStatus("call",false,null,MeragePlatCall.phoneType);
			MeragePlatCall.loginCall();
		}else{
			//已登录，自动呼叫
			//MeragePlatCall.dialPhone();
			MeragePlatCall.setCtrlStatus("call",false,null,MeragePlatCall.phoneType);
		}
	}else if(phoneType=='HW'){
		MeragePlatCall.isLogin = true ;
		MeragePlatCall.userId = userId;
		MeragePlatCall.passWord = password;
		MeragePlatCall.appId = orgId;
		$("#"+MeragePlatCall.declare.loginSuccContainer).show();
		MeragePlatCall.spid=spid;
		MeragePlatCall.passWd=passWd;
		MeragePlatCall.httpUrl=httpUrl;
		$("#font_currShowPhone").text(PhoneConversion(MeragePlatCall.showPhone));
		MeragePlatCall.setCtrlStatus("call",false,null,MeragePlatCall.phoneType);
		MeragePlatCall.currShowPhone=showPhone;
		MeragePlatCall.remarkLine();
	}else {
		
	}
	
}