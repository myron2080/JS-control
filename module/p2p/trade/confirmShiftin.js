$(document).ready(function(){
	
});

function save(currentDialog){
	var cardNo = $("#cardNo").val();
	var accountDesc = $("#cardNo").find("option:selected").attr("key");
	$("#accountDesc").val(accountDesc);
	var flag = true;
	if(!isNotNull(cardNo)){
		art.dialog.alert("请选择到账账号!");
		flag = false;
	}
	if(flag){
		$.post(getPath()+"/p2p/shiftinList/save",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog.data("flag",true);
				if(res.MSG){
					art.dialog({
						content: res.MSG,
						time:1,
						close:function(){
							art.dialog.close();
						},
						width:200
					});
					
				}else{
					art.dialog.close();
				}
			}else{
				art.dialog.tips(res.MSG);
			}
	    },'json');
		if(currentDialog){
			currentDialog.button({name:"取消",disabled:true});
			currentDialog.button({name:"保存",disabled:true});
		}
	}
}
