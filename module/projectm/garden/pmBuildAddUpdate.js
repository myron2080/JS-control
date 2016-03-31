function modifyLiuiId(clonetr){
	$('#unitTab tbody').append(clonetr);
	$('#unitTab tr:last [name=unitId]').val('');
	//var nlId='unitName'+(i++);
	//$('#unitTab tr:last [name=unitName]').attr('name',nlId).attr('id',nlId);
	/*$('#unitTab tr:last input').blur(function(){
		$(this).metadata();
	});*/
	var t=i++;
	var form = $('form').ligerForm();
	$("#unitTab tr:last input,#unitTab tr:last select").each(function ()
    {	
		var name=$(this).attr('key');
		var id=$(this).attr('id');
		$(this).attr('name',name+t).attr('id',id+t);
        form.options.editorBulider.call(form, $(this));
    });
	//var f=$.validator();
	//var f1=$.validator.currentForm;
	//$("form").validate()
//		initPageState();
//		if($edit_viewstate!='VIEW'){
//			initForm();
//		}
	//document.write('<script type="text/javascript" src="'+base+'/default/js/control/validation/jquery.validate.js"></script>');
	//document.write('<script src="'+base+'/default/js/common/Autocomplete.js" type="text/javascript"></script>');
}


function distin(){
	var check=$('#distinguish').attr('checked');
	if(check=='checked'){
		$('#unitTab tr .unitTd').show();
		$('#addUnitTr').show();
		$('#opTd a').show();
	}else{
		$('#unitTab tr .unitTd').hide();
		$('#addUnitTr').hide();
		$('#opTd a').hide();
	}
	isShowDelete();		
}

function isShowDelete(){
	var trNum=$('#unitTab tr').length;
	if(trNum>1){
		$('#opTd #deleteBtn').show();
	}else{
		$('#opTd #deleteBtn').hide();
	}
}

function deleteUnit(obj){
	var unitId=$(obj).closest('tr').find('[name=unitId]').val();
	if(unitId){
		$('[id=deleteId]:first').val(unitId);
		$('form').append($('[id=deleteId]:first').clone());
	}
	$(obj).closest('tr').remove();
	isShowDelete();	
}

function copyUnit(obj){
	var clonetr=$(obj).closest('tr').clone();
	modifyLiuiId(clonetr);
	$('#unitTab tr:last #airConditionType').val($(obj).closest('tr').find('#airConditionType').val());
	isShowDelete();	
}

function saveBuild(dlg){
	//Loading.init();
	//var para=$('form').serialize();
	var unitJsonStr='[';
	$('#unitTab tr').each(function(){
		unitJsonStr+='{';
		$(this).find('input,select').each(function(){
			var val=$(this).val();
			var type=$(this).attr('type');
			if(type=='checkbox'){
				var checStr=$(this).attr('checked');
				if(val && checStr){
					unitJsonStr+=$(this).attr('key')+':true,';
				}
			}else{
				if(val){
					unitJsonStr+=$(this).attr('key')+':"'+val+'",';
				}
				
			}
		});
		if(unitJsonStr!='[{'){
			unitJsonStr=unitJsonStr.substring(0,unitJsonStr.length-1);
		}
		unitJsonStr+='},';
	});
	unitJsonStr=unitJsonStr.substring(0,unitJsonStr.length-1)+']';
	//para+='&unitJsonStr='+unitJsonStr;
	$('#unitJsonStr').val(unitJsonStr);
	var flag=true;
	$('[key=unitName]:visible').each(function(){
		var oName=$(this).val();
		var oId=$(this).attr('name');
		/*if(!oName){
			art.dialog.tips('单元名不能为空');
			validetError(this,'单元名不能为空');
			flag=false;
			return;
		}*/
		var _this=this;
		$('[key=unitName][name!='+oId+']:visible').each(function(){
			var iName=$(this).val();
			if(iName && oName==iName){
				art.dialog.tips('单元名不能重复');
				//$(this).css('border','1px solid red');
				//$(this).addClass('error').title('单元名不能重复');
				//$(this).closest('div').addClass('l-text-invalid');
				validetError(this,'单元名不能重复');
				validetError(_this,'单元名不能重复');
				flag=false;
				return;
			}
		});
	}); 
	if($('[name=propertyTypes]:checked').length==0){
		flag=false;
		art.dialog.tips('必须选择一种用途');
		return;
	}
	$('em:contains("*")').closest('td').next().find('select:visible').each(function(){
		$(this).css('color','#666');
		if(!$(this).val()){
			//String tis=$(this).closest('td').prev().find()
			art.dialog.tips('此选项不能为空');
			$(this).css('color','red');
			flag=false;
			$(this).change(function(){
				$(this).css('color','#666');
			});
			return;
		}
		
	});
	//$('[name=unitName]:gt(0)').metadata();
	if(flag) saveAdd(dlg); 
}

function validetError(obj,title){
	$(obj).addClass('error').attr('title',title);
	$(obj).closest('div').addClass('l-text-invalid');
}
	
function property(){
	$('[BUILDING],[FACTORY]').hide();
	$('[name="propertyTypes"]:checked').each(function(){
		$('['+$(this).val()+']').show();
	});
}

	
	