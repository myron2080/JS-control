var isEvaluate=false;//控制评论
init= function(){
	addUploadButton(CKEDITOR.instances.editor1);
}


initNoticeCommentData = function(){
	var personId = $("#personId").val();
	backCommentData(personId,"commentMessage","reContent");
}
/**
 * 被评价人
 * 评价列表ID
 * 评价内容控件ID
 */
backCommentData = function(personId,depcom,contcomp,index){
	$.post(getPath()+"/interflow/evaluate/getComment",{personId:personId},function(res){
		var data = res.comment;
		var data2=res.gentle;
		var data3=res.person;
		//var clickCount = res.clickCount;
		//增加点击数
		//if(index)
		//$("#clickspan"+index).html("("+clickCount+")");
		if(data!=null){
			var score="";
			$("#"+depcom).html("");
			if(data2.number !=  undefined ){
				$("#evaluate").html(data2.man +"人"+ data2.number +"次评价");
			}else if(data2.number == undefined){
				$("#evaluate").html(data2.man +"人0次评价");
				score="<em>0</em>.0";
				$("#evaluatescore").html(score);
			}
			if(data2.score != null){
				if(data2.score.length == 3){
					score="<em>"+data2.score.substring(0,2)+"</em>"+data2.score.substring(2,3);
				}else if (data2.score.length == 2){
					if(parseInt(data2.score) == 10){
						score="<em>"+data2.score+"</em>";
					}else{
						score="<em>"+data2.score.substring(0,1)+"</em>"+data2.score.substring(1,2);
					}
				}else if (data2.score.length == 1){
					score="<em>"+data2.score.substring(0,1)+"</em>.0";
				}
				$("#evaluatescore").html(score);
			}
			if(data.length==0){
				$(".aline01").hide();
				$("#noticeMessage").hide();
			}else{
				for(var i=0;i<data.length;i++){
					if(data[i].enable=='1'){
						var photo = (data[i].creator.photo)?("/images/"+data[i].creator.photo):"/default/style/images/home/man_head.gif";
							if(data[i].model == "0"){//匿名
								photo = "/default/style/images/home/man_head.gif";
									if(data[i].creator.id == data3.id || res.permission){
										if(res.permission && data[i].creator.id != data3.id){
											$("<dl>" +
													"<dt>" +
													'<img src="'+getPath()+photo+'"/></dt>'+
													"<dd><p><span class=\"btleft\">"+data[i].org.name+"："+data[i].creator.name+"&nbsp;&nbsp;&nbsp;</span><span class='orangecolor'>"+data[i].convTime+"&nbsp;&nbsp;&nbsp;打分:"+data[i].grade+"&nbsp;&nbsp;(匿名评论)<span>"+
													"</span></p><p class=\"afont\">"+convertImg(data[i].content)+"</p></dd></dl>").appendTo("#"+depcom);
										}else{
											$("<dl>" +
													"<dt>" +
													'<img src="'+getPath()+photo+'"/></dt>'+
													"<dd><p><span class=\"btleft\">"+data[i].org.name+"："+data[i].creator.name+"&nbsp;&nbsp;&nbsp;</span><span class='orangecolor'>"+data[i].convTime+"&nbsp;&nbsp;&nbsp;打分:"+data[i].grade+"&nbsp;&nbsp;(匿名评论)<span>"+
													"<a class=\"btright\" onclick=\"delEvaluateComment('"+data[i].id+"')\" href=\"javascript:void(0)\" style=\"color:#8c6c1d;cursor: pointer;\">删除</a>" +
													"</span></p><p class=\"afont\">"+convertImg(data[i].content)+"</p></dd></dl>").appendTo("#"+depcom);
										}
									}else{
										$("<dl>" +
												"<dt><img src='"+getPath()+"/default/style/images/home/man_head.gif'></dt>"+
												"<dd><p><span style=\"color:#6666FF;\">匿名评论&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class='orangecolor'>"+data[i].convTime+"&nbsp;&nbsp;&nbsp;打分:"+data[i].grade+"<span>"+
												"</span></p><p class=\"afont\">"+convertImg(data[i].content)+"</p></dd></dl>").appendTo("#"+depcom);
									}
		
								
							}else if(data[i].model == "1"){//公开
								if(data[i].creator.id != data3.id){//别人看 没有 删除按钮 
									$("<dl>" +
											"<dt>" +
											'<img src="'+getPath()+photo+'"/></dt>'+
											"<dd><p><span class=\"btleft\">"+data[i].org.name+"："+data[i].creator.name+"&nbsp;&nbsp;&nbsp;</span><span class='orangecolor'>"+data[i].convTime+"&nbsp;&nbsp;&nbsp;打分:"+data[i].grade+"<span>"+
											"</span></p><p class=\"afont\">"+convertImg(data[i].content)+"</p></dd></dl>").appendTo("#"+depcom);
								}else{//自己看有删除按钮
									$("<dl>" +
											"<dt>" +
											'<img src="'+getPath()+photo+'"/></dt>'+
											"<dd><p><span class=\"btleft\">"+data[i].org.name+"："+data[i].creator.name+"&nbsp;&nbsp;&nbsp;</span><span class='orangecolor'>"+data[i].convTime+"&nbsp;&nbsp;&nbsp;打分:"+data[i].grade+"<span>"+
											"<a class=\"btright\" onclick=\"delEvaluateComment('"+data[i].id+"')\" href=\"javascript:void(0)\" style=\"color:#8c6c1d;cursor: pointer;\">删除</a>" +
											"</span></p><p class=\"afont\">"+convertImg(data[i].content)+"</p></dd></dl>").appendTo("#"+depcom);

								}
							}
					
					}
				}
				$(".aline01").show();
				$("#noticeMessage").show();
			}
		}
	});
}



/**
 * 评论  
 */
function savescore(){
	$.post(getPath()+"/interflow/evaluate/save",{
		'objId':$("#knowId").val(),
		'score':$(".knowledge-fj-r a.star01").length 
		
	},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				msg(res.MSG);
			}else{
				art.dialog.close();
			}
		}else{
			msg(res.MSG);
		}
	},'json');
}

/**
 * 删除公告评论
 */
function delEvaluateComment(id){
	art.dialog.confirm('是否删除该条记录？',function(){
		$.post(getPath()+"/interflow/evaluate/delComment",{id:id},function(res){
			if(res.STATE == "SUCCESS"){
				msg('删除成功！');
				initNoticeCommentData();
			}else{
				msg('删除失败！');
			}
		},"json");
	});
}
/**
 * 自定义显示提示信息
 * @param msg
 */
function msg(msg){
	setTimeout("$(\"#evaluatetext\").html('"+msg+"')",100);
	setTimeout("$(\"#evaluatetext\").html(\"\")",5000);
}

function addEvaluateComment(){
	if(isEvaluate == false){
		var json={};//声明一个json  传送controller 参数
		json.personId=$("#personId").val();
		json.model=$("input[name='model']:checked").val();
		json.content=$("#reContent").val();
		json.grade=$(".knowledge-fj-r a.star01").length;
		if($("#cuser").val() == 'yes'){
			msg("别点评自己，所谓旁观者清!");
		}else{
			$.post(getPath()+"/interflow/evaluate/checkComment",json,function(data){
				if(parseInt(data.CHECK) > 0){
					msg("您每周可以评价他一次，本周已评价过了!");
					return false;
				}else{
					var content = document.getElementById("reContent").value.length;
					if(content == 0){
						msg("说说的感受,别直接给评论,不然别人不知道为什么给分!");
						return false;
					}
					if(content < 6){
						msg("感受内容太少了,至少六个字以上!")
						return false;
					}else{
						var score=parseInt($(".knowledge-fj-r a.star01").length);
						if(score == 0){
							msg("总要给一个评分吧!");
							return false;
						}else{
							isEvaluate=true;
							$.post(getPath()+"/interflow/evaluate/addComment",json,function(data){
								isEvaluate=false;
								if(data.STATE == "SUCCESS"){
									$("#reContent").val("");
									msg(data.MSG);
									initNoticeCommentData();
								}else{
									msg(data.MSG);
								}
							},'json');
						}	
					}
				}
			},'json');
		}
	}else{
		msg("评论中,请稍等,可能网速问题导致过慢。");
	}
	
}

