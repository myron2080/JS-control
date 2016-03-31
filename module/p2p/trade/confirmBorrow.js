$(document).ready(function(){
	
});

function save(currentDialog){
	var cardNo = $("#cardNo").val();
	var flag = true;
	if(!isNotNull(cardNo)){
		art.dialog.alert("请选择付款账号账号!");
		flag = false;
	}
	if($("#userCard").val()==''){
		art.dialog.alert("请选择借款人账号!");
		return false;
	}
	if(flag){
		$.post(getPath()+"/p2p/borrowList/save",$('form').serialize(),function(res){
			if(res.STATE == "SUCCESS"){
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
