var pageIndex = 1;     // 页面索引初始值
var pageSize = 30;    
$(function(){
	searchData("0");
});
function searchData(str){
	showload();	
	$("#moreDiv").hide();
	var param = {};
	var thePage;
	//var key = $("#statusType").val();// 查询条件
	var key = $("td.selected").attr('x');
	
	if(key=="ALL"){
		key="";
	}
	var currentPage=$("#currentPage").val();
//	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
		$(".yilan").html('');
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	param.currentPage = thePage; 
	param.pageSize = 10;
	param.searchName=$("#keyWord").val();
	$.post(base + "/weixinapi/bill/listData",param,
					function(data) {
					hideload();
					$("#totalPage").val(data.pageCount);
						if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
					    	$("#moreDiv").hide();
					    }else{
					    	//$("#moreDiv").show();
					    	initScroll();
					    }
//						$(".yilan").html("");
						var items = data.items;
						for ( var i = 0; i < items.length; i++) {
							var img = null;					
							if(items[i].photoIdStr!=null && items[i].photoIdStr.length>0){
								 img = items[i].photoIdStr.split(",");
							}
							
							var cxtHtml = "";
							cxtHtml+="<div class=\"yilan-list2\">"
				               +"<div class=\"sp-right\">"
				               +"<div class=\"sp-rightin\">"
				               +"<p class=\"font14\"><b class=\"txt font14 bold\">"+ (items[i].billerOrgName?(items[i].billerOrgName+ "-"):"") + (items[i].billerName?items[i].billerName:"") +"</b></p>"
				               +"<p class=\"mt5 font14\">"
				               +"&nbsp;"+items[i].content+"</p>"
				               +"<div class=\"sp-pic mt5\" id=mySwipe  style='text-align:center; margin:0 auto' class='swipe'><div class='sp-pic mt5'>";
								if(img!=null && img.length > 0){
								cxtHtml+="<p>";
								var s = "";
								for ( var j = 0; j < img.length; j++) {
									if(img[j].length > 2){
										 cxtHtml+="<a key=swipe href='"+getPath()+"/images/"+img[j].replace('size','origin')+"' rel=external >"
										 +"<img id=showImage_firt src='"+getPath()+"/images/"+img[j].replace('size','150X100')+"' /></a>";
									}
					 			}
								}
				               cxtHtml+="</div></div>";
				               cxtHtml+="<p class=\"font13\">";
				               cxtHtml+="<b class=\"fl color999\">"+items[i].createDate+"</b>"+"<b style='margin-left:20px;' class=\"color999\">"+(items[i].creatorName?items[i].creatorName:'')+"</b>";
				               cxtHtml+="<b class=\"fr\">";
				               cxtHtml+="<a class=\"icon-svg71 Topico\" href=\"javascript:void(0)\"><span key=\"click"+items[i].id+"\">"+ items[i].clickCount+ "</span></a>";
				               cxtHtml+="<a class=\"icon-svg69 Commentico\" href=\"javascript:commentOn('this','"+items[i].id+"');\"><span key=\"reply"+items[i].id+"\">"+items[i].replyCount+"</span></a>";
				               cxtHtml+="</b>";
				               cxtHtml+="</p>";
				               
				 
				               
				               
				               
				               cxtHtml+="<div class=\"yilantwo-white2\"><div class=\"arrowico\"></div>";
				               
				               cxtHtml+="<div  id=insertDiv"+items[i].id+">";
				               /*if(items[i].marketComments!=null){
				            	   for ( var k = 0; k < items[i].marketComments.length; k++) {
				            		   if(k==0){
				            			   cxtHtml+='<div class=\"line1"\>fff</div>';
				            		   }
				            		   cxtHtml+="<a href=javascript:huifu('"+items[i].marketComments[k].creator.userName+"','"+items[i].id+"')><div class=\"bold font13 Commentshow\"><span class=\"txt\">"+items[i].marketComments[k].creator.userName+"：</span>"+items[i].marketComments[k].content+"</div><a/>";
				            	   }
				               }*/
				               cxtHtml+="</div>"
//				               +"<div class=\"bold\"><span class=\"colorblue\">张亮:</span>回复<span class=\"colorblue\">马大炮:</span>你很逗逼</div>"
				               cxtHtml+="<div class=\"enter1\" style=\"padding:10px 0px 0px 0px;display: none;\" id=commentOn"+items[i].id+"><div class=\"enter-l\">"
				               +"<div class=\"enter-lin\" id=inId"+items[i].id+"><input  id=\"content"+items[i].id+"\"  type=\"text\" placeholder=\"请输入评论,不超过150字\" data-role=\"none\"/></div></div>"
				               +"<div class=\"enter-r\"> <button type=\"button\" key='"+items[i].id+"' onclick='noticeCommentClick(this,\""+items[i].id+"\")' id=\"noticeComment"+items[i].id+"\" linktext=\"content"+items[i].id+"\" data-iconpos=\"right\" data-role=\"none\" data-inline=\"true\"  data-theme=\"b\">评论</button>"
				               +"</div></div>"
				               +"</div>"
				               +"</div>"			                         			               
				               +"</div>"	
				               
				               +"<div class=\"sp-left\"><img src=\""+(items[i].billerPhoto?(getPath()+'/images/'+items[i].billerPhoto):(getPath()+'/default/style/images/mobile/man.jpg'))+"\" /></div>"
				               
				               +"</div>";
				               +"</div>"
				               if(!cxtHtml){
				            	   cxtHtml = '<div class="yilan-list" align="center"><b>没有找到相关记录</b></div>';
				   			}
				               $(".yilan").append(cxtHtml);
						}
						if(!items.length){
							var html='';
							html+='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
							html+='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
							html+='</div>';
							$(".yilan").append(html);
						}
						
						$("a[key='swipe']").photoSwipe();
					}, 'json');
	
}

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
					commonTipShow("评论成功",1000);
					/*var str = "<div class=\"Commentshow\"><span class=\"txt\">"+data.creator.name+"：</span>"+data.content+"</div>";
					$("#insertDiv"+objId).append(str);
					$("#"+$(obj).attr("linktext")).val('');
					$("div[id*='commentOn']").attr("style","display: none");*/
					$("#"+$(obj).attr("linktext")).val('');
					hideload();
					refreshComment(objId);
				},'json'
			);
	}
}

function refreshComment(objid){
	$.post(getPath()+"/interflow/billComment/getAllMobileReply",{billId:objid},function(data){
		var cmlist = data.comment;
		var cxhtml = '';
		for(var i=0;i<cmlist.length;i++){
			if(i==0){
				cxhtml+='<div class=\"line1"\>fff</div>';
 		   }
			cxhtml+="<a href=javascript:huifu('"+cmlist[i].recreator+"','"+cmlist[i].id+"')><div class=\"bold font13 Commentshow\"><span class=\"txt\">"+cmlist[i].recreator+"：</span>"+cmlist[i].recontent+"</div><a/>";
 	   
		}
		$("#insertDiv"+objid).html(cxhtml);
		$("span[key='reply"+objid+"']").html(cmlist.length);
		$("span[key='click"+objid+"']").html(data.clickCount);
	},'json');
}

function commentOn(obj,objId){
	
	if($("#commentOn"+objId).attr('style').indexOf('display: block')> -1){
		$("#commentOn"+objId).attr("style","display: none");
		if(!$("#insertDiv"+objId).find('a').length){
			if(!$("div[pid="+objId+"]").find('div[key=ding]').length){
				$("div[pid="+objId+"]").css('display','none');
			}else{
				$("div[cid="+objId+"]").css('display','none');
			}
		}
		return;
	}
	refreshComment(objId);
	$("div[pid="+objId+"]").css('display','block');
	$("div[cid="+objId+"]").css('display','block');
	
	$("div[id*='commentOn']").attr("style","display: none");
	$("#commentOn"+objId).attr("style","display: block");
	$("#commentOn"+objId).find("input").focus();
}
function huifu(objName,objId){
	$("div[id*='commentOn']").attr("style","display: none");
	$("#commentOn"+objId).attr("style","display: block");
	if(($("#commentOn"+objId).find("input").val()!=null) || ($("#commentOn"+objId).find("input").val()!='')){
		$("#commentOn"+objId).find("input").val('');
	}
	$("#commentOn"+objId).find("input").val("回复 "+objName+":")
	$("#commentOn"+objId).find("input").focus();
}


$(function(){
	$("td").click(function(){
		if(!$(this).hasClass('selected')){
			$("td.selected").removeClass('selected');
			$(this).addClass('selected');
		}
		searchData('0');
	})
})

function changeEvent(){
	searchData('0');
}
