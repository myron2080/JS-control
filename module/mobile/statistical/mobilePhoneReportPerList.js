var Nowdate; 
var orfirtDay;
var orlastDay;
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
	 $.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $("#share").bind("click",function(){
			shareTo()
		}); 
	 $("#queryTypeTbl tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 changeEvent();
	 });
	 $("#orderTypeTbl tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 searchData('0');
	 });
   var queryType = $("#queryType").val(); 
   $("#queryTypeTbl td[key='"+queryType+"']").addClass("selected");
   $("#"+queryType+"Div").show().siblings("div").hide();
	searchData('0');
});
function shareTo(){
	var title="电销快报";
	var content;
	var queryType = $(".selected",$("#queryTypeTbl").get(0)).attr("key");
	if(queryType=="day"){
	content=$("#queryDay").val()+"快报";
	}else if(queryType=="week"){
	content=$("#queryWeek").val()+"快报";	
	}else{
	content=$("#queryMonth").val()+"快报";	
	}
	 
	var queryDay = $("#queryDay").val();
	var queryMonth = $("#queryMonth").val();
	var queryWeek = $("#queryWeek").val();
	var queryType = $("#queryType").val();
	var url=base+"/weixinapi/mobile/phonereport/listViewPer4Share?dataCenter="+currdataCenter+"&orgId="+orgId+
	"&queryDay="+queryDay+"&queryMonth="+queryMonth+"&queryWeek="+queryWeek+"&queryType="+queryType+"&share=share";
	 window.shareUtil.baiduShare(title,content,url,getPath()+"/default/style/images/mobile/sharedxkb.jpg");
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
	para.weekDate=$("#queryWeek").val();
	var queryType = $(".selected",$("#queryTypeTbl").get(0)).attr("key");
	para.queryType= queryType;
	para.keyword=$("#keyword").val();
	para.orgId=orgId;
	var orderType= $(".selected",$("#orderTypeTbl").get(0)).attr("key");  
	if(orderType=='JT_DOWN'){
		para.sortName= ' t2.PERSON_TWO';
		para.sortType= ' DESC';
	}else if(orderType=='BD_DOWN'){
		para.sortName= ' t2.PERSON_ONE';
		para.sortType= ' DESC';
	}else if(orderType=='ZSC_DOWN'){
		para.sortName= ' t2.PERSON_THREE';
		para.sortType= ' DESC';
	}else if(orderType=='PJSC_DOWN'){
		para.sortName= ' t2.PERSON_EIGHT';
		para.sortType= ' DESC';
	}
	$.post(base+'/weixinapi/mobile/phonereport/listPagDataPer',para,function(res){
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
		    	$("#moreDiv").show();
		    }
		if(null != res.items&&res.items.length!=0){
			var showList=res.items;
			var div="";
			for(var i=0;i<showList.length;i++){
				var obj=showList[i];
				indnumber++;
				var sortColor = 'd-ico';
				if(indnumber==1){
					sortColor = 'a-ico';
				}else if(indnumber==2){
					sortColor = 'b-ico';
				}
				else if(indnumber==3){
					sortColor = 'c-ico';
				}
				
				
				div+="<div class='yilantwo-white' id='bg_"+obj.PERSON_ID+"'>"
				div+="<div class='xf'>"
				div+="<span class='fl'><b class='"+sortColor+" bold font16  '>"+indnumber+"</b>&nbsp; <b class='color333 bold'>"+obj.PERSON_NAME+"-"+orgName+"</b></span>   <span class='fr colororange'>成功通数:"+obj.PERSON_TWO+"</span>"
				div+="</div>"
				div+="<div class='xf'>"
				div+="<span class='fl'><b class='color333 bold'>总拨打："+obj.PERSON_ONE+"</b></span>   <span class='fr'>总时长:"+obj.PERSON_THREE+" &nbsp;&nbsp;平均时长:"+obj.PERSON_EIGHT+"</span>"
				div+="</div>"
				div+="<div class='xf' style='border-bottom:none;'>"
				div+="<div class='xf-left'>"
				div+="<div class='xf-leftin'>"
				div+="<p style='width:100%;float:left;'><b class='color333 bold' style='width:64px;text-align:left;display:block; float:left;'>0-20秒:</b><b style='width:64px; float:left;'>"+obj.PERSON_FOUR+"</b><b class='color333 bold' style='width:71px;text-align:left;display:block; float:left;'> 20秒-1分:</b><b style='width:64px; float:left;'>"+obj.PERSON_FIVE+"</b></p>"
				div+="<p style='width:100%;float:left;'><b class='color333 bold' style='width:64px;text-align:left;display:block; float:left;'>1分-3分:</b><b style='width:64px; float:left;'>"+obj.PERSON_SIX+"</b><b class='color333 bold' style='width:71px;text-align:left;display:block; float:left;'> 3分以上:</b><b style='width:64px; float:left;'>"+obj.PERSON_SEVEN+"</b></p>"
				div+="</div>"
				div+="</div>"
				//div+="<div class='xf-right'><span class='icon-svg19' style='font-size:18px;'></span> </div>"
				div+="</div>"
				div+="</div>"
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
			html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='</div>'
			$("#listData").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}

//显示加载器  
function showLoader() {  
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });}

function changeEvent(){
	var queryType = $(".selected",$("#queryTypeTbl").get(0)).attr("key");
	if(queryType=="day"){
		$("#dayDiv").show();
		$("#monthDiv").hide();
		$("#weekDiv").hide();
		
	}else if(queryType=="week"){
		$("#dayDiv").hide();
		$("#monthDiv").hide();
		$("#weekDiv").show();
		Nowdate=new Date();
		orfirtDay=showWeekFirstDay();
		orlastDay=showWeekFirstDay();
		var firtDay=new Date(showWeekFirstDay()).format('yyyy/MM/dd');
		var lastDay=new Date(showWeekLastDay()).format('yyyy/MM/dd');
		var weekDate=firtDay+"-"+lastDay;
		$("#queryWeek").val(weekDate);
	}else{
		$("#dayDiv").hide();
		$("#monthDiv").show();
		$("#weekDiv").hide();
	}
    searchData('0');
}


var d=new Date();

function changeDay(type){
	var showDay=$("#queryDay").val();
	var endTime=d.format('yyyy-MM-dd');
	if(null != showDay && showDay != ''){
		if(type=="down" && showDay>=endTime){
			$("#dayDown").hide();
			return ;
		} 
		$.post(getPath()+'/weixinapi/mobile/phonereport/getDate',{showDay:showDay,type:type},function(json){
			if(null != json.result){
				$("#queryDay").val(json.result);
				if(json.result>=endTime){
					$("#dayDown").hide();
				}else{
					$("#dayDown").show();
				}
				searchData('0');
			}
		},'json');
	}else{
		//art.dialog.tips("请选择日期!");
	}
}
//月的累加减
function changeMonth(type) {
	var showMonth = $("#queryMonth").val();
	if (null != showMonth && showMonth != '') {
		
		var y = parseInt(showMonth.split("-")[0], 10);// 年
		var m = parseInt(showMonth.split("-")[1], 10);// 月
		var year;
		var month;
		if (type == 'up') {// 上一月
			if (m == 1) {
				year = (y - 1) + "";
				month = "12";
			} else {
				year = y + "";
				if (m < 11) {// 月份 需加0
					month = "0" + (m - 1);
				} else {
					month = (m - 1) + "";
				}
			}
		} else {// 下一月
			var endTime=d.format('yyyy-MM');
			if(showMonth>=endTime){
				$("#monthDown").hide();
				return ;
			} 
			if (m == 12) {
				year = (y + 1) + "";
				month = "01";
			} else {
				year = y + "";
				if (m < 9) {//月份 需加0
					month = "0" + (m + 1);
				} else {
					month = (m + 1) + "";
				}
			}
		}
		var endTime=d.format('yyyy-MM');
		showMonth = year + "-" + month;
		if(showMonth>=endTime){
			$("#monthDown").hide();
		}else{
			$("#monthDown").show();
		}
		$("#queryMonth").val(showMonth);
		searchData('0');
	}else{
		art.dialog({icon:'warning',time:1, content:"请选择日期!"});
	}
}
//周的累加减
function changeWeek(type) {
	if (type == 'up'){
		var firtDay=new Date((orfirtDay/1000-7*86400)*1000).format('yyyy/MM/dd');
		var lastDay=new Date(orfirtDay-86400000).format('yyyy/MM/dd');
			orfirtDay=new Date((orfirtDay/1000-7*86400)*1000);
			orlastDay=new Date(orfirtDay-86400000);
		var weekDate=firtDay+"-"+lastDay;
		$("#weekDown").show();
		$("#queryWeek").val(weekDate);
	}else{
		var endTime=d.format('yyyy/MM/dd');
		Nowdate	= new Date((orlastDay/1000+86400)*1000); 
		if(Nowdate.format('yyyy/MM/dd')>=endTime){
			$("#weekDown").hide();
			return ;
		} 
		 var firtDay=new Date(showNextFirstWeekDay()).format('yyyy/MM/dd');
		 var lastDay=new Date(showNextLastWeekDay()).format('yyyy/MM/dd');
		orfirtDay=showWeekFirstDay();
		orlastDay=showWeekLastDay();
		var weekDate=firtDay+"-"+lastDay;
		
		if(lastDay>=endTime){
			$("#weekDown").hide();
		}else{
			$("#weekDown").show();
		}
		$("#queryWeek").val(weekDate);
	}
	searchData('0');
}
//本周第一天  
function showWeekFirstDay()  
{  
//var Nowdate=new Date();  
var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);  
return WeekFirstDay;  
}  
//本周最后一天  
function showWeekLastDay()  
{  
//var Nowdate=new Date();  
var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);  
var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);  
return WeekLastDay;  
}
//上周第一天  
function showPreviousFirstWeekDay()  
{  
var WeekFirstDay=showWeekFirstDay()  
return new Date(WeekFirstDay-86400000*7)  
}  
//上周最后一天  
function showPreviousLastWeekDay()  
{  
var WeekFirstDay=showWeekFirstDay()  
return new Date(WeekFirstDay-86400000)  
}  
//下周第一天  
function showNextFirstWeekDay()  
{  
var MonthFirstDay=showWeekLastDay()  
return new Date((MonthFirstDay/1000+86400)*1000)  
}  
//下周最后一天  
function showNextLastWeekDay()  
{  
var MonthFirstDay=showWeekLastDay()  
return new Date((MonthFirstDay/1000+7*86400)*1000)  
}  
//上一天  
function showPreviousDay()  
{  
var MonthFirstDay=new Date();  
return new Date(MonthFirstDay-86400000);  
}  
//下一天  
function showNextDay()  
{  
var MonthFirstDay=new Date();
return new Date((MonthFirstDay/1000+86400)*1000);  
}
