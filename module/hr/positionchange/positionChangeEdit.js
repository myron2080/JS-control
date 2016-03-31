$(document).ready(function(){
	
		
});


function changeOrg(oldValue,newValue,doc){
	var rowIndex = doc[0].id.replace("applyChangeOrgF7","");
	var p = $("#applyChangePositionId"+rowIndex);
	p.val(null);
	p.html('');
	if(newValue){
		$.post(getPath()+'/basedata/position/getByOrg',{org:newValue.id},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(p);
				}
				changePosition(null,rowIndex);
				p.attr("style","width:135px");
				p.trigger('change');
			}
		},'json');
	}
}

function changePosition(obj,index){
	var rowIndex = index||obj.id.replace("applyChangePositionId","");
	var d = $("#applyChangePositionId"+rowIndex);
	d.unbind('change');
	d.bind('change',function(){
		var jl = $("#applyChangeJoblevelId"+rowIndex);
		jl.val(null);
		jl.html('');
		jl.get(0).options.length =0;
		if($(d).val()){
			$.post(getPath()+'/basedata/position/getJobLevelByPosition',{position:d.val()},function(res){
				if(res && res.length > 0){
					for(var i = 0; i < res.length; i++){
						$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(jl);
					}
				}
				jl.attr("style","width:135px");
			},'json');
		}
	});
}

//新增调职单
function addPositionChangeBill(){
	var billsDiv = $("#billsDiv");
	var billDiv = $("#billDiv");
	var billDivClone = billDiv.clone(true,true);
	var addIndex = $("div[id^='billDiv']:last").attr("id").replace("billDiv","");
	addIndex = parseInt(addIndex)+1;//新增索引加1
	
	$("input[id]",billDivClone.get(0)).each(function(){
		this.id += addIndex;
	});
	
	$("div[id]",billDivClone.get(0)).each(function(){
		this.id += addIndex;
	});
	$("select[id]",billDivClone.get(0)).each(function(){
		this.id += addIndex;
	});
	billDivClone.attr("id",(billDivClone.attr("id")+addIndex)) ;
	billDivClone.css("display","block");
	billDivClone.appendTo(billsDiv);
	$("#effectdate"+addIndex).ligerDateEditor();
	//$("#effectdate"+addIndex,billDivClone.get(0)).attr('ltype','date');
	//$('form').ligerForm();
}

//删除调职单
function deletePositionChangeBill(delDiv){
	var rowIndex = delDiv.replace("delDiv","");
	delete window.liger.managers["effectdate"+rowIndex];
	$('#billDiv'+rowIndex).remove();
}

function saveAdd(preWinObj,operateType){
	currentDialog = preWinObj;
	submitData(preWinObj,operateType);
}

function submitData(preWinObj,operateType){
	var flag = true;
	var positionChangeBills =new Array();
	var applyPersonIds = {};
	$("#positionChangeBills").val('');
	
	$("div[id^='billDiv'][id!='billDiv']").each(function(i,billDiv){
		var positionChangeBill = {};
		var rowIndex = this.id.replace("billDiv","");
	    var rowMsg = "第"+(rowIndex)+"个申请单 ";
	    
		 var applyPersonId = $("#applyPersonId"+rowIndex).val();
		 if(!applyPersonId){
			 art.dialog.tips(rowMsg+'请选择调职申请人！');
		     flag = false;
		     return false;
		 }
		 
		 var applyOrgId = $("#applyOrgId"+rowIndex).val();
		 var applyPositionId = $("#applyPositionId"+rowIndex).val();
		 var applyJoblevelId = $("#applyJoblevelId"+rowIndex).val();
		 
		 var applyChangeOrgId = $("#applyChangeOrgId"+rowIndex).val();
		 var applyChangePositionId = $("#applyChangePositionId"+rowIndex).val();
		 var applyChangeJoblevelId = $("#applyChangeJoblevelId"+rowIndex).val();
		 if(!applyChangeOrgId || !applyChangePositionId  || !applyChangeJoblevelId){
			 art.dialog.tips(rowMsg+'请选择正确的变动组织、变动职位、变动职级！');
			 flag = false;
			 return false;
		 }
		 
		 if(applyOrgId==applyChangeOrgId && applyPositionId==applyChangePositionId 
				 && applyJoblevelId==applyChangeJoblevelId){
		 
		     art.dialog.tips(rowMsg+'职位相同，不允许保存！');
		     flag = false;
		     return false;
		 }
		 
		 //构建申请单JSON对象
		 positionChangeBill.id = $("#dataId"+rowIndex).val()||'';
	     positionChangeBill.primary = $("#primary"+rowIndex).val()||'';
	     positionChangeBill.changeType = $("#changeType"+rowIndex).val()||'';
	     var jobStatus = {};
	     jobStatus.id = $("#jobStatus"+rowIndex).val()||'';
	     positionChangeBill.jobStatus = jobStatus;
	     var takeOfficeDate = $("#takeOfficeDate"+rowIndex).val()||'';
	     if(takeOfficeDate){
	    	 positionChangeBill.takeOfficeDate = takeOfficeDate;
	     }
	     positionChangeBill.effectdate = $("#effectdate"+rowIndex).val()||'';
	     positionChangeBill.remark = $("#remark"+rowIndex).val()||'';
	     
	     if(!positionChangeBill.effectdate){
			 art.dialog.tips(rowMsg+'请选择生效日期！');
			 flag = false;
			 return false;
		 }
	     
	     if(takeOfficeDate.trim()>positionChangeBill.effectdate.trim()){
	    	 art.dialog.tips('生效日期不能小于任职日期！');
			 flag = false;
	     }
	
		 if(operateType=="SUBMIT"){
			 positionChangeBill.billStatus = "SUBMIT";
			 
			 if(applyPersonIds[applyPersonId]){
				 art.dialog.tips(rowMsg+' 申请人重复, 不能同时提交申请人相同的调职单！');
				 flag = false;
				 return false;
			 }else{
				 applyPersonIds[applyPersonId] = applyPersonId;
			 }
		 }else if(operateType=="SAVE"){
			 
			 positionChangeBill.billStatus = $("#billStatus"+rowIndex).val()||'SAVE';
		 }else{
			 positionChangeBill.billStatus  = operateType ;
		 }
		 //isdisable 默认为N
		 positionChangeBill.isdisable = $("#isdisable"+rowIndex).val()||'N';
		 var applyPerson = {};
		 applyPerson.id = $("#applyPersonId"+rowIndex).val()||'';
		 applyPerson.number = $("#applyPersonNumber"+rowIndex).val()||'';
		 positionChangeBill.applyPerson=applyPerson;
		 positionChangeBill.applyPersonName = $("#applyPersonName"+rowIndex).val()||'';
		 var applyOrg = {};
		 applyOrg.id = $("#applyOrgId"+rowIndex).val()||'';
		 applyOrg.name = $("#applyOrgName"+rowIndex).val()||'';
		 positionChangeBill.applyOrg = applyOrg; 
		 var applyPosition = {};
		 positionChangeBill.applyPosition = applyPosition;
		 applyPosition.id = $("#applyPositionId"+rowIndex).val()||'';
		 applyPosition.name = $("#applyPositionName"+rowIndex).val()||'';
		 var applyJoblevel = {};
		 positionChangeBill.applyJoblevel = applyJoblevel;
		 applyJoblevel.id = $("#applyJoblevelId"+rowIndex).val()||'';
		 applyJoblevel.name = $("#applyJoblevelName"+rowIndex).val()||'';
		 
		 //变动后 组织 职位 职级
		 var applyChangeOrg = {};
		 applyChangeOrg.id = $("#applyChangeOrgId"+rowIndex).val()||'';
		 applyChangeOrg.name = $("#applyChangeOrgName"+rowIndex).val()||'';
		 positionChangeBill.applyChangeOrg = applyChangeOrg; 
		 var applyChangePosition = {};
		 positionChangeBill.applyChangePosition = applyChangePosition;
		 applyChangePosition.id = $("#applyChangePositionId"+rowIndex).val()||'';
		 applyChangePosition.name = $("#applyChangePositionId"+rowIndex).find("option:selected").text();
		 var applyChangeJoblevel = {};
		 positionChangeBill.applyChangeJoblevel = applyChangeJoblevel;
		 applyChangeJoblevel.id = $("#applyChangeJoblevelId"+rowIndex).val()||'';
		 applyChangeJoblevel.name = $("#applyChangeJoblevelId"+rowIndex).find("option:selected").text();  
		 positionChangeBills.push(positionChangeBill);
	 });
	 if(positionChangeBills.length<1){
		 art.dialog.tips(rowMsg+' 没有可操作的数据！');
		 flag = false;
		 return false;
	 }
	 $("#positionChangeBills").val(JSON.stringify(positionChangeBills));
	 if(flag){
		 $("form").submit();
	 }
	 
}

function approveSingle(preWinObj,approveType,billStatus){
	var billIds = $("#dataId1").val();
	if(!billIds){
		art.dialog.tips("没有需要审核的数据！！");
		return ;
	}
	
	if(billStatus != 'SUBMIT'){
		art.dialog.tips("单据未提交，请先提交申请单！");
		return;
	}
	 
	$.post(getPath()+"/hr/positiondemotion/approve",{billIds:billIds,approveType:approveType},function(data){
		if(data.counter > 0){
			art.dialog.data("MSG",null);
			
			artDialog.open.origin.resetList();
			art.dialog.close();
		} else {
			art.dialog.tips("没有需要审核的数据！！");
		}
	},'json');
}

/**
 * 选择申请人
 * @param oldValue
 * @param newValue
 * @param doc
 */
function choosePerson(oldValue,newValue,doc){
	var rowIndex = doc[0].id.replace("keyPerson","");
	 $("#applyPersonId"+rowIndex).val(newValue.id||"");
	 $("#applyPersonNumber"+rowIndex).val(newValue.number||"");
	 $("#applyPersonName"+rowIndex).val(newValue.name||"");
	 $("#applyOrgName"+rowIndex).val(newValue["personPosition.position.belongOrg.name"]||"");
	 $("#applyOrgId"+rowIndex).val(newValue["personPosition.position.belongOrg.id"]||"");
	 $("#applyPositionName"+rowIndex).val(newValue["personPosition.position.name"]||"");
	 $("#applyPositionId"+rowIndex).val(newValue["personPosition.position.id"]||"");
	 $("#applyJoblevelName"+rowIndex).val(newValue["personPosition.jobLevel.name"]||"");
	 $("#applyJoblevelId"+rowIndex).val(newValue["personPosition.jobLevel.id"]||"");
	 $("#takeOfficeDate"+rowIndex).val(newValue["personPosition.effectDate"]||"");
	 $("#jobStatus"+rowIndex).val(getFieldFromData(newValue,'jobStatus.id')||"");
}


function saveSubmit(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/positionchange/updateSubmit");
	saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/positionchange/cancleBill");
	saveAdd(dlg,'REVOKE');
}
