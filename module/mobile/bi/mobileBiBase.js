
var MobileBiBase={
	//声明页面元素
	declare:{
		//周
		queryWeek:'queryWeek',
		
		//月
		queryMonth:'queryMonth',
		
		//天
		queryDay:'queryDay'
	}
	
}

var Nowdate; 
var orfirtDay;
var orlastDay;
var firtDay;
var lastDay;

//本周第一天  
function showWeekFirstDay() {  
	var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);  
	return WeekFirstDay;  
}  
//本周最后一天  
function showWeekLastDay()  {  
	var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);  
	var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);  
	return WeekLastDay;  
}
//上周第一天  
function showPreviousFirstWeekDay()  {  
	var WeekFirstDay=showWeekFirstDay()  
	return new Date(WeekFirstDay-86400000*7)  
}  
//上周最后一天  
function showPreviousLastWeekDay()  {  
	var WeekFirstDay=showWeekFirstDay()  
	return new Date(WeekFirstDay-86400000)  
}  
//下周第一天  
function showNextFirstWeekDay()  {  
	var MonthFirstDay=showWeekLastDay()  
	return new Date((MonthFirstDay/1000+86400)*1000)  
}  
//下周最后一天  
function showNextLastWeekDay()  {  
	var MonthFirstDay=showWeekLastDay()  
	return new Date((MonthFirstDay/1000+7*86400)*1000)  
}  
//上一天  
function showPreviousDay()  {  
	var MonthFirstDay=new Date();  
	return new Date(MonthFirstDay-86400000);  
}  
//下一天  
function showNextDay()  {  
	var MonthFirstDay=new Date();
	return new Date((MonthFirstDay/1000+86400)*1000);  
} 

//周的累加减
function changeWeek(type) {
	if (type == 'up'){
		    firtDay=new Date((orfirtDay/1000-7*86400)*1000).format('yyyy/MM/dd');
		    lastDay=new Date(orfirtDay-86400000).format('yyyy/MM/dd');
		   var  firtDay_=new Date((orfirtDay/1000-7*86400)*1000).format('MM/dd');
		   var   lastDay_=new Date(orfirtDay-86400000).format('MM/dd');
			orfirtDay=new Date((orfirtDay/1000-7*86400)*1000);
			orlastDay=new Date(orfirtDay-86400000);
		var weekDate=firtDay+"-"+lastDay;
		var weekDate_=firtDay_+"-"+lastDay_;
		$("#"+MobileBiBase.declare.queryWeek).attr("key",weekDate);
		$("#"+MobileBiBase.declare.queryWeek).val(weekDate_);
		searchData('0');
	}else{
		Nowdate	= new Date((orlastDay/1000+86400)*1000);
		firtDay=new Date(showNextFirstWeekDay()).format('yyyy/MM/dd');
		var lastDay_=new Date(showNextLastWeekDay()).format('yyyy/MM/dd');
		var firtDay_=new Date(showNextFirstWeekDay()).format('MM/dd');
		lastDay_=new Date(showNextLastWeekDay()).format('MM/dd');
		orfirtDay=showWeekFirstDay();
		orlastDay=showWeekLastDay();
		var weekDate=firtDay+"-"+lastDay;
		var weekDate_=firtDay_+"-"+lastDay_;
		if(checkDate(orlastDay.format('yyyy-MM-dd'))){
			$("#"+MobileBiBase.declare.queryWeek).val(weekDate_);
			$("#"+MobileBiBase.declare.queryWeek).attr("key",weekDate);
			searchData('0');}
	}
}

//月的累加减
function changeMonth(type) {
	var showMonth = $("#"+MobileBiBase.declare.queryMonth).val();
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
		$("#"+MobileBiBase.declare.queryMonth).val(year + "-" + month);
		searchData('0');}
	}else{
		if(typeof(commonTipShow)=='function'){
			   commonTipShow("请选择日期！",1000);
		   }
	}
}

//天的加减
function changeDay(type){
	var showDay=$("#"+MobileBiBase.declare.queryDay).val();
	if(null != showDay && showDay != ''){
		$.post(getPath()+'/mobile/bi/fastsalereport/getDate',{showDay:showDay,type:type},function(json){
			if(null != json.result){
				if(checkDate(json.result)){
					$("#"+MobileBiBase.declare.queryDay).val(json.result);
					searchData('0');
				}
			}
		},'json');
	}
}

//显示加载器  
function showLoader() {  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });
}

//检查日期
function checkDate(startTime){  
	   var aStart=startTime.split('-'); //转成成数组，分别为年，月，日，下同  
	   var startDate = aStart[0]+"/" + aStart[1]+ "/" + aStart[2];  
	   var d=new Date();
	   var endTime=d.format('yyyy-MM-dd');
	   var aEnd=endTime.split('-');  
	   var endDate = aEnd[0] + "/" + aEnd[1] + "/" + aEnd[2];  
	   if (startDate > endDate) {  
		   if(typeof(commonTipShow)=='function'){
			   commonTipShow("无法查询还未到的日期哦！",1000);
		   }
		   return false;  
	   }  
	 return true;  
}

//得到当前的周的区间值
function getCurrentWeek(){
	var now=$("#"+MobileBiBase.declare.queryWeek).val();
//	Nowdate=new Date(now.replace(/-/,"/"));
	Nowdate=new Date();
	orfirtDay=showWeekFirstDay();
	orlastDay=showWeekFirstDay();	
	 var firtDay=new Date(showWeekFirstDay()).format('yyyy/MM/dd');
		var lastDay=new Date(showWeekLastDay()).format('yyyy/MM/dd');
		var weekDate=firtDay+"-"+lastDay;
		var firtDay_=new Date(showWeekFirstDay()).format('MM/dd');
		var lastDay_=new Date(showWeekLastDay()).format('MM/dd');
		var weekDate_=firtDay_+"-"+lastDay_;
		$("#"+MobileBiBase.declare.queryWeek).attr("key",weekDate);
		$("#"+MobileBiBase.declare.queryWeek).val(weekDate_);
		
}

//选择组织带出组织级别
function changeOrgLevel(orgLevelDesc){
	var p = $('select[name="orgDesc"]');
	p.val("");
	p.html("");
	var div ="";
	if(orgLevelDesc!=''&&orgLevelDesc!=null){
		$.post(getPath()+'/weixinapi/mobile/bihero/getOrgLevelDesc',{orgleveldesc:orgLevelDesc},function(res){
			if(res && res.length > 0){
				for(var i = 0; i < res.length; i++){
					div+="<option value='"+res[i].DESC_ID+"'>"+res[i].DESC_NAME+"</option>";
				}
			}
			div+="<option value='personLevel'>个人级</option>";
			p.html(div);
		    p.trigger('change');
		},'json');
	}else{
		div+="<option value='personLevel'>个人级</option>";
		p.html(div);
	    p.trigger('change');
	}	
}