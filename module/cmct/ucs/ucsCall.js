var UcsCall={
		enckey:"Zxu_Vice/0UCS230w!UcS",//默认字符
		
		//是否已经登录
		isLogin:false,
		//当前系统登录的人员.根据绑定人员和当前使用人员来初始化页面,得到特殊字符,
		init:function(){
			$.post(getPath()+'/cmct/ucsPhonenew/getUserInfo',{},function(res){
				if(res && res.STATE == 'SUCCESS'){
					var callSet = res.callSet ;
					var id=callSet.id;
					var pn=callSet.telNo;
					$('#div_loginSuccess').show();
					$('#font_currShowPhone').text(pn);
					$('#phoneStatus').val("DIANXIAN");
					$('#dianxinPhoneId').val(id);
					UcsCall.isLogin = true ;
					//修改号码状态为使用
					UcsCall.onLine(id,pn);
					UcsCall.setCtrlStatus("call");
				}else if(res && res.STATE == 'FAIL'){
					//未找到空闲线路，自己选择
					UcsCall.setCtrlStatus("selectLine",false);
					UcsCall.setPanelDynamicMsg("未选择话务线路");
				}else{
					//未登录系统
					UcsCall.setCtrlStatus("forbid",false);
				}
			},'json');
			
			$.post(base+"/cmct/ucsPhoneconfig/getphoneUrl",{},function(data){
				if(data.STATE=='SUCCESS'){
					UcsCall.enckey=data.config.ucsSpecialChar;
				}
			},'json')
		},
		call:function(index,realPhone){
			var toPhone = realPhone || $("#span_customerPhone_"+index).text() ;
			toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
			if(toPhone == null || toPhone ==''){
				art.dialog.tips("请输入用户手机号码");
				return false ;
			}else if(!(UcsCall.checkMobile(toPhone) || UcsCall.checkPhone(toPhone))){
				art.dialog.tips("用户手机号码格式不正确");
				return false ;
			}else{
				$('#realPhone').val(toPhone);
				var url=base+"/cmct/ucsPhoneconfig/ucsCallUrl";
				url+="?userid="+$('#font_currShowPhone').text();
				url+="&called="+toPhone;
				url+="&enckey="+hex_md5((UcsCall.enckey+$('#font_currShowPhone').text()+toPhone).trim());
				//呼叫处理中...禁止操作
				UcsCall.setCtrlStatus("forbid",false);
				$.post(url,{},function(res){
					res=eval("("+res+")");
					if(res.STATE=='SUCCESS'){
						setTimeout(function(){
							$("span[id^='span_bar_']").hide();
							$("span[id^='span_bar_hook']").show();
						},3000);
						UcsCall.setPanelDynamicMsg(UcsCall.getCallMsgByEventCode(0));
					}else if(res.STATE=='EXCEPTION'){
						UcsCall.setCtrlStatus("forbid");
						UcsCall.setPanelDynamicMsg('网络异常');
					}else if(res.STATE==null){
						UcsCall.setCtrlStatus("forbid");
						UcsCall.setPanelDynamicMsg('号码已被停用');
					}else if(res.STATE=='FAIL' && res.MSG=='-4'){
						UcsCall.setPanelDynamicMsg(UcsCall.getCallMsgByEventCode(res.MSG));
						setTimeout(function(){
							$("span[id^='span_bar_']").hide();
							$("span[id^='span_bar_hook']").show();
						},4000);
					}else{
						UcsCall.setCtrlStatus("forbid");
						UcsCall.setPanelDynamicMsg(UcsCall.getCallMsgByEventCode(res.MSG));
					}
				})
			}
		},
		onLine:function(phoneId,pn){
			if(phoneId){
				var url=getPath()+"/cmct/ucsPhoneMember/onLineByLocal?phoneId="+phoneId;
				$.post(url,{},function(data){
						if(data && data.STATE == 'SUCCESS'){
							UcsCall.isLogin = true ;
							UcsCall.setPanelDynamicMsg("连接成功");
						}
					},'json');
			}
		},
		outLine:function(phoneId){
			if(phoneId){
				var url=getPath()+"/cmct/ucsPhoneMember/outLineByLocal?phoneId="+phoneId;
				$.post(url,{},function(data){
						if(data && data.STATE == 'SUCCESS'){
							UcsCall.isLogin = false ;
							$('#font_currShowPhone').text('');
							$('#phoneStatus').val("");
							$('#dianxinPhoneId').val("");
						}
					},'json');
			}
		},
		
		//挂断电话
		hook:function(){
			var phone=$('#font_currShowPhone').text()
			var enckey=hex_md5(UcsCall.enckey+phone);
			
			//挂断处理,禁止操作
			UcsCall.setCtrlStatus("forbid",false);
			$.post(getPath()+"/cmct/ucsPhoneconfig/hookUrl?phone="+phone+"&enckey="+enckey,{},function(data){
				if(data&& data.STATE == 'SUCCESS'){
					$("span[id^='span_bar_']").hide();
					$("span[id^='span_bar_call']").show();
					UcsCall.setPanelDynamicMsg("连接成功");
				}else if(data.STATE=='EXCEPTION'){
					UcsCall.setPanelDynamicMsg("网络异常");
					UcsCall.setCtrlStatus("forbid");
				}else{
					UcsCall.setCtrlStatus("forbid");
					UcsCall.setPanelDynamicMsg(UcsCall.getCallMsgByEventCode(data.MSG));
				}
			},'json')
		},
		//判断的号码是否为电信号码
		setPanelDynamic:function(status){
			if(status=="DIANXIAN"){
				$('#div_loginSuccess').show();
				$("span[id^='span_bar_']").hide();
				$("p[id^='p_bar_']").hide();
				$("p[id^='p_bar_call']").show();
				$("span[id^='span_bar_call']").show();
			}
		},
		//跟进监听码获取信息
		getCallMsgByEventCode:function(evCode){
			var msgHtml = "" ;
			switch(evCode){
				case 0:
					msgHtml = "正在拨号..." ;
					break ;
				case "-1":
					msgHtml = "余额不足.." ;
					break ;
				case "-2":
					msgHtml = "参数不对" ;
					break ;
				case "-3":
					msgHtml = "被叫格式不对" ;
					break ;
				case "-4":
					msgHtml = "余额低于5元,正在接通" ;
					break ;
				default : 
					msgHtml = "通话中..." ;
					break ;
			}
			return msgHtml ;
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
			var var1 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])\d{7,8}$/ ;
			var var2 = /^(0[3-9][0-9][0-9]|0[1|2][0|1|2|3|5|7|8|9]|[3-9][0-9][0-9])\d{3}$/ ;
			return var1.test(phoneNo) || var2.test(phoneNo);
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
				UcsCall.setPanelDynamicMsg("连接成功");
			}else if(showType == 'error'){
				$("span[id^='span_bar_error']").show();
			}else if(showType == 'forbid'){
				if(isReCall){//禁用，允许自动恢复到呼叫，延迟3秒
					if(index == null){
						setTimeout(function(){UcsCall.setCtrlStatus('call')},3000);
					}else{
						setTimeout(function(){UcsCall.setCtrlStatus('call',false,index)},3000);
					}
				}
			}
		},
		//设置呼叫面板的动态信息
		setPanelDynamicMsg:function(msg){
			$("font[id^='font_callText']").html(msg);
		},
		
		
		
		//话务中心设置呼叫面板的动态信息
		setCallCenterPanelDynamicMsg:function(msg){
			$("span[id^='span_callStatus']").html(msg);
		},
		
		//话务中心版,初始化坐席号码
		login:function(){
			
			$.post(getPath()+'/cmct/ucsPhonenew/getUserInfo',{},function(res){
	
				if(res && res.STATE == 'SUCCESS'){
					var callSet = res.callSet ;
					var id=callSet.id;
					var pn=callSet.telNo;
					$("#p_seatPhoneList").show();
					$("#line_select").show();
					$("#line_unselect").hide();
					/*$("#p_costTimeBar").hide();*/
					$("#font_huatong").hide();
					$("#font_showPhone").text(pn);
					$("#mySeatPhoneList").hide();
					$('#phoneStatus').val("DIANXIAN");
					$('#dianxinPhoneId').val(id);
					UcsCall.isLogin = true ;
					//修改号码状态为使用
					UcsCall.onLine(id,pn);
					UcsCall.setCallCenterCtrlStatus("call");
				}else if(res && res.STATE == 'FAIL'){
					//未找到空闲线路，自己选择
					UcsCall.setCallCenterPanelDynamicMsg("未选择话务线路");
				}else{
					//未登录系统
					UcsCall.setCallCenterCtrlStatus("forbid",false);
				}
			},'json');
		},
		//设置控件按钮状态
		setCallCenterCtrlStatus:function(showType,isReCall){
			$("p[id^='p_bar_']").hide();
			$("#p_bar_"+showType).show();
			if(showType == 'call'){
				UcsCall.setCallCenterPanelDynamicMsg("连接成功");
			}else if(showType == 'forbid'){
				if(isReCall){//禁用，允许自动恢复到呼叫，延迟3秒
					setTimeout(function(){UcsCall.setCallCenterCtrlStatus('call')},3000);
				}
			}
		},
		outCallCenterLine:function(){
			var dianxinPhoneId=$('#dianxinPhoneId').val();
			var url=getPath()+"/cmct/ucsPhoneMember/outLineByLocal?phoneId="+dianxinPhoneId;
   			if(dianxinPhoneId){
   				$.post(url,function(data){
   					if(data && data.STATE == 'SUCCESS'){
   						UcsCall.setCallCenterPanelDynamicMsg("未选择话务线路");
   						$("#line_unselect").show();
   						$("#p_seatPhoneList").hide();
   						$("#line_select").hide();
   					}
   				},'json');
   			}
		},
		callCenter:function(){
			var toPhone = $("#toPhone").val();
			//去除空格
			toPhone = toPhone.replace(/(^\s+)|(\s+$)/g,"");
			if(toPhone == null || toPhone ==''){
				art.dialog.tips("请输入用户手机号码");
				return false ;
			}else if(!(UcsCall.checkMobile(toPhone) || UcsCall.checkPhone(toPhone))){
				art.dialog.tips("用户手机号码格式不正确");
				return false ;
			}
			$('#realPhone').val(toPhone);
			var url=base+"/cmct/ucsPhoneconfig/ucsCallUrl";
			url+="?userid="+$('#font_showPhone').text();
			url+="&called="+toPhone;
			url+="&enckey="+hex_md5((UcsCall.enckey+$('#font_showPhone').text()+toPhone).trim());
			//呼叫处理中...禁止操作
			UcsCall.setCtrlStatus("forbid",false);
			$.post(url,{},function(res){
				res=eval("("+res+")");
				if(res.STATE=='SUCCESS'){
					setTimeout(function(){
						UcsCall.setCallCenterCtrlStatus("hook");
					},3000);
					UcsCall.setCallCenterPanelDynamicMsg(UcsCall.getCallMsgByEventCode(0));
				}else if(res.STATE=='EXCEPTION'){
					UcsCall.setCallCenterCtrlStatus("forbid");
					UcsCall.setCallCenterPanelDynamicMsg('网络异常');
				}else if(res.STATE==null){
					UcsCall.setCallCenterCtrlStatus("forbid");
					UcsCall.setCallCenterPanelDynamicMsg('号码已被停用');
				}else if(res.STATE=='FAIL' && res.MSG=='-4'){
					UcsCall.setCallCenterPanelDynamicMsg(UcsCall.getCallMsgByEventCode(res.MSG));
					setTimeout(function(){
						UcsCall.setCallCenterCtrlStatus("hook")
					},4000);
				}else{
					UcsCall.setCallCenterCtrlStatus("forbid");
					UcsCall.setCallCenterPanelDynamicMsg(UcsCall.getCallMsgByEventCode(res.MSG));
				}
			})
		},
		hookCenter:function(){
			var phone=$('#font_showPhone').text()
			var enckey=hex_md5(UcsCall.enckey+phone);
			
			//挂断处理,禁止操作
			UcsCall.setCallCenterCtrlStatus("forbid",false);
			$.post(getPath()+"/cmct/ucsPhoneconfig/hookUrl?phone="+phone+"&enckey="+enckey,{},function(data){
				if(data&& data.STATE == 'SUCCESS'){
					UcsCall.setCallCenterCtrlStatus("call");
					UcsCall.setCallCenterPanelDynamicMsg("连接成功");
				}else if(data.STATE=='EXCEPTION'){
					UcsCall.setCallCenterPanelDynamicMsg("网络异常");
					UcsCall.setCallCenterCtrlStatus("forbid");
				}else{
					UcsCall.setCallCenterCtrlStatus("forbid");
					UcsCall.setCallCenterPanelDynamicMsg(UcsCall.getCallMsgByEventCode(data.MSG));
				}
			},'json')
		}
}