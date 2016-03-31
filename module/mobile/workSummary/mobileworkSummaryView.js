$(document).ready(function(){
	mobileworkSummaryComment.init('0');	
	$("#workSummaryComment").bind("click",function(){
		showload('请稍等');
		var content=$('#content').val();
		if(content==""){
			commonTipShow("评论内容不能为空");
			hideLoader();
			return false;
		}else{
			if(content.length>150){
				//art.dialog.tips("评论内容不能超过150字");
				return false
			}
			mobileworkSummaryComment.insertworkSummaryComment(content);
			
		}
	});
	
});
function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
		　　　　mobileworkSummaryComment.init('1');
		　　}
	});
}

var mobileworkSummaryComment={
		init:function(cur){
			var thePage;
			var curPage=$("#currentPage").val();
			if(cur == '0'){//初始化
				thePage=1;
			}else{//点更多
				thePage=parseInt(curPage)+1;
			}
	
			var workSummaryId=$("#workSummaryId").val();
			var totalPage=$("#totalPage").val();
			$("#currentPage").val(thePage);
			if(workSummaryId!=''){
				$.post(base+"/weixinapi/mobile/workOa/workSummaryComment",{workSummaryId:workSummaryId,page:thePage},function(data){
					$('.ad-bottom').append(data);
					$('#countComment').html($("#totalCount").val());//评论数量
					
					if($("#totalCount").val()=='0'){
						$(".Commenttitle").hide();
					}else{
						$(".Commenttitle").show();
					}
					
					if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
				    	$("#moreDiv").hide();
				    }else{
				    	//$("#moreDiv").show();
				    	initScrollView();
				    }
					
					mobileworkSummaryComment.formatFace();
				});
			}
		},
		insertworkSummaryComment:function(content){
			$.post(getPath()+"/weixinapi/mobile/workOa/insertworkSummaryComment",{reContent:content,workSummaryId:$("#workSummaryId").val(),creatorBy:$("#creatorById").val(),orgBy:$("#orgById").val()},function(data){
//				if($("#comment").length < 1){
					$('div.ad-bottom').prepend(data);
//				}else{
//					$("#comment").prepend(data);
//				}
				
				mobileworkSummaryComment.refleshCount();
				$('#content').val('');
				
				$("#content").css('height','34px');
				//$('#content').textinput();
				hideload();
			});
		},
		refleshCount:function(){
			$.post(getPath()+"/weixinapi/mobile/workOa/getworkSummaryCommentCount",{workSummaryId:$("#workSummaryId").val()},function(res){
				if(res){
					if($("#totalCount").val()=='0'){
						$(".Commenttitle").hide();
					}else{
						$(".Commenttitle").show();
					}
					$('#countComment').html(res.totalworkSummaryComment);
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