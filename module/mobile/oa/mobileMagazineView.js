$(document).ready(function(){
	mobileComment.init('0');	
	$("#commentbtn").bind("click",function(){
		showload('请稍等');
		var content=$('#contentinp').val();
		
		if(content==""){
			commonTipShow("评论内容不能为空！",1000);
			hideload();
			return false;
		}else{
			if(content.length>150){
				commonTipShow("评论内容不能超过150字",1000);
				hideload();
				return false
			}
			mobileComment.insertComment(content);
			
		}
		
	});
});
var mobileComment={
		init:function(cur){
			showLoader();
			var thePage;
			var curPage=$("#currentPage").val();
			if(cur == '0'){//初始化
				thePage=1;
			}else{//点更多
				thePage=parseInt(curPage)+1;
			}
	
			
			var noticeId=$("#dataId").val();
			var totalPage=$("#totalPage").val();
			$("#currentPage").val(thePage);
			//填充评论
			if(noticeId!=''){
				$.post(base+"/weixinapi/mobile/newscenter/noticeComment",{noticeId:noticeId,page:thePage},function(data){
					hideLoader();
					$('.ad-bottom').append(data);
					$('#countComment').html($("#totalCount").val());//评论数量
					if($("#totalCount").val()=='0'){
						$("div.Commenttitle").hide();
					}else{
						$("div.Commenttitle").show();
					}
					if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
				    	$("#moreDiv").hide();
				    }else{
				    	$("#moreDiv").show();
				    }
					
					mobileComment.formatFace();
				});
			}
		},
		insertComment:function(content){
			$.post(getPath()+"/weixinapi/mobile/newscenter/insertNoticeComment",{reContent:content,noticeId:$("#dataId").val()},function(data){
				$('div.ad-bottom').prepend(data);
				mobileComment.refleshCount();
				$('#contentinp').val('');
				
				$("#contentinp").css('height','34px');
				hideload();
				
			});
		},
		refleshCount:function(){
			$.post(getPath()+"/weixinapi/mobile/newscenter/getNoticeCommentCount",{noticeId:$("#dataId").val()},function(res){
				if(res){
					if(res.totalNoticeComment==0){
						$("div.Commenttitle").hide();
					}else{
						$("div.Commenttitle").show();
					}
					$('#countComment').html(res.totalNoticeComment);
				}
			},'json');
		},
		formatFace:function(){
			$("#comment li").each(function(){
				var comment=$(this).find('[at_content]').html();
				$(this).find('[at_content]').html(convertImg(comment));
			});
		}
};