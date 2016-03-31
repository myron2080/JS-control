
$(function(){
	 
});



function addNewRow()
{
    var cloneTr = $("#cloneTr").clone(true); 
    $("#configTbl tbody").append(cloneTr[0]);
    cloneTr.attr("id","");
    cloneTr.show();
    // cloneTr.appendTo($("#configTbl));
} 

function delRow(delObj){
	$(delObj).parent().parent().parent().remove();
}


function saveEdit(){
	var smsConfigJson = [];
	var tempConfig = {};
	var flag = true;
 
   $("#configTbl tr:gt(1)").each(function(i,tr){
	   var config = {};
	   
	   $("input",tr).each(function(){
		   if(this.type=="checkbox"){
			   config[this.name] = this.checked;
		   }else{
		     config[this.name] = this.value;
		   }
		  });
	   
	   $("select",tr).each(function(){
			
		   config[this.name] = this.value;
		  }); 
	   
	   if(config.type && config.enableFlag){
		   if(tempConfig[config.type]==config.type){
			   art.dialog.tips("启用的短信服务 类别必须唯一!");
			   flag = false;
			   return false;
		   }else{
			   tempConfig[config.type] = config.type ;
		   }
	   }
	   
	   smsConfigJson.push(config);
   });
   
   if(flag){
	   $.post(getPath()+"/cmct/smsControl/saveSmsConfig",{smsConfigJson:JSON.stringify(smsConfigJson)},function(data){
		   if("SUCCESS"==data.STATE) {
		      art.dialog.tips("保存配置成功");
		   }
		},'json');
   }

}

/**
 * 启用禁用
 * @param id
 * @param enableFlag
 */
function updateEnableFlag(id,enableFlag){
	 
   
   if(flag){
	   $.post(getPath()+"/cmct/smsControl/updateEnableFlag",{id:id,enableFlag:enableFlag},function(data){
		   if("SUCCESS"==data.STATE) {
		      art.dialog.tips("修改成功");
		   }
		},'json');
   }

}