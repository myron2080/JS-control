$(document).ready(function(){
	
	loadMessageDetail(1);
});

/**
 * 加载消息详细信息
 */
function loadMessageDetail(page){
	var wechatId = $("#wechatId").val();
	var personId = $("#personId").val();
	
	var page = page == null ? parseInt($("#curr_page").val()) : page ;
	var pageSize = 4 ;
	$.post(getPath()+'/basedata/weChat/detailList',{
		wechatId:wechatId,
		personId:personId,
		page:page,
		pageSize:pageSize
	},function(res){
		$("#curr_page").val(page);
		$("#message_detail").prepend(res);
		var showHistory = $("#showHistory").val();
		if(showHistory == 'Y'){
			$("#message_history").show();
		}else {
			$("#message_history").hide();
			$(".private-letter-listall").css({'height':'319px'});
		}
	});
}

/**
 * 查看历史消息
 */
function loadHistory(){
	var page = parseInt($("#curr_page").val());
	loadMessageDetail(page+1);
}

/**
 * 加载发送
 */
function loadSend(){
	var wechatId = $("#wechatId").val();
	var personId = $("#personId").val();
	
	var page = 1 ;
	var pageSize = 1 ;
	$.post(getPath()+'/basedata/weChat/detailList',{
		wechatId:wechatId,
		personId:personId,
		page:page,
		pageSize:pageSize
	},function(res){
		$("#message_detail").append(res);
	});
}

/**
 * 发送消息
 */
function sendMessage(){
	var content = $("#send_content").val();
	var wechatId = $("#wechatId").val();
	if(content == null || content.trim() == ''){
		art.dialog.tips('请输入发送内容');
		return ;
	}
	$.post(getPath()+'/basedata/weChat/sendMessage',{wechatId:wechatId,content:content},function(res){
		if(res.FLAG == 'SUCC'){
			$("#send_content").val("");
			loadSend();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
	
}