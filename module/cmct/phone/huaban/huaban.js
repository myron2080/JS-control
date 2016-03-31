var HuaBanCall = {
	//操作命令
	cmd:'',
	//操作返回结果
	rtn:'',
	//登录
	onLogin:function(userId,password,orgId){
		HuaBanCall.cmd = 'Login' ;
		HuaBanCall.rtn = this.TTInstance().Login(userId,password,orgId);	
	},
	//登出
	onLogout:function(){
		HuaBanCall.cmd = 'Logout' ;
		HuaBanCall.rtn = this.TTInstance().Logout(); 
	},
	//呼叫
	onCall:function(phone,billId,showPhone){
		if(showPhone == null){
			showPhone = "" ;
		}
		HuaBanCall.cmd = 'DialPhone';
		HuaBanCall.rtn = this.TTInstance().DialPhone(phone,showPhone,billId);
	},
	//挂断
	onHook:function(sessionId){
		HuaBanCall.cmd = 'Hook';
		HuaBanCall.rtn = this.TTInstance().Hook(sessionId); 
	},
	//获取连接状态
	onGetState:function(){
		HuaBanCall.cmd = 'GetState';
		HuaBanCall.rtn = this.TTInstance().GetState();
	},
	//添加接听话机
	onAddSeatPhone:function(phone){
		HuaBanCall.cmd = 'AddSeatPhone';
		HuaBanCall.rtn = this.TTInstance().AddSeatPhone(phone)
	},
	//获取所有接听话机
	onGetAllSeatPhones:function(){
		HuaBanCall.cmd = 'GetAllSeatPhones';
		HuaBanCall.rtn = this.TTInstance().GetAllSeatPhones();
	},
	//切换接听话机
	onSwitchSeatPhone:function(phone){
		HuaBanCall.cmd = 'SwitchSeatPhone';
		HuaBanCall.rtn = this.TTInstance().SwitchSeatPhone(phone);
	},
	//获取所有去电号码
	onGetAllDispPhones:function(){
		HuaBanCall.cmd = 'GetAllDispPhones';
		HuaBanCall.rtn = this.TTInstance().GetAllDispPhones();
	},
	//切换去电号码
	onSwitchDispPhone:function(phone){
		HuaBanCall.cmd = 'SwitchDispPhone';
		HuaBanCall.rtn = this.TTInstance().SwitchDispPhone(phone);
	},
	//获取电话线路连接状况
	onGetCallLineState:function(sessionId){
		HuaBanCall.cmd = 'GetCallLineState';
		HuaBanCall.rtn = this.TTInstance().GetCallLineState(sessionId);
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
