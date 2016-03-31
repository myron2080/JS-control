var loadingDataOnLineFlag = true;	//加载数据标识 勿删  用于剔除重复加载数据用的

var onlineHolder = {
		option:{
			url:'/basedata/online/'
		},
		init:function(param){
			jQuery.extend(onlineHolder.option,param);
		}
}
/**
 * 统计在线人
 */
function getOnlinePersons(){
	var onlinePersons = new Array();// 保存在线人数
	var currPage = 0;
	var pageCount = 0;
	$.post(getPath()+onlineHolder.option.url+"getOnlinePerson",function(data){
		var i = 0;
		for(var key in data.pcOnlin){
			i++;
			onlinePersons.push(data.pcOnlin[key]); 
		}
		for(var key in data.mobileOnlin){
			i++;
			onlinePersons.push(data.mobileOnlin[key]); 
		}
//		$("#onlineNum").html("共"+i+"人");
		for(var k=0;k<data.users.user.length;k++){
			onlinePersons.push(data.users.user[k]); 
		}
		currPage = data.page.currPage;
		pageCount = data.page.pageCount;
		var count = parseInt(data.page.count)+i;
		$("#onlinetopNum").html(i+"/"+count);
		showOnlineUser(onlinePersons,currPage,pageCount);
	},'json');
}

function setOnlinesValue(key,orgName,positionName){
	var onlinePersons = new Array();// 保存在线人数
	if(key==undefined){
			key = $("#onlineKey").val();
	}
	if("名称/短号/组织"==$("#onlineKey").val()){
		key="";
	}
	$.post(getPath()+onlineHolder.option.url+"getOnlinePerson",{key:key,orgName:orgName,positionName:positionName},function(data){
		for(var key in data.pcOnlin){
			onlinePersons.push(data.pcOnlin[key]); 
		}
		for(var key in data.mobileOnlin){
			onlinePersons.push(data.mobileOnlin[key]); 
		}
		for(var key in data.users.user){
			onlinePersons.push(data.users.user[key]); 
		}
		showOnlineUser(onlinePersons,data.page.currPage,data.page.pageCount);
	},'json');
	//return onlinePersons;
}
function showOnlineUser(arr,currPage,pageCount){
	$("#firstpane").html('');
	var count = 0;
	loadingDataOnLineFlag = true;
	for(var i = 0;i<arr.length;i++){
		var photo = arr[i].photo;
		if(null==photo || ""==photo){
			photo = getPath()+"/default/style/images/home/man_head.gif";
		}else{
			photo = getPath()+"/images/"+photo;
		}
		var xiax = '<a href="javascript:void(0)" onclick="toUnline(\''+arr[i].id+'\')">下线</a>';
		if(loginName!="管理员"){
			xiax="";
		}
		if(arr[i].userName == "" || arr[i].userName == undefined){
			arr[i].userName = arr[i].name;
			arr[i].loginDate = "离线";
		}else{
			count++;
		}
		var message='<a href="javascript:void(0)" onclick="sendMessage(\''+arr[i].id+'\')">发短信</a>';
		
		var userInfoStr="<div ondblclick='showDetail(\""+arr[i].id+"\",this)' class=\"menu_head\"><dl><dt><div class=\"headimg\"><img src='"+photo+"'/></div></dt><dd><div class=\"name\">"+arr[i].userName+"</div><span class=\"time\">"+arr[i].loginDate+"</dd></dl></span>";
		if(arr[i].loginType=='PC'){
			userInfoStr+="<span class='onlineType'><img src=\""+getPath()+"/default/style/images/home/pc.png\"/></span>";
		}else if(arr[i].loginType != undefined){
			userInfoStr+="<span class='onlineType'><img src=\""+getPath()+"/default/style/images/home/mobile.png\"/></span>";
		}
		$(userInfoStr).appendTo("#firstpane");
	}
//	if(currPage<pageCount){
//		$("<div id='moreUser' style='text-align:center;cursor:pointer'><a href='javascript:moreUser("+currPage+")'>查看更多离线人员</a></div>").appendTo("#firstpane");
//	}
	currPageTemp=currPage;
	if(!(currPage<pageCount)){
		loadingDataOnLineFlag = false;
	}
	$("#firstpane div.menu_head").removeClass("current");
	$("#firstpane div.menu_head").click(function(){
		$(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
		$(this).siblings().removeClass("current");
	});
//	$("#searchNum").html(count);
}

var currPageTemp=1;
function moreUser(currPage){
	$.post(getPath()+onlineHolder.option.url+"getOnlinePerson",{currPage:currPage},function(data){
		loadingDataOnLineFlag=true;
		var arr = new Array();
		for(var k=0;k<data.users.user.length;k++){
			arr.push(data.users.user[k]); 
		}
		
		
		
		for(var i = 0;i<arr.length;i++){
			var photo = arr[i].photo;
			if(null==photo || ""==photo){
				photo = getPath()+"/default/style/images/home/man_head.gif";
			}else{
				photo = getPath()+"/images/"+photo;
			}
			var xiax = '<a href="javascript:void(0)" onclick="toUnline(\''+arr[i].id+'\')">下线</a>';
			if(loginName!="管理员"){
				xiax="";
			}
			if(arr[i].userName == "" || arr[i].userName == undefined){
				arr[i].userName = arr[i].name;
				arr[i].loginDate = "离线";
			}
			var message='<a href="javascript:void(0)" onclick="sendMessage(\''+arr[i].id+'\')">发短信</a>';
			
			var userInfoStr="<div ondblclick='showDetail(\""+arr[i].id+"\",this)' class=\"menu_head\"><dl><dt><div class=\"headimg\"><img src='"+photo+"'/></div></dt><dd><div class=\"name\">"+arr[i].userName+"</div><span class=\"time\">"+arr[i].loginDate+"</dd></dl></span>";
			if(arr[i].loginType=='PC'){
				userInfoStr+="<span class='onlineType'><img src=\""+getPath()+"/default/style/images/home/pc.png\"/></span>";
			}else if(arr[i].loginType != undefined){
				userInfoStr+="<span class='onlineType'><img src=\""+getPath()+"/default/style/images/home/mobile.png\"/></span>";
			}
			
			$(userInfoStr).appendTo("#firstpane");
			
		}
		$("#moreUser").remove();
//		if(data.page.currPage<data.page.pageCount){
//			$("<div id='moreUser' style='text-align:center;cursor:pointer'><a href='javascript:moreUser("+data.page.currPage+")'>查看更多离线人员</a></div>").appendTo("#firstpane");
//		}
		currPageTemp=data.page.currPage;
		if(!(data.page.currPage<data.page.pageCount)){
			loadingDataOnLineFlag=false;
		}
		$("#firstpane div.menu_head").removeClass("current");
		$("#firstpane div.menu_head").click(function(){
			$(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
			$(this).siblings().removeClass("current");
		});
	},'json');
}
var letterDialg;
function showDetail(id,obj){
	if(id==currentId){
		var manager = $.ligerDialog.waitting('不能给自己发私信'); setTimeout(function () { manager.close(); }, 1000);
		return;
	}
	if(letterDialg){
		letterDialg.close();
	}
	letterDialg=$.ligerDialog.open({
		width:620,
		height:510,
		url: getPath()+"/basedata/cchatNew/toDetail?id="+id,
		title:"鼎尖聊聊",
		isResize:false,
		allowClose:true,
		modal:false,
		isDrag:true
	});
}

function showChat(){
	$("#firstpane").load(ctx+"/basedata/cchatNew/priLetterList");
	
	$("#firstpane div.menu_head").removeClass("current");
	$("#firstpane div.menu_head").click(function(){
		$(this).addClass("current").next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
		$(this).siblings().removeClass("current");
	},"html");
}

/**
 * 发短信
 */

var detailMessage;
function sendMessage(id){
	detailMessage=$.ligerDialog.open({height:460,
		width:660,
		url: getPath()+"/cmct/note/topicMessage?personId="+id,
		title:"发送短信",
		isResize:true,
		isDrag:true});
}

function closeDetailMessage(){
	detailMessage.close();
}
/**
 * 个人主页
 * 
 * @param personId
 */
function viewHome(personId){
// art.dialog.open(getPath()+"/blog/microblog/list?method=listData&personId="+personId,
// {
// title:"个人主页",
// id : 'person_zone',
// width :920,
// height :615,
// lock: true,
// close:function(){
// //art.dialog.data('person_pop_id',null);
// }
// });
	$.ligerDialog.open({height:715,width:920,url: getPath()+"/blog/microblog/list?method=listData&personId="+personId,title:"个人主页",isResize:true,isDrag:true});
}
/**
 * 加载岗位列表
 */
var jobWin;
function toJobList(){
// var dlg = art.dialog.open(getPath()+"/basedata/online/toJobList",{
// title:'岗位',
// lock:true,
// width:'700px',
// height:'500px',
// id:"toJobList",
// close:function(){
//			 
// }
// });
	jobWin = $.ligerDialog.open({height:600,width:600,url: getPath()+onlineHolder.option.url+"toJobList",title:"岗位",isResize:true,isDrag:true});
}
function toCloseJobWin(){
	var jobName = $("#jobName").val();
	var key = $("#onlineKey").val();
	
	 if(null!=jobName && ""!=jobName){
		 $("#positionStr").html(jobName).bind("click",function(){
				$(this).html('').removeClass("selectStr");
				searchOnline();
		 }).addClass("selectStr");
	 }
	 setOnlinesValue(key,null,jobName);
//		 if(key=="名称/短号" || key=="" || key==null ||key.trim()==""){
//				if(jobName!=null &&jobName!=''){
//					var searchPersons = new Array();
//					for(var i = 0;i<onlinePersons.length;i++){
//						if(onlinePersons[i].positionName==jobName){
//							searchPersons.push(onlinePersons[i]);
//						}
//					}
//					showOnlineUser(searchPersons);
//				}
//			}else{
//				if(jobName!=null &&jobName!=''){
//					var searchPersons = new Array();
//					for(var i = 0;i<onlinePersons.length;i++){
//						if((onlinePersons[i].userName.indexOf(key)!=-1 || onlinePersons[i].shortNum.indexOf(key)!=-1) && onlinePersons[i].positionName==jobName){
//							searchPersons.push(onlinePersons[i]);
//						}
//					}
//					showOnlineUser(searchPersons);
//				}
//			}
//	 }
	jobWin.close();
}
/**
 * 加载组织列表
 */
var orgWin;
function toOrgList(){
// var dlg = art.dialog.open(getPath()+"/basedata/online/toOrgList",{
// title:'组织架构',
// lock:true,
// width:'800px',
// height:'500px',
// id:"toOrgList",
// close:function(){
//			 
// }
// })
	orgWin = $.ligerDialog.open({height:600,width:800,url: getPath()+onlineHolder.option.url+"toOrgList",title:"组织架构",isResize:true,isDrag:true});
}

function closeOrgWin(){
	var orgName = $("#orgName").val();
	var key = $("#onlineKey").val();
	
	 if(null!=orgName && ""!=orgName){
		 $("#orgStr").html(orgName).bind("click",function(){
				$(this).html('').removeClass("selectStr");
				searchOnline();
		 }).addClass("selectStr");
	 }
	 setOnlinesValue(key,orgName,null);
//		if(key=="名称/短号" || key=="" || key==null ||key.trim()==""){
//			if(orgName!=null &&orgName!=''){
//				var searchPersons = new Array();
//				for(var i = 0;i<onlinePersons.length;i++){
//					if(onlinePersons[i].orgName==orgName){
//						searchPersons.push(onlinePersons[i]);
//					}
//				}
//				showOnlineUser(searchPersons);
//			}
//		}else{
//			if(orgName!=null &&orgName!=''){
//				var searchPersons = new Array();
//				for(var i = 0;i<onlinePersons.length;i++){
//					if((onlinePersons[i].userName.indexOf(key)!=-1 || onlinePersons[i].shortNum.indexOf(key)!=-1) && onlinePersons[i].orgName==orgName){
//						searchPersons.push(onlinePersons[i]);
//					}
//				}
//				showOnlineUser(searchPersons);
//			}
//		}
//	 }
	orgWin.close();
}
/**
 * 设置在线div位置
 * 
 * @param obj
 */
function setDivPosition(obj){
	$("[key=chat]").addClass("hover");
	$("[key=onlineer]").removeClass("hover");
	$.post(getPath()+onlineHolder.option.url+"getOnlineCount",function(data){
		$("#onlinetopNum").html(data.count+"/"+data.totalcount);
		
	},'json');
	
	if($(".floatmenu").css("display")=="none"){
		showChat();
		$(".floatmenu").slideDown();
	}else{
		clearInterval(priTimer);
		$(".floatmenu").slideUp();
	}
	
}

/**
 * 搜索在线人数
 */
function searchOnline(){
	var orgStr = $("#orgStr").html();
	var positionStr = $("#positionStr").html();
	var key = $("#onlineKey").val();
	$("[key=onlineer]").addClass("hover");
	$("[key=chat]").removeClass("hover");
	setOnlinesValue(key,orgStr,positionStr);
}

function setOrgLab(obj){
	if(obj!=""||null!=obj){
		if($("#org")){
			$("#org").html(obj.value);
		}else{
			$('<a id="org" href="javascript:void(0);" id="condition_properType">'+obj.value+'</a>').bind("click",function(){
				$(this).remove();
			}).appendTo("#condition");
		}
		
	}
}

function setPositionLab(obj){
	if(obj!=""||null!=obj){
		
		
	}
}

function toUnline(userId){
	if(confirm("确定强制该用户下线吗？")){
		$.post(getPath()+onlineHolder.option.url+"toUnline",{userId:userId},function(res){
			if(res.STATE=="SUCCESS"){
				getOnlinePersons();
			}
		},'json');
	}
}


var letterWin;
var receiveIds;
sendLetter=function(receiveId,blogFlag){
	receiveIds = receiveId;
	if((currentId==receiveId) && (!blogFlag || (loginUserId==receiveId))){
		alert("不能给自己发私信");
		return
	}else{
		letterWin = $.ligerDialog.open({height:370,width:450,url: getPath()+onlineHolder.option.url+"sendMessage?receiveId="+receiveId,title:"聊聊",isResize:true,isDrag:true});
	}
}

function closeLetterWin(){
	letterWin.close();
}


//window.onbeforeunload = function() {     
////	var n = window.event.screenX - window.screenLeft;     
////	var b = n > document.documentElement.scrollWidth-40;    
////	 if(b && window.event.clientY < 0 || window.event.altKey){ 
////		window.open(getPath()+"/basedata/online/toLogout");
////	} 
//	//window.open(getPath()+"/basedata/online/updateOnline");
//	$.post(getPath()+"/basedata/online/updateOnline",{},function(){
//		
//	});
//}
//window.onload = function(){
//	$.post(getPath()+"/basedata/online/updateOnline2",function(data){
//		getOnlinePersons();
//	},'json');
//}
function close(evt){
	var isIE = document.all?true:false;
	evt = evt?evt:(window.event?window.event:null);
	if(isIE){
		var n = evt.screenX-window.screenLeft;
		var b = n>document.documentElement.scrollWidth-40;
		if(b&&evt.clientY<0||evt.altKey){
			alert("是关闭而非刷新");
			window.open(getPath()+"/logout");
		}else{
			alert("是刷新而非关闭");
		}
	}else{
		if(document.documentElement.scrollWidth!=0){
			alert("是刷新而非关闭");
		}else{
			alert("是关闭而非刷新");
		}
	}
}

function hidefloatmenu(){
	clearInterval(priTimer);
	$(".floatmenu").slideUp();
}
