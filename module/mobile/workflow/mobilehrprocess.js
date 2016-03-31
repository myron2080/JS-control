$(document).ready(function(){
	
	inithistory();
	initnav();	
	
	$("#billcontentdiv").load(getPath()+"/"+viewhtml);
	
});

function inithistory(){
	$.post(getPath()+"/workflow/auditHistory/listData?process="+processId,{},function(data){
		var rdata = data.items;
		var html = '';
		$("div.Commenttitle").show();
		for(var i=0;i<rdata.length;i++){
			var item = rdata[i];
			var stclass = '';
			var handlType = '提交';
			if(item.status=='true'){ 
				handlType = '同意';
				stclass = 'colorgreen';}
			else if(item.status=='false') { 
				handlType ='不同意';
				stclass = 'colorred';}
			else if(item.status=='REFERED'){ 
				handlType ='转交';
				stclass = 'colororange';}
			
			html+='<dl>';
			html+='<dt><img src="'+(item.person.photo?(getPath()+'/images/'+item.person.photo):(getPath()+'/default/style/images/mobile/man.jpg'))+'" width="48" height="48" alt="" /></dt>';
			html+='<dd><div class="page"><h3><span class="pageDate">'+item.auditTime+'</span>'+(item.person?item.person.name:"")+'</h3>【'+handlType+'】	'+(item.description?item.description:'无')+'</div></dd>';
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

function savehrprocess(){
	var radApprove = $("#statusdiv").find('a.wx-toplist01').attr("key");
	var approveResult = "true";
	if(radApprove=='NO'){
		approveResult = "false";
	}
	$.post(getPath()+"/workflow/task/complete",{
		id:$("#taskId").val(),
		status:approveResult,
		description:$("#approveDesc").val()
	},function(data){
		if(data.STATE == "SUCCESS"){
			if(approveResult == 'true'){
				commonTipShow("审核成功",1000);
			}else{
				commonTipShow("驳回成功",1000);
			}
			window.location.reload();
		}else{
			commonTipShow("审核失败",1000);
		}
	},'json');
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