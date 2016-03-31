//保存编辑数据
function saveEdit(dlg){
	//提交之前判断一下
	if ($("#partnersSelect").val()=="") {
		art.dialog.tips('请先选择合作商类型');
		return false;
	}
	$('#orgName').val($('#configName').val());
	$('form').submit();
}

function changeChoose(){
	var parents = $("#partnersSelect option:selected").val();
	$('[TTEN],[HW],[CAAS],[GL],[ulbox]').hide();
	$('['+parents+']').show();
	if(parents=='HW'){
		$('[ulbox]').hide();
		$('#liHttpName').html("<span style='color:red'>*</span>环境地址：");
		$('#dxSpid').html("<span style='color:red'>*</span>SPID：");
		$('#allotId').html("<span style='color:red'>*</span>APPID：");
		$('#orgKeyLi').html("<span style='color:red'>*</span>密匙：");
	}else if(parents=='TTEN'){
		$('[ulbox]').show();
		$('#liHttpName').html("<span style='color:red'>*</span>添加成员接口：");
		$('#dxSpid').html("<span style='color:red'>*</span>修改成员接口：");
		$('#allotId').html("<span style='color:red'>*</span>话伴分配id：");
		$('#orgKeyLi').html("<span style='color:red'>*</span>密匙：");
	}else if(parents=='CAAS'){
		$('#allotId').html("<span style='color:red'>*</span>APP_KEY：");
		$('#orgKeyLi').html("<span style='color:red'>*</span>APP_SECRET：");
		$('#dxSpid').html("<span style='color:red'>*</span>重定向URL：");
		$('[ulbox]').hide();
	}else if(parents=='GL'){
		$('#allotId').html("<span style='color:red'>*</span>brandid：");
		$('#orgKeyLi').html("<span style='color:red'>*</span>key：");
	}
}

$(document).ready(function(){
	changeChoose();
});