function addNewRow(){
	
	var param=parseInt($("#param").val());
	if(param==0){
		param+=1;
	}
	param+=1;
	
	$("#param").val(param);      
    var cloneTr = $("#cloneTr").clone(true); 
    $("#configTbl tbody").append(cloneTr[0]);
    cloneTr.attr("id","dataTr_"+param+"");
    
	var div="";
	div+="<td><div class='f7' id='getCustomer_"+param+"' dataPickerUrl='"+getPath()+"/framework/dataPicker/list?query=getCustomer' width='400px' height='450px' title='客户' >";
	div+="<input dataPicker='value'  name='customer.id' value='' id='customerId' type='hidden' readOnly='readOnly' />";
	div+="<input  dataPicker='name' readonly='readonly' ondblclick='openDataPicker('getCustomer_"+param+"')' value=''  id='' type='text' class='assets-apply-input assets-length105'/>";
	div+="<strong onclick=clearDataPicker('getCustomer_"+param+"')></strong>";
	div+="<span class='p_hov' onclick=openDataPicker('getCustomer_"+param+"')></span>";
	div+="</div></td>";

    cloneTr.find('td :eq(0)').after(div);
    
    cloneTr.show();
} 

function delRow(delObj){
	$(delObj).parent().parent().parent().remove();
}

function saveEdit(){
	
	var configArr = [];
	var tempConfig = {};
	var flag = true;
	
	$("#configTbl tr[id^='dataTr_']").each(function(i,tr){
		var config = {} ;
		$("input",tr).each(function(){
			if(this.name.indexOf('.')>0){
				var aObj={};
				aObj['id']=this.value;
				config.customer=aObj;
			}else{
				if(this.type == "checkbox"){
					config[this.name] = this.checked ? "YES" : "NO" ;
				}else{
					config[this.name] = this.value ;
				}
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
		art.dialog.confirm('保存时会删除以前所有的客户,再继续新增,确定保存吗?',function(){
			$.post(getPath()+"/projectm/pmPhoneConfig/saveConfig",{configJson:JSON.stringify(configArr)},function(data){
				if(data && data.STATE == 'SUCCESS'){
					art.dialog.tips("保存成功！");
				}else{
					art.dialog.tips("保存失败！");
				}
			},'json');
		});
	}
	
}
