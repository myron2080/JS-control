$(function(){
	console.info('helloworld');
});

function afterFilterStr(){
	var orgId=$('#fromStorageId').val();
	if(!orgId || orgId == ''){
		return false;
	}else{
		return true;
	}
}

//仓库名称显示
function storageBackFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}

//
function autoFun(data,sourceObj){
	$.each(data.attributes,function(i,ele){
		if(ele.name == "name" ){
			$(sourceObj).val(ele.value);
		}
	});
}

//保存编辑数据
function saveEdit(dlg){
	currentDialog = dlg;
	if(currentDialog){
	   bottuns=currentDialog.config.button;
	   $(bottuns).each(function(){
		  var name=this.name; 
		  currentDialog.button({name:name,disabled:true});
	   });
	}
	var personId=$('#personId').val();
	if(personId==''){
		art.dialog.tips('请选择拣货人');
		return ;
	}
	var pickingTime=$('#pickingTime').val();
	if(pickingTime==''){
		art.dialog.tips('请填写拣货时间');
		return ;
	}
	$.post(base+'/ebsite/order/fpjhrSave',{
		id:$('#dataId').val(),
		personId:$('#personId').val(),
		pickingTime:$('#pickingTime').val()
	},function(res){
		var res=res[0];
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				art.dialog({
					icon: 'succeed',
				    time: 1,
				    content: res.MSG
				});
				setTimeout(function(){art.dialog.close();},1000);				
			}else{
				art.dialog.close();
			}
		}else{
			if(currentDialog){
				$(bottuns).each(function(){
				  var name=this.name; 
				  currentDialog.button({name:name,disabled:false});
			    });
				if(currentDialog.iframe.contentWindow && currentDialog.iframe.contentWindow.saveFail){
					currentDialog.iframe.contentWindow.saveFail(res);
				}
			}
			art.dialog.alert(res.MSG);
		}
	},'json');
	return false;
}
