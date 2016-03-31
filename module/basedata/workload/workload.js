function queryTime(type){
		$("[name=queryType]").each(function(){
			$(this).removeClass("workload-tnow");
		});
		$("#"+type).addClass("workload-tnow");
		$.post(getPath()+"/basedata/workload/queryTime",{dateType:type},function(res){
			if(res.STATE == 'SUCCESS'){
				var workloadList = res.workloadList;
				var htmlStr = "";
				for(var i=0;i<workloadList.length;i++){
					htmlStr += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>'+
					   '<c:forEach items="${workloadList }" var="workload" varStatus="status">'+
					   '<c:if test="${status.index % 6 eq 0}"></tr></table>'+
					'<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr></c:if>'+
			                '<td width="16%">'+
					        '<a href="javascript:void(0);" onclick="top.addTabItem(\'${workload.id}\',\'${base }${workload.url }\',\'${workload.name}\');" >'+
			                  ' <div <c:if test="${workload.type.value eq \'SOURCE\' }">class="workload-green"</c:if>'+
				                 ' <c:if test="${workload.type.value eq \'TENANT\' }">class="workload-green"</c:if>'+
				                 '  <c:if test="${workload.type.value eq \'RESULTS\' }">class="workload-blue"</c:if>'+
				                  ' <c:if test="${workload.type.value eq \'OLDHOME\' or workload.type eq \'NEWHOME\' }">class="workload-orange"</c:if>'+
			                   ' >'+
			                     '   <div <c:if test="${workload.type.value eq \'SOURCE\' }">class="workload-green-title"</c:if>'+
				                 '  <c:if test="${workload.type.value eq \'TENANT\' }">class="workload-green-title"</c:if>'+
				                 '  <c:if test="${workload.type.value eq \'RESULTS\' }">class="workload-blue-title"</c:if>'+
				                  ' <c:if test="${workload.type.value eq \'OLDHOME\' or workload.type eq \'NEWHOME\' }">class="workload-orange-title"</c:if>'+
				                  ' >${workload.name}</div>'+
			                      '  <div class="workload-green-body">${workload.remark}</div>'+
			                  ' </div>'+
			               '</a>'+
					    '</td>'+
					   ' <td width="0.8%">&nbsp;</td>'+
			         ' </c:forEach>'+
					 ' </tr>'+
					'</table>';
				}
				$("#workloadData").html(htmlStr);
			}else{
				art.dialog.tips("数据加载出错了！");
			}
		},"json");
	}