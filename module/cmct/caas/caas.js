/**
 * 华为caas平台
 */
var CaaS={
		
		/**
		 * 拨打电话
		 */
		dialPhone:function(dataJson){
			var index=dataJson.index;
			var dialPhoneUrl=getPath()+"/cmct/phoneCaas/dialPhone";
			$.post(dialPhoneUrl,dataJson,function(res){
				if(window["caasDialAfterFun"]){						
					window["caasDialAfterFun"].call(null,res);
				}
			},'json');
		}
}