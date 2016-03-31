var pageIndex = 1;     // 页面索引初始值
var pageSize = 30;    
$(function(){
	searchData("0");
});
function searchData(str){
	showload();	
	$("#moreDiv").hide();
	var param = {};
	var thePage;
	var currentPage=$("#currentPage").val();
	if(str == '0'){//初始化
		thePage=1;
		$(".yilan").html('');
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	param.currentPage = thePage; 
	param.pageSize = 10;
	param.searchName=$("#keyWord").val();
	$.post(base + "/weixinapi/projectnews/listData",param,
					function(data) {
					hideload();
					$("#totalPage").val(data.pageCount);
						if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
					    	$("#moreDiv").hide();
					    }else{
					    	//$("#moreDiv").show();
					    	initScroll();
					    }
						var items = data.items;
						for ( var i = 0; i < items.length; i++) {

							
							var cxtHtml = "";
							cxtHtml+="<div onclick=viewDetail('"+items[i].id+"') class=\"yilan-list2\">"
				               +"<div class=\"sp-right\">"
				               +"<div class=\"sp-rightin\">"
				               +"<p class=\"font14\"><b class=\"txt font14 bold\">"+items[i].projectName +" "+items[i].name+"</b></p>"
				               +"<p class=\"mt5 font14\">"
				               +"&nbsp;"+items[i].preview+"</p>"
				               cxtHtml+="<p class=\"font13\">";
				               cxtHtml+="<b class=\"fr color999\">"+(items[i].creatorName?items[i].creatorName:'')+" "+items[i].createTime+" 发布"+"</b>";
				               cxtHtml+="</p>";
				               cxtHtml+="</div>"			                         			               
				               +"</div>"		               		
				               +"<div class=\"sp-left\"><img src=\""+(items[i].creatorPhoto?(getPath()+'/images/'+items[i].creatorPhoto):(getPath()+'/default/style/images/mobile/man.jpg'))+"\" /></div>"
				               
				               +"</div>";
				               +"</div>"
				               if(!cxtHtml){
				            	   cxtHtml = '<div class="yilan-list" align="center"><b>没有找到相关记录</b></div>';
				   			}
				               $(".yilan").append(cxtHtml);
						}
						if(!items.length){
							var html='';
							html+='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
							html+='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
							html+='</div>';
							$(".yilan").append(html);
						}
								
					}, 'json');
	
}

function viewDetail(id){
	window.location.href = base+"/weixinapi/projectnews/view?id="+id;
}

