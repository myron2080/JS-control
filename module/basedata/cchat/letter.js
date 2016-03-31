

//$(document).ready(function(){
//		
//		$(".neirong dd p span a").toggle(function(){
//				$(this).parent().parent().next("div").show();	
//				$(this).next("input").val($(this).html());
//				$(this).html("收起");
//		},function(){
//				$(this).parent().parent().next("div").hide();	
//				$(this).html($(this).next("input").val());	
//				$(this).next("input").val("");
//		});		
//		
//		$("ul[class=title] li").click(function(){
//				$(this).addClass("mo").siblings("li").removeClass("mo");	
//				
//				if($(this).html()=="最新消息"){
//					$("#newMessage").show().siblings("div").hide();
//					//window.parent.document.getElementById("homeIframe").src="${ctx}/letter/getMyNoReadLetters";
//					
//				}else{
//					$("#allMessage").show().siblings("div").hide();
//					//window.parent.document.getElementById("homeIframe2").src="${ctx}/letter/getMyAllReadLetters";
//				}
//		});
//		
//		$("span div[class=titles] a").click(function(){
//			$("div[class=news]").hide();											 
//		});
//});

//隐藏通知框
function hideDialg(){
	$(window.top.document).find("#letter_notice").fadeOut(2000);
}



function selectNoreadLetter(){
	$(getPath()+"/basedata/cchat/letter/");
}

function selectReplyList(index,id,currentId){
	$.post(ctx+"/basedata/cchat/getReplyList",{topicId:id},function(replyList){
		$("#content"+index).find("div").remove();
	
		if(replyList!=null&& replyList.length>0){
			for(var i=0;i<replyList.length;i++){
				var photo = null==replyList[i].sender.photo?"default/style/images/home/man_head.gif":"images/"+replyList[i].sender.photo;
                if (replyList[i].receiver.id!=currentId){
                	 $('<div class="dialogue_list01">'+
                             ' <div class="dialogue_list01l"><img src="'+ctx+'/'+photo+'" pop_person_id="'+replyList[i].sender.id+'"/></div>'+
                              '<div class="dialogue_list01r">'+
                                     ' <div class="dhz">'+
                                      '<font>'+replyList[i].sender.name+'（'+replyList[i].sender.personPosition.position.belongOrg.name+'）:'+convertImg(replyList[i].content)+'<p style="color:#a9a9a9;"><label>'+replyList[i].dateStr+'</label></p></font>'+
                                      ' <div class="dhz01"></div>'+
                                       '<div class="dhz02"></div>'+
                                       '<div class="dhz03"></div>'+
                                    ' </div>'+
                              '</div>'+
                       ' </div>').appendTo("#content"+index);
                
                }else{
              //!-----------右边对话框循环------------>
               
              
                $('<div class="dialogue_list">'+
                        '<div class="dialogue_listl"><img src="'+ctx+'/'+photo+'" pop_person_id="'+replyList[i].sender.id+'"/></div>'+
                       '<div class="dialogue_listr">'+
                            ' <div class="dh">'+
                   			 '<font>'+replyList[i].sender.name+'（'+replyList[i].sender.personPosition.position.belongOrg.name+'）:'+convertImg(replyList[i].content)+'<p style="color:#a9a9a9;"><label>'+replyList[i].dateStr+'</label></p></font>'+
                                 ' <div class="dh01"></div>'+
                                 ' <div class="dh02"></div>'+
                                  '<div class="dh03"></div>'+
                            ' </div>'+
                        '</div>'+
                   '</div>').appendTo("#content"+index);
                }
             
			}
		}
		//PopNew.popPerson();
	});
	
}

function selectNewReplyList(index,sid,fid,currentId){
	$.post(ctx+"/basedata/cchat/getReplyList",{type:"new",topicId:fid},function(replyList){
		$("#content"+index).find("div").remove();
	
		if(replyList!=null&& replyList.length>0){
			for(var i=0;i<replyList.length;i++){
				var photo = null==replyList[i].sender.photo?"default/style/images/home/man_head.gif":("images/"+replyList[i].sender.photo);
				
                if (replyList[i].receiver.id!=currentId){
                	  $('<div class="dialogue_list01">'+
                              ' <div class="dialogue_list01l"><img src="'+ctx+'/'+photo+'" pop_person_id="'+replyList[i].sender.id+'"/></div>'+
                               '<div class="dialogue_list01r">'+
                                      ' <div class="dhz">'+
                                      '<font>'+replyList[i].sender.name+'（'+replyList[i].sender.personPosition.position.belongOrg.name+'）:'+
                         			 ''+convertImg(replyList[i].content)+'</font><p style="color:#a9a9a9;"><label>'+replyList[i].dateStr+'</label></p>'+
                                       ' <div class="dhz01"></div>'+
                                        '<div class="dhz02"></div>'+
                                        '<div class="dhz03"></div>'+
                                     ' </div>'+
                               '</div>'+
                        ' </div>').appendTo("#content"+index);
                }else{
              //!-----------右边对话框循环------------>
                $('<div class="dialogue_list">'+
                        '<div class="dialogue_listl"><img src="'+ctx+'/'+photo+'" pop_person_id="'+replyList[i].sender.id+'"/></div>'+
                       '<div class="dialogue_listr">'+
                            ' <div class="dh">'+
                              '<font>'+replyList[i].sender.name+'（'+replyList[i].sender.personPosition.position.belongOrg.name+'）:'+
                   			 ''+convertImg(replyList[i].content)+'</font><p style="color:#a9a9a9;"><label>'+replyList[i].dateStr+'</label></p>'+
                                 ' <div class="dh01"></div>'+
                                 ' <div class="dh02"></div>'+
                                  '<div class="dh03"></div>'+
                            ' </div>'+
                        '</div>'+
                   '</div>').appendTo("#content"+index);
                   
              
                }
             
			}
		}
		//PopNew.popPerson();
	});
}

function getLetter(str){
	
	$("#iframeContainer").html("");
	if(str=="new"){
		$("#new").addClass("hover");
		$("#all").removeClass("hover");
		$("#my").removeClass("hover");
		
		$("#iframeContainer").attr("src",getPath()+"/basedata/cchat/selectNewLetter");
	}else if(str=="all"){
		$("#all").addClass("hover");
		$("#new").removeClass("hover");
		$("#my").removeClass("hover");
		
		$("#iframeContainer").attr("src",getPath()+"/basedata/cchat/selectAllLetter");
	}else{
		$("#my").addClass("hover");
		$("#new").removeClass("hover");
		$("#all").removeClass("hover");
		$("#iframeContainer").attr("src",getPath()+"/basedata/cchat/selectMyLetter");
	}
}
sendLetter=function(receiveId,blogFlag){
	if((currentId==receiveId) && (!blogFlag || (loginUserId==receiveId))){
		art.dialog.tips("不能给自己发私信");
		return
	}else{
		art.dialog.data("result",null);
		art.dialog.open(getPath()+'/basedata/cchat/show?receiveId='+receiveId,
				{id:"openOrg",
			title: "鼎尖聊聊",
			 lock:true,
			 width:'450px',
			 height:'300px',
			skin: "aero",
			padding:0,
			resize:false,
				close:function(){
					if(art.dialog.data("result") && ("success" == art.dialog.data("result"))){
						art.dialog({
							content:'发送成功！',
							time:1,
							close:function(){
							},
							width:200
						});
						
					}
				}	
		});
	}
}

function loadList(type){
	
	var page=parseInt($('.pagdiv').find('#cpage').val());
	var pageSize=0;
	if(type!=''){
		page=parseInt($('.pagdiv').find('#cpage').val());
		pageSize=parseInt($('.pagdiv').find('#pageSize').val());
	}
	if(type=='next'){
		if(page==pageSize){
			art.dialog({
				content:"已经是最后一页！",
				time:1,
				close:function(){
					
				},
				width:200
			});
			return;
		}
		page+=1;
	}else if(type=='prev'){
		if(page==1){
			art.dialog({
				content:"已经是第一页！",
				time:1,
				close:function(){
					
				},
				width:200
			});
			return;
		}
		page-=1;
	}
	
	//var href = getPath()+ "/interflow/addressBook/selectPersonList?name="+name+"&currentPage="+page;
	//location.href = href;
	getData(page);
}