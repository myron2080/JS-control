
$(document).ready(function(){
	searchData();
	var h=$(window).height();
	$(".rss-subin-table").height(h-100);
});

function setTab(obj,str){
	$(".system_tab li").each(function(){
		$(this).removeClass("hover");
	});
	$("#typeData").val(str);
	$(obj).parent().addClass("hover");
	searchData();
}

function searchData(str){
	var flag=true;
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == 'up'){//上一页
		if(currentPage == 1){
			art.dialog.tips("已是第一页!");
			flag=false;
			thePage=parseInt(currentPage,10);
		}else{
			thePage=parseInt(currentPage,10)-1;
		}
	}else if(str == 'down'){//下一页
		if(currentPage == parseInt(totalPage,10)){
			art.dialog.tips("已是最后一页!");
			thePage=parseInt(currentPage,10);
			flag=false;
		}else{
			thePage=parseInt(currentPage,10)+1;
		}
	}else{
		thePage=1;
	}
	$("#currentPage").val(thePage);
	$("#pageLabel").text(thePage);
	if(flag){
		$.post(base+'/interflow/rssperson/getData',{currentPage:thePage,type:$("#typeData").val()},function(json){
			if(null != json){
				$("#totalPage").val(json.pageCount);
				$("#totalLabel").text(json.pageCount);
				if(null != json.items){
					$(".rss-subin-table").html("");
					var slist=json.items;
					var ul="";
					var flag=false;
					var temp=1;
					for(var i=0;i<slist.length;i++){
						var obj=slist[i];
						    if(screen.width == 1024){
						    	ul+="<div class='"+obj.classType+"' style='width:29.8%';>";
						    }
						    if(screen.width == 1280){
						    	ul+="<div class='"+obj.classType+"' style='width:30.58%';>";
						    }
						    if(screen.width == 1360 || screen.width == 1366 ){
						    	ul+="<div class='"+obj.classType+"' style='width:30.8%';>";
						    }
						    if(screen.width >= 1440){
						    	ul+="<div class='"+obj.classType+"' style='width:30.9%';>";
						    }
							ul+="<div class='sub-box'>";
							ul+="<div class='sub-box-logo'><div id='sub-box-logo01'><div id='sub-box-logo02'><img src='"+obj.imgPath+"' /></div></div></div>";
							ul+="<div class='sub-box-text'>";
							ul+="<p class='lineheight22'>";
							ul+="<span class='fl w12 link-blue'>"+obj.title+"</span>";
							if(obj.isRss == 'yes'){
								ul+="<a class='sub-box-btn01 fr' href='javascript:void(0)' onclick=bookData(this,'"+obj.id+"','"+obj.isDefault+"');><i class='rss-minus'></i>取消订阅</a>";
							}else{
								ul+="<a class='sub-box-btn fr' href='javascript:void(0)' onclick=bookData(this,'"+obj.id+"','');><i class='rss-add'></i>添加订阅</a>";
							}
							ul+="</p><p class='lineheight18'>"+obj.content+"</p>";
							ul+="</div></div></div>";
					}
					$(".rss-subin-table").append(ul);
				}
			}
		},'json');
	}
}

function bookData(obj,id,type){
	if(type == 'YES'){
		art.dialog.tips("系统默认订阅,不可取消!");
	}else{
		$.post(getPath()+"/interflow/rssperson/bookData",{'dataId':id},function(res){
			if(res.STATE == "SUCCESS"){
				art.dialog.tips(res.MSG);
				var result=res.RESULT;
				if(result == 'book'){//订阅操作
					$(obj).attr("class","sub-box-btn01 fr");
					$(obj).html("<i class='rss-minus'></i>取消订阅");
				}else{//取消操作
					$(obj).attr("class","sub-box-btn fr");
					$(obj).html("<i class='rss-add'></i>添加订阅");
				}
			}else{
				art.dialog.alert(res.MSG);
			}
		},'json');
	}
}
