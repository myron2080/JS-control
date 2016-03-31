$(document).on("mobileinit", function() {
	  $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
	 
	  
}).ready(function(){
	initSignData();
	inithistory();
	initnav();	
	$("#myPopupDiv").popup();
});

function initSignData(){
	//会签单据 判断如果是会签单据则下面形式，如果不是会签单则走其他展现形式

	if(processtype=='COUNTERSIGN'){
	
	$.post(getPath()+"/interflow/sign/getOneDataById",{id:objId},function(data){
		
		var html = '';
//		html +='<table width="100%" border="0" cellspacing="0" cellpadding="0">';
//		html +='<tr>';
//		html +='<td height="30" colspan="3" align="left" style="font-weight:bold;" class="font18 lheight">'+data.title+'</td>';
//		html +='</tr>';
//		html +='<tr>';
//		html +='  <td width="30%" height="30" class="font14 color666">'+data.applyType.name+'</td>';
//		html +='<td width="40%" height="30" align="center" class="font14 color666">'+data.orgName+' '+data.personName+'</td>';
//		html +='  <td width="30%" height="30" align="right" class="font14 color666">'+(data.applyDate?((data.applyDate.year+1900)+'-'+(data.applyDate.month+1)+'-'+(data.applyDate.date)):'')+'</td>';
//		html +='  </tr>';
//		html +='  <tr>';
//		html +='   <td height="30" colspan="3" class="font16 lheight">';
//      html += data.content;
//		html +='   </td>';
//		html +=' </tr>';
//		html +='</table>';
		
		
		html+='<dl class="workshow3"><dt><h3>'+data.title+'</h3>';
		html+=data.content+'</dt>';
		//html+='<dd>制单日期：'+(data.applyDate?((data.applyDate.year+1900)+'-'+(data.applyDate.month+1)+'-'+(data.applyDate.date)):'')+' '+data.applyDate.hours+':'+data.applyDate.minutes+'</dd>';	
		html+='</dl>';
		$("#billcontentdiv").html(html);
		
		var imghtml = "";
		$.post(getPath()+"/basedata/photo/listData",{belong:objId},function(data){
			var rdata = data.items;
			if(rdata.length>0){
				for(var i=0;i<rdata.length;i++){
					var item = rdata[i];
					imghtml += '<div id="showImage_'+i+'"><b><img src="'+getPath()+'/images/'+(item.path?item.path.replace('size','origin'):'')+'"/></b></div>';
				}
				$("div.swipe-wrap").html(imghtml);
				
				var elem = document.getElementById('mySwipe');
					window.mySwipe = $('#mySwipe').Swipe().data('Swipe');
					window.mySwipe = Swipe(elem, {
					   startSlide: 0,
					   auto: 3000
				});
			}
		},'json');
		
		
		$.post(getPath()+"/basedata/attach/listAllData",{belong:objId},function(data){
			data = eval(data);
			if(data.length==0) {$("#noticeattachnames").html("");return;}	
			var html = "";
			for(var i=0;i<data.length;i++){
			
					html +="<p style='padding:5px;width:100%;'>"+'<a target="_blank" href="'+getPath()+"/attachment/"+data[i].path+'">'+data[i].name+'</a></p>';
				
			}
			
			$("#noticeattachnames").html(html);
		},'json');
		
	},'json');
	
	}else{
		$("#billcontentdiv").load(getPath()+"/"+viewhtml);
	}
}

function inithistory(){
	$.post(getPath()+"/djworkflow/approveList?processId="+processId,{},function(data){
		var rdata = data.items;
		var html = '';
		$("div.Commenttitle").show();
		for(var i=0;i<rdata.length;i++){
			var item = rdata[i];
			var stclass = '';
			var handlType = '提交';
			if(item.handleType.value=='APPROVE_PASS'){ 
				handlType = '同意';
				stclass = 'colorgreen';}
			else if(item.handleType.value=='APPROVE_REJECT') { 
				handlType ='不同意';
				stclass = 'colorred';}
			else if(item.handleType.value=='TRANSFER'){ 
				handlType ='转交';
				stclass = 'colororange';}
			
			html+='<dl>';
			html+='<dt><img src="'+(item.dealPerson.photo?(getPath()+'/images/'+item.dealPerson.photo):(getPath()+'/default/style/images/mobile/man.jpg'))+'" width="48" height="48" alt="" /></dt>';
			html+='<dd><div class="page"><h3><span class="pageDate">'+item.dealDate+'</span>'+(item.dealPerson?item.dealPerson.name:"")+'</h3>【'+handlType+'】	'+(item.dealDescription?item.dealDescription:'无')+'</div></dd>';
			html+='</dl>';
			
		}
		
		if(rdata.length==0) {
			
			$("div.Commenttitle").hide();
		}
	  $("div.workspage").append(html);
	},'json');
}

function initnav(){
	$('#statusdiv').find("a[key]").click(function(){
		$('#statusdiv').find("a[key]").removeClass("wx-toplist01");
		$(this).addClass("wx-toplist01");
		var key = $(this).attr('key');
		if(key=='REFER'){
			$("#appdiv").hide();
			$("#referdiv").show();
		}else{
			$("#referdiv").hide();
			$("#appdiv").show();
		}
	});
}

$("[id^='showImage_']").bind("click",function(){
	$('#myDialog').html($(this).html());
	$.mobile.changePage( "#myDialog", { role: "dialog" } );
});


function saveApprove(){
	//$('#contenthead").html();
	//$.mobile.changePage( "#dialogPage", { role: "dialog" } );
	//setTimeout(function(){
	//	$("#dialogPage").dialog('close');
	//},1000);
	
	//$( "#myPopupDiv" ).popup( "open" );
	
	$.mobile.loading( 'show', {
		  text: "",
		  textVisible: false,
		  theme: 'b',
		  textonly: false,
		  html: ''
		  });
	var radApprove = $("#statusdiv").find('.wx-toplist01').attr("key");
	var approveResult = "APPROVE_PASS";
	if(radApprove=='NO'){
		approveResult = "APPROVE_REJECT";
	}
	if(radApprove=='YES'||radApprove=='NO' ){
		
		$.post(getPath()+"/djworkflow/approve",{
			processId:processId,
			approveResult:approveResult,
			approveDesc:$("#approveDesc").val()
		},function(res){
			
			$.mobile.loading( "hide" );
			
			if(res.STATE == "SUCCESS"){
				//审批通过后将审批栏隐藏
				$('.wx-top').hide();
				
				if(radApprove == 'YES'){
					//$("#myPopupDiv").find("span").html('审批通过会签单');
					commonTipShow("审批通过会签单",1000);
					//mobiletextips("myPopupDiv");			
				}else{
					//$("#myPopupDiv").find("span").html('驳回会签单');
					//mobiletextips("myPopupDiv");
					commonTipShow("驳回会签单",1000);
				}
				
				//parent.queryData(1);
				//parent.backListPage();
				window.location.reload();
				//inithistory();
			}else{
				//$("#myPopupDiv").find("span").html('审核失败');
				//mobiletextips("myPopupDiv");
				commonTipShow("审核失败",1000);
				//parent.queryData(1);
				//parent.backListPage(); 
			}
		},'json');
	}else if(radApprove=='REFER'){
		var signBillId = objId;
		var turnPersonId = $("#referid").val();
		var turnPersonName = $("#refername").val();
		if(turnPersonId == null || turnPersonId == ''){
			/*$("#myPopupDiv").find("span").html('请选择转交人');
			mobiletextips("myPopupDiv");*/
			commonTipShow("请选择转交人",1000);
		}else{
			
			$.post(getPath()+"/djworkflow/turnPerson",{
				processId:processId,
				turnPersonId:turnPersonId,
				turnPersonName:turnPersonName,
				turnDesc:$("#approveDesc").val()
			},function(res){
				
				$.mobile.loading( "hide" );
				
				if(res.STATE == "SUCCESS"){
					/*$("#myPopupDiv").find("span").html('转交成功');
					mobiletextips("myPopupDiv");*/
					commonTipShow("转交成功",1500);
					//审批通过后将审批栏隐藏
					$('.wx-top').hide();
					 parent.queryData(1);
					 parent.backListPage(); 
					//inithistory();
				}else{
					commonTipShow("转交失败",1500);
					/*$("#myPopupDiv").find("span").html('转交失败');
					mobiletextips("myPopupDiv");*/
					parent.queryData(1);
					parent.backListPage(); 
				}
			},'json');
		}
	}
	
}
function chooseperson(obj){
	pagesearch(1,1);
	$.mobile.changePage( "#common_person_page", { role: "page" } );
}
function chooseone(obj){
	$.mobile.changePage( "#editPage", { role: "page" } );
	$("#referid").val($(obj).attr('pid'));
	$("#refername").val($(obj).attr('pname'));
	$("#refertext").html($(obj).attr('pname')+'  '+'<b style="color:red;" onclick="clearchoose(event)">清</b>');
}
// 自定义人员选择器的查询参数
function setChoosePersonParam(para){}
function clearchoose(event){
	$("#referid").val('');
	$("#refertext").html('选择转交人');
	event.stopPropagation();	
}
function backlist(){
	window.location.href = getPath()+'/weixinapi/mobile/workflow/list?from='+$("#fromsource").val();
}