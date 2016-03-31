$(document).ready(function(){
	var len = $('#goodsList').find("div[key='goods']").length;
	if(len == 0){
		addInStorageGoods();
	}
});

function approval(inStorageStatus,currentDialog){
	$("#status").val(inStorageStatus);
	$.post( base + "/ebstorage/instorage/approval",$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					content: res.MSG,
					time:1,
					close:function(){
						art.dialog.close();
					},
					width:200
				});
			}else{
				art.dialog.close();
			}
		}else{
			art.dialog.tips(res.MSG);
		}
    },'json');

	if(currentDialog){
		currentDialog.button({name:"同意",disabled:true});
		currentDialog.button({name:"不同意",disabled:true});
	}
}

function agree(dlg){
	var inStorageStatus = $("#inStorageStatus").val();
	currentDialog = dlg;
	approval(inStorageStatus,currentDialog);
	return false;
}

function disagree(dlg){
	currentDialog = dlg;
	approval("REJECTED",currentDialog);
	return false;
}





