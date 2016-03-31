$(function(){
	bindEvent();
	$("input[dataType='rdoVal']").each(function(){
		var val = $(this).val()||($(this).attr("defaultValue"));
		var objId = $(this).attr("name")+val;
		if($(objId)){
		 $("#"+objId).attr("checked","checked");
		 if($(this).attr("name")=="timeLimitFlag" || $(this).attr("name")=="debateType"){
		  $("#"+objId).click();
		 }
		}
	});
	getLoadObject();
	getConsObject();
	EnlargerImg.init({type:"enlararr"});	//放大图片
});

function beforesave(dlg){
	$("input[dataType='rdoVal']").each(function(){
		//单选框 默认值
		var val = $(this).val();
		if(!val){
			$(this).val($(this).attr("defaultValue"))
		}
	});
	var prosImgIds = "";
	$("#prosDiv dl").each(function(){
		if(prosImgIds){
			prosImgIds += (","+$(this).attr("imgid"));
		}else{
			prosImgIds +=  $(this).attr("imgid");	
		}
	});
	$("#prosImgIds").val(prosImgIds);
	var consImgIds = "";
	$("#consDiv dl").each(function(){
		if(consImgIds){
		  consImgIds += (","+$(this).attr("imgid"));
		}else{
			consImgIds +=  $(this).attr("imgid");	
		}
	});
	$("#consImgIds").val(consImgIds);
}

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
	var debateType = $("#debateType").val();
	if(debateType=="GROUP" && $("#prosObjectType").val()==$("#consObjectType").val()){
		var prosObjectId = $("#prosObjectId").val();
		var consObjectId = $("#consObjectId").val();
		var doubleFlag = false;
		var prosObjectIds = prosObjectId.split(";");
		var consObjectIds = consObjectId.split(";");
		
		for(var i=0;i<prosObjectIds.length;i++){
			var proId=prosObjectIds[i];
			for(var k=0;k<consObjectIds.length;k++){
				var conId=consObjectIds[k];
				if(proId==conId){
					art.dialog.tips("正方与反方参与对象不能重复");
					return ;
				}
			}
		}
	}
	currentDialog = dlg;
	saveEdit(dlg);
	return false;
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
		if(objId=="debateType"){
			if(rdoVal=="FREE"){
				//自由辩论
				$(".pros").hide();
				$("#prosObjectTypeTd").text("参与类型：");
				$("#attenderObjectTypeTds").text("参与对象：");
				$("#consTr").hide();
				$("#prosObjectTypeCOMPANY").show();
				$("label[for='prosObjectTypeCOMPANY']").show();
			}else{
				$(".pros").show();
				$("#prosObjectTypeTd").text("正方参与类型：");
				$("#attenderObjectTypeTds").text("正方参与对象：");
				$("#consTr").show();
				$("#prosObjectTypeCOMPANY").hide();
				$("label[for='prosObjectTypeCOMPANY']").hide();
			}
		}
	});	
	
	addPhotoButton("prosImg","prosDiv");
	addPhotoButton("consImg","consDiv");
}


/**
 * id 点击触发上传事件的按钮ID
 * parentdiv 附件上传后显示所在的div
 */
addPhotoButton=function(id,parentdiv){
 
	var url =  '/basedata/attach/upload?direct=debate';
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


function getLoadObject(){
	
	var val = $("input[name='prosObjectTypeRd']:checked").val();
	if(val!="COMPANY"){
		$(".pros").show();
		if(val=="ORG"){
			$("#object").attr("dataPickerUrl",base+"/basedata/org/orgDataPicker?multi=true");
		}else if(val=="JOB"){
			$("#object").attr("dataPickerUrl",base+"/basedata/position/dataPicker?multi=true");
		}else if(val=="PERSON"){
			$("#object").attr("dataPickerUrl",base+"/basedata/person/dataPicker?multi=true&type=yes");
		}
	}else{
		$(".pros").hide();
	}
}


function getObject(){
	var val = $("input[name='prosObjectTypeRd']:checked").val();
	var investigateId = $("#dataId").val();
	if(val!="COMPANY"){
		$(".pros").show();
		if(val=="ORG"){
			$("#object").attr("dataPickerUrl",base+"/basedata/org/orgDataPicker?multi=true");
		}else if(val=="JOB"){
			$("#object").attr("dataPickerUrl",base+"/interflow/vote/jobDataPicker?multi=true&debateType=PROS&investigateId="+investigateId);
		}else if(val=="PERSON"){
			$("#object").attr("dataPickerUrl",base+"/basedata/person/dataPicker?multi=true&type=yes");
		}
	}else{
		$(".pros").hide();
	}
	
}

function getConsObject(){
	var val = $("input[name='consObjectTypeRd']:checked").val();
	var investigateId = $("#dataId").val();
	if(val=="ORG"){
		$("#org").attr("dataPickerUrl",base+"/basedata/org/orgDataPicker?multi=true");
	}else if(val=="JOB"){
		$("#org").attr("dataPickerUrl",base+"/interflow/vote/jobDataPicker?multi=true&debateType=CONS&investigateId="+investigateId);
	}else if(val=="PERSON"){
		$("#org").attr("dataPickerUrl",base+"/basedata/person/dataPicker?multi=true&type=yes");
	}
}

function valiProsObject(){
	alert($("#object.id").val());
}