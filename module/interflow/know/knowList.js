var page = 1;

getData = function(page){
	$("#loading").show();
	var para = {};
	var name = $("#keyword").val();
	if(name=='标题/内容/类别/作者') name = '';
	var rankey = $("#rankey").val();
	var sortkey = $("#sortkey").val();
	para.name = name;
	para.currentPage = page;
	para.rankey = rankey?(rankey+" "+sortkey):"";
	para.pageSize = 20;
	para.part = $(".knowledge_left-b").find("b.arrow01").length>0?$(".knowledge_left-b").find("b.arrow01").parent().attr("key"):'';
	$("#currpage").val(page);
	$.post(getPath()+"/interflow/know/getSearchResult",para,function(data){ 
		$("#loading").hide();
		$("#searchlist").html('');
		$("#searchlist").html($(data).find("#searchlist").html());
		
		
		$("#pagelist").html('');

		$("#pagelist").html($(data).find("#pagediv").html());
		
		$("#tips").html();
		$("#tips").html($(data).find("#tips").html());
	});
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

function addknow(){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/know/add",
			{
				id : "addknow",
				title : '创建知识',
				background : '#333',
				width : 760,
				height : 550,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiKnowForm){
							dlg.iframe.contentWindow.valiKnowForm(dlg);
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

function viewknow(id){
	art.dialog.open(getPath() +"/interflow/know/view?id="+id,
			{
				id : "view",
				title : '知识详情',
				background : '#333',
				width : 800,
				height : 550,
				lock : true	,
				close:function(){					
						refreshSearch();				
					
				}
				});
}

function editknow(id){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/know/editView?id="+id,
			{
				id : "editknow",
				title : '修改知识',
				background : '#333',
				width : 730,
				height : 550,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiKnowForm){
							dlg.iframe.contentWindow.valiKnowForm(dlg);
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

function delknow(id){
	$.post(getPath()+"/interflow/know/delete",{id:id},function(res){
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

function rankdata(obj){
	$(".bottommin").find("a").removeClass("up");
	$(".bottommin").find("a").removeClass("down");
	var rankey = $(obj).attr("key");
	var sortkey = $(obj).attr("sort");
	if(sortkey=='asc'){
		sortkey='desc';
		//$(obj).removeClass('up');
		$(obj).addClass('down');
		
	}
	else if(sortkey=='desc'){
		sortkey='asc';
		//$(obj).removeClass('down');
		$(obj).addClass('up');
	}
	$(obj).attr("sort",sortkey);
	$("#rankey").val(rankey);
	$("#sortkey").val(sortkey);
	
	pagesearch(1);
}

function genehtml(a){
	var html = "";
	
	for(var i=0;i<a.length;i++){
		html += " <li onclick='getzslm(this)' key='"+a[i].id+"' ><b class='arrow02'></b><span>"+a[i].name+"</span></li>";
	}
	$("#knownav").html(html);
}

function getzslm(obj){
	$(".knowledge_left-b").find("b").removeClass("arrow01").addClass("arrow02");
	//$("#quanbub").removeClass("arrow02");
	$(obj).find("b").removeClass("arrow02").addClass("arrow01");
	refreshSearch();
}

$(document).ready(function(){
	
	
	pagesearch(1);
	
	$(".knowledge-page-list").height($(window).height()-121);
	$(".knowledge_left").height($(window).height()-28);
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
	getBaseData("zslm");
	

});