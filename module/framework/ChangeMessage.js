function initMessageCount(){
	//系统消息
	$.post(ctx+"/interflow/message/sysMessage/getMsgTotal",function(data){
		if(isEnableHR){
			$.post(ctx+"/hr/processApply/getProcessCount",function(res){
				$(top.window.document).find("#letterCount").html((data+res.processCount)== 0? "":data+res.processCount);
			},'json');
		}else{
			$(top.window.document).find("#letterCount").html((data== 0)? "":data);
		}
		
	});
}
