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
	
	//保存组织方案按钮
	$("#saveOrgBtn").bind("click",function(){
		saveAttendanceOrg();
	});
	
	eventFun($("#orgName"));
	 
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

function changeOrg(oldValue,newValue,doc){
	$("#defaultOrg").addClass("hover").siblings("li").removeClass("hover");
	$("#defaultOrg").attr("orgId",newValue.id);
	$("#defaultOrg a").text(newValue.name);
	queryDetail();
}


function changeAttendanceOrg(oldValue,newValue,doc){
	 var orgObj = $(".system_tab li[orgId='"+newValue.id+"']");
	 if(orgObj.length>0){
		 art.dialog.tips("该组织已存在，不需要添加！");
		 return ;
	 }
	$('<div class="kq-mini-list" orgId="'+newValue.id+'" ><span>'+newValue.name
			+'</span><a href="javascript:void(0);" onclick="removeOrg(\''+newValue.id+'\')"></a></div>').appendTo($("#orgsDiv"))
			
    $('<li orgId="'+newValue.id+'" onclick="queryDetailByOrg(this)" ><a href="javascript:void(0)">'+newValue.name+'</a></li>').appendTo($(".system_tab"));
	$("#saveOrgBtn").parent().show();
}

function removeOrg(objId){
	$("div[orgId='"+objId+"']").remove();
	var queryOrgId = $(".hover").attr("orgId");
	$(".system_tab li[orgId='"+objId+"']").remove();
	if(queryOrgId==objId){
		$("#defaultOrg").addClass("hover");
		queryDetail();
	}
}

function saveAttendanceOrg(){
	 
	 var orgIds = "";	 
	 $("#orgsDiv div").each(function(){
			
		  if(orgIds){
			  orgIds += ","+$(this).attr("orgId");
		  }else{
			  orgIds =  $(this).attr("orgId");
		  }
	  });
		 
	$.post(getPath()+"/hr/attendance/saveAttendanceOrg",{orgIds:orgIds},function(data){
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

function queryDetailByOrg(obj){
	$(obj).addClass("hover").siblings("li").removeClass("hover");
	queryDetail();
}

/**
 * 考勤录入页面
 */
function queryDetail(){
	var recordDate = $("#recordDate").val();
	var orgId = $(".hover").attr("orgId");
	
	$("#btnSaveEntry").hide();
	$("#entryDiv").html("<div style='width:100%; text-align:center; position: absolute;top:40%;'><img src='"+base+"/default/style/images/houseProject/bigloading.gif'/></div>");
	$.post(getPath()+"/hr/attendance/entry2",{recordDate:recordDate,orgId:orgId},function(data){
		 
		$("#entryDiv").html(data);
		 
		initAttenDanceType();
		var h = $(window).height()-105;
		$("#detailDiv").height(h);
		$("#btnSaveEntry").show(); 
	},'html');
}

function initAttenDanceType(){
	$("#detailList li[id^='detail_']").each(function(n,li){
		var typeObjDef = $("p",li);
		var actualDayObj = $("input[id^='actualDay_']",li);
		var actualDay = parseFloat(actualDayObj.val());
		$("a",typeObjDef.get(0)).bind("click",function(){addAttendanceType(this);});
		if(actualDay==1){
			typeObjDef.find("select").val("actualDay");
			$("input",typeObjDef.get(0)).val(actualDay);
			return true;
		}
		
		$("input[fmtDay]",li).each(function(i){
			var objId = $(this).attr("id");
			var objVal = $(this).val();
			if(parseFloat(objVal)==0 || parseFloat(objVal)==1){
				objVal = objVal.replace(/(\d)\.0+$/,"$1");
				this.value = objVal;
			}
			if(objId.indexOf("actualDay")!=-1){
				$("input",typeObjDef.get(0)).val(objVal);
				return true;
			}
			
			if(parseFloat(objVal)>0){
				var defVal = $("input",typeObjDef.get(0)).val();
				if(parseFloat(defVal)==0){
					//如果实际考勤为0 则不显示
					$("input",typeObjDef.get(0)).val(objVal);
					$("select",typeObjDef.get(0)).val(objId.substring(0,objId.indexOf("_")));
					return true;
				}
				var typeCloneObj = typeObjDef.clone(true,true);
				$("a",typeCloneObj.get(0)).removeClass("linkadd").addClass("linkminus").unbind("click").bind("click",delAttendanceType);
				$("select",typeCloneObj.get(0)).val(objId.substring(0,objId.indexOf("_")));
				$("input",typeCloneObj.get(0)).val(objVal);
				typeCloneObj.appendTo($(".kq-box01",li));
			}
		});
	});
}

function delAttendanceType(){
	var defTypeObj = $("input",$("p",this.parentNode.parentNode).get(0)).get(0);
	$(this).parent("p").remove();
	checkInputValue(defTypeObj);
}

//添加考勤类型
function addAttendanceType(typeObj){
	var typeCloneObj = $(typeObj).parent("p").clone(true,true);
	$("a",typeCloneObj.get(0)).removeClass("linkadd").addClass("linkminus").unbind("click").bind("click",delAttendanceType);
	$("select option",typeCloneObj).each(function(i){
		var selectFlag = false;
		var optVal = this.value;
		$("select",typeObj.parentNode.parentNode).each(function(k){
			if($(this).val()==optVal){
				selectFlag = true ;//已存在考勤类型
				return false ;
			}
		});
		
		if(!selectFlag){
			this.selected  = true ;
			return false;
		}
		
	});
	$("input",typeCloneObj.get(0)).val('0');
	
	typeCloneObj.appendTo($(typeObj.parentNode.parentNode));
}

//校验考勤类型  一个人同一天的考勤类型不能重复
function checkAttendanceType(typeObj){
	    var selectFlag = false;
	    var types = {};
		$("select",typeObj.parentNode.parentNode).each(function(k){
			var optVal = $(this).val();
			if(types[optVal]){
			    //已存在考勤类型
				art.dialog.tips("考勤类型不能重复！");
				chkAttendanceType(typeObj);
				//$("input",typeObj.parentNode).focus();
				return false ;
			}else{
				types[optVal] = optVal;
			}
		});
	
	//$("input",typeObj.get(0)).val('0');
	
}

//设置默认 考勤类型。同一个人考勤类型不重复
function chkAttendanceType(typeObj){
	
	$("option",typeObj).each(function(i){
		var selectFlag = false;
		var optVal = this.value;
		$("select",typeObj.parentNode.parentNode).each(function(k){
			if($(this).val()==optVal){
				selectFlag = true ;//已存在考勤类型
				return false ;
			}
		});
		
		if(!selectFlag){
			this.selected  = true ;
			return false;
		}
		
	});
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
	$("#detailList input").each(function(i){
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
	if(!value || isNaN(value)){
		obj.value = '0';
		checkInputValue(obj);
		return ;
	}else{
		value = value.substring(0,4);//最多输入两位小数
		obj.value = value;
		value = parseFloat(value);
		var trObj = $(obj.parentNode.parentNode) ;
		var repeatFlag = false;
		var types = {};
		var actualDayObj ;//实际考勤
		$("select",obj.parentNode.parentNode).each(function(k){
			var optVal = $(this).val();
			if(types[optVal]){
			    //已存在考勤类型
				art.dialog.tips("考勤类型不能重复！");
				repeatFlag = true;
				obj.focus();
				return false ;
			}else{
				types[optVal] = optVal;
			}
			if(optVal=='actualDay'){
				actualDayObj = $("input",$(this).parent("p").get(0));
			}
		});
		if(repeatFlag){
			//考勤类型重复
			return ;
		}
		
		if(parseFloat(value) >= 1){
			//有fmtDay属性的 为考勤项
			$("input[fmtDay!='1']",obj.parentNode.parentNode).each(function(){
				this.value= "0" ; 
			});//大于1时 其它考勤项设为0
			obj.value = '1';//大于1时  本考勤项设为1
		}else{
			 
			var total = 0 ;//所有考勤项的和
			$("input[fmtDay!='1']",obj.parentNode.parentNode).each(function(){
				total += parseFloat(this.value);
			});
			
			if(total==1){
				//录入正确
				return ;
			}
			
			var actualDay = 0;
			if(actualDayObj){
				actualDay = parseFloat(actualDayObj.val());
			}
			//保证  实际考勤+其它(除实际考勤)考勤项 = 1
			var result = 1;
			result =  1 - (total-actualDay);
			if(result < 0){
				//如果  其它(除实际考勤)考勤项 大于 1
				//把正在修改的考勤项设为0 ,实际考勤= (1 - 其它(除实际考勤)考勤项) 
				result = (1 - (total - value - actualDay ));
				obj.value = "0" ;
			}
			
			if(!actualDayObj){
				//如果其它(除实际考勤)考勤项不等于 1  且实际考勤没有考勤项
				var typeCloneObj = $(obj).parent("p").clone(true,true);
				$("a",typeCloneObj.get(0)).removeClass("linkadd").addClass("linkminus").unbind("click").bind("click",delAttendanceType);
				$("select",typeCloneObj.get(0)).val("actualDay");
				typeCloneObj.appendTo($(obj.parentNode.parentNode));
				actualDayObj = $("input",typeCloneObj.get(0));
			}
			//实际考勤= (1 - 其它(除实际考勤)考勤项) 
			actualDayObj.val(result.toFixed(3));
		}
	}
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
	var repeatFlag = false;
	$("#detailList li[id^='detail_']").each(function(n,tr){
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
		 detail["leaveEarly"] = $("input[id^='leaveEarly']",tr).val();
		 detail["remark"] = $("input[id^='remark']",tr).val();
		 
		 $("select",tr).each(function(k){
				var optVal = $(this).val();
				if(detail[optVal]){
				    //已存在考勤类型
					art.dialog.tips("考勤类型不能重复！");
					repeatFlag = true;
					obj.focus();
					return false ;
				}else{
					detail[optVal] = $("input",this.parentNode).val();
				}
				 
			});
		 
		 if(repeatFlag){
			 //考勤类型重复
			 return false;
		 }
		 details.push(detail);
	});
	if(repeatFlag){
		 //考勤类型重复
		$("#btnSaveEntry").show();
		 return false;
	 }
	$("#detailsJSON").val(JSON.stringify(details));
	
	if(details.length<1){
		art.dialog.tips("没有可保存的数据!");
		$("#btnSaveEntry").show();
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