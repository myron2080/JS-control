/**
 * 内网平台--呼叫中心登录
 */
var CallLogin = {
		callPerson:null,
		//获取当前用户信息，校验呼叫权限
		login:function(){
			$.post(getPath()+'/interflow/callNew/getUserInfo',{},function(res){
				if(res && res.STATE == 'SUCCESS'){
					if(res.callSet){
						//登录话伴接口
						CallLogin.loginCall(res.callSet);
					}
				}else if(res && res.STATE == 'FAIL'){
					if(res.NOLOGIN){//未登录系统
					
					}else if(res.isCall == 'NO'){
						//未拥有呼叫权限
					}
				}else{
					
				}
			},'json');
		},
		//登录话伴接口
		loginCall:function(cp){
			var userId = cp.userId;
   			var password = cp.password;
   			var orgId = cp.orgInterfaceId;
   			//登录话伴
   			var rtn = huaban.Login(userId,password,orgId);	
   			if(rtn == 0){//操作提交成功
   				
   			}else{
   				
   			}
		},
		// 监听登录事件
		listenLoginEvent : function(evCode, evDescrible) {
			var callRtnObj = eval("("+evDescrible+")");
			if (callRtnObj.cmd == 'Login') {//登录
				//如果登录之后连接成功，检验号码正确，自动拨打
				if(evCode == 200){
					
				}
			}
		},
		//添加登录动态事件监听
		addLoginListener:function(){
			if (window.addEventListener){
				document.getElementById("huaban").addEventListener("huabanevent", CallLogin.listenLoginEvent, false); 
			}else{
				document.getElementById("huaban").attachEvent("on"+"huabanevent", CallLogin.listenLoginEvent);
			} 
		}
};
$(document).ready(function(){
	CallLogin.addLoginListener();
	CallLogin.login();
});