var Nowdate; 
var orfirtDay;
var orlastDay;
var firtDay;
var lastDay;
//pankefollow.jsp
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
	 $("#backBtn").bind("click",function(){
		  window.location.href = base+"/workbench";
	  });
	 $('#dayDiv,#monthDiv,#weekDiv').find('a').bind("click",function(){
		 //$(this).hasClass("icon-svg7");
		 var oType='down';
		 if($(this).hasClass("icon-svg23")){
			 oType='up'; 
		 }
		 var queryType =$(this).parent().attr("id");
		 
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
		if($("#firtDay").val()!=null){
			 orfirtDay =new Date($("#firtDay").val().replace(/-/,"/"));
			 orlastDay =new Date($("#lastDay").val().replace(/-/,"/"));
			 changeEvent();
	     }else{
	    	 searchData('0');
	     }
});
function shareTo(){
	var title=" 二手房快报";
	var content;
	if($("#queryType").val()=="day"){
	content=$("#queryDay").val()+"快报";
	}else if($("#queryType").val()=="week"){
	content=$("#queryWeek").attr("key")+"快报";	
	}else{
	content=$("#queryMonth").val()+"快报";	
	}
	
	var pram="&currentDay="+$("#queryDay").val()+"&currentMonth="+$("#queryMonth").val()+"&weekDate="+$("#queryWeek").attr("key")+"&dateType="+$("#queryType").val()+"&orderType="+$("#orderType").val()+"&firtDay="+firtDay+"&lastDay="+lastDay
	+"&orgDesc="+$("#orgDesc").html()+"&orgId="+$("#orgId").val()+"&orgName="+$("#orgName").html()+"&keyWord="+$("#keyword").val();
	var url_=window.location.href;
	var url=url_.replace(/listView/, "listView4Share")+"?dataCenter="+currdataCenter+"&share=share"+pram;
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
	para.pageSize = 10;
	
	para.startDay=$("#queryDay").val();
	para.endDay=$("#queryDay").val();
	para.startMonth=$("#queryMonth").val();
	para.endMonth=$("#queryMonth").val();
	para.weekDate=$("#queryWeek").attr("key");
	para.orderType=$("#orderType").val();
	para.queryType=$("#queryType").val();
	para.orgId=$("#orgId").val();
	para.orgLevelDesc =$("#orgDesc").val()=="selectArea"?"personLevel":$("#orgDesc").val();
	para.keyWord = $("#keyword").val();
	$.post(base+'/mobile/sechandreport/listPagData',para,function(res){
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
			    var notLoginDays="(未曾登录)";
				if(obj.NOTLOGINDAYS!=null&&obj.NOTLOGINDAYS>=0){
					notLoginDays=obj.NOTLOGINDAYS+"天未登录";
				}
                var NOTDEALDAYS = "缺失信息";
                if(obj.NOTDEALDAYS!=null&&obj.NOTDEALDAYS>=0){
                	NOTDEALDAYS = obj.NOTDEALDAYS+"天未开单";
                }
                var NOTCHARGECUSDAYS = "缺失信息";
                if(obj.NOTCHARGECUSDAYS!=null&&obj.NOTCHARGECUSDAYS>=0){
                	NOTCHARGECUSDAYS = obj.NOTCHARGECUSDAYS+"天未带客";
                }
                var NOTADDHOUSEDAYS = "缺失信息";
                if(NOTADDHOUSEDAYS!=null&&obj.NOTADDHOUSEDAYS>=0){
                	NOTADDHOUSEDAYS = obj.NOTADDHOUSEDAYS+"天未放盘";
                }
                
				div+=" <div class='yilantwo-white'>"
		          
				div+=" <div class='xf'>"
				div+="     <span class='fl'>"
				div+=" <b class='"+sortColor+" bold font16 fl'>"+indnumber+"</b>"
				div+="           <b class='color333 font16 fl'>"+obj.T_ORGNAME+"-"+obj.T_PERNAME+"</b>"
				div+="      </span>"
				div+="      <span class='fr'>"+notLoginDays+"</span>"
				div+="  </div>"
	               
	               
				div+="  <div class='xf'>"
				div+="     <span class='fl' style='width:33.3%; text-align:center;'>"+NOTDEALDAYS+"</span>"
				div+="     <span class='fl' style='width:33.3%; text-align:center;'>"+NOTCHARGECUSDAYS+"</span>"
				div+="      <span class='fl' style='width:33.3%; text-align:center;'>"+NOTADDHOUSEDAYS+"</span>"
				div+="   </div>"
	               
	               
				div+="  <div class='xf'>"
				div+="    <div class='pan-r'>"
				div+="       <div class='pan-rin'>"
				div+="            <p class='mb5'><b class='color333'>录客"+obj.CUS_NEWADD+"</b>"
				if(obj.Cus_SourceTypeCount.length>0){
				var sourceType = obj.Cus_SourceTypeCount;
				div+="("	
				for(var n=0;n<sourceType.length;n++){
				div+=sourceType[n].TYPENAME+sourceType[n].TYPECOUNT+((n==(sourceType.length-1))?"":" ")	
				}
				div+=")"
				}
				div+="</p>"
				div+="             <p class='mb5'>"
				div+="                <span class='fl panbox'>跟进"+obj.CUS_DIALING+"</span>"
				div+="               <span class='fl panbox'>看房"+obj.CUS_LOOKHOUSE+"</span>"
				//div+="               <span class='fl panbox'>其他"+obj.CUS_OTHER+"</span>"
				div+="             </p>"
				div+="             <p>"
				div+="             <span class='fl panbox'>公转私"+obj.CUS_PUBTOPRI+"</span>"
				div+="             <span class='fl panbox'>转介合作"+obj.CUS_COLLA_REFER+"</span>"
				//div+="             <span class='fl panbox'>转介"+obj.CUS_REFERRALUP+"</span>"
				//div+="            <span class='fl panbox'>合作"+obj.CUS_COLLABORATEUP+"</span>"
				div+="          </p>"
				div+="       </div>"
				div+="   </div>"
				div+="   <div class='pan-l font22 colorred'>客</div>"
				div+=" </div>"
	               
	               
				div+="  <div class='xf' style='border-bottom:none;'>"
				div+="     <div class='pan-r'>"
				div+="          <div class='pan-rin'>"
				div+="               <p class='mb5'><b class='color333'>放盘"+obj.HOUSE_NEWADD+"</b>"
				//if(obj.HOUSE_NEWADD>0)
				div+="(上门"+obj.HOUSE_VISIT+"  网络"+obj.HOUSE_INTERNET+"  电话"+obj.HOUSE_TEL+")"
				div+="</p>"
				div+="                <p>"
				div+="                   <span  class='fl panbox'>盘跟进"+obj.HOUSE_FOLLOW+"</span>"
				//div+="                  <span  class='fl panbox'>转有效10</span>"
				div+="                  <span  class='fl panbox'>查看"+obj.HOUSE_VIEWRECORD+"</span>"
				div+="                  <span  class='fl panbox'>改盘"+obj.HOUSE_MODIFY+"</span>"
				div+="               </p>"
	                              
				div+="            </div>"
				div+="       </div>"
				div+="        <div class='pan-l font22 colorgreen'>盘</div>"
				div+="     </div>"
	               
				div+="   </div>"
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
			//html +='<img  src="'+base+'/default/style/images/mobile/approveblank.png" />';
			html +='<img  src="'+base+'/default/style/images/mobile/emptydata.png" />';
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
	var orgDesc=$('select[name="orgDesc"]');
	if(orgDesc.val()=="personLevel"||orgDesc.val()=="selectArea"){
	$("#keyword").attr("placeholder","部门/人员");
	}else{
	$("#keyword").attr("placeholder","部门");}
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
		   var  firtDay_=new Date((orfirtDay/1000-7*86400)*1000).format('MM/dd');
		   var   lastDay_=new Date(orfirtDay-86400000).format('MM/dd');
			orfirtDay=new Date((orfirtDay/1000-7*86400)*1000);
			orlastDay=new Date(orfirtDay-86400000);
		var weekDate=firtDay+"-"+lastDay;
		var weekDate_=firtDay_+"-"+lastDay_;
		$("#queryWeek").attr("key",weekDate);
		$("#queryWeek").val(weekDate_);
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

function chooseOrg(obj){
	$.mobile.changePage( "#listPage", { role: "page" } );
	$("#orgId").val($(obj).attr("key"));
	var orgLevelDesc = $(obj).attr("orgLevelDesc");
	changeOrgLevel(orgLevelDesc );
	$("#orgName").html($(obj).attr("name")+" "+"<b class='qin' onclick='clearchoose(event)'>清</b>");
	$("#keyword").val("");
	changeEvent();
}
//组织选择器参数设置
function setOrgPickerPara(para){
	 para.businessType="652001e9-3338-4556-a60f-079cb3e58f12";//盘客业务Id
}
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

function typeTdClick(obj,str){
	
	var now = $("td[class='selected']");
	if($(obj).hasClass('selected')){
		return ;
	}else{
		now.removeClass('selected');
		$(obj).addClass('selected');
	}
	$("#queryType").val(str);
	changeEvent();
}
