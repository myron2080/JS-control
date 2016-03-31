var pageIndex = 1;     // 页面索引初始值
var pageSize = 30;    
$(function(){
	searchData("0");
	$("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	$("#share").bind("click",function(){
		window.location.href = base+"/mobile/broker/bambooPlate/add";
	});
});
function searchData(str){
	showLoader();
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
	param.type = key;
	param.personid=loginUserId;
	param.inText=$("#keyWord").val();
	$.post(base + "/mobile/broker/bambooPlate/listData",param,
					function(data) {
		hideLoader();
					$("#totalPage").val(data.pageCount);
						if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
					    	$("#moreDiv").hide();
					    }else{
					    	$("#moreDiv").show();
					    }
//						$(".yilan").html("");
						var items = data.items;
						for ( var i = 0; i < items.length; i++) {
							var img = null;
							var ding ="";
							var type = ('PANEL'== items[i].type)?'靓盘':'急客';
							var color =('PANEL'== items[i].type)?'pan-green':'pan-red'; 
							if (items[i].panCusCount > 0) {
								for ( var j = 0; j < items[i].topList.length; j++) {
									ding +="<input type=hidden value=MARKET id=type /><input type='hidden' id='objId' name='objId' value='"+items[i].id+"'/><b person-pop="+items[i].topList[j].creator.number+" pop-name="+items[i].topList[j].creator.name+"  class=\"txt font13 bold\"  personid='"
											+ items[i].topList[j].creator.id
											+ "'>"
											+ items[i].topList[j].creator.name
											+ "</b>";
								}
							}
							if(items[i].photoIdStr!=null && items[i].photoIdStr.length>0){
								 img = items[i].photoIdStr.split(",");
							}
							
							var cxtHtml = "";
							cxtHtml+="<div class=\"yilan-list2\">"
				               +"<div class=\"sp-right\">"
				               +"<div class=\"sp-rightin\">"
				               +"<p class=\"font14\"><b class=\"txt font14 bold\">"+ items[i].org.name + "-"+ items[i].creator.name +"</b><b class=\"font14 txt\">("+items[i].creator.phone+")</b></p>"
				               +"<p class=\"mt5 font14\">"
				               +"<b class="+color+">"+type+"</b>&nbsp;"+items[i].content+"</p>"
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
				               cxtHtml+="<b class=\"fl color999\">"+items[i].createTime+"</b>";
				               cxtHtml+="<b class=\"fr\">";
				               cxtHtml+="<a class=\"icon-svg68 Topico\" href=\"javascript:panCusTop('"+items[i].id+"')\"><span>"+ items[i].panCusCount+ "</span></a>";
				               cxtHtml+="<a class=\"icon-svg69 Commentico\" href=\"javascript:commentOn('this','"+items[i].id+"');\"><span>"+items[i].commentCount+"</span></a>";
				               cxtHtml+="</b>";
				               cxtHtml+="</p>";
				               
				               if(items[i].panCusCount =='0' && items[i].commentCount == '0'){
				            	   cxtHtml+="<div class=\"yilantwo-white2\" pid="+items[i].id+" style=\"display:none;\"><div class='arrowico'></div>";
				               }else{
				            	   cxtHtml+="<div class=\"yilantwo-white2\" pid="+items[i].id+" ><div class='arrowico'></div>";
				               }
				               if(items[i].panCusCount != '0' && items[i].commentCount == '0'){
				            	   cxtHtml+="<div class=\"xf\" key='ding' style=\"padding:0px;\"><div class=\"sp-dname\"><div class=\"sp-dnamein\">&nbsp;"+ding+"</div></div> <div class=\"icon-svg68 sp-d\"></div></div>"
				            	   cxtHtml+="<div class=\"xf\" cid="+items[i].id+" style=\"border-bottom:none;display:none;\">";
				               }else if(items[i].panCusCount != '0' && items[i].commentCount != '0'){
				            	   cxtHtml+="<div class=\"xf\" key='ding' style=\"padding:0px;\"><div class=\"sp-dname\"><div class=\"sp-dnamein\">&nbsp;"+ding+"</div></div> <div class=\"icon-svg68 sp-d\"></div></div>"
				            	   cxtHtml+="<div class=\"xf\" cid="+items[i].id+" style=\"border-bottom:none;\">";
				               }else{
				            	   cxtHtml+="<div class=\"xf\" cid="+items[i].id+" style=\"border-bottom:none;\">";
				               }
				               
				               
				               
				               
				               cxtHtml+="<div  id=insertDiv"+items[i].id+">";
				               if(items[i].marketComments!=null){
				            	   for ( var k = 0; k < items[i].marketComments.length; k++) {
				            		   if(k==0 && items[i].panCusCount !=='0'){
				            			   cxtHtml+='<div id="line1" class=\"line1"\>fff</div>';
				            		   }
				            		   cxtHtml+="<a name='marketA' href=javascript:huifu('"+items[i].marketComments[k].creator.userName+"','"+items[i].id+"')><div class=\"bold font13 Commentshow\"><span class=\"txt\">"+items[i].marketComments[k].creator.userName+"：</span>"+items[i].marketComments[k].content+"</div><a/>";
				            	   }
				               }
				               cxtHtml+="</div>"
//				               +"<div class=\"bold\"><span class=\"colorblue\">张亮:</span>回复<span class=\"colorblue\">马大炮:</span>你很逗逼</div>"
				               cxtHtml+="<div class=\"enter\" style=\"padding:10px 0px 0px 0px;display: none;\" id=commentOn"+items[i].id+"><div class=\"enter-l\">"
				               +"<div class=\"enter-lin\" id=inId"+items[i].id+"><input  id=\"content"+items[i].id+"\"  type=\"text\" placeholder=\"请输入评论,不超过150字\" data-role=\"none\"/></div></div>"
				               +"<div class=\"enter-r\"> <button type=\"button\" key='"+items[i].id+"' onclick='noticeCommentClick(this,\""+items[i].id+"\")' id=\"noticeComment"+items[i].id+"\" linktext=\"content"+items[i].id+"\" data-iconpos=\"right\" data-role=\"none\" data-inline=\"true\"  data-theme=\"b\">评论</button>"
				               +"</div></div>"
				               +"</div>"
				               +"</div>"
				                         
				               +"</div>"
				               +"</div>";
				               if(!items[i].creator.photo){
				            	   cxtHtml +="<div class=\"sp-left\"><img src="+getPath()+"/default/style/images/mobile/man.jpg /></div>"+"</div>";
				               }else{
				            	   cxtHtml +="<div class=\"sp-left\"><img src="+getPath()+"/images/"+items[i].creator.photo+" /></div>"+"</div>";
				               }
				               
				               
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
/**
 * 顶操作
 */
function panCusTop(marketid) {
	var market = {};
	market.id = marketid;
	$.post(base + "/mobile/broker/bambooPlate/getTopCount", market, function(count) {
		if (count == 0) {
			$.post(base + "/mobile/broker/bambooPlate/panCusTop", market, function(res) {
				commonTipShow(res.MSG,1000);
	 				setTimeout(function(){
	 					searchData('0');
	 			},1000);
			}, 'json');
		} else {
			commonTipShow("你今天已经顶过了",1000);
		}
	}, 'json');
}

function noticeCommentClick(obj,objId){
	var c=$("#"+$(obj).attr("linktext")).val();
	if(c==""){
		commonTipShow("评论内容不能为空！",1000);
		return false;
	}else{
		if(c.length>150){
			commonTipShow("评论内容不能超过150字",1000);
			return false
		}
		$.post(
				getPath()+"/blog/comment/saveCommentMarket",
				{
				 objId:objId,
				 type:$('#type').val(),
				 content:c
				},
				function(data){
					var str = "<div class=\"Commentshow\"><span class=\"txt\">"+data.creator.name+"：</span>"+data.content+"</div>";
					$("#insertDiv"+objId).append(str);
					$("#"+$(obj).attr("linktext")).val('');
					$("div[id*='commentOn']").attr("style","display: none");
				},'json'
			);
	}
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
	//$("input[name='marketA']").hide();
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
