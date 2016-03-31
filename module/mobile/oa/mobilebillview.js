var pageIndex = 1;     // 页面索引初始值
var pageSize = 30;    

function noticeCommentClick(obj,objId){
	showload();
	var c=$("#"+$(obj).attr("linktext")).val();
	if(c==""){
		commonTipShow("评论内容不能为空！",1000);
		hideload();
		return false;
	}else{
		if(c.length>150){
			commonTipShow("评论内容不能超过150字",1000);
			hideload();
			return false
		}
		$.post(
				getPath()+"/interflow/billComment/addBillComment",
				{
					billId:objId,
					reContent:c
				},
				function(data){
					hideload();
					$("#content").css('height','34px'); 
					commonTipShow("评论成功",1000);
					/*var str = "<div class=\"Commentshow\"><span class=\"txt\">"+data.creator.name+"：</span>"+data.content+"</div>";
					$("#insertDiv"+objId).append(str);
					$("#"+$(obj).attr("linktext")).val('');
					$("div[id*='commentOn']").attr("style","display: none");*/
					$("#"+$(obj).attr("linktext")).val('');
					refreshComment(objId);
				},'json'
			);
	}
}



var mobileBillComment={
		init:function(){
			showload();		
	
			var billId=$("#billId").val();

			if(billId!=''){
				$.post(base+"/interflow/billComment/getAllMobileReply",{billId:billId},function(data){
					hideload();
					$('div.ad-bottom').html('');
					var cmlist = data.comment;
					var dhtml = ' <ul id="comment">';
					for(var i=0;i<cmlist.length;i++){
						dhtml += '<li>';
						dhtml += '  <div class="ad-avatar"><img onerror="this.src=\''+base+'/default/style/images/mobile/man.jpg\'"  src="'+base+'/images/'+cmlist[i].recreatorphoto+'"/></div>';
						dhtml += '  <div class="ad-msg"><div class="ad-reply">';
						dhtml += '            <div class="zd" style="background:none; padding:0px;">';
							dhtml += '                 <div class="zdin">';
							dhtml += '              <div class="zd-list"><b class="fl colorblue">'+cmlist[i].recreator+' </b>  <b class="fr colorgray">'+cmlist[i].datestr+'</b></div>';
								dhtml += '              <div class="zd-list" at_content>'+cmlist[i].recontent+'</div>';
									dhtml += '         </div></div>';
										dhtml += '     </div>';
											dhtml += '   </div>';
												dhtml += '  </li>';
					}
					dhtml += '</ul>';
					$('div.ad-bottom').append(dhtml);
					$('#replyCount').html(cmlist.length);//评论数量
					if(cmlist.length==0){
						$("div.Commenttitle").hide();
					}else{
						$("div.Commenttitle").show();
					}			
					
					mobileBillComment.formatFace();
				},'json');
			}
		},
		insertBillComment:function(content){
			$.post(getPath()+"/interflow/billComment/addBillComment",{reContent:content,billId:$("#billId").val()},function(data){
				commonTipShow("评论成功",1000);
				$("#content").val('');
				mobileBillComment.init();
				
				$("#content").css('height','34px');
				$("#billComment").show();
				hideload();
				
			});
		},
		formatFace:function(){
			$("#comment li").each(function(){
				var comment=$(this).find('[at_content]').html();
				$(this).find('[at_content]').html(convertImg(comment));
			});
		}
};

function addcomment(o){
	$(o).hide();
	//$(o).attr('onclick','');
	showload('请稍等');
	var content=$('#content').val();
	if(content==""){
		commonTipShow("评论内容不能为空！",1000);
		hideload();
		$(o).show();
		//$(o).attr('onclick',"addcomment(this);");
		return false;
	}else{
		if(content.length>150){
			commonTipShow("评论内容不能超过150字",1000);
			hideload();
			$(o).show();
			//$(o).attr('onclick',"addcomment(this);");
			return false
		}
		mobileBillComment.insertBillComment(content);
		
		//$("#content").css('height','34px');
		//$(o).show();
		//hideload();
	}
	//$(o).attr('onclick',"addcomment(this);");
}

