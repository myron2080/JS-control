$(function() {
	if ($edit_viewstate == 'VIEW') {
		// F7
		$('#sto,#sto2').each(function() {
			$(this).attr('disabled', 'disabled');
			$(this).find('span').each(function() {
				$(this).removeAttr('onclick');
			});
			$(this).find('strong').each(function() {
				$(this).removeAttr('onclick');
			});
		});
	}
});

function autoFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		console.log("ele_"+ele);
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
		if(ele.name == "id" ){
			if($(sourceObj).attr("name")=="townName"){
			$("#parent").val(ele.value);
			}
		}
		});
}

function saveEdit(dlg) {
	var storageName = $("#storageName").val();
	var personName = $("#personName").val();
	var name = $("#name").val();
	var address = $("#address").val();
	if (storageName == "") {
		art.dialog.tips("名称不能为空");
		return;
	}
	if (name == "") {
		art.dialog.tips("所属分店不能为空");
		return;
	}
	
	if (personName == "") {
		art.dialog.tips("负责人不能为空");
		return;
	} else {
console.log("11");
		$.ajax({ url: base+"/basedata/person/checkNumber",type:"post",
			data:{personName:personName},dataType:"json", success: function(data){
				if (data.STATE == 'SUCCESS') {

					currentDialog = dlg;
					$('form').submit();
					return false;
				}else{
					art.dialog.alert("该名称不存在！");
					flag = false;
					return false; 
				}
			}});
	}
}