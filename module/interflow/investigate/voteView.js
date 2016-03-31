$(function(){
	queryVoteComment();
	 
	initVote();
	bindEvent();
});

function initVote(){
	var totalPersonCount = parseInt($("#totalPersonCount").val());
	if(totalPersonCount==0){
		return ;
	}
	$("div[id^='voteOption']").each(function(){
		var personCountPer = (parseInt($(this).attr("personCount"))/totalPersonCount)*100;
		personCountPer = personCountPer.toFixed(2);
		$("b[name='personCountPer']").css("width",personCountPer+"%");
		$("span[name='personCountPerDis']").text(personCountPer);
	});
	 
}

//事件绑定 
function bindEvent(){
	
	$("#showFace").bind("click",function(){
		show('content');
	});
	 
}

 

function deleteData(id){
	var deleteUrl = getPath()+"/interflow/vote/deleteVoteComment";
 
	art.dialog.confirm('确定删除该行数据?',function(){
		$.post(deleteUrl,{id:id},function(res){
			art.dialog.tips(res.MSG);
			if(res.STATE=='SUCCESS'){
				if(typeof(afterDeleteRow)=='function'){
					afterDeleteRow();
				}
				queryVoteComment();
			}
		},'json');
		return true;
	},function(){
		return true;
	});
}
 

var param = {};
param.orderByClause = " D.FCREATORTIME DESC ";

function queryVoteComment(page){
 
	param.pageSize = 5 ;
	param.currentPage = page||1 ;
	var voteId = $("#voteId").val();
	if(voteId){
		param.voteId = voteId ;
	}else{
		return ;
	}
	param.userId = currentId;
	$.post(ctx+"/interflow/vote/listVoteComment",param,function(res){
		var data = res.items;
		$("#voteCommDiv").html('');
		for(var i = 0;i<data.length;i++){
			  
			 var photo = data[i].photo==null || data[i].photo==''?"default/style/images/home/man_head.gif":"images/"+data[i].photo;
			 
			 var dataHtml = '<li>'+
                 '<div class="debate-avatar"><img src="'+base+'/'+photo+'"/></div>'+
                 '<div class="debate-msg">'+
                      '<div class="debate-reply">'+
	                      '<div class="debate-replyin">'+
	                       '<div class="vote-listin05">'+
	                           '<div class="vote-listin05a">'+
                           '<b class="colorblue">'+data[i].creatorName+'：</b>'+ convertImg(data[i].content)+
                           	   '</div>'+
                           	'</div>'+
                            (currentId==creatorId?'<div class="vote-listin06"><a class="vote-delete" href="javascript:void(0)"  onclick="deleteData(\''+data[i].id+'\')"></a></div>':'')+
                        '</div>'+
                        '<div class="debate-replyin"><b class="fl color999">'+data[i].creatorTime+'</b> <b class="fr colorblue" id="html'+data[i].id+'"><a style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="'+(data[i].creatorId==currentId?'':(data[i].commentUserCount>0?'cancelClickPraise(\''+data[i].id+'\')':'addClickPraise(\''+data[i].id+'\')'))+'">'+(data[i].commentUserCount>0?'取消赞':'赞')+'</a>：'+data[i].praiseCount+'</b></div>'+
                      '</div>'+
                 '</div>'+
             '</li>';
			$(dataHtml).appendTo("#voteCommDiv");
		}
		$("#pagelist").html('');
		if(data.length<1){
			$("#voteCommDiv").html("<div align='center' style='width:380px;margin-top:50px;'>暂时无人评论</div>");
		}
		var total = Math.floor(res.count%res.pageSize==0?res.count/res.pageSize:res.count/res.pageSize+1);
		$("#commentCount").text(res.recordCount); 
		$("#pagelist").html(initpagelist(page,total));
		EnlargerImg.init({type:"enlararr"});	//放大图片 
	},'json');
}
 
function pagesearch(num,dataType){
	 
	queryVoteComment(num);
}


function saveVoteComment(){
	var content = $("#content").val(); 
	if(!content){
		art.dialog.tips("请输入评论内容！！");
		return ;
	}
	if(content.length>200){
		art.dialog.tips("评论内容不能超过200字符！！");
		return ;
	}
	var voteId = $("#voteId").val();  
	$.post(getPath()+"/interflow/vote/saveVoteComment",{voteId:voteId,content:content},function(data){
		if(data.STATE == "SUCCESS"){
			art.dialog.tips("保存成功");
			$("#content").val("");
			queryVoteComment();
		} else {
			art.dialog.tips(data.MSG);
		}
	},'json');
	 
}
 

function addClickPraise(id){
	$.post(base+"/interflow/vote/saveClickPraise",{objId:id,praiseType:"vote"},function(res){
		if(res.MSG=="SUCCESS"){
			$("#html"+id).html('<a  style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="cancelClickPraise(\''+id+'\')">取消赞</a>：'+res.praiseCount);
		}else{
			art.dialog.tips("操作失败");
		}
	},'json');
}

function cancelClickPraise(id){
	$.post(base+"/interflow/vote/delClickPraise",{objId:id,praiseType:"vote"},function(res){
		if(res.MSG=="SUCCESS"){
			$("#html"+id).html('<a  style="text-decoration: underline;color:blue;" href="javascript:void(0)" onclick="addClickPraise(\''+id+'\')">赞</a>：'+res.praiseCount);
		}else{
			art.dialog.tips("操作失败");
		}
	},'json');
}
