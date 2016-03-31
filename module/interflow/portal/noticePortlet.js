var noticePortlet = {
		//初始化页面
		initPage:function(obj){
			
			$("div[key='loadiv']",obj).show();
			$.post(getPath()+"/interflow/notice/listnotice",{},function(data){
				
				$(obj).html($(data).find("#noticelist").html());
			});
			noticePortlet.initQuery(obj);
			
		},
		//外部查询关键字有带入，则初始查询
		initQuery:function(obj,sKey){
			var searchKey = sKey || $("#searchKey",obj).val();
			if(searchKey!=null && searchKey!=''){
				$("#keyword").val(searchKey);
				//查询
				noticePortlet.queryData(obj);
			}
		},
		//查询数据
		queryData:function(obj){
			var keyword = $("#keyword",obj).val();
			if(keyword == $("#keyword",obj).attr("defaultValue")){
				keyword = "" ;
			}
			
			
		}
}