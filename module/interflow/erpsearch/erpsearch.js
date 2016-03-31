$(document).ready(function(){
	$("li[key='cluesData']").bind("click",function(){
		var id = $(this).attr("id");
		if(id && id != null && id != ''){
			showFollowData(id);
		}
		
	});
});
var ErpSearch = {
		//初始化页面
		initPage:function(){
			
			//关键字输入框提醒效果
			eventFun("#keyword");
			//关键字回车查询
			inputEnterSearch('keyword',ErpSearch.queryData);
			
			ErpSearch.initQuery() ;
		},
		//外部查询关键字有带入，则初始查询
		initQuery:function(sKey){
			var searchKey = sKey || $("#searchKey").val();
			if(searchKey!=null && searchKey!=''){
				//清空带入值
				$("#searchKey").val("");
				$("#keyword").val(searchKey);
				//查询
				ErpSearch.queryData();
			}
		},
		//查询数据
		queryData:function(){
			var keyword = $("#keyword").val();
			var currentPage = $("#currentPage").val();
			if(keyword == $("#keyword").attr("defaultValue")){
				keyword = "" ;
			}
			if(keyword !=null && keyword!=''){
				Loading.init(null, "正在搜索 "+ keyword + " 相关数据...")
				$.post(getPath()+"/interflow/erpsearch/queryData",{keyword:keyword},function(rtnData){
					$("#s_count").text(rtnData.count);
					
					ErpSearch.buildLxr(rtnData.lxrList);
					ErpSearch.buildPerson(rtnData.personList);
					ErpSearch.buildGongGao(rtnData.gonggaoList);
					ErpSearch.buildZhidu(rtnData.zhiduList);
					ErpSearch.buildZhishi(rtnData.zhishiList);
					if(keyword.length == 11){
					}
//					ErpSearch.buildCluesList(rtnData.cluesList,rtnData.cluesCount);
					
					
					Loading.close();
					
					//重点渲染关键字
					$("#div_dataList").textSearch(keyword);
					
					//人员头像悬浮
					personPop.init() ;
					
				},'json');
			}
		},
		//构建相关联系人显示
		buildLxr:function(lxrList){
			if(lxrList == null || lxrList.length == 0){
				$("#none_lxr").show();
				$("#infoBody_lxr").hide();
				$("#f_lxr_count").text(0);
				$("#infoBody_lxr div[id='db_lxr']").remove();
			}else{
				$("#infoBody_lxr div[id='db_lxr']").remove();
				var lxrCount = 0 ;
				for(var i = 0 ; i < lxrList.length ;i ++){
					var cloneObj = $("#clone_lxr").clone();
					cloneObj.show();
					cloneObj.attr("id","db_lxr");
					
					$("#dbid_lxr",cloneObj).val(lxrList[i].id );
					$("#s_lxr_name",cloneObj).text(lxrList[i].name );
					$("#s_lxr_phone",cloneObj).text(lxrList[i].mobile);
					$("#s_lxr_tel",cloneObj).text(lxrList[i].tel);
					$("#s_lxr_duanhao",cloneObj).text(lxrList[i].shortnum);
					$("#s_lxr_qq",cloneObj).text(lxrList[i].qq);
					$("#s_lxr_email",cloneObj).text(lxrList[i].email);
					$("#s_lxr_remark",cloneObj).text(lxrList[i].remark);
					$("#infoBody_lxr").append(cloneObj);
					lxrCount ++ ;
				}
				$("#f_lxr_count").text(lxrCount);
				$("#none_lxr").hide();
				$("#infoBody_lxr").show();
			}
		},
		//构建相关人员显示
		buildPerson:function(personList){
			if(personList == null || personList.length == 0){
				$("#none_person").show();
				$("#infoBody_person").hide();
				$("#f_person_count").text(0);
				$("#infoBody_person div[id='db_person']").remove();
			}else{
				$("#infoBody_person div[id='db_person']").remove();
				var defaultPhoto = getPath()+"/default/style/images/home/man_head.gif";
				var personCount = 0 ;
				for(var i = 0 ; i < personList.length ;i ++){
					var cloneObj = $("#clone_person").clone();
					cloneObj.show();
					cloneObj.attr("id","db_person");
					
					$("#dbid_person",cloneObj).val(personList[i].id );
					if(personList[i].photo == null || personList[i].photo == ''){
						$("#img_head",cloneObj).attr("src",defaultPhoto);
					}else{
						$("#img_head",cloneObj).attr("src",getPath()+"/images/"+personList[i].photo);
//						$("#img_head",cloneObj).attr("onerror",defaultPhoto);
					}
					$("#div_person_pop",cloneObj).attr("person-pop",personList[i].number);
					$("#div_person_pop",cloneObj).attr("pop-name",personList[i].name);
					$("#s_person_name",cloneObj).text(personList[i].name );
					$("#f_person_sex",cloneObj).text(personList[i].sex == "MAN" ? "男" : "女");
					$("#f_person_orgName",cloneObj).text(personList[i].org == null ? "" : personList[i].org.name);
					if(personList[i].personPosition == null || personList[i].personPosition.position == null ){
						$("#f_person_positionName",cloneObj).text("");
					}else{
						$("#f_person_positionName",cloneObj).text("-"+personList[i].personPosition.position.name);
					}
					$("#f_person_phone",cloneObj).text(personList[i].phone);
					$("#f_person_tel",cloneObj).text(personList[i].workPhone);
					$("#f_person_duanhao",cloneObj).text(personList[i].shortNumber);
					$("#f_person_qq",cloneObj).text(personList[i].qq);
					$("#f_person_email",cloneObj).text(personList[i].email);
					$("#infoBody_person").append(cloneObj);
					personCount ++ ;
				}
				$("#f_person_count").text(personCount);
				$("#none_person").hide();
				$("#infoBody_person").show();
			}
		},
		//构建相关公告显示
		buildGongGao:function(gonggaoList){
			if(gonggaoList == null || gonggaoList.length == 0){
				$("#none_ggao").show();
				$("#infoBody_ggao").hide();
				$("#f_ggao_count").text(0);
				$("#infoBody_ggao div[id='db_ggao']").remove();
			}else{
				$("#infoBody_ggao div[id='db_ggao']").remove();
				var ggaoCount = 0 ;
				for(var i = 0 ; i < gonggaoList.length ;i ++){
					var cloneObj = $("#clone_ggao").clone();
					cloneObj.show();
					cloneObj.attr("id","db_ggao");
					if(i == 0){
						cloneObj.addClass("mt20");
					}
					$("#a_ggao_view",cloneObj).attr("keyId",gonggaoList[i].id);
					$("#s_ggao_title",cloneObj).text(gonggaoList[i].title );
					$("#s_ggao_content",cloneObj).html(ErpSearch.subContent(gonggaoList[i].content,200));
					$("#f_ggao_date",cloneObj).text(gonggaoList[i].createDate);
					$("#f_ggao_name",cloneObj).text(gonggaoList[i].creator.name);
					$("#f_ggao_dj",cloneObj).text(gonggaoList[i].clickCount);
					$("#f_ggao_pl",cloneObj).text(gonggaoList[i].replyCount);
					
					$("#infoBody_ggao").append(cloneObj);
					ggaoCount ++ ;
				}
				$("#f_ggao_count").text(ggaoCount);
				$("#none_ggao").hide();
				$("#infoBody_ggao").show();
			}
		},
		//构建相关制度显示
		buildZhidu:function(zhiduList){
			if(zhiduList == null || zhiduList.length == 0){
				$("#none_zhidu").show();
				$("#infoBody_zhidu").hide();
				$("#f_zhidu_count").text(0);
				$("#infoBody_zhidu div[id='db_zhidu']").remove();
			}else{
				$("#infoBody_zhidu div[id='db_zhidu']").remove();
				var zhiduCount = 0 ;
				for(var i = 0 ; i < zhiduList.length ;i ++){
					var cloneObj = $("#clone_zhidu").clone();
					cloneObj.show();
					cloneObj.attr("id","db_zhidu");
					if(i == 0){
						cloneObj.addClass("mt20");
					}
					$("#a_zhidu_view",cloneObj).attr("keyId",zhiduList[i].id);
					$("#s_zhidu_title",cloneObj).text(zhiduList[i].title );
					$("#s_zhidu_content",cloneObj).html(ErpSearch.subContent(zhiduList[i].content,200));
					$("#f_zhidu_date",cloneObj).text(zhiduList[i].createDate);
					$("#f_zhidu_name",cloneObj).text(zhiduList[i].creator.name);
					$("#f_zhidu_dj",cloneObj).text(zhiduList[i].clickCount);
					$("#f_zhidu_pl",cloneObj).text(zhiduList[i].replyCount);
					
					$("#infoBody_zhidu").append(cloneObj);
					zhiduCount ++ ;
				}
				$("#f_zhidu_count").text(zhiduCount);
				$("#none_zhidu").hide();
				$("#infoBody_zhidu").show();
			}
		},
		//构建相关知识显示
		buildZhishi:function(zhishiList){
			if(zhishiList == null || zhishiList.length == 0){
				$("#none_zhishi").show();
				$("#infoBody_zhishi").hide();
				$("#f_zhishi_count").text(0);
				$("#infoBody_zhishi div[id='db_zhishi']").remove();
			}else{
				$("#infoBody_zhishi div[id='db_zhishi']").remove();
				var zhishiCount = 0 ;
				for(var i = 0 ; i < zhishiList.length ;i ++){
					var cloneObj = $("#clone_zhishi").clone();
					cloneObj.show();
					cloneObj.attr("id","db_zhishi");
					if(i == 0){
						cloneObj.addClass("mt20");
					}
					$("#a_zhishi_view",cloneObj).attr("keyId",zhishiList[i].id);
					$("#f_zhishi_title",cloneObj).text(zhishiList[i].name);
					$("#f_zhishi_leibie",cloneObj).text(zhishiList[i].partName);
					$("#s_zhishi_content",cloneObj).html(ErpSearch.subContent(zhishiList[i].content,200));
					$("#f_zhishi_date",cloneObj).text(zhishiList[i].createTime);
					$("#f_zhishi_name",cloneObj).text(zhishiList[i].creator.name);
					$("#f_zhishi_fj",cloneObj).text(zhishiList[i].attachCount);
					$("#f_zhishi_dj",cloneObj).text(zhishiList[i].clickCount);
					$("#f_zhishi_pl",cloneObj).text(zhishiList[i].replyCount);
					$("#s_zhishi_score",cloneObj).text(zhishiList[i].score);
					
					$("#infoBody_zhishi").append(cloneObj);
					zhishiCount ++ ;
				}
				$("#f_zhishi_count").text(zhishiCount);
				$("#none_zhishi").hide();
				$("#infoBody_zhishi").show();
			}
		},

		//构建线索管理
		buildCluesList:function(cluesList,count){
			$("#cluesList").html('');
			if(cluesList == null || cluesList.length == 0){
				$("#cluesList_div").hide();
				$("#none_xs").show();
				$("#cluesCount").text(0);
			}else{
				var cluesCount = 0 ;
				var html = "";
				for(var i = 0 ; i < cluesList.length ;i ++){
					html +='<li id="' + cluesList[i].qq + '" key="cluesData" style="cursor: pointer;" onclick="showFollowData(\'' + cluesList[i].qq + '\',\'' + cluesList[i].mobile + '\',\'' + cluesList[i].remark + '\')">'; 
					html +='<span class="xsbox-icon"></span>';
					if(cluesList[i].remark != null && cluesList[i].remark != ''){
						html +='<span class="xsbox-font" style="cursor: pointer;">' + cluesList[i].mobile + '<em>（' + cluesList[i].remark + '）</em> </span>';
					}else{
						html +='<span class="xsbox-font" style="cursor: pointer;">' + cluesList[i].mobile + '</span>';
					}
					html +='</li>';
					cluesCount ++ ;
				}
				$("#cluesCount").text(cluesCount);
				if(count > 30 ){
					$("#searchMore").show();
				}
				$("#cluesList").append(html);
				$("#cluesList_div").show();
				$("#none_xs").hide();
			}
		},
		//查看公告
		viewGonggao:function(obj){
			var id = $(obj).attr("keyId");
			if(id == null || id == ''){
				art.dialog.tips("数据丢失，无法打开");
			}else{
				art.dialog.open(getPath()+'/interflow/notice/selectById?id='+id,
						{title:"查看公告",
						lock:true,
						width:830,
						height:450,
						id:'NOTICE-VIEW',
						button:[{name:'关闭'}]}
				);
			}
		},
		//查看制度
		viewInstitution:function(obj){
			var id = $(obj).attr("keyId");
			if(id == null || id == ''){
				art.dialog.tips("数据丢失，无法打开");
			}else{
				art.dialog.open(getPath()+'/interflow/institution/selectById?id='+id,
						{title:"查看制度发文",
						lock:true,
						width:830,
						height:450,
						id:'NOTICE-VIEW',
						button:[{name:'关闭'}]}
				);
			}
		},
		//查看知识
		viewKnow:function(obj){
			var id = $(obj).attr("keyId");
			if(id == null || id == ''){
				art.dialog.tips("数据丢失，无法打开");
			}else{
				art.dialog.open(getPath() +"/interflow/know/view?id="+id,{
					id : "know_view",
					title : '知识详情',
					background : '#333',
					width : 830,
					height : 550,
					lock : true	
				});
			}
		},
		//打电话
		dialPhone:function(obj){
			var tabObj = $(obj).parents("table") ;
			var phone = $("td[id$='_phone']",tabObj).text();
			var name =  $("span[id$='_name']",tabObj).text();
			CallOut.show(name, phone);
		},
		//发短信
		sendMsg:function(obj){
			var divObj = $(obj).parents("div[id^='db_']") ;
			var personId = $("input[id^='dbid_']",divObj).val();
			$.ligerDialog.open({height:460,
				width:660,
				url: getPath()+"/cmct/note/topicMessage?personId="+personId,
				title:"发送短信",
				isResize:true,
				isDrag:true}
			);
		},
		//发邮件
		sendEmail:function(obj){
			var openUrl = "" ;
			var mailsid = $("#mailsid").val();
			if(mailsid == null || mailsid == ""){
				openUrl = ctx + "/qqmail/ssologin" ;
			}else{
				openUrl = ctx + "/qqmail/ssologin" ;
				//mailsid = "kuWd1Uh8iFn5AWg6,7";
				//发件箱URL
				//openUrl = "http://exmail.qq.com/cgi-bin/frame_html?sid="+mailsid+"&r=7261b7c28cee0701efbe8d33e6443b92" ;
				//openUrl = "http://exmail.qq.com/cgi-bin/frame_html?t=newwin_frame&sid="+mailsid+"&url=%2Fcgi-bin%2Freadtemplate%3Ft%3Dcompose%26s%3Dcnew";
			}
			//alert(openUrl);
			top.addTabItem("tab_mail", openUrl , "邮件发送");
			//art.dialog.tips("暂未开放邮箱");
		},
		//发私信
		sendPrivateLetter:function(obj){
			var divObj = $(obj).parents("div[id^='db_']") ;
			var personId = $("input[id^='dbid_']",divObj).val();
			if(personId == null || personId == ''){
				art.dialog.tips("数据丢失，未能打开");
			}else{
				var dlg = art.dialog.open(getPath()+"/basedata/cchatNew/toDetail?id="+personId,{
					id : 'detail',
					title:"鼎尖聊聊",
					width : 620,
					height : 510,
					lock:true
				});
			}
		},
		//超过len长度，截取文本内容，len 默认100
		subContent:function(content,len){
			len = len || 100 ;
			var conObj = $(content);
			var conText = conObj.text();
			if(conText && conText.length > len ){
				return conText.substring(0,len) + "......" ;
			}
			return conText ;
		}
}

function searchMore(){
	var keyword = $("#keyword").val();
	var currentPage = parseInt($("#currentPage").val());
	showload("lodingStatus");
	$.post(getPath()+'/interflow/erpsearch/queryMoreClues',{keyword:keyword,currentPage: (currentPage +1)},function(data){
		var cluesCount = data.cluesCount ;
		var cluesList = data.cluesList;
		var html = "";
		for(var i = 0 ; i < cluesList.length ;i ++){
			html +='<li id="' + cluesList[i].qq + '" key="cluesData" onclick="showFollowData(\'' + cluesList[i].qq + '\',\'' + cluesList[i].mobile + '\',\'' + cluesList[i].remark + '\')">'; 
			html+='<span class="xsbox-icon"></span>';
			var keyIdx = keyword.length;
			if(cluesList[i].remark != null && cluesList[i].remark != ''){
				html +='<span class="xsbox-font" style="cursor: pointer;"><span style="color: red;" rel="mark">' + cluesList[i].mobile.substr(0,keyIdx) + '</span>' + cluesList[i].mobile.substr(keyIdx) + '<em>（' + cluesList[i].remark + '）</em> </span>';
			}else{
				html +='<span class="xsbox-font" style="cursor: pointer;"><span style="color: red;" rel="mark">' + cluesList[i].mobile.substr(0,keyIdx) + '</span>' + cluesList[i].mobile.substr(keyIdx) + '</span>';
			}
			html +='</li>';
			cluesCount ++ ;
		}
		$("#cluesCount").text(cluesCount);
		if(cluesCount > (currentPage + 1)*30){
			$("#searchMore").show();
		}else{
			$("#searchMore").hide();
		}
		$("#cluesList").append(html);
		$("#currentPage").val(parseInt($("#currentPage").val()) +1);
		hideload();
	},'json');
}


function showFollowData(id,phone,addr){
	art.dialog.open(getPath()+'/interflow/erpsearch/viewFollow?id='+id + "&phone=" + phone + "&addr=" + addr,{
		id : id,
		title : '线索展示',
		background : '#333',
		width : 820,
		height : 525,
		lock : true
	});
}