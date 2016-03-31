var page = 1;

getData = function(page){
	$("#loading").show();
	var para = {};
	var rankey = $("#rankey").val();
	var sortkey = $("#sortkey").val();
	var currtype = $(".gzt-left").find("li.gztnow").find("span[key]").attr("key");
	para.type = currtype;
	para.currentPage = page;
	para.rankey = rankey?(rankey+" "+sortkey):"";
	para.personId = currentId;
	para.pageSize = 20;
	$("#currpage").val(page);
	$.post(getPath()+"/interflow/schedule/getSearchResult",para,function(data){ 
		$("#loading").hide();
		$("#gzt_rightboxin").html('');
		$("#gzt_rightboxin").html($(data).find("#searchlist").html());
		
		
		$("#pagelist").html('');

		$("#pagelist").html($(data).find("#pagediv").html());
		
		
	});
	
	loadCountData();
}

function pagesearch(num){
	
	getData(num);
}

function refreshSearch(){
	var currpage = $("#currpage").val();
	pagesearch(currpage);
}

function enterSearch(e){
	 
	var charCode= ($.browser.msie)?e.keyCode:e.which;  
	if(charCode==13){  
		pagesearch(1);
    }  
}

function addschedule(){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/schedule/add",
			{
				id : "addschedule",
				title : '添加日程',
				background : '#333',
				width : 750,
				height : 500,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiScheduleForm){
							dlg.iframe.contentWindow.valiScheduleForm(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						
						refreshSearch();
					}
					
				}
			});			
}

function viewschedule(id){
	art.dialog.open(getPath() +"/interflow/schedule/view?id="+id,
			{
				id : "view",
				title : '日程详情',
				background : '#333',
				width : 800,
				height : 550,
				lock : true	,
				close:function(){					
						refreshSearch();				
					
				}
				});
}

function editschedule(id){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/schedule/edit?id="+id,
			{
				id : "editschedule",
				title : '修改日程',
				background : '#333',
				width : 730,
				height : 550,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiScheduleForm){
							dlg.iframe.contentWindow.valiScheduleForm(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						refreshSearch();
					}
					
				}
			});			
}

function delschedule(id){
	$.post(getPath()+"/interflow/schedule/delete",{id:id},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.tips('操作成功');
			}
			$("#gzt_rightboxin").find("li[key='"+id+"']").remove();
			loadCountData();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function showall(obj,id){
	$(obj).parent().parent().find("div[key='content']").show();
	$(obj).parent().hide();
}

function hideall(obj,id){
	$(obj).parent().parent().find("div[key='preview']").show();
	$(obj).parent().hide();
}

function updateStatus(id,status){
	$.post(getPath()+"/interflow/schedule/updateStatus",{id:id,type:status},function(res){
		if(res.STATE == "SUCCESS"){
			if(res.MSG){
				
				art.dialog.tips(res.MSG);
			}else{
				art.dialog.tips('操作成功');
			}
			refreshSearch();
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function updateAndClose(id,status){
	updateStatus(id,status);
}

function rankdata(obj){
	$(".bottommin").find("a").removeClass("date-up");
	$(".bottommin").find("a").removeClass("date-down");
	var rankey = $(obj).attr("key");
	var sortkey = $(obj).attr("sort");
	if(sortkey=='asc'){
		sortkey='desc';
		//$(obj).removeClass('up');
		$(obj).addClass('date-down');
		
	}
	else if(sortkey=='desc'){
		sortkey='asc';
		//$(obj).removeClass('down');
		$(obj).addClass('date-up');
	}
	$(obj).attr("sort",sortkey);
	$("#rankey").val(rankey);
	$("#sortkey").val(sortkey);
	
	pagesearch(1);
}

function loadCountData(){
	$.post(getPath()+"/interflow/schedule/getCountData",{personId:currentId},function(data){
		$(".gzt-left").find("span[key]").html('0');
		$.each(data,function(i,item){
			$(".gzt-left").find("span[key='"+item.type+"']").html(item.count);
		});
		
	
	},'json');
}

$(document).ready(function(){
	
	
	pagesearch(1);
	
	
	
	$("#keyword").bind("focus",function(){
		if($(this).val()=="标题/内容/类别/作者") $(this).val("");
	});
	
	$("#keyword").bind("blur",function(){
		var name = $("#keyword").val();
		if(name==""){
			$(this).val("标题/内容/类别/作者");
		}
	});
	
	$(document).keydown(function(e){
		enterSearch(e);
	}
	);
	
	$(".gzt-left").find("li").click(function(){
		if(!$(this).hasClass("gztnow")){
		$(this).parent().find("li.gztnow").removeClass("gztnow");
		$(this).addClass("gztnow");
		getData(1);
		}
		
	});

	var h = $(window).height()-65;
	$(".workbenchlist").height(h);
	$(".gzt_rightbox").height(h-20);
});