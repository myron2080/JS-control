function saveEdit(dlg){
	currentDialog = dlg;
	var idcardVal = $("#idCard").val();
	var cardType = $("#cardType").val();
	var birthday=$("#birthday").val();
	if(!birthday){
		art.dialog.tips('出生日期不能为空。');
		return ;
	}
	if(idcardVal != null && idcardVal != ""){
		idcardVal = idcardVal.trim();
		$("#idCard").val(idcardVal);
		var param = {};
		param.idcard = idcardVal;
		param.id=$("#applyPersonId").val();
		param.cardType=cardType;
		$.post(getPath()+"/hr/person/idcard/judge",param,function(res){
			if(res.ret=="1"){
				$("input[name='idCard']").parent().addClass("l-text-invalid");
				$("input[name='idCard']").attr("title", res.MSG);
				$("input[name='idCard']").poshytip();
	        } else {
	        	if(combinePostionJson() && combineWorkExperienceJson() 
	        			&& combineEducationJson() && combineRewardPunishmentJson()
	        			&& combineAgentCertificateJson()){
	        		$("form").submit();
	        	}
	        }
		},"json");
	} else {
		if(combinePostionJson() && combineWorkExperienceJson() 
    			&& combineEducationJson() && combineRewardPunishmentJson()
    			&& combineAgentCertificateJson()){
    		$("form").submit();
    	}
	}
	//var obj = $("form");
	//$("form")[0].submit();
	return false;
}
function setPositionName(){
	$("#mainPositionName").val($("#mainPosition option:selected").text());
}
function setjobleavlName(){
	$("#mainJobLevelName").val($("#mainPositionJobLevel option:selected").text());
}
//组装经纪人证信息  [{person.id:xxx,type:xxx,number:xxx,passDate:xxx,agentType:xxx,memberLevel:xx,effectPeriod:xxx,checkDate:xxx}]
function combineAgentCertificateJson(){
	var passFlag = true;
	var result ="";
	if($(":checkbox[key='agentCertificateData']").is(":checked")){
		$("#agentCertificateTable").find("tr").each(function(i){
			if(i > 0){  //如果i >0 说明是值
				var certificateType = $(this).find("select[name='certificateType']").val();
				var agentCertificateNumber = $(this).find("input[name='agentCertificateNumber']").val();
				var passDate = $(this).find("input[name='passDate']").val();
				var agentType = $(this).find("select[name='agentType']").val();
				var memberLevel = $(this).find("select[name='memberLevel']").val();
				var effectPeriod = $(this).find("input[name='effectPeriod']").val();
				var checkDate = $(this).find("input[name='checkDate']").val();
	
				if((agentCertificateNumber == null) || (agentCertificateNumber == '')){
					art.dialog.tips("经纪人证中第"+i+"行中证件编码不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((passDate == null) || (passDate == '')){
					art.dialog.tips("经纪人证中第"+i+"行中考取时间不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((agentType == null) || (agentType == '')){
					art.dialog.tips("经纪人证中第"+i+"行中经纪类型不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((memberLevel == null) || (memberLevel == '')){
					art.dialog.tips("经纪人证中第"+i+"行中会员级别不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((effectPeriod == null) || (effectPeriod == '')){
					art.dialog.tips("经纪人证中第"+i+"行中有效期不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
	//			if((checkDate == null) || (checkDate == '')){
	//				art.dialog.tips("经纪人证中第"+i+"行中证明人电话不能为空！");
	//				result = null;
	//				return;
	//			}
	
	
				result += "{'type':'"+certificateType+"','number':'"+agentCertificateNumber+"','passDate':'"+passDate+"','agentType':'"+agentType+"','memberLevel':'"+memberLevel+"','effectPeriod':'"+effectPeriod+"','checkDate':'"+checkDate+"'},";
			}
		});
	}
	//赋值到隐藏域中
	if((result != null) && (result != "")){
		$("#agentCertificateJson").val("["+result.substr(0,result.length-1)+"]");
	}

	return passFlag;
}

//组装工作经历信息  [{person.id:xxx,startDate:xxx,endDate:xxx,workUnit:xxx,workPosition:xxx,leaveReason:xx,prover:xxx,proverTel:xxx}]
function combineWorkExperienceJson(){
	var passFlag = true;
	var result ="";
	if($(":checkbox[key='workExperienceData']").is(":checked")){
		$("#workExperienceTable").find("tr").each(function(i){
			if(i > 0){  //如果i >0 说明是值
				var workStartDate = $(this).find("input[name='workStartDate']").val();
				var workEndDate = $(this).find("input[name='workEndDate']").val();
				var workUnit = $(this).find("input[name='workUnit']").val();
				var workPosition = $(this).find("input[name='workPosition']").val();
				var leaveReason = $(this).find("input[name='leaveReason']").val();
				var prover = $(this).find("input[name='prover']").val();
				var proverTel = $(this).find("input[name='proverTel']").val();
				
	
				if((workStartDate == null) || (workStartDate == '')){
					art.dialog.tips("工作经历中第"+i+"行中开始时间不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((workEndDate == null) || (workEndDate == '')){
					art.dialog.tips("工作经历中第"+i+"行中结束时间不能为空！");
					result = null;
					passFlag = false;
					return;
				}
				
				if(workEndDate.trim() < workStartDate.trim()){
					art.dialog.tips("工作经历中第"+i+"行中结束时间不能小于开始时间！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((workUnit == null) || (workUnit == '')){
					art.dialog.tips("工作经历中第"+i+"行中工作单位不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((workPosition == null) || (workPosition == '')){
					art.dialog.tips("工作经历中第"+i+"行中岗位不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((leaveReason == null) || (leaveReason == '')){
					art.dialog.tips("工作经历中第"+i+"行中离职原因不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((prover == null) || (prover == '')){
					art.dialog.tips("工作经历中第"+i+"行中证明人不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((proverTel == null) || (proverTel == '')){
					art.dialog.tips("工作经历中第"+i+"行中证明人电话不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
	
				result += "{'startDate':'"+workStartDate+"','endDate':'"+workEndDate+"','workUnit':'"+workUnit+"','workPosition':'"+workPosition+"','leaveReason':'"+leaveReason+"','prover':'"+prover+"','proverTel':'"+proverTel+"'},";
			}
		});
	}
	
	//赋值到隐藏域中
	if((result != null) && (result != "")){
		$("#workExperienceJson").val("["+result.substr(0,result.length-1)+"]");
	}
	
	return passFlag;
}

//组装教育经历信息 [{person.id:xxx,startDate:xxx,endDate:xxx,educationUnit:xxx,type:xxx,certificateNumber:xx,highest:true}]
function combineEducationJson(){
	var passFlag = true;
	var result ="";
	var flag = false;
	if($(":checkbox[key='educationData']").is(":checked")){
		$("#educationTable").find("tr").each(function(i){
			if(i > 0){  //如果i >0 说明是值
				var educationStartDate = $(this).find("input[name='educationStartDate']").val();
				var educationEndDate = $(this).find("input[name='educationEndDate']").val();
				var educationUnit = $(this).find("input[name='educationUnit']").val();
				var type = $(this).find("select[name='type']").val();
				var certificateNumber = $(this).find("input[name='certificateNumber']").val();
				var highest = $(this).find("input[name='highest']").is(":checked");
	
				flag = highest;
	
				if((educationStartDate == null) || (educationStartDate == '')){
					art.dialog.tips("教育经历中第"+i+"行中起始时间不能为空！");
					result = null;
					passFlag = false;
					return;
				}
				
				if(educationEndDate && educationEndDate.trim() < educationStartDate.trim()){
					art.dialog.tips("教育经历中第"+i+"行中结束时间不能小于起始时间！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((educationUnit == null) || (educationUnit == '')){
					art.dialog.tips("教育经历中第"+i+"行中教育机构不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((certificateNumber == null) || (certificateNumber == '')){
					art.dialog.tips("教育经历中第"+i+"行中证书编号不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((i == $(this).siblings().length) && !flag){
					art.dialog.tips("教育经历中的必须勾选最高学历！！");
					result = null;
					passFlag = false;
					return;
				}
	
				result += "{'startDate':'"+educationStartDate+"','endDate':'"+educationEndDate+"','educationUnit':'"+educationUnit+"','type':'"+type+"','certificateNumber':'"+certificateNumber+"','highest':'"+highest+"'},";
			}
		});
	}
	
	//赋值到隐藏域中
	if((result != null) && (result != "")){
		$("#educationJson").val("["+result.substr(0,result.length-1)+"]");
	}
	
	return passFlag;
}
//组装奖惩记录信息 [{person.id:xxx,rewardPunishment:xxx,type.id:xxx,level.id:xxx,content:xxx,date:xx,measure:xxx}]
function combineRewardPunishmentJson(){
	var passFlag = true;
	var result ="";
	if($(":checkbox[key='rewardPunishmentData']").is(":checked")){
		$("#rewardPunishmentTable").find("tr").each(function(i){
			if(i > 0){  //如果i >0 说明是值
				var rewardPunishment = $(this).find("select[name='rewardPunishment']").val();
				var rewardPunishmentType = $(this).find("input[name='type.id']").val();
				var rewardPunishmentLevel = $(this).find("input[name='level.id']").val();
				var content = $(this).find("input[name='content']").val();
				var date = $(this).find("input[name='date']").val();
				var measure = $(this).find("input[name='measure']").val();
	
	
				if((rewardPunishmentType == null) || (rewardPunishmentType == '')){
					art.dialog.tips("奖惩记录中第"+i+"行中奖惩类型不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((rewardPunishmentLevel == null) || (rewardPunishmentLevel == '')){
					art.dialog.tips("奖惩记录中第"+i+"行中奖惩级别不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((content == null) || (content == '')){
					art.dialog.tips("奖惩记录中第"+i+"行中奖惩内容不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((date == null) || (date == '')){
					art.dialog.tips("奖惩记录中第"+i+"行中奖惩时间不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
				if((measure == null) || (measure == '')){
					art.dialog.tips("奖惩记录中第"+i+"行中奖惩措施不能为空！");
					result = null;
					passFlag = false;
					return;
				}
	
	
				result += "{'rewardPunishment':'"+rewardPunishment+"','type':{'id':'"+rewardPunishmentType+"'},'level':{'id':'"+rewardPunishmentLevel+"'},'content':'"+content+"','date':'"+date+"','measure':'"+measure+"'},";
			}
		});
	}
	
	//赋值到隐藏域中
	if((result != null) && (result != "")){
		$("#rewardPunishmentJson").val("["+result.substr(0,result.length-1)+"]");
	}
	
	return passFlag;
}

//组装职位信息 [{position.id:xxx,jobLevel.id:xxx,person.id:xx,primary:true,effectDate:xxx,}]
function combinePostionJson(){
	//得到主要职位的信息
	var positionId;
	var jobLevelId;
	var primary;
	var effectDate
	var str="[";
	var mainPostionInfo = getMainPositionInfo(positionId,jobLevelId,primary,effectDate);
	str += mainPostionInfo;
	var partTimeJobInfo = getPartTimeJobInfo(positionId,jobLevelId,primary,effectDate);
	if((partTimeJobInfo != null) && (partTimeJobInfo != "")){
		str += ","+partTimeJobInfo;
	}
	str +="]";
	$("#positionJson").val(str);
	
	if((mainPostionInfo == null) || (partTimeJobInfo == null)){
		return false;
	}
	return true;
}

//得到主要职位信息
function getMainPositionInfo(positionId,jobLevelId,primary,effectDate){
	positionId = $("#mainPosition").val();
	jobLevelId = $("#mainPositionJobLevel").val();
	primary = true;
	effectDate = $("#innerDate").val();
	if(($("#mainPositionOrg").children("input[dataPicker='value']").val() == null) || ($("#mainPositionOrg").children("input[dataPicker='name']").val() == "")){
		art.dialog.tips("主要任职中组织不能为空");
		return null;
	}
	if((positionId == null) || (positionId == '')){
		art.dialog.tips('主要任职中职位不能为空！！');
		return null;
	}
	
	if((jobLevelId == null) || (jobLevelId == '')){
		art.dialog.tips('主要任职中职级不能为空！！');
		return null;
	}
	
	if((effectDate == null) || (effectDate == '')){
		art.dialog.tips('主要任职中入职日期不能为空！！');
		return null;
	}
	return "{'position':{'id':'"+positionId+"'},'jobLevel':{'id':'"+jobLevelId+"'},'primary':'"+true+"','effectDate':'"+effectDate+"'}";
}

//得到兼职的信息
function getPartTimeJobInfo(positionId,jobLevelId,primary,effectDate){
	var result="";
	if($(":checkbox[key='partTimeJobData']").is(":checked")){
		$("#addPartTimeJobBtn").siblings("div[name='partTimejobDiv']").each(function(i){
			var orgValue = $(this).find(".f7").children("input[dataPicker='value']").val();
			positionId = $(this).find("select[name='position']").val();
			jobLevelId = $(this).find("select[name='jobLevel']").val();
			primary = false;
			effectDate = $(this).find("input[name='positionDutyDate']").val();
			
			if((orgValue == null) || (orgValue == "")){
				art.dialog.tips("兼职职位中第"+(i+1)+"行中的组织不能为空！");
				result = null;
				return;
			}
			if((positionId == null) || (positionId == '')){
				art.dialog.tips("兼职职位中第"+(i+1)+"行中的职位不能为空！");
				result = null;
				return;
			}
			
			if((jobLevelId == null) || (jobLevelId == '')){
				art.dialog.tips("兼职职位中第"+(i+1)+"行中的职级不能为空！");
				result = null;
				return;
			}
			
			if((effectDate == null) || (effectDate == '')){
				art.dialog.tips("兼职职位中第"+(i+1)+"行中的任职日期不能为空！");
				result = null;
				return;
			}
			result += "{'position':{'id':'"+positionId+"'},'jobLevel':{'id':'"+jobLevelId+"'},'primary':'"+false+"','effectDate':'"+effectDate+"'},";
		});
	}
	
	if((result != null) && (result != "")){
		result = result.substr(0,result.length-1);
	}
	return result;
}

//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatu").attr("value",statu);
	saveEdit(dlg);
}
//添加经纪人证
function addAgentCertificate(){
	var index = 1;
	 var comp;
	
	if($.browser.msie){	//ie
		comp = $("#addAgentCertificateBtn").parent().parent();
	} else {
		comp = $("#addAgentCertificateBtn").siblings();
	}
		
	comp.find("tr").each(function(){
		var idx = parseInt($(this).attr('index'));
		if(idx >= index){
			index = idx+1;
		}
	});
   var u = $("#agentCertificateTable tbody")
   		.append('<tr name="agentCertificate" index="'+index+'">'
			   +'<td>'
				   +'<select name="certificateType" id="certificateType_'+index+'">'
				   +'</select>'
			   +'</td>'
			   +'<td><input type="text" name="agentCertificateNumber" id="agentCertificateNumber_'+index+'" /></td>'
			   +'<td><input type="text" name="passDate" id="passDate_'+index+'"  class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/></td>'
			   +'<td>'
				   +'<select name="agentType" id="agentType_'+index+'">'
				   +'</select>'
			   +'</td>'
			   +'<td>'
				   +'<select name="memberLevel" id="memberLevel_'+index+'">'
				   +'</select>'
			   +'</td>'
			   +'<td>'
			   		+'<input type="text" name="effectPeriod" id="effectPeriod_'+index+'" />'
			   +'</td>'
			   +'<td>'
			   		+'<input type="text" name="checkDate" id="checkDate_'+index+'" class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" />'
			   +'</td>'
			   +'<td><div name="deleteAgentCertificateBtn"><a href="javascript:void(0)"  onclick="javascript:return false;">删除</a></div></td>'
		   +'</tr>');
   //奖select框的值复制上
   $('tr[name="agentCertificate"][index="'+index+'"]').find("select[name='certificateType']").append($("#certificateTypeListDiv select").children().clone());
   $('tr[name="agentCertificate"][index="'+index+'"]').find("select[name='agentType']").append($("#agentTypeListDiv select").children().clone());
   $('tr[name="agentCertificate"][index="'+index+'"]').find("select[name='memberLevel']").append($("#memberLevelListDiv select").children().clone());
   $("input,select,textarea",u).each(function(){
		$.ligerui.find('Form')[0].options.editorBulider.call(null,$(this));
	});
}

//移除一个经纪人证
function deleteAgentCertificate(index){
	$('tr[name="agentCertificate"][index="'+index+'"]').remove();
}


//添加奖惩记录
function addRewardPunishment(){
	var index = 1;
	 var comp;
		
	if($.browser.msie){	//ie
		comp = $("#addRewardPunishmentBtn").parent().parent();
	} else {
		comp = $("#addRewardPunishmentBtn").siblings();
	}
		
	comp.find("tr").each(function(){
		var idx = parseInt($(this).attr('index'));
		if(idx >= index){
			index = idx+1;
		}
	});
	 var u = $("#rewardPunishmentTable tbody")
	 		.append('<tr name="rewardPunishmentTr" index="'+index+'">'
	          +'<td>'
		          +'<select name="rewardPunishment" id="rewardPunishment_'+index+'">'
		          +'</select>'
	          +'</td>'
	          +'<td>'
		          +'<div class="f7" id="rewardPunishmentType_'+index+'" dataPickerUrl="'+base+'/framework/dataPicker/list?query=basicDataQuery&typenumber=JCLX" width="360px" height="306px" title="奖惩类型" >'
			          +'<input dataPicker="value"  name="type.id" value="" type="hidden" readOnly="readOnly" />'
			          +'<input dataPicker="name" ondblclick="openDataPicker(\'rewardPunishmentType_'+index+'\')" value="" name="type.name" type="text"/>'
			          +'<strong style="display:none;" onclick="clearDataPicker(\'rewardPunishmentType_'+index+'\')"></strong>'
			          +'<span class="p_hov" onclick="openDataPicker(\'rewardPunishmentType_'+index+'\')"></span>'
		          +'</div>'
	          +'</td>'
	          +'<td>'
		          	+'<div class="f7" id="rewardPunishmentLevel_'+index+'" dataPickerUrl="'+base+'/framework/dataPicker/list?query=basicDataQuery&typenumber=JCJB" width="360px" height="306px" title="奖惩级别" >'
				          +'<input dataPicker="value"  name="level.id" value="" type="hidden" readOnly="readOnly" />'
				          +'<input dataPicker="name" ondblclick="openDataPicker(\'rewardPunishmentLevel_'+index+'\')" name="level.name" type="text"/>'
				          +'<strong style="display:none;" onclick="clearDataPicker(\'rewardPunishmentLevel_'+index+'\')"></strong>'
				          +'<span class="p_hov" onclick="openDataPicker(\'rewardPunishmentLevel_'+index+'\')"></span>'
			         +'</div>'
	          +'</td>'
	          +'<td>'
	          	  	+'<input type="text" id="content_'+index+'" name="content"/>'
	          +'</td>'
	          +'<td>'
	          		+'<input type="text" id="date_'+index+'" name="date"   class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>'
	          +'</td>'
	          +'<td>'
	          	+'<input type="text" id="measure_'+index+'" name="measure"/>'
	          +'</td>'
	          +'<td><div name="deleteRewardPunishmentBtn"><a href="javascript:void(0)"  onclick="javascript:return false;">删除</a></div></td>'
          +'</tr>');
   //奖select框的值复制上
   $('tr[name="rewardPunishmentTr"][index="'+index+'"]').find("select[name='rewardPunishment']").append($("#rewardPunishmentListDiv select").children().clone());
   $("input,select,textarea",u).each(function(){
		$.ligerui.find('Form')[0].options.editorBulider.call(null,$(this));
	});
}

//移除一个奖惩记录
function deleteRewardPunishment(index){
	$('tr[name="rewardPunishmentTr"][index="'+index+'"]').remove();
}

//添加教育经历
function addEducation(){
	 var index = 1;
	 var comp;
		
	if($.browser.msie){	//ie
		comp = $("#addEducationBtn").parent().parent();
	} else {
		comp = $("#addEducationBtn").siblings();
	}
		
	comp.find("tr").each(function(){
		var idx = parseInt($(this).attr('index'));
		if(idx >= index){
			index = idx+1;
		}
	});
	 var u = $("#educationTable tbody")
	 		.append(' <tr name="education" index="'+index+'">'
			    +'<td><input type="text" id="educationStartDate_'+index+'" name="educationStartDate"   class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/></td>'
			    +'<td><input type="text" id="educationEndDate_'+index+'" name="educationEndDate"  class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/></td>'
			    +'<td><input type="text" id="educationUnit_'+index+'" name="educationUnit"/></td>'
			    +'<td>'
			    	+'<select name="type" id="type_'+index+'">'
			    	+'</select>'
		    	+'</td>'
		    	+'<td><input type="text" id="certificateNumber_'+index+'" name="certificateNumber"/></td>'
		    	+'<td>'
			    	+'<input type="checkbox" name="highest" id="highest_'+index+'" />'
		    	+'</td>'
		    	+'<td><div name="deleteEducationBtn"><a href="javascript:void(0)"  onclick="javascript:return false;">删除</a></div></td>'
	    	+'</tr>');
   //奖select框的值复制上
   $('tr[name="education"][index="'+index+'"]').find("select[name='type']").append($("#educationTypeListDiv select").children().clone());
   $("input,select,textarea",u).each(function(){
		$.ligerui.find('Form')[0].options.editorBulider.call(null,$(this));
	});
}

//移除一个教育经历
function deleteEducation(index){
	$('tr[name="education"][index="'+index+'"]').remove();
}

function checkNumber(obj,maxVal){
	var value = obj.value ;
	if(isNaN(value) || value < 0){
		obj.value = '';
		obj.focus();
		return ;
	}
	value = parseInt(value);
	obj.value = value;
	//最大值
	if(maxVal){
		if(value>maxVal){
			obj.value = maxVal;
			obj.focus();
		}
	}
}

//添加工作经历
function addWorkExperience(){
	var index = 1;
	var comp;
	
	if($.browser.msie){	//ie
		comp = $("#addWorkExperienceBtn").parent().parent();
	} else {
		comp = $("#addWorkExperienceBtn").siblings();
	}
	
	 comp.find("tr").each(function(){
		var idx = parseInt($(this).attr('index'));
		if(idx >= index){
			index = idx+1;
		}
	});
	 var u = $("#workExperienceTable tbody")
	 		.append(' <tr name="workExperience"  index="'+index+'">'
	          +'<td align="center"><input style="width:100px;" type="text" name="workStartDate" id="workStartDate_'+index+'"   class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/></td>'
	          +'<td align="center"><input style="width:100px;" type="text" name="workEndDate" id="workEndDate_'+index+'"   class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" /></td>'
	          +'<td align="center"><input style="width:100px;" type="text" name="workUnit" id="workUnit_'+index+'" /></td>'
	          +'<td align="center"><input style="width:100px;" type="text" name="workPosition" id="workPosition_'+index+'" /></td>'
	          +'<td align="center"><input style="width:100px;" type="text" name="leaveReason" id="leaveReason_'+index+'" /></td>'
	          +'<td align="center"><input style="width:100px;" type="text" name="prover" id="prover_'+index+'" /></td>'
	          +'<td align="center"><input style="width:50px;" type="text" name="proverTel" id="proverTel_'+index+'" onblur="checkNumber(this)"/></td>'
	          +'<td align="center"><div name="deleteWorkExperienceBtn"><a href="javascript:void(0)"  onclick="javascript:return false;">删除</a></div></td>'
	          +'</tr>');
	 
	 //不要ligerui的初始化操作
   $("input,select,textarea",u).each(function(){
		$.ligerui.find('Form')[0].options.editorBulider.call(null,$(this));
	});
}

//移除一个工作经历
function deleteWorkExperience(index){
	$('tr[name="workExperience"][index="'+index+'"]').remove();
}

//添加兼职职位
function addPersonPosition(){
	var index = 0;
	 $("#addPartTimeJobBtn").siblings().each(function(){
		var idx = parseInt($(this).attr('index'));
		if(idx >= index){
			index = idx+1;
		}
	});
    $("#addPartTimeJobBtn").parent()
    .append('<div style="width:100%;" name="partTimejobDiv" index="'+index+'">'
		    +'<div style="width:95%; float:left;">'
			    +'<table width="100%" border="0" cellpadding="0" cellspacing="0" class="vtbs">'
				      +'<tr>'
					        +'<td width="13%" align="right"><span class="red">*</span>组织：</td>'
					        +'<td width="23%" align="left">'
					        	+'<div class="f7" style="width:137px;" id="org_'+index+'" dataPickerUrl="'+base+'/basedata/org/orgDataPicker" width="750px" height="500px" onchange="changeOrg" title="组织">'
					        		+'<input dataPicker="value"  name="org.id" type="hidden" readOnly="readOnly" />'
					        		+'<input dataPicker="name" ondblclick="openDataPicker(\'org_'+index+'\')" name="org.name" type="text"/>'
					        		+'<strong onclick="clearDataPicker(\'org_'+index+'\')" style="display:none;"></strong>'
					        		+'<span class="p_hov" onclick="openDataPicker(\'org_'+index+'\')"></span>'
					        	+'</div>'
							+'</td>'
					        +'<td width="13%" align="right"><span class="red">*</span>职位：</td>'
					        +'<td width="21%" align="left">'
					        		+'<select name="position" id="position_'+index+'">'
					        		+'</select>'
					        +'</td>'
					        +'<td width="13%" align="right">职级：</td>'
					        +'<td width="21%" align="left">'
					        	+'<select name="jobLevel" id="jobLevel_'+index+'">'
					        	+'</select>'
					        +'</td>'
				      +'</tr>'
				      +'<tr>'
					        +'<td align="right"><span class="red">*</span>任职日期：</td>'
					        +'<td align="left">'
								+'<input name="positionDutyDate" id="positionDutyDate_'+index+'" validate="{required:true}" type="text" class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>'
							+'</td>'
							+'<td></td>'
							+'<td></td>'
							+'<td></td>'
							+'<td></td>'
//					        +'<td align="right">离职日期：</td>'
//					        +'<td align="left"><input type="text" name="positionLeaveDate" id="positionLeaveDate_'+index+'" type="text" class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" /></td>'
//					        +'<td align="right">&nbsp;</td>'
//					        +'<td align="left">&nbsp;</td>'
				      +'</tr>'
			    +'</table>'
		    +'</div>'
		    +'<div style="width:5%; float:left;" name=deletePartTimeJobBtn><div class="shanchu01"><a href="javascript:void(0)"  onclick="javascript:return false;">删除</a></div></div>'
	      +'</div>');
    bindPartTimeJobEvent();
    
}

//删除兼职职位
function deletePosition(index){
	$('div[index="'+index+'"]').remove();
}

//改变兼职组织
function changeOrg(oldValue,newValue,doc){
	
	if(newValue && ((oldValue == null) || (oldValue.id != newValue.id))){
		
		var ul = $(doc).parent().parent();
		
		var p = $(ul).find('select[name="position"]');
		p.val(null);
		p.html('');
		
		var jobLevel = $(ul).find('select[name="jobLevel"]');
		jobLevel.val(null);
		jobLevel.html("");
		changeJob(p,newValue.id);
	}
}

//更改主要任职信息里面的组织
function changeMainPositionOrg(oldValue,newValue,doc){
	
	if(newValue && ((oldValue == null) || (oldValue.id != newValue.id))){
		var tr = $(doc).parent().parent();
		var p = $(tr).find('select[id="mainPosition"]');
		p.val(null);
		p.html('');
		var tmpJobLevel = $(tr).find('select[id="mainPositionJobLevel"]');
		tmpJobLevel.val(null);
		tmpJobLevel.html("");
		changeJob(p, newValue.id);
	}
}

//更改介绍人部门
function changeIntroducerDept(oldValue,newValue,doc){
	
	//先将内容清空
	$("#introducerDept").html("");
	
	if(newValue && ((oldValue == null) || (oldValue.id != newValue.id))){
		$.post(getPath()+'/hr/person/getDept',{personId:newValue.id},function(res){
			if(res && res.org){
				$("#introducerDept").html(res.org.name);
			}
		},'json');
	}
}


$(document).ready(function(){
	if($edit_viewstate == 'ADD'){
		var pp = $('ul[index]');
		if(pp.length==1){
			var f7 = pp.find('div.f7');
			var org = {id:f7.find('input[dataPicker="value"]').val()};
			changeOrg(null,org,f7);
		}
	}
	
	/*$.validator.addMethod('idCard',function(value,element){
		return IdCardValidate.validate(value);
	},'身份证号码格式不正确');*/
	initEvents();
	$('#idCard').bind('change',function(){
		var v = $(this).val().replace(/\s+/g,"");
		$(this).val(v);
		var cardType=$("#cardType").val();
		if(cardType=="IDCARD"){
			if(IdCardValidate.validate(v)){
				var sex = IdCardValidate.getSexByIdCard(v);
				$('#'+sex).attr('checked','checked');
				var bday = IdCardValidate.getBirthdayByIdCard(v);
				$('#birthday').val(bday);
			}else{
				$("input[name='idCard']").parent().addClass("l-text-invalid");
				$("input[name='idCard']").attr("title", '身份证号码格式不正确');
				$("input[name='idCard']").poshytip();
			}
			
		}else{
			$("input[name='idCard']").parent().removeClass("l-text-invalid");
			$("input[name='idCard']").removeAttr("title");
			$("input[name='idCard']").poshytip('destroy');
			$(this).val(v);
			if(IdCardValidate.validate(v)){
				var sex = IdCardValidate.getSexByIdCard(v);
				$('#'+sex).attr('checked','checked');
				var bday = IdCardValidate.getBirthdayByIdCard(v);
				$('#birthday').val(bday);
			}
		}
		if(v != null && v != ""){
			var param = {};
			param.idcard = v;
			param.id=$("#applyPersonId").val();
			param.cardType=$("#cardType").val();
			$.post(getPath()+"/hr/person/idcard/judge",param,function(res){
				if(res.MSG){
					if(res.ret=="1"){
						art.dialog.tips("该人员已存在系统！");
						$("#idCard").val("");
					}else{
					    window.location.href=getPath()+'/hr/employeeOrientation/edit?VIEWSTATE=ADD&id=""&idcard='+v;
					}
		        }
			},"json");
		}
	});
	if($edit_viewstate == 'ADD'){
		changeMainJob();
		changePartTimeJob();
	}
	
	if($edit_viewstate == 'EDIT'){
		/*****************职位****************/
		$("select[id='mainPosition']").bind("focus",function(){
			changeMainJob();
		});
		$('form').find('select[name="position"]').each(function(){
			$(this).bind("focus",function(){
				var orgComp = $(this).parent().parent().find("input[name='org.id']");
				changeJob($(this),orgComp.val());
			});
		});
		/****************************/
		
		/*****************职级****************/
		$("select[id='mainPositionJobLevel']").bind("focus",function(){
			initChangeMainJobLevel();
		});
		$('form').find('select[name="jobLevel"]').each(function(){
			$(this).bind("focus",function(){
				var positionComp = $(this).parent().parent().find("select[name='position']");
				changeJobLevel($(this), positionComp.val());
			});
		});
		/****************************/
	}
});

//改变主要职位的职级
function initChangeMainJobLevel(){
	var jl = $('select[id="mainPositionJobLevel"]');
	var positionId = $('select[id="mainPosition"]').val();
	if(positionId){
		changeJobLevel(jl, positionId);
	}
}

//改变主要职位的职位的时候
function bindMainPositionEvent(){
	$("select[id='mainPosition']").unbind("change");
	$("select[id='mainPosition']").bind("change",function(){
		
		changeMainJobLevel($(this));
	});
}

//改变主要职位
function changeMainJob(){
	
	changeJob($("select[id='mainPosition']"), $("#mainPositionOrg input[dataPicker='value']").val())
}

//改变职级
function changeJobLevel(selectComp,positionId,jobNumber){
	$(selectComp).val(null);
	$(selectComp).html("");
	var jobNumbers = $("#jobNumbers").val();
	var jobLevel = $("#jobLevel").val();
	$.post(getPath()+'/basedata/position/getJobLevelByPosition',{position:positionId},function(res){
		if(res && res.length > 0){
			for(var i = 0; i < res.length; i++){
				if(jobNumbers && jobLevel && res[i].level && jobNumber 
						&& jobNumbers.indexOf(jobNumber)>=0 && jobLevel==res[i].level){
					continue;
				}
				$('<option value="'+res[i].id+'" level="'+res[i].level+'" >'+res[i].name+'</option>').appendTo(selectComp);
			}
			$("#mainJobLevelName").val($("#mainPositionJobLevel option:selected").text());
		}
	},'json');
}

//改变职位
function changeJob(selectComp,orgId){
	$(selectComp).val(null);
	$(selectComp).html("");
	$.post(getPath()+'/basedata/position/getByOrg',{org:orgId},function(res){
		if(res && res.length > 0){
			for(var i = 0; i < res.length; i++){
				var jobNumber = "";
				if(res[i].job){
					jobNumber = res[i].job.number ;
				}
				$('<option value="'+res[i].id+'" jobNumber="'+jobNumber+'">'+res[i].name+'</option>').appendTo(selectComp);
			}
			selectComp.trigger('change');
		}
	},'json');
}

//改变主要职位的职级
function changeMainJobLevel(obj){
	var topComp = $(obj).parent().parent();
	var jl = topComp.find('select[id="mainPositionJobLevel"]');
	var positionId = topComp.find('select[id="mainPosition"]').val();
	var jobNumber = $("#mainPosition option:selected").attr("jobNumber"); 
	if(positionId){
		changeJobLevel(jl, positionId,jobNumber);
	}
}

//兼职的 岗位
function bindPartTimeJobEvent(){
	$('form').find('select[name="position"]').each(function(){
		var d = this;
		$(d).unbind('change');
		$(d).bind('change',function(){
			changePartTimeJobLevel($(d));
		});
	});
}

//兼职职位
function changePartTimeJob(){
	$('form').find('select[name="position"]').each(function(){
		var orgComp = $(this).parent().parent().find("input[name='org.id']");
		changeJob($(this),orgComp.val());
	});
}


//兼职的职级
function changePartTimeJobLevel(obj){
	var ul = $(obj).parent().parent();;
	var jl = $(ul).find('select[name="jobLevel"]');
	if($(obj).val()){
		changeJobLevel(jl, $(obj).val());
	}
}


//初始化经纪人证那一块的事件
function initAgentCertificateEvents(){
	//新增经纪人证按钮
	$("#addAgentCertificate").live("click",function(event){
		addAgentCertificate();
		
	});
	
	//移除经纪人证按钮
	$("div[name='deleteAgentCertificateBtn']").live("click",function(){
		deleteAgentCertificate($(this).parent().parent().attr("index"));
	});
}

//初始化奖惩记录那一块的事件
function initRewardPunishmentEvents(){
	//新增奖惩记录按钮
	$("#addRewardPunishment").live("click",function(event){
		addRewardPunishment();
		
	});
	
	//移除奖惩记录按钮
	$("div[name='deleteRewardPunishmentBtn']").live("click",function(){
		deleteRewardPunishment($(this).parent().parent().attr("index"));
	});
}

//最高学历事件
function initHighestEducationEvent(){
	var index=0;
	$("input[name='highest']").live("click",function(){
		$("input[name='highest']").each(function(i){
			$(this).removeAttr("checked");
			$("#type_"+index).unbind("change"); //hetengfeng add
		});
		$(this).attr("checked","checked");		//当前选中
		
		//hetengfeng add
		index=$(this).parent().parent().attr("index");
		if($(this).attr("checked")=="checked"){
			$("#type_"+index).bind("change",function(){
				$("#highestEducation").attr("value",$(this).val());
			});
			$("#highestEducation").attr("value",$("#type_"+index).val());
		}
	});
}



//初始化教育经历那一块的事件
function initEducationEvents(){
	initHighestEducationEvent();
	//新增教育经历按钮
	$("#addEducation").live("click",function(event){
		addEducation();
		initHighestEducationEvent();
	});
	
	//移除教育经历按钮
	$("div[name='deleteEducationBtn']").live("click",function(){
		deleteEducation($(this).parent().parent().attr("index"));
	});
}

//初始化工作经历那一块的事件
function initWorkExperienceEvents(){
	//新增工作经历按钮
	$("#addWorkExperience").live("click",function(event){
		addWorkExperience();
		
	});
	
	//移除工作经历按钮
	$("div[name='deleteWorkExperienceBtn']").live("click",function(){
		deleteWorkExperience($(this).parent().parent().attr("index"));
	});
}

//附加信息里面的 
//function initCheckboxEvents(){
//	$(":checkbox[name='otherInfo']").bind("click",function(){
//		if($(this).is(":checked")){
//			$("#"+$(this).attr("key")).show();
//		} else {
//			$("#"+$(this).attr("key")).hide();
//		}
//	});
//	
//	$("span[key='checkboxWord']").bind("click",function(){
//		var checkboxComp = $(this).prev("input");
//		checkboxComp.attr("checked",!checkboxComp.attr("checked"));
//		if(checkboxComp.attr("checked")){
//			$("#"+checkboxComp.attr("key")).show();
//		} else {
//			$("#"+checkboxComp.attr("key")).hide();
//		}
//	});
//}


var partTimeJobDataObj;
var workExperienceDataObj;
var educationDataObj;
var rewardPunishmentDataObj;
var agentCertificateDataObj;
function checkBoxFun(obj){
	operateTrComp(obj);
}

function spanFun(obj){
	var checkboxComp = $(obj).prev("input");
	checkboxComp.attr("checked",!checkboxComp.attr("checked"));
	operateTrComp(checkboxComp)
}

//操作行
function operateTrComp(obj){
	var key = $(obj).attr("key");
	if($(obj).is(":checked")){
		if($("#"+key).length > 0){
			$("#"+key).show();
			triggerEvent(key);
		} else {
			$(obj).parent().parent().after(getObjValue(key));
		}
	} else {
		setObjValue(key);
		$("#"+key).remove();
	}
}

function triggerEvent(key){
	if(key == "partTimeJobData"){		//兼职
		$("#addPartTimeJob").trigger("click");
	} else if(key == "workExperienceData"){		//工作经历
		$("#addWorkExperience").trigger("click");
	} else if(key == "educationData"){			//教育经历
		$("#addEducation").trigger("click");
	} else if(key == "rewardPunishmentData"){	//奖惩记录
		$("#addRewardPunishment").trigger("click");
	} else {									//经纪人证
		$("#addAgentCertificate").trigger("click");
	}
}

//设置值
function setObjValue(key){
	if(key == "partTimeJobData"){		//兼职
		partTimeJobDataObj = $("#"+key).clone();
	} else if(key == "workExperienceData"){		//工作经历
		workExperienceDataObj = $("#"+key).clone();
	} else if(key == "educationData"){			//教育经历
		educationDataObj = $("#"+key).clone();
	} else if(key == "rewardPunishmentData"){	//奖惩记录
		rewardPunishmentDataObj = $("#"+key).clone();
	} else {									//经纪人证
		agentCertificateDataObj = $("#"+key).clone();
	}
}

//得到值
function getObjValue(key){
	if(key == "partTimeJobData"){		//兼职
		return partTimeJobDataObj;
	} else if(key == "workExperienceData"){		//工作经历
		return workExperienceDataObj;
	} else if(key == "educationData"){			//教育经历
		return educationDataObj;
	} else if(key == "rewardPunishmentData"){	//奖惩记录
		return rewardPunishmentDataObj;
	} 									
	
	//经纪人证
	return agentCertificateDataObj;

}

function initEvents(){
	
	initCommonEvent();
	
	initWorkExperienceEvents();
	initEducationEvents();
	initRewardPunishmentEvents();
	initAgentCertificateEvents();
//	initCheckboxEvents();
	
	//新增兼职按钮
	$("#addPartTimeJob").bind("click",function(event){
		addPersonPosition();
		
	});
	
	//移除兼职按钮
	$("div[name='deletePartTimeJobBtn']").live("click",function(){
		deletePosition($(this).parent().attr("index"));
	});
	
	
	//绑定主要任职信息，改变职位的时候改变相应职级
	bindMainPositionEvent();
	
	bindPartTimeJobEvent();
	
	//名字输入完之后自动带出简写
	$('#name').bind('change',function(){
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
		});
	});
	$('input[name="primary"]').each(function(){
		var cbx = this;
		$(cbx).unbind('change');
		$(cbx).bind('change',function(){
			if($(cbx).attr('checked')==true || $(cbx).attr('checked')=='checked'){
				$('input[name="primary"]').each(function(){
					if(this!=cbx){
						$(this).removeAttr('checked');
					}
				});
			}
		});
	});
	$('#uploadButton').bind('click',function(){
		$('#uploadPhoto').trigger('click');
	});

}

function saveSubmit(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/employeeOrientation/updateSubmit");
	saveEdit(dlg);
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/employeeOrientation/cancleBill");
	saveEdit(dlg);
}
