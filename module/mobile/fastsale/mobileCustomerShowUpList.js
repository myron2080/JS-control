var Nowdate; 
var orfirtDay;
var orlastDay;
var startYear;
var endYear;
$(document).ready(function(){
	var url = window.location.href;
	 if(url.indexOf("showDetail")>0){
		 $.mobile.changePage( "#listPage", { role: "page" } );
	 }
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $("#intentionCusStatus tr td").bind("click",function(){
		 $(this).addClass("selected").siblings("td").removeClass("selected");
		 searchData('0');
	 });
	 /*$("#addBtn").bind("click",function(event, ui) {
			addPerson();
	  });*/
	 timeSeting();
	//日期选择Start
	 //orfirtDay =new Date($("#firtDay").val().replace(/-/,"/"));
	 //orlastDay =new Date($("#lastDay").val().replace(/-/,"/"));
	 $('#dayDiv,#monthDiv,#weekDiv').find('a').bind("click",function(){
		 var oType='down';
		 if($(this).hasClass("icon-svg23")){
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
	//日期选择End
});
function queryClick(obj,str){
	
	var now = $("#dateType td[class='selected']");
	if($(obj).hasClass('selected')){
		return ;
	}else{
		now.removeClass('selected');
		$(obj).addClass('selected');
	}
	$("#queryType").val(str);
	timeSeting();
}
function typeTdClick(obj,str){
	$("#showType").text($(obj).text());
	$("#orderType").val(str);
	$("#orderDiv").toggle();
	changeEvent();
}
function backListPage(){
	 $.mobile.changePage( "#listPage", { role: "page" } );
}
function showLoader() { 
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b'       //加载器主题样式a-e  
        //textonly: false,   //是否只显示文字  
        //html: ""           //要显示的html内容，如图片等  
    });}
/** 
 * 选择排序类型
 */
function chooseType(){
	$("#orderDiv").toggle();
}

function changeEvent(){
	$("#mylist").html('');
	$("#currentPage").val("1");
	getDataCount();
	searchData('0');
}

function searchData(str){
	showLoader();
	var thePage;
	var currentPage=$("#currentPage").val();
	var totalPage=$("#totalPage").val();
	if(str == '0'){//初始化
		thePage=1;
		sortNumber=0;
		$("#mylist").html('');
	}else{//点更多
		thePage=parseInt(currentPage,10)+1;
	}
	$("#currentPage").val(thePage);
	var param = {};
	setDateParam(param);
	param.currentPage = thePage;
	param.pageSize = 10;
	$("#currentPage").val(thePage);
	var keyWord=$("#keyWord").val();
	var status = $(".selected").attr("key");
	param.mobileQueryKeyWord = keyWord;
	var houseProjectId = $("#houseProject").val();
	if(houseProjectId==null||houseProjectId==""){
		$("#listData").html("");
		var html="";
		html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
		html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
		//html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
		html +='</div>'
		$("#listData").append(html);
		$.mobile.loading( "hide" );
		return;
	}
	param.project = houseProjectId=="ALL"?"":houseProjectId;
	if(status){
	 param.mobileQueryCustomStatus = status;
	}
	$.post(base+'/mobile/customershowup/listPagData',param,function(res){
		if(str == '0')
		$("#mylist").html('');
		$("#totalPage").val(res.pageCount);
		$("#totalCount").html(res.recordCount);
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
				var reg = /(\d{3})\d{4}(\d{4})/;
				var customerPhone = obj.intentionCustomer.customerPhone.replace(reg,"$1****$2");
				/*div +=('<div class="yilan-list" objid="'+obj.id+'"  id="bg_'+obj.id+'">'+
		          '<p class="fl" style="width:100%;line-height:21px;">'+
		             '<span class="fl">'+
		                // '<b class="'+colorClass+'">'+obj.customerLevelValue+'</b>'+
		                 '<em class="font14 bold fl" style="line-height:28px;">'+obj.intentionCustomer.customerName+'</em>'+
		                 '<em class="font14 fl ml5" style="line-height:28px;">'+customerPhone+'</em>'+
		             '</span>'+
		             '<span class="fr color999">  <a class="lightblue-btn mr5 fl"  href="javascript:void(0);" id="'+obj.id+'" key="'+obj.id+'" key1="'+obj.intentionCustomer.id+'" key2="'+obj.intentionCustomer.customerName+'" onclick="turnPage(\''+obj.id+'\');">到场</a>     <a class="lightgreen-btn fr"  href="javascript:void(0);" onclick="toNotShowUp(\''+obj.id+'\')">未到场</a></span>'+
		          '</p>'+
		          '<p class="fl mt10" style="width:100%;">'+
		            '<b class="bold font14">归属人：</b> <em class="color999  font14">'+(obj.intentionCustomer.org==null?"缺失信息":obj.intentionCustomer.org.name)+' '+(obj.intentionCustomer.person==null?"缺失信息":obj.intentionCustomer.person.name)+'</em>'+
		          '</p>'+
		     '</div>');*/
				div +='<div class="yilan-list" objid="'+obj.id+'"  id="bg_'+obj.id+'"';
				/*if(cusStatus!=null&&(obj.intentionCustomer.status == 'HAVEBEENTO'||obj.intentionCustomer.status == 'NOBEENTO')){
					div +=        ' onclick=showDetail("'+obj.intentionCustomer.id+'") ';
					}*/
				div +=         '>';
				div +=         '<p class="fl" style="width:100%;line-height:21px;">';
				div +=             '<span class="fl">';
				                // '<b class="'+colorClass+'">'+obj.customerLevelValue+'</b>'+
				div +=                 '<em class="font14 bold fl" style="line-height:28px;">'+obj.intentionCustomer.customerName+'</em>';
				div +=                 '<em class="font14 fl ml5" style="line-height:28px;">'+customerPhone+'</em>';
				div +=             '</span>';
				if(obj.intentionCustomer.status != 'HAVEBEENTO'&&obj.intentionCustomer.status != 'NOBEENTO'){
				div +=             '<span class="fr color999">  ';
				div +=             '<a class="weixingreen-btn mr5 fl"  href="javascript:void(0);" id="'+obj.id+'" key="'+obj.id+'" key1="'+obj.intentionCustomer.id+'" key2="'+obj.intentionCustomer.customerName+'" onclick="turnPage(\''+obj.id+'\');">到场</a>';
				div +=             '<a class="gray-btn fr"  href="javascript:void(0);" onclick="toNotShowUp(\''+obj.id+'\')">未到场</a>';
				div +=             '</span>';}
				div +=	          '</p>'
				div +=	          '<p class="fl mt10" style="width:100%;">';
				div +=	            '<b class="bold font14">归属人：</b> <em class="color999  font14">'+(obj.intentionCustomer.org==null?"缺失信息":obj.intentionCustomer.org.name)+' '+(obj.intentionCustomer.person==null?"缺失信息":obj.intentionCustomer.person.name)+'</em>';
				if(obj.intentionCustomer.status == 'HAVEBEENTO'){
					if(obj.confirmPerson!=null){
					div +=	            '<b class="bold font14">    确认人：</b> <em class="color999  font14">'+obj.confirmPerson.name+'</em>';}
				}
				div +=	          '</p>';
				div +=     '</div>';
			}
			
			if(str == '0'){//初始化
				$("#listData").html("");
			}
			$("#listData").append(div);
			$.mobile.loading( "hide" );
		}else{
			
			$("#listData").html("");
			var html="";
			html +='<div style="width:95%; min-height:200px; text-align:center; padding-top:30%;">';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
			//html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='</div>'
			$("#listData").append(html);
			$.mobile.loading( "hide" );
		}
	},'json');
}
function showDetail(id){
	window.location.href=base+"/mobilefastsale/intention/view?id="+id;
	
}
function setDateParam(param){
	var startDate = '';
	var endDate = '';
	var dateStr='';
	if($("#queryType").val()=="day"){
	dateStr = $("#queryDay").attr("key");
	startDate = dateStr;
	endDate = dateStr;
	}else if($("#queryType").val()=="week"){
		dateStr = $("#queryWeek").attr("key");
		var str =dateStr.split("-");
		
		startDate = str[0].replace("/","-").replace("/","-");
		endDate =str[1].replace("/","-").replace("/","-");
	}else{
	dateStr = $("#queryMonth").attr("key");
	var str =dateStr.split("-");
	startDate = dateStr+"-01";
	endDate = dateStr+"-"+getMonthLastDay(parseInt(str[0]),parseInt(str[1]));
	}
	param.startDate=startDate;
	param.endDate=endDate;
}
function getDataCount(){
	var param = {};
	setDateParam(param);
	var keyWord=$("#keyWord").val();
	var status = $(".selected").attr("key");
	param.mobileQueryKeyWord = keyWord;
	var houseProjectId = $("#houseProject").val();
	if(houseProjectId==null||houseProjectId=="")return;
	param.project = houseProjectId=="ALL"?"":houseProjectId;
	if(status){
	 param.mobileQueryCustomStatus = status;
	}
	$("#BESPEAKED_count").html("");
	 $("#HAVEBEENTO_count").html("");
	 $("#NOBEENTO_count").html("");
	$.post(base+'/mobile/customershowup/getPagDataCount',param,function(res){
		if(res.STATE='SUCCESS'){
		if(res.COUNTMAP){
		var countMap = res.COUNTMAP;
	    $("#BESPEAKED_count").html("("+countMap.BESPEAKED_COUNT+")");
	    $("#HAVEBEENTO_count").html("("+countMap.HAVEBEENTO_COUNT+")");
	    $("#NOBEENTO_count").html("("+countMap.NOBEENTO_COUNT+")");
		}}
	},'json');
}
function shouwUp(id){
	var obj =$("#"+id);
	//$("#belonPerson").html(obj.attr("key2"));
	$("#customerBeSpeakId").val(obj.attr("key"));
	$("#customerId").val(obj.attr("key1"));
	$("#showUpDiv" ).popup( "open" );
}
function saveArrive(){ 	
	setPerson();
	$.post($('#arriveForm').attr('action'),$('#arriveForm').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			$("#arriveOpDiv" ).popup( "close" );
			//initBeSpeakData();
			$("#arriveForm")[0].reset();
		}else{
			//错误信息
			//msgDialog(res.MSG);
		}
    },'json');
}
function changeDay(type){
	var showDay=$("#queryDay").val();
	if(null != showDay && showDay != ''){
		$.post(getPath()+'/mobile/bi/fastsalereport/getDate',{showDay:showDay,type:type},function(json){
			if(null != json.result){
				//if(checkDate(json.result)){}
				$("#queryDay").attr("key",json.result);
				$("#queryDay").val(json.result);
				 getDataCount();
				searchData('0');
			}
		},'json');
	}
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

function toNotShowUp(id){
	$("#toDoId").val(id);
	$( "#notBeenToDiv" ).popup( "open" );	
	//commonCfmShow("确定该操作么?",'notShowUp()');
}
function clearTitle(){
	$("#lableTitle").html("");
	$("#notBeentoRemark").html("");
}	 
function notShowUp(){
	var sendType = "DEAL";
	var param ={};
	param.id=$("#toDoId").val();
	param.sendType=sendType;
	var notBeentoRemark = $("#notBeentoRemark").val();
	if(notBeentoRemark==''||notBeentoRemark == null){
	$("#lableTitle").html("请输入原因！");
	}else{
	param.notBeentoRemark = notBeentoRemark;
    $.post(base+'/mobile/customershowup/updateCustomerBeSpeak',param,function(res){
			 if(res.STATE == 'SUCCESS'){
				 $( "#notBeenToDiv" ).popup( "close" );	
					searchData('0');
				}else{
				}
		 },'json');}
	}
function turnPage(id){
	/*$("#loading").show();
	$("#iframeId").remove();
	$.mobile.changePage( "#showDetail", { role: "page" } );
	$('<iframe src="" id="iframeId" width="100%" height="100%" frameborder="0"></iframe>').appendTo("#showDetail");
	 
	setTimeout(function(){
	$("#iframeId").attr("src",base+'/mobile/customershowup/customerShowUpEdit?id='+id);
	},500);
	$("#iframeId").bind('load', function() {
		$("#loading").hide();
	});*/
	window.location.href=base+'/mobile/customershowup/customerShowUpEdit?id='+id+'&houseProjectId='+$("#houseProject").val();
}
//时间设置Start
function timeSeting(){
	if($("#queryType").val()=="day"){
		$("#dayDiv").show();
		$("#monthDiv").hide();
		$("#weekDiv").hide();
		
	}else if($("#queryType").val()=="week"){
		$("#dayDiv").hide();
		$("#monthDiv").hide();
		$("#weekDiv").show();
		if($("#queryWeek").attr("key")==null || $("#queryWeek").attr("key")==''){
			var now=$("#queryDay").val();
			Nowdate=new Date(now.replace(/-/,"/"));
			Nowdate=new Date();
			orfirtDay=showWeekFirstDay();
			orlastDay=showWeekFirstDay();
	        var firtDay=new Date(showWeekFirstDay()).format('yyyy/MM/dd');
			var lastDay=new Date(showWeekLastDay()).format('yyyy/MM/dd');
			var weekDate=firtDay+"-"+lastDay;
			var firtDay_=new Date(showWeekFirstDay()).format('MM/dd');
			var lastDay_=new Date(showWeekLastDay()).format('MM/dd');
			var weekDate_=firtDay_+"-"+lastDay_;
			$("#queryWeek").attr("key",weekDate);
			$("#queryWeek").val(weekDate_);
		}
	}else{
		$("#dayDiv").hide();
		$("#monthDiv").show();
		$("#weekDiv").hide();
	}
	getDataCount();
	 searchData('0');
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
		$("#queryMonth").attr("key",year + "-" + month);
		getDataCount();
		searchData('0');}
	}else{
		art.dialog({icon:'warning',time:1, content:"请选择日期!"});
	}
}
function getMonthLastDay(year,month) {     
 var new_year = year;  //取当前的年份   
 var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）   
 if(month>12)      //如果当前大于12月，则年份转到下一年   
 {   
 new_month -=12;    //月份减   
 new_year++;      //年份增   
 }   
 var new_date = new Date(new_year,new_month,1);        //取当年当月中的第一天   
 var lastDay_date = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期   
 return lastDay_date ;
}   
//周的累加减
function changeWeek(type) {
	if (type == 'up'){
		   var firtDay=new Date((orfirtDay/1000-7*86400)*1000).format('yyyy/MM/dd');
	       var lastDay=new Date(orfirtDay-86400000).format('yyyy/MM/dd');
		   var  firtDay_=new Date((orfirtDay/1000-7*86400)*1000).format('MM/dd');
		   var   lastDay_=new Date(orfirtDay-86400000).format('MM/dd');
			orfirtDay=new Date((orfirtDay/1000-7*86400)*1000);
			orlastDay=new Date(orfirtDay-86400000);
		var weekDate=firtDay+"-"+lastDay;
		var weekDate_=firtDay_+"-"+lastDay_;
		$("#queryWeek").attr("key",weekDate);
		$("#queryWeek").val(weekDate_);
		getDataCount();
		searchData('0');
	}else{
		Nowdate	= new Date((orlastDay/1000+86400)*1000);
		var firtDay=new Date(showNextFirstWeekDay()).format('yyyy/MM/dd');
		var lastDay=new Date(showNextLastWeekDay()).format('yyyy/MM/dd');
		var firtDay_=new Date(showNextFirstWeekDay()).format('MM/dd');
		var lastDay_=new Date(showNextLastWeekDay()).format('MM/dd');
		orfirtDay=showWeekFirstDay();
		orlastDay=showWeekLastDay();
		var weekDate=firtDay+"-"+lastDay;
		var weekDate_=firtDay_+"-"+lastDay_;
		if(checkDate(orlastDay.format('yyyy-MM-dd'))){
			$("#queryWeek").val(weekDate_);
			$("#queryWeek").attr("key",weekDate);
			getDataCount();
			searchData('0');}
	}
}
//本周第一天  
function showWeekFirstDay()  
{  
var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);  
return WeekFirstDay;  
}  
//得到每周的第一天(周一)  
function getFirstDateOfWeek(theDate){  
 var firstDateOfWeek;  
 theDate.setDate(theDate.getDate() + 1 - theDate.getDay());   
 firstDateOfWeek = theDate;  
 return firstDateOfWeek;   
}  
//得到每周的最后一天(周日)  
function getLastDateOfWeek(theDate){  
 var lastDateOfWeek;  
 theDate.setDate(theDate.getDate() +7 - theDate.getDay());  
 lastDateOfWeek = theDate;  
 return lastDateOfWeek;   
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
//时间设置End