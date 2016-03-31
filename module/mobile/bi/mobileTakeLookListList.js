$(document).on("click", "#moreBtn", function() {
	  var $this = $( this ),
	  html = $this.jqmData( "html" ) || "";
	$.mobile.loading( 'show', {
	  text: "加载中...",
	  textVisible: true,
	  theme: "b",
	  textonly: false,
	  html: html
	  });
}).on("mobileinit", function() {
}).ready(function(){
	bindEvent();
});

function bindEvent(){
	var url = window.location.href;
	if(url.indexOf("showDetail")>0){
		$.mobile.changePage( "#listPage", { role: "page" } );
	}
	 
	$("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	});
	
	$("div[id^='div_date_']").find('a').bind("click",function(){
		 
		 var oType='down';
		 if($(this).hasClass("icon-svg23")){
			 oType='up'; 
		 }
		 var queryType = $(this).parents().attr("id");
		 if(queryType == "div_date_day"){
			 changeDay(oType);
		 }else if(queryType == "div_date_month"){
			 changeMonth(oType);
		 }else{
			 changeWeek(oType);
		 }
	 });
    searchData('0');
}

function queryData(){
	searchData('0');
}
  
var sortNumber=0;
function searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
		sortNumber=0;
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	
	$("#currentPage").val(thePage);
	var para = {};
	para.currentPage = thePage;
	para.pageSize = 10;
	para.startDay=$("#queryDay").val();
	para.endDay=$("#queryDay").val();
	para.startMonth=$("#queryMonth").val();
	para.endMonth=$("#queryMonth").val();
	para.weekDate=$("#queryWeek").attr("key");
//	para.queryType=$("#queryType").val();
	para.queryType= $("td[class='selected']").attr("value");
	para.orgId=$("#orgId").val();
	para.orgLevelDesc =$("#orgDesc").val();
	$.post(base+'/mobile/bi/fastsalereport/searchTakeLookData',para,function(res){
		var indnumber = 0;
		if(str == '0'){
			indnumber = 0;
		}else{
			indnumber = sortNumber;
		}
		$("#totalPage").val(res.pageCount);
		 if($("#currentPage").val() == $("#totalPage").val()){//当前为最后一页 隐藏更多按钮
		    	$("#moreDiv").hide();
		 }else{
		    	//$("#moreDiv").show();
			 initScroll();
		 }
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				var dk=obj.NUMBERCUSTOMER_DATA;
				if(!dk){
					dk=0;
				}
				
				var dataName="";
				var flag="";
				if($("#orgDesc").val()=="personLevel"){
					flag="person";
					dataName="";
				}else{
					flag="org";
					dataName="经理:";
				}
				var nameData=obj.NAME_DATA;
				if(obj.CHARGENAME){
					nameData=obj.NAME_DATA+"-"+dataName+obj.CHARGENAME;
				}
				
				div+="<div class='yilantwo-white1'>";
				div+="<div class='xf-leftin'><span class='xmName'>"+nameData+"</span>带客量："+dk.toFixed(2)+"";
				if(dk>0){
					div+="<a class='lookmore' onclick=showTakeDetail(\""+flag+"\",\""+obj.ID_DATA+"\")>详情</a>";
				}
				div+="</div>";
				div+="</div>";
			}
			if(str == '0'){//初始化
				$("#listData").html("");
			}
			$("#listData").append(div);
			sortNumber = indnumber;
			$.mobile.loading( "hide" );
		}else{
			$("#listData").html("");
			var html="";
			html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			html +='</div>'
			$("#listData").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}

function showTakeDetail(flag,id){
	var param="?flag="+flag;
	param+="&dataId="+id;
	param+="&startDay="+$("#queryDay").val();
	param+="&endDay="+$("#queryDay").val();
	param+="&startMonth="+$("#queryMonth").val();
	param+="&endMonth="+$("#queryMonth").val();
	param+="&weekDate="+$("#queryWeek").attr("key");
	param+="&queryType="+$("td[class='selected']").attr("value");
	window.location.href=base+"/mobile/bi/fastsalereport/takeLookDetailList"+param;
}

function typeTdClick(obj,str){
	
	var now = $("td[class='selected']");
	if($(obj).hasClass('selected')){
		return ;
	}else{
		now.removeClass('selected');
		$(obj).addClass('selected');
	}
//	$("#queryType").val(str);
	changeEvent(str);
}

function changeEvent(str){
	if(str){
		setDateCtrls(str);
	}
	if(str=='week'){
		if($("#queryWeek").attr("key")==null || $("#queryWeek").attr("key")==''){
			getCurrentWeek();
		}
	}
    searchData('0');
}

function setDateCtrls(doc){
	$("div[id^='div_date_']").hide();
	$("div[id='div_date_"+doc+"']").show();
}

function chooseOrg(obj){
	$.mobile.changePage( "#listPage", { role: "page" } );
	$("#orgId").val($(obj).attr("key"));
	var orgLevelDesc = $(obj).attr("orgLevelDesc");
	changeOrgLevel(orgLevelDesc );
	$("#orgName").html($(obj).attr("name")+" "+"<b class='qin' onclick='clearchoose(event)'>清</b>");
	$("#orgKeyWord").val("");
}

function clearchoose(event){
	$("#orgName").html('选择组织');
	$("#orgDesc").val("");
	$("#orgId").val("");
	var p = $('select[name="orgDesc"]');
	p.val("");
	p.html("<option value='personLevel'>个人级</option>");
	$("#orgDesc").trigger('change');
	event.stopPropagation();	
}
