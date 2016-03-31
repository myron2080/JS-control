$list_editUrl = getPath()+"/hr/attendance/entryOne";//编辑及查看url
$list_dataType = "考勤";
 
$(document).ready(function(){
	var contheight = $(window).height()-40;
	$(".calendar-body").height(contheight); 
	searchData();
	bindEvent();
	var seldate = new Date();
	var selstr = seldate.getFullYear()+'-'+(seldate.getMonth()+1)+'-'+seldate.getDate();
	
	getSchePersonData(selstr);
});
 
function bindEvent(){
	
	//查询按钮
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	//楼盘自动补全
	Autocomplete.init({
		$em:$( "#personName" ),
		$obj:$('#personId'),
		url:base+"/hr/attendance/getPersonByKey?random=" +  Math.round(Math.random()*100),
		maxRows:12 
	});
}
 

function searchData(){
	var personId = $('#personId').val();
	var period = $('#period').val();
	if(!period){
		art.dialog.tips("请选择日期!");
		return ;
	}
 
	$.post(getPath()+"/hr/attendance/getAttendanceDetails",
	 {period:period,personId:personId},
	 function(data){
		 $("#attendanceDiv").html('');
		 var attendance = data.attendance;
		 var attendanceDetails = data.attendanceDetails;
		 $("#monthAttendanceDiv").html(attendance.remark);
		 if(!attendanceDetails || attendanceDetails.length<1){
			 $("#attendanceDiv").html('<div align="center" style="margin-top:100px;">没有录入考勤信息</div>');
			 return ;//没有录入考勤信息
		 }
		 var attendanceHtml = ('<table width="100%" border="0" cellspacing="0" cellpadding="0" class="calendar-table">' 
                                  +'<tr>'
                                    +'<td width="14%" height="20" align="center">周日</td>'
                                    +'<td width="15%" height="20" align="center" class="colorblue">周一</td>'
                                    +'<td width="14%" height="20" align="center" class="colorblue">周二</td>'
                                    +'<td width="14%" height="20" align="center" class="colorblue">周三</td>'
                                    +'<td width="14%" height="20" align="center" class="colorblue">周四</td>'
                                    +'<td width="14%" height="20" align="center" class="colorblue">周五</td>'
                                    +'<td width="15%" height="20" align="center">周六</td>'
                                  +'</tr>');
		 
		 attendanceHtml += '';
		 var perWeek = 0 ;
		 var firstWeek = attendance.otherHolidays5;
		 var screenHeight = $(window).height();
		 var lineNum = Math.ceil((attendanceDetails.length+firstWeek)/7.00);
		 var tdHeight = (screenHeight-174)/7;
		 /*if((attendanceDetails.length+firstWeek)>35){
			 tdHeight = 25 ;
		 }*/
		 if(firstWeek>1){
			 attendanceHtml += '<tr>'; //循环开始tr
			 for(var i=1;i<firstWeek;i++){
				 attendanceHtml += '<td height="'+tdHeight+'"><div class="calendar-number color999"><i></i></div></td>';
			 }
			 perWeek = firstWeek -1 ;
		 }
		 var currDate = new Date().format("yyyy-MM-dd"); 
		 var showTipTd = [];
		 for(var i=0;i<attendanceDetails.length;i++){
			 var detail = attendanceDetails[i];
			 var recordDate = detail.recordDate;
			 var actualDay = detail.actualDay;
			 var day = recordDate.split("-")[2];
			 var remark = detail.remark ;
			 var otherHolidays4 = detail.otherHolidays4 ;//待办事项
			 
			 if(remark){
				 remark = remark.replace('请假','<b class="c-pl">请假</b> ');
				 remark = remark.replace('休息','<b class="c-sl">休息</b> ');
				 remark = remark.replace('迟到/早退','<b class="c-late">迟到/早退</b> ');
			 }
			 if(parseInt(actualDay)==1){
				 remark = '<b class="c-normal">正常</b>';
			 }
			 if(perWeek==0){
				 attendanceHtml += '<tr>';//循环开始tr
			 }
			 var tdId = "td100" + i;
			 attendanceHtml += '<td id="'+tdId+'" font-pop="'+tdId+'" height="'+tdHeight+'" '+(currDate==recordDate?' class="nowday" ':'')+' recordDate="'+recordDate+'" onclick="selectDay(this)">';
			 attendanceHtml += '<div class="calendar-number color000">';
			 attendanceHtml += '<i>'+day+'</i>';
			 attendanceHtml += '<div class="c-style">';
			 attendanceHtml += '<p>'+remark+'</p>';
			 if(otherHolidays4 && otherHolidays4>0){
				 attendanceHtml += '<b class="star"></b>';
			 }
			 attendanceHtml += '</div>';
			 /*if(currDate==recordDate){
				 attendanceHtml += '<b class="star"></b>';
			 }*/
			 attendanceHtml += '</div>';
			 if(otherHolidays4 && otherHolidays4>0){
				 //recordDate 2014-5-6 
				 var tDate = doDateStr(recordDate);
				 var tipObj = {} ;
				 tipObj.domId = tdId ;
				 tipObj.tDate = tDate ;
				 showTipTd.push(tipObj);
			 }
			 attendanceHtml += '</td>';
			 
			 perWeek ++;
			 if(perWeek==7){
				 attendanceHtml += '</tr>';//循环结束tr
				 perWeek = 0;
			 }
		 }
		 if(perWeek>0){
			 
			 for(;perWeek<7;perWeek++){
				 attendanceHtml += '<td height="28"><div class="calendar-number color999"><i></i></div></td>';
			 }
			 attendanceHtml += '</tr>';//循环结束tr
		 }
		 
		 attendanceHtml+=        ('<tr>'
                                     +'<td height="20" colspan="7" align="right">默认查询自己考勤记录，点击 [更多] 可查询下属记录。</td>'
                                  +'</tr>'
                          +'</table>');
		 $("#attendanceDiv").html(attendanceHtml);
		 
		 if(showTipTd && showTipTd.length > 0){
			 for(var i = 0 ; i < showTipTd.length ; i ++){
				 FontPop.register({domId:showTipTd[i].domId,url:getPath()+"/interflow/schedule/listPersonData",currentPage:1,pageSize:3,schedate:showTipTd[i].tDate,personId:$("#personId").val(),todaySchedule:1});
			 }
		 }
	 },'json'); 
}

function doDateStr(sdate){
	var darr = sdate.split("-");
	var tdate = "" ;
	for(var i = 0 ;i < darr.length ; i ++){
		var dstr = darr[i] ;
		if(i > 0){
			if(dstr.length == 1 && parseInt(dstr) < 10){
				dstr = "0" + dstr ;
			}
		}
		tdate += dstr + "-" ;
	}
	tdate = tdate.substring(0,tdate.length - 1);
	return tdate ;
}


function selectDay(obj){
	$(".nowday").removeClass("nowday");
	//$(".star").remove();
	$(obj).addClass("nowday");
	//$("div[class*='calendar-number']",obj).append('<b class="star"></b>');
	
	var seldate = $(obj).attr("recorddate");
	
	getSchePersonData(seldate);
}

function changeMonth(type){
	var period=$("#period").val();
	if(!period){
		art.dialog.tips("请选择日期!");
		return ;
	}
	var y=parseInt(period.split("-")[0],10);//年
	var m=parseInt(period.split("-")[1],10);//月
	var year;
	var month;
	var monthDis;
	if(type == 'up'){//上一月
		if(m == 1){
			year=(y-1)+"";
			month="12";
			monthDis="12";
		}else{
			year=y+"";
			if(m <11){//月份 需加0
				month="0"+(m-1);
			}else{
				month=(m-1)+"";
			}
			monthDis=(m-1);
		}
		$("#period").val(year+"-"+month);
		$("#periodDis").text(year+"年"+monthDis+"月");
		$("#orgLongNum").val('');
	}else if(type == 'down'){//下一月
		if(m == 12){
			year=(y+1)+"";
			month="01";
			monthDis="1";
		}else{
			year=y+"";
			if(m <9){//月份 需加0
				month="0"+(m+1);
			}else{
				month=(m+1)+"";
			}
			monthDis=(m+1)+"";
		}
		/*if((year+"-"+month)>formatDate(new Date(),'yyyy-MM').trim()){
			art.dialog.tips("只能查询当前月以前的考勤");
			return ;
		}*/
		$("#period").val(year+"-"+month);
		$("#periodDis").text(year+"年"+monthDis+"月");
		$("#orgLongNum").val('');
	} 
	
	var dataPickerUrl=getPath()+"/basedata/org/orgHisDataPicker?isLastDay=Y&period="+$("#period").val()+"&longNumber="+$("#currentOrgLongNumber").val();
	$("#orgF7").attr("dataPickerUrl",dataPickerUrl)	
	searchData();
}

function changePerson(){
	art.dialog.tips("只能选择下级人员考勤");
	$("#personId").val('');
	$("#personName").val('');
}

function viewlist(){
	top.addTabItem('queryPortlet',getPath()+'/hr/attendance/toQueryPortletMore','考勤信息');
}

function viewschedulemore(){
	top.addTabItem('scheduleMore',getPath()+'/interflow/staging/list','我的日程');
}

function getSchePersonData(seldate){
	$(".calendar-body-r").show();
	$.post(getPath()+"/interflow/schedule/listPersonData",{currentPage:1,pageSize:3,schedate:doDateStr(seldate),personId:$("#personId").val(),todaySchedule:1},function(data){
		
		var html = "";
		var sary = seldate.split('-');
		if(sary.length==3){
		$(".calendar-br-t").find("h1").html(sary[2]);	
		}
		$(".calendar-br-t").find("p").html(data.lcalstr);
		if(data.recordCount==0){
			html = '<span class="orangebtn btn"><a href="javascript:void(0)" onclick="openScheAdd()"><img src="'+getPath()+'/default/style/images/common/common_plus.png"/>新增</a></span>';
		}else{
			
			$.each(data.items,function(i,item){
				
				var p = item.preview?(item.preview.length>25?item.preview.substring(0,25):item.preview):'';
				html += (i+1)+':'+p+';'+'<br>';
			});
			if(data.pageCount>1){
				html += "<a href='javascript:void(0)' class='colorblue' onclick='viewschedulemore()'>更多</a>";
			}
		}
		$(".calendar-br-b").find("span").html(html);
	},'json');
}

function openScheAdd(){
	var flag = false;
	var dlg = art.dialog
	.open(getPath() +"/interflow/schedule/add",
			{
				id : "addschedule",
				title : '添加日程',
				background : '#333',
				width : 750,
				height : 500,
				lock : true,
				button:[{name:'确定',callback:function(){
						if(dlg.iframe.contentWindow && dlg.iframe.contentWindow.valiScheduleForm){
							dlg.iframe.contentWindow.valiScheduleForm(dlg);
						}
						flag = true;
						return false;
					}},{name:'取消',callback:function(){
						flag = false;
						return true;
					}}],
				close:function(){
					if(flag){
						
						getSchePersonData($(".nowday").attr("recorddate"));
					}
					
				}
			});	
}
