function addNewRow(){
    var cloneTr = $("#cloneTr").clone(true); 
    $("#configTbl tbody").append(cloneTr[0]);
    cloneTr.attr("id","dataTr");
    cloneTr.show();
} 

function delRow(delObj){
	$(delObj).parent().parent().parent().remove();
}

function saveEdit(){
	
	var configArr = [];
	var tempConfig = {};
	var flag = true;
	
	$("#configTbl tr[id='dataTr']").each(function(i,tr){
		var config = {} ;
		$("input",tr).each(function(){
			config[this.name] = this.value ;
		});
		$("select",tr).each(function(){
			config[this.name] = this.value ;
		});
		configArr.push(config);
	});
	
	if(flag){
		$.post(getPath()+"/cmct/uscPhoneconfig/saveConfig",{configJson:JSON.stringify(configArr)},function(data){
			if(data && data.STATE == 'SUCCESS'){
				art.dialog.tips("保存成功！");
			}else{
				art.dialog.tips("保存失败！");
			}
		},'json');
	}
	
}
