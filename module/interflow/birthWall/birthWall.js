function initBirthWallData(){
	
	$.post(getPath()+"/interflow/bill/toBirthWall",{},function(data){
		 
		$("#birthWallDiv").html(data);
		personPop.init();
		 
	},'html');
}
  
/**
 * 设置生日
 */
saveBirth = function(){
	var calendarType  = $("#calendarType").val();
	var birthdayEn  = $("#birthdayEn").val();
	var birthdayCn  = $("#birthdayCn").val();
	var id = $("#personId").val();
	if(!calendarType){
		art.dialog.tips('请选择生日类型！');
		return ;
	}
	if(calendarType=="solar" && !birthdayCn){
		art.dialog.tips('请选择生日日期！');
		return ;
	} 
	
	if(calendarType=="lunar" && !birthdayEn){
		art.dialog.tips('请选择生日日期！');
		return
	}
	 
	$.post(getPath()+"/basedata/person/saveBirth",{personId:id,calendarType:calendarType,birthdayEn:birthdayEn,birthdayCn:birthdayCn },function(data){
		if(data.STATE=='SUCCESS'){
			art.dialog.tips("生日设置成功!",null,"succeed");
			initBirthWallData(); 
		}else{
			art.dialog.alert('生日设置失败！');
		}
	},'json');
	
}


//选择生日类型
function checkCalendarType(disId,hidId,typeValue){
	$("#"+disId).show();
	$("#"+hidId).hide();
	$("#calendarType").val(typeValue);
}


/**
 * 日期选择函数 
 */
function onSelectedFun(englishDateId,chineseDateId,englishDate,chineseSimpleDate){
	$("#birthdayEn").val(englishDate);
	$("#birthdayCn").val(chineseSimpleDate);
	
}


/**
 * 发短信
 */

var detailMessage;
function sendMessage(id){
	if(null != top){
		detailMessage=top.$.ligerDialog.open({height:460,
			width:660,
			url: getPath()+"/cmct/note/topicMessage?personId="+id,
			title:"发送短信",
			isResize:true,
			isDrag:true});
	}else{
		detailMessage=$.ligerDialog.open({height:460,
			width:660,
			url: getPath()+"/cmct/note/topicMessage?personId="+id,
			title:"发送短信",
			isResize:true,
			isDrag:true});
	}
	
}

function closeDetailMessage(){
	detailMessage.close();
}

