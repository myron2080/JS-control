$(function(){
	queryHostComment();
	queryProsComment(); 
	queryConsComment(); 
	
	initVote();
	bindEvent();
});

function initVote(){
	var prosVotes = parseInt($("#prosVotes").text());
	var consVotes = parseInt($("#consVotes").text());
	if(prosVotes==0 && consVotes == 0){
		return ;
	}
	var prosVotesPer = (prosVotes/(prosVotes+consVotes))*100;
	prosVotesPer = prosVotesPer.toFixed(2);
	var consVotesPer = (consVotes/(prosVotes+consVotes))*100;
	consVotesPer = consVotesPer.toFixed(2);
	$("#prosVotesPer").text(prosVotesPer);
	$("#consVotesPer").text(consVotesPer);
	$("#prosVotesDiv").css("width",prosVotesPer+"%");
	$("#consVotesDiv").css("width",consVotesPer+"%");
}

//事件绑定 
function bindEvent(){
	
	 
	 
}


var hostParam = {};
hostParam.orderByClause = " D.FCREATORTIME DESC ";

function queryHostComment(page){
 
	hostParam.pageSize = 25 ;
	hostParam.currentPage = page||1 ;
	var debateId = $("#debateId").val();
	if(debateId){
		hostParam.debateId = debateId ;
	}else{
		return ;
	}
	hostParam.debateType = "HOST" ;
	var currentUserId = $("#currentUserId").val();
	
	$.post(ctx+"/interflow/debate/listDebateComment",hostParam,function(res){
		var data = res.items;
		$("#hostCommDiv").html('');
		for(var i = 0;i<data.length;i++){
			  
			 var photo = data[i].photo==null || data[i].photo==''?"default/style/images/home/man_head.gif":"images/"+data[i].photo;
			 
			 var dataHtml = '<p style="line-height:22px;"><b class="colororange">'+data[i].content+
			 '</b> <b class="color999">('+data[i].creatorTime+')</b>';
			 if(currentUserId==data[i].creatorId) {
			   dataHtml+=' <a class="colorblue" href="javaScript:void(0);" onclick="deleteData(\''+data[i].id+'\')"> 删除</a></p>';
			 }
			$(dataHtml).appendTo("#hostCommDiv");
		}
		 
	},'json');
}

function deleteData(id){
	var deleteUrl = getPath()+"/interflow/debate/deleteDebateComment";
 
	art.dialog.confirm('确定删除该行数据?',function(){
		$.post(deleteUrl,{id:id},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				if(typeof(afterDeleteRow)=='function'){
					afterDeleteRow();
				}
				queryHostComment();
			}
		},'json');
		return true;
	},function(){
		return true;
	});
}
 

var param = {};
param.orderByClause = " D.FCREATORTIME DESC ";

function queryProsComment(page){
 
	param.pageSize = 5 ;
	param.currentPage = page||1 ;
	var debateId = $("#debateId").val();
	if(debateId){
		param.debateId = debateId ;
	}else{
		return ;
	}
	param.debateType = "PROS" ;
	param.userId = currentId;
	$.post(ctx+"/interflow/debate/listDebateComment",param,function(res){
		var data = res.items;
		$("#prosCommDiv").html('');
		for(var i = 0;i<data.length;i++){
			  
			 var photo = data[i].photo==null || data[i].photo==''?"default/style/images/home/man_head.gif":"images/"+data[i].photo;
			 
			 var dataHtml = '<li>'+
                 '<div class="debate-avatar"><img src="'+base+'/'+photo+'"/></div>'+
                 '<div class="debate-msg">'+
                      '<div class="debate-reply">'+
                           '<p><b class="colorblue">'+data[i].creatorName+'：</b>'+convertImg(data[i].content)+'</p>'+
                           '<p><b class="fl color999">'+data[i].creatorTime+'</b> <b class="fr colorblue" id="html'+data[i].id+'"><a  style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="'+(data[i].creatorId==currentId?'':(data[i].commentUserCount>0?'cancelClickPraise(\''+data[i].id+'\')':'addClickPraise(\''+data[i].id+'\')'))+'">'+(data[i].commentUserCount>0?'取消赞':'赞')+'</a>：'+data[i].praiseCount+'</b></p>'+
                      '</div>'+
                 '</div>'+
             '</li>';
			$(dataHtml).appendTo("#prosCommDiv");
		}
		$("#pageProslist").html('');
		if(data.length<1){
			$("#prosCommDiv").html("<div align='center' style='width:380px;margin-top:50px;'>暂时无人参与</div>");
		}
		var total = Math.floor(res.count%res.pageSize==0?res.count/res.pageSize:res.count/res.pageSize+1);
		$("#pageProslist").html(initpagelist(page,total,'PROS'));
		$("#prosVotes").text(res.count);
		initVote();
		 
	},'json');
}


var consParam = {};
consParam.orderByClause = " D.FCREATORTIME DESC ";

function queryConsComment(page){
 
	consParam.pageSize = 5 ;
	consParam.currentPage = page||1 ;
	var debateId = $("#debateId").val();
	if(debateId){
		consParam.debateId = debateId ;
	}else{
		return ;
	}
	consParam.debateType = "CONS" ;
	consParam.userId = currentId;
	$.post(ctx+"/interflow/debate/listDebateComment",consParam,function(res){
		var data = res.items;
		$("#consCommDiv").html('');
		for(var i = 0;i<data.length;i++){
			  
			 var photo = data[i].photo==null || data[i].photo==''?"default/style/images/home/man_head.gif":"images/"+data[i].photo;
			 
			 var dataHtml = '<li>'+
                 '<div class="debate-avatar"><img src="'+base+'/'+photo+'"/></div>'+
                 '<div class="debate-msg">'+
                      '<div class="debate-reply">'+
                           '<p><b class="colorblue">'+data[i].creatorName+'：</b>'+convertImg(data[i].content)+'</p>'+
                           '<p><b class="fl color999">'+data[i].creatorTime+'</b> <b class="fr colorblue" id="html'+data[i].id+'"><a  style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="'+(data[i].creatorId==currentId?'':(data[i].commentUserCount>0?'cancelClickPraise(\''+data[i].id+'\')':'addClickPraise(\''+data[i].id+'\')'))+'">'+(data[i].commentUserCount>0?'取消赞':'赞')+'</a>：'+data[i].praiseCount+'</b></p>'+
                      '</div>'+
                 '</div>'+
             '</li>';
			$(dataHtml).appendTo("#consCommDiv");
		}
		$("#pageConslist").html('');
		if(data.length<1){
			$("#consCommDiv").html("<div align='center' style='width:380px;margin-top:50px;'>暂时无人参与</div>");
		}
		var total = Math.floor(res.count%res.pageSize==0?res.count/res.pageSize:res.count/res.pageSize+1);
		$("#pageConslist").html(initpagelist(page,total,'CONS'));
		$("#consVotes").text(res.count);
		initVote();
		 
	},'json');
}

function pagesearch(num,dataType){
	if(dataType=="PROS"){
		queryProsComment(num);
	}else if(dataType=="CONS"){
		queryConsComment(num);
	}
	 
}

function addClickPraise(id){
	$.post(base+"/interflow/vote/saveClickPraise",{objId:id,praiseType:"debate"},function(res){
		if(res.MSG=="SUCCESS"){
			$("#html"+id).html('<a  style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="cancelClickPraise(\''+id+'\')">取消赞</a>：'+res.praiseCount);
		}else{
			art.dialog.tips("操作失败");
		}
	},'json');
}

function cancelClickPraise(id){
	$.post(base+"/interflow/vote/delClickPraise",{objId:id,praiseType:"debate"},function(res){
		if(res.MSG=="SUCCESS"){
			$("#html"+id).html('<a  style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="addClickPraise(\''+id+'\')">赞</a>：'+res.praiseCount);
		}else{
			art.dialog.tips("操作失败");
		}
	},'json');
}

function saveDebateComment(){
	var hostComment = $("#hostComment").val(); 
	if(!hostComment){
		art.dialog.tips("请输入观点内容！！");
		return ;
	}
	if(hostComment.length>200){
		art.dialog.tips("观点内容不能超过200字符！！");
		return ;
	}
	var debateId = $("#debateId").val();  
	$.post(getPath()+"/interflow/debate/saveDebateComment",{debateId:debateId,content:hostComment,debateObjType:'HOST'},function(data){
		if(data.STATE == "SUCCESS"){
			art.dialog.tips("保存成功");
			$("#hostComment").val("");
			queryHostComment();
		} else {
			art.dialog.tips(data.MSG);
		}
	},'json');
	 
}

function comfirmResult(){
	var debateResutl = $("input[name='resutl']:checked").val();
	 
	if(!debateResutl){
		art.dialog.tips("请选择辩论结果！！");
		return ;
	}
	var debateId = $("#debateId").val(); 
	$.post(getPath()+"/interflow/debate/comfirmResult",{id:debateId,debateResutl:debateResutl},function(data){
		if(data.STATE == "SUCCESS"){
			art.dialog.tips("确定辩论结果");
			var resultHtml = "";
			if(debateResutl=="PROS"){
				resultHtml = "<b class='boldfont colorred'>正方赢</b>";
				$("#prosResult").addClass("debate-thr-ico02");
				$("#consResult").addClass("debate-thr-ico01");
			}else if(debateResutl=="CONS"){
				resultHtml = "<b class='boldfont colorred'>反方赢</b>";
				$("#prosResult").addClass("debate-thr-ico01");
				$("#consResult").addClass("debate-thr-ico02");
			}
			 $("#debateResult").html(resultHtml);
		} else {
			art.dialog.tips(data.MSG);
		}
	},'json');
}

function cancelResult(){
	$("input[name='resutl']").attr("checked",false);
}
