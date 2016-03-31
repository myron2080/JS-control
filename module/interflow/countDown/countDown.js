
function setDateStr(){
	$("#endDateStr").val($("#endDate").val());
}

function submitForm(){
	if(!contentEditor.getContentTxt()){
		$("#contentStr").show();
		flag = false;
		return ;
	}else{
		$("#contentStr").hide();
	}
	 
	$.post($('form').attr('action'),$('form').serialize(),function(res){
		if(res.STATE == "SUCCESS"){
			art.dialog({icon: 'succeed', time: 1,content: "保存成功!"});
			setTimeout(function(){art.dialog.close();},1000);	
		}else{
			art.dialog.tips("保存失败");
		}
    },'json');
}


var countStartTimeOut ;

function initStartEvent(){
	var startFag = $("#startFag").val();
	if("N"==startFag){
		//默认 暂停
		$("#operateBtn").toggle(function(){
			//开始
			countStartTimeOut = setTimeout(countDownStart,0);
			$("a",this).text('暂停');
			updateStatus("Y");
		},function(){
			//暂停
			clearTimeout(countStartTimeOut);
			initTime();
			$("a",this).text('开始');
			updateStatus("N");
		});
	}else{
		//默认 开始
		countStartTimeOut = setTimeout(countDownStart,0); 
		$("#operateBtn a").text('暂停');
		
		$("#operateBtn").toggle(function(){
			//暂停
			clearTimeout(countStartTimeOut);
			initTime();
			$("a",this).text('开始');
			updateStatus("N");
		},function(){
			
			//开始
			countStartTimeOut = setTimeout(countDownStart,0);
			$("a",this).text('暂停');
			updateStatus("Y");
		});
	}
}

function updateStatus(startFag){
	$.post(getPath()+"/interflow/countDown/updateStatus",{id:$("#id").val(),startFag:startFag},function(res){
		if(res.STATE == "SUCCESS"){
			
		}else{
			art.dialog.tips(res.MSG);
		}
	},'json');
}

function initTime(){
	$("#daysTr td:eq(0)").text('0');
	$("#daysTr td:eq(1)").text('0');
	$("#daysTr td:eq(2)").text('0');
	$("#hoursTr td:eq(0)").text('0');
	$("#hoursTr td:eq(1)").text('0');
	$("#minsTr td:eq(0)").text('0');
	$("#minsTr td:eq(1)").text('0');
	$("#secsTr td:eq(0)").text('0');
	$("#secsTr td:eq(1)").text('0');
}
 
function countDownStart(){
	var endDateStr = $("#endDateStr").val();
	var endDateTime = getDateFromFormat(endDateStr,'yyyy-MM-dd HH:mm:ss');
	var nowDate = new Date();
	var nowDateTime = nowDate.getTime();
	var diffTime = endDateTime - nowDateTime;//冲刺截止时间 - 当前时间
	if(diffTime<=0){
		initTime();
		return ;
	}
	var diffDays = parseInt(diffTime/(1000*60*60*24));
	var diffHours = parseInt((diffTime-diffDays*(1000*60*60*24))/(1000*60*60));
	var diffMins = parseInt((diffTime-diffDays*(1000*60*60*24)-diffHours*(1000*60*60))/(1000*60));
	var diffSecs = parseInt((diffTime-diffDays*(1000*60*60*24)-diffHours*(1000*60*60)-diffMins*(1000*60))/1000);
	var diffDaysStr = prefisNum(diffDays,3);
	var diffHoursStr = prefisNum(diffHours,2);
	var diffMinsStr = prefisNum(diffMins,2);
	var diffSecsStr = prefisNum(diffSecs,2);
	
	$("#daysTr td:eq(0)").text(diffDaysStr.substring(0,1));
	$("#daysTr td:eq(1)").text(diffDaysStr.substring(1,2));
	$("#daysTr td:eq(2)").text(diffDaysStr.substring(2,3));
	$("#hoursTr td:eq(0)").text(diffHoursStr.substring(0,1));
	$("#hoursTr td:eq(1)").text(diffHoursStr.substring(1,2));
	$("#minsTr td:eq(0)").text(diffMinsStr.substring(0,1));
	$("#minsTr td:eq(1)").text(diffMinsStr.substring(1,2));
	$("#secsTr td:eq(0)").text(diffSecsStr.substring(0,1));
	$("#secsTr td:eq(1)").text(diffSecsStr.substring(1,2));
	countStartTimeOut = setTimeout(countDownStart,1000);
}

function prefisNum(num,c){
	var numStr = num+"";
	var lessNum = c-numStr.length;
	if(lessNum>0){
		
		for(var i=0;i<lessNum;i++){
			numStr = "0"+numStr;
		}
	}
	return numStr;
}
