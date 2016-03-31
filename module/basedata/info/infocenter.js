$(document).ready(function(){
	//alert(${isEnabelHR});
	init();
	params ={};
	params.inputTitle = "有效期";	
	MenuManager.common.create("DateRangeMenu","effectTime",params);
	var height = $(window).height();
	var width = $(window).width();
	width = width - $('.navbar').width();
	$("#rightarea").css("height",height);
	$("#otherMessage").css("height",height-100);
	$("#main").ligerLayout({leftWidth:112,allowLeftCollapse:true,allowLeftResize:true});
	$("#process_main").height($("#main").height()-20); 
	//定向指定页面
	$("#menu").find("li:first-child").click();
});

function init(){
	 var count = 0;
	 initOtherMessageData(1,"","","","");
	 
	 $("#menu").find("li").bind("click",function(){
	 	  $("#menu").find("li").removeClass("select");
	 	  $(this).addClass("select");
	 	  $(this).find("img").show();
	 	  $("#type").val($(this).attr("id"));
	 	 initOtherMessageData(1,$(this).attr("id"),"","","");
	 });
	
}
function getCount(){
	$.ajaxSetup({ async: false});
	$.post(getPath() + "/basedata/info/getMsgCount",{}, function(res) {
		if(res.countMap.I_COUNT != 0){
			$("#interactiveCount").html(res.countMap.I_COUNT);
			$("#interactiveCount").show();
		}else{
			$("#interactiveCount").hide();
		}
		if(res.countMap.S_COUNT != 0){
			$("#systemCount").html(res.countMap.S_COUNT);
			$("#systemCount").show();
		}else{
			$("#systemCount").hide();
		}
		if(res.countMap.B_COUNT != 0){
			$("#businessCount").html(res.countMap.B_COUNT);
			$("#businessCount").show();
		}else{
			$("#businessCount").hide();
		}
		if(res.countMap.P_COUNT != 0){
			$("#processCount").html(res.countMap.P_COUNT);
			$("#processCount").show();
		}else{
			$("#processCount").hide();
		}
//		if(res.countMap.ALL_COUNT != 0){
//			$("#allCount").html(res.countMap.ALL_COUNT);
//			$("#allCount").show();
//		}else{
//			$("#allCount").hide();
//		}
	},"json");
	$.ajaxSetup({ async: true});
}


/**
 * 加载其他消息
 * @param page 当前页
 * @param state  状态
 */
function initOtherMessageData(page,state,queryStartDate,queryEndDate,searchKeyWord){
//	$("#loadiv").show();
	$.post(getPath()+"/basedata/info/otherInfoData",{page:page,type:state,queryStartDate:queryStartDate,queryEndDate:queryEndDate,searchKeyWord:searchKeyWord},function(pag){
//		$("#loadiv").hide();
		$("#otherMessage").html('');
		var data = pag.items;
		if(data.length<1){
			$("#otherMessage").html('');
			$("#otherMessage").append('<div nodata="" style="top:30%;left:50%; position:absolute;"> <img src="' + base + '/default/style/images/nodata-L.png"></div>');
		}else{
			$("#otherMessage").css("textAlign","");
		for(var i = 0;i<data.length;i++){
			var photoUrl = '';
			if(data[i].type=="INTERACTIVE"){//互动消息
				if(data[i].creator.photo!='' && data[i].creator.photo!=null){
					photoUrl = getPath()+"/images/"+data[i].creator.photo;
				}else{
					photoUrl = getPath()+"/default/style/images/home/man_head.gif";
				}
			}else if(data[i].type=="SYSTEM"){//系统消息
				photoUrl = getPath()+"/default/style/images/home/system.png";
			}else if(data[i].type=="BUSINESS"){//业务消息
				photoUrl = getPath()+"/default/style/images/home/business.png";
			}else if(data[i].type=="PROCESS"){//流程消息
				photoUrl = getPath()+"/default/style/images/home/process.png";
			}
			var title = data[i].title;
			var link_url = '';
			
 			if(data[i].title.indexOf("公告")>=0){
				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" onclick="read(\''+data[i].id+'\');toViewNotice(\''+data[i].objId+'\',\''+data[i].id+'\')">'+convertImg(data[i].content)+'</a>';
 			}else if(data[i].title.indexOf("微博")>=0){
 				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" onclick="read(\''+data[i].id+'\');getForwardData(\''+data[i].id+'\',\'myDiv'+i+'\',\''+data[i].objId+'\',null,\''+'listDataMsg'+'\',\''+data[i].person.id+'\',null)">'+convertImg(data[i].content)+'</a>';
 			}else if(data[i].title.indexOf("战报")>=0){
 				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" onclick="read(\''+data[i].id+'\');toGetBillReply(\'myDiv'+i+'\','+i+',\''+data[i].objId+'\')">'+convertImg(data[i].content)+'</a>';
 			}else if(data[i].title.indexOf("申请改盘")>=0){
 				var topary = data[i].objId.split("@");
				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" onclick="read(\''+data[i].id+'\');auditPanelChange(\''+topary[0]+'\')">'+convertImg(data[i].content)+'</a>'
				+' <a style="color:blue;" href="javascript:void(0)" onclick="auditPanelChange(\''+topary[0]+'\')">审核</a>   <a style="color:blue;" href="javascript:void(0)" onclick="viewListing(\''+topary[1]+'\')">查看盘</a>';
 			}else if(data[i].title.indexOf("收款确认")>=0 || data[i].title.indexOf("项目收款")>=0){
				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" title="点击查看成交报告" onclick="read(\''+data[i].id+'\');showDealreport(\''+data[i].objId+'\')">'+data[i].content+'</a>';
 			} else if(data[i].title.indexOf("成交报告跟进信息提醒")>=0){
 				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" title="点击查看成交报告" onclick="read(\''+data[i].id+'\');showDealreport(\''+data[i].objId+'\')">'+data[i].content+'</a>';
			} else if(data[i].title.indexOf("推荐荀盘")>=0){
				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" title="点击查看荀盘" onclick="read(\''+data[i].id+'\');auditRecommend(\''+data[i].objId+'\')">'+data[i].content+'</a>';
			}else if(data[i].title.indexOf("制度发文")>=0){
				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" title="点击查看制度发文" onclick="read(\''+data[i].id+'\');viewInstitution(\''+data[i].objId+'\')">'+data[i].content+'</a>';
			}else if(data[i].title.indexOf("新房私客跟进提醒")>=0){
				link_url = '<a href="javascript:void(0)"  id="neirong'+i+'" title="点击查看私客" onclick="read(\''+data[i].id+'\');viewCustomer(\''+data[i].objId+'\')">'+data[i].content+'</a>';
			}else if(data[i].title.indexOf("字典变动驳回")>=0){
				link_url = '<span href="javascript:void(0)" onclick="read(\''+data[i].id+'\')" id="neirong'+i+'" ><div>'+convertImg(data[i].content)+
				"<a style='color:#50b4e6;text-decoration:underline;' onclick=\"window.top.addTabItem('personRoom','"+getPath()+"/broker/roomListingMy/viewPerson?tabtype=NEWADD','个人盘');\"> 我的盘 </a>"+'<div></span>';
			}else{
 				link_url = '<span href="javascript:void(0)"  style="cursor:pointer;" onclick="read(\''+data[i].id+'\')" id="neirong'+i+'" ><div  >'+convertImg(data[i].content)+'<div></span>';
 			}
			
			
			var dataStr = "<em>"+data[i].createDateStr+"</em>";
			var orgName="";
			var creatorName = "";
			if(null != data[i].creator && null != data[i].creator.org && data[i].type=="INTERACTIVE"){
				orgName="（"+data[i].creator.org.name+"）";
				creatorName = data[i].creator.name;
			}
			var readStr="";
			var titleStr = "";
			if(data[i].isRead==1){
				title = "<b id='"+data[i].id+"title' style='color:#000'>"+title+"<b id='"+data[i].id+"o'></b><b>"
				readStr = "<span id='"+data[i].id+"rendSpan'>&nbsp;</span>";
				titleStr =  "<b id='"+data[i].id+"bold'>"+creatorName+orgName+"<b>"+title+dataStr+readStr;
			}else{
				title = "<b id='"+data[i].id+"title' style='font-weight:bold;color:#000'>"+title+"<b id='"+data[i].id+"o' style='color:#ff0000;'>&nbsp;&nbsp;●</b><b>"
				readStr = "<span style='cursor:pointer;color:blue' onclick='read(\""+data[i].id+"\")' id='"+data[i].id+"rendSpan'>标为已读</span>";
				titleStr = "<b id='"+data[i].id+"bold' style='font-weight:bold;'>"+creatorName+orgName+"<b>"+title+dataStr+readStr;
			}
			if(data[i].type=="INTERACTIVE"){
				$('<dl id="'+data[i].id+'">'+
	                    '<dt><img onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" src="'+photoUrl+'" person-pop="'+data[i].creator.number+'" pop-name="'+creatorName+'"/></dt>'+
	                    '<dd>'+
	                        '<div class="fontline">'+titleStr+'</div>'+
	                        '<div class="bottomline">'+
	                        '<div id="'+data[i].id+'">'+link_url+'</div>'+'</div>'+
	                        '<div id="myDiv'+i+'" style="display:none; width:900px" class="success_list blues"></div>'+
	                    '</dd>'+
	                '</dl>').appendTo("#otherMessage");
			}else{
				$('<dl id="'+data[i].id+'">'+
	                    '<dt><img onerror="this.src=\''+base+'/default/style/images/home/man_head.gif\'" src="'+photoUrl+'"/></dt>'+
	                    '<dd>'+
	                        '<div class="fontline">'+titleStr+'</div>'+
	                        '<div class="bottomline">'+
	                        '<div id="'+data[i].id+'">'+link_url+'</div>'+'</div>'+
	                        '<div id="myDiv'+i+'" style="display:none; width:900px" class="success_list blues"></div>'+
	                    '</dd>'+
	                '</dl>').appendTo("#otherMessage");
			}
			
		}
		}
 		personPop.init();
//		if(data.length>0){
			//alert($('[fomatAt]').length);
			//at.fomatAtText($('[fomatAt]'));//bottomline
//		}
		//resetReadPic();
		
		$("#otherMsgPage").html(initPageLigerUiList(page,pag.recordCount,pag.pageSize,pag.exceTime,pag.exceSql));
	},"json");
	 getCount();
}

//私客查看
function viewCustomer(dataId){
	if(dataId){
		var dlg = art.dialog.open(getPath()+"/fastsale/intention/intentionView?single=Y&id="+dataId,{
			title:'意向客户查看',
			 lock:true,
			 width:'850px',
			 height:'600px',
			 id:"viewIntentionCustomer",
			close:function(){
			
			}
		});
	}
}

function auditRecommend(id){
	var flag = false;
	var idary = id.split("@");
	var dlg = art.dialog.open(getPath()+"/broker/recommend/edit?id="+idary[0]+"&roomId="+idary[1]+"&VIEWSTATE=VIEW", {
		init : function() {
		},
		id : 'showGardenWindow',
		width : 700,
		title:"推荐荀盘",
		height : 285,
		lock:true,
		 button:[{name:'审批',callback:function(){
			 	flag = true;
			 	if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.updateRecommend){
					dlg.iframe.contentWindow.updateRecommend(this);
				}
				return false;
			}},{name:'取消'}]
	});	
	art.dialog.data("currentDlg",dlg);
}

//查看成交报告
$list_editHeight = ($(window).height() - 150);
function showDealreport(id){
	art.dialog.open(base +"/trade/dealreport/show?id="+id,{
		id : id,
		title : '查看成交报告',
		background : '#333',
		width : 950,
		height : $list_editHeight,
		lock : true	
	});			
}

function auditPanelChange(objId){
	var dlg = art.dialog.open(getPath()+"/broker/roomChangeBill/editPage?id="+objId+"&VIEWSTATE=VIEW", {
		id : 'editRoomChangeBill',
		width : 260,
		title:"改盘申请",
		height : 140,
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
	art.dialog.data('curdlg');
}

var sysMessage;
function toSendMessage(){
	sysMessage = $.ligerDialog.open({
		height : 400,
		width : 500,
		url : getPath() + '/interflow/message/sysMessage/toSendMessage',
		title : '发通知',
		isResize : true,
		isDrag : true
	});
}

function readAll(){
	var type = $("#type").val();
	if(type==""){
		type = "all";
	}
	$.post(getPath()+"/basedata/info/read",{type:type},function(data){
		initOtherMessageData(1,$("#type").val(),"","","");
	},"json");
}

function read(infoId){
	 $.post(getPath()+"/basedata/info/read",{infoId:infoId},function(data){
		 getCount();
    },"json");
	 $("#"+infoId+"rendSpan").html("&nbsp;");
	 $("#"+infoId+"bold").attr("style","");
	 $("#"+infoId+"o").hide();
	 $("#"+infoId+"title").attr("style","color:#000;");
}

function search(){
	//时间
	var queryStartDate = "";
	var queryEndDate = "";
	if(MenuManager.menus["effectTime"]){
		queryStartDate = MenuManager.menus["effectTime"].getValue().timeStartValue;
		queryEndDate = MenuManager.menus["effectTime"].getValue().timeEndValue;
	}
	var searchKeyWord = $("#searchKeyWord").val();
	if(searchKeyWord=='消息内容/标题'){
		searchKeyWord='';
	}
	initOtherMessageData(1,$("#type").val(),queryStartDate,queryEndDate,searchKeyWord);
	
}

function infoWindow(url,infoId){
	art.dialog.open(getPath()+url,
			{title:"详细",
			lock:true,
			width:830,
			height:500,
			id:'NOTICE-VIEW',
			button:[{name:'关闭'}]}
	);
}

function toViewNotice(objId){
	$.post(getPath()+"/interflow/notice/getNoticeEntity",{id:objId},function(data){
		if(data==null || data==''){
			art.dialog.tips("该公告的主贴已被删除！");
			return
		}else{
			art.dialog.open(getPath()+'/interflow/notice/selectById?id='+objId,
					{title:"查看公告",
					lock:true,
					width:800,
					height:500,
					id:'NOTICE-VIEW',
					button:[{name:'关闭'}]}
			);
		}
	});
}

function getForwardData(id,sid,bid,page,method,currUserId,spid){
	$.post(getPath()+"/blog/microblog/getMicroblogEntity",{id:bid},function(data){
		if(data==null || data==''){
			art.dialog.tips("该微博已被删除！");
			return
		}else{
			if($("#"+sid).css("display")=="none"){
				$("#"+sid).show();
				$("#"+sid).html("");
				buildBlogHtml(sid,bid,page,method,currUserId,spid,true);
			}else{
				$("#"+sid).hide();
			}
		}
	});
}

function toGetBillReply(divId,index,objId){
	$.post(getPath()+"/interflow/bill/getBillEntity",{id:objId},function(data){
		if(data==null || data==''){
			art.dialog.tips("该条战报主贴已被删除！");
			return
		}else{
			if($("#"+divId).css("display")=="none"){
				$("#"+divId).show();
				toBillReplyMsg(divId,index,objId,data.biller.id,data.belongOrg.id);
			}else{
				$("#"+divId).hide();
			}
		}
	});
	
}

function processView(processId,id,processSort){
	if("WORKFLOW"==processSort){	
		dlg = art.dialog.open(getPath()+"/workflow/task/toProcessView?VIEWSTATE=EDIT&id=" + processId,
				{title:"流程查看",
			lock:true,
			width:960,
			height:580,
			id:"dealProcess",
			close:function(){
				 
			}
			});
	}else{
		dlg = art.dialog.open(getPath()+"/interflow/sign/signView?doType=view&signId=" + id+"&processId="+processId,
				{title:"流程查看",
			lock:true,
			width:960,
			height:580,
			id:"dealProcess",
			close:function(){
				 
			}
		 });
	}
}

viewInstitution = function(id){
	art.dialog.open(getPath()+'/interflow/institution/selectById?id='+id,
			{title:"查看制度发文",
			lock:true,
			width:830,
			height:450,
			id:'NOTICE-VIEW',
			button:[{name:'关闭'}]}
	);
}