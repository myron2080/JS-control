
$(document).ready(function(){
	mobileNoticeComment.init('0');	
	$("#noticeComment").bind("click",function(){
		showload('请稍等');
		var content=$('#content').val();
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
			mobileNoticeComment.insertNoticeComment(content);
			
		}
	});
	
	$("#backBtn").bind("click",function(){
		  //window.location.href = base+"/workbench";
		  window.location.href = base+"/weixinapi/mobile/newscenter/listView";
	});
	
	/*$("[id^='showImage_']").bind("click",function(){
		$('#myDialog').html($(this).html());
		$.mobile.changePage( "#myDialog", { role: "dialog" } );
	});*/

});
function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
		　　　　mobileNoticeComment.init('1');
		　　}
	});
}
var mobileNoticeComment={
		init:function(cur){
			showLoader();
			var thePage;
			var curPage=$("#currentPage").val();
			if(cur == '0'){//初始化
				thePage=1;
			}else{//点更多
				thePage=parseInt(curPage)+1;
			}
	
			var noticeId=$("#noticeId").val();
			var totalPage=$("#totalPage").val();
			$("#currentPage").val(thePage);
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
				    	//$("#moreDiv").show();
				    	initScrollView();
				    }
					
					mobileNoticeComment.formatFace();
				});
			}
		},
		insertNoticeComment:function(content){
			$.post(getPath()+"/weixinapi/mobile/newscenter/insertNoticeComment",{reContent:content,noticeId:$("#noticeId").val(),creatorBy:$("#creatorById").val(),orgBy:$("#orgById").val()},function(data){
				$('div.ad-bottom').prepend(data);
				mobileNoticeComment.refleshCount();
				$('#content').val('');
				
				$("#content").css('height','34px');
				hideload();
				
			});
		},
		refleshCount:function(){
			$.post(getPath()+"/weixinapi/mobile/newscenter/getNoticeCommentCount",{noticeId:$("#noticeId").val()},function(res){
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