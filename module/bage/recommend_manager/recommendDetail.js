$(function(){
	//数据列表
//	$("#main").ligerLayout({});
	$list_dataGrid = $("#tableContainer").ligerGrid({
        columns: [
            {display: '邀请人姓名', name: 'userName', id:'userName', align: 'center', width: 150,render:function(data){
            	var showName;
            	if(data.userName && data.userName != ''){
            		showName = data.userName;
            	}else{
            		//显示解密后的手机号
            		showName = data.plaintext;
            	}
            	return showName;
            }},
            {display: '注册电话', name: 'plaintext', id:'phone', align: 'center', width:120},
			{display: '注册时间', name: 'registerTime', id:'registerTime', align: 'center', width:80},
			{display: '赠送推荐赠送分钟', name: 'presentationMinute', id:'presentationMinute', align: 'center', width:120}
        ],
        tree:{columnId: 'userName'},
        onAfterShowData: function() {
        	var l = $(".l-grid-tree-link-open").length;  
        	for (var i = l - 1; i >= 0; i--)  
        	$(".l-grid-tree-link-open")[i].click();  
        	}, 
        pageSize:20,
        height:'480',
        rownumbers:true,
        pageParmName:'currentPage',
        pagesizeParmName:'pageSize',
        record:'recordCount',
        pageSizeOptions:[20,30,40,50],
        url: getPath()+"/bage/recommendManager/recommendDetailDataList?pid="+pid+"&type="+type
    });
	
});
