	function batchReaded(dlg){
		if(isEmpty()){
			alert("日期不能为空！");
		}else if(compare()){
			alert("结束日期必须大于开始日期！");
		}
		saveAdd(dlg);
		parent.resetList();
//		var queryStartDate=$("#queryStartDate").val();
//		var queryEndDate=$("#queryEndDate").val();	
//		$.post(getPath()+"/basedata/info/batchHandleRead",{queryStartDate:queryStartDate,queryEndDate:queryEndDate},
//			function(res){
//				
//		},'json');
	}
	
	function queryDataOfDate(){
		var queryStartDate=$("#queryStartDate").val();
		var queryEndDate=$("#queryEndDate").val();	
		var param={"queryStartDate":queryStartDate,"queryEndDate":queryEndDate};
		if(!isEmpty()){
			if(compare()){
				alert("结束日期必须大于开始日期！");
			}else{
				$.post(getPath() + '/basedata/info/notReadCount',param,function(res){
					$("#notReadCount").text(res.COUNT);
				},'json');
			}
		}
	} 
	function isEmpty(){
		var queryStartDate=$("#queryStartDate").val();
		var queryEndDate=$("#queryEndDate").val();	
		if(queryStartDate==""||queryEndDate==""){
			return true;
		}
		return false;
	}
	function compare(){
		var queryStartDate=$("#queryStartDate").val();
		var queryEndDate=$("#queryEndDate").val();	
		if(queryEndDate<queryStartDate){
			return true;
		}
		return false;
	}
	
