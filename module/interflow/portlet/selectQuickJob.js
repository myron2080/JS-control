$(document).ready(function(){
	$("#to_add").bind("click",function(){
		addJob();
	});
});
/**
 * 选择 菜单
 */
function addJob(){
	art.dialog.data('jobList','returnData');
	var dlg = art.dialog.open(getPath()+"/interflow/quickSet/selectJob",{
		title:'选择岗位',
		 lock:true,
		 width:'480px',
		 height:'250px',
		 id:"jobList",
		 close:function(){
			 return true;
		 },
		 button:[{name:'确定',callback:function(){
			 if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.selectData){
				 dlg.iframe.contentWindow.selectData();
			 }
				return false;
			}},{name:'取消',callback:function(){
				return true;
			}}]
	});
}

function returnData(data){
	var tbody="";
	var mjson=getMenuJson();
	for(var i=0;i<data.length;i++){
		if(mjson.indexOf(data[i].id) == -1){
			tbody+="<tr><td><input type='hidden' name='jobId' id='jobId' value='"+data[i].id+"' /><input type='hidden' name='jobName' id='jobName' value='"+data[i].name+"' />"+data[i].name+
			"</td><td><input type='hidden' name='desc' id='desc' value='"+data[i].description+"' />"+data[i].description+"</td><td><a href=javascript:void(0); onclick=deleteTr(this);>删除</a></td></tr>";
		}
	}
	$("#dataTable").append(tbody);
}

function deleteTr(obj){
	$(obj).parent().parent().remove();
}

/**
 * 获取所有菜单json数据
 */
function getMenuJson(){
	var typeJson="[";
	$("#dataTable tr").each(function(){
		typeJson+="{";
		typeJson+="'job':{"+"'id':'"+$(this).find("input[name='jobId']").val()+"','name':'"+$(this).find("input[name='jobName']").val()+"'}"+",";
		typeJson+="'desc':'"+$(this).find("input[name='desc']").val()+"'},";
	});
	if (typeJson.indexOf(",") != -1) {
		typeJson = typeJson.substring(0, typeJson.length - 1)+"]";
	}else{
		typeJson="";
	}
	return typeJson;
}
function saveEdit(dlg){
	var json=getMenuJson();
	if(json == ''){
		art.dialog.tips("请选择岗位!");
		return;
	}
	$("#jobJson").val(json);
	currentDialog = dlg;
	$('form').submit();
	return false;
}