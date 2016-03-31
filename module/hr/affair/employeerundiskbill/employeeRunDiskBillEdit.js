$(document).ready(function(){
	initCommonEvent();
	/*$.validator.addMethod('idCard',function(value,element){
		return IdCardValidate.validate(value);
	},'身份证号码格式不正确');*/
	//名字输入完之后自动带出简写
	$('#name').bind('change',function(){
		var v = $('#name').val().trim();
		$('#name').val(v);
		toPinyin($(this).val(),function(result){
			$('#simplePinyin').val(result.simple);
		});
	});
	
	$('#idCard').bind('blur',function(){
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
			
			if(v != null && v != ""){
				var param = {};
				param.idcard = v;
				param.id=$("#dataId").val();
				$.post(getPath()+"/hr/employeerundiskbill/getPersonByIdCard",param,function(res){
					 
					if(res && res.person){
						var person = res.person;
						if(person.jobStatus && person.jobStatus.number != "DIMISSION"){
							art.dialog.tips("存在身份证为["+param.idcard+"]的员工, 不能新增跑盘");
							$('#idCard').val('');
							return ;
						}
						$('#name').val(person.name||'');
						$('#number').val(person.number||'');
						$('#applyPersonId').val(person.id||'');
						$('#simplePinyin').val(person.simplePinyin||'');
						$('#oldName').val(person.oldName||'');
						$('#phone').val(person.phone||'');
						$('#crashContract').val(person.crashContract||'');
						$('#contractPhone').val(person.contractPhone||'');
						$('#photo').val(person.photo||'');
						$('#email').val(person.email||'');
			        }
				},"json");
			}
		}else{
			$("input[name='idCard']").parent().removeClass("l-text-invalid");
			$("input[name='idCard']").removeAttr("title");
			$("input[name='idCard']").poshytip('destroy');
		}
	});
});


function saveAdd(preWinObj,operateType){
	currentDialog = preWinObj; 
	submitData(preWinObj,operateType);
}

function submitData(preWinObj,operateType){
	var flag = true;
	var mainPositionOrgId = $("#mainPositionOrgId").val();
	if(!mainPositionOrgId){
		art.dialog.tips("请选择部门!");
		return ;
	}
	
     if(operateType=="SUBMIT"){
    	 $("#billStatus").val("SUBMIT");
     }else if(operateType=="SAVE"){
    	 if(!$("#billStatus").val()){
        	 $("#billStatus").val("SAVE");
          }
     }
     
	 if(flag){
		 $("form").submit();
	 }
	 
}

/**
 * 选择申请人
 * @param oldValue
 * @param newValue
 * @param doc
 */
function changeOrg(oldValue,newValue,doc){
	 $("#mainPositionOrgId").val(newValue["position.belongOrg.id"]||"");
	 $("#mainPositionOrgName").val(newValue["position.belongOrg.name"]||"");
	 $("#mainPositionId").val(newValue["position.id"]||"");
	 $("#mainPositionName").val(newValue["position.name"]||"");
	 $("#mainJobLevelId").val(newValue["jobLevel.id"]||"");
	 $("#mainJobLevelName").val(newValue["jobLevel.name"]||"");
}


function saveSubmit(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/employeerundiskbill/updateSubmit");
	saveAdd(dlg,'SUBMIT');
}

function cancleBill(dlg){
	$('#dataForm').attr('action',getPath()+"/hr/employeerundiskbill/cancleBill");
	saveAdd(dlg,'REVOKE');
}
