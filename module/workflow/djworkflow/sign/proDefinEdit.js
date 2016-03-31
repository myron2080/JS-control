  var currentDlg;
  $(document).ready(function(){
	  typeChange();
	  isSendEndMsgck();
	  changeOrg(null,{"id":$("#orgId").val()},null); 
	  if($("#dataId").val()){
		  $("#ul_signlist li[id^='li_step_']").find("select[id^='fetchType_']").each(function(idx,el){
			  fetchTypeChange(el); 
		  });
	  }else{
		  addStep();
		  var fetchType=$("#ul_signlist li[id^='li_step_']").find("select[id^='fetchType_']")[0];
		  fetchTypeChange(fetchType); 
	  }
  });
  function typeChange(){
	  var type=$("#processModel").val();
	  if(type=='ACTIVITY'){
		  $("#fileDataForm").show();
		  $("#diy_div").hide();
		  $("#isDIY").val("");
		  $("#isDIY_CK").attr("checked",false);
	  }else{
		  $("#diy_div").show();
		  $("#fileDataForm").hide();
		  $("#file").val("");
	  }
  }
	var editState = art.dialog.data("EDITSTATE");
	function judgeProcessNum(param){
		$.post(getPath()+"/djworkflow/proDefi/judgeNumber",param,function(res){
			if(res.MSG){
				$("input[name='processNumber']").parent().addClass("l-text-invalid");
				$("input[name='processNumber']").attr("title", res.MSG);
				$("input[name='processNumber']").poshytip();
	        }else{
	        	$("#dataForm").submit();
	        }
		},"json");
	}
	function deploy(dlg){
		currentDialog = dlg;
		var param ={};
		param.id=$("input[name='id']").val();
		param.processNumber =$("input[name='processNumber']").val();	
		judgeProcessNum(param);
		return false;
	}
	
	function saveEdit(dlg){
		currentDlg = dlg;
		var v = $('#file').val();
		var type=$("#processModel").val();
		if($("#isDIY_CK")[0].checked){
			$("#isDIY").val(1);
		}else{
			$("#isDIY").val(0);
		}
		if($("#isSendEndMsg").val()==1 && ($("#messageMode").val()==null || $("#messageMode").val()=="")){
			art.dialog.tips('请设置消息模板！'); 
			return false;
		}else{
			var signStepList ="[" ;
			$("#ul_signlist li[id^='li_step_']").each(function(i,liObj){
				var fetchType=$("#fetchType_"+i,liObj).val();
				var reportOrgLevel = $("#reportOrgLevel_"+i,liObj).val();
				var orgId = $("#orgId_"+i).val();
				var jobIdF7Id = $("#jobIdF7Id_"+i).val();
				var jobId=jobIdF7Id==null || jobIdF7Id==''?$("#jobIdInput_"+i).val():jobIdF7Id;
				var personId= $("#personId_"+i).val(); 
				
				if(signStepList!="["){
					signStepList+=",";
				}
				signStepList+="{fetchType:'"+fetchType+"',reportOrgLevel:'"+reportOrgLevel+"',orgId:'"+orgId+"',jobId:'"+jobId+"',curDealPerson:{id:'"+personId+"'}}";
			});
			signStepList+="]"
			$("#snedMessageDefStr").val(signStepList);
			
		}
		 
		if(type=='ACTIVITY'){
			if(($("#dataId").val()==null || $("#dataId").val()=='') && (!v ||  v.toLowerCase().lastIndexOf('.zip') != v.length-4)  ){
				art.dialog.tips('请选择zip压缩文件');
				return false;
			} 
			if(v){
				if(v.toLowerCase().lastIndexOf('.zip') == v.length-4){
					$('#fileDataForm').ajaxSubmit({
						success:function(res){
							if(res.STATE=="SUCCESS"){
								//art.dialog.tips("部署成功");
								$('#fileDataForm')[0].reset();
								$('#deploymentId').val(res.deploymentId);
								deploy(currentDlg);
							}else{
								art.dialog.tips(res.MSG);
							}
						},  
	                 error: function(XmlHttpRequest, textStatus, errorThrown){  
	                    alert( "error");  
	                 },
	                 dataType:'json'
					});
				}else{
					art.dialog.tips('请选择zip文件');
				}
			}else{
				deploy(currentDlg);
			}
		}else{
			deploy(currentDlg);
		}
	}
	
 function isSendEndMsgck(){
		var isSendEndMsg=$("#isSendEndMsg_CK")[0].checked;
		if(isSendEndMsg){
			$("#isSendEndMsg").val(1);
			$("#messageMode_ul").show();
			$("#diy_tb").show();
			
		}else{
			$("#diy_tb").hide();
			$("#messageMode_ul").hide();
			$("#isSendEndMsg").val(0);
			$("#messageMode").val("");
		}
 }
 

 function fetchTypeChange(el){
	var id=el.id;
	var idx=id.substr(id.indexOf("_"),id.length);
 	var vl=$(el).val();
 	if(vl=='REPORTORG'){ //汇报组织
 		$("#reportOrgLevel"+idx).show();
 		$("#jobIdF7"+idx).show();
 		$("#orgF7"+idx).hide();
 		
 		$("#jobIdInput"+idx).hide();
 		
 		$("#orgId"+idx).val("");
 		$("#orgName"+idx).val("");
 		$("#jobId"+idx).val("");
 		$("#personF7"+idx).hide();
 		$("#personId"+idx).val("");
 		$("#personName"+idx).val("");
 	}else if(vl=='APPOINTPOSITION'){//指定职位
 		$("#reportOrgLevel"+idx).val("");
 		$("#jobIdF7Id"+idx).val("");
 		$("#jobName"+idx).val("");
 		$("#personId"+idx).val("");
 		$("#personName"+idx).val("");
 		
 		$("#reportOrgLevel"+idx).hide();
 		$("#jobIdF7"+idx).hide();
 		$("#orgF7"+idx).show();
 		
 		$("#jobIdInput"+idx).show();
 		$("#personF7"+idx).hide();
 	}else if(vl=='BILLPEOPLE'){//单据人员
 		$("#reportOrgLevel"+idx).hide();
 		$("#jobIdF7"+idx).hide();
 		$("#orgF7"+idx).hide();
 		$("#jobIdInput"+idx).hide();
 		$("#jobName"+idx).hide();
 		$("#personF7"+idx).hide();
 		
 		$("#orgId"+idx).val("");
 		$("#orgName"+idx).val("");
 		$("#jobIdInput"+idx).val("");
 		$("#jobIdF7Id"+idx).val("");
 		$("#orgName"+idx).val("");
 		$("#reportOrgLevel"+idx).val("");
 		
 		$("#personId").val("");
 		$("#personName").val("");
 		
 	} else if(vl=='APPOINTPEOPLE'){//指定人员 
 		$("#reportOrgLevel"+idx).hide();
 		$("#jobIdF7"+idx).hide();
 		$("#orgF7"+idx).show();
 		$("#jobIdInput"+idx).hide();
 		$("#jobName"+idx).hide();
 		
 		$("#jobIdInput"+idx).val("");
 		$("#jobIdF7Id"+idx).val("");
 		$("#reportOrgLevel"+idx).val("");
 		
 		$("#personF7"+idx).show();
 	}
 }
 
 /**
  * 选择申请人
  * @param f7Id
  */
 function openDataPickerNew(f7Id){
 	var orgId = $("#orgId").val();
 	if(!orgId){
 		art.dialog.alert('请先选择组织');
 		return ;
 	}
 	openDataPicker(f7Id);
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
 }
 /**
  * 部门变化时初始化岗位 
  * @param oldValue
  * @param newValue
  * @param doc
  */
 function changeOrg(oldValue,newValue,doc){
 	var jobId="";
 	var id=$(doc).attr("id");
 	if(id){
	 	var idx=id.substr(id.indexOf("_"),id.length);
	 	var stepJob = $("#jobIdInput"+idx);
	 	$("option :gt(0)",stepJob).remove();
	 	if(newValue){
	 		$.post(getPath()+'/basedata/position/getByOrg',{org:newValue.id},function(res){
	 			if(res && res.length > 0){
	 				for(var i = 0; i < res.length; i++){
	 					if(jobId==res[i].job.id){
	 						$('<option value="'+res[i].job.id+'" selected>'+res[i].job.name+'</option>').appendTo(stepJob); 
	 					}else{
	 						$('<option value="'+res[i].job.id+'">'+res[i].job.name+'</option>').appendTo(stepJob);
	 					}
	 				}
	 			}
	 		},'json');
	 	}
	 	var stepPerson = $("#jobIdInput"+idx);
	 	$("option :gt(0)",stepPerson).remove();
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
 	var idx=$("#ul_signlist li[id^='li_step_']").length-1;
	var fetchType=$("#li_step_"+idx).find("select[id^='fetchType_']")[0];
	fetchTypeChange(fetchType); 
 }
 
 /**
  * 重新渲染审批步骤行的索引
  */
 function renderStepIndex(){
 	var stepCount = $("#ul_signlist li[id^='li_step_']").length ;
 	if(stepCount >= 15){
 		return ;
 	}
 	$("#ul_signlist li[id^='li_step_']").each(function(i,stepObj){
 		$(stepObj).attr("id","li_step_"+i);
 		$(stepObj).find("*[id!='']").each(function(n,el){
 			var id= el.id;
 			id=id.substr(0,id.indexOf("_")+1);
 			$(el).attr("id",id+i);
 		});
 	});
 }
 
 /**
  * 打开步骤上的F7
  * @param obj
  */
 var openF7Id = '' ;
 function openStepF7(obj){
 	var f7Id = $(obj).parents("div:first").attr("id");
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
 
 	if(name == "stepOrgF7"){
 		$("#stepJobF7_"+index+" option:gt(0)").remove();
 		$("#stepPersonF7_"+index+" option:gt(0)").remove();
 		$("#"+f7Id).find("#stepOrgName").val($("#"+f7Id).find("#stepOrgName").attr("defaultValue"));
 	}else if(name == "stepJobF7"){
 		$("#stepPersonF7_"+index+" option:gt(0)").remove();
 	}
 }
 /**
  * 删除
  * @param obj
  */
 function stepDelete(obj){
 	$(obj).parents("li").remove();
 	//重新渲染索引
 	renderStepIndex();
 }
 
 
 
