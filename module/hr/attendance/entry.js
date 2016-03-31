function initToEntry(){    
    $("#beforeDate").click(function(){
		changeDate(1);
	});
	
	$("#nextDate").click(function(){
		changeDate(-1);
	});
	bindEvent();
	queryDetail();
}

function bindEvent(){
	
	//查询按钮
	$("#searchBtn").bind("click",function(){
		queryDetail();
	});
	
	//清空
	$("#resetBtn").click(function(){
		clearDataPicker('orgF7');
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$("#orgName").val($("#orgName").attr("defaultValue"));
		//$("#orgId").val($("#orgId").attr("defaultValue"));
	});
	
	eventFun($("#orgName"));
	eventFun($("#keyConditions"));
}
	
	
/**
 * 改变日期
 * @param type 
 */
function changeDate(type){
	var recordDate = $("#recordDate").val(); 
	if( type == 1){//上一天
		$("#recordDate").val(getYestoday(parseDate(recordDate),"yyyy-MM-dd"));
	}else if(type == -1){//下一天
		$("#recordDate").val(getTomorrow(parseDate(recordDate),"yyyy-MM-dd"));
		 
		if($("#recordDate").val().trim()>formate_yyyyMMdd(new Date()).trim()){
			$("#recordDate").val(recordDate);
			art.dialog.tips("只能录当前日期以前的考勤");
			return ;
		}
	}
	
	queryDetail();
}

/**
 * 考勤录入页面
 */
function queryDetail(){
	var recordDate = $("#recordDate").val();
	var orgId = $("#orgId").val();
	var keyConditions = $("#keyConditions").val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		
	}else{
		keyConditions = "";
	}
	//var srcUrl = getPath()+"/hr/attendance/entry?recordDate="+recordDate;
	//$("#homeIframe").attr("src",srcUrl);
	$("#btnSaveEntry").hide();
	$("#entryDiv").html("<div style='width:100%; text-align:center; position: absolute;top:40%;'><img src='"+base+"/default/style/images/houseProject/bigloading.gif'/></div>");
	$.post(getPath()+"/hr/attendance/entry",{recordDate:recordDate,orgId:orgId,keyConditions:keyConditions},function(data){
		 
		$("#entryDiv").html(data);
		$("#detailTbl input").each(function(i){
			var val = this.value;
			if($(this).attr("fmtDay") && (parseInt(val)==0 || parseInt(val)==1)){
				val = val.replace(/(\d)\.0+$/,"$1");
				this.value = val;
			}
			$(this).focus(function(){
				$(this).select();
			});
			if(parseFloat(val)>0){
				$(this).css("color","red");
			}else{
				$(this).css("color","");
			}
		});
		var h = $(window).height()-80;
		$("#detailDiv").height(h);
		jQuery.fn.CloneTableHeader("detailTbl","detailDiv"); 
		$("#tableHeaderDivdetailTbl").css("height", "29px");
		$("#btnSaveEntry").show(); 
	},'html');
}


//检查是否为正数
function checkNumber(obj,maxVal){
	var value = obj.value ;
	if(isNaN(value) || value < 0){
		obj.value = '0';
		obj.focus();
		return ;
	}
	value = parseInt(value);
	obj.value = value;
	//最大值
	if(maxVal){
		if(value>maxVal){
			obj.value = maxVal;
			obj.focus();
		}
	}
}

//检查文本输入长度
function checkInputMaxLength(obj,len){
	var val = obj.value ;
	if(val!=null && val.length > len ){
		art.dialog.tips("不能超过"+len+"个字符!");
		var subStr = val.substring(0,len);
		obj.value = subStr ;
	}
}

/**
 * 不是0的考勤项 红色显示
 */
function initColor(){
	$("#detailTbl input").each(function(i){
		var val = this.value;
		 
		if(parseFloat(val)>0){
			$(this).css("color","red");
		}else{
			$(this).css("color","");
		}
	});
}
//检查文本框输入
function checkInputValue(obj){
	var value = obj.value ;
	if(isNaN(value)){
		obj.value = '0';
		checkInputValue(obj);
		return ;
	}else{
		value = value.substring(0,4);//最多输入两位小数
		obj.value = value;
		value = parseFloat(value);
		var trObj = $(obj.parentNode.parentNode) ;
		var actualDayObj = trObj.find("td input[id^='actualDay_']");
		 
		if(parseInt(value) >= 1){
			//有fmtDay属性的 为考勤项
			$("input[fmtDay]",obj.parentNode.parentNode).each(function(){
				this.value= "0" ; 
			});//大于1时 其它考勤项设为0
			obj.value = '1';//大于1时  本考勤项设为1
		}else{
			var actualDay = parseFloat(actualDayObj.val());
			var total = 0 ;//所有考勤项的和
			$("input[fmtDay]",obj.parentNode.parentNode).each(function(){
				
				total += parseFloat(this.value);
			});
			 
			/*var result = actualDay+1;
			result =  result - total;
			if(result < 0){
				obj.value = "0" ;
			}else{
				trObj.find("td input[id^='actualDay_']").val(result);
			}*/
			//保证  实际考勤+其它(除实际考勤)考勤项 = 1
			var result = 1;
			result =  1 - (total-actualDay);
			if(result < 0){
				//如果  其它(除实际考勤)考勤项 大于 1
				//把正在修改的考勤项设为0 ,实际考勤= (1 - 其它(除实际考勤)考勤项) 
				result = (1 - (total - value - actualDay ));
				obj.value = "0" ;
			}
			//实际考勤= (1 - 其它(除实际考勤)考勤项) 
			trObj.find("td input[id^='actualDay']").val(result.toFixed(3));
			
		}
	}
	initColor();
}

//检查文本框输入
function checkInputValue4EntryOne(obj){
	var value = obj.value ;
	if(isNaN(value)){
		obj.value = '0';
	}else{
		value = value.substring(0,4);//最多输入两位小数
		obj.value = value;
		value = parseFloat(value);
		var actualDayObj = $("#actualDay");
		 
		if(parseInt(value) >= 1){
			//有fmtDay属性的 为考勤项
			$("input[fmtDay]").each(function(){
				this.value= "0" ; 
			});//大于1时 其它考勤项设为0
			obj.value = '1';//大于1时  本考勤项设为1
		}else{
			var actualDay = parseFloat(actualDayObj.val());
			var total = 0 ;//所有考勤项的和
			$("input[fmtDay]").each(function(){
				
				total += parseFloat(this.value);
			});
			 
			//保证  实际考勤+其它(除实际考勤)考勤项 = 1
			var result = 1;
			result =  1 - (total-actualDay);
			if(result < 0){
				//如果  其它(除实际考勤)考勤项 大于 1
				//把正在修改的考勤项设为0 ,实际考勤= (1 - 其它(除实际考勤)考勤项) 
				result = (1 - (total - value - actualDay ));
				obj.value = "0" ;
			}
			//实际考勤= (1 - 其它(除实际考勤)考勤项) 
			$("#actualDay").val(result.toFixed(3));
			
		}
	}
}


//保存录入
function saveEntry(){
	$("#btnSaveEntry").hide();
	var details = [] ;
	$("#detailTbl tr[id^='detail_']").each(function(n,tr){
		 var detail = {};
		 detail["personId"] = $(tr).attr("personId") ;
		 detail["personNumber"] = $(tr).attr("personNumber") ;
		 detail["personName"] = $(tr).attr("personName") ;
		 detail["orgId"] = $(tr).attr("orgId") ;
		 detail["orgName"] = $(tr).attr("orgName") ;
		 detail["positionId"] = $(tr).attr("positionId") ;
		 detail["positionName"] = $(tr).attr("positionName") ;
		 detail["jobLevelId"] = $(tr).attr("jobLevelId") ;
		 detail["jobLevelName"] = $(tr).attr("jobLevelName") ;
		 
		 $("input",tr).each(function(){
				
			 detail[this.id.substring(0,this.id.indexOf("_"))] = this.value;
		  });
		 
		 details.push(detail);
	});
	$("#detailsJSON").val(JSON.stringify(details));
	
	if(details.length<1){
		art.dialog.tips("没有可保存的数据!");
		return false;
	} 
	
	//$("form").submit();
	$.post(getPath()+"/hr/attendance/saveAttendanceDetails",{recordDate:$("#recordDate").val(),detailsJSON:JSON.stringify(details)},function(data){
		if(data.MSG == "SUCC"){
			art.dialog({
				icon: 'succeed',
			    time: 1,
			    content: "保存成功！"
			});
			setTimeout(function(){art.dialog.close();},1000);
		} else {
			art.dialog.tips(data.MSG);
		}
		$("#btnSaveEntry").show();
	},'json');
	 
}

//保存录入
function saveEdit(){
	 
	 var detailTr = $("#detailTr");
	 var detail = {};
	 detail["personId"] = detailTr.attr("personId") ;
	 detail["personNumber"] = detailTr.attr("personNumber") ;
	 detail["personName"] = detailTr.attr("personName") ;
	 detail["orgId"] = detailTr.attr("orgId") ;
	 detail["orgName"] = detailTr.attr("orgName") ;
	 detail["positionId"] = detailTr.attr("positionId") ;
	 detail["positionName"] = detailTr.attr("positionName") ;
	 detail["jobLevelId"] = detailTr.attr("jobLevelId") ;
	 detail["jobLevelName"] = detailTr.attr("jobLevelName") ;
		 
	 $("input").each(function(){
			
		 detail[this.id] = this.value;
	  });
		 
	 
	var recordDate = $("#recordDate").text();
	var remark = $("#remark").val();
	detail.remark = remark;
	
	$.post(getPath()+"/hr/attendance/saveAttendanceDetailOne",{recordDate:recordDate,detailJSON:JSON.stringify(detail)},function(data){
		if(data.MSG == "SUCC"){
			art.dialog({
				icon: 'succeed',
			    time: 1,
			    content: "保存成功！"
			});
			setTimeout(function(){art.dialog.close();},1000);
		} else {
			art.dialog.tips(data.MSG);
		}
		
	},'json');
	 
}