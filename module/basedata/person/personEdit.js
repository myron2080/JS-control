function saveEdit(dlg){
	currentDialog = dlg;
	var str = "[";
	var flag = true;
	var positions = {};
	var hasPrimary = false;
	var birthday=$("#birthday").val();
	if(!birthday){
		art.dialog.tips('出生日期不能为空。');
		return ;
	}
	$('form').find('ul[index]').each(function(index,doc){
		var org = $(doc).find('input[dataPicker="value"]').val();
		var position = $(doc).find('select[name="position"]').val();
		var jobLevel = $(doc).find('select[name="jobLevel"]').val();
		var primary = $(doc).find('input[name="primary"]')[0].checked;
		var effectDate = $(doc).find('input[name="effectDate"]').val(); 
		var id = $(doc).find('input[name="id"]').val();
		
		var chargeOrgIds = $(doc).find('input[name="chargeOrgIds"]').val();
		var chargeOrgNumbers = $(doc).find('input[name="chargeOrgNumbers"]').val();
		var chargeOrgNames = $(doc).find('input[name="chargeOrgNames"]').val();
		
 
		
		if(position==null || position == ''){
			art.dialog.tips('任职职位不能为空');
			flag = false;
			return false;
		}else{
			if(positions[position]){
				art.dialog.tips('存在重复的任职职位,请确认');
				flag = false;
				return false;
			}
			positions[position] = position;
			str += "{'position':{'id':'" + position + "'},";
		}
		if(jobLevel==null || jobLevel == ''){
			art.dialog.tips('任职职级不能为空');
			flag = false;
			return false;
		}else{
			str += "'jobLevel':{'id':'" + jobLevel + "'},";
		}
		if(primary==true || primary=='checked'){
			hasPrimary = true;
			str += "'primary':" + "true,";
		}else{
			str += "'primary':" + "false,";
		}
		if(id){
			str += "'id':'"+id+"',";
		}else{
			str += "'id':'',";
		}
		
		if(chargeOrgIds){
			str += "'chargeOrgIds':'"+chargeOrgIds+"',";
		}else{
			str += "'chargeOrgIds':'',";
		}
		
		if(chargeOrgNumbers){
			str += "'chargeOrgNumbers':'"+chargeOrgNumbers+"',";
		}else{
			str += "'chargeOrgNumbers':'',";
		}
		
		if(chargeOrgNames){
			str += "'chargeOrgNames':'"+chargeOrgNames+"',";
		}else{
			str += "'chargeOrgNames':'',";
		}
		
		if(effectDate){
			str += "'effectDate':'"+effectDate+"'";
		}else{
			art.dialog.tips('任职日期不能为空');
			flag = false;
			return false;
		} 
		str +="},";
	});
	if(str!='['){
		str = str.substring(0,str.length - 1);
	}
	str += "]";
	if(!hasPrimary){
		art.dialog.tips('没有主要任职信息');
		return false;
	}
	if(flag){
		$('#positionJson').val(str);
		$("form").submit();
	}
	return false;
}
function saveAdd(dlg){
	saveEdit(dlg);
}

function addPersonPosition(){
	var index = 0;
	$('form').find('ul[index]').each(function(){
		var idx = parseInt($(this).attr('index'));
		if(idx >= index){
			index = idx+1;
		}
	});
	$('<ul index="'+index+'">'
	+'	<li class="field_label_li" style="width:45px">组织：</li>'
	+'	<li style="width:80px;text-align:left;">'
	+'  	<input type="hidden" name="id" />'
	+'		<div class="f7" id="org_'+index+'" dataPickerUrl="'+getPath()+'/basedata/org/orgDataPicker" width="750px" height="500px" onchange="changeOrg" title="组织">'
	+'    		<input dataPicker="value"  name="org.id" type="hidden" readOnly="readOnly" />'
	+'    		<input dataPicker="name" ondblclick="openDataPicker(\'org_'+index+'\')"name="org.name" type="text"/>'
	+'			<strong onclick="clearDataPicker(\'org_'+index+'\')"></strong>'
	+'			<span class="p_hov" onclick="openDataPicker(\'org_'+index+'\')"></span>'
	+'		</div>'
	+'	</li>'
	+'	<li class="field_label_li" style="width:45px">职位：</li>'
	+'	<li style="width:80px;text-align:left;">'
	+'		<select name="position" style="width:80px">'
	+'		</select>'
	+'	</li>'
	+'	<li class="field_label_li" style="width:45px">职级：</li>'
	+'	<li style="width:80px;text-align:left;">'
	+'		<select name="jobLevel" style="width:80px">'
	+'		</select>'
	+'	</li>'
	+'	<li class="field_label_li" style="width:65px">任职日期：</li>'
	+'	<li style="text-align:left;">'
	+'		<input name="effectDate" style="width:90px" id="effectDate'+index+'" class="Wdate" onfocus="WdatePicker({dateFmt:\'yyyy-MM-dd\'})"/>'
	+'	</li>'
	+'	<li style="width:80px;text-align:left;">'
	+'		<label><input style="margin-left: 10px;width:15px; height:15px;" name="primary" type="checkbox" value="true"/><span style="letter-spacing:-1px;">主要职位</span></label>'
	+'	</li>'
	
	+' <li class="field_label_li"  style="width:55px; letter-spacing:-1px;">分管组织：</li>'
	+'	 <li style="width:80px;text-align:left;">'
	+'		<input type="hidden" name="chargeOrgNumbers"  id="chargeOrgNumbers'+index+'" value=""/>'
	+'		<div class="f7" id="chargeOrg_'+index+'" dataPickerUrl="'+getPath()+'/basedata/org/orgDataPicker?multi=true" width="750px" height="500px" isMultiple=true onchange="changeChargeOrg" title="组织">'
	+'		<input dataPicker="value" id="chargeOrgIds'+index+'"  name="chargeOrgIds" value="" type="hidden" readOnly="readOnly" />'
	+' 		<input dataPicker="name" ondblclick="openDataPicker(\'chargeOrg_'+index+'\')" value="" name="chargeOrgNames" type="text"/>'
	+'		<strong onclick="clearDataPicker(\'chargeOrg_'+index+'\')"></strong>'
	+'		<span class="p_hov" onclick="openDataPicker(\'chargeOrg_'+index+'\')"></span>'
	+'	</div>'
	+' </li>'
	 
	+'  <div class="tab_box_close"><a class="delete" href="javascript:void(0);" onclick="deletePosition(\''+index+'\');"></a></div>'
	
	+'</ul>').appendTo('#positions');
	initEvents();
}

function deletePosition(index){
	$('ul[index="'+index+'"]').remove();
}

function changeOrg(oldValue,newValue,doc){
	var ul = $(doc).parent();
	while(ul.attr('index')==null){
		ul = $(ul).parent();
	}
	var p = $(ul).find('select[name="position"]');
	p.val(null);
	p.html('');
	if(newValue){
		$.post(getPath()+'/basedata/position/getByOrg',{org:newValue.id},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(p);
				}
				p.trigger('change');
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
	/*
	$.validator.addMethod('idCard',function(value,element){
		return IdCardValidate.validate(value);
	},'身份证号码格式不正确');
	*/
	initEvents();
	$('#idCard').bind('blur',function(){
		var v = $(this).val().replace(/\s+/g,"");
		//重新填充
		$(this).val(v);
		var cardType = $("#cardType").val();
		if(cardType == "IDCARD"){
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
		}
	});
});

function initEvents(){
	$('form').find('select[name="position"]').each(function(){
		var d = this;
		$(d).unbind('change');
		$(d).bind('change',function(){
			var ul = $(d).parent();
			while(ul.attr('index')==null){
				ul = $(ul).parent();
			}
			var jl = $(ul).find('select[name="jobLevel"]');
			jl.val(null);
			jl.html('');
			if($(d).val()){
				$.post(getPath()+'/basedata/position/getJobLevelByPosition',{position:$(d).val()},function(res){
					if(res && res.length > 0){
						for(var i = 0; i < res.length; i++){
							$('<option value="'+res[i].id+'">'+res[i].name+'</option>').appendTo(jl);
						}
					}
				},'json');
			}
		});
	});
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
	initUpload();
	//选择系统默认头像
	$("#chooseSystemImage").bind("click",function(){
		popDialog("/hr/person");
	});
}

//选择默认头像的回调函数,名字必须为这个
function chooseImgFun(selectedValue){
	if(selectedValue){
		$("#personPhoto").attr("src",getPath() + '/images/'+selectedValue);
		$("#photo").val(selectedValue);
	}
}

function initUpload(){
	var belong = $('#dataId').val();
	new AjaxUpload($("#uploadButton"), {
    	action: getPath()+'/basedata/photo/upload?direct=person/head'+(belong?('&belong='+belong):''),
        autoSubmit: true,
        name: "image",
        responseType: "json",
        onSubmit: function(file, extension){
            if (extension && /^(jpg|png|gif)$/.test(extension)) {
            }
            else {
                alert("只允许上传jpg|png|gif图片");
                return false;
            }
        },
        onComplete: function(file, json){   
        	if(json.error){
        		alert('图片要求宽大于320，或者高大于240');
        		return;
        	}
        	var url=json.path;
			if(json.STATE == "SUCCESS"){
				$('#photo').val(url);
            	$('#personPhoto').attr('src',getPath() + '/images/' + url);
			} else {
				art.dialog.alert(json.MSG);
			}
        }
	 });
}

function changeChargeOrg(oldValue,newValue,doc){
	if(newValue){ 
		var ul = $(doc).parent();
		while(ul.attr('index')==null){
			ul = $(ul).parent();
		}
		$(ul).find('input[name="chargeOrgNumbers"]').val("");
		var longNumbers="";
		for(i=0;i<newValue.length;i++){
			if(longNumbers!=""){
				longNumbers+=";";
			}
			longNumbers+=newValue[i].longNumber;
		}
		$(ul).find('input[name="chargeOrgNumbers"]').val(longNumbers);
	}
}

