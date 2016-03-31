$list_editUrl = getPath()+"/hr/attendance/entryOne";//编辑及查看url
$list_dataType = "考勤";
$list_editWidth =650;
$list_editHeight = 300;
var manager, g;
$(document).ready(function(){
	
	/***************************data Panel***************************/
	g =  manager = $list_dataGrid = $("#tableContainer").ligerGrid($.extend($list_defaultGridParam,{
		//headerRowHeight:34,
        columns: [ 
            {display: '部门', name: 'orgName', align: 'left', width: 80},
            {display: '名称', name: 'personName', align: 'left', width: 60},
            {display: '员工编号', name: 'personNumber', align: 'left', width: 60},
            {display: '应出勤', name: 'attendanceDays', align: 'left', width: 40},
            {display: '未出勤', name: 'noEntry', align: 'left', width: 40},
            {display: '实出勤', name: 'actualDay', align: 'left', width: 40},
            {display: '休息', name: 'restDays', align: 'left', width: 34},
            {display: '事假', name: 'compassionateLeave', align: 'left', width: 34},
            {display: '病假', name: 'sickLeave', align: 'left', width: 34},
            {display: '年假', name: 'annualLeave', align: 'left', width: 34},
            {display: '婚假', name: 'marriageLeave', align: 'left', width: 34},
            {display: '丧假', name: 'bereavementLeave', align: 'left', width: 34},
            {display: '计生假', name: 'IPPFLeave', align: 'left', width: 50},
            {display: '旷工', name: 'skipWorkLeave', align: 'left', width: 34},
            {display: '其它假期', name: 'otherHolidays', align: 'left', width: 50},
            {display: '迟到/早退', name: 'leaveEarly', align: 'left', width: 60}
        ],
        fixedCellHeight:false,
        isScroll: true,
        frozen:false,
        checkbox:true,
        frozenCheckbox: true,
        checkboxColWidth: 25,
        rownumbers:false,
        delayLoad:true,
        height: '99%',
        usePager:true,
        url:getPath()+'/hr/attendance/queryMonthByCond',
        frozenDetail :false,
        detail: { onShowDetail: queryAttendanceDetails },
		onDblClickRow:function(){}		
    }));
	searchData();
	bindEvent();
});

//显示考勤明细
function queryAttendanceDetails(row, detailPanel,callback)
{
 
    var grid = document.createElement('div'); 
    var parm = [{"personId":row.personId,"period":row.period}]; 
    $(detailPanel).append(grid);
    var ligerGridObj =  $(grid).css('margin',10).ligerGrid($.extend($list_defaultGridParam,{
        columns:[
	            {display: '名称', name: 'personName', align: 'left', width: 60,resizable:false},
	            {display: '考勤日期', name: 'recordDate', align: 'left', width: 80,dateFormat:"yyyy-MM-dd",formatters:"date",resizable:false},
	            {display: '实出勤', name: 'actualDay', align: 'left', width: 60,resizable:false},
	            {display: '休息', name: 'restDays', align: 'left', width: 34,resizable:false},
	            {display: '事假', name: 'compassionateLeave', align: 'left', width: 34,resizable:false},
	            {display: '病假', name: 'sickLeave', align: 'left', width: 34,resizable:false},
	            {display: '年假', name: 'annualLeave', align: 'left', width: 34,resizable:false},
	            {display: '婚假', name: 'marriageLeave', align: 'left', width: 34,resizable:false},
	            {display: '丧假', name: 'bereavementLeave', align: 'left', width: 34,resizable:false},
	            {display: '计生假', name: 'IPPFLeave', align: 'left', width: 50,resizable:false},
	            {display: '旷工', name: 'skipWorkLeave', align: 'left', width: 34,resizable:false},
	            {display: '其它假期', name: 'otherHolidays', align: 'left', width: 50,resizable:false},
	            {display: '未入职', name: 'noEntry', align: 'left', width: 41,resizable:false},
	            {display: '迟到/早退', name: 'leaveEarly', align: 'left', width: 60,resizable:false},
	            {display: '备注', name: 'remark', align: 'left', width: 85,resizable:false}
                ], 
         showToggleColBtn: false,
         width: '98%', 
         usePager:false,
         parms:{"personId":row.personId,"period":row.period},
         url:getPath()+'/hr/attendance/queryAttendanceDetails',
         showTitle: false,
         onAfterShowData: afterShowData,
         onDblClickRow:function(rowData,rowIndex,rowDomElement){
         	//viewRow(rowData);
         },
         isScroll: false,
         checkbox:false,
         frozen:false,
         detail: {   },
         allowAdjustColWidth:false,
         resizable:false,
         delayLoad:true
    }));
    
    ligerGridObj.loadData();
}

function operateRender(data,filterData){
	var operateStr = "";  
	if((data.approvalState=="SAVE" || data.approvalState=="REJECT")){
		operateStr = '<a href="javascript:editRow({id:\''+data.id+'\',type:\''+data.type+'\'});" class="modify_font">编辑</a>';
	}
	return operateStr;
}

function afterShowData(data){
	$(".l-grid-detailpanel-inner").css("height","");
}
function bindEvent(){
	
	//查询按钮
	$("#searchBtn").bind("click",function(){
		searchData();
	});
	
	//清空
	$("#resetBtn").click(function(){
		clearDataPicker('orgF7');
		$("#keyConditions").val($("#keyConditions").attr("defaultValue"));
		$("#orgName").val($("#orgName").attr("defaultValue"));
		$("#orgId").val($("#orgId").attr("defaultValue"));
		$("#orgLongNum").val($("#orgLongNum").attr("defaultValue"));
	});
	
	eventFun($("#keyConditions"));
}

/**
 * 修改 考勤信息状态
 * @param approveType
 */
function updateAttendanceState(approveType){
	var attendanceJSON = manager.getSelectedRows();
	var attendanceArray = [];
	
	for(var i in attendanceJSON){
		if(("SUBMIT"==approveType && (attendanceJSON[i].approvalState == 'SAVE' || attendanceJSON[i].approvalState == 'REJECT'))
				|| (("APPROVED" ==approveType || "REJECT"==approveType ) && attendanceJSON[i].approvalState == 'SUBMIT')
				||("BACKAPPROVED"==approveType && attendanceJSON[i].approvalState == 'APPROVED')){
			var attendance = {};
			attendance.personId = attendanceJSON[i].personId;
			attendance.period = attendanceJSON[i].period;
			attendanceArray.push(attendance);
		}
	};
	var tipTitle = "提交";
	if("SUBMIT"==approveType){
		
	}else if("REJECT"==approveType){
		tipTitle = "驳回";
	}else if("APPROVED"==approveType){
		tipTitle = "审核";
	}
	if(!attendanceArray || attendanceArray.length<1){
		art.dialog.tips("没有需要"+tipTitle+"的数据！！");
		return ;
	}
	var approvalRemark = $('#approvalRemark').val();
	 
	art.dialog.confirm("是否确认"+tipTitle+"所选考勤？",function(){
		$.post(getPath()+"/hr/attendance/updateAttendanceState",{attendanceArray:JSON.stringify(attendanceArray),approveType:approveType,approvalRemark:approvalRemark},
		  function(data){
			if(data.counter > 0){
				art.dialog({
					icon: 'succeed',
				    time: 1,
				    content: "操作成功！"
				});
				setTimeout(function(){art.dialog.close();},1000);
				resetList();
			} else {
				art.dialog.tips("没有需要审核的数据！！");
			}
		},'json');
	});
}

/**
 * 导出Excel
 */ 
function exportMonthByCond(){
	var param = "";
	var period = $('#period').val();
	if(!period){
		art.dialog.tips("请选择日期!");
		return ;
	}
	if(period){
		param += "&period="+period;
	} 
	//关键字条件 [员工编号/姓名/职位/职级]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		param += "&keyConditions="+keyConditions;
	}
	var orgLongNum = $('#orgLongNum').val();
	if(orgLongNum){
		param += "&orgLongNum="+orgLongNum;
	} 
	 
	var url = getPath()+"/hr/attendance/exportMonthByCond?tmp="+new Date().getTime() + "&" + param;
	var frame = $('#downLoadFile');
	frame.attr('src',url);
}

function searchData(){
	$list_dataParam['fromPage'] = 'queryPortlet';
	var period = $('#period').val();
	if(!period){
		art.dialog.tips("请选择日期!");
		return ;
	}
	if(period){
		$list_dataParam['period'] = period;
	}else{
		delete $list_dataParam['period'];
	}
	//关键字条件 [员工编号/姓名/职位/职级]
	var keyConditions = $('#keyConditions').val();
	if(keyConditions && ($('#keyConditions').attr("defaultValue") != keyConditions)){
		$list_dataParam['keyConditions'] = keyConditions;
	}else{
		delete $list_dataParam['keyConditions'];
	}
	var orgLongNum = $('#orgLongNum').val();
	if(orgLongNum){
		$list_dataParam['orgLongNum'] = orgLongNum;
	}else{
		delete $list_dataParam['orgLongNum'];
	}
	resetList();
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
	if(type == 'up'){//上一月
		if(m == 1){
			year=(y-1)+"";
			month="12";
		}else{
			year=y+"";
			if(m <11){//月份 需加0
				month="0"+(m-1);
			}else{
				month=(m-1)+"";
			}
		}
		$("#period").val(year+"-"+month);
		$("#orgLongNum").val('');
	}else if(type == 'down'){//下一月
		if(m == 12){
			year=(y+1)+"";
			month="01";
		}else{
			year=y+"";
			if(m <9){//月份 需加0
				month="0"+(m+1);
			}else{
				month=(m+1)+"";
			}
		}
		if((year+"-"+month)>formatDate(new Date(),'yyyy-MM').trim()){
			art.dialog.tips("只能查询当前月以前的考勤");
			return ;
		}
		$("#period").val(year+"-"+month);
		$("#orgLongNum").val('');
	} 
	
	var dataPickerUrl=getPath()+"/basedata/org/orgHisDataPicker?isLastDay=Y&period="+$("#period").val()+"&longNumber="+$("#currentOrgLongNumber").val();
	$("#orgF7").attr("dataPickerUrl",dataPickerUrl)	
	searchData();
}

function changeOrg(oldValue,newValue,doc){
	$("#orgLongNum").val(newValue.longNumber||'');
	//searchData();
}