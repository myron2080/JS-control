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
	 //$.mobile.selectmenu.prototype.options.nativeMenu = false;//select 弹出层选择
}).ready(function(){
	 orfirtDay =new Date($("#firtDay").val().replace(/-/,"/"));
	 orlastDay =new Date($("#lastDay").val().replace(/-/,"/"));
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $('h1 a').bind("click",function(){
		 $(this).hasClass("icon-svg7");
		 var oType='down';
		 if($(this).hasClass("icon-svg7")){
			 oType='up'; 
		 }
		 var queryType = $(this).parents().attr("id");
			 if(queryType == "dayDiv"){
				 changeDay(oType);
			 }else if(queryType == "monthDiv"){
				 changeMonth(oType);
			 }else{
				 changeWeek(oType);
			 }
		 });
	 $("#share").bind("click",function(){
		  if (typeof window.shareUtil == 'undefined') {
			  //msgDialog("分享功能仅限于鼎尖浏览器使用！");
			  commonTipShow("分享功能仅限于鼎尖浏览器使用！",1000);
		      return false;
		    } else {
			shareTo();}
		});
	 $("#queryTypeTbl tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 $("#queryType").val($(this).attr("key"));
		 changeEvent();
		 //searchData('0');
	 });
	 $("#orderTypeTbl tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 $("#orderType").val($(this).attr("key"));
		 searchData('0');
	 });
	 

	 changeEvent();
});
function shareTo(){
	var title="新房快报";
	var content;
	if($("#queryType").val()=="day"){
	content=$("#queryDay").val()+"快报";
	}else if($("#queryType").val()=="week"){
	content=$("#queryWeek").val()+"快报";	
	}else{
	content=$("#queryMonth").val()+"快报";	
	}
	var pram="&currentDay="+$("#queryDay").val()+"&currentMonth="+$("#queryMonth").val()+"&weekDate="+$("#queryWeek").val()+"&dateType="+$("#queryType").val()+"&orderType="+$("#orderType").val()+"&firtDay="+firtDay+"&lastDay="+lastDay;
    var url_=window.location.href;
	var url=url_.replace(/listViewPer/, "listViewPerShare")+"&dataCenter="+currdataCenter+"&share=share&fromPage=self"+pram;
	 window.shareUtil.baiduShare(title,content,url,getPath()+"/default/style/images/mobile/sharexfkb.jpg");
}

function queryData(){
	searchData('0');
}

function checkDate(startTime){  
	   var aStart=startTime.split('-'); //转成成数组，分别为年，月，日，下同  
	   var startDate = aStart[0]+"/" + aStart[1]+ "/" + aStart[2];  
	   var d=new Date();
	   var endTime=d.format('yyyy-MM-dd');
	   var aEnd=endTime.split('-');  
	   var endDate = aEnd[0] + "/" + aEnd[1] + "/" + aEnd[2];  
	   if (startDate > endDate) {  
		   commonTipShow("无法查询还未到的日期哦！",1000);
	    return false;  
	   }  
	    return true;  
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
	//para.personId = currentId;
	para.pageSize = 10;
	
	para.startDay=$("#queryDay").val();
	para.endDay=$("#queryDay").val();
	para.startMonth=$("#queryMonth").val();
	para.endMonth=$("#queryMonth").val();
	para.weekDate=$("#queryWeek").val();
	para.orderType=$("#orderType").val();
	para.queryType=$("#queryType").val();
	para.orgName=$("#keyword").val();
	para.personName=$("#keyword").val();
	para.prarentOrgId=$("#prarentOrgId").val();
	$.post(base+'/weixinapi/mobile/fastsalereport/listPagDataPer',para,function(res){
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
				var pernon="未查找到！"
				    var loginDays="(未曾登录)";
					if(obj.LOGINDATA){
						loginDays="登录："+obj.LOGINDATA+"次";
					}
					var nodealdays=0;
					if(obj.NOTDEALDAYS>=0){
						nodealdays=obj.NOTDEALDAYS;
					}
				    div+="<div class='yilantwo-white' id='bg_"+obj.ORG_ID+"'>"
					div+="<div class='xf'>"
					div+="<span class='fl'><b class='"+sortColor+" bold font16 fl'>"+indnumber+"</b>   <b class='color333 bold fl'>"+obj.PERSON_NAME+"-"+obj.ORG_NAME+"</b></span>   <span class='fr'>"+loginDays+"</span>"
					div+="</div>"
					div+="<div class='xf'>"
					div+="<span class='fl'><b class='color333 bold'>"+nodealdays+"天未开单</b></span>   <span class='fr'>"+obj.NOTCHARGECUSDAYS+"天未带客 &nbsp;&nbsp;<em class='colororange'>成功预约： "+obj.YUYUE_DATA+"</em></span>"
					div+="</div>"
					div+="<div class='xf' style='border-bottom:none;'>"
					div+="<div class='xf-left'>"
					div+="<div class='xf-leftin'>"
					div+="<p><b class='color333 bold'>新增客户：</b>总"+obj.NEW_ADD+"(电话"+obj.TELCU_DATA+"   街霸"+obj.STREET_DATA+"  网络"+obj.INTERNET_DATA+" 其他"+obj.OTHER_DATA+")</p>"
					div+="<p><b class='color333 bold'>电话跟进：</b>总"+obj.TELFOLLOW_DATA+"  意向"+obj.TELHASINTEREST_DATA+"   无意向"+obj. TELNOINTENTION_DATA+"&nbsp;失败"+obj.TEL_FAIL+"</p>"
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
	
	if($("#queryType").val()=="day"){
		$("#dayDiv").show();
		$("#monthDiv").hide();
		$("#weekDiv").hide();
		
	}else if($("#queryType").val()=="week"){
		$("#dayDiv").hide();
		$("#monthDiv").hide();
		$("#weekDiv").show();
		if($("#queryWeek").val()==null || $("#queryWeek").val()==''){
        var now=$("#queryDay").val();
		Nowdate=new Date(now.replace(/-/,"/"));
		orfirtDay=showWeekFirstDay();
		orlastDay=showWeekFirstDay();
		var firtDay=new Date(showWeekFirstDay()).format('yyyy/MM/dd');
		var lastDay=new Date(showWeekLastDay()).format('yyyy/MM/dd');
		var weekDate=firtDay+"-"+lastDay;
		$("#queryWeek").val(weekDate);}
	}else{
		$("#dayDiv").hide();
		$("#monthDiv").show();
		$("#weekDiv").hide();
	}
    searchData('0');
}
function changeDay(type){
	var showDay=$("#queryDay").val();
	if(null != showDay && showDay != ''){
		$.post(getPath()+'/weixinapi/mobile/fastsalereport/getDate',{showDay:showDay,type:type},function(json){
			if(null != json.result){
				if(checkDate(json.result)){
					$("#queryDay").val(json.result);
					searchData('0');}
			}
		},'json');
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
			searchData('0');
		} else {// 下一月
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
		if(checkDate(year + "-" + month+"-01")){
			$("#queryMonth").val(year + "-" + month);
			
			
			searchData('0');}
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
		$("#queryWeek").val(weekDate);
		searchData('0');
	}else{
		Nowdate	= new Date((orlastDay/1000+86400)*1000);
		 var firtDay=new Date(showNextFirstWeekDay()).format('yyyy/MM/dd');
		 var lastDay=new Date(showNextLastWeekDay()).format('yyyy/MM/dd');
		orfirtDay=showWeekFirstDay();
		orlastDay=showWeekLastDay();
		var weekDate=firtDay+"-"+lastDay;
		if(checkDate(orlastDay.format('yyyy-MM-dd'))){
			$("#queryWeek").val(weekDate);
			searchData('0');}
	}
	
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

/**
 * 弹出 提示信息
 * @param txt
 */
function msgDialog(txt){
	$("#msgStr").text(txt);
	 $("#popupSystemMsg").popup("open");
	 setTimeout("$('#popupSystemMsg').popup('close')", 1000 );
}

