function saveEdit(dlg){
			fillImagesVal();
//			var value1 = $("#catelogId").val();
//			var value2 = $("#parentId").val();
//			if( (value1==null||value1==''||value1.length==0)&& (value2!=null || value2!=''||value2.length==0)){
//				$("#catelogId").val(value2);
//			}else{
			$("#catelogId").val(art.dialog.open.origin.catelogId);
//			}
			$("form").submit();
			return false;
		}

//填充图片value
function fillImagesVal(){
	$("#dataattachs").val(JSON.stringify(uploadImages));
	$("#files").val(JSON.stringify(uploadFiles));
}
//保存
function saveAdd(dlg,statu){
	currentDialog = dlg;
	$("#billStatu").attr("value",statu);
	saveEdit(dlg);
}

function formSave(){
	fillImagesVal();
	$("form").submit();
	return false;
}

function removeById(id){
	art.dialog.confirm('确定删除此数据吗?', function() {
		$.post(getPath() + '/website/catelogData/delete', {
			id : id
		}, function(res) {
			art.dialog.tips(res.MSG);
			if (res.STATE == 'SUCCESS') {
				location.replace(location.href);
			}
		}, 'json');
		return true;
	}, function() {
		return true;
	});
}

function onOff(id,isLaunch) {
	if(id=="" ||id==null){
		art.dialog.alert('该数据未保存，无法进行此操作');
	}
	if (isLaunch == 1) {
		art.dialog.confirm('确定发布操作吗?', function() {
			$.post(getPath() + '/website/catelogData/onOffBatch', {
				id : id,
				isLaunch : 1
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					location.replace(location.href);
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} else if (isLaunch == 0) {
		art.dialog.confirm('确定取消发布操作吗?', function() {
			$.post(getPath() + '/website/catelogData/onOffBatch', {
				id : id,
				isLaunch : 0
			}, function(res) {
				art.dialog.tips(res.MSG);
				if (res.STATE == 'SUCCESS') {
					location.replace(location.href);
				}
			}, 'json');
			return true;
		}, function() {
			return true;
		});
	} 
}


