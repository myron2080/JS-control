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
	
	$("#questionsDiv div[id^='questionDiv']").each(function(){
		var questionImgId = $("a[id^='questionImg']",this).attr("id");
		var questionImgDivId = $("div[id^='questionImgDiv']",this).attr("id");
		addPhotoButton(questionImgId,questionImgDivId);
		
		$("div[id^='optionDiv']",this).each(function(i){
			 
			var optionImgId = $("a[id^='optionImg']",this).attr("id");
			var optionImgDivId = $("div[id^='optionImgDiv']",this).attr("id");
			addPhotoButton(optionImgId,optionImgDivId);
		});	
	});
	
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
	var flag = true;
	if($("#questionsDiv div[id^='questionDiv']").length<1){
		art.dialog.tips("问卷题目不能为空");
		changeDivDis('questions','main');
		return ;
	}
	 
	$("#questionsDiv div[id^='questionDiv']").each(function(){
		var questionObj =  $("textarea[name='question']",this);
		var question =  questionObj.val();
		var questionCount =  $(this).attr("id").replace("questionDiv","");
		if(!question){
			alert("第"+questionCount+"题，题目不能为空！");
			flag = false;
			return false;
		}
		 
		if($(this).attr("questionType")=='EXCLUSIVE' || $(this).attr("questionType")=='MULTIPLE'){
			$("div[id^='optionDiv']",this).each(function(i){
				
				var optionObj =  $("input[name='optionName']",this);
				if(!optionObj.val()){
					alert("第"+questionCount+"题，选项值不能为空！");
					flag = false;
					return false;
				}
			});	
			if(!flag){
				 
				return false;
			}
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
	
	var questionsArray = [];
	$("#questionsDiv div[id^='questionDiv']").each(function(){
		 var question = {};
		 question.id = $(this).attr("questionId");
		 question.question = $("textarea[name='question']",this).val();
		 question.questionType = $(this).attr("questionType");
		 question.mostNum = $("select[name='mostNum']",this).val();
		 var questionIndex = $(this).attr("id").replace("questionDiv","");
		 var questionImgIds = "";
			$("#questionImgDiv"+questionIndex+" dl").each(function(){
				if(questionImgIds){
					questionImgIds += (","+$(this).attr("imgid"));
				}else{
					questionImgIds +=  $(this).attr("imgid");	
				}
			});
			 
		question.questionImgIds = questionImgIds;
		var questionOptionArray = [];
		$("#questionOptionDiv"+questionIndex+" div[id^='optionDiv']").each(function(i){
			var questionOption = {};
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
			questionOption.sortNum = (i+1);
			questionOption.optionName = optionName;
			questionOption.optionImgIds = optionImgIds;
			questionOptionArray.push(questionOption);
		});	
		question.questionOptionList = questionOptionArray;
		questionsArray.push(question);
	});
	$("#questionsJSON").val(JSON.stringify(questionsArray));
	 
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
				$("#mostNum").val("");
				$("#mostNum").hide();
			}else{
				$("#mostNum").show();
			}
		}
		 
	});	
	
}

function changeDivDis(showId,hideId){
	var flag = true;
	if(showId=='questions'){
		if($("#title").val()==''){
			flag = false;
		}
		if(contentEditor.getContentTxt()==''){
			flag = false;
		}
		if($("#timeLimitFlag").val()=="Y"){
			if($("#startDate").val().replace(/(^\s*)|(\s*$)/g, "")==''){
				flag = false;
			}
			if($("#endDate").val().replace(/(^\s*)|(\s*$)/g, "")==''){
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
		}
	}else{
		$("#"+showId).show();
		$("#"+hideId).hide();
		$("#"+showId+"Title").addClass("vote-top-link").removeClass("vote-top-nolink");
		$("#"+hideId+"Title").addClass("vote-top-nolink").removeClass("vote-top-link");
	}
}

function addQuestion(){
	var questionType = $("#questionType").val();
	var questionDiv = $("#questionDiv"+questionType).clone(true,true);
	var questionIndex = 1;
	if($("#questionsDiv div[id^='questionDiv']:last").attr("id")){
		questionIndex = parseInt($("#questionsDiv div[id^='questionDiv']:last").attr("id").replace("questionDiv",""))+1;
	}
	questionDiv.attr("id","questionDiv"+questionIndex);
	questionDiv.css("display","block");
	questionDiv.appendTo($("#questionsDiv"));
	$("span[name='sorNum']",questionDiv.get(0)).text(questionIndex);//题目序号
	$("a[sorNum]",questionDiv.get(0)).attr("sorNum",questionIndex);
	$("a[id^='questionImg']",questionDiv.get(0)).attr("id","questionImg"+questionIndex);
	$("div[id^='questionImgDiv']",questionDiv.get(0)).attr("id","questionImgDiv"+questionIndex);
	$("div[id^='questionOptionDiv']",questionDiv.get(0)).attr("id","questionOptionDiv"+questionIndex);
	
	$("div[id^='optionDiv']",questionDiv.get(0)).each(function(i){
		$(this).attr("id","optionDiv"+i+"_"+questionIndex);
		$("div[id^='optionImgDiv']",this).attr("id","optionImgDiv"+i+"_"+questionIndex);
		$("a[id^='optionImg']",this).attr("id","optionImg"+i+"_"+questionIndex);
		$("a[optionIndex]",this).attr("optionIndex",i+"_"+questionIndex);
		addPhotoButton("optionImg"+i+"_"+questionIndex,"optionImgDiv"+i+"_"+questionIndex);
	});
	
	addPhotoButton("questionImg"+questionIndex,"questionImgDiv"+questionIndex);
	sortQuestion();//设置题目序号
}

function sortQuestion(){
	$("#questionsDiv span[name='sorNum']").each(function(i){
		$(this).text(i+1);
	});
}

function addOption(obj){
	var sorNum = parseInt($(obj).attr("sorNum"));
	var optionIndex = parseInt($("#questionOptionDiv"+sorNum+" div[id^='optionDiv']:last").attr("id").replace("optionDiv",""))+1;
	var optionObj = $("#optionDiv").clone(true,true);
	$("div[id^='optionImgDiv']",optionObj.get(0)).attr("id","optionImgDiv"+optionIndex+"_"+sorNum);
	$("a[id^='optionImg']",optionObj.get(0)).attr("id","optionImg"+optionIndex+"_"+sorNum);
	$("a[optionIndex]",optionObj.get(0)).attr("optionIndex",optionIndex+"_"+sorNum);
	optionObj.attr("id","optionDiv"+optionIndex+"_"+sorNum);
	optionObj.css("display","block");
	optionObj.appendTo($("#questionOptionDiv"+sorNum));
	addPhotoButton("optionImg"+optionIndex+"_"+sorNum,"optionImgDiv"+optionIndex+"_"+sorNum);
}

function delQuestion(obj){
	$(obj).parents("div[id^='questionDiv']").remove();
	/*var optionIndex = $(obj).attr("optionIndex");
	$("#questionDiv"+optionIndex).remove();*/
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
 
	var url =  '/basedata/attach/upload?direct=questionnaire';
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
