$(function(){
//	alert(1);
	disnableData();
});

//仓库名称显示
function storageBackFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}

function disnableData(){
	//隐藏数据
	$('div .tab_box_title').hide();
	//输入框
	$('input,textarea,select').not('#approvalDescription,#toStorageName').each(function(){
		$(this).attr('disabled','disabled');
	});
	//超链接
	$('a').each(function(){
		if(!$(this).attr('escape')){//如果有escape属性，则跳过
			$(this).removeAttr('onclick');
			$(this).attr('href','javascript:void(0)');
			$(this).attr('disabled','disabled');
		}
	});
	//F7
	$('div[class="f7"]').each(function(){
		$(this).attr('disabled','disabled');
		$(this).find('span').each(function(){
			$(this).removeAttr('onclick');
		});
		$(this).find('strong').each(function(){
			$(this).removeAttr('onclick');
		});
	});
	if(enter=='Y'){//确认审批操作
		$('#approvalDescription').attr('disabled','disabled');
		$('#toStorageName').attr('disabled','disabled');
	}
}

//保存通过
function enterPass(){
	$.post(getPath()+'/transferBill/enterPass',{
		id:$('#dataId').val(),
		status:'ENTERPASS'
	},function(res){
		if(res.STATE=='SUCCESS'){//表示成功
			//关闭窗口
			art.dialog.tips('确认成功！');
			setTimeout(function(){art.dialog.close();},1000);
		}
	},'json');
	//恢复
	return false;
}
//保存不通过
function noEnterPass(){
	$.post(getPath()+'/transferBill/enterPass',{
		id:$('#dataId').val(),
		status:'REJECT'//驳回---->直接回到驳回未审核状态
	},function(res){
		if(res.STATE=='SUCCESS'){//表示成功
			//关闭窗口
			art.dialog.tips('确认成功');
			setTimeout(function(){art.dialog.close();},1000);
		}
	},'json');
	//恢复
	return false;
}

//保存编辑数据
function saveEdit(dlg){
	currentDialog = dlg;
	//$.ajax提交
	var toStorageName=$('#toStorageName').val();
	if(!toStorageName || toStorageName==''){
		art.dialog.tips('请填写被调分店！');
		return ;
	}
	//$.ajax提交
	var approvalDescription=$('#approvalDescription').val();
	if(!approvalDescription || approvalDescription==''){
		art.dialog.tips('请填写审批备注！');
		return ;
	}
	//同步
	$.post(getPath()+'/transferBill/passApproval',{
		id:$('#dataId').val(),
		toStorageId:$('#toStorageId').val(),
		status:'APPROVED',
		approvalDescription : approvalDescription
	},function(res){
		if(res.STATE=='SUCCESS'){//表示成功
			//关闭窗口
			art.dialog.tips('审核成功！');
			setTimeout(function(){art.dialog.close();},1000);
		}
	},'json');
	//恢复
	
	return false;
}
//保存编辑数据
function noPass(dlg){
	currentDialog = dlg;
	//$.ajax提交
	var approvalDescription=$('#approvalDescription').val();
	if(!approvalDescription || approvalDescription==''){
		art.dialog.tips('请填写审批意见！');
		return ;
	}
	var toStorageName=$('#toStorageName').val();
	if(!toStorageName || toStorageName==''){
		art.dialog.tips('请填写调拨分店！');
		return ;
	}
	//同步
	$.post(getPath()+'/transferBill/passApproval',{
		id:$('#dataId').val(),
		status:'REJECT',
		approvalDescription : approvalDescription
	},function(res){
		if(res.STATE=='SUCCESS'){//表示成功
			//关闭窗口
			art.dialog.tips('驳回成功！');
			setTimeout(function(){art.dialog.close();},1000);
		}
	},'json');
	//恢复
	return false;
}
