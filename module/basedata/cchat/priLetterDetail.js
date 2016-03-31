var priTimerDetail;	

//清掉定时器
function clearDetailTimer(){
	clearInterval(priTimerDetail);
}
$(document).ready(function(){
		$('.mail-dialogue').height(265);
		showPic("div[key='p_content']");
		setScroll();
		
		personPop.init();
		var remark=$('div[key="p_content"]');
		for(var i=0;i<remark.length;i++){
			var conne=$(remark[i]).html();
			conne=convertImg(conne);
			$(remark[i]).html(conne);
		}
		
		$("#sendPrivateLetter").bind("click",function(){
			sendMessage(this);
		});
		
		$("#sendPrivateLetter").mouseover(function(){
			  $(this).css("background-color","#FF9F4A");
		});
		$("#sendPrivateLetter").mouseout(function(){
			  $(this).css("background-color","#EB6200");
		});
		
//		priTimerDetail = setInterval(function() {
//			refreshMessage();
//		}, 8000);
	});

	Face.prototype.show=function(){	
	 	var O=this.ojb;
	 	var oid=this.oid;
	 	var top=O.offset().top;
	 	var left=O.offset().left;
	 	var h=O.height();
	 	$("#faceContent_"+oid).css("bottom","100px").css("left",left+"px").show();
	 	$("#faceContent_"+oid+" img").unbind("click").bind("click",function(){
	 		var _v=O.val();
	 		_v+=$(this).attr("fn");
	 		O.val(_v);
	 		$("#faceContent_"+oid).hide();
	 	});
	 	closeOutBorder($("#faceContent_"+oid));
	 	return $("#faceContent_"+oid);
	 }
	
	function setScroll(){
		document.getElementById("outDivId").scrollTop=document.getElementById("outDivId").scrollHeight; 
	}
  
  function sendMessage(obj){
	  var content=$("#content").val();
	  if(content == ''){
		  art.dialog.tips("请输入内容!");
		  return;
	  }
	  obj.setAttribute("disabled", true);  
	  $.post(getPath()+'/basedata/cchatNew/saveLetter',{content:content,receiverId:$("#receiverId").val(),isWx:$('#isWx').get(0).checked},function(res){
		  obj.removeAttribute("disabled");           
		  if(res.STATE == 'SUCCESS'){
			  $("#content").val("");
			  var div="<div class='private-letter-list'>";
			  div+='<div class="private-letter-avatarr"><img style="width: 30px;height: 30px;" name="leftImg" src="'+base+"/images/"+res.pic;
			  div+='" onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" /></div>';
			  div+="<div class='private-letter-dialoguer'>";
			  div+="<p class='private-letter-listin txtl' name='p_content'>"+content+"</p>";
			  div+="<p class='private-letter-listin private-letter-time'>";
			  div+=res.now+"</p></div></div>";
			  $("#outDivId").append(div);
			  showPic("p[name='p_content']");
			  setScroll();
		  }else{
			  art.dialog.tips("发送失败");
		  }
	  },'json');
  }
  
  function showPic(str){
	  var remark=$(str);
		for(var i=0;i<remark.length;i++){
			var conne=$(remark[i]).html();
			conne=convertImg(conne);
			$(remark[i]).html(conne);
		}
  }
  var param = {};
  var currentp=1;
  function more(){
		currentp=currentp+1;
		queryCallDialog(currentp);
  }
  
  function queryCallDialog(page){
		param.pageSize = 6 ;
		param.currentPage = page||1 ;
		param.receiveId=$("#receiverId").val();
		$.post(ctx+"/basedata/cchatNew/more",param,function(res){
			var data = res.showList.items;
			
			for(var i=0;i<=data.length-1;i++){
				if(data[i].sender.id==$("#receiverId").val()){
					var left = $("[name=left]").first().clone();
					left.show();
					left.find("[name=leftContent]").first().html(convertImg(data[i].content));
					left.find("[name=leftDate]").first().text(data[i].createTimeStr);
					left.find("[name=leftImg]").first().attr("src",base+"/images/"+data[i].sender.photo)
					$("#outDivId").prepend(left);
				}else{
					var right = $("[name=right]").first().clone();
					right.show();
					right.find("[name=rightContent]").first().html(convertImg(data[i].content));
					right.find("[name=rightDate]").first().text(data[i].createTimeStr);
					right.find("[name=rightImg]").first().attr("src",base+"/images/"+data[i].sender.photo);
					$("#outDivId").prepend(right);
				}
				
			}
			if(res.showList.pageCount <= page){
				$("#dialogbox_more").hide();
				$("#dialogbox_more1").attr("style","height: 28px");
//				 art.dialog.tips("没有更多消息");
			}
//			setScroll();
		},'json');
	}
  
  
  /**
   * 个人主页
   * 
   * @param personId
   */
  function viewHome(personId){
	  parent.$.ligerDialog.open({height:615,width:920,url: getPath()+"/blog/microblog/list?method=listData&personId="+personId,title:"个人主页",isResize:true,isDrag:true});
  }
  //发短信
  var detailMessage;
  function sendMessageForInFo(id){
  	
  	detailMessage = art.dialog.open(getPath()+"/cmct/note/topicMessage?personId="+id, {
		title : "发送短信",
		id : 'person_zone',
		width : 660,
		height : 360,
		lock : true,
		close : function() {
			// art.dialog.data('person_pop_id',null);
		}
	});
  }

  function closeDetailMessage(){
  	detailMessage.close();
  }
  
  //3s刷新一次实现实时聊天
 function refreshMessage(){
	  //获取与当前聊天人未读的消息apend到聊天框
	  $.post(getPath()+"/basedata/cchatNew/refreshMessage",{senderId:$("#receiverId").val()},function(res){
		  var pList = res.pList;
		  for(var i=0;i<pList.length;i++){
			  $("#outDivId").append('<div name="left" class="private-letter-list">'+
              '<div class="private-letter-avatarl"><img name="leftImg" src="'+imgBase+'/'+pList[i].sender.photo+'" onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" /></div>'+
              '<div class="private-letter-dialoguel">'+
                   '<div name="leftContent" key="p_content" class="private-letter-listin txtl">'+pList[i].content+'</div>'+
                   '<div name="leftDate" class="private-letter-listin private-letter-time">'+pList[i].createTimeStr+'</div></div></div>');
		  }
		  if(pList.length>0){
			  var scrollBottom = $(window).scrollTop() + $(window).height();
//		  $("div").scrollTop($('div').height());
			  $("div").scrollTop(scrollBottom);
		  }
	  },"json");
 }
  
  