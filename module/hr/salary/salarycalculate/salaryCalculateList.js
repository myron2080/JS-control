function calculate(currentPage){
	var schemeId = $("input[name='schemeId']").val();
	var durationId = $("input[name='durationId']").val();
	var flag = true;
	if(!durationId){
		art.dialog.tips("请先选择薪酬期间");
		flag = false;
	}
	if(!schemeId){
		art.dialog.tips("请先选择薪酬方案");
		flag = false;
	}
	if(flag){
		$.post(base+"/hr/calculate/calculate",{pageSize:15,currentPage:currentPage,schemeId:schemeId,durationId:durationId},function(map){
			if(map.msg=="SUCCESS"){
				var itemList = map.itemList;
				var pag = map.pag;
				var data = pag.items;
				$("#myHead").html('');
				 $('<th style="width: 5%;text-align: center;">部门</th>').appendTo("#myHead");
				 $('<th style="width: 5%;text-align: center;">姓名</th>').appendTo("#myHead");
				$('<th style="width: 5%;text-align: center;">岗位</th>').appendTo("#myHead");
				$('<th style="width: 5%;text-align: center;">职级</th>').appendTo("#myHead");
				$('<th style="width: 5%;text-align: center;">计薪日期</th>').appendTo("#myHead");
				for(var i = 0; i < itemList.length ; i++){
					$('<th style="width: 5%;text-align: center;">'+itemList[i].salaryItem.name+'</th>').appendTo("#myHead");
				}
				var dataHtml = '';
				for(var i = 0 ; i < data.length ; i++){
					dataHtml += '<tr><td>'+(data[i].org!=null && data[i].org!=''?data[i].org.name:'')+'</td><td>'+(data[i].person!=null?data[i].person.name:'')+'</td><td>'+(data[i].job!=null && data[i].job!=''?data[i].job.name:'')+'</td><td>'+(data[i].jobLevel!=null && data[i].jobLevel!=''?data[i].jobLevel.name:'')+'</td><td></td>';
					for(var j = 0 ; j < data[i].items.length; j ++){
						var item = data[i].items[j];
						dataHtml += '<td>'+item.money+'</td>';
					}
					dataHtml += '</tr>';
				}
				$("#itemTb").html(dataHtml);
				var curpage = pag.currentPage;
				var totalrecord =pag.recordCount;
				var pagesize  = pag.pageSize;
				var totalpage = (totalrecord%pagesize==0)?(Math.floor(totalrecord/pagesize)):(Math.floor(totalrecord/pagesize)+1);
				$("#Pagination").html(initpagelist(curpage,totalpage));
			}else{
				art.dialog.tips("核算方案已审核，不能再计算");
			}
		},'json');
	}
}

function pagesearch(page){
	calculate(page);
}

function save(){
	if($("#itemTb>tr").length>0){
		var schemeId = $("input[name='schemeId']").val();
		var durationId = $("input[name='durationId']").val();
		$.post(base+"/hr/calculate/save",{schemeId:schemeId,durationId:durationId},function(res){
			if(res.STATE=="SUCCESS"){
				art.dialog.tips("保存成功");
			}else{
				art.dialog.tips("保存失败");
			}
		},'json');
	}else{
		art.dialog.tips("没有记录");
	}
}
