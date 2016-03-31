$(function(){
});

function checkPass(dlg){
	$.post(getPath()+'/ebsite/backbill/approval',{
		id:$('#dataId').val(),
		status:'YES',
		checkInfo:$('#checkInfo').val()
	},function(res){
		if(res.STATE=='SUCCESS'){//表示成功
			//关闭窗口
			art.dialog.tips('操作成功！');
			setTimeout(function(){art.dialog.close();},1000);
		}
	},'json');
	return false;
}

function turndown(dlg){
	$.post(getPath()+'/ebsite/backbill/approval',{
		id:$('#dataId').val(),
		status:'NO',
		checkInfo:$('#checkInfo').val()
	},function(res){
		if(res.STATE=='SUCCESS'){//表示成功
			//关闭窗口
			art.dialog.tips('操作成功！');
			setTimeout(function(){art.dialog.close();},1000);
		}
	},'json');
	return false;
}