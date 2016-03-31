/**
 * 添加系统消息
 * @param content 内容
 * @param objId  对象Id
 * @param msgType 消息类型
 * @param creatorById 接收人ID
 * @param orgById 接受人组织
 */
function insertSysMsg(content,objId,msgType,creatorById,orgById){
	$.post(getPath()+"/interflow/message/sysMessage/save",{content:content,objId:objId,msgType:msgType,creatorBy:creatorById,orgBy:orgById},function(data){
	});
}
/**
 * 加载系统消息
 * @param page
 */
function initSysMessageData(page){
	$("#loadiv").show();
	$.post(getPath()+"/interflow/messageCenter/sysMessageData",{page:page},function(pag){
		$("#loadiv").hide();
		$("#otherMessage").html('');
		var data = pag.items;
		for(var i = 0;i<data.length;i++){
			var photoUrl = '';
			if(data[i].creator.photo!='' && data[i].creator.photo!=null){
				photoUrl = getPath()+"/images/"+data[i].creator.photo;
			}else{
				photoUrl = getPath()+"/default/style/images/head/man_head.gif";
			}
			var htmlStr = "";
			if("MSG_NOTICE" != data[i].msgType){
				if(data[i].careCount>0){
					htmlStr = '<a href="javascript:void(0)" onclick="toDeleteFansData(\''+data[i].creator.id+'\',\''+data[i].org.id+'\',\''+data[i].id+'\')"><img src="'+getPath()+'/default/style/images/blog/personal12.png"/>取消关注</a>';
				}else{
					htmlStr='<input id="addAtten" class="personal_information_list02" type="button" value="＋关注" onclick="careTo(\''+data[i].creator.id+'\',\''+data[i].org.id+'\',\''+data[i].id+'\',this)"/>';
				}
			}
			
			$('<dl>'+
                '<dt><img onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" src="'+photoUrl+'" person-pop="'+data[i].creator.number+'" pop-name="'+data[i].creator.name+'"/></dt>'+
               ' <dd>'+
                    '<div class="fontline">'+data[i].creator.name+'（'+data[i].org.name+'）'+data[i].createTimeStr+''+data[i].content+'</div>'+
                    '<div class="bottomline">'+
                         '<div id="'+data[i].id+'">'+htmlStr+'</div>'+
                    '</div>'+
                '</dd>'+
            '</dl>').appendTo("#otherMessage");
		}
		personPop.init();
		var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
//		var pagediv = "<div class='pageline'>当前第"+pag.currentPage+"页,共"+totalPage
//		+"页<a href='javascript:void(0)' id='prev' onclick=sysMsgPage("+pag.currentPage+",'prev',"+totalPage+")>上一页</a>"		
//		+"<a href='javascript:void(0)' id='next' onclick=sysMsgPage("+pag.currentPage+",'next',"+totalPage+")>下一页</a></div>";
//		$("#sysMsgPage").html(pagediv);
		$("#otherMsgPage").html(initpagelist(page,totalPage));
	});
}
function sysMsgPage(page,id,count){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips("已经是第一页");
			return
		}else{
			initSysMessageData(page-1);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initSysMessageData(page+1);
		}
	}
}
function insertFans(creatorById,orgById,obj,currentObj){
			var fun = $(currentObj).attr("onclick");
			$(currentObj).removeAttr("onclick");
			$.post(getPath()+"/blog/fans/save",{creatorBy:creatorById,orgBy:orgById},function(data){
//				data = eval("("+data+")");
				if(data.STATE=="SUCCESS"){
					art.dialog.tips("关注成功！",null,"succeed");
					//initSysMessageData(1);
					//insertSysMsg("关注了你！",data.id,"MSG_BLOG",creatorById,orgById);
					$("#"+obj).html('<a href="javascript:void(0)" onclick="toDeleteFansData(\''+creatorById+'\',\''+orgById+'\',\''+obj+'\')"><img src="'+getPath()+'/default/style/images/blog/personal12.png"/>取消关注</a>');
				} else {
					art.dialog.alert(data.MSG);
					$(currentObj).attr("onclick",fun)
				}
			},'json');
}
careTo = function(personId,orgId,obj,currentObj){
	insertFans(personId,orgId,obj,currentObj);
	//$("#"+obj).html('<a href="javascript:void(0)" onclick="deleteFansData(\''+personId+'\',\''+orgId+'\',\''+obj+'\')"><img src="'+getPath()+'/default/style/images/blog/personal12.png"/>取消关注</a>');
	//initSysMessageData(1);
}

toDeleteFansData = function(creatorById,orgById,obj){
		art.dialog.confirm("确定取消关注吗？",function(){
			$.post(getPath()+"/blog/fans/deleteFans",{creatorById:creatorById},function(data){
//				data = eval("("+data+")");
				if(data.STATE=="SUCCESS"){
					$("#"+obj).html('<input id="addAtten" class="personal_information_list02" type="button" value="＋关注" onclick="insertFans(\''+creatorById+'\',\''+orgById+'\',\''+obj+'\',this)"/>');
					//initSysMessageData(1);
				} else {
					art.dialog.alert(data.MSG);
				}
				
			},'json');
		});
	
}

/**
 * 添加其他消息
 * @param content 内容
 * @param url  照片地址
 * @param msgType  消息类型
 * @param topicId 主贴Id
 * @param creatorById 接收人Id
 * @param orgById 接受人组织Id
 */
function insertOtherMessage(content,url,msgType,topicId,creatorById,orgById){
	$.post(getPath()+"/interflow/message/otherMessage/save",{content:content,url:url,creatorBy:creatorById,orgBy:orgById,topicId:topicId,msgType:msgType},function(data){
		alert(data);
	});
}
/**
 * 加载其他消息
 * @param page 当前页
 * @param state  状态
 */
function initOtherMessageData(page,state){
	if(state==""){
		state = "notBlog";
	}
	$("#loadiv").show();
	$.post(getPath()+"/interflow/messageCenter/otherMessageData",{page:page,type:state},function(pag){
		$("#loadiv").hide();
		$("#otherMessage").html('');
		$('<div><input id="content">&nbsp;&nbsp;<input id="time">&nbsp;&nbsp;<button id="search">查询</button><a class="Have_read">全部已读</a></div>').appendTo("#otherMessage");
		var data = pag.items;
		if(data.length<1){
			$("#otherMessage").html('没有相关数据').css("textAlign","center");
		}else{
			$("#otherMessage").css("textAlign","");
		for(var i = 0;i<data.length;i++){
			var photoUrl = '';
			if(data[i].creator.photo!='' && data[i].creator.photo!=null){
				photoUrl = getPath()+"/images/"+data[i].creator.photo;
			}else{
				photoUrl = getPath()+"/default/style/images/head/man_head.gif";
			}
//			var hl_option = "";
//			if(state=="NOREAD"){
//				hl_option = '<span class="orangebtn btn" style="float:right;"><a onclick="hulue(\''+data[i].id+'\')" href="javascript:void(0)">忽略</a></span>';
//				$("#ignoreMsg").html('<span class="bluebtn btn" style="position:absolute; right:5px;"><a onclick="ignoreAll()" href="javascript:void(0)">全部忽略</a></span>');
//			}
			var title = "";
			var link_url = '';
			if(data[i].msgType=="BILL"){
				title = "对你在战报中的评论做出了回复！";
				link_url = '<a href="javascript:void(0)" id="neirong'+i+'" onclick="toGetBillReply(\''+data[i].id+'\',\'myDiv'+i+'\','+i+',\''+data[i].topicId+'\',\''+data[i].creator.id+'\',\''+data[i].org.id+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="NOTICE"){
				title = "对你在公告中的评论做出了回复！";
				link_url = '<a href="javascript:void(0)" onclick="toViewNotice(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="FORWARD"){
				title = "转发了你的微博";
				var method = "listDataMsg";
				link_url = '<input type="hidden" id="blogId" value="'+data[i].topicId+'"/><a  href="javascript:void(0)" onclick="getForwardData(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',null,\''+method+'\',\''+currentId+'\',null,\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="BLOG_AT"){
				title = "在微博中@了你";
				var method = "listDataMsg";
				link_url = '<input type="hidden" id="blogId" value="'+data[i].topicId+'"/><a  href="javascript:void(0)" onclick="getForwardData(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',null,\''+method+'\',\''+currentId+'\',null,\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="BLOG"){
				title = "对你在微博中做出了评论";
				var method = "listDataMsg";
				link_url = '<input type="hidden" id="blogId" value="'+data[i].topicId+'"/><a  href="javascript:void(0)" onclick="getForwardData(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',null,\''+method+'\',\''+currentId+'\',null,\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="NOTICE_AT"){
				title = "在公告中@了你";
				link_url = '<a href="javascript:void(0)" onclick="toViewNotice(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="BILL_AT"){
				title = "在战报中@了你";
				link_url = '<a href="javascript:void(0)" id="neirong'+i+'" onclick="toGetBillReply(\''+data[i].id+'\',\'myDiv'+i+'\','+i+',\''+data[i].topicId+'\',\''+data[i].creator.id+'\',\''+data[i].org.id+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="PHOTO_COM"){
				title = "对你在照片中的评论做出了回复！";
				link_url = '<a href="javascript:void(0)" fomatAt id="neirong'+i+'" onclick="getPhotoComment(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',\''+data[i].url+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="PHOTO_COM_AT"){
				title= "在照片中@了你";
				link_url = '<a href="javascript:void(0)" fomatAt id="neirong'+i+'" onclick="getPhotoComment(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',\''+data[i].url+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="RECOM_AUDIT"){
				title= "荀盘审核";
				link_url = '<a href="javascript:void(0)" fomatAt id="neirong'+i+'" onclick="auditPanel(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',\''+data[i].url+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>';
			}else if(data[i].msgType=="RECHANGE_AUDIT"){
				title= "改盘申请";
				var topary = data[i].topicId.split("@");
				link_url = '<a href="javascript:void(0)" fomatAt id="neirong'+i+'" onclick="auditPanelChange(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].topicId+'\',\''+data[i].url+'\',\''+state+'\',\''+data[i].status+'\')">'+convertImg(data[i].content)+'</a>'
				+'<a style="color:blue;" href="javascript:void(0)" onclick="viewListing(\''+topary[1]+'\')">查看盘</a>';
			}else if(data[i].msgType == "MSG_BLOG"){//系统消息类型
				title=data[i].content;
				var orgId="";
				if(null != data[i].org){
					orgId=data[i].org.id;
				}
				if(data[i].careCount>0){
					link_url = '<a href="javascript:void(0)" onclick="toDeleteFansData(\''+data[i].creator.id+'\',\''+orgId+'\',\''+data[i].id+'\')"><img src="'+getPath()+'/default/style/images/blog/personal12.png"/>取消关注</a>';
				}else{
					link_url='<input id="addAtten" class="personal_information_list02" type="button" value="＋关注" onclick="careTo(\''+data[i].creator.id+'\',\''+orgId+'\',\''+data[i].id+'\',this)"/>';
				}
			}
			var imgstr="<span>读取状态</span>";
			var dataStr = "<em>消息时间</em>";
			var orgName="";
			if(null != data[i].org){
				orgName=data[i].org.name;
			}
			$('<dl id="'+data[i].id+'">'+
                    '<dt><img onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" src="'+photoUrl+'" person-pop="'+data[i].creator.number+'" pop-name="'+data[i].creator.name+'"/></dt>'+
                    '<dd>'+
                        '<div class="fontline">'+data[i].creator.name+'（'+orgName+'）'+data[i].createTimeStr+''+title+imgstr+dataStr+'</div>'+
                        '<div class="bottomline">'+
                        '<div id="'+data[i].id+'">'+link_url+'</div>'+'</div>'+
                        '<div id="myDiv'+i+'" style="display:none; width:900px" class="success_list blues"></div>'+
                    '</dd>'+
                '</dl>').appendTo("#otherMessage");
		}
		}
		personPop.init();
		if(data.length>0){
			//alert($('[fomatAt]').length);
			at.fomatAtText($('[fomatAt]'));//bottomline
		}
		resetReadPic();
		var totalPage = pag.recordCount%pag.pageSize==0?(pag.recordCount/pag.pageSize):Math.floor(pag.recordCount/pag.pageSize)+1;
		$("#otherMsgPage").html(initpagelist(page,totalPage));
	});
}

/**
 * 图片已读未读 标示 
 */
function resetReadPic(){
	var unReadIds=$("#unReadIds").val();
	if(null != unReadIds && unReadIds != ''){
		$("#otherMessage dl").each(function(){
			var theId=$(this).attr("id");
			if(unReadIds.indexOf(theId) != -1){
				$(this).find("img[key='newGif']").attr("src",getPath()+"/default/style/images/interflow/staging/new.gif");
			}
		});
	}
}

function otherMsgPage(page,id,count,state){
	if(id=="prev"){
		if(page==1){
			art.dialog.tips("已经是第一页");
			return
		}else{
			initOtherMessageData(page-1,state);
		}
	}else{
		if(page==count){
			art.dialog.tips('已经是最后一页');
			return
		}else{
			initOtherMessageData(page+1,state);
		}
	}
}
var isEnableHR = window.parent.isEnableHR;
function toGetBillReply(id,divId,index,objId,creatorById,orgById,state,status){
	$.post(getPath()+"/interflow/bill/getBillEntity",{id:objId},function(data){
		if(data==null || data==''){
			art.dialog.tips("该条战报主贴已被删除！");
			return
		}else{
//			if(status=="NOREAD"){
//				updateState(id);
//				
//				$("#"+divId).parent().find("img[key='newGif']").remove();
//			}
			if($("#"+divId).css("display")=="none"){
				$("#"+divId).show();
				toBillReplyMsg(divId,index,objId,data.biller.id,data.belongOrg.id);
			}else{
				$("#"+divId).hide();
			}
		}
	});
	
}
function toViewNotice(id,divId,objId,state,status){
	$.post(getPath()+"/interflow/notice/getNoticeEntity",{id:objId},function(data){
		if(data==null || data==''){
			art.dialog.tips("该公告的主贴已被删除！");
			return
		}else{
			viewParentNotice(objId);
//			if(status=="NOREAD"){
//				updateState(id);
//				$("#"+divId).parent().find("img[key='newGif']").remove();
//			}else{
//				viewParentNotice(objId);
//			}
		}
	});
	
}
function updateState(id){
	$.post(getPath()+"/interflow/message/otherMessage/update",{id:id},function(){
		initMessageAllCount();
	});
}
/**
 * 忽略操作
 * @param id
 */
function hulue(id){
	updateState(id);
	window.parent.getOtherMsgCount();
	initOtherMessageData(1,$("#state").val());
}
/**
 * 忽略全部其他消息
 */
function ignoreAll(){
	$.post(getPath()+"/interflow/message/otherMessage/update",function(){
		initOtherMessageData(1,"NOREAD");
		window.parent.getOtherMsgCount();
		initMessageAllCount();
	});
}
/**
 * 加载展示微博的div
 * @param id  其他消息ID
 * @param sid  divID
 * @param bid 
 * @param page
 * @param method 方法名
 * @param currUserId 当前用户ID
 * @param spid
 */
function getForwardData(id,sid,bid,page,method,currUserId,spid,state,status){
	$.post(getPath()+"/blog/microblog/getMicroblogEntity",{id:bid},function(data){
		if(data==null || data==''){
			art.dialog.tips("该微博已被删除！");
			return
		}else{
//			if(status=="NOREAD"){
//				updateState(id);
//				parent.getOtherMsgCount();
//				$("#"+sid).parent().find("img[key='newGif']").remove();
//			}
			
			if($("#"+sid).css("display")=="none"){
				$("#"+sid).show();
				buildBlogHtml(sid,bid,page,method,currUserId,spid,true);
			}else{
//				initOtherMessageData(1, state);
				$("#"+sid).hide();
			}
		}
	});
	
}
//重新加载转发数量
function initBlogData(){
	$.post(getPath()+"/blog/microblog/forwardBlog",{blogId:$("#blogId").val()},function(data){
		$(".wb_handle").find("a").eq(0).html("转发("+data.forwardCount+")");
	});
}
/**
 * 得到照片评论
 * @param divId 容器Id
 * @param objId 照片Id
 * @param url  照片地址
 */
//&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="toReplayNotice(\''+data[i].creator.name+'\',\''+data[i].creator.id+'\')">回复</a>
function getPhotoComment(id,divId,objId,url,state,status){
	
	$.post(getPath()+"/blog/photo/getPhotoEntity",{id:objId},function(data){
		if(data==null||data==''){
			art.dialog.tips("该照片已被删除！");
			return
		}else{
//			if(status=="NOREAD"){
//				updateState(id);
//				parent.getOtherMsgCount();
//				$("#"+divId).parent().find("img[key='newGif']").remove();
//			}
			$("#"+divId).html('');
			if($("#"+divId).css("display")=="none"){
				
				var htmlStr = "<div class=imfdiv ><img enlarger="+imgBase+"/"+url+" class=mimg src='"+getPath()+"/images/"+url+"'/></div>" +
				"<p style='width:96%;text-align:right;'><a id=comment_ href='javascript:void(0)'>评论（"+data.commentCount+"）</a></p>";
				htmlStr+='<input id="objId" type="hidden" value='+objId+' >'
				htmlStr+='<input id="type" type="hidden" value="PHOTO">'
				/*$.post(getPath()+"/blog/comment/photoComment",{objId:objId},function(data){
					for(var i=0;i<data.length;i++){
						var photo = data[i].creator.photo==null?"/default/style/images/home/man_head.gif":'/images/'+data[i].creator.photo;
						htmlStr += '<dl>'+
			                '<dt person-pop='+data[i].creator.number+'>'+
			                '<img src="'+getPath()+photo+'"/></dt>'+
			                '<dd>'+
			                  '&nbsp;&nbsp;'+
			                 '<p class="afont">'+convertImg(data[i].content)+'</p>'+
			                '</dd>'+
			             '</dl>';;
					}
				});*/
				$(htmlStr).appendTo("#"+divId);
				EnlargerImg.init();
				personPop.init();
				//评论
				comment.init();
				$("#"+divId).find('[id^="comment_"]').click();
				$("#"+divId).show();
			}else{
//				initOtherMessageData(1, state);
				$("#"+divId).hide();
			}
		}
	},'json');
	
}

function auditPanel(id,divId,objId,url,state,status){
	//$("#"+divId).html('');
	var idary = objId.split("@");
	if(state=="NOREAD"){
		$("#"+divId).parent().find("img[key='newGif']").remove();
		var flag = false;
		var dlg = art.dialog.open(getPath()+"/broker/recommend/edit?id="+idary[0]+"&VIEWSTATE=VIEW", {
			init : function() {
			},
			id : 'showGardenWindow',
			width : 600,
			title:"推荐荀盘",
			height : 185,
			lock:true,
			 button:[{name:'通过',callback:function(){
				 	flag = true;
				   updateRecommend(dlg,objId,'RECOMMENDED');
					
					return false;
				}},{name:'不通过',callback:function(){
					flag = true;
					updateRecommend(dlg,objId,'NOPASS');
					
					
					
					return false;
				}}],
				close:function(){
					if(flag){
//					updateState(id);
//					parent.getOtherMsgCount();
					initOtherMessageData(1, state);
				}
		}});		
		
	}else{
		var dlg = art.dialog.open(getPath()+"/broker/recommend/edit?id="+idary[0]+"&VIEWSTATE=VIEW", {
			init : function() {
			},
			id : 'showGardenWindow',
			width : 600,
			title:"推荐荀盘",
			height : 285,
			lock:true
		});
	}
	
}

function updateRecommend(dlg,id,state){
	dlg.button({name:"通过",disabled:true});
	dlg.button({name:"不通过",disabled:true});
	var url = getPath() +"/broker/recommend/updateState";
	$.post(url,{id:id,state:state},function(res){
		res = eval(res);
		if(res.STATE == "SUCCESS"){
				art.dialog.list['showGardenWindow'].close();			
		}else{
			art.dialog.tips(res.MSG);
			dlg.button({name:"不通过",disabled:false});
			dlg.button({name:"通过",disabled:false});
		}	
		
	},'json');
}

function auditPanelChange(id,divId,objId,url,state,status){
	var idary = objId.split("@");
	
	var dlg = art.dialog.open(getPath()+"/broker/roomChangeBill/edit?id="+idary[0]+"&VIEWSTATE=VIEW", {
		id : 'editRoomChangeBill',
		width : 350,
		title:"改盘申请",
		height : 135,
		lock:true
	});
}

function viewListing(roomlistingId){
	art.dialog.open(getPath() +"/broker/roomDetail/view?roomListingId="+roomlistingId,
			{
				id : "roomDetailPage",
				title : '楼盘详情',
				background : '#333',
				width : 830,
				height : 550,
				lock : true	 
				});
	art.dialog.data('curdlg',dlg);
}
