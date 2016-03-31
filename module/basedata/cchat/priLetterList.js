var priTimer;
var loadingDataFlag = true;	//加载数据标识 勿删  用于剔除重复加载数据用的
(function(){
	personPop.init();
	var remark=$('p[name="p_content"]');
	for(var i=0;i<remark.length;i++){
		var conne=$(remark[i]).html();
		conne=convertImg(conne);
		$(remark[i]).html(conne);
	}
	registerScrollFun($('#firstpane'));
//	initMessage();
})();


function initMessage(){
	clearTimeout(priTimer);
	priTimer = setInterval(function() {
		  refreshMessage();
	}, refreshTime);
}

/**
 * 详情页面
 * @param id
 */
var letterDialg;
var senderId="";//发送人id
var randomDataTemp=0;
function showDetail(id,obj){
	senderId=id;
	//$(obj).parent().parent().find(".mini-orangebtn").remove();
	if(id==$("#currentId").val()){
		var manager = $.ligerDialog.waitting('不能给自己发私信'); setTimeout(function () { manager.close(); }, 1000);
		return;
	}
	if(letterDialg){
		letterDialg.close();
	}
	var randomData = parseInt(1000*Math.random());
	randomDataTemp=randomData;
	letterDialg=$.ligerDialog.open({
		id:"chatDlalog_"+id+randomData,
		width:620,
		height:475,
		url: getPath()+"/basedata/cchatNew/toDetail?id="+id,
		title:"鼎尖聊聊",
		letterDialg:false,
		isResize:false,
		allowClose:true,
		modal:false,
		isDrag:true,
		callBackFun:function(){
			letterDialg="";
			senderId="";
			//清除详细信息定时器
			$("#chatDlalog_"+id+randomData).find("iframe")[0].contentWindow.clearDetailTimer();
		}
	});
	$("#"+id+"unRead").hide();
}

function viewhome(personId){
	$.ligerDialog.open({height:500,width:600,url: getPath()+"/blog/microblog/list?method=listData&personId="+personId,title:"个人主页",isResize:false,isDrag:true});
}

/*function pagesearch(cur){
	window.location.href =base+"/basedata/cchatNew/priLetterList?currentPage="+cur;
}*/

function scrollLoadBackFun(){
	if(loadingDataFlag && $("li[name='tabType'][class='hover']").attr("key")=="chat"){
		loadingDataFlag = false;
		moreInfo();
	}
	if(loadingDataOnLineFlag && $("li[name='tabType'][class='hover']").attr("key")=="onlineer"){
		loadingDataOnLineFlag=false;
		moreUser(currPageTemp);
	}
}

function moreInfo(){
	var currentPage = $("#currentPage").val();
	$("#currentPage").remove();
	$("#totalpage").remove();
	$("[name=moreInfo]").remove();
//	var htmlStr = $("#firstpane").html();
	//生成html
	$.post(ctx+"/basedata/cchatNew/priLetterList",{currentPage:currentPage},function(res){
		loadingDataFlag = true;
		$("#firstpane").append(res);
		if($("#totalpage").val() == $("#currentPage").val()){
			$("[name=moreInfo]").remove();
			loadingDataFlag=false;
		}
	});
	
	$("#firstpane div.menu_head").removeClass("current");
	$("#firstpane div.menu_head").click(function(){
		$(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
		$(this).siblings().removeClass("current");
	},"html");
}
//3s刷新一次实现实时聊天
function refreshMessage(){
	//判断详细页面是否展开
	var detailFlag="";
	if(letterDialg){
		detailFlag="yes";
	}else{
		detailFlag="no";
	}
	  //取得有未读消息的信息，通过人员id找到原本的域删除之后再把最新的加到头部
	  $.post(getPath()+"/basedata/cchatNew/refreshPriLetterList",{detailFlag:detailFlag,senderId:senderId},function(res){
		  if(res.STATE=="SUCCESS"){
			  var cList = res.cList;
			  var readIndex=0;
			  var readTotal=0;
			  for(var i=0;i<cList.length;i++){
				  readTotal+=cList[i].UNREAD;
				  if(senderId && senderId==cList[i].PERSONID){
					  readIndex+=cList[i].UNREAD;
				  }
				  $("#"+cList[i].PERSONID).remove();
				  var content = cList[i].CONTENT;
				  var photoStr = "";
				  if(content.length>12){
					  content = content.substring(0,12)+'...';
				  }
				  if(cList[i].PERSONPHOTO==""){
					  photoStr = '<img src="'+base+'/default/style/images/home/woman_head.gif"/>';
				  }else{
					  photoStr = '<img src="'+imgBase+'/'+cList[i].PERSONPHOTO+'"/>';
				  }
				  $("#privateDiv").prepend('<dl id="'+cList[i].PERSONID+'">'+
						  '<dt pop-name="'+cList[i].PERSONNAME+'" person-pop="'+cList[i].PERSONNUMBER+'">'+
						  photoStr+'</dt> <dd style="cursor: pointer;" ondblclick="showDetail(\''+cList[i].PERSONID+'\',this);"><p><span class="fl"><b class="font14 colorblue">'+cList[i].PERSONNAME+'</b></span>'+
						  (!(detailFlag=="yes" && senderId==cList[i].PERSONID)?'<b id=\''+cList[i].PERSONID+'unRead\' class="mini-orangebtn"><i>'+cList[i].UNREAD+'</i></b>':"")+
						  '<span class="fr color999">'+cList[i].TIME+'</span>'+
						  '<p name="p_content">'+convertImg(content)+'</p></dd></dl>');
			  }
			  
			  if(readTotal!=0){				  
				  if(detailFlag=="yes"){
					  if(readTotal-readIndex!=0){
						  $('#ct_priLetter').show();
						  $('#ct_priLetter').text(readTotal-readIndex);
					  }else{
						  $('#ct_priLetter').hide();
						  $('#ct_priLetter').text(0);
					  }
				  }else{					  
					  $('#ct_priLetter').show();
					  $('#ct_priLetter').text(readTotal);
				  }
			  }else{
				  $('#ct_priLetter').hide();
				  $('#ct_priLetter').text(0);
			  }
			  
			  if(detailFlag=="yes"){			  
				  //刷新详细数据
				  var pList=res.pList;
				  var iframeId=$("#chatDlalog_"+senderId+randomDataTemp).find("iframe").attr("id");
				  var objectId = window.frames[iframeId].document.getElementById("outDivId");
				  if(pList && pList.length>0){
					  for(var i=0;i<pList.length;i++){
						  $(objectId).append('<div name="left" class="private-letter-list">'+
								  '<div class="private-letter-avatarl"><img style="width: 30px;height: 30px;" name="leftImg" src="'+imgBase+'/'+pList[i].SENDERPHOTO+'" onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" /></div>'+
								  '<div class="private-letter-dialoguel">'+
								  '<div name="leftContent" key="p_content" class="private-letter-listin txtl">'+convertImg(pList[i].CONTENT)+'</div>'+
								  '<div name="leftDate" class="private-letter-listin private-letter-time">'+pList[i].CREATETIMESTR+'</div></div></div>');
					  }
					  var scrollBottom = $(window).scrollTop() + $(window).height();
					  $(objectId).scrollTop(scrollBottom);
				  }
			  }
			//  startAllCountInterval();	
		  }
	  },"json");
}