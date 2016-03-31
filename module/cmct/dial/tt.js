var TTAsk= {
	//操作命令
	cmd:'',
	//操作返回结果
	rtn:'',
	//登录
	onLogin:function(userId,password,orgId){
		TTAsk.cmd = 'Login' ;
		TTAsk.rtn = this.TTInstance().Login(userId,password,orgId);	
	},
	//登出
	onLogout:function(){
		TTAsk.cmd = 'Logout' ;
		TTAsk.rtn = this.TTInstance().Logout(); 
	},
	//呼叫
	onCall:function(phone,billId,showPhone){
		if(showPhone == null){
			showPhone = "" ;
		}
		TTAsk.cmd = 'DialPhone';
		TTAsk.rtn = this.TTInstance().DialPhone(phone,showPhone,billId);
	},
	//挂断
	onHook:function(sessionId){
		TTAsk.cmd = 'Hook';
		TTAsk.rtn = this.TTInstance().Hook(sessionId); 
	},
	//获取连接状态
	onGetState:function(){
		TTAsk.cmd = 'GetState';
		TTAsk.rtn = this.TTInstance().GetState();
	},
	//添加接听话机
	onAddSeatPhone:function(phone){
		TTAsk.cmd = 'AddSeatPhone';
		TTAsk.rtn = this.TTInstance().AddSeatPhone(phone)
	},
	//获取所有接听话机
	onGetAllSeatPhones:function(){
		TTAsk.cmd = 'GetAllSeatPhones';
		TTAsk.rtn = this.TTInstance().GetAllSeatPhones();
	},
	//切换接听话机
	onSwitchSeatPhone:function(phone){
		TTAsk.cmd = 'SwitchSeatPhone';
		TTAsk.rtn = this.TTInstance().SwitchSeatPhone(phone);
	},
	//获取所有去电号码
	onGetAllDispPhones:function(){
		TTAsk.cmd = 'GetAllDispPhones';
		TTAsk.rtn = this.TTInstance().GetAllDispPhones();
	},
	//切换去电号码
	onSwitchDispPhone:function(phone){
		TTAsk.cmd = 'SwitchDispPhone';
		TTAsk.rtn = this.TTInstance().SwitchDispPhone(phone);
	},
	//获取电话线路连接状况
	onGetCallLineState:function(sessionId){
		TTAsk.cmd = 'GetCallLineState';
		TTAsk.rtn = this.TTInstance().GetCallLineState(sessionId);
	},
	//unicode 转成UTF-8
	unicodeToUTF8:function(strInUni) {
		if (null == strInUni){
			return null;
		}
		var strUni = String(strInUni);
		var strUTF8 = String();
		for (var i = 0; i < strUni.length; i++) {
			var wchr = strUni.charCodeAt(i);
			if (wchr < 0x80) {
				strUTF8 += strUni.charAt(i);
			} else if (wchr < 0x800) {
				var chr1 = wchr & 0xff;
				var chr2 = (wchr >> 8) & 0xff;
				strUTF8 += String.fromCharCode(0xC0 | (chr2 << 2)
						| ((chr1 >> 6) & 0x3));
				strUTF8 += String.fromCharCode(0x80 | (chr1 & 0x3F));
			} else {
				var chr1 = wchr & 0xff;
				var chr2 = (wchr >> 8) & 0xff;
				strUTF8 += String.fromCharCode(0xE0 | (chr2 >> 4));
				strUTF8 += String.fromCharCode(0x80 | ((chr2 << 2) & 0x3C)
						| ((chr1 >> 6) & 0x3));
				strUTF8 += String.fromCharCode(0x80 | (chr1 & 0x3F));
			}
		}
		return strUTF8;
	},
	//生成话单id
	getCallBillId:function(orgId){
		if(orgId == null){
			return "" ;
		}
		var billId = "" ;
		//组织不为8位补0
		var orgPrev = "" ;
		for(var i = 0 ; i < (8 - orgId.length ) ; i ++){
			orgPrev += "0" ;
		}
		billId += (orgPrev + orgId);

		//固定，为渠道商
		billId += "_1_" ;
		var nowDateStr = formatDate(new Date(),"yyyy-MM-dd HH:mm:ss");
		var reg = /[^0-9]/g;
		var dateStr = nowDateStr.replace(reg,"");
		billId += dateStr ;
		billId += this.genRandomStr(7);
		return billId ;
	},
	//生成指定长度随机字符串
	genRandomStr:function(n){
		var rnd = "";
		for(var i= 0 ;i < n;i++){
			rnd += Math.floor(Math.random()*10);
		}
		return rnd;
	},
	TTInstance:function(){
		if(typeof(huaban) == "undefined"){
			return top.huaban;
		}
		return huaban ;
	}
}
