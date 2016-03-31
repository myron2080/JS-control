$(document).ready(function(){
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });

	 $('#searchBtn').click(function(){
		 searchData('0');
	 });
	 
	 $('#monthDiv').find('a').bind("click",function(){
		 var oType='down';
		 if($(this).hasClass("icon-svg23")){
			 oType='up'; 
		 }
		 changeMonth(oType);
	 });
	 
	 $('table td').click(function(){
		 $(this).addClass("selected").siblings().removeClass("selected");
		 searchData('0');
	 });
	 searchData('0');
});

function searchData(str){
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	if(!$('#queryMonth').val()){
		commonTipShow("日期不能为空！",1000);
		return false;
	}
	para.showMonth=$('#queryMonth').val();
	para.key=$('#keyWord').val();
	para.queryJob=$("table td[class='selected']").attr("key");
	showLoader();
	$.post(base+'/mobile/bi/busiCenter/bsRankDataByPerson',para,function(res){
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){
		    	$("#moreDiv").hide();
		    }else{
		    	//$("#moreDiv").show();
		    	initScroll();
		    }
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var div="";
			var colorIndex="d";
			if(str == '0'){//初始化
				$(".Perfolist2 ul").html("");
			}
			for(var i=0;i<showList.length;i++){	
				if(thePage==1 && i==0){
					colorIndex="a";
				}
				if(thePage==1 && i==1){
					colorIndex="b";
				}
				if(thePage==1 && i==2){
					colorIndex="c";
				}
				if(i>2){
					colorIndex="d";
				}
				$('<li><span class="Price1">'+showList[i].TOTAL_PRICE+'</span><b class="'+colorIndex+'-ico bold font16 fl">'+accAdd(para.pageSize*(para.currentPage-1),accAdd(1,i))+'</b>'+showList[i].DATANAME+'&nbsp;&nbsp;'+showList[i].DATAORGNAME+'</li>').appendTo(".Perfolist2 ul");
			}
		}else{
			$(".Perfolist2 ul").html("");
			var html="";
			html +='<div style="width:100%;top:30%;text-align:center; position:absolute; z-index:999;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$(".Perfolist2 ul").append(html);
		}
		$.mobile.loading( "hide" );
	},'json');
}