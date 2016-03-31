$(document).ready(function(){
	
	searchData(1);
	 
	var signBillId =$("#signBillId").val() ; 
	initImage(signBillId);
	initAttach(signBillId);
});

/**
 * 页签单击
 * @param obj
 */
function tabLiClick(obj){
	var objId = obj.id ;
	//移除全部样式
	$("div[class='ds_title']").find("ul:first li").each(function(n,liObj){
		if(liObj.id == objId){
			$(liObj).addClass("hover");
		}else{
			$(liObj).removeClass("hover");
		}
	});
	if("li_myapprove" == objId ){
		$("#div_approve").show();
		$("#div_trunPerson").hide();
	}else if("li_turnother" == objId){
		$("#div_approve").hide();
		$("#div_trunPerson").show();
	}
}

function searchData(page){
	var processId = $("#processId").val();
	if(processId == null || processId == ''){
		return ;
	}
	$("#tab_approveList tr:gt(0)").remove();
	
	if(!page) page = 1;
	 
	var param = {};
	param.currentPage = page;
	if(page == 1){
		param.pageSize = 4;
	}else{
		param.pageSize = 4;
	}
	param.processId = processId;
	
	$.post(getPath()+"/djworkflow/approveList",param,function(data){
		var approveList = data.items ;
		 
		$("#actHisListDiv").html('');
		if(data && approveList){
			var actHistHtml = '';
			for(var i=0;i<approveList.length;i++){
				var actHis = approveList[i];
				var disColor = 'greencolor';
				var processClass = 'process02';
				var disTitle = '同意';
				if(actHis.handleType.value =='APPROVE_PASS'){
					disColor = 'greencolor';
					disTitle = '同意';
					processClass = 'process02';
				}else if(actHis.handleType.value =='TRANSFER'){
					disColor = 'color999';
					disTitle = '转交';
					processClass = 'process04';
				}else{
					disColor = 'redcolor';
					disTitle = '驳回';
					processClass = 'process03';
				}
				var orgName=actHis.dealOrg==null?"":actHis.dealOrg.name;
				if(actHis.handleType.value =='SUBMIT'){
					actHistHtml+="<li class=\"fgbox\"></li> <li class=\"plist\"  title='"+actHis.dealPerson.name+"("+orgName+")于"+actHis.dealDate+"发起流程'>"
					           +"<div class=\"process01 fl\"></div>"
					           +"<div class=\"pbox\">"
					           +" <p class=\"font14\">"+actHis.dealPerson.name+"发起</p>"
							   +" <p>"+orgName+"</p>"
							   +"  <p >"+actHis.dealDate+"</p>"
					           +"  <p>流程发起</p>" 
					           +" </div>"
					           +" </li>";
				}else{
					actHistHtml+= '<li class="fgbox" ></li>';
					actHistHtml+= '   <li class="plist" title="'+actHis.dealPerson.name+'('+orgName+')于'+actHis.dealDate+disTitle+'了该流程，处理意见：'+actHis.dealDescription+'">';
					actHistHtml+= '      <div class="'+processClass+' fl"></div>';
					actHistHtml+= '      <div class="pbox '+disColor+'">';
					actHistHtml+= '         <p class="font14">'+actHis.dealPerson.name+disTitle+'</p>';
					actHistHtml+= '         <p>'+orgName+'</p>';
					actHistHtml+= '          <p >'+actHis.dealDate+'</p>';
					actHistHtml+= '          <p>'+actHis.dealDescription+'</p>';
					actHistHtml+= '      </div>';
					actHistHtml+= '  </li>';
				}
			}
			 
			var total = Math.floor(data.count%data.pageSize==0?data.count/data.pageSize:data.count/data.pageSize+1);
			 
			$("#pagediv").attr("currPage",page);//当前页
			$("#pagediv").attr("total",total);//总页数
			if(page==total && $("#currentNode")){
				$("#currentNode").show();
			}else{
				$("#currentNode").hide();
			}
			if(total && total>1 ){ 
				$("#pagediv").show();
			}else{
				$("#pagediv").hide();
			}
			$("#actHisListDiv").html(actHistHtml);
		}
		
	},'json');
}

function pagGetActHis(id){
	var page = parseInt($("#pagediv").attr("currPage"));//当前页
	var count = parseInt($("#pagediv").attr("total"));//总页数
	if(id=="prev"){
		 
		searchData(page-1);
		$("#next").show();
		if(page==2){
			 $("#prev").hide();
		}else{
			$("#prev").show();
		}
		
	}else{
		
		searchData(page+1);
		$("#prev").show();
		if(page==(count-1)){
			 $("#next").hide();
		}else{
			$("#next").show();
		}
	}
}

function submitApprove(){
	if(!validateSave() || $("#submitApproveButton").attr("isChecked")){
		return ;
	}
	$("#submitApproveButton").attr("isChecked",true);
	var radApprove = $("input[name='radApprove']:checked").val();
	 
	/*$.post(getPath()+"/interflow/sign/saveApprove",{
		signBillId:$("#signBillId").val(),
		approveResult:radApprove,
		approveDesc:$("#approveDesc").val()
	},*/
	$.post(getPath()+"/djworkflow/approve",{
		processId:$("#processId").val(),
		approveResult:radApprove,
		approveDesc:$("#approveDesc").val()
	},
	function(res){
		if(res.STATE == "SUCCESS"){
			if(radApprove == 'APPROVE_PASS'){
				art.dialog.tips("审核成功");
			}else{
				art.dialog.tips("单据已驳回");
			}
			if(art.dialog.data("getSignBillCount") && typeof(art.dialog.data("getSignBillCount"))=='function'){
				art.dialog.data("getSignBillCount")();
			}
			if(art.dialog.data("initMessageCount") && typeof(art.dialog.data("initMessageCount")) == 'function'){
				art.dialog.data("initMessageCount")();
			}
			art.dialog.data("searchApproveData")();
			setTimeout(function(){art.dialog.close();},1000);	
		}else{
			art.dialog.tips("审核失败");
			$("#submitApproveButton").attr("isChecked",false);
		}
	},'json');
}

function validateSave(){
	var flag = true ;
	var radApprove = '' ;
	$("input[name='radApprove']").each(function(i,radObj){
		if(radObj.checked){
			radApprove = $(radObj).val();
		}
	});
	if(radApprove == null || radApprove == ''){
		art.dialog.tips("请选择审批结果");
		flag = false ;
	}else if($("#approveDesc").val() == null || $("#approveDesc").val() == ''){
		art.dialog.tips("请填写审批意见");
		flag = false ;
	}else if($("#approveDesc").val().length > 400){
		art.dialog.tips("审批意见超出400个字符");
		flag = false ;
	}
	return flag ;
}

function resultRender(data){
	var result = data.approveResult ;
	var isTurnStep = data.signStep.isTurnStep ;
	var rtnVal = "" ;
	if(isTurnStep == 1){
		rtnVal =  "转交" ;
	}else if(result == "YES"){
		rtnVal =  "同意" ;
	}else if(result == "NO"){
		rtnVal =  "不同意" ;
	}
	return rtnVal ;
}

function jobRender(data){
	var orgName = data.signStep.orgName ;
	var jobName = data.signStep.jobName ;
	return orgName + "   " + jobName ;
}

function approveDateRender(data){
	var isTurnStep = data.signStep.isTurnStep ;
	var lastUpdateTime = data.signStep.lastUpdateTime ;
	var approveDate = data.approveDate ;
	if(isTurnStep == 1){
		return lastUpdateTime ;
	}
	return approveDate == null ? "" : approveDate ;
}

/**
 * 保存转交
 */
function saveTurnPerson(){
	if($("#saveTurnPersonButton").attr("isChecked")){
		return;
	}
	$("#saveTurnPersonButton").attr("isChecked",true);
	var turnPersonId = $("#turnPersonId").val();
	var turnPersonName = $("#turnPersonName").val();
	var turnDesc = $("#turnDesc").val();
	if(turnPersonId == null || turnPersonId == ''){
		art.dialog.tips("请选择转交人");
	}else{
		$.post(getPath()+"/djworkflow/turnPerson",{
			processId:$("#processId").val(),
			turnPersonId:turnPersonId,
			turnPersonName:turnPersonName,
			turnDesc:turnDesc
		},function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog.tips("转交成功");
				art.dialog.data("searchApproveData")();
				setTimeout(function(){art.dialog.close();},1000);	
			}else{
				art.dialog.tips("转交失败");
				$("#saveTurnPersonButton").attr("isChecked",false);
			}
		},'json');
	}
}

function initImage(id){
	$.post(getPath()+"/basedata/photo/listAllData",{belong:id},function(data){
		imgdata = data;
		if(imgdata.length==0) {$("#noticephotonames").html("");return;}		
		
		var imglist = "";
		for(var i = 0 ; i < imgdata.length ; i++){
			var relPath = imgdata[i].path.replace("size","origin") ;
			var minlPath = imgdata[i].path.replace("size","67X98") ;
			
			imglist += "<img enlarger='"+getPath()+"/images/"+relPath+"' src='"+getPath()+"/images/"+minlPath+"' />";
		}
		$("#noticephotonames").html(imglist);
		//图片预览 enlarger 属性添加
		EnlargerImg.init();
	},'json');
}

function initAttach(id){
	$.post(getPath()+"/basedata/attach/listAllData",{belong:id},function(data){
		data = eval(data);
		if(data.length==0) {$("#noticeattachnames").html("");return;}	
		var html = "";
		for(var i=0;i<data.length;i++){
			if(/^(jpg|png|jpeg|gif)$/.test(data[i].fileType)){
				html +="<p enlarger='"+getPath()+"/attachment/"+data[i].path+"' style='width:300px;color:blue'>"+data[i].name+'<a href="javascript:void(0)" style="float:right" onclick=downFile("'+data[i].id+'","attach") return false>（下载）</a></p>';
			}else{
				html +="<p style='width:300px'>"+data[i].name+'<a href="javascript:void(0)" style="float:right" onclick=downFile("'+data[i].id+'","attach")>（下载）</a></p>';
			}
		}
		if(data==null || data.length==0){
			$("#download_photo").hide();
		}
		$("#noticeattachnames").html(html);
	},'json');
}

function downFile(id,type){
	if(type == "image"){
		$("#fileForm").attr("src",getPath()+"/basedata/photo/downFile?id="+id);
	}else if(type == "attach"){
		$("#fileForm").attr("src",getPath()+"/basedata/attach/downFile?id="+id);
	}
}

function downLoadAtt(){
	$("form").submit();
	
}

function viewProcessChart(processId,id){
	dlg = art.dialog.open(getPath()+"/workflow/task/toProcessView2?VIEWSTATE=EDIT&id=" + processId+"&objId="+id,
			{title:"流程查看",
			lock:true,
			width:800,
			height:420,
			id:"viewProcessChart",
			close:function(){}
	 });
}