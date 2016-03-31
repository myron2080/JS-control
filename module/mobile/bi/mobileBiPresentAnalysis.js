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
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $("div[id^='div_date_']").find('a').bind("click",function(){
		 var oType='down';
		 if($(this).hasClass("icon-svg23")){
			 oType='up'; 
		 }
		 var queryType =$(this).parent().attr("id");
			 if(queryType == "div_date_day"){
				 changeDay(oType);
			 }else if(queryType == "div_date_month"){
				 changeMonth(oType);
			 }else{
				 changeWeek(oType);
			 }
     });

	if($("#firtDay").val()!=null){
		 orfirtDay =new Date($("#firtDay").val().replace(/-/,"/"));
		 orlastDay =new Date($("#lastDay").val().replace(/-/,"/"));
		 changeEvent();
     }else{
    	 searchData('0');
     }
});

function queryData(){
	searchData('0');
}
  
var sortNumber=0;
function searchData(str){
	//showLoader();
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
	para.orgLevelDesc =$("#orgDesc").val()=="selectArea"?"personLevel":$("#orgDesc").val();
	para.key = $("#keyword").val();
	para.itemId=$('#houseProject').val();
	para.busNumber="F07";//代理业务
	$.post(base+'/weixinapi/mobile/presentAnalysis/searchData',para,function(res){
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
				div+="<div class='yilan-list'>";
				div+="<p class='fl' style='width:100%;line-height:21px;'>";
				div+="<span class='fl'><em class='font16 bold fl' style='line-height:21px;'>"+showList[i].ORGNAME+"</em>";
				div+="<em class='font14 fl ml5' style='line-height:21px;'>"+showList[i].PERSONNAME+"</em></span>";
				div+="</p>";
				div+="<p class='fl mt10' style='width:100%;'>";
				div+="<span class='color666 w3'>快销客："+showList[i].FASTCUSTOMER.toFixed(2)+"</span>";
				div+="<span class='color666 w3'>上门客："+showList[i].INNER_VISIT.toFixed(2)+"</span>";
				div+="<span class='color666 w3'>合计："+showList[i].CONSULT.toFixed(2)+"</span>";
				div+="</p>";
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

function setOrgPickerPara(par){
	par.businessType='4a4128da-8399-4f37-bc7f-e7c027590078';//代理业务
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
	
	var orgDesc=$('select[name="orgDesc"]');
	if(orgDesc.val()=="personLevel"||orgDesc.val()=="selectArea"){
		$("#keyword").attr("placeholder","部门/人员");
	}else{
		$("#keyword").attr("placeholder","部门");}
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
	$("#keyword").val("");
	//changeEvent();
}
////组织选择器参数设置
//function setOrgPickerPara(para){
//	 //para.businessType="652001e9-3338-4556-a60f-079cb3e58f12";//盘客业务Id
//}
function clearchoose(event){
	$("#orgName").html('选择组织');
	$("#orgDesc").val("");
	$("#orgId").val("");
	var p = $('select[name="orgDesc"]');
	p.val("");
	p.html("<option value='selectArea'>选区域</option>");
	$("#orgDesc").trigger('change');
	event.stopPropagation();	
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
