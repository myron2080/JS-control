$(document).ready(function(){
	addPhotoButton("uploadImage","noticephotonames","image");
	addPhotoButton("uploadAttach","noticeattachnames","file");
	applyTypeChange();
});
function applyTypeChange(){
	var  applyTypeId=$("#applyTypeId").val();
	//var  isDIY=$("#applyTypeId option:selected").attr("isdiy");//是否是自定义流程
	var  isDIY=$("#applyTypeId").attr("isdiy");//是否是自定义流程
	if(applyTypeId!=null &&  applyTypeId!='' && isDIY!=1){
		$.post(getPath()+"/djworkflow/nodeDefi/getNodesByBillType",{applyTypeId:applyTypeId},function(res){
			if(res){
				var td=$("#processNodeTD");
				var htm="";
				if(res.length>0){
					htm="审批流程：";
					for(var i=0;i<res.length;i++){
						htm+=htm=="审批流程："?res[i].name:"->"+res[i].name;
					}
				}else{
					htm="未配置流程！";
				}
				$("#processNodeTD").html(htm);
			}
		},'json');
		$("#diy_tb").hide();
	}else if(isDIY==1){
		$("#processNodeTD").html("");
		$("#diy_tb").show();
	}
	
}
/**
 * 选择申请组织后
 * @param oldValue
 * @param newValue
 * @param doc
 */
function changeApplyOrg(oldValue,newValue,doc){
	$("#personId").val('');
	$("#personName").val('');
	$("#personF7").attr("dataPickerUrl",getPath()+"/framework/dataPicker/list?query=applyChangePersonQuery&jobstatusnotin=Y&orgId="+newValue.id);
}

function changeApplyPerson(oldValue,newValue,doc){
	if(newValue){
		$("#positionId").val(newValue.personPosition.position.id);
	}else{
		$("#positionId").val('');
	}
}

/**
 * 选择申请人
 * @param f7Id
 */
function openDataPickerNew(f7Id){
	var orgId = $("#orgId").val();
	if(!orgId){
		art.dialog.alert('请先选择申请人组织');
		return ;
	}
	openDataPicker(f7Id);
}

/**
 * 保存数据
 */
function saveAdd(dlg,status){
	$("#approveStatus").val(status);
	if(!validateSave()){
		return ;
	}
	var  isDIY=$("#applyTypeId option:selected").attr("isdiy");//是否是自定义流程
	if(isDIY==1){
		var signStepList ="[" ;
		$("#ul_signlist li[id^='li_step_']").each(function(i,liObj){
			var saveSortNum = (i+1);
			var number = (i+1);
			var name=$("#stepTitle",liObj).html();
			var orgId = $("#stepOrgId",liObj).val();
			var jobId = $("#stepJobF7_"+i).val();
			var personId = $("#stepPersonF7_"+i).val(); 
			if(signStepList!="["){
				signStepList+=",";
			}
			signStepList+="{saveSortNum:'"+saveSortNum+"',number:'"+number+"',name:'"+name+"',orgId:'"+orgId+"',curDealPerson:{id:'"+personId+"'},nodeType:'MANPOWER',fetchType:'APPOINTPEOPLE'}";
		});
		signStepList+="]"
		$("#signStepStr").val(signStepList);
	}else{
		$("#signStepStr").val("");
	}
	//图片
	var dary = $("#noticephotonames").find("div");
	var imgstr = "";
	for(var i=0;i<dary.length;i++){
		var imgid = $(dary[i]).attr("imgid");
		if(imgid) imgstr += imgid+",";
	}
	$("#noticephotoids").val(imgstr);
	//附件
	var dary = $("#noticeattachnames").find("div");
	var attstr = "";
	for(var i=0;i<dary.length;i++){
		var imgid = $(dary[i]).attr("imgid");
		if(imgid) attstr += imgid+",";
	}
	$("#noticeattachids").val(attstr);
	
	//提交表单
	$.ajax({
		url:$('form').attr('action'),
		dataType: "json",
		type:"POST",
		data: $('form').serialize(),
		success: function(res) {
			if(res.STATE == "SUCCESS"){
				art.dialog.tips("保存成功！");
				if(art.dialog.data("searchData")){
					art.dialog.data("searchData")();
				}
				setTimeout(function(){dlg.close();},1000);
			}else{
				art.dialog.tips("保存失败！");
			}
		},
		error:function(){
			art.dialog.tips("请求错误！");
		}
	});
	
}

/**
 *  数据验证
 * @returns {Boolean}
 */
function validateSave(){
	var flag = true ;
	if($("#applyTypeId").val() == ''){
		art.dialog.tips("请选择申请类型");
		flag = false ;
	}else if($("#orgId").val() == ''){
		art.dialog.tips("请选择申请部门");
		flag = false ;
	}else if($("#personId").val() == ''){
		art.dialog.tips("请选择申请人");
		flag = false ;
	}else if($("#title").val() == ''){
		art.dialog.tips("请填写标题");
		flag = false ;
	}else if($("#title").val().length > 200){
		art.dialog.tips("标题超出200个字符");
		flag = false ;
	}else {
		var content=$.trim(contentEditor.getContentTxt());
		if(content == null || content == ''){
			art.dialog.tips("请填写内容");
			flag = false ;
		}if(content.length>5000){
			art.dialog.tips("输入的内容不能超过5000字");
			flag = false;
		}
	}
	
	return flag; //不校验节点选择情况   孙海涛
	
	if($("#ul_signlist li[id^='li_step_']").length == 0){
		art.dialog.tips("请至少添加一行审批岗位");
		flag = false ;
	}else{
		$("#ul_signlist li[id^='li_step_']").each(function(i,liObj){
			if($("#stepOrgId",liObj).val() == ''){
				art.dialog.tips("请填写第"+(i+1)+"行审批部门");
				flag = false ;
				return ;
			}else if($("#stepJobF7_"+i).val() == ''){
				art.dialog.tips("请填写第"+(i+1)+"行审批岗位");
				flag = false ;
				return ;
			}
		});
	}
	return flag ;
}

/**
 * 打开步骤上的F7
 * @param obj
 */
var openF7Id = '' ;
function openStepF7(obj){
	var f7Id = $(obj).parents("span:first").attr("id");
	openF7Id = f7Id ;
	openDataPicker(f7Id);
}

/**
 * 清空步骤上的F7
 * @param obj
 */
function clearStepF7(obj){
	var f7Id = $(obj).parents("span:first").attr("id");
	clearDataPicker(f7Id);
	
	//同时也清空下级
	var name = f7Id.split("_")[0];
	var index = f7Id.split("_")[1];
	if(name == "stepOrgF7"){
		$("#stepJobF7_"+index+" option:gt(0)").remove();
		$("#stepPersonF7_"+index+" option:gt(0)").remove();
		$("#"+f7Id).find("#stepOrgName").val($("#"+f7Id).find("#stepOrgName").attr("defaultValue"));
	}else if(name == "stepJobF7"){
		$("#stepPersonF7_"+index+" option:gt(0)").remove();
	}
}

/**
 * 步骤上改变部门选择
 * @param oldValue
 * @param newValue
 * @param doc
 */
function changeStepOrg(oldValue,newValue,doc){
	if(openF7Id!=''){
		var index = openF7Id.split("_")[1];
		openF7Id = '' ;
		var stepJob = $("#stepJobF7_"+index) ;
		$("option :gt(0)",stepJob).remove();
		if(newValue){
			$.post(getPath()+'/basedata/position/getByOrg',{org:newValue.id},function(res){
				if(res && res.length > 0){
					for(var i = 0; i < res.length; i++){
						$('<option value="'+res[i].job.id+'">'+res[i].job.name+'</option>').appendTo(stepJob);
					}
				}
			},'json');
		}
		var stepPerson = $("#stepPersonF7_"+index);
		$("option :gt(0)",stepPerson).remove();
	}
}

/**
 *  步骤上改变岗位选择
 * @param obj
 */
function changeStepJob(obj){
	var objId = $(obj).attr("id");
	var jobId = $(obj).val();
	if(objId!='' && jobId !=''){
		var index = objId.split("_")[1];
		var orgId = $("#stepOrgId","#stepOrgF7_"+index).val();
		var stepPerson = $("#stepPersonF7_"+index);
		$("option :gt(0)",stepPerson).remove();
		$.post(getPath()+'/interflow/sign/getPersonByJob',{jobId:jobId,orgId:orgId},function(res){
			var personList = res.personList ;
			if(personList && personList.length > 0){
				for(var i = 0; i < personList.length; i++){
					$('<option value="'+personList[i].id+'">'+personList[i].name+'</option>').appendTo(stepPerson);
				}
			}
		},'json');
	}
}

/**
 * 添加审批步骤
 */
function addStep(){
	var copyStep = $("#li_copy").clone();
	copyStep.attr("id","li_step_0");
	copyStep.show();
	$("#ul_signlist").append(copyStep);
	//重新渲染索引
	renderStepIndex();
}
/**
 * 重新渲染审批步骤行的索引
 */
function renderStepIndex(){
	var stepTitle = ["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五"] ;
	var stepCount = $("#ul_signlist li[id^='li_step_']").length ;
	if(stepCount >= 15){
		return ;
	}
	$("#ul_signlist li[id^='li_step_']").each(function(i,stepObj){
		$(stepObj).attr("id","li_step_"+i);
		$("#stepTitle",stepObj).text(stepTitle[i]+"级审批：");
		$("span[id^='stepOrgF7_']",stepObj).attr("id","stepOrgF7_"+i);
		$("select[id^='stepJobF7_']",stepObj).attr("id","stepJobF7_"+i);
		$("select[id^='stepPersonF7_']",stepObj).attr("id","stepPersonF7_"+i);
		if(i == (stepCount - 1)){
			$("#btnMove",stepObj).removeClass("down");
			$("#btnMove",stepObj).addClass("up");
		}else{
			$("#btnMove",stepObj).removeClass("up");
			$("#btnMove",stepObj).addClass("down");
		}
	});
}
/**
 * 审批步骤上下移动
 * @param obj
 */
function stepMove(obj){
	
	var cls = $(obj).attr("class");
	
	//原来的行数据
	var srcStepOrgId = $(obj).parents("li").find("#stepOrgId").val();
	var srcStepOrgName = $(obj).parents("li").find("#stepOrgName").val();
	var srcStepJobId = $(obj).parents("li").find("select[id^='stepJobF7_']").val();
	var srcStepPersonId = $(obj).parents("li").find("select[id^='stepPersonF7']").val();
	
	var cloneObj = $(obj).parents("li").clone();
	$("#stepOrgId",cloneObj).val(srcStepOrgId);
	$("#stepOrgName",cloneObj).val(srcStepOrgName);
	$("select[id^='stepJobF7_']",cloneObj).val(srcStepJobId);
	$("select[id^='stepPersonF7']",cloneObj).val(srcStepPersonId);
	
	var index = cloneObj.attr("id").split("_")[2];
	if(cls == "down"){//向下移动
		var stepCount = $("#ul_signlist li[id^='li_step_']").length ;
		if(index == stepCount - 1){
			art.dialog.tips("已经是最后一个了啦");
		}else{
			$(obj).parents("li").next().after(cloneObj);
			//删除当前的
			stepDelete(obj);
		}
	}else if(cls == "up"){//向上移动
		if(index == 0){
			art.dialog.tips("已经是第一个了啦");
		}else{
			$(obj).parents("li").prev().before(cloneObj);
			//删除当前的
			stepDelete(obj);
		}
	}
}
/**
 * 审批步骤删除
 * @param obj
 */
function stepDelete(obj){
	$(obj).parents("li").remove();
	//重新渲染索引
	renderStepIndex();
}



/**
 * id 点击触发上传时间的按钮ID
 * parentdiv 图片名字上传后显示所在的div
 */
addPhotoButton=function(id,parentdiv,type){
	
	var url = "";
	if(type=='image'){url = '/basedata/photo/upload?direct=signbill';}
	else if(type=='file'){url = '/basedata/attach/upload?direct=signbill';}
	new AjaxUpload($("#"+id), {
    	action: getPath()+url,
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
        	showload();    	
        	//图片上传时做类型判断
        	if(type=='image'){
        	if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|jpeg|gif图片");
                return false;
            }
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
	           var pdiv = $("<div style='float:left;margin-left:10px;' id='"+json.id+"div' imgid='"+json.id+"'><span>"+name+"</span><a href='javascript:void(0)' onclick=delphoto('"+json.id+"','"+type+"')>删除</a></div>");
	           $("#"+parentdiv).append(pdiv);
	          
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

/**
 * 删除照片附件
 * @param id
 * @param type
 */
function delphoto(id,type){
	$("#"+id+"div").remove();
	var url = "";
	if(type=="image") url = "/basedata/photo/delete";
	else if(type=="file") url = "/basedata/attach/delete";
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