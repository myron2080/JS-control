var CTAsk={
	
	//定时器对象
	timeoutcomp:null,
	
	//当前电话是否已经挂掉,包括客户挂机和坐席挂机
	callDie:false,
	
	//获取状态时共用的一个ajax对象
	ajax:false,
	
	//通话时当前的状态
	callBackStatus:'',
	
	//拨打电话url
	dialPhoneUrl:getPath()+"/cmct/phoneFjctmember/dailPhone",
	
	//挂断电话url
	hookPhoneUrl:getPath()+"/cmct/phoneFjctmember/hookPhone",
	
	//测试url
	CtPhoneSessionTestUrl:getPath()+"/cmct/phoneFjctmember/ctPhoneSession",
	
	//获取通话状态url
	callStatusUrl:getPath()+"/cmct/phoneFjctmember/getCallStatus",
	
	//APPID
	appId:'',
	
	/**
	 * 拨打电话
	 */
	dialPhone:function(index,userId,passWord,showPhone,toPhone,appId,httpUrl,spid,passWd,defaultShowPhone){
		MeragePlatCall.isEnd = false ;
		MeragePlatCall.setCostTimeBar("clean");	
		var converPhoneResult = NumberConversion(toPhone);
		if(converPhoneResult[0] > 0){//转换号码格式是否正确
			MeragePlatCall.setPanelDynamicMsg("号码错误");
		}else{			
			MeragePlatCall.setPanelDynamicMsg("正在呼叫...");		
			var etime = (new Date()).getTime();
			MeragePlatCall.callSendTime = etime ;
			
			MeragePlatCall.setCtrlStatus("forbid",false,index);
			var dialPhoneUrl=CTAsk.dialPhoneUrl+"?userId="+userId+"&passWord="+passWord+"&showPhone="+showPhone+"&toPhone="+toPhone+"&appId="+appId+"&httpUrl="+httpUrl+"&spid="+spid+"&passWd="+passWd+"&defaultShowPhone="+defaultShowPhone;
			$.post(dialPhoneUrl,{},function(res){
				if(res.STATE=='SUCCESS'){
					MeragePlatCall.callSessionId=res.MSG;
					MeragePlatCall.callBillId=res.MSG;//页面跳转清除id
					CTAsk.dialSuccessAfter(toPhone);
					//获取呼叫状态
					setTimeout(function(){
						if(typeof(CTAsk.refreshCallStatus)=='function'){
							MeragePlatCall.callBackJson.callSessionId=res.MSG;
							CTAsk.refreshCallStatus(res.MSG,'WASH');
							CTAsk.temporaryTiming();
						 }
					},2000);
				}else{
					MeragePlatCall.setPanelDynamicMsg(CTAsk.getCallMsgByEventCode(res.MSG));
					MeragePlatCall.setCtrlStatus("forbid",true,index);
					CTAsk.addWashLog("{cmd:dailPhone,phone:"+showPhone+",state:"+res.MSG+"}");//记录日志
					setTimeout(function(){
						MeragePlatCall.setPanelDynamicMsg('连接成功');
					},2000);
					
				}		
			},'json')
		}
	},
	
	//坐席挂断电话
	hookPhone:function(index,appId,httpUrl,spid,passWd){
		if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
			MeragePlatCall.hookIndex = index ;
			//挂断处理中...禁止操作
			MeragePlatCall.setCtrlStatus("forbid",false,index);
			//清除定时器
			clearTimeout(CTAsk.timeoutcomp);
			CTAsk.callDie=true;
			var hookPhoneUrl=CTAsk.hookPhoneUrl+"?sessionid="+MeragePlatCall.callSessionId+"&appId="+appId+"&httpUrl="+httpUrl+"&spid="+spid+"&passWd="+passWd;
			$.post(hookPhoneUrl,{},function(res){
				if(res.STATE=='SUCCESS'){
					MeragePlatCall.callSessionId = '' ;//挂断成功.清空sessionId
					CTAsk.hookSuccessAfter();
				}else{					
					//挂断失败 ,默认成功		
					MeragePlatCall.setPanelDynamicMsg("正在挂断...");//假性挂断,不显示错误提示
					MeragePlatCall.setCostTimeBar("stop");
					
					//更新记录
					if(MeragePlatCall.callRecordId!=null && MeragePlatCall.callRecordId!=''){
						var time = MeragePlatCall.getCallCostTime() ;
						var callStatus="";
						var callRest="";
						if(time==0){
							callStatus="|未接通";
							callRest="C_125";
						}else{
							callRest="C_128";
						}
						
						MeragePlatCall.callRecordUpdate(time, callRest, '系统挂机...'+callStatus);//坐席挂机
					}				
					CTAsk.addWashLog("{cmd:hookPhone,phone:"+MeragePlatCall.showPhone+",state:"+res.MSG+",sessionId:"+MeragePlatCall.callSessionId+"}");//记录日志
					MeragePlatCall.callSessionId = '' ;
					MeragePlatCall.setCtrlStatus("forbid",true,index);
					
				}
			},'json')
		}else{
			//如果sessionId为空
			clearTimeout(CTAsk.timeoutcomp);//清除定时器
			MeragePlatCall.setCtrlStatus("call",false,index,MeragePlatCall.phoneType);
			MeragePlatCall.setCostTimeBar("stop");
		}
	},
	//拨打接口调用成功之后,更换图标
	dialSuccessAfter:function(toPhone){	
		setTimeout(function(){
			//切换图标状态
			MeragePlatCall.setCtrlStatus("hook",false,MeragePlatCall.dialIndex);//3.5秒之后切换到挂断按钮
		},3500);
		var responseTime = (new Date()).getTime();
		//记录呼叫记录（服务器响应成功）
		MeragePlatCall.currShowPhone=MeragePlatCall.showPhone;
		MeragePlatCall.callRecord(toPhone,'',MeragePlatCall.callSessionId,(responseTime - MeragePlatCall.callSendTime));
	},
	
	
	//挂断接口调用成功之后
	hookSuccessAfter:function(){
		var time = MeragePlatCall.getCallCostTime() ;
		var callStatus="";
		var callRest="";
		if(time==0){
			callStatus="|未接通";
			callRest="C_125";
		}else{
			callRest="C_128";
		}
		
		MeragePlatCall.setPanelDynamicMsg("正在挂断...");
		MeragePlatCall.setCostTimeBar("stop");
		MeragePlatCall.setCtrlStatus("forbid",true,MeragePlatCall.hookIndex,MeragePlatCall.phoneType);
		if(MeragePlatCall.callRecordId!=null && MeragePlatCall.callRecordId!=''){
			MeragePlatCall.callRecordUpdate(time, callRest, '坐席挂机...'+callStatus);//坐席挂机
		}
	},
	//定时更新状态  type:WASH,洗客.资源客, CENTER:呼叫中心
	refreshCallStatus:function(sessionId,type){
		if(sessionId){
			sessionId=sessionId;
		}else{
			sessionId=MeragePlatCall.callSessionId;
		}
		
		CTAsk.ajaxStatusBack(sessionId,type);
		
		CTAsk.timeoutcomp = setTimeout(function() {
			CTAsk.refreshCallStatus(sessionId,type);
		},1000);
	},
	
	//ajax请求数据
	ajaxStatusBack:function(sessionId,type){
		
		var getCallStatusUrl=CTAsk.callStatusUrl;
		if(!CTAsk.ajax){
			CTAsk.createAjaxObjet();
		}
		//发送请求
		CTAsk.ajax.open("get", getCallStatusUrl+"?id="+sessionId);
		 //设置回调函数
		CTAsk.ajax.onreadystatechange = function () {
            if (CTAsk.ajax.readyState == 4 && CTAsk.ajax.status == 200) {           	
            	CTAsk.callBackStatus = CTAsk.ajax.responseText;
            	
            	//洗客页面.客户管理.
            	if(type=='WASH'){
            		//后续根据监听到的状态处理业务逻辑
    	            if(typeof(CTAsk.getStatusCallBackAfter)=='function'){
    	            	CTAsk.getStatusCallBackAfter(CTAsk.ajax.responseText);
    				}
            	}else{//呼叫中心页面
            		if(typeof(CTAsk.getStatusCallBackAfterCenter)=='function'){
    	            	CTAsk.getStatusCallBackAfterCenter(CTAsk.ajax.responseText);
    				}
            	}
            }
        }
        //发送请求
		CTAsk.ajax.send(null);
	},
	
	//获取返回的状态之后
	getStatusCallBackAfter:function(msg){
		var msgArr=msg.split(",");	
		MeragePlatCall.callBackJson.callStatusType="";
		MeragePlatCall.callBackJson.callStatusName="";
		MeragePlatCall.setPanelDynamicMsg(CTAsk.getSpanStatus(msgArr[0]));//更新面板状态
		if(msgArr[0]=='ANSWERED'){
			if(msgArr[2]=="1"){
				MeragePlatCall.callBackJson.callStatusType="ANSWERED1";
				MeragePlatCall.setPanelDynamicMsg('主叫接听中...');
			}
			if(msgArr[2]=="2"){
				MeragePlatCall.callBackJson.callStatusType="ANSWERED2";
				MeragePlatCall.setPanelDynamicMsg('被叫接听中...');
				if(!(MeragePlatCall.getCallCostTime()>0)){					
					MeragePlatCall.setCostTimeBar("start");//开始计时
				}
			}
		}else if(msgArr[0]=='DISCONNECTED'){//客户挂机	
			MeragePlatCall.setPanelDynamicMsg("正在挂断...");
			MeragePlatCall.callBackJson.callStatusType="DISCONNECTED";
		}else if(msgArr[0]=='RINGING'){
			if(msgArr[1]=="1"){
				MeragePlatCall.callBackJson.callStatusType="RINGING1";
				MeragePlatCall.setPanelDynamicMsg('主叫振铃中...');
			}
			if(msgArr[1]=="2"){
				MeragePlatCall.callBackJson.callStatusType="RINGING2";
				MeragePlatCall.setPanelDynamicMsg('被叫振铃中...');
			}
		}else if(msgArr[0]=='FAILED'){
			MeragePlatCall.setPanelDynamicMsg("正在挂断...");
			MeragePlatCall.callBackJson.callStatusType="FAILED";
			CTAsk.callAnsweredIndex=false;
		}
		MeragePlatCall.callBackJson.callStatusName=MeragePlatCall.getPanelDynamicMsg();
		//提供外部接口获取电话状态
		if(window["getCallStatus"] != null){
			window["getCallStatus"].call(null,$.extend(MeragePlatCall.callBackJson,{callTime:MeragePlatCall.getCallCostTime()}));
		}
		if(MeragePlatCall.callBackJson.callStatusType=="FAILED" || MeragePlatCall.callBackJson.callStatusType=="DISCONNECTED"){
			CTAsk.callDie=true;//当前电话已经被挂掉
			clearTimeout(CTAsk.timeoutcomp);//清除定时器
			var time = MeragePlatCall.getCallCostTime() ;
			var callStatus = time==0?"|未接通":"";
			var callRest   = time==0?"C_125":"C_128";
			MeragePlatCall.setCostTimeBar("stop");
			MeragePlatCall.callSessionId = '' ;//情空sessionId
			MeragePlatCall.setCtrlStatus("forbid",true,MeragePlatCall.hookIndex,MeragePlatCall.phoneType);
			var hookMsg = MeragePlatCall.callBackJson.callStatusType=="FAILED"?"挂机或者无应答或者拒绝...":"客户挂机...";
			if(MeragePlatCall.callRecordId!=null && MeragePlatCall.callRecordId!=''){
				MeragePlatCall.callRecordUpdate(time, callRest, hookMsg+callStatus);
			}
		}
	},
	
	//下线
	outLine:function(callPersonId){
		if(MeragePlatCall.callSessionId!=null && MeragePlatCall.callSessionId!=''){
			art.dialog.tips('通话还没结束不能下线....');
			return false;
		}
		var outLine=getPath()+"/cmct/phonenew/outLine";
		$.post(getPath()+"/cmct/phonenew/outLine",{callPersonId:callPersonId},function(data){
				if(data && data.STATE == 'SUCCESS'){
					CTAsk.outLineSuccessAfter();
				}else{
					MeragePlatCall.setPanelDynamicMsg(data.MSG);
				}
			},'json');
	},
	
	//下线成功之后
	outLineSuccessAfter:function(){
		MeragePlatCall.isLogin = false ;
		MeragePlatCall.setPanelDynamicMsg("呼叫线路未连接");
		MeragePlatCall.setCtrlStatus("selectLine");
		$("#"+MeragePlatCall.declare.loginSuccContainer).hide();
	},
	
	//状态类别
	getSpanStatus:function(status){
		var statusName="";
		if(status=='NEW'){
			statusName='发起呼叫 ...';
		}else if(status=='RINGING'){
			statusName='接听话机振铃中...';
		}else if(status=='ANSWERING'){
			statusName='SDP协商中...';
		}else if(status=='ANSWERED'){
			statusName='通话中...';
		}else if(status=='DISCONNECTED'){
			statusName='用户挂机...';
		}else if(status=='FAILED'){
			statusName='挂机、无应答或拒绝';
		}else if(status=='NOCALLSTATUS'){
			statusName='正在呼叫...';
		}
		return statusName;
	},
	
	//获取ajax对象
	createAjaxObjet:function(){
		var request = false;
		if(!CTAsk.ajax){
		        //一般先判断非IE浏览器
		        //window对象中有XMLHttpRequest存在就是非IE，包括（IE7，IE8）
		        if(window.XMLHttpRequest){
		            request=new XMLHttpRequest();//非IE以及IE7，IE8浏览器

		            if(request.overrideMimeType){
		                request.overrideMimeType("text/xml");//重置mime类型
		            }
		        //window对象中有ActiveXObject属性存在就是IE浏览器的低版本
		        }else if(window.ActiveXObject){
		            var versions=['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Msxml2.XMLHTTP.7.0','Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];//各种IE浏览器创建Ajax对象时传递的参数
		            for(var i=0; i<versions.length; i++){
	                    try{
	                        request=new ActiveXObject(versions[i]);//各个IE浏览器版本的参数不同

	                        if(request){
	                            return request;
	                        }
	                    }catch(e){
	                        request=false;
	                    }
	            }
	        }
		      CTAsk.ajax=request;
		}
		return CTAsk.ajax;
	},
	
	//添加日志
	addWashLog:function(rtnDesc){
		var code='HW';
		$.post(getPath()+"/cmct/phonenew/addLog",{
			toName:MeragePlatCall.getCallParam()["toName"],
			toPhone:MeragePlatCall.getCallParam()["toPhone"]||$("#"+MeragePlatCall.declare.toPhone).val(),
			code:code,
			rtnDesc:rtnDesc,
			showPhone:MeragePlatCall.currShowPhone
		},function(data){
			
		},'json');
	},
	
	//假性定时器
	temporaryTiming:function(){
		setTimeout(function() {
			if(!MeragePlatCall.getCallCostTime()>0 && MeragePlatCall.callSessionId){//目前定时器已经不是处于执行中并且sessionId不为空,启动定时器,更新面板时间
//				MeragePlatCall.setCostTimeBar("start");//开始计时
				if(MeragePlatCall.declare.timeBar){
					$('#'+MeragePlatCall.declare.timeBar).html("未知时间");
				}
				MeragePlatCall.timeUnit.s="-1";
			}
		},48000);
	},
	
	//跟进监听码获取信息
	getCallMsgByEventCode:function(evCode){
		var msgHtml = "" ;
		switch(evCode){
			case 'Sessionid is not validate!':
				msgHtml = "Sessionid已经无效..." ;
				break ;
			case 'unknown error' :
				msgHtml = "网络异常..." ;
				break ;
			case 'calleeNbr is not validate!' :
				msgHtml = "被叫号码错误..." ;
				break ;
			case 'postData is empty!' :
				msgHtml = "请求参数为空..." ;
				break ;
			case 'Points is not Enough!' :
				msgHtml = "余额不足..." ;
				break ;
			case 'DisplayNbr is error!' :
				msgHtml = "主叫号码错误..." ;
				break ;
			case 'ChargeNbr or Key is not valid!' :
				msgHtml = "计费号码错误..." ;
				break ;
			default : 
				msgHtml = evCode;
				break ;
		}
		return msgHtml ;
	}
}