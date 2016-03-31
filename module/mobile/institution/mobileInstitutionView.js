$(document).on("pageinit","#listPage",function(){
	 /*$("#content").on("swipe",function(){
		    //$("span").text("Swipe detected!");
		    alert("滑动");
		  }); */                     
	}).ready(function(){
	mobileinstitutionComment.init('0');	
	$("#institutionComment").bind("click",function(){
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
			mobileinstitutionComment.insertinstitutionComment(content);
			
		}
		
	});
	$("#backBtn").bind("click",function(){
		  //window.location.href = base+"/workbench";
		  window.location.href = base+"/weixinapi/mobile/instituion/listView";
	});
	 $('img[data-large]').bind("click",function(){
		 //"#mySwipe a"
		// alert($(this).attr('data-large'));
		// $("#showPage").attr("src",$(this).attr('data-large'));
		// $( "#popupPhotoLandscape" ).popup( "open" );
	 });
	 /*$("#content").on("click",function(){
		    //$("span").text("Swipe detected!");
		    alert("滑动");
		  }); */ 
	/*$("[id^='showImage_']").bind("click",function(){
		$('#myDialog').html($(this).html());
		$.mobile.changePage( "#myDialog", { role: "dialog" } );
	})*/
});
function initScrollView(){
	$(window).scroll(function(){
		　　var scrollTop = $(this).scrollTop();
		　　var scrollHeight = $(document).height();
		　　var windowHeight = $(this).height();
		　　if(scrollTop + windowHeight == scrollHeight){
				if($("#currentPage").val()!= $("#totalPage").val())
				mobileinstitutionComment.init('1');
		　　}
	});
}
var mobileinstitutionComment={
		init:function(cur){
			showLoader();
			var thePage;
			var curPage=$("#currentPage").val();
			if(cur == '0'){//初始化
				thePage=1;
			}else{//点更多
				thePage=parseInt(curPage)+1;
			}
	
			
			var institutionId=$("#institutionId").val();
			var totalPage=$("#totalPage").val();
			$("#currentPage").val(thePage);
			//填充评论
			if(institutionId!=''){
				$.post(base+"/weixinapi/mobile/instituion/institutionComment",{institutionId:institutionId,page:thePage},function(data){
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
					
					mobileinstitutionComment.formatFace();
				});
			}
		},
		insertinstitutionComment:function(content){
			$.post(getPath()+"/weixinapi/mobile/instituion/insertInstitutionComment",{reContent:content,institutionId:$("#institutionId").val(),creatorBy:$("#creatorById").val(),orgBy:$("#orgById").val()},function(data){
				$('div.ad-bottom').prepend(data);
				mobileinstitutionComment.refleshCount();
				$('#contentinp').val('');
				
				$("#contentinp").css('height','34px');
				hideload();
				
			});
		},
		refleshCount:function(){
			$.post(getPath()+"/weixinapi/mobile/instituion/getInstitutionCommentCount",{institutionId:$("#institutionId").val()},function(res){
				if(res){
					if(res.totalNoticeComment==0){
						$("div.Commenttitle").hide();
					}else{
						$("div.Commenttitle").show();
					}
					$('#countComment').html(res.totalInstitutionComment);
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