$(function(){
	bindEvent();
	$("input[dataType='rdoVal']").each(function(){
		var val = $(this).val()||($(this).attr("defaultValue"));
		var objId = $(this).attr("name")+val;
		if($(objId)){
		 $("#"+objId).attr("checked","checked");
		 if($(this).attr("name")=="timeLimitFlag" || $(this).attr("name")=="questionType"){
		  $("#"+objId).click();
		 }
		}
	});
	$("#questionOptionDiv div[id^='optionDiv']").each(function(i){
	 
		var optionImgId = $("a[id^='optionImg']",this).attr("id");
		var optionImgDivId = $("div[id^='optionImgDiv']",this).attr("id");
		addPhotoButton(optionImgId,optionImgDivId);
	});	
	$("#questionTemp").val($("#question").val());
	getObject();
	EnlargerImg.init({type:"enlararr"});	//放大图片
});

//保存新增数据
function saveAdd(dlg){
	if(!contentEditor.getContentTxt()){
		$("#demandStr").show();
		//art.dialog.tips("内容不能为空");
		contentEditor.focus();
		return ;
	}else{
		$("#demandStr").hide();
	}
	var questionTemp = $("#questionTemp").val();
	if(!questionTemp && !questionTemp.trim()){
		art.dialog.tips("投票题目不能为空");
		if($(".vote-top-link").attr("id")!='voteQuestionTitle'){
			changeDivDis('voteQuestion','main');
			$("#questionTemp").focus();
		}
		return ;
	}
	var flag = true;
	$("#questionOptionDiv input[name='optionName']").each(function(i){
		if(!$(this).val()){
			alert("选项不能为空！");
			flag = false;
			return false;
		}
	});
	
	if(flag){
		currentDialog = dlg;
		saveEdit(dlg);
	}
	return false;
}
function beforesave(dlg){
	
	$("input[dataType='rdoVal']").each(function(){
		//单选框 默认值
		var val = $(this).val();
		if(!val){
			$(this).val($(this).attr("defaultValue"))
		}
	});
	var questionImgs = "";
	$("#questionDiv dl").each(function(){
		if(questionImgs){
			questionImgs += (","+$(this).attr("imgid"));
		}else{
			questionImgs +=  $(this).attr("imgid");	
		}
	});
	$("#questionImgs").val(questionImgs);
	
	var voteOptionsArray = [];
	$("#questionOptionDiv div[id^='optionDiv']").each(function(i){
		var voteOption = {};
		var optionName = $("input[name='optionName']",this).val();
		var optionImgDivObj = $("div[id^='optionImgDiv']",this).get(0);
		var optionImgIds = "";
		$("dl",this).each(function(){
			if(optionImgIds){
				optionImgIds += (","+$(this).attr("imgid"));
			}else{
				optionImgIds +=  $(this).attr("imgid");	
			}
		});
		voteOption.sortNum = (i+1);
		voteOption.optionName = optionName;
		voteOption.optionImgIds = optionImgIds;
		voteOptionsArray.push(voteOption);
	});	
	$("#voteOptionsJSON").val(JSON.stringify(voteOptionsArray));
	$("#question").val($("#questionTemp").val());
	$("#mostNum").val($("#mostNumTemp").val()||0);
}

//事件绑定 
function bindEvent(){
	$("input[type='radio']").bind("click",function(){
		var rdId = $(this).attr("id");
		var rdName = $(this).attr("name");
		var objId = rdName.substring(0,rdName.length-2);
		var rdoVal =  rdId.replace(objId,"");
		$("input[name='"+objId+"']").val(rdoVal);
		if(objId=="timeLimitFlag"){
			if(rdoVal=="N"){
				//无时间限制
				$("#startDate").val("");
				$("#endDate").val("");
				$("td[name='timeLimittd']").hide();
			}else{
				$("td[name='timeLimittd']").show();
			}
		}
		
		if(objId=="questionType"){
			if(rdoVal=="EXCLUSIVE"){
				//无时间限制
				$("#mostNumTemp").val("");
				$("#mostNumTemp").hide();
			}else{
				$("#mostNumTemp").show();
				$("#mostNumTemp").val(3);
			}
		}
		 
	});	
	
	addPhotoButton("questionImg","questionDiv");
}

function changeDivDis(showId,hideId){
	var flag = true;
	if(showId=='voteQuestion'){
		if($("#title").val()==''){
			flag = false;
		}
		if(contentEditor.getContentTxt()==''){
			flag = false;
		}
		if($("#timeLimitFlag").val()=="Y"){
			if($("#startDate").val().replace(" ", "")==''){
				flag = false;
			}
			if($("#endDate").val().replace(" ", "")==''){
				flag = false;
			}
		}
		if(flag){
			$("#"+showId).show();
			$("#"+hideId).hide();
			$("#"+showId+"Title").addClass("vote-top-link").removeClass("vote-top-nolink");
			$("#"+hideId+"Title").addClass("vote-top-nolink").removeClass("vote-top-link");
		}else{
			art.dialog.tips("请先完善主表单的信息");
			contentEditor.focus();
		}
	}else{
		$("#"+showId).show();
		$("#"+hideId).hide();
		$("#"+showId+"Title").addClass("vote-top-link").removeClass("vote-top-nolink");
		$("#"+hideId+"Title").addClass("vote-top-nolink").removeClass("vote-top-link");
	}
}

function addOption(){
	var optionIndex = parseInt($("#questionOptionDiv div[id^='optionDiv']:last").attr("id").replace("optionDiv",""))+1;
	var optionObj = $("#optionDiv").clone(true,true);
	$("div[id^='optionImgDiv']",optionObj.get(0)).attr("id","optionImgDiv"+optionIndex);
	$("a[id^='optionImg']",optionObj.get(0)).attr("id","optionImg"+optionIndex);
	$("a[optionIndex]",optionObj.get(0)).attr("optionIndex",optionIndex);
	optionObj.attr("id","optionDiv"+optionIndex);
	optionObj.css("display","block");
	optionObj.appendTo($("#questionOptionDiv"));
	addPhotoButton("optionImg"+optionIndex,"optionImgDiv"+optionIndex);
}

function delOption(obj){
	var optionIndex = $(obj).attr("optionIndex");
	$("#optionDiv"+optionIndex).remove();
}


/**
 * id 点击触发上传事件的按钮ID
 * parentdiv 附件上传后显示所在的div
 */
addPhotoButton=function(id,parentdiv){
 
	var url =  '/basedata/attach/upload?direct=vote';
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	showload();    	
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
        },
        onComplete: function(file, json){  
        	hideload();
        	//$("#loading").hide();
        	if(json.STATE=='FAIL'){
        		alert(json.MSG);
        		return;
        	}else{
	            // 在输入框显示url，并触发url文本框的onchange事件，以便预览图片
	           var url=json.path;
	           var id = json.id;
	           var name = json.fileName;
	            
	           var pdiv = $("<dl  id='"+json.id+"div' imgid='"+json.id+"'><dt><img enlarger='"+base+"/attachment/"+url+
	        		   "' src='"+base+"/attachment/"+url+"'  /></dt><dd><a href='javascript:void(0)' onclick=delphoto('"+json.id+"')>删除</a></dd></dl>");
	           $("#"+parentdiv).append(pdiv);
	          
	           EnlargerImg.init({type:"enlararr"});	//放大图片
	           art.dialog({
	        	   content:json.MSG,
	        	   time:1,
	        	   close:function(){
	        	   return true;
	        	   },
	        	   width:200
	        	   });
	        }
        }
    });
}

function delphoto(id){
	$("#"+id+"div").remove();
	var url = "/basedata/attach/delete";
	$.post(getPath()+url,{id:id},function(json){
		json = eval("("+json+")");
		if(json.STATE=='FAIL'){
    		alert(json.MSG);
    		return;
    	}else{
    		  art.dialog({
           	   content:json.MSG,
           	   time:1,
           	   close:function(){
           	   return true;
           	   },
           	   width:200
           	   });
    	}
	});
	
}


function getObject(){
	var val = $("input[name='attenderObjectTypeRd']:checked").val();
	var investigateId = $("#dataId").val();
	if(val!="COMPANY"){
		$("#partObject").show();
		if(val=="ORG"){
			$("#org").attr("dataPickerUrl",base+"/basedata/org/orgDataPicker?multi=true");
		}else if(val=="JOB"){
			$("#org").attr("dataPickerUrl",base+"/interflow/vote/jobDataPicker?multi=true&investigateId="+investigateId);
		}else if(val=="PERSON"){
			$("#org").attr("dataPickerUrl",base+"/basedata/person/dataPicker?multi=true&type=yes");
		}
	}else{
		$("#partObject").hide();
	}
}
