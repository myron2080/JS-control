/**
 * 内网平台--呼叫中心
 * 话务中心后期版本，用于jsp页面引入（前期1.0版本是用于html页面引入）
 * @version 2.0
 * @author li.biao
 * @since 2013-7-29
 */
var MerageCallCenter = {
		//连线sessionId
		callSessionId:'',
		//单次通话记录ID
		callRecordId:'',
		//单词通话话单ID
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
		
		//--------by lxl 14.4.1
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
		//主显号码
		defaultShowPhone:'',
		//----------------------
		
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
		//窗口关闭事件
		winClose:function(openDlg){
			//如果线路session还存在，则挂断
			if(MerageCallCenter.callSessionId!=null && MerageCallCenter.callSessionId!=''){
				if($('#dialPhoneIsHttp').val()!="Y"){					
					MerageCallCenter.callHook() ;
				}
			}
			openDlg.close();
		},
		//初始化
		init:function(){
			
			var params = MerageCallCenter.getUrlParam();
			$("#toPhone").val(params["toPhone"]);
			$("#toName").val(params["toName"]);
			$("#span_toName").text(params["toName"]);
			MerageCallCenter.callLinkObjectId = params["objectId"];
			
			//已经登录的获取呼叫人是否已经有选择过的空闲线路
			$.post(getPath()+'/cmct/phonenew/getUserInfo',{},function(res){
				if(res && res.STATE == 'SUCCESS'){
					$("#div_CallCenter").show();
					$("#div_noCall").hide();
					//设置呼叫人信息
					MerageCallCenter.setCallUserInfo(res.callSet);
					
					var callSet=res.callSet;
					//判断号码的合作商;
		   			var phoneType=callSet.phoneType;
		   			MerageCallCenter.phoneType=phoneType;
		   			if(phoneType=='HW'){
		   				MerageCallCenter.isLogin=true;
		   				MerageCallCenter.showPhone=callSet.showPhone;
		   				MerageCallCenter.userId=callSet.userId;
		   				MerageCallCenter.passWord=callSet.password;
		   				MerageCallCenter.currShowPhone=callSet.showPhone;
		   				MerageCallCenter.appId=callSet.orgInterfaceId;
		   				MerageCallCenter.spid=callSet.spid;
		   				MerageCallCenter.passWd=callSet.passWd;
		   				MerageCallCenter.httpUrl=callSet.httpUrl;
		   				MerageCallCenter.defaultShowPhone=callSet.defaultShowPhone;
		   				if(Loading.isExistLoad()){
							Loading.close();//关闭加载
						}
		   				MerageCallCenter.setPanelDynamicMsg("连接成功");
						//记录线路
						MerageCallCenter.remarkLine();
						
		   			}else {
		   				if($('#dialPhoneIsHttp').val()=='Y'){	
		   					MerageCallCenter.isLogin=true;
		   					//记录线路
		   					if(Loading.isExistLoad()){
								Loading.close();//关闭加载
							}
		   					MerageCallCenter.setPanelDynamicMsg("连接成功");
							MerageCallCenter.remarkLine();
		   				}else{
		   					//添加监听
		   					MerageCallCenter.addEventListener();
		   					
		   					//判断话伴插件的登录状态
		   					TTAsk.onGetState();
		   					var result = TTAsk.rtn ;
		   					if(result == 0){//未连接
		   						MerageCallCenter.setPanelDynamicMsg("呼叫线路未连接");
		   						$("#line_select").hide();
		   						$("#line_unselect").show();
		   						$("#p_seatPhoneList").hide();
		   					}else if(result == 1 || result == 2 ){//已连接，未登录状态
		   						MerageCallCenter.loginCall();
		   					}else{
		   						//已登录，自动呼叫
		   						MerageCallCenter.dialPhone();
		   					}
		   				}
		   			}
					
				}else if(res && res.STATE == 'FAIL'){
					if(Loading.isExistLoad()){
						Loading.close();//关闭加载
					}
					//未找到空闲线路，自己选择
					MerageCallCenter.setPanelDynamicMsg("未选择话务线路");
				}else{
					//未登录系统
					MerageCallCenter.setCtrlStatus("forbid",false);
					MerageCallCenter.isAllowCall = false ;
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
			if(cp.setType!=null && cp.setType!=''){
				MerageCallCenter.lineType = cp.setType ;
			}
			
			$("#font_huatong").text("话筒："+cp.alias);
			$("#font_showPhone").text(cp.showPhone);
			var defaultShowPhone = cp.defaultShowPhone ;
			/*
			if(defaultShowPhone == null || defaultShowPhone == ''){
				$("#ck_hide").attr("checked",true);
			}
			*/
			$("#line_select").show();
			$("#line_unselect").hide();
			$("#p_seatPhoneList").show();
			
			//共享线路不允许切换话机
			if(MerageCallCenter.lineType == 'SHAR'){
				$("#mySeatPhoneList").hide();
			}
			TTAsk.getCallBillId($("#orgId").val());
		},
		//登录话伴接口
		loginCall:function(){
			
			//添加监听
			MerageCallCenter.addEventListener();
			
			var userId = $("#userId").val();
			var callPersonId = $("#callPersonId").val();
			var loginNumber = $("#loginNumber").val();
   			var password = $("#password").val();
   			var orgId = $("#orgId").val();
   			
   			//登录话伴
   			TTAsk.onLogin(userId,password,orgId);
   			if(TTAsk.rtn == 0){//操作提交成功
   				
   			}else if (TTAsk.rtn == -1){//提交参数不合格
   				MerageCallCenter.setPanelDynamicMsg("请求连接参数不合格");
   				MerageCallCenter.setCtrlStatus("forbid",false);
   				MerageCallCenter.isAllowCall = false ;
   			}else{//其他失败
   				MerageCallCenter.setPanelDynamicMsg("请求连接失败")
   				MerageCallCenter.setCtrlStatus("forbid",false);
   				MerageCallCenter.isAllowCall = false ;
   			}
		},
		//登出接口
		logoutCall:function(){
			var callPersonId = $("#callPersonId").val();
			if(callPersonId!=null && callPersonId!=''){
				TTAsk.onLogout();
			}else{
				setTimeout(function(){art.dialog.close();},100);
			}
		},
		// 监听呼叫事件
		listenCallEvent : function(evCode, evDescrible) {
			if(MerageCallCenter.phoneType!='HW' && $('#dialPhoneIsHttp').val()!="Y"){
				//添加日志
				MerageCallCenter.addLog(evCode, evDescrible);
				var callRtnObj = eval("("+evDescrible+")");
				if (callRtnObj.cmd == 'Login') {//登录
					if(evCode == 100){
						MerageCallCenter.setPanelDynamicMsg("正在登录...");
					}else if(evCode == 200){//如果登录之后连接成功，检验号码正确，自动拨打
						if(Loading.isExistLoad()){
							Loading.close();//关闭加载
						}
						MerageCallCenter.setPanelDynamicMsg("连接成功");
						//记录呼叫线路
						//if(MerageCallCenter.isSelectLine){
							MerageCallCenter.remarkLine();
						//}
						//获取所有去电号码
						MerageCallCenter.setShowPhone();
						//获取所有接听话机
						MerageCallCenter.setSeatPhone() ;
						//自动呼叫
						if($("#toPhone").val()!=''){
							//MerageCallCenter.dialPhone();
						}
					}else if(evCode == 404){
						if(Loading.isExistLoad()){
							Loading.close();//关闭加载
						}
						MerageCallCenter.setPanelDynamicMsg("登录失败...");
					}
				}else if(callRtnObj.cmd == 'DialPhone'){//呼叫
					MerageCallCenter.setPanelDynamicMsg(MerageCallCenter.getCallMsgByEventCode(evCode));
					if(evCode == 100){
						MerageCallCenter.setCostTimeBar("clean");
						//切换图标状态
						MerageCallCenter.setCtrlStatus("hook");
						var responseTime = (new Date()).getTime();
						//记录呼叫记录（服务器响应成功）
						MerageCallCenter.callRecord('','',MerageCallCenter.callBillId,(responseTime - MerageCallCenter.callSendTime));
						//更新呼叫记录
						//MerageCallCenter.callRecordUpdate(callRtnObj.calldur,'C_122','',(responseTime - MerageCallCenter.callSendTime));
					}else if(evCode == 200){
					}else if(evCode == 132 ){//通话中
						MerageCallCenter.isHookSelf = false ;//建立通话的时候，比较不用手动挂断坐席，交由接口系统挂断
						MerageCallCenter.setCostTimeBar("start");
					}else if(evCode == 201){//用户挂机
						MerageCallCenter.setCostTimeBar("stop");
						MerageCallCenter.setCtrlStatus("forbid",true);
						MerageCallCenter.callRecordUpdate(callRtnObj.calldur,'C_128');//更新呼叫记录（呼叫成功）
					}else if(evCode == 202){//通话结束
						MerageCallCenter.callSessionId = '' ;
						MerageCallCenter.setCtrlStatus("call");
						MerageCallCenter.setCostTimeBar("stop");
						//匿名呼出则切换到显示呼出
						if(MerageCallCenter.currShowPhone == MerageCallCenter.hidePhone){
							MerageCallCenter.hideTip("switch");
						}
					}else if(evCode == 404){//
						MerageCallCenter.setCtrlStatus("error");
						MerageCallCenter.setCostTimeBar("stop");
						MerageCallCenter.callSessionId = '' ;
						MerageCallCenter.callRecordUpdate('','C_127','404_操作失败');//更新呼叫记录（404操作失败）
					}else if(evCode == 500){//
						MerageCallCenter.setCtrlStatus("error");
						MerageCallCenter.setCostTimeBar("stop");
						MerageCallCenter.callSessionId = '' ;
					}
				}else if(callRtnObj.cmd == 'Hook'){//挂断
					if(evCode == 100){
						var h = MerageCallCenter.timeUnit.h;
						var m = MerageCallCenter.timeUnit.m; 
						var s = MerageCallCenter.timeUnit.s; 
						var time = h*60*60 + m*60 + s ;
						if(time == null || isNaN(parseInt(time))){
							time = '' ;
						}
						MerageCallCenter.setPanelDynamicMsg("正在挂断...");
						MerageCallCenter.setCostTimeBar("stop");
						MerageCallCenter.setCtrlStatus("forbid",true);
						if(MerageCallCenter.callRecordId!=null && MerageCallCenter.callRecordId!=''){
							MerageCallCenter.callRecordUpdate(time, 'C_125', '坐席挂机...');
						}
					}else if(evCode == 200){
						//没有200
					}
				}else if(callRtnObj.cmd == 'GetAllSeatPhones'){//获取所有话机
					if(evCode == 200){
						var opHtml = "" ;
						var seatPhoneList = callRtnObj.phonelist.split("|");
						for(var i = 0 ; i < seatPhoneList.length ; i ++ ){
							opHtml += "<option  value='" ;
							opHtml += seatPhoneList[i] +"'" ;
							if(seatPhoneList[i] == callRtnObj.curphone){
								opHtml += " selected >" ;
							}else{
								opHtml += " >" ;
							}
							opHtml += PhoneConversion(seatPhoneList[i]) ;
							opHtml += "</option>" ;
						}
						$("#mySeatPhoneList option").remove();
						$("#mySeatPhoneList").append(opHtml);
					}
				}else if(callRtnObj.cmd == 'SwitchSeatPhone'){//切换话机
					if(evCode == 200){
						MerageCallCenter.setPanelDynamicMsg("切换话机成功");
					}else if(evCode == 404){
						MerageCallCenter.setPanelDynamicMsg("切换话机操作失败");
					}
				}else if(callRtnObj.cmd == 'GetAllDispPhones'){//获取所有去电显示号码
					if(evCode == 200){
						var seatPhoneList = callRtnObj.phonelist.split("|");
						MerageCallCenter.currShowPhone = callRtnObj.curphone ;
						for(var i = 0 ; i < seatPhoneList.length ; i ++ ){
							if("HIDE" == seatPhoneList[i]){
								MerageCallCenter.hidePhone = seatPhoneList[i] ;
							}else{
								MerageCallCenter.showPhone = seatPhoneList[i];
							}
						}
						if(MerageCallCenter.currShowPhone == MerageCallCenter.hidePhone){
							$("#ck_hide").attr("checked",true);
							//匿名的切换成显示呼叫
							MerageCallCenter.hideTip('switch');
						}
					}
				}else if(callRtnObj.cmd == 'SwitchDispPhone'){//切换去电号码
					if(evCode == 200){
						if(MerageCallCenter.currShowPhone){
							//保存到本地数据库
							MerageCallCenter.saveShowPhone(PhoneConversion(MerageCallCenter.currShowPhone));
						}
						if(MerageCallCenter.currShowPhone == MerageCallCenter.hidePhone){
							MerageCallCenter.currShowPhone = MerageCallCenter.showPhone ;
							$("#ck_hide").attr("checked",false);
						}else{
							MerageCallCenter.currShowPhone = MerageCallCenter.hidePhone ;
							$("#ck_hide").attr("checked",true);
						}
					}else if(evCode == 404){
						MerageCallCenter.setPanelDynamicMsg("操作失败");
					}
				}else if(callRtnObj.cmd == 'Logout'){//登出
					if(evCode == 200){
						MerageCallCenter.setPanelDynamicMsg("呼叫线路未连接");
					}else if(evCode == 404){
						MerageCallCenter.setPanelDynamicMsg("登出失败...");
					}
				}else if(callRtnObj.cmd == 'systemreturn'){//系统返回
					if(callRtnObj.state == "ForceOffLine"){
						MerageCallCenter.setPanelDynamicMsg("您的账号在另一地点登陆，您被迫下线");
					}else{
						MerageCallCenter.setPanelDynamicMsg("系统错误");
					}
					if(Loading.isExistLoad()){
						Loading.close();//关闭加载
					}
				}
				
				//500详细提醒
				var errorMsg = "" ;
				if(evCode == 500){
					var failres = callRtnObj.failres ;
					if(failres!=null && failres!=''){
						//500错误详细原因
						errorMsg = MerageCallCenter.get500MsgByEventCode(failres) ;
						MerageCallCenter.setPanelDynamicMsg(errorMsg);
					}
					var callres = callRtnObj.callres ;
					if(callres!=null && callres!=''){
						errorMsg = MerageCallCenter.get500MsgByEventCode(callres) ;
						MerageCallCenter.setPanelDynamicMsg(errorMsg);
					}
					var noRes = callRtnObj.nResult ;
					if(noRes!=null && noRes!=''){
						errorMsg = MerageCallCenter.get500MsgByEventCode(noRes) ;
						MerageCallCenter.setPanelDynamicMsg(errorMsg);
					}
				}
				//呼叫失败
				if(callRtnObj.cmd == 'DialPhone' && evCode == 500){
					MerageCallCenter.callRecordUpdate(callRtnObj.calldur,'C_127',errorMsg);//更新呼叫记录（呼叫失败）
				}
			}
		},
		//呼叫
		dialPhone:function(){		
			if(MerageCallCenter.phoneType!='HW'){
				
				if(!MerageCallCenter.isAllowCall){
					return false ;
				}
				var toPhone = $("#toPhone").val();
				//去除空格
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
				if(toPhone == null || toPhone ==''){
					art.dialog.tips("请输入用户手机号码");
					return false ;
				}else if(!(MerageCallCenter.checkMobile(toPhone) || MerageCallCenter.checkPhone(toPhone))){
					art.dialog.tips("用户手机号码格式不正确");
					return false ;
				}
				//呼叫
				var converPhoneResult = NumberConversion(toPhone);
				if(converPhoneResult[0] > 0){//转换号码格式是否正确
					MerageCallCenter.setPanelDynamicMsg("号码错误");
					return false;
				}
				
				if($('#dialPhoneIsHttp').val()=="Y"){
					this.dialPhoneByHttp(toPhone);
				}else{
					//获取一下当前连接状况
					TTAsk.onGetState();
					if(TTAsk.rtn == 0){
						MerageCallCenter.setPanelDynamicMsg("呼叫线路未连接");
					}else{
						//判断电话线路
						if(MerageCallCenter.callSessionId!=null && MerageCallCenter.callSessionId!=''){
							TTAsk.onGetCallLineState(MerageCallCenter.callSessionId);
							//会话已释放||空闲||对方挂机||本地挂机可以进行下一次拨号
							if(TTAsk.rtn == -1 || TTAsk.rtn == 0 
									|| TTAsk.rtn == 8 || TTAsk.rtn == 9 ){
								
							}else{
								MerageCallCenter.setPanelDynamicMsg("上通呼叫还在处理中，请稍后...");
								MerageCallCenter.addLog("404", "上通呼叫还在处理中...");
								return false ;
							}
						}
						
						//呼叫处理中...禁止操作
						MerageCallCenter.setCtrlStatus("forbid",false);
						var btime = (new Date()).getTime();
						//获取一个正确的话单ID
						var billId = TTAsk.getCallBillId($("#orgId").val());
						if(billId){
							MerageCallCenter.callBillId = billId ;
							MerageCallCenter.isHookSelf = true ;//如果通话连接未建立之前挂断，标记需要挂断坐席
							TTAsk.onCall(converPhoneResult[1],billId);//拨打号码，话单id
							if(TTAsk.rtn >= 0 ){
								MerageCallCenter.callSessionId = TTAsk.rtn ;//记录用户线路session
								var etime = (new Date()).getTime();
								MerageCallCenter.callSendTime = etime ;
							}else{
								MerageCallCenter.setPanelDynamicMsg("呼叫返回错误状态");
								MerageCallCenter.setCtrlStatus("error");
								MerageCallCenter.setCostTimeBar("stop");
							}
						}
						
					}
				}
			}else{
				var toPhone = $("#toPhone").val();
				//去除空格
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
				if(toPhone == null || toPhone ==''){
					art.dialog.tips("请输入用户手机号码");
					return false ;
				}else if(!(MerageCallCenter.checkMobile(toPhone) || MerageCallCenter.checkPhone(toPhone))){
					art.dialog.tips("用户手机号码格式不正确");
					return false ;
				}
				//呼叫
				var converPhoneResult = NumberConversion(toPhone);
				if(converPhoneResult[0] > 0){//转换号码格式是否正确
					MerageCallCenter.setPanelDynamicMsg("号码错误");
				}else{
					//呼叫处理中...禁止操作
					MerageCallCenter.setCtrlStatus("forbid",false);
					var btime = (new Date()).getTime();
					//获取一个正确的话单ID
					var billId = TTAsk.getCallBillId($("#orgId").val());
					if(billId){
						MerageCallCenter.callBillId = billId ;
						MerageCallCenter.isHookSelf = true ;//如果通话连接未建立之前挂断，标记需要挂断坐席
						MerageCallCenter.setCostTimeBar("clean");				
						var etime = (new Date()).getTime();
						MerageCallCenter.callSendTime = etime ;//当前拨打的时间
						FjctCall.dailPhoneCenter(MerageCallCenter.userId,MerageCallCenter.passWord,MerageCallCenter.showPhone,toPhone,MerageCallCenter.appId,MerageCallCenter.httpUrl,MerageCallCenter.spid,MerageCallCenter.passWd,MerageCallCenter.defaultShowPhone);
					}
				}
			}
		},
		
		//33E9 HTTP方式拨打电话
		dialPhoneByHttp:function(toPhone){
			if(!$('#orgId').val()){
				art.diaolog.tips('核算渠道组织id为空...');
				return false;
			}
			if(!$('#callPersonId').val()){
				art.diaolog.tips('请选择线路...');
				return false;
			}
			var callBillId=TTAsk.getCallBillId($("#orgId").val());
			$.post(getPath()+"/cmct/phonenew/dialPhone",{memberId:$('#callPersonId').val(),otherNumber:toPhone,sessionId:callBillId},function(res){
				if(res.STATE=="SUCCESS"){
					MerageCallCenter.callSessionId=callBillId;
					MerageCallCenter.setCtrlStatus("forbid",false);
					MerageCallCenter.setPanelDynamicMsg("呼叫中...");
					MerageCallCenter.callRecord(toPhone,'',callBillId,'');
					setTimeout(function(){
						MerageCallCenter.setCtrlStatus("hook");
					},5000);
				}else{
					MerageCallCenter.setPanelDynamicMsg(res.MSG);
				}
			},'json');
		},
		
		//挂断
		callHook:function(){
			if(MerageCallCenter.callSessionId!=null && MerageCallCenter.callSessionId!=''){
				//挂断处理中...禁止操作
				MerageCallCenter.setCtrlStatus("forbid",false);
				
				if(MerageCallCenter.phoneType!='HW'){
					if($('#dialPhoneIsHttp').val()=="Y"){
						MerageCallCenter.callSessionId="";
						setTimeout(function(){
							MerageCallCenter.setCtrlStatus("call");
						},2000);
					}else{						
						//挂断被叫
						TTAsk.onHook(MerageCallCenter.callSessionId);
						if(TTAsk.rtn == 0 ){
							//是否要挂断坐席
							if(MerageCallCenter.isHookSelf){
								var selfSessionId = 0 ;
								TTAsk.onHook(selfSessionId);
							}
						}else{
							MerageCallCenter.setPanelDynamicMsg("挂断失败");
						}
					}
				}else{
					FjctCall.hookPhoneCenter(MerageCallCenter.appId,MerageCallCenter.passWd,MerageCallCenter.spid,MerageCallCenter.httpUrl);
				}
				
			}else{
				MerageCallCenter.setCtrlStatus("call");
				MerageCallCenter.setCostTimeBar("stop");
			}
		},
		//通话记录
		callRecord:function(toPhone,toName,callBillId,time){
			if(toPhone == null || toPhone == ''){
				toPhone = $("#toPhone").val();
				toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
			}
			if(toName == null || toName == ''){
				toName = $("#toName").val();
			}
			MerageCallCenter.callRecordId = '' ;
			$.post(getPath()+'/cmct/phonenew/record',{
				toPhone:toPhone,
				toName:toName,
				currShowPhone:MerageCallCenter.currShowPhone,
				callBillId:callBillId,
				objectId:MerageCallCenter.callLinkObjectId,
				time:time,
				callLineId:$("#callPersonId").val()
			//	sessionId:MerageCallCenter.callSessionId
			},function(res){
				if(res && res.STATE == 'SUCCESS'){
					MerageCallCenter.callRecordId = res.ID ;//记录单次通话ID
				}else{
					art.dialog.alert(res.MSG);
				}
			},'json');
		},
		//更新单次通话记录{callDur:通话时长,callResult:状态,remark:备注，time:耗时}
		callRecordUpdate:function(callDur,callResult,remark,time){
			if(MerageCallCenter.callRecordId != null && MerageCallCenter.callRecordId != ''){
				$.post(getPath()+'/cmct/phonenew/recordUpdate',{
					recordId:MerageCallCenter.callRecordId,
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
				msgHtml = "网络异常" ;
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
		//设置呼叫面板的动态信息
		setPanelDynamicMsg:function(msg){
			$("span[id^='span_callStatus']").html(msg);
		},
		//添加日志
		addLog:function(code,rtnDesc){
			$("#div_callLog").html($("#div_callLog").html()+("<br/>"+code+":"+rtnDesc));
			if(code == '404' || code == '500'){//记录日志
				$.post(getPath()+"/cmct/phonenew/addLog",{
					toName:MerageCallCenter.getUrlParam()["toName"],
					toPhone:MerageCallCenter.getUrlParam()["toPhone"]||$("#toPhone").val(),
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
				if(MerageCallCenter.phoneType!='HW' && $('#dialPhoneIsHttp').val()!="Y"){
					TTAsk.onGetState();
					if(TTAsk.rtn == 0 ){
						MerageCallCenter.setPanelDynamicMsg("呼叫线路未连接");
					}else{
						MerageCallCenter.setPanelDynamicMsg("连接成功");
					}
				}else{
					MerageCallCenter.setPanelDynamicMsg("连接成功");
				}
			
			}else if(showType == 'forbid'){
				if(isReCall){//禁用，允许自动恢复到呼叫，延迟3秒
					setTimeout(function(){MerageCallCenter.setCtrlStatus('call')},3000);
				}
			}
		},
		//管理呼叫通话计时器
		setCostTimeBar:function(type){
			MerageCallCenter.timeUnit.h = 0 ;
			MerageCallCenter.timeUnit.m = 0 ; 
			MerageCallCenter.timeUnit.s = 0 ; 
			if(type == "start"){//计时开始
				MerageCallCenter.timeCount();
			}else if(type == "stop"){//结束
				clearTimeout(MerageCallCenter.timeUnit.timeObj);
			}else{//清空 clean
				$("#timeBar").html("00：00：00");
			}
		},
		//计时器
		timeCount:function(){
			MerageCallCenter.timeUnit.s += 1 ;
			if(MerageCallCenter.timeUnit.s == 60){
				MerageCallCenter.timeUnit.m += 1;
				MerageCallCenter.timeUnit.s = 0 ;
			}
			if(MerageCallCenter.timeUnit.m == 60){
				MerageCallCenter.timeUnit.h += 1 ;
				MerageCallCenter.timeUnit.m = 0 ;
			}
			var timeStr = "" ;
			timeStr += (MerageCallCenter.timeUnit.h<10) ? ("0"+MerageCallCenter.timeUnit.h+"：") : (MerageCallCenter.timeUnit.h+"：") ;
			timeStr += (MerageCallCenter.timeUnit.m<10) ? ("0"+MerageCallCenter.timeUnit.m+"：") : (MerageCallCenter.timeUnit.m+"：") ;
			timeStr += (MerageCallCenter.timeUnit.s<10) ? ("0"+MerageCallCenter.timeUnit.s) : MerageCallCenter.timeUnit.s ;
			$("#timeBar").html(timeStr);
			MerageCallCenter.timeUnit.timeObj = setTimeout("MerageCallCenter.timeCount()",1000)
		},
		
		//得到通话时间
		getCallCostTime:function(){
			var h = MerageCallCenter.timeUnit.h;
			var m = MerageCallCenter.timeUnit.m; 
			var s = MerageCallCenter.timeUnit.s; 
			var time = h*60*60 + m*60 + s ;
			if(time == null || isNaN(parseInt(time)) || 0 == parseInt(time)){
				time = '' ;
			}
			return time ;
		},
		//设置话机
		setSeatPhone:function(){
			//获取所有话机
			TTAsk.onGetAllSeatPhones();
			if(TTAsk.rtn!=0){
				MerageCallCenter.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//切换话机
		switchSeatPhone:function(){
			var phoneNo = $("#mySeatPhoneList").val() ;
			if(phoneNo!=""){
				TTAsk.onSwitchSeatPhone(phoneNo);
				if(TTAsk.rtn == 0 ){
					//保存到本地数据库
					MerageCallCenter.saveSeatPhone(PhoneConversion(phoneNo));
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
				MerageCallCenter.setPanelDynamicMsg("连接未处于正确状态或者其他错误");
			}
		},
		//保存去电显示号码
		saveShowPhone:function(phoneNo){
			var callPersonId = $("#callPersonId").val();
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
			if (phoneNo)
				 phoneNo = phoneNo.replace('\\s','');
			var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{7,8}$/ ;
			var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])([-])\d{3}$/ ;
			var var3 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])\d{7,8}$/ ;
			var var4 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])\d{3}$/ ;
			if(MerageCallCenter.phoneType == 'HW'){
				return var3.test(phoneNo) || var4.test(phoneNo) ;
			}else{
				return var1.test(phoneNo) || var2.test(phoneNo) || var3.test(phoneNo) || var4.test(phoneNo);
			}
		},
		//插件加载
		pluginLoaded:function(){
			alert('话伴插件下载！');
		},
		//添加呼叫动态事件监听
		addEventListener:function(){
			var tt_doc = document.getElementById("huaban");
			if(tt_doc == null){
				tt_doc = top.document.getElementById("huaban");
			}
			if (window.addEventListener){
				tt_doc.addEventListener("huabanevent", MerageCallCenter.listenCallEvent, false); 
			}else{
				tt_doc.attachEvent("on"+"huabanevent", MerageCallCenter.listenCallEvent);
			} 
		},
		//匿名呼叫提醒报批领导（switchFlag界面调用不用传值，呼叫完自动切换成显示传值）
		hideTip:function(switchFlag){
			var hideFlag = $("#ck_hide").attr("checked");
			var phoneParam = "" ;
			if(switchFlag){
				phoneParam = MerageCallCenter.showPhone ;
			}else{
				if(hideFlag){
					phoneParam = MerageCallCenter.hidePhone ;
				}else{
					phoneParam = MerageCallCenter.showPhone ;
				}
			} 
			TTAsk.onSwitchDispPhone(phoneParam);
			if(TTAsk.rtn == 0 ){
			}else if(TTAsk.rtn = -1){
				//art.dialog.tips("该号码不是去电号码");
			}else{
				//art.dialog.tips("切换去电号码调用接口错误");
			}
		},
		//选择线路
		selectLine:function(){
			var openUrl = getPath()+'/cmct/phonenew/selectLine' ;
			/*
			var ldgSelectLine = parent.$.ligerDialog.open({
				width:680,
				height:500,
				url: openUrl,
				title:"选择线路",
				isResize:true,
				modal:false,
				isDrag:true});
			*/
			//var newWindow = window.showModalDialog(openUrl,'_blank','dialogWidth=800px,dialogHeight=550px');
			var newWindow = window.open(openUrl,'_blank','toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no,status=no');
			newWindow.moveTo($(document).width() ,$(document).height());
			newWindow.resizeTo(800,550);
			newWindow.focus();
		},
		//标记呼叫线路
		remarkLine:function(){
			var callPersonId = $("#callPersonId").val();
   			if(callPersonId){
   				$.post(getPath()+"/cmct/phonenew/remarkLine",{
   					callPersonId:callPersonId
   				},function(data){
   					
   				},'json');
   			}
		},
		//标记呼叫线路下线
		outLine:function(){
			var callPersonId = $("#callPersonId").val();
			if(MerageCallCenter.callSessionId!=null && MerageCallCenter.callSessionId!=''){
				art.dialog.tips('通话还没结束不能下线....');
				return false;
			}
   			if(callPersonId){
   				$.post(getPath()+"/cmct/phonenew/outLine",{
   					callPersonId:callPersonId
   				},function(data){
   					if(data && data.STATE == 'SUCCESS'){
   						$("#line_unselect").show();
   						$("#p_seatPhoneList").hide();
   						$("#line_select").hide();
   						if(MerageCallCenter.phoneType!='HW' && $('#dialPhoneIsHttp').val()!="Y"){
   							//话伴登出
   	   						MerageCallCenter.logoutCall();
   						}else{
   							MerageCallCenter.setPanelDynamicMsg("呼叫线路未连接");
   						}
   					}
   				},'json');
   			}
		},
		//显示日志
		showLog:function(){
			var openFlag = $("#div_callLog").attr("openFlag");
			if(openFlag == null || openFlag == ''){
				$("#div_callLog").show();
				$("#div_callLog").attr("openFlag","Y");
				$("#span_showlog").text("隐藏日志");
			}else{
				$("#div_callLog").hide();
				$("#div_callLog").attr("openFlag","");
				$("#span_showlog").text("日志");
			}
			/*
			art.dialog({
				content:$("#div_callLog")[0],
				id:'art_phoneCenter_callLog',
				okVal:'关闭'
			});
			*/
		},
		
		/**
		 * 归属地查询
		 */
		getHcode:function(){
			$('#toPhone').blur(function(){
				MerageCallCenter.initHcode($(this).val());
			});
		},
		
		initHcode:function(phone){
			$('#span_hcodeSearch').text('');
			if(!MerageCallCenter.checkMobile(phone)){
				return false;
			}
			$.post(getPath()+"/cmct/phoneFjctmember/getHcode",{phone:phone},function(res){
				if(res.STATE=='SUCCESS'){
					$('#span_hcodeSearch').text(res.province+" "+res.city+" "+res.corp);
				}
			},'json')
		}
};

/**
 * 选择使用线路之后
 */
function selectLineAfter(lineId,userId,password,orgId,loginNumber,alias,showPhone,defaultShowPhone,setType,currUserOrgId,mac,phoneType,httpUrl,spid,passWd){
	MerageCallCenter.isSelectLine = true ;
	MerageCallCenter.lineType = setType ;
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
	MerageCallCenter.setCallUserInfo(lineUser);
	
	MerageCallCenter.phoneType=phoneType;
	if(phoneType!='HW'){
		
		if($('#dialPhoneIsHttp').val()=="Y"){
			MerageCallCenter.remarkLine();
			MerageCallCenter.setPanelDynamicMsg("连接成功");
		}else{			
			//判断话伴插件的登录状态
			TTAsk.onGetState();
			var result = TTAsk.rtn ;
			if(result <= 2 ){//已连接，未登录状态
				MerageCallCenter.loginCall();
			}else{
				//已登录，自动呼叫
				MerageCallCenter.dialPhone();
			}
		}
	}else{
		MerageCallCenter.showPhone=showPhone ;
		MerageCallCenter.isLogin = true ;
		MerageCallCenter.userId = userId;
		MerageCallCenter.appId = orgId;
		MerageCallCenter.passWord = password;
		MerageCallCenter.spid=spid;
		MerageCallCenter.passWd=passWd;
		MerageCallCenter.httpUrl = httpUrl;
		MerageCallCenter.currShowPhone=showPhone;
		MerageCallCenter.defaultShowPhone=defaultShowPhone;
		MerageCallCenter.remarkLine();
		MerageCallCenter.setPanelDynamicMsg("连接成功");
	}
}