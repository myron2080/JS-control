function addPosition(){
	var index = $('#positions').find('ul[index]').length;
	var u = $('     <ul index="'+index+'">'
  			+'<li class="field_label_li">岗位：</li>'
  			+'<li style="text-align:left;">'
  			+'  <input type="hidden" name="id" />'
  			+'	<div class="f7" id="job_'+index+'" dataPickerUrl="'+getPath()+'/framework/dataPicker/list?query=jobQuery" width="480px" height="360px" onchange="changePosition" title="岗位">'
  			+'		<input dataPicker="value" name="job.id" type="hidden" readOnly="readOnly" />'
  			+'		<input dataPicker="name" ondblclick="openDataPicker(\'job_'+index+'\')" name="job.name" readonly="readonly" type="text"/>'
  			+'		<strong style="display:none" onclick="clearDataPicker(\'job_'+index+'\')"></strong>'
  			+'		<span class="p_hov" onclick="openDataPicker(\'job_'+index+'\')"></span>'
  			+'	</div>'
  			+'</li>'
  			+'<li class="field_label_li">职位名称：</li>'
  			+'<li style="width:150px;text-align:left;">'
  			+'	<input type="text" name="name" id="name_'+index+'" value=""/>'
  			+'</li>'
  			+'<li style="width:95px;text-align:left;">'
  			+'	<label><input type="checkbox" name="leading" value="1" />负责人职位</label>'
  			+'</li>'
  			+'<li class="field_label_li">汇报职位：</li>'
  			+'<li style="text-align:left;">'
  			+'	<div class="f7" id="report_'+index+'" dataPickerUrl="'+getPath()+'/basedata/position/dataPicker" width="750px" height="440px" onchange="changePosition" title="职位">'
  			+'		<input dataPicker="value"  name="report.id" value="" type="hidden" readOnly="readOnly" />'
  			+'		<input dataPicker="name" ondblclick="openDataPicker(\'report_'+index+'\')" value="" name="report.name" readonly="readonly" type="text"/>'
  			+'		<strong onclick="clearDataPicker(\'report_'+index+'\')"></strong>'
  			+'		<span class="p_hov" onclick="openDataPicker(\'report_'+index+'\')"></span>'
  			+'	</div>'
  			+'</li>'
  			+'<div class="tab_box_close"><a href="javascript:void(0);" onclick="deletePosition(\''+index+'\');"><img src="'+getPath()+'/default/styleBlue/images/delete.png"></img></a></div>'
  			+'</ul>').appendTo($('#positions'));
	$("input,select,textarea",u).each(function(){
		$.ligerui.find('Form')[0].options.editorBulider.call(null,$(this));
	});
	bindLeadingEvent();
}

$(document).ready(function(){
	bindLeadingEvent();
});

function deletePosition(index){
	var id = $('ul[index="'+index+'"]').find('input[name=id]').val();
	if(id){
		$.post(getPath()+"/basedata/position/checkDelete",{id:id},function(res){
			if(res['count'] && res['count'] > 0){
				art.dialog.tips('该职位己被引用,不能删除');
			}else{
				$('ul[index="'+index+'"]').remove();
			}
		});
	}else{
		$('ul[index="'+index+'"]').remove();
	}
}


function bindLeadingEvent(){
	$('input[name="leading"]').each(function(){
		var cbx = this;
		$(cbx).unbind('change');
		$(cbx).bind('change',function(){
			if($(cbx).attr('checked')==true || $(cbx).attr('checked')=='checked'){
				$('input[name="leading"]').each(function(){
					if(this!=cbx){
						$(this).removeAttr('checked');
					}
				});
			}
		});
	});
}

function checkLeading(){
	art.dialog.tips('s');
	return true;
}

function changePosition(oldValue,newValue,doc){
	var name = '';
	if(newValue){
		name = newValue.name;
	}
	var id = doc.attr('id').replace('job_','name_');
	$('#'+id).val(name);
}

function saveEdit(){
	var str = "[";
	var flag = true;
	var jobs = {};
	var hasLeading = false;
	$('form').find('ul[index]').each(function(index,doc){
		var job = $(doc).find('input[name="job.id"]').val();
		var name = $(doc).find('input[name="name"]').val();
		var leading = $(doc).find('input[type="checkbox"]')[0].checked;
		var id = $(doc).find('input[name="id"]').val();
		var report = $(doc).find('input[name="report.id"]').val();
		if(job==null || job==''){
			art.dialog.tips('岗位不能为空');
			flag = false;
			return false;
		}else{
			if(jobs[job]){
				art.dialog.tips('存在重复的岗位,请确认');
				flag = false;
				return false;
			}
			jobs[job] = job;
			str += "{'job':{'id':'" + job + "'},";
		}
		if(name==null || name == ''){
			art.dialog.tips('名称不能为空');
			flag = false;
			return false;
		}else{
			str += "'name':'" + name + "',";
		}
		if(leading==true || leading=='checked'){
			hasLeading = true;
			str += "'leading':" + "true,";
		}else{
			str += "'leading':" + "false,";
		}
		if(id){
			str += "'id':'"+id + "',";
		}else{
			str += "'id':'',";
		}
		if(report){
			str += "'report':{'id':'"+report+"'}";
		}else{
			str += "'report':null";
		}
		str +="},";
	});
	if(str!='['){
		str = str.substring(0,str.length - 1);
	}
	str += "]";
	if(hasLeading != true){
		art.dialog.tips('没有设置负责人职位');
		return false;
	}
	if(flag){
		$('#positionJson').val(str);
		$("form").submit();
	}
	return false;
}
function saveAdd(){
	saveEdit();
}

