function contains(arr,v){
	for(var i = 0;i<arr.length;i++){
		if(arr[i]==v){
			return true;
		}
	}
	return false;
} 

function saveAnswer(){
	/*$("div[id^='questionDiv'][questionType!='TEXT']").each(function(){
		alert($("input[name^='questionOption']:checked",this).length);
		 
	}); 
	return ;*/
	
    var questionnaireId = $("#questionnaireId").val();
	var answersArray = [];
	var optionAs = [];
	var flag = true;
	$("input[name^='questionOption']").each(function(){
		if($(this).attr("checked")){
			var answer = {};
			answer.questionnaireId = questionnaireId;
			answer.questionId = $(this).attr("questionId");
			answer.optionId = $(this).val();
			answersArray.push(answer);
			if(!contains(optionAs,$(this).attr("questionId"))){
				optionAs.push($(this).attr("questionId"));
			}
			flag = checkMostNum(this);
		}
	});
	
	if($(".vote-list").length-$("textarea[name^='answer']").length>optionAs.length){
		var flag = false;
	}
	
	$("textarea[name^='answer']").each(function(){
		if($(this).val()!=''){
			var answer = {};
			answer.questionnaireId = questionnaireId;
			answer.questionId = $(this).attr("questionId");
			answer.answer = $(this).val();
			answersArray.push(answer);
		}else{
			flag = false;
		}
	});
	 
	if(!flag){
		art.dialog.tips("请按要求完成所有题目再提交");
		return false;
	}
	$.post(getPath()+"/interflow/questionnaire/saveAnswer",{questionnaireId:questionnaireId,answersJSON:JSON.stringify(answersArray)},function(data){
		if(data.STATE == 'SUCCESS'){
			 
			//art.dialog.close();
			location.href = location.href;
		} else {
			art.dialog.tips("系统错误！！");
		}
	},'json');
}

function checkMostNum(obj){
	var mostNum = parseInt($(obj).attr("mostNum"));
	var questionDiv = $(obj).parents("div[id^='questionDiv']");
	var selectedNum = $("input[name^='questionOption']:checked",questionDiv.get(0)).length;
	if(mostNum<selectedNum){
		art.dialog.tips("第"+(questionDiv.attr("id").replace("questionDiv",""))+"题最多选择"+mostNum+"项！");
		return false;
	}
	return true;
}
  
