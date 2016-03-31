$list_dataType = "请假管理";//数据名称
$list_editWidth = "580px";
$list_editHeight = "670px";
var jobStatus ="ONDUTY";
$(document).ready(function(){
});
function  chooseTab(key){
	
	var srcUrl = "";
	if(key=="queryNoteByNoteBook"){
		tabKey = "queryNoteByNoteBook";
		srcUrl = "${base}/note/noteBook/listQueryBook?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}else if(key=="querynote"){
		tabKey = "querynote";
		srcUrl = "${base}/note/note/list?isModuleType="+isModuleType+"&moduleType="+moduleType;
	}
	$("#homeIframe").attr("src",srcUrl);
}
