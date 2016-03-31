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
			if(this.type == "checkbox"){
				config[this.name] = this.checked ? "YES" : "NO" ;
			}else{
				config[this.name] = this.value ;
			}
		});
		$("select",tr).each(function(){
			config[this.name] = this.value ;
		});
		//验证
		if(config.enable == "YES"){
			if(tempConfig[config.configName] == config.configName){
				art.dialog.tips("配置名称必须保持唯一！");
				flag = false ;
				return false ;
			}else{
				tempConfig[config.configName] = config.configName ;
			}
			if(tempConfig[config.orgId] == config.orgId){
				art.dialog.tips("分配ID必须保持唯一！");
				flag = false ;
				return false ;
			}else{
				tempConfig[config.orgId] = config.orgId ;
			}
		}
		configArr.push(config);
	});
	
	if(flag){
		$.post(getPath()+"/cmct/phoneconfig/saveConfig",{configJson:JSON.stringify(configArr)},function(data){
			if(data && data.STATE == 'SUCCESS'){
				art.dialog.tips("保存成功！");
			}else{
				art.dialog.tips("保存失败！");
			}
		},'json');
	}
	
}
